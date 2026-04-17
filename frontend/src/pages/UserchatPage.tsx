import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "sonner";
import {
  Send,
  X,
  Loader2,
  MessageCircle,
  Bot,
  UserCircle2,
  ShieldCheck,
  ChevronDown,
  CheckCheck,
  Paperclip,
  ArrowDown,
} from "lucide-react";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: "USER" | "ADMIN" | "BOT";
  type: "TEXT" | "IMAGE" | "VIDEO" | "SYSTEM";
  content: string;
  mediaUrl?: string | null;
  thumbnailUrl?: string | null;
  mimeType?: string | null;
  mediaSize?: number | null;
  isDeleted: boolean;
  metadata?: {
    intent?: string;
    confidence?: number;
    isBotResponse?: boolean;
    botFallback?: boolean;
    quickReplies?: string[];
  };
  createdAt: string;
}

interface Conversation {
  id: string;
  userId: string;
  adminId?: string | null;
  status: "WAITING" | "ACTIVE" | "BOT_ONLY" | "CLOSED";
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  botEnabled: boolean;
  handoffToAdmin: boolean;
  userDisplayName?: string;
  userAvatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const API_BASE = `${BASE_URL}/api/chat`;
// SockJS KHÔNG dùng ws:// — nó tự nâng cấp WebSocket nội bộ từ http://
// Giữ nguyên http:// (hoặc https://), SockJS sẽ tự connect qua /ws endpoint
const WS_URL = `${BASE_URL}/ws`;
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Hôm nay";
  if (d.toDateString() === yesterday.toDateString()) return "Hôm qua";
  return d.toLocaleDateString("vi-VN");
};

