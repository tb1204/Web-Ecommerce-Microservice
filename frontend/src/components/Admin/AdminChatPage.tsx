import { MessageCircleMore, MessagesSquare, Paperclip } from "lucide-react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import api from "../../api/client";

// client.activate();    // bật kết nối
// client.deactivate();  // tắt kết nối
// client.subscribe();   // đăng ký nhận message
// client.publish();     // gửi message
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

interface ConversationSummary {
  id: string;
  userId: string;
  adminId?: string | null;
  status: "WAITING" | "ACTIVE" | "BOT_ONLY" | "CLOSED";
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  lastSenderRole?: "USER" | "ADMIN" | "BOT";
  userLastReadAt?: string | null;
  adminLastReadAt?: string | null;
  botEnabled: boolean;
  handoffToAdmin: boolean;
  tags?: string[];
  userDisplayName?: string;
  userAvatarUrl?: string | null;
  isPinned?: boolean;
  isMuted?: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/chat`;
const WS_URL = `${import.meta.env.VITE_API_BASE_URL}/ws`;
console.log(API_BASE, WS_URL);
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const AdminChatPage: React.FC = () => {
  const { getToken } = useAuth();

  const [summaries, setSummaries] = useState<ConversationSummary[]>([]);
  const [selectedSummary, setSelectedSummary] =
    useState<ConversationSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "WAITING" | "ACTIVE" | "CLOSED"
  >("ALL");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const tokenRef = useRef<string>("");
  const currentSubRef = useRef<any>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // ── Menu actions ──────────────────────────────────────────────
  const togglePin = async (convId: string) => {
    const token = tokenRef.current;
    if (!token) return;

    try {
      const res = await api.patch(
        `${API_BASE}/conversations/${convId}/pin`,
        null,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Cập nhật state sau khi backend trả về
      setSummaries((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, ...res.data } : c)),
      );

      setSelectedSummary((prev) =>
        prev?.id === convId ? { ...prev, ...res.data } : prev,
      );
    } catch (err) {
      console.error("Toggle pin failed:", err);
      setSummaries((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, isPinned: !c.isPinned } : c,
        ),
      );
    } finally {
      setOpenMenuId(null);
    }
  };

  const toggleMute = async (convId: string) => {
    const token = tokenRef.current;
    if (!token) return;

    try {
      const res = await api.patch(
        `${API_BASE}/conversations/${convId}/mute`,
        null,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setSummaries((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, ...res.data } : c)),
      );

      setSelectedSummary((prev) =>
        prev?.id === convId ? { ...prev, ...res.data } : prev,
      );
    } catch (err) {
      console.error("Toggle mute failed:", err);
      setSummaries((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, isMuted: !c.isMuted } : c)),
      );
    } finally {
      setOpenMenuId(null);
    }
  };

  // ── Init: connect WS + load conversations ─────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const token = await getToken({ template: "my-backend" });
        if (!token) return;
        tokenRef.current = token;

        // Load all active/waiting conversations
        await loadConversations(token);

        // Connect WebSocket
        const client = new Client({
          webSocketFactory: () => new SockJS(WS_URL),
          connectHeaders: { Authorization: `Bearer ${token}` },
          reconnectDelay: 5000,
          onConnect: () => {
            // Subscribe kênh thông báo khi có phòng chờ mới
            client.subscribe("/topic/admin.newConversation", (frame) => {
              try {
                const newConv: ConversationSummary = JSON.parse(frame.body);
                setSummaries((prev) => {
                  const exists = prev.some((c) => c.id === newConv.id);
                  if (exists)
                    return prev.map((c) => (c.id === newConv.id ? newConv : c)); //id conversation
                  return [newConv, ...prev];
                });
              } catch (e) {
                console.error("Parse admin.newConversation error:", e);
              }
            });
          },
          onStompError: (frame) =>
            console.error("STOMP error:", frame.headers["message"]),
        });

        client.activate();
        stompClientRef.current = client;
      } catch (err) {
        console.error("Init admin chat error:", err);
      } finally {
        setLoadingConvs(false);
      }
    };

    init();
    return () => {
      stompClientRef.current?.deactivate();
    };
  }, []);

  const loadConversations = async (token: string) => {
    try {
      // Load WAITING + ACTIVE separately rồi merge
      const [waitingRes, activeRes] = await Promise.all([
        api.get(`${API_BASE}/conversations/admin?status=WAITING`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get(`${API_BASE}/conversations/admin?status=ACTIVE`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const merged: ConversationSummary[] = [
        ...waitingRes.data,
        ...activeRes.data,
      ];
      // remove duplicates
      const unique = merged.filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i,
      );
      setSummaries(unique);
    } catch (err) {
      console.error("Load conversations error:", err);
    }
  };

  // ── Khi chọn conversation ─────────────────────────────────────
  const handleSelectConversation = async (conv: ConversationSummary) => {
    setSelectedSummary(conv);
    setMessages([]);
    setLoadingMsgs(true);

    const token = tokenRef.current;

    try {
      // Load messages
      const res = await api.get(`${API_BASE}/messages/${conv.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      setTimeout(() => scrollToBottom(), 100);

      // Mark read
      await api.patch(`${API_BASE}/conversations/${conv.id}/read`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummaries((prev) =>
        prev.map((c) =>
          c.id === conv.id
            ? { ...c, adminLastReadAt: new Date().toISOString() }
            : c,
        ),
      );

      // Admin join nếu conversation đang WAITING
      if (conv.status === "WAITING") {
        stompClientRef.current?.publish({
          destination: "/app/chat.join",
          body: conv.id,
        });
        // Cập nhật local status
        setSummaries((prev) =>
          prev.map((c) => (c.id === conv.id ? { ...c, status: "ACTIVE" } : c)),
        );
        setSelectedSummary((prev) =>
          prev ? { ...prev, status: "ACTIVE" } : prev,
        );
      }

      // Unsubscribe kênh cũ
      if (currentSubRef.current) {
        currentSubRef.current.unsubscribe();
        currentSubRef.current = null;
      }

      // Subscribe kênh tin nhắn realtime của conversation này
      if (stompClientRef.current?.connected) {
        subscribeToConversation(conv.id);
      } else {
        // Chờ connect xong rồi subscribe
        const interval = setInterval(() => {
          if (stompClientRef.current?.connected) {
            subscribeToConversation(conv.id);
            clearInterval(interval);
          }
        }, 500);
      }
    } catch (err) {
      console.error("Select conversation error:", err);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const subscribeToConversation = (convId: string) => {
    const sub = stompClientRef.current?.subscribe(
      `/topic/conversation.${convId}`,
      (frame) => {
        try {
          const incoming = JSON.parse(frame.body);

          // Nếu là ConversationResponse (object có status field) → cập nhật conversation
          if (incoming.status !== undefined && incoming.userId !== undefined) {
            setSummaries((prev) =>
              prev.map((c) =>
                c.id === incoming.id ? { ...c, ...incoming } : c,
              ),
            );
            setSelectedSummary((prev) =>
              prev?.id === incoming.id ? { ...prev, ...incoming } : prev,
            );
            return;
          }

          // Là tin nhắn
          setMessages((prev) => {
            const exists = prev.some((m) => {
              // 1. Trùng ID thật
              if (m.id === incoming.id) return true;

              // 2. IMAGE / VIDEO → so URL
              if (
                (incoming.type === "IMAGE" || incoming.type === "VIDEO") &&
                m.mediaUrl &&
                incoming.mediaUrl &&
                m.mediaUrl === incoming.mediaUrl
              ) {
                return true;
              }

              // 3. TEXT → so content + thời gian gần
              if (
                incoming.type === "TEXT" &&
                m.content === incoming.content &&
                m.senderRole === incoming.senderRole &&
                Math.abs(
                  new Date(m.createdAt).getTime() -
                    new Date(incoming.createdAt).getTime(),
                ) < 3000
              ) {
                return true;
              }

              return false;
            });

            if (exists) return prev;

            return [...prev, incoming];
          });

          // Cập nhật lastMessage trong danh sách
          setSummaries((prev) =>
            prev.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    lastMessage:
                      incoming.type === "TEXT"
                        ? incoming.content
                        : incoming.type === "IMAGE"
                          ? "[Hình ảnh]"
                          : "[Video]",
                    lastMessageAt: incoming.createdAt,
                    lastSenderRole: incoming.senderRole,
                  }
                : c,
            ),
          );

          setTimeout(() => scrollToBottom(), 50);
        } catch (e) {
          console.error("Parse WS message error:", e);
        }
      },
    );
    currentSubRef.current = sub;
  };

