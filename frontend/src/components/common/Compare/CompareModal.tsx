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
  format?: (value: any) => string;
}

const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose }) => {
  const { compareItems } = useCompare();

  if (!isOpen) return null;

  const specs: CompareSpec[] = [
    { label: "Thương hiệu", key: "brand" },
    {
      label: "Giá hiện tại",
      key: "price",
      format: (v) => `${Number(v).toLocaleString("vi-VN")}₫`,
    },
    {
      label: "Giá gốc",
      key: "originalPrice",
      format: (v) => (v ? `${Number(v).toLocaleString("vi-VN")}₫` : "---"),
    },
    { label: "Đánh giá", key: "rating", format: (v) => `${v}/5 ⭐` },
    {
      label: "Tình trạng",
      key: "status",
      format: (v) => (v === "selling" ? "Còn hàng" : "Hết hàng"),
    },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* max-w-2xl cho mobile khi có ít SP và max-w-6xl cho PC */}
      <div className="bg-white w-full max-w-2xl md:max-w-6xl max-h-[85vh] md:max-h-[90vh] rounded-xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* HEADER */}
        <div className="p-3 md:p-4 border-b flex justify-between items-center bg-gray-50/50">
          <h2 className="text-sm md:text-xl font-bold text-[#1a4d32] uppercase tracking-tight">
            So sánh chi tiết
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 md:p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
          >
            <X size={18} className="md:w-6 md:h-6" />
          </button>
        </div>

        {/* BẢNG NỘI DUNG */}
        <div className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300">
          <div
            className="grid border-t border-l border-gray-100 min-w-[360px] md:min-w-full"
            style={{
              // Mobile: Cột tiêu đề 90px, PC: 120px. Sản phẩm tự chia đều.
              gridTemplateColumns: `clamp(90px, 15vw, 120px) repeat(${compareItems.length}, minmax(0, 1fr))`,
            }}
          >
            {/* HÀNG 1: ẢNH & TÊN */}
            <div className="bg-gray-50/80 font-bold border-b border-r border-gray-100 p-2 md:p-4 flex items-center justify-center text-[#1a4d32] text-[10px] md:text-sm text-center">
              Sản Phẩm
            </div>
            {compareItems.map((item) => (
              <div
                key={item.id}
                className="border-b border-r border-gray-100 p-2 md:p-4 text-center group bg-white"
              >
                <div className="w-14 h-14 md:w-28 md:h-28 mx-auto mb-2 md:mb-3 overflow-hidden rounded-lg shadow-sm border border-gray-50">
                  <img
                    src={item.images[0]?.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-[9px] md:text-sm font-bold text-gray-800 line-clamp-2 min-h-[24px] md:min-h-[40px] leading-tight px-1">
                  {item.name}
                </h3>
              </div>
            ))}

            {/* CÁC HÀNG THÔNG SỐ */}
            {specs.map((spec) => (
              <React.Fragment key={spec.key}>
                <div className="bg-gray-50/50 p-2 md:p-4 border-b border-r border-gray-100 text-[9px] md:text-xs font-bold uppercase text-gray-500 flex items-center justify-center text-center">
                  {spec.label}
                </div>
                {compareItems.map((item) => (
                  <div
                    key={`${item.id}-${spec.key}`}
                    className="p-2 md:p-4 border-b border-r border-gray-100 text-[10px] md:text-sm text-center font-medium text-gray-700 flex items-center justify-center bg-white px-1"
                  >
                    {spec.format
                      ? spec.format(item[spec.key])
                      : (item[spec.key] as React.ReactNode)}
                  </div>
                ))}
              </React.Fragment>
            ))}

            {/* HÀNG NÚT HÀNH ĐỘNG */}
            <div className="bg-gray-50/50 border-b border-r border-gray-100"></div>
            {compareItems.map((item) => (
              <div
                key={`btn-${item.id}`}
                className="p-2 md:p-4 border-b border-r border-gray-100 flex justify-center items-center bg-white px-1"
              >
                <button className="bg-[#1a4d32] text-white w-full md:w-auto px-2 md:px-6 py-1.5 md:py-2.5 rounded-md md:rounded-lg text-[8px] md:text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#2a6d4a] transition-all active:scale-95 shadow-md">
                  <ShoppingCart size={10} className="md:w-3.5 md:h-3.5" /> MUA
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
