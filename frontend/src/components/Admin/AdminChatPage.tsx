import { MessageCircleMore } from "lucide-react";
import React, { useState, useMemo, useEffect, useRef } from "react";

// interface Message {
//   id: string;
//   conversationId: string;
//   senderId: string;
//   senderRole: "USER" | "ADMIN" | "BOT";
//   senderNickname: string;
//   type: "TEXT" | "IMAGE" | "FILE";
//   content: string;
//   mediaUrl?: string | null;
//   timestamp: string;
//   isRead: boolean;
//   readAt?: string | null;
//   metadata?: Record<string, any>;
// }

// interface ConversationSummary {
//   id: string;
//   conversationId: string;
//   type: "USER_ADMIN" | "USER_BOT" | "USER_ADMIN_BOT" | "GROUP";
//   userId: string;
//   userNickname: string;
//   userEmail?: string;
//   avatar?: string;
//   lastMessagePreview: string;
//   lastMessageAt: string;
//   status: "ACTIVE" | "CLOSED" | "ARCHIVED";
//   unreadCount: number;
//   isPinned?: boolean;
//   isMuted?: boolean;
// }

// XÓA cái cũ, thay bằng:
interface Message {
  id: string; // ← id → id
  conversationId: string;
  senderId: string;
  senderRole: "USER" | "ADMIN" | "BOT";
  type: "TEXT" | "IMAGE" | "VIDEO" | "SYSTEM"; // ← bỏ FILE, thêm VIDEO, SYSTEM
  content: string;
  mediaUrl?: string | null;
  thumbnailUrl?: string | null; // ← thêm
  mimeType?: string | null; // ← thêm
  mediaSize?: number | null; // ← thêm
  duration?: number | null; // ← thêm (video)
  isDeleted: boolean; // ← thêm
  metadata?: {
    intent?: string;
    confidence?: number;
    isBotResponse?: boolean;
    botFallback?: boolean;
    quickReplies?: string[];
  };
  createdAt: string; // ← timestamp → createdAt
  // XÓA: isRead, readAt, senderNickname
}

// XÓA cái cũ, thay bằng:
interface ConversationSummary {
  id: string; // ← id → id
  userId: string;
  adminId?: string | null; // ← thêm
  status: "WAITING" | "ACTIVE" | "BOT_ONLY" | "CLOSED"; // ← sửa lại
  lastMessage?: string | null; // ← lastMessagePreview → lastMessage
  lastMessageAt?: string | null;
  lastSenderRole?: "USER" | "ADMIN" | "BOT"; // ← thêm
  userLastReadAt?: string | null; // ← thêm
  adminLastReadAt?: string | null; // ← thêm (tính unread từ đây)
  botEnabled: boolean; // ← thêm
  handoffToAdmin: boolean; // ← thêm
  tags?: string[]; // ← thêm
  userDisplayName?: string; // ← thêm (thay userNickname)
  userAvatarUrl?: string | null; // ← thêm (thay avatar)
  isPinned?: boolean; // ← giữ nguyên
  isMuted?: boolean; // ← giữ nguyên
  createdAt: string;
  updatedAt: string;
  // XÓA: id, conversationId, type, userNickname, userEmail, avatar
  // XÓA: unreadCount (tính từ adminLastReadAt)
}

const fakeConversationSummaries: ConversationSummary[] = [
  {
    id: "conv_001", // ← _id → id
    userId: "usr_1001",
    adminId: null,
    status: "ACTIVE",
    lastMessage: "Nệm này có độ cứng trung bình không ạ?", // ← lastMessagePreview → lastMessage
    lastMessageAt: "2026-02-23T14:30:00Z",
    lastSenderRole: "USER",
    adminLastReadAt: null, // ← thêm
    userLastReadAt: null, // ← thêm
    botEnabled: true, // ← thêm
    handoffToAdmin: false, // ← thêm
    userDisplayName: "Nguyễn Văn A", // ← userNickname → userDisplayName
    userAvatarUrl: null, // ← avatar → userAvatarUrl
    isPinned: true,
    isMuted: false,
    createdAt: "2026-02-23T10:00:00Z", // ← thêm
    updatedAt: "2026-02-23T14:30:00Z", // ← thêm
  },
  {
    id: "conv_002",
    userId: "usr_1002",
    adminId: "admin_001",
    status: "ACTIVE",
    lastMessage: "Gối cao su non có bảo hành bao lâu vậy shop?",
    lastMessageAt: "2026-02-23T09:15:00Z",
    lastSenderRole: "USER",
    adminLastReadAt: "2026-02-23T09:20:00Z",
    userLastReadAt: null,
    botEnabled: false,
    handoffToAdmin: true,
    userDisplayName: "Trần Thị B",
    userAvatarUrl: null,
    isPinned: false,
    isMuted: true,
    createdAt: "2026-02-23T09:00:00Z",
    updatedAt: "2026-02-23T09:20:00Z",
  },
  {
    id: "conv_003",
    userId: "usr_1003",
    adminId: null,
    status: "WAITING",
    lastMessage: "Có chương trình khuyến mãi tháng này không ạ?",
    lastMessageAt: "2026-02-22T21:45:00Z",
    lastSenderRole: "USER",
    adminLastReadAt: null,
    userLastReadAt: null,
    botEnabled: true,
    handoffToAdmin: false,
    userDisplayName: "Lê Minh C",
    userAvatarUrl: null,
    isPinned: false,
    isMuted: false,
    createdAt: "2026-02-22T21:00:00Z",
    updatedAt: "2026-02-22T21:45:00Z",
  },
];

