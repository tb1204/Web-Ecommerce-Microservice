

import { useState, useCallback } from "react";
import { MessageCircle, X } from "lucide-react";
import UserChatPage from "../../pages/UserchatPage";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleOpen = () => {
    setOpen(true);
    setUnreadCount(0);
  };

  const handleNewAdminMessage = useCallback(() => {
    setUnreadCount((prev) => prev + 1);
  }, []);

  return (
    <>
      <button
        onClick={handleOpen}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#1a4d32] text-white rounded-full shadow-2xl z-[990] flex items-center justify-center hover:scale-110 transition-all origin-center ${
          open ? "opacity-0 pointer-events-none scale-50" : "opacity-100 pointer-events-auto scale-100"
        }`}
      >
        <MessageCircle size={26} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-black min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow-md border-2 border-white animate-bounce pointer-events-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* 🔥 Khung chat */}
      <div
        className={`fixed bottom-6 right-6 w-[360px] md:w-[420px] h-[520px] bg-white rounded-2xl shadow-2xl z-[999] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-50 pointer-events-none translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-[#1a4d32] text-white shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} />
            <span className="font-semibold text-sm">Chat hỗ trợ</span>
          </div>
          <button onClick={() => setOpen(false)} className="hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Nội dung chat */}
        <div className="flex-1 overflow-hidden relative">
          <UserChatPage
            isWidgetOpen={open}
            onNewAdminMessage={() => {
              if (!open) {
                handleNewAdminMessage();
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
