// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { useAuth, useUser } from "@clerk/clerk-react";
// import axios from "axios";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";
// import { toast } from "sonner";
// import {
//   Send,
//   X,
//   Loader2,
//   MessageCircle,
//   Bot,
//   UserCircle2,
//   ShieldCheck,
//   ChevronDown,
//   CheckCheck,
//   Paperclip,
// } from "lucide-react";

// interface Message {
//   id: string;
//   conversationId: string;
//   senderId: string;
//   senderRole: "USER" | "ADMIN" | "BOT";
//   type: "TEXT" | "IMAGE" | "VIDEO" | "SYSTEM";
//   content: string;
//   mediaUrl?: string | null;
//   thumbnailUrl?: string | null;
//   mimeType?: string | null;
//   mediaSize?: number | null;
//   isDeleted: boolean;
//   metadata?: {
//     intent?: string;
//     confidence?: number;
//     isBotResponse?: boolean;
//     botFallback?: boolean;
//     quickReplies?: string[];
//   };
//   createdAt: string;
// }

// interface Conversation {
//   id: string;
//   userId: string;
//   adminId?: string | null;
//   status: "WAITING" | "ACTIVE" | "BOT_ONLY" | "CLOSED";
//   lastMessage?: string | null;
//   lastMessageAt?: string | null;
//   botEnabled: boolean;
//   handoffToAdmin: boolean;
//   userDisplayName?: string;
//   userAvatarUrl?: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// const API_BASE = "http://localhost:8086/api/chat";
// const WS_URL = "http://localhost:8086/ws";

// const formatTime = (iso: string) =>
//   new Date(iso).toLocaleTimeString("vi-VN", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

// const formatDate = (iso: string) => {
//   const d = new Date(iso);
//   const today = new Date();
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);
//   if (d.toDateString() === today.toDateString()) return "Hôm nay";
//   if (d.toDateString() === yesterday.toDateString()) return "Hôm qua";
//   return d.toLocaleDateString("vi-VN");
// };

// const groupByDate = (messages: Message[]) => {
//   const groups: { date: string; messages: Message[] }[] = [];
//   let currentDate = "";
//   messages.forEach((msg) => {
//     const date = formatDate(msg.createdAt);
//     if (date !== currentDate) {
//       currentDate = date;
//       groups.push({ date, messages: [msg] });
//     } else {
//       groups[groups.length - 1].messages.push(msg);
//     }
//   });
//   return groups;
// };

// const UserChatPage: React.FC = () => {
//   const { getToken } = useAuth();
//   // FIX 1: dùng isLoaded để biết Clerk đã fetch xong user chưa
//   const { user: clerkUser, isLoaded: isUserLoaded } = useUser();

//   const [conversation, setConversation] = useState<Conversation | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [showScrollBtn, setShowScrollBtn] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);
//   const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const messagesContainerRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const stompClientRef = useRef<Client | null>(null);
//   const tokenRef = useRef<string>("");
//   const convIdRef = useRef<string>("");
//   // FIX 2: chống double-init trong React StrictMode
//   const initCalledRef = useRef(false);

//   const scrollToBottom = useCallback((smooth = true) => {
//     messagesEndRef.current?.scrollIntoView({
//       behavior: smooth ? "smooth" : "instant",
//     });
//   }, []);

//   // Xóa tin nhắn
//   const handleDeleteMessage = async (messageId: string) => {
//     if (!messageId || sending) return;

//     // Không cho xóa tin nhắn của người khác
//     const message = messages.find((m) => m.id === messageId);
//     //user có nó mới xóa được ttin nhắn
//     if (!message || message.senderId !== clerkUser?.id) {
//       return;
//     }
//     // if (!message || message.senderRole !== "USER") return;

//     try {
//       const token = tokenRef.current;
//       if (!token) return;

//       // Gọi API xóa
//       await axios.delete(`${API_BASE}/messages/${messageId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Xóa khỏi UI
//       setMessages((prev) => prev.filter((m) => m.id !== messageId));