const groupByDate = (messages: Message[]) => {
  const groups: { date: string; messages: Message[] }[] = [];
  let currentDate = "";
  messages.forEach((msg) => {
    const date = formatDate(msg.createdAt);
    if (date !== currentDate) {
      currentDate = date;
      groups.push({ date, messages: [msg] });
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  });
  return groups;
};

interface UserChatPageProps {
  isWidgetOpen?: boolean; // ChatWidget truyền vào để biết widget đang mở không
  onNewAdminMessage?: () => void; // Callback khi admin/bot gửi tin mới
}

const UserChatPage: React.FC<UserChatPageProps> = ({
  isWidgetOpen = true,
  onNewAdminMessage,
}) => {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();

  const currentSubRef = useRef<{ unsubscribe: () => void } | null>(null);

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);
  // ✅ Notification tin nhắn mới từ admin/bot
  const [newMessageNotif, setNewMessageNotif] = useState<string | null>(null);
  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const tokenRef = useRef<string>("");
  const convIdRef = useRef<string>("");
  const initCalledRef = useRef(false);

  const isAtBottom = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
    });
  }, []);

  // ✅ Hiện notification khi có tin nhắn mới từ admin/bot và user không ở cuối
  const showNewMessageNotif = useCallback((content: string) => {
    setNewMessageNotif(content);
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    notifTimerRef.current = setTimeout(() => {
      setNewMessageNotif(null);
    }, 4000);
  }, []);

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollBtn(!atBottom);
    if (atBottom) setNewMessageNotif(null);
  };

  const connectWebSocket = useCallback(
    (convId: string, token: string) => {
      if (stompClientRef.current?.connected) return;

      const client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("✅ STOMP Connected successfully!");
          client.subscribe(`/topic/conversation.${convId}`, (frame) => {
            try {
              const incoming = JSON.parse(frame.body);
              if (
                incoming.status !== undefined &&
                incoming.userId !== undefined
              ) {
                setConversation((prev) =>
                  prev ? { ...prev, ...incoming } : prev,
                );
                return;
              }

              setMessages((prev) => {
                // 1. Nếu đã có tin nhắn thật với ID này, thì bỏ qua
                const isDup = prev.some(
                  (m) => m.id === incoming.id && !m.id.startsWith("temp_"),
                );
                if (isDup) return prev;

                // 2. Tìm và chèn đè đúng 1 tin nhắn temp (optimistic) khớp nhất
                let wasReplaced = false;
                const replaced = prev.map((m) => {
                  if (
                    !wasReplaced &&
                    m.id.startsWith("temp_") &&
                    m.senderRole === incoming.senderRole
                  ) {
                    const isMediaMatch =
                      (incoming.type === "IMAGE" ||
                        incoming.type === "VIDEO") &&
                      m.mediaUrl &&
                      incoming.mediaUrl &&
                      m.mediaUrl === incoming.mediaUrl;

                    const isTextMatch =
                      incoming.type === "TEXT" &&
                      m.content === incoming.content;

                    if (isMediaMatch || isTextMatch) {
                      wasReplaced = true;
                      return incoming;
                    }
                  }
                  return m;
                });

                return wasReplaced ? replaced : [...prev, incoming];
              });

              // ✅ Nếu là tin nhắn từ admin/bot, gọi callback để ChatWidget hiển badge
              if (incoming.senderRole !== "USER") {
                onNewAdminMessage?.();
              }

              // ✅ Nếu là tin nhắn từ admin/bot và user đang scroll lên → hiện notification
              if (
                incoming.senderRole !== "USER" &&
                incoming.type === "TEXT" &&
                !isAtBottom()
              ) {
                const preview =
                  incoming.senderRole === "BOT"
                    ? `🤖 ${incoming.content.slice(0, 50)}${incoming.content.length > 50 ? "..." : ""}`
                    : `💬 ${incoming.content.slice(0, 50)}${incoming.content.length > 50 ? "..." : ""}`;
                showNewMessageNotif(preview);
              } else {
                setTimeout(() => scrollToBottom(), 50);
              }
            } catch (e) {
              console.error("Parse WS message error:", e);
            }
          });
        },
        onDisconnect: () => {},
        onStompError: (frame) =>
          console.error("STOMP error:", frame.headers["message"]),
      });

      client.activate();
      stompClientRef.current = client;
    },
    [scrollToBottom, isAtBottom, showNewMessageNotif],
  );

  // ✅ FIX: Tạo conversation lazily — chỉ tạo khi cần (khi user send tin đầu tiên)
  // const ensureConversation = useCallback(async (firstText?: string): Promise<Conversation | null> => {
  //   const token = tokenRef.current;
  //   if (!token) return null;

  //   // Nếu đã có conversation rồi thì dùng luôn
  //   if (conversation) return conversation;

  //   const displayName =
  //     clerkUser?.fullName ||
  //     [clerkUser?.firstName, clerkUser?.lastName]
  //       .filter(Boolean)
  //       .join(" ") ||
  //     clerkUser?.username ||
  //     "Khách hàng";

  //   try {
  //     const res = await axios.post(
  //       `${API_BASE}/conversations`,
  //       {
  //         firstMessage: firstText || null, // Gửi trực tiếp tin nhắn đầu qua Backend POST
  //         userDisplayName: displayName,
  //         userAvatarUrl: clerkUser?.imageUrl || null,
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );
  //     const newConv: Conversation = res.data;
  //     setConversation(newConv);
  //     convIdRef.current = newConv.id;

  //     // ✅ Fetch ngay danh sách tin nhắn để lấy tin đầu tiên vừa tạo (nếu có) từ DB
  //     const msgRes = await axios.get(
  //       `${API_BASE}/messages/${newConv.id}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     setMessages(Array.isArray(msgRes.data) ? msgRes.data : []);
  //     setTimeout(() => scrollToBottom(false), 100);

  //     // Kết nối WebSocket cho conversation mới
  //     connectWebSocket(newConv.id, token);
  //     return newConv;
  //   } catch (err) {
  //     console.error("Tạo conversation thất bại:", err);
  //     return null;
  //   }
  // }, [conversation, clerkUser, connectWebSocket, scrollToBottom]);
  // Tách riêng logic subscribe để reuse
  const subscribeConv = useCallback(
    (convId: string) => {
      // Unsubscribe kênh cũ nếu có
      if (currentSubRef.current) {
        currentSubRef.current.unsubscribe();
        currentSubRef.current = null;
      }

      const sub = stompClientRef.current?.subscribe(
        `/topic/conversation.${convId}`,
        (frame) => {
          try {
            const incoming = JSON.parse(frame.body);

            // Nếu là ConversationResponse (có status + userId) → cập nhật conversation
            if (
              incoming.status !== undefined &&
              incoming.userId !== undefined
            ) {
              setConversation((prev) =>
                prev ? { ...prev, ...incoming } : prev,
              );
              return;
            }

            // Là tin nhắn → xử lý dedup + thêm vào danh sách
            setMessages((prev) => {
              // 1. Nếu đã có tin nhắn thật với ID này, bỏ qua
              const isDup = prev.some(
                (m) => m.id === incoming.id && !m.id.startsWith("temp_"),
              );
              if (isDup) return prev;

              // 2. Thay thế đúng 1 tin nhắn temp (optimistic) khớp nhất
              let wasReplaced = false;
              const replaced = prev.map((m) => {
                if (
                  !wasReplaced &&
                  m.id.startsWith("temp_") &&
                  m.senderRole === incoming.senderRole
                ) {
                  const isMediaMatch =
                    (incoming.type === "IMAGE" || incoming.type === "VIDEO") &&
                    m.mediaUrl &&
                    incoming.mediaUrl &&
                    m.mediaUrl === incoming.mediaUrl;

                  const isTextMatch =
                    incoming.type === "TEXT" && m.content === incoming.content;

                  if (isMediaMatch || isTextMatch) {
                    wasReplaced = true;
                    return incoming;
                  }
                }
                return m;
              });

              return wasReplaced ? replaced : [...prev, incoming];
            });

            // Nếu là tin nhắn từ admin/bot → gọi callback badge
            if (incoming.senderRole !== "USER") {
              onNewAdminMessage?.();
            }

            // Nếu admin/bot gửi và user đang scroll lên → hiện notification
            if (
              incoming.senderRole !== "USER" &&
              incoming.type === "TEXT" &&
              !isAtBottom()
            ) {
              const prefix = incoming.senderRole === "BOT" ? "🤖" : "💬";
              const preview = `${prefix} ${incoming.content.slice(0, 50)}${
                incoming.content.length > 50 ? "..." : ""
              }`;
              showNewMessageNotif(preview);
            } else {
              setTimeout(() => scrollToBottom(), 50);
            }
          } catch (e) {
            console.error("Parse WS message error:", e);
          }
        },
      );

      currentSubRef.current = sub ?? null;
    },
    [isAtBottom, onNewAdminMessage, scrollToBottom, showNewMessageNotif],
  );

  // Connect WS và chờ đến khi đã subscribe xong mới resolve
  const connectWebSocketAndWait = useCallback(
    (convId: string, token: string): Promise<void> => {
      return new Promise((resolve) => {
        // Nếu đã connected rồi → subscribe ngay và resolve
        if (stompClientRef.current?.connected) {
          subscribeConv(convId);
          resolve();
          return;
        }

        // Nếu client đang tồn tại nhưng chưa connected → deactivate trước
        if (stompClientRef.current) {
          stompClientRef.current.deactivate();
          stompClientRef.current = null;
        }

        const client = new Client({
          webSocketFactory: () => new SockJS(WS_URL),
          connectHeaders: { Authorization: `Bearer ${token}` },
          reconnectDelay: 5000,

          onConnect: () => {
            console.log("✅ STOMP Connected (connectWebSocketAndWait)");
            subscribeConv(convId);
            resolve(); // ✅ Chỉ resolve sau khi đã subscribe xong
          },

          onDisconnect: () => {
            console.log("🔌 STOMP Disconnected");
          },

          onStompError: (frame) => {
            console.error("STOMP error:", frame.headers["message"]);
            resolve(); // resolve anyway để không block UI
          },
        });

        client.activate();
        stompClientRef.current = client;
      });
    },
    [subscribeConv],
  );
  //fix AI
  const ensureConversation = useCallback(
    async (firstText?: string): Promise<Conversation | null> => {
      const token = tokenRef.current;
      if (!token) return null;
      if (conversation) return conversation;

      const displayName =
        clerkUser?.fullName || clerkUser?.username || "Khách hàng";

      try {
        const res = await axios.post(
          `${API_BASE}/conversations`,
          {
            firstMessage: firstText || null,
            userDisplayName: displayName,
            userAvatarUrl: clerkUser?.imageUrl || null,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const newConv: Conversation = res.data;
        setConversation(newConv);
        convIdRef.current = newConv.id;

        // ✅ Connect WS TRƯỚC, subscribe TRƯỚC, rồi mới fetch messages
        await connectWebSocketAndWait(newConv.id, token);

        // Sau khi đã subscribe xong mới fetch — lúc này bot message đã được cache bởi sub
        const msgRes = await axios.get(`${API_BASE}/messages/${newConv.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(Array.isArray(msgRes.data) ? msgRes.data : []);
        setTimeout(() => scrollToBottom(false), 100);

        return newConv;
      } catch (err) {
        console.error("Tạo conversation thất bại:", err);
        return null;
      }
    },
    [conversation, clerkUser, scrollToBottom],
  );
  useEffect(() => {
    if (!isUserLoaded) return;
    if (initCalledRef.current) return;
    initCalledRef.current = true;

    const init = async () => {
      try {
        const token = await getToken({ template: "my-backend" });
        if (!token) return;
        tokenRef.current = token;

        // ✅ Chỉ FETCH conversation cũ, KHÔNG tạo mới tự động
        const convRes = await axios.get(`${API_BASE}/conversations/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const convList: Conversation[] = Array.isArray(convRes.data)
          ? convRes.data
          : [];
        const openConv = convList.find(
          (c) => c.status === "WAITING" || c.status === "ACTIVE",
        );

        if (openConv) {
          // Có conversation cũ → load tin nhắn và kết nối WS
          setConversation(openConv);
          convIdRef.current = openConv.id;

          const msgRes = await axios.get(
            `${API_BASE}/messages/${openConv.id}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setMessages(Array.isArray(msgRes.data) ? msgRes.data : []);
          setTimeout(() => scrollToBottom(false), 100);
          connectWebSocket(openConv.id, token);
        }
        // ✅ Không có conversation cũ → KHÔNG tạo mới, chờ user gửi tin
      } catch (err) {
        console.error("Init chat error:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
    return () => {
      stompClientRef.current?.deactivate();
      if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    };
  }, [isUserLoaded]);

  useEffect(() => {
    if (messages.length > 0) {
      const el = messagesContainerRef.current;
      if (!el) return;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 300)
        scrollToBottom();
    }
  }, [messages]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    const newHeight = Math.min(ta.scrollHeight, 70);
    ta.style.height = newHeight + "px";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      toast.error("Chỉ hỗ trợ ảnh và video!");
      return;
    }
    if (isImage && file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB");
      return;
    }
    if (isVideo && file.size > 50 * 1024 * 1024) {
      toast.error("Video không được vượt quá 50MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!messageId || sending) return;
    const message = messages.find((m) => m.id === messageId);
    if (!message || message.senderId !== clerkUser?.id) return;
    try {
      const token = tokenRef.current;
      if (!token) return;
      await axios.delete(`${API_BASE}/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setShowDeleteMenu(null);
    } catch (err) {
      toast.error("Không thể xóa tin nhắn lúc này.");
    }
  };

  const handleSend = async () => {
    if ((!text.trim() && !imageFile) || sending) return;

    setSending(true);
    let activeConv = conversation;
    const msgText = text.trim();
    let isFirstTextMessage = false;

    // ✅ Nếu chưa có conversation, tạo mới và gửi LUÔN đoạn text đó vào HTTP
    if (!activeConv) {
      activeConv = await ensureConversation(msgText);
      if (!activeConv) {
        setSending(false);
        toast.error("Không thể bắt đầu hội thoại. Vui lòng thử lại.");
        return;
      }
      isFirstTextMessage = !!msgText; // Đã đẩy nội dung qua HTTP POST

      // Xóa text trên giao diện luôn
      if (isFirstTextMessage) {
        setText("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
      }
    }

    if (activeConv.status === "CLOSED") {
      setSending(false);
      return;
    }

    const token = tokenRef.current;
    const convId = activeConv.id;

    try {
      // 1. Xử lý ảnh/video qua HTTP upload, sau đó stompClient publish
      if (imageFile) {
        const isVideo = imageFile.type.startsWith("video/");
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await axios.post(
          `${API_BASE}${isVideo ? "/media/video" : "/media/image"}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        const { url, thumbnailUrl, mimeType, mediaSize, duration } =
          uploadRes.data;

        stompClientRef.current?.publish({
          destination: "/app/chat.send",
          body: JSON.stringify({
            conversationId: convId,
            type: isVideo ? "VIDEO" : "IMAGE",
            content: isVideo ? "Video" : "Hình ảnh",
            mediaUrl: url,
            thumbnailUrl: thumbnailUrl || url,
            mimeType,
            mediaSize,
            duration: isVideo ? duration : undefined,
          }),
        });

        setMessages((prev) => [
          ...prev,
          {
            id: `temp_${Date.now()}`,
            conversationId: convId,
            senderId: clerkUser?.id ?? "",
            senderRole: "USER",
            type: isVideo ? "VIDEO" : "IMAGE",
            content: isVideo ? "Video" : "Hình ảnh",
            mediaUrl: url,
            thumbnailUrl: thumbnailUrl || url,
            mimeType,
            mediaSize,
            isDeleted: false,
            createdAt: new Date().toISOString(),
          },
        ]);
        removeImage();
      }

      // 2. Xử lý phần text, CHỈ PUBLISH nến nó KHÔNG phải tin nhắn khởi tạo
      if (msgText && !isFirstTextMessage) {
        setText("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";

        setMessages((prev) => [
          ...prev,
          {
            id: `temp_${Date.now()}`,
            conversationId: convId,
            senderId: clerkUser?.id ?? "",
            senderRole: "USER",
            type: "TEXT",
            content: msgText,
            isDeleted: false,
            createdAt: new Date().toISOString(),
          },
        ]);

        stompClientRef.current?.publish({
          destination: "/app/chat.send",
          body: JSON.stringify({
            conversationId: convId,
            type: "TEXT",
            content: msgText,
          }),
        });
      }

      scrollToBottom();
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSendQuickReply = async (message: string) => {
    if (sending || !message.trim()) return;

    setSending(true);
    let activeConv = conversation;
    let isFirstMessage = false;

    if (!activeConv) {
      activeConv = await ensureConversation(message);
      if (!activeConv) {
        setSending(false);
        return;
      }
      isFirstMessage = true;
    }

    if (activeConv.status === "CLOSED") {
      setSending(false);
      return;
    }

    const convId = activeConv.id;

    try {
      // ✅ Chỉ publish STOMP nếu đây KO phải tin nhắn đầu (đã gửi bằng HTTP)
      if (!isFirstMessage) {
        setMessages((prev) => [
          ...prev,
          {
            id: `temp_${Date.now()}`,
            conversationId: convId,
            senderId: clerkUser?.id ?? "",
            senderRole: "USER",
            type: "TEXT",
            content: message,
            isDeleted: false,
            createdAt: new Date().toISOString(),
          },
        ]);
        stompClientRef.current?.publish({
          destination: "/app/chat.send",
          body: JSON.stringify({
            conversationId: convId,
            type: "TEXT",
            content: message,
          }),
        });
      }
      scrollToBottom();
    } catch (err) {
      console.error("Send quick reply error:", err);
    } finally {
      setSending(false);
    }
  };

  // ── Chuyển sang Admin ───────────────────────────────────────────────────────
  const handleRequestAdmin = async () => {
    if (!conversation || sending) return;
    if (conversation.handoffToAdmin) return; // đã ở chế độ admin rồi
    const token = tokenRef.current;
    try {
      const res = await axios.patch(
        `${API_BASE}/conversations/${conversation.id}/handoff`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setConversation((prev) => (prev ? { ...prev, ...res.data } : prev));
      toast.success("Đã yêu cầu Admin hỗ trợ!");
    } catch (err) {
      toast.error("Không thể chuyển sang Admin lúc này.");
    }
  };

  // ── Chuyển lại Bot ───────────────────────────────────────────────────────────
  const handleSwitchToBot = async () => {
    if (!conversation || sending) return;
    if (conversation.botEnabled) return; // đã ở chế độ bot rồi
    const token = tokenRef.current;
    try {
      const res = await axios.patch(
        `${API_BASE}/conversations/${conversation.id}/enable-bot`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setConversation((prev) => (prev ? { ...prev, ...res.data } : prev));
      toast.success("Đã chuyển sang Bot AI!");
    } catch (err) {
      toast.error("Không thể chuyển sang Bot lúc này.");
    }
  };

  const messageGroups = groupByDate(messages);

  if (!isUserLoaded || loading) {
    return (
      // ✅ Dùng h-full thay min-h-screen để tương thích với ChatWidget (fixed height)
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="relative w-10 h-10 mx-auto mb-3">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 dark:border-emerald-900" />
            <div className="absolute inset-0 rounded-full border-4 border-t-emerald-600 animate-spin" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Đang kết nối...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 flex flex-col overflow-hidden relative">
        {/* ✅ Notification banner khi có tin nhắn mới từ admin/bot */}
        {newMessageNotif && (
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-gray-900 dark:bg-gray-700 text-white text-sm px-4 py-2.5 rounded-2xl shadow-xl cursor-pointer max-w-[320px] animate-bounce-once"
            onClick={() => {
              scrollToBottom();
              setNewMessageNotif(null);
            }}
          >
            <ArrowDown size={14} className="shrink-0 text-emerald-400" />
            <span className="truncate">{newMessageNotif}</span>
          </div>
        )}

        {/* Messages container */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto py-6 space-y-1 scroll-smooth"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1fae5 transparent",
          }}
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-5 shadow-lg shadow-emerald-200 dark:shadow-emerald-900">
                <MessageCircle size={36} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Xin chào! 👋
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs leading-relaxed mb-6">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy nhắn tin để được giải
                đáp ngay!
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
                {[
                  "Tôi muốn hỏi về sản phẩm",
                  "Tình trạng đơn hàng",
                  "Chính sách bảo hành",
                  "Liên hệ tư vấn",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendQuickReply(q)}
                    className="text-left px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl transition-all active:scale-[0.97] shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messageGroups.map((group) => (
            <div key={group.date}>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {group.date}
                </span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
              </div>

              {group.messages.map((msg, idx) => {
                const isUser = msg.senderRole === "USER";
                const isSystem = msg.type === "SYSTEM";
                const isBot = msg.senderRole === "BOT";
                const showAvatar =
                  !isUser &&
                  (idx === 0 ||
                    group.messages[idx - 1]?.senderRole !== msg.senderRole);

                if (isSystem)
                  return (
                    <div key={msg.id} className="flex justify-center my-3">
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-4 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                        {msg.content}
                      </span>
                    </div>
                  );

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 mb-2 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {/* Avatar admin/bot */}
                    {!isUser && (
                      <div className="shrink-0 w-7 h-7 mb-1">
                        {showAvatar && (
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${isBot ? "bg-gradient-to-br from-blue-400 to-violet-500" : "bg-gradient-to-br from-emerald-500 to-teal-600"}`}
                          >
                            {isBot ? (
                              <Bot size={14} className="text-white" />
                            ) : (
                              <ShieldCheck size={14} className="text-white" />
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[72%] flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      {!isUser && showAvatar && (
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 ml-1 mb-1">
                          {isBot ? "Trợ lý AI" : "Shop"}
                        </span>
                      )}

                      {msg.isDeleted ? (
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm italic text-gray-400 dark:text-gray-500 ${isUser ? "bg-gray-100 dark:bg-gray-700 rounded-br-sm" : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-bl-sm"}`}
                        >
                          Tin nhắn đã bị xóa
                        </div>
                      ) : msg.type === "IMAGE" && msg.mediaUrl ? (
                        <div
                          className={`overflow-hidden rounded-2xl shadow-sm ${isUser ? "rounded-br-sm" : "rounded-bl-sm"}`}
                        >
                          <img
                            src={msg.mediaUrl}
                            alt="Ảnh"
                            className="max-w-[260px] max-h-[300px] object-cover cursor-pointer"
                            onClick={() => window.open(msg.mediaUrl!, "_blank")}
                          />
                        </div>
                      ) : msg.type === "VIDEO" && msg.mediaUrl ? (
                        <div
                          className={`overflow-hidden rounded-2xl shadow-sm ${isUser ? "rounded-br-sm" : "rounded-bl-sm"}`}
                        >
                          <video
                            src={msg.mediaUrl}
                            controls
                            className="max-w-[260px] max-h-[300px] rounded-xl"
                          />
                        </div>
                      ) : (
                        <div className="relative group">
                          {isUser ? (
                            <div className="relative">
                              <div className="px-4 py-3 rounded-2xl rounded-br-sm text-sm bg-emerald-500 dark:bg-emerald-600 text-white max-w-[280px] break-words whitespace-pre-wrap">
                                {msg.content}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDeleteMenu(
                                    showDeleteMenu === msg.id ? null : msg.id,
                                  );
                                }}
                                className="absolute -top-2 -right-2 w-7 h-7 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                              >
                                <span className="text-gray-500 dark:text-gray-300 text-lg leading-none">
                                  ⋯
                                </span>
                              </button>
                              {showDeleteMenu === msg.id && (
                                <div className="absolute -top-12 right-0 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl py-1 z-30 w-40">
                                  <button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="w-full text-left px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm font-medium"
                                  >
                                    🗑️ Xóa tin nhắn
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              className={`px-4 py-3 rounded-2xl rounded-bl-sm text-sm max-w-[280px] break-words whitespace-pre-wrap ${isBot ? "bg-violet-50 dark:bg-violet-900/30 text-gray-800 dark:text-gray-200 border border-violet-100 dark:border-violet-800" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"}`}
                            >
                              {msg.content}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quick replies */}
                      {msg.metadata?.quickReplies &&
                        msg.metadata.quickReplies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                            {msg.metadata.quickReplies.map((qr) => (
                              <button
                                key={qr}
                                onClick={() => handleSendQuickReply(qr)}
                                className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-medium shadow-sm"
                              >
                                {qr}
                              </button>
                            ))}
                          </div>
                        )}

                      <div
                        className={`flex items-center gap-1 mt-1 ${isUser ? "mr-1" : "ml-1"}`}
                      >
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          {formatTime(msg.createdAt)}
                        </span>
                        {isUser && (
                          <CheckCheck
                            size={12}
                            className="text-emerald-400 dark:text-emerald-500"
                          />
                        )}
                      </div>
                    </div>

                    {/* Avatar user */}
                    {isUser && (
                      <div className="shrink-0 w-7 h-7 mb-1 rounded-full overflow-hidden bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700">
                        {clerkUser?.imageUrl ? (
                          <img
                            src={clerkUser.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UserCircle2 size={16} className="text-white" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* ✅ Scroll to bottom button */}
        {showScrollBtn && (
          <button
            onClick={() => {
              scrollToBottom();
              setNewMessageNotif(null);
            }}
            className="absolute bottom-6 right-4 w-9 h-9 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronDown
              size={18}
              className="text-gray-600 dark:text-gray-300"
            />
          </button>
        )}
      </div>

      {/* ✅ Input Bar — dark mode */}
      <div className="sticky bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 shadow-lg z-10 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 pt-2 pb-3">

          {/* ── Thanh chế độ chat (bot / admin) ── */}
          {conversation && conversation.status !== "CLOSED" && (
            <div className="flex items-center justify-between mb-2 px-1">
              {/* Trạng thái hiện tại */}
              <div className="flex items-center gap-1.5">
                {conversation.botEnabled ? (
                  <>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700 px-2.5 py-1 rounded-full">
                      <Bot size={11} />
                      Đang chat với Bot AI
                    </span>
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 px-2.5 py-1 rounded-full">
                    <ShieldCheck size={11} />
                    Đang chờ Admin
                  </span>
                )}
              </div>

              {/* Nút chuyển đổi */}
              {conversation.botEnabled ? (
                <button
                  id="btn-request-admin"
                  onClick={handleRequestAdmin}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 active:scale-95 px-3 py-1.5 rounded-full shadow-sm transition-all"
                >
                  <ShieldCheck size={11} />
                  Chat với Admin
                </button>
              ) : (
                <button
                  id="btn-switch-to-bot"
                  onClick={handleSwitchToBot}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:brightness-105 active:scale-95 px-3 py-1.5 rounded-full shadow-sm transition-all"
                >
                  <Bot size={11} />
                  Chat với Bot
                </button>
              )}
            </div>
          )}

          {/* Preview ảnh/video */}
          {imagePreview && (
            <div className="mb-3 pl-14 pr-4">
              <div className="relative inline-block">
                {imageFile?.type.startsWith("video/") ? (
                  <video
                    src={imagePreview}
                    className="h-28 w-28 object-cover rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
                    controls
                  />
                ) : (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-28 w-28 object-cover rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
                  />
                )}
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {conversation?.status === "CLOSED" ? (
            <div className="flex justify-center py-4">
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-5 py-2.5 rounded-2xl text-sm">
                Cuộc trò chuyện đã kết thúc
              </span>
            </div>
          ) : (
            <div className="flex items-end gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl px-2 py-2 shadow-sm transition-colors">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0 w-11 h-11 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all self-end mb-1"
              >
                <Paperclip size={22} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex-1 min-h-[44px]">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhắn tin hỗ trợ..."
                  rows={1}
                  className="w-full bg-transparent resize-none text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none py-3 px-3 leading-6 max-h-[120px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  style={{ minHeight: "44px" }}
                />
              </div>

              <button
                onClick={handleSend}
                disabled={(!text.trim() && !imageFile) || sending}
                className={`shrink-0 w-11 h-11 flex items-center justify-center rounded-2xl transition-all self-end mb-1 ${
                  (text.trim() || imageFile) && !sending
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md hover:brightness-105 active:scale-95"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                {sending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;
