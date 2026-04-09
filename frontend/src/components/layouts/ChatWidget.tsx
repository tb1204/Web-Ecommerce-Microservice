// import { useState, Component } from "react";
// import type { ReactNode } from "react";
// import { MessageCircle, X } from "lucide-react";
// import UserChatPage from "../../pages/UserchatPage";

// // ✅ Error Boundary để nếu UserChatPage crash thì chỉ mất nội dung chat
// // chứ không mất cả nút mở chat bên ngoài
// class ChatErrorBoundary extends Component<
//   { children: ReactNode },
//   { hasError: boolean }
// > {
//   constructor(props: { children: ReactNode }) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error) {
//     console.error("ChatWidget error caught by boundary:", error);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 px-4">
//           <MessageCircle size={32} className="text-gray-300" />
//           <p className="text-sm text-center">
//             Không thể tải chat.<br />Vui lòng thử lại sau.
//           </p>
//           <button
//             onClick={() => this.setState({ hasError: false })}
//             className="text-xs text-emerald-600 hover:underline"
//           >
//             Thử lại
//           </button>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// const ChatWidget = () => {
//   const [open, setOpen] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const handleOpen = () => {
//     setOpen(true);
//     setUnreadCount(0); // reset badge khi mở
//   };

//   const handleNewAdminMessage = () => {
//     // Chỉ tăng badge khi widget đang đóng
//     if (!open) {
//       setUnreadCount((prev) => prev + 1);
//     }
//   };

//   return (
//     <>
//       {/* Nút mở chat — luôn hiển thị khi widget đóng */}
//       {!open && (
//         <button
//           id="chat-widget-btn"
//           onClick={handleOpen}
//           className="fixed bottom-6 right-6 w-14 h-14 bg-[#1a4d32] text-white rounded-full shadow-2xl z-[999] flex items-center justify-center hover:scale-110 transition-all relative"
//         >
//           <MessageCircle size={26} />
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-md border-2 border-white animate-bounce">
//               {unreadCount > 9 ? "9+" : unreadCount}
//             </span>
//           )}
//         </button>
//       )}

//       {/* Widget khung chat */}
//       <div
//         className={`fixed bottom-6 right-6 w-[360px] md:w-[420px] h-[520px] bg-white rounded-2xl shadow-2xl z-[999] flex flex-col overflow-hidden transition-all duration-300 ${
//           open
//             ? "opacity-100 scale-100 pointer-events-auto"
//             : "opacity-0 scale-95 pointer-events-none"
//         }`}
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center px-4 py-3 border-b bg-[#1a4d32] text-white shrink-0">
//           <div className="flex items-center gap-2">
//             <MessageCircle size={16} />
//             <span className="font-semibold text-sm">Chat hỗ trợ</span>
//           </div>
//           <button
//             onClick={() => setOpen(false)}
//             className="hover:bg-white/20 rounded-lg p-1 transition-colors"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Nội dung chat — bọc trong ErrorBoundary để tránh crash nút widget */}
//         <div className="flex-1 overflow-hidden">
//           <ChatErrorBoundary>
//             <UserChatPage
//               isWidgetOpen={open}
//               onNewAdminMessage={handleNewAdminMessage}
//             />
//           </ChatErrorBoundary>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChatWidget;

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import UserChatPage from "../../pages/UserchatPage";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#1a4d32] text-white rounded-full shadow-2xl z-[999] flex items-center justify-center hover:scale-110 transition-all"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* 🔥 Khung chat */}
      {open && (
        <div className="fixed bottom-6 right-6 w-[360px] md:w-[420px] h-[520px] bg-white rounded-2xl shadow-2xl z-[999] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b bg-[#1a4d32] text-white">
            <span className="font-semibold text-sm">Chat hỗ trợ</span>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Nội dung chat */}
          <div className="flex-1 overflow-hidden">
            <UserChatPage />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
