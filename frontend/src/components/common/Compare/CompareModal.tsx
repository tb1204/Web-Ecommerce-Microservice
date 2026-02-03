// Bang so sanh
import React from "react";
import { X, ShoppingCart } from "lucide-react";
import { useCompare } from "./CompareContext";
import type { Product } from "../../Products/InterfaceItem";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CompareSpec {
  label: string;
  key: keyof Product; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format?: (value: any) => string;
}

const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose }) => {
  const { compareItems } = useCompare();

  if (!isOpen) return null;

  // Danh sach tieu chi so sanh
  const specs: CompareSpec[] = [
    { label: "Thương hiệu", key: "brand" },
    { 
      label: "Giá hiện tại", 
      key: "price", 
      format: (v) => `${Number(v).toLocaleString("vi-VN")}₫` 
    },
    { 
      label: "Giá gốc", 
      key: "originalPrice", 
      format: (v) => v ? `${Number(v).toLocaleString("vi-VN")}₫` : "---" 
    },
    { label: "Đánh giá", key: "rating", format: (v) => `${v}/5 ⭐` },
    { 
      label: "Tình trạng", 
      key: "status", 
      format: (v) => v === "selling" ? "Còn hàng" : "Hết hàng" 
    },
  ];

  // LOGIC TÍNH TOÁN SỐ CỘT LINH HOẠT
  const gridCols = compareItems.length + 1;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-[#1a4d32] uppercase tracking-tight">
            So sánh chi tiết
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* BẢNG NỘI DUNG */}
        <div className="overflow-auto p-4 md:p-6 flex-1 scrollbar-thin scrollbar-thumb-gray-300">
          <div 
            className="grid border-t border-l border-gray-100 min-w-[800px]"
            // THAY ĐỔI TẠI ĐÂY: Sử dụng style inline để điều khiển grid-template-columns
            style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
          >
            
            {/* Cột tiêu đề chung */}
            <div className="bg-gray-50/80 font-bold border-b border-r border-gray-100 p-4 flex items-center justify-center text-[#1a4d32]">
              Sản Phẩm
            </div>

            {/* Render Hình ảnh & Tên */}
            {compareItems.map((item) => (
              <div key={item._id} className="border-b border-r border-gray-100 p-4 text-center group">
                <div className="w-28 h-28 mx-auto mb-3 overflow-hidden rounded-lg shadow-sm border border-gray-50">
                  <img 
                    src={item.images[0]?.url} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[40px] leading-snug">
                  {item.name}
                </h3>
              </div>
            ))}

            {/* Render các hàng thông số */}
            {specs.map((spec) => (
              <React.Fragment key={spec.key}>
                <div className="bg-gray-50/50 p-4 border-b border-r border-gray-100 text-xs font-bold uppercase text-gray-500 flex items-center">
                  {spec.label}
                </div>
                {compareItems.map((item) => (
                  <div 
                    key={`${item._id}-${spec.key}`} 
                    className="p-4 border-b border-r border-gray-100 text-sm text-center font-medium text-gray-700 flex items-center justify-center"
                  >
                    {spec.format 
                      ? spec.format(item[spec.key]) 
                      : (item[spec.key] as React.ReactNode)
                    }
                  </div>
                ))}
              </React.Fragment>
            ))}

            {/* Hàng nút hành động */}
            <div className="bg-gray-50/50 border-b border-r border-gray-100"></div>
            {compareItems.map((item) => (
              <div key={`btn-${item._id}`} className="p-4 border-b border-r border-gray-100 flex justify-center items-center">
                <button className="bg-[#1a4d32] text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-[#2a6d4a] transition-all active:scale-95 shadow-md">
                  <ShoppingCart size={14} /> MUA NGAY
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;