const fakeMessagesByConv: Record<string, Message[]> = {
  conv_001: [
    {
      id: "msg_1", // ← _id → id
      conversationId: "conv_001",
      senderId: "usr_1001",
      senderRole: "USER",
      type: "TEXT",
      content: "Chào shop ơi",
      isDeleted: false, // ← thêm
      createdAt: "2026-02-23T14:10:00Z", // ← timestamp → createdAt
    },
    {
      id: "msg_2",
      conversationId: "conv_001",
      senderId: "usr_1001",
      senderRole: "USER",
      type: "TEXT",
      content: "Nệm này có độ cứng trung bình không ạ?",
      isDeleted: false,
      createdAt: "2026-02-23T14:30:00Z",
    },
  ],
  conv_002: [
    {
      id: "msg_3",
      conversationId: "conv_002",
      senderId: "usr_1002",
      senderRole: "USER",
      type: "TEXT",
      content: "Gối cao su non có bảo hành bao lâu vậy shop?",
      isDeleted: false,
      createdAt: "2026-02-23T09:15:00Z",
    },
    {
      id: "msg_4",
      conversationId: "conv_002",
      senderId: "admin_001",
      senderRole: "ADMIN",
      type: "TEXT",
      content: "Dạ chị ơi bảo hành 5 năm ạ, lỗi kỹ thuật đổi mới 100%",
      isDeleted: false,
      createdAt: "2026-02-23T09:20:00Z",
    },
  ],
  conv_003: [
    {
      id: "msg_5",
      conversationId: "conv_003",
      senderId: "usr_1003",
      senderRole: "USER",
      type: "TEXT",
      content: "Có chương trình khuyến mãi tháng này không ạ?",
      isDeleted: false,
      createdAt: "2026-02-22T21:45:00Z",
    },
  ],
};