//       setShowDeleteMenu(null);
//     } catch (err) {
//       console.error("Delete message error:", err);
//       toast.error("Không thể xóa tin nhắn lúc này. Vui lòng thử lại.");
//     }
//   };

//   const handleScroll = () => {
//     const el = messagesContainerRef.current;
//     if (!el) return;
//     setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
//   };

//   const connectWebSocket = useCallback(
//     (convId: string, token: string) => {
//       if (stompClientRef.current?.connected) return;

//       const client = new Client({
//         webSocketFactory: () => new SockJS(WS_URL),
//         connectHeaders: { Authorization: `Bearer ${token}` },
//         reconnectDelay: 5000,
//         onConnect: () => {
//           setIsConnected(true);
//           client.subscribe(`/topic/conversation.${convId}`, (frame) => {
//             try {
//               const incoming = JSON.parse(frame.body);
//               // Nếu là ConversationResponse → update conversation state
//               if (
//                 incoming.status !== undefined &&
//                 incoming.userId !== undefined
//               ) {
//                 setConversation((prev) =>
//                   prev ? { ...prev, ...incoming } : prev,
//                 );
//                 return;
//               }
//               // Là Message
//               setMessages((prev) => {
//                 const isDup = prev.some(
//                   (m) => m.id === incoming.id && !m.id.startsWith("temp_"),
//                 );
//                 if (isDup) return prev;
//                 const replaced = prev.map((m) =>
//                   m.id.startsWith("temp_") &&
//                   m.content === incoming.content &&
//                   m.senderRole === incoming.senderRole
//                     ? incoming
//                     : m,
//                 );
//                 const wasReplaced = replaced.some((m) => m.id === incoming.id);
//                 return wasReplaced ? replaced : [...prev, incoming];
//               });
//               setTimeout(() => scrollToBottom(), 50);
//             } catch (e) {
//               console.error("Parse WS message error:", e);
//             }
//           });
//         },
//         onDisconnect: () => setIsConnected(false),
//         onStompError: (frame) =>
//           console.error("STOMP error:", frame.headers["message"]),
//       });

//       client.activate();
//       stompClientRef.current = client;
//     },
//     [scrollToBottom],
//   );

//   // FIX 3: useEffect phụ thuộc vào isUserLoaded — chỉ chạy khi Clerk đã có user data
//   useEffect(() => {
//     if (!isUserLoaded) return; // chờ Clerk load xong
//     if (initCalledRef.current) return; // chống StrictMode double-run
//     initCalledRef.current = true;

//     const init = async () => {
//       try {
//         const token = await getToken({ template: "my-backend" });
//         if (!token) return;
//         tokenRef.current = token;

//         const convRes = await axios.get(`${API_BASE}/conversations/my`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const convList: Conversation[] = convRes.data;
//         const openConv = convList.find(
//           (c) => c.status === "WAITING" || c.status === "ACTIVE",
//         );

//         let targetConv: Conversation;
//         if (openConv) {
//           targetConv = openConv;
//           setConversation(openConv);
//           const msgRes = await axios.get(
//             `${API_BASE}/messages/${openConv.id}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             },
//           );
//           setMessages(msgRes.data);
//           setTimeout(() => scrollToBottom(false), 100);
//         } else {
//           // FIX 4: clerkUser đã load xong → lấy tên và avatar thật
//           const displayName =
//             clerkUser?.fullName ||
//             [clerkUser?.firstName, clerkUser?.lastName]
//               .filter(Boolean)
//               .join(" ") ||
//             clerkUser?.username ||
//             "Khách hàng";

//           const res = await axios.post(
//             `${API_BASE}/conversations`,
//             {
//               firstMessage: null,
//               userDisplayName: displayName,
//               userAvatarUrl: clerkUser?.imageUrl || null,
//             },
//             { headers: { Authorization: `Bearer ${token}` } },
//           );
//           targetConv = res.data;
//           setConversation(res.data);
//         }

