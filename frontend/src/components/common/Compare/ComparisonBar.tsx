// Thanh so sanh phia duoi
import { useState } from "react";
import { X, Trash2, Minus, Maximize2 } from "lucide-react";
import { useCompare } from "./CompareContext";
import { toast } from "sonner";
import CompareModal from "./CompareModal";

const ComparisonBar = () => {
  // Lấy thêm maxItems từ Context để biết giới hạn thiết bị hiện tại
  const { compareItems, removeFromCompare, clearCompare, maxItems } = useCompare();
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

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#1a4d32] text-white rounded-full shadow-2xl z-[999] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
      >
        <div className="relative">
          <Maximize2 size={24} />
          <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {compareItems.length}
          </span>
        </div>
      </button>
    );
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-[0_-5px_25px_rgba(0,0,0,0.2)] z-[998] py-2 md:py-3 px-4 animate-in slide-in-from-bottom duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3 md:gap-4">
          
          {/* Vùng hiển thị sản phẩm */}
          <div className="flex flex-1 gap-2 md:gap-4 overflow-x-auto w-full scrollbar-hide py-1">
            {/* Render các sản phẩm đã chọn */}
            {compareItems.map((item) => (
              <div key={item._id} className="relative w-16 h-16 md:w-20 md:h-20 border rounded-lg flex-shrink-0 group shadow-sm bg-white">
                <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                <button 
                  onClick={() => removeFromCompare(item._id)}
                  className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-all z-20 border-2 border-white"
                >
                  <X className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={3} />
                </button>
              </div>
            ))}

            {/* Render các ô trống CĂN CỨ THEO THIẾT BỊ (maxItems) */}
            {Array.from({ length: Math.max(0, maxItems - compareItems.length) }).map((_, i) => (
              <div 
                key={`empty-${i}`} 
                className="w-16 h-16 md:w-20 md:h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 text-lg font-light bg-gray-50/30 flex-shrink-0"
              >
                +
              </div>
            ))}
          </div>

          {/* Cụm nút chức năng */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <button 
              onClick={handleCompareClick}
              className="flex-1 md:flex-none bg-[#1a4d32] text-white px-4 md:px-8 py-2 md:py-2.5 rounded-lg font-bold text-[11px] md:text-sm uppercase hover:bg-opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              So sánh ngay ({compareItems.length})
            </button>
            <div className="flex gap-2">
              <button onClick={clearCompare} className="p-1.5 md:p-2 text-red-500 border border-red-100 rounded-lg hover:bg-red-50 shadow-sm transition-colors" title="Xóa tất cả"><Trash2 size={18} /></button>
              <button onClick={() => setIsMinimized(true)} className="p-1.5 md:p-2 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm" title="Thu nhỏ"><Minus size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      <CompareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ComparisonBar;