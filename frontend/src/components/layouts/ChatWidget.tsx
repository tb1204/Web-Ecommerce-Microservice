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