//         convIdRef.current = targetConv.id;
//         connectWebSocket(targetConv.id, token);
//       } catch (err) {
//         console.error("Init chat error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     init();
//     return () => {
//       stompClientRef.current?.deactivate();
//     };
//   }, [isUserLoaded]); // ← key fix: dependency là isUserLoaded

//   useEffect(() => {
//     if (messages.length > 0) {
//       const el = messagesContainerRef.current;
//       if (!el) return;
//       if (el.scrollHeight - el.scrollTop - el.clientHeight < 300)
//         scrollToBottom();
//     }
//   }, [messages]);

//   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setText(e.target.value);

//     const ta = e.target;
//     ta.style.height = "auto";
//     const newHeight = Math.min(ta.scrollHeight, 70);
//     ta.style.height = newHeight + "px";
//   };
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const isImage = file.type.startsWith("image/");
//     const isVideo = file.type.startsWith("video/");

//     if (!isImage && !isVideo) {
//       toast.error("Chỉ hỗ trợ ảnh và video!");
//       return;
//     }

//     if (isImage && file.size > 5 * 1024 * 1024) {
//       toast.error("Ảnh không được vượt quá 5MB");
//       return;
//     }
//     if (isVideo && file.size > 50 * 1024 * 1024) {
//       toast.error("Video không được vượt quá 50MB");
//       return;
//     }

//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const removeImage = () => {
//     setImageFile(null);
//     setImagePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleSend = async () => {
//     if ((!text.trim() && !imageFile) || sending || !conversation) return;
//     if (conversation.status === "CLOSED") return;

//     const token = tokenRef.current;
//     const convId = convIdRef.current;
//     setSending(true);

//     try {
//       if (imageFile) {
//         const isVideo = imageFile.type.startsWith("video/");
//         const endpoint = isVideo ? "/media/video" : "/media/image";

//         const formData = new FormData();
//         formData.append("file", imageFile);

//         const uploadRes = await axios.post(`${API_BASE}${endpoint}`, formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         });

//         const { url, thumbnailUrl, mimeType, mediaSize, duration } =
//           uploadRes.data;

//         const messageType = isVideo ? "VIDEO" : "IMAGE";

//         stompClientRef.current?.publish({
//           destination: "/app/chat.send",
//           body: JSON.stringify({
//             conversationId: convId,
//             type: messageType,
//             content: isVideo ? "Video" : "Hình ảnh",
//             mediaUrl: url,
//             thumbnailUrl: thumbnailUrl || url,
//             mimeType,
//             mediaSize,
//             duration: isVideo ? duration : undefined,
//           }),
//         });

//         // Optimistic UI
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: `temp_${Date.now()}`,
//             conversationId: convId,
//             senderId: clerkUser?.id ?? "",
//             senderRole: "USER",
//             type: messageType,
//             content: isVideo ? "Video" : "Hình ảnh",
//             mediaUrl: url,
//             thumbnailUrl: thumbnailUrl || url,
//             mimeType,
//             mediaSize,
//             duration: isVideo ? duration : undefined,
//             isDeleted: false,
//             createdAt: new Date().toISOString(),
//           },
//         ]);

//         removeImage();
//       }

//       if (text.trim()) {
//         const msgText = text.trim();
//         setText("");
//         if (textareaRef.current) textareaRef.current.style.height = "auto";

//         setMessages((prev) => [
//           ...prev,
//           {
//             id: `temp_${Date.now()}`,
//             conversationId: convId,
//             senderId: clerkUser?.id ?? "",
//             senderRole: "USER",
//             type: "TEXT",
//             content: msgText,
//             isDeleted: false,
//             createdAt: new Date().toISOString(),
//           },
//         ]);

//         stompClientRef.current?.publish({
//           destination: "/app/chat.send",
//           body: JSON.stringify({
//             conversationId: convId,
//             type: "TEXT",
//             content: msgText,
//           }),
//         });
//       }

