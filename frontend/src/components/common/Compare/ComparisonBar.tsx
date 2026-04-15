

import { useState } from "react";
import { X, Trash2, Minus, Maximize2 } from "lucide-react";
import { useCompare } from "./CompareContext";
import { toast } from "sonner";
import CompareModal from "./CompareModal";

const ComparisonBar = () => {
  const { compareItems, removeFromCompare, clearCompare, maxItems } =
    useCompare();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (compareItems.length === 0) return null;

  const handleCompareClick = () => {
    if (compareItems.length < 2) {
      toast.error("Vui lòng chọn ít nhất 2 sản phẩm để so sánh!");
      return;
    }
    setIsModalOpen(true);
  };

  // 👉 Nút thu nhỏ (đặt bên trái luôn)
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-[#1a4d32] text-white rounded-full shadow-2xl z-[998] flex items-center justify-center hover:scale-110 active:scale-95"
      >
        <div className="relative">
          <Maximize2 size={22} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {compareItems.length}
          </span>
        </div>
      </button>
    );
  }

  return (
    <>
      {/* ✅ Wrapper chia trái - phải */}
      <div className="fixed bottom-4 left-0 w-full px-4 z-[998]">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          {/* 🔥 LEFT: Compare Bar */}
          <div className="bg-white border shadow-xl rounded-xl px-3 py-2 flex items-center gap-3 max-w-[65%] overflow-hidden">
            {/* Danh sách sản phẩm */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {compareItems.map((item) => (
                <div
                  key={item.id}
                  className="relative w-14 h-14 md:w-16 md:h-16 border rounded-lg flex-shrink-0 bg-white"
                >
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeFromCompare(item.id)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 border-2 border-white"
                  >
                    <X className="w-2.5 h-2.5" strokeWidth={3} />
                  </button>
                </div>
              ))}

              {/* Ô trống */}
              {Array.from({
                length: Math.max(0, maxItems - compareItems.length),
              }).map((_, i) => (
                <div
                  key={i}
                  className="w-14 h-14 md:w-16 md:h-16 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300"
                >
                  +
                </div>
              ))}
            </div>

            {/* Nút */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={handleCompareClick}
                className="bg-[#1a4d32] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#2a6d4a]"
              >
                So sánh ({compareItems.length})
              </button>

              <button
                onClick={clearCompare}
                className="p-1.5 text-red-500 border rounded hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>

              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 text-gray-500 border rounded hover:bg-gray-50"
              >
                <Minus size={16} />
              </button>
            </div>
          </div>

          {/* 👉 RIGHT: CHỪA CHỖ CHO CHAT */}
          <div className="w-[360px] md:w-[420px]" />
        </div>
      </div>

      <CompareModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ComparisonBar;
