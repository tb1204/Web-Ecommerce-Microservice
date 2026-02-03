import  { useState } from "react";
import { X, Trash2, Minus, Maximize2 } from "lucide-react";
import { useCompare } from "./CompareContext";
import { toast } from "sonner"; // Import để hiện cảnh báo
import CompareModal from "./CompareModal"; // Import component bảng mới

const ComparisonBar = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở bảng chi tiết

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
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-[0_-5px_25px_rgba(0,0,0,0.2)] z-[998] py-3 px-4 animate-in slide-in-from-bottom duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="flex flex-1 gap-4 overflow-x-auto w-full scrollbar-hide py-2">
            {compareItems.map((item) => (
              <div key={item._id} className="relative w-20 h-20 border rounded-lg flex-shrink-0 group shadow-sm">
                <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                <button 
                  onClick={() => removeFromCompare(item._id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-all z-20 border-2 border-white"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
            {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
              <div key={i} className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 text-xl font-light bg-gray-50/50">+</div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleCompareClick}
              className="bg-[#1a4d32] text-white px-8 py-2.5 rounded-lg font-bold text-sm uppercase hover:bg-opacity-90 transition-all shadow-md active:scale-95"
            >
              So sánh ngay ({compareItems.length})
            </button>
            <div className="flex flex-col gap-1.5">
              <button onClick={clearCompare} className="p-2 text-red-500 border border-red-100 rounded-lg hover:bg-red-50 shadow-sm transition-colors"><Trash2 size={18} /></button>
              <button onClick={() => setIsMinimized(true)} className="p-2 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm"><Minus size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Render Modal bảng so sánh */}
      <CompareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ComparisonBar;