//       scrollToBottom();
//     } catch (err) {
//       console.error("Send error:", err);
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const handleQuickReply = (reply: string) => {
//     setText(reply);
//     textareaRef.current?.focus();
//   };

//   const getStatusInfo = () => {
//     if (!conversation) return null;
//     switch (conversation.status) {
//       case "WAITING":
//         return {
//           label: "Đang chờ kết nối",
//           color: "text-amber-500",
//           dot: "bg-amber-400 animate-pulse",
//         };
//       case "ACTIVE":
//         return {
//           label: conversation.handoffToAdmin
//             ? "Đang chat với shop"
//             : "Trợ lý AI đang hỗ trợ",
//           color: "text-emerald-600",
//           dot: "bg-emerald-500",
//         };
//       case "CLOSED":
//         return {
//           label: "Cuộc trò chuyện đã kết thúc",
//           color: "text-gray-400",
//           dot: "bg-gray-400",
//         };
//       default:
//         return null;
//     }
//   };

//   // Hàm gửi nhanh khi bấm vào gợi ý
//   const handleSendQuickReply = async (message: string) => {
//     if (!conversation || sending || message.trim() === "") return;
//     if (conversation.status === "CLOSED") return;

//     // const token = tokenRef.current;
//     const convId = convIdRef.current;

//     setSending(true);

//     try {
//       // Thêm tin nhắn vào UI ngay lập tức (optimistic)
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: `temp_${Date.now()}`,
//           conversationId: convId,
//           senderId: clerkUser?.id ?? "",
//           senderRole: "USER",
//           type: "TEXT",
//           content: message,
//           isDeleted: false,
//           createdAt: new Date().toISOString(),
//         },
//       ]);

//       // Gửi qua WebSocket
//       stompClientRef.current?.publish({
//         destination: "/app/chat.send",
//         body: JSON.stringify({
//           conversationId: convId,
//           type: "TEXT",
//           content: message,
//         }),
//       });

//       scrollToBottom();
//     } catch (err) {
//       console.error("Send quick reply error:", err);
//     } finally {
//       setSending(false);
//     }
//   };
//   const messageGroups = groupByDate(messages);

//   // Chờ cả Clerk load và API init xong
//   if (!isUserLoaded || loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
//         <div className="text-center">
//           <div className="relative w-16 h-16 mx-auto mb-4">
//             <div className="absolute inset-0 rounded-full border-4 border-green-100" />
//             <div className="absolute inset-0 rounded-full border-4 border-t-green-600 animate-spin" />
//           </div>
//           <p className="text-gray-500 font-medium">Đang kết nối hỗ trợ...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex flex-col">
//       <div className="flex-1 max-w-3xl w-full mx-auto px-4 relative">
//         <div
//           ref={messagesContainerRef}
//           onScroll={handleScroll}
//           className="h-[calc(100vh-200px)] overflow-y-auto py-6 space-y-1 scroll-smooth"
//           style={{
//             scrollbarWidth: "thin",
//             scrollbarColor: "#d1fae5 transparent",
//           }}
//         >
//           {messages.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//               <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-5 shadow-lg shadow-emerald-200">
//                 <MessageCircle size={36} className="text-white" />
//               </div>
//               <h2 className="text-xl font-bold text-gray-800 mb-2">
//                 Xin chào! 👋
//               </h2>
//               <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-6">
//                 Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy nhắn tin để được giải
//                 đáp ngay!
//               </p>

//               {/* Quick Replies - Bấm là gửi luôn */}
//               <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
//                 {[
//                   "Tôi muốn hỏi về sản phẩm",
//                   "Tình trạng đơn hàng",
//                   "Chính sách bảo hành",
//                   "Liên hệ tư vấn",
//                 ].map((q) => (
//                   <button
//                     key={q}
//                     onClick={() => handleSendQuickReply(q)}
//                     className="text-left px-4 py-3 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl transition-all active:scale-[0.97] shadow-sm"
//                   >
//                     {q}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {messageGroups.map((group) => (
//             <div key={group.date}>
//               <div className="flex items-center gap-3 my-4">
//                 <div className="flex-1 h-px bg-gray-100" />
//                 <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
//                   {group.date}
//                 </span>
//                 <div className="flex-1 h-px bg-gray-100" />
//               </div>
//               {group.messages.map((msg, idx) => {
//                 const isUser = msg.senderRole === "USER";
//                 const isSystem = msg.type === "SYSTEM";
//                 const isBot = msg.senderRole === "BOT";
//                 const showAvatar =
//                   !isUser &&
//                   (idx === 0 ||
//                     group.messages[idx - 1]?.senderRole !== msg.senderRole);

//                 if (isSystem)
//                   return (
//                     <div key={msg.id} className="flex justify-center my-3">
//                       <span className="text-[11px] text-gray-400 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
//                         {msg.content}
//                       </span>
//                     </div>
//                   );
//                 return (
//                   <div
//                     key={msg.id}
//                     className={`flex items-start gap-2 mb-2 ${isUser ? "justify-end" : "justify-start"}`}
//                   >
//                     {!isUser && (
//                       <div className="shrink-0 w-7 h-7 mb-1">
//                         {showAvatar && (
//                           <div
//                             className={`w-7 h-7 rounded-full flex items-center justify-center ${isBot ? "bg-gradient-to-br from-blue-400 to-violet-500" : "bg-gradient-to-br from-emerald-500 to-teal-600"}`}
//                           >
//                             {isBot ? (
//                               <Bot size={14} className="text-white" />
//                             ) : (
//                               <ShieldCheck size={14} className="text-white" />
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     <div
//                       className={`max-w-[72%] flex flex-col ${isUser ? "items-end" : "items-start"}`}
//                     >
//                       {!isUser && showAvatar && (
//                         <span className="text-[11px] text-gray-400 ml-1 mb-1">
//                           {isBot ? "Trợ lý AI" : "Shop"}
//                         </span>
//                       )}

//                       {msg.isDeleted ? (
//                         <div
//                           className={`px-4 py-2.5 rounded-2xl text-sm italic text-gray-400 ${isUser ? "bg-gray-100 rounded-br-sm" : "bg-white border border-gray-100 rounded-bl-sm"}`}
//                         >
//                           Tin nhắn đã bị xóa
//                         </div>
//                       ) : msg.type === "IMAGE" && msg.mediaUrl ? (
//                         <div
//                           className={`overflow-hidden rounded-2xl shadow-sm ${isUser ? "rounded-br-sm" : "rounded-bl-sm"}`}
//                         >
//                           <img
//                             src={msg.mediaUrl}
//                             alt="Ảnh"
//                             className="max-w-[260px] max-h-[300px] object-cover cursor-pointer"
//                             onClick={() => window.open(msg.mediaUrl!, "_blank")}
//                           />
//                         </div>
//                       ) : msg.type === "VIDEO" && msg.mediaUrl ? (
//                         <div
//                           className={`overflow-hidden rounded-2xl shadow-sm ${isUser ? "rounded-br-sm" : "rounded-bl-sm"}`}
//                         >
//                           <video
//                             src={msg.mediaUrl}
//                             controls
//                             className="max-w-[260px] max-h-[300px] rounded-xl"
//                           />
//                         </div>
//                       ) : (
//                         <div className="relative group">
//                           {isUser ? (
//                             // Tin nhắn của người dùng - có nút xóa
//                             <div className="relative">
//                               <div className="px-4 py-3 rounded-2xl text-sm bg-green-500 text-white max-w-[280px] break-words">
//                                 {msg.content}
//                               </div>

//                               {/* Nút menu ⋯ */}
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   setShowDeleteMenu(
//                                     showDeleteMenu === msg.id ? null : msg.id,
//                                   );
//                                 }}
//                                 className="absolute -top-2 -right-2 w-7 h-7 bg-white hover:bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
//                               >
//                                 <span className="text-gray-500 text-lg leading-none">
//                                   ⋯
//                                 </span>
//                               </button>

//                               {/* Menu Xóa */}
//                               {showDeleteMenu === msg.id && (
//                                 <div className="absolute -top-12 right-0 bg-white shadow-xl border border-gray-200 rounded-xl py-1 z-30 w-40">
//                                   <button
//                                     onClick={() => handleDeleteMessage(msg.id)}
//                                     className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm font-medium"
//                                   >
//                                     🗑️ Xóa tin nhắn
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           ) : (
//                             // Tin nhắn của Bot / Admin
//                             <div className="px-4 py-3 rounded-2xl text-sm bg-gray-100">
//                               {msg.content}
//                             </div>
//                           )}
//                         </div>
//                       )}

//                       {/* Quick replies */}
//                       {msg.metadata?.quickReplies &&
//                         msg.metadata.quickReplies.length > 0 && (
//                           <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
//                             {msg.metadata.quickReplies.map((qr) => (
//                               <button
//                                 key={qr}
//                                 onClick={() => handleQuickReply(qr)}
//                                 className="text-xs px-3 py-1.5 bg-white text-emerald-700 border border-emerald-200 rounded-full hover:bg-emerald-50 font-medium shadow-sm"
//                               >
//                                 {qr}
//                               </button>
//                             ))}
//                           </div>
//                         )}

//                       <div
//                         className={`flex items-center gap-1 mt-1 ${isUser ? "mr-1" : "ml-1"}`}
//                       >
//                         <span className="text-[10px] text-gray-400">
//                           {formatTime(msg.createdAt)}
//                         </span>
//                         {isUser && (
//                           <CheckCheck size={12} className="text-emerald-400" />
//                         )}
//                       </div>
//                     </div>

//                     {isUser && (
//                       <div className="shrink-0 w-7 h-7 mb-1 rounded-full overflow-hidden bg-gradient-to-br from-slate-300 to-slate-400">
//                         {clerkUser?.imageUrl ? (
//                           <img
//                             src={clerkUser.imageUrl}
//                             alt=""
//                             className="w-full h-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center">
//                             <UserCircle2 size={16} className="text-white" />
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         {showScrollBtn && (
//           <button
//             onClick={() => scrollToBottom()}
//             className="absolute bottom-6 right-4 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50"
//           >
//             <ChevronDown size={18} className="text-gray-600" />
//           </button>
//         )}
//       </div>

//       {/* Input Bar */}
//       <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-lg z-10">
//         <div className="max-w-3xl mx-auto px-4 py-3">
//           {/* Preview ảnh/video */}
//           {imagePreview && (
//             <div className="mb-3 pl-14 pr-4">
//               <div className="relative inline-block">
//                 {imageFile?.type.startsWith("video/") ? (
//                   <video
//                     src={imagePreview}
//                     className="h-28 w-28 object-cover rounded-2xl border border-gray-200 shadow-sm"
//                     controls
//                   />
//                 ) : (
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="h-28 w-28 object-cover rounded-2xl border border-gray-200 shadow-sm"
//                   />
//                 )}
//                 <button
//                   onClick={removeImage}
//                   className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//             </div>
//           )}

//           {conversation?.status === "CLOSED" ? (
//             <div className="flex justify-center py-4">
//               <span className="bg-gray-100 text-gray-500 px-5 py-2.5 rounded-2xl text-sm">
//                 Cuộc trò chuyện đã kết thúc
//               </span>
//             </div>
//           ) : (
//             <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-3xl px-2 py-2 shadow-sm">
//               {/* Nút đính kèm */}
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="shrink-0 w-11 h-11 flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-gray-100 rounded-2xl transition-all self-end mb-1"
//               >
//                 <Paperclip size={22} />
//               </button>

//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="image/*,video/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />

//               {/* Textarea */}
//               <div className="flex-1 min-h-[44px]">
//                 <textarea
//                   ref={textareaRef}
//                   value={text}
//                   onChange={handleTextChange}
//                   onKeyDown={handleKeyDown}
//                   placeholder="Nhắn tin hỗ trợ..."
//                   rows={1}
//                   className="w-full bg-transparent resize-none text-sm text-gray-700 placeholder:text-gray-400 outline-none py-3 px-3 leading-6 max-h-[120px] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
//                   style={{ minHeight: "44px" }}
//                 />
//               </div>

//               {/* Nút gửi */}
//               <button
//                 onClick={handleSend}
//                 disabled={(!text.trim() && !imageFile) || sending}
//                 className={`shrink-0 w-11 h-11 flex items-center justify-center rounded-2xl transition-all self-end mb-1 ${
//                   (text.trim() || imageFile) && !sending
//                     ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md hover:brightness-105 active:scale-95"
//                     : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 {sending ? (
//                   <Loader2 size={20} className="animate-spin" />
//                 ) : (
//                   <Send size={20} />
//                 )}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserChatPage;

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

const API_BASE = "http://localhost:8086/api/chat";
const WS_URL = "http://localhost:8086/ws";

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

const UserChatPage: React.FC = () => {
  const { getToken } = useAuth();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();

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
                const isDup = prev.some(
                  (m) => m.id === incoming.id && !m.id.startsWith("temp_"),
                );
                if (isDup) return prev;
                const replaced = prev.map((m) =>
                  m.id.startsWith("temp_") &&
                  m.content === incoming.content &&
                  m.senderRole === incoming.senderRole
                    ? incoming
                    : m,
                );
                const wasReplaced = replaced.some((m) => m.id === incoming.id);
                return wasReplaced ? replaced : [...prev, incoming];
              });

              // ✅ Nếu là tin nhắn từ admin/bot, user đang scroll lên → hiện notification
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

  useEffect(() => {
    if (!isUserLoaded) return;
    if (initCalledRef.current) return;
    initCalledRef.current = true;

    const init = async () => {
      try {
        const token = await getToken({ template: "my-backend" });
        if (!token) return;
        tokenRef.current = token;

        const convRes = await axios.get(`${API_BASE}/conversations/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const convList: Conversation[] = convRes.data;
        const openConv = convList.find(
          (c) => c.status === "WAITING" || c.status === "ACTIVE",
        );

        let targetConv: Conversation;
        if (openConv) {
          targetConv = openConv;
          setConversation(openConv);
          const msgRes = await axios.get(
            `${API_BASE}/messages/${openConv.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setMessages(msgRes.data);
          setTimeout(() => scrollToBottom(false), 100);
        } else {
          const displayName =
            clerkUser?.fullName ||
            [clerkUser?.firstName, clerkUser?.lastName]
              .filter(Boolean)
              .join(" ") ||
            clerkUser?.username ||
            "Khách hàng";

          const res = await axios.post(
            `${API_BASE}/conversations`,
            {
              firstMessage: null,
              userDisplayName: displayName,
              userAvatarUrl: clerkUser?.imageUrl || null,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          targetConv = res.data;
          setConversation(res.data);
        }

        convIdRef.current = targetConv.id;
        connectWebSocket(targetConv.id, token);
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
    if ((!text.trim() && !imageFile) || sending || !conversation) return;
    if (conversation.status === "CLOSED") return;
    const token = tokenRef.current;
    const convId = convIdRef.current;
    setSending(true);
    try {
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
      if (text.trim()) {
        const msgText = text.trim();
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
    if (!conversation || sending || !message.trim()) return;
    if (conversation.status === "CLOSED") return;
    const convId = convIdRef.current;
    setSending(true);
    try {
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
      scrollToBottom();
    } catch (err) {
      console.error("Send quick reply error:", err);
    } finally {
      setSending(false);
    }
  };

  const messageGroups = groupByDate(messages);

  if (!isUserLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 dark:border-emerald-900" />
            <div className="absolute inset-0 rounded-full border-4 border-t-emerald-600 animate-spin" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Đang kết nối hỗ trợ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 relative">
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
          className="h-[calc(100vh-200px)] overflow-y-auto py-6 space-y-1 scroll-smooth"
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
        <div className="max-w-3xl mx-auto px-4 py-3">
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