const AdminChatPage: React.FC = () => {
  const [summaries, setSummaries] = useState<ConversationSummary[]>(
    fakeConversationSummaries,
  );
  const [selectedSummary, setSelectedSummary] =
    useState<ConversationSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "UNREAD" | "READ">(
    "all",
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const getUnreadCount = (conv: ConversationSummary, msgs: Message[]) => {
    if (!conv.adminLastReadAt)
      return msgs.length > 0
        ? msgs.filter((m) => m.senderRole === "USER").length
        : 0;
    return msgs.filter(
      (msg) =>
        msg.senderRole === "USER" &&
        new Date(msg.createdAt) > new Date(conv.adminLastReadAt!),
    ).length;
  };

  // Đóng menu ba chấm khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load messages khi chọn conversation
  useEffect(() => {
    if (selectedSummary) {
      const loaded = fakeMessagesByConv[selectedSummary.id] || []; // ← _id → id
      setMessages(loaded);
    } else {
      setMessages([]);
    }
  }, [selectedSummary]);

  // Tự động đánh dấu đã đọc khi mở chat
  useEffect(() => {
    if (messages.length > 0 && selectedSummary) {
      const hasUnread = messages.some(
        (msg) =>
          msg.senderRole === "USER" &&
          (!selectedSummary.adminLastReadAt ||
            new Date(msg.createdAt) >
              new Date(selectedSummary.adminLastReadAt)),
      );
      if (hasUnread) {
        const now = new Date().toISOString();
        setSummaries((prev) =>
          prev.map((conv) =>
            conv.id === selectedSummary.id // ← _id → id
              ? { ...conv, adminLastReadAt: now }
              : conv,
          ),
        );
      }
    }
  }, [messages, selectedSummary]);

  const sortedSummaries = useMemo(() => {
    return [...summaries].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (
        new Date(b.lastMessageAt ?? 0).getTime() -
        new Date(a.lastMessageAt ?? 0).getTime()
      );
    });
  }, [summaries]);

  const filteredSummaries = useMemo(() => {
    return sortedSummaries.filter((conv) => {
      const matchSearch =
        (conv.userDisplayName ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) || // ← userNickname → userDisplayName
        (conv.lastMessage ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()); // ← lastMessagePreview → lastMessage

      const unreadCount = getUnreadCount(
        conv,
        fakeMessagesByConv[conv.id] || [],
      );
      let matchStatus = true;
      if (statusFilter === "UNREAD") matchStatus = unreadCount > 0;
      else if (statusFilter === "READ") matchStatus = unreadCount === 0;

      return matchSearch && matchStatus;
    });
  }, [sortedSummaries, searchTerm, statusFilter]);

  const handleSendReply = () => {
    if (!selectedSummary) return;
    if (replyText.trim() || selectedImage) {
      const newMsgs: Message[] = [];

      if (replyText.trim()) {
        newMsgs.push({
          id: `msg_text_${Date.now()}`, // ← _id → id
          conversationId: selectedSummary.id, // ← conversationId → id
          senderId: "admin_001",
          senderRole: "ADMIN",
          type: "TEXT",
          content: replyText.trim(),
          isDeleted: false, // ← thêm
          createdAt: new Date().toISOString(), // ← timestamp → createdAt
        });
      }

      if (selectedImage) {
        const fakeImageUrl = URL.createObjectURL(selectedImage);
        newMsgs.push({
          id: `msg_img_${Date.now()}`,
          conversationId: selectedSummary.id,
          senderId: "admin_001",
          senderRole: "ADMIN",
          type: "IMAGE",
          content: "Ảnh sản phẩm",
          mediaUrl: fakeImageUrl,
          isDeleted: false,
          createdAt: new Date().toISOString(),
        });
        setSelectedImage(null);
        setImagePreview(null);
      }

      setMessages((prev) => [...prev, ...newMsgs]);

      setSummaries((prev) =>
        prev.map((conv) =>
          conv.id === selectedSummary.id // ← _id → id
            ? {
                ...conv,
                lastMessage: replyText.trim() || "Đã gửi ảnh", // ← lastMessagePreview → lastMessage
                lastMessageAt: new Date().toISOString(),
                lastSenderRole: "ADMIN" as const,
              }
            : conv,
        ),
      );
      setReplyText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleMarkRead = (convId: string) => {
    setSummaries((prev) =>
      prev.map((conv) =>
        conv.id === convId // ← _id → id
          ? {
              ...conv,
              adminLastReadAt: conv.adminLastReadAt
                ? null
                : new Date().toISOString(),
            }
          : conv,
      ),
    );
    setOpenMenuId(null);
  };

  const togglePin = (convId: string) => {
    setSummaries((prev) =>
      prev.map((conv) =>
        conv.id === convId ? { ...conv, isPinned: !conv.isPinned } : conv,
      ),
    );
    setOpenMenuId(null);
  };

  const toggleMute = (convId: string) => {
    setSummaries((prev) =>
      prev.map((conv) =>
        conv.id === convId ? { ...conv, isMuted: !conv.isMuted } : conv,
      ),
    );
    setOpenMenuId(null);
  };

  const deleteConversation = (convId: string) => {
    if (window.confirm("Xóa cuộc trò chuyện này?")) {
      setSummaries((prev) => prev.filter((c) => c.id !== convId));
      if (selectedSummary?.id === convId) {
        setSelectedSummary(null);
        setMessages([]);
      }
      delete fakeMessagesByConv[convId];
    }
    setOpenMenuId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Quản lý Tin nhắn
        </h1>

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
            <option value="all">Tất cả</option>
            <option value="UNREAD">Chưa đọc</option>
            <option value="READ">Đã đọc</option>
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)] lg:h-[70vh] bg-white rounded-xl shadow overflow-hidden">
          {/* Danh sách cuộc trò chuyện */}
          <div className="w-full lg:w-96 border-r border-gray-200 overflow-y-auto bg-gray-50">
            {filteredSummaries.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Không tìm thấy cuộc trò chuyện...
              </div>
            ) : (
              filteredSummaries.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-blue-50 relative ${
                    selectedSummary?.id === conv.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                  onClick={() => setSelectedSummary(conv)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold shrink-0">
                      {conv.avatar ? (
                        <img
                          src={conv.avatar}
                          alt=""
                          className="rounded-full"
                        />
                      ) : (
                        conv.userNickname.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900 truncate flex items-center gap-1">
                          {conv.isMuted && (
                            <span className="text-gray-500 text-xs">🔇</span>
                          )}
                          {conv.isPinned && (
                            <span className="text-yellow-600 text-base">
                              📌
                            </span>
                          )}
                          {conv.userNickname}
                        </h4>

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === conv.id ? null : conv.id,
                              );
                            }}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-200"
                          >
                            ⋯
                          </button>

                          {openMenuId === conv.id && (
                            <div
                              ref={menuRef}
                              className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 text-sm"
                            >
                              <button
                                onClick={() => toggleMarkRead(conv.id)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              >
                                {conv.unreadCount > 0
                                  ? "Đánh dấu đã đọc"
                                  : "Đánh dấu chưa đọc"}
                              </button>
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
                              <button
                                onClick={() => deleteConversation(conv.id)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                              >
                                Xóa tin nhắn
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 truncate mt-0.5">
                        {conv.lastMessagePreview}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chi tiết tin nhắn + hộp trả lời */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedSummary ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold">
                      {selectedSummary.avatar ? (
                        <img
                          src={selectedSummary.avatar}
                          alt=""
                          className="rounded-full"
                        />
                      ) : (
                        selectedSummary.userNickname.charAt(0)
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedSummary.isPinned && (
                        <span className="text-yellow-600 text-xl">📌</span>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedSummary.userNickname}
                        </h3>
                        {selectedSummary.userEmail && (
                          <p className="text-sm text-gray-500">
                            {selectedSummary.userEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {selectedSummary.isMuted && (
                      <span className="text-gray-500 text-sm">
                        🔇 Tắt thông báo
                      </span>
                    )}
                  </div>
                </div>

                {/* Phần render messages */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-gray-50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderRole === "ADMIN" ? "justify-end" : "justify-start"} group relative`}
                    >
                      {/* Container chính: Bỏ px-4 py-3 và các class bg- màu nền ở đây */}
                      <div className="max-w-[75%] flex flex-col relative">
                        {msg.type === "TEXT" ? (
                          /* CHỈ TEXT MỚI CÓ KHUNG MÀU */
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm break-all overflow-hidden ${
                              msg.senderRole === "ADMIN"
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-gray-200 text-gray-900 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm break-all hyphens-auto leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          </div>
                        ) : msg.type === "IMAGE" && msg.mediaUrl ? (
                          /* ẢNH HIỂN THỊ TỰ NHIÊN, KHÔNG CÓ NỀN XANH */
                          <div className="outline-none border-none focus:outline-none">
                            <img
                              src={msg.mediaUrl}
                              alt="Ảnh đính kèm"
                              className="max-w-full h-auto max-h-80 object-contain rounded-xl shadow-sm select-none border border-gray-200"
                              draggable={false}
                            />
                          </div>
                        ) : (
                          /* CÁC LOẠI KHÁC (FILE...) */
                          <div className="px-4 py-2 bg-gray-100 rounded-lg border border-dashed border-gray-400">
                            <p className="text-sm italic text-gray-600">
                              [ {msg.type} ] {msg.content}
                            </p>
                          </div>
                        )}

                        {/* Timestamp: Đưa ra ngoài khung để ảnh hay text đều hiển thị đồng nhất */}
                        <p
                          className={`text-[10px] mt-1 flex items-center gap-1 ${
                            msg.senderRole === "ADMIN"
                              ? "justify-end text-gray-500"
                              : "justify-start text-gray-500"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {msg.isRead && msg.senderRole === "ADMIN" && (
                            <span className="text-blue-500 font-bold">✓</span>
                          )}
                        </p>

                        {/* Nút xóa tin nhắn: Điều chỉnh vị trí một chút để không đè lên nội dung */}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200 bg-white">
                  {imagePreview && (
                    <div className="mb-3 flex items-start gap-3">
                      <div className="outline-none border-none rounded-lg shadow-sm overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Ảnh preview"
                          className="h-28 w-28 object-cover select-none"
                          draggable={false}
                        />
                      </div>
                      <button
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedImage(null);
                        }}
                        className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Xóa ảnh
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center text-gray-600 hover:text-blue-600 shadow-sm min-w-[48px] h-12"
                      title="Đính kèm ảnh"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.485 8.485L20.5 13"
                        />
                      </svg>
                    </button>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Nhập tin nhắn..."
                      rows={1}
                      onKeyDown={handleKeyDown}
                      className="
        flex-1 px-5 py-3.5 border border-gray-300 rounded-full 
        focus:outline-none focus:ring-0 focus:border-gray-300 focus:shadow-md
        transition-all shadow-sm hover:shadow 
        resize-none min-h-[52px] max-h-[160px] 
        overflow-y-auto break-all hyphens-auto leading-6 text-base
      "
                    />

                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() && !selectedImage}
                      className={`
        min-w-[88px] px-7 py-3.5 rounded-full font-medium transition-all shadow-sm h-12 flex items-center justify-center text-base
        ${
          replyText.trim() || selectedImage
            ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }
      `}
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
                {/* Thay thế thẻ <svg> bằng Icon của thư viện */}
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