  // ── Send reply ────────────────────────────────────────────────
  const handleSendReply = async () => {
    if (!selectedSummary || (!replyText.trim() && !selectedFile)) return;
    if (selectedSummary.status === "CLOSED") return;

    const token = tokenRef.current;
    setSending(true);

    try {
      // Upload ảnh nếu có
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const isVideo = selectedFile.type.startsWith("video/");

        const uploadRes = await api.post(
          `${API_BASE}/media/${isVideo ? "video" : "image"}`,
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
            conversationId: selectedSummary.id,
            type: isVideo ? "VIDEO" : "IMAGE",
            content: isVideo ? "Video" : "Hình ảnh",
            mediaUrl: url,
            thumbnailUrl,
            mimeType,
            mediaSize,
            duration,
          }),
        });

        const optimisticMsg: Message = {
          id: `temp_${Date.now()}`,
          conversationId: selectedSummary.id,
          senderId: "admin",
          senderRole: "ADMIN",
          type: isVideo ? "VIDEO" : "IMAGE",
          content: isVideo ? "Video" : "Hình ảnh",
          mediaUrl: url,
          thumbnailUrl,
          mimeType,
          mediaSize,
          isDeleted: false,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, optimisticMsg]);

        setSelectedFile(null);
        setPreviewUrl(null);
      }

      if (replyText.trim()) {
        const msgText = replyText.trim();
        setReplyText("");

        // Optimistic
        const optimistic: Message = {
          id: `temp_${Date.now()}`,
          conversationId: selectedSummary.id,
          senderId: "admin",
          senderRole: "ADMIN",
          type: "TEXT",
          content: msgText,
          isDeleted: false,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimistic]);

        stompClientRef.current?.publish({
          destination: "/app/chat.send",
          body: JSON.stringify({
            conversationId: selectedSummary.id,
            type: "TEXT",
            content: msgText,
          }),
        });
      }

      setTimeout(() => scrollToBottom(), 50);
    } catch (err) {
      console.error("Send reply error:", err);
    } finally {
      setSending(false);
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedSummary) return;
    const token = tokenRef.current;
    try {
      await api.patch(
        `${API_BASE}/conversations/${selectedSummary.id}/close`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSummaries((prev) =>
        prev.map((c) =>
          c.id === selectedSummary.id ? { ...c, status: "CLOSED" } : c,
        ),
      );
      setSelectedSummary((prev) =>
        prev ? { ...prev, status: "CLOSED" } : prev,
      );
    } catch (err) {
      console.error("Close conversation error:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // file.size chính là dung lượng tính bằng Byte
    // console.log("Dung lượng file:", file.size);
    if (!file) return;

    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // ── Unread count ──────────────────────────────────────────────
  const getUnreadCount = (conv: ConversationSummary) => {
    if (!conv.adminLastReadAt) return conv.lastMessage ? 1 : 0;
    if (!conv.lastMessageAt) return 0;
    return new Date(conv.lastMessageAt) > new Date(conv.adminLastReadAt) &&
      conv.lastSenderRole === "USER"
      ? 1
      : 0;
  };

  // ── Filter ────────────────────────────────────────────────────
  const filteredSummaries = summaries
    .filter((conv) => {
      const matchSearch =
        (conv.userDisplayName ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (conv.lastMessage ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "ALL" || conv.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (
        new Date(b.lastMessageAt ?? 0).getTime() -
        new Date(a.lastMessageAt ?? 0).getTime()
      );
    });

  // ── Status badge ──────────────────────────────────────────────
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WAITING":
        return { label: "Đang chờ", cls: "bg-amber-100 text-amber-700" };
      case "ACTIVE":
        return { label: "Đang chat", cls: "bg-emerald-100 text-emerald-700" };
      case "CLOSED":
        return { label: "Đã đóng", cls: "bg-gray-100 text-gray-500" };
      default:
        return { label: status, cls: "bg-gray-100 text-gray-500" };
    }
  };

  // ── Click outside menu ────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <MessagesSquare className="text-emerald-600" />
          Quản lý Tin nhắn
        </h1>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm tên khách, nội dung tin nhắn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white min-w-[180px] cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả</option>
            <option value="WAITING">Đang chờ</option>
            <option value="ACTIVE">Đang chat</option>
            {/* <option value="CLOSED">Đã đóng</option> */}
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] lg:h-[70vh] bg-white rounded-xl shadow overflow-hidden">
          {/* Danh sách cuộc trò chuyện */}
          <div className="w-full lg:w-96 border-r border-gray-200 overflow-y-auto bg-gray-50">
            {loadingConvs ? (
              // <div className="flex items-center justify-center h-full text-gray-500">
              //   <div className="text-center">
              //     <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              //     <p className="text-sm">Đang tải...</p>
              //   </div>
              // </div>
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-10 h-10 animate-spin rounded-full border-b-2 border-emerald-600 mx-auto mb-2"></div>
                <p className="mt-4 text-gray-400 text-[10px] font-black uppercase tracking-[3px]">
                  Đang tải ...
                </p>
              </div>
            ) : filteredSummaries.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Không tìm thấy cuộc trò chuyện...
              </div>
            ) : (
              filteredSummaries.map((conv) => {
                const badge = getStatusBadge(conv.status);
                const unread = getUnreadCount(conv);
                return (
                  <div
                    key={conv.id}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-blue-50 relative transition-colors ${
                      selectedSummary?.id === conv.id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                    onClick={() => handleSelectConversation(conv)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold shrink-0 text-blue-700">
                        {conv.userAvatarUrl ? (
                          <img
                            src={conv.userAvatarUrl}
                            alt=""
                            className="rounded-full w-10 h-10 object-cover"
                          />
                        ) : (
                          (conv.userDisplayName ?? "?").charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-gray-900 truncate flex items-center gap-1 text-sm">
                            {conv.isMuted && (
                              <span className="text-gray-500 text-xs">🔇</span>
                            )}
                            {conv.isPinned && (
                              <span className="text-yellow-600">📌</span>
                            )}
                            {conv.userDisplayName ?? "Khách hàng"}
                          </h4>

                          <div
                            className="relative"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === conv.id ? null : conv.id,
                                )
                              }
                              className="text-gray-500 hover:text-gray-900 p-1 rounded-full hover:bg-gray-200 text-lg leading-none"
                            >
                              ⋯
                            </button>
                            {openMenuId === conv.id && (
                              <div
                                ref={menuRef}
                                className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 text-sm"
                              >
                                <button
                                  onClick={() => togglePin(conv.id)}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                  {conv.isPinned ? "Bỏ ghim" : "Ghim"}
                                </button>
                                <button
                                  onClick={() => toggleMute(conv.id)}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                  {conv.isMuted
                                    ? "Bật thông báo"
                                    : "Tắt thông báo"}
                                </button>
                                {/* {conv.status !== "CLOSED" && (
                                  <button
                                    onClick={async () => {
                                      setSelectedSummary(conv);
                                      await handleCloseConversation();
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                  >
                                    Đóng cuộc trò chuyện
                                  </button>
                                )} */}
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {conv.lastMessage ?? "Chưa có tin nhắn"}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                          {unread > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                              Mới
                            </span>
                          )}
                          {conv.lastMessageAt && (
                            <span className="text-[10px] text-gray-400 ml-auto">
                              {formatTime(conv.lastMessageAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chi tiết tin nhắn + hộp trả lời */}
          <div className="flex-1 flex flex-col bg-white min-w-0">
            {selectedSummary ? (
              <>
                {/* Header conversation */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">
                      {selectedSummary.userAvatarUrl ? (
                        <img
                          src={selectedSummary.userAvatarUrl}
                          alt=""
                          className="rounded-full w-10 h-10 object-cover"
                        />
                      ) : (
                        (
                          selectedSummary.userDisplayName?.charAt(0) ?? "?"
                        ).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {selectedSummary.isPinned && (
                          <span className="text-yellow-600">📌</span>
                        )}
                        <h3 className="font-semibold text-gray-900">
                          {selectedSummary.userDisplayName ?? "Khách hàng"}
                        </h3>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadge(selectedSummary.status).cls}`}
                      >
                        {getStatusBadge(selectedSummary.status).label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedSummary.isMuted && (
                      <span className="text-gray-500 text-sm">🔇</span>
                    )}
                    {/* {selectedSummary.status !== "CLOSED" && (
                      <button
                        onClick={handleCloseConversation}
                        className="text-sm px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Đóng chat
                      </button>
                    )} */}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3 bg-gray-50">
                  {loadingMsgs ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Chưa có tin nhắn
                    </div>
                  ) : (
                    messages.map((msg) => {
                      if (msg.type === "SYSTEM") {
                        return (
                          <div key={msg.id} className="flex justify-center">
                            <span className="text-[11px] text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200">
                              {msg.content}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderRole === "ADMIN" ? "justify-end" : "justify-start"}`}
                        >
                          <div className="max-w-[75%] flex flex-col">
                            {msg.senderRole === "BOT" && (
                              <span className="text-[10px] text-purple-500 mb-0.5 ml-1">
                                🤖 Bot
                              </span>
                            )}

                            {msg.type === "TEXT" ? (
                              <div
                                className={`px-4 py-3 rounded-2xl shadow-sm ${
                                  msg.senderRole === "ADMIN"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : msg.senderRole === "BOT"
                                      ? "bg-purple-50 text-gray-800 border border-purple-100 rounded-bl-none"
                                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                                }`}
                              >
                                <p className="text-sm break-words whitespace-pre-wrap">
                                  {msg.content}
                                </p>
                              </div>
                            ) : msg.type === "IMAGE" && msg.mediaUrl ? (
                              <div className="rounded-2xl overflow-hidden shadow-sm">
                                <img
                                  src={msg.mediaUrl}
                                  alt="Ảnh đính kèm"
                                  className="max-w-full h-auto max-h-72 object-contain rounded-xl cursor-pointer"
                                  onClick={() =>
                                    window.open(msg.mediaUrl!, "_blank")
                                  }
                                />
                              </div>
                            ) : msg.type === "VIDEO" && msg.mediaUrl ? (
                              <div className="rounded-2xl overflow-hidden shadow-sm">
                                <video
                                  src={msg.mediaUrl}
                                  controls
                                  className="max-w-full max-h-72 rounded-xl"
                                />
                              </div>
                            ) : (
                              <div className="px-4 py-2 bg-gray-100 rounded-lg border border-dashed border-gray-400">
                                <p className="text-sm italic text-gray-600">
                                  [ {msg.type} ] {msg.content}
                                </p>
                              </div>
                            )}

                            {msg.metadata?.quickReplies &&
                              msg.metadata.quickReplies.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {msg.metadata.quickReplies.map((qr) => (
                                    <span
                                      key={qr}
                                      className="text-xs px-2 py-1 bg-purple-50 text-purple-600 border border-purple-200 rounded-full"
                                    >
                                      {qr}
                                    </span>
                                  ))}
                                </div>
                              )}

                            <p
                              className={`text-[10px] mt-1 text-gray-400 ${msg.senderRole === "ADMIN" ? "text-right" : "text-left"}`}
                            >
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white shrink-0">
                  {previewUrl && (
                    <div className="mb-3 flex items-start gap-3">
                      <div className="relative">
                        {previewUrl &&
                          selectedFile?.type.startsWith("image/") && (
                            <img
                              src={previewUrl}
                              className="h-24 w-24 object-cover rounded-lg"
                            />
                          )}

                        {previewUrl &&
                          selectedFile?.type.startsWith("video/") && (
                            <video
                              src={previewUrl}
                              className="h-24 w-24 rounded-lg"
                              controls
                            />
                          )}
                        <button
                          onClick={() => {
                            setPreviewUrl(null);
                            setSelectedFile(null);
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                  {/* {selectedSummary.status === "CLOSED" ? (
                    <div className="flex items-center justify-center py-3 text-sm text-gray-400">
                      <span className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-full">
                        Cuộc trò chuyện đã kết thúc
                      </span>
                    </div>
                  ) : ( */}
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center text-gray-600 hover:text-blue-600 shadow-sm min-w-[44px] h-11"
                      title="Đính kèm ảnh"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Nhập tin nhắn trả lời..."
                      rows={1}
                      onKeyDown={handleKeyDown}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm resize-none min-h-[44px] max-h-[140px] overflow-y-auto text-sm"
                    />

                    <button
                      onClick={handleSendReply}
                      disabled={(!replyText.trim() && !selectedFile) || sending}
                      className={`min-w-[80px] px-6 py-3 rounded-full font-medium transition-all shadow-sm h-11 flex items-center justify-center text-sm ${
                        (replyText.trim() || selectedFile) && !sending
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {sending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Gửi"
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                <MessageCircleMore
                  size={64}
                  className="mb-4 text-gray-300"
                  strokeWidth={1.5}
                />
                <p className="text-lg font-medium text-gray-900">
                  Chọn một cuộc trò chuyện để xem
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Nội dung tin nhắn sẽ hiển thị tại đây sau khi bạn chọn khách
                  hàng.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatPage;
