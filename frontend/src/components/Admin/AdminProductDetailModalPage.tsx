import React, { useState, useEffect } from "react";
import { 
  X, Info, Fingerprint, MapPin, Award, Ruler, Weight, ShieldCheck, 
  Tag, Warehouse, Clock, History, Image as ImageIcon, Layers, PencilLine 
} from "lucide-react";
import type{ Product } from "../Products/InterfaceItem"; 

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, product, onEdit }) => {
  const [clickedImage, setClickedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setClickedImage(null);
  }, [isOpen, product?._id]);

  if (!isOpen || !product) return null;

  const primaryImg = product.images?.find((img) => img.is_primary)?.url;
  const defaultImage = primaryImg || product.images?.[0]?.url || "";
  const displayImage = clickedImage || defaultImage;

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "Chưa cập nhật";
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border">
        
        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center bg-emerald-600 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><Info size={20} /></div>
            <div>
              <h2 className="font-bold text-lg leading-none">Chi tiết sản phẩm</h2>
              <p className="text-[11px] text-emerald-100 mt-1 uppercase tracking-widest font-medium italic">
                Mã nội bộ: {product.product_code || "CHƯA CÓ MÃ"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-700 rounded-full transition-all"><X size={24} /></button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* ALBUM ẢNH */}
            <div className="w-full lg:w-[400px] space-y-4 flex-shrink-0">
              <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-emerald-50 shadow-md bg-gray-50 group">
                <img 
                  src={displayImage} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt={product.name} 
                />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg ${product.status === 'selling' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {product.status === 'selling' ? 'Đang bán' : 'Ngừng bán'}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {product.images?.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setClickedImage(img.url)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${displayImage === img.url ? 'border-emerald-500 scale-105 shadow-md' : 'border-transparent hover:border-emerald-200'}`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" alt="" />
                    {img.is_primary && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* THÔNG TIN CHỮ */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-3xl font-black text-gray-900 leading-tight mb-4">{product.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-xl border flex items-center gap-1.5"><Fingerprint size={14}/> SKU: {product.sku}</span>
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-xl border border-emerald-100 uppercase">
                    <Layers size={14} className="inline mr-1"/> {product.category?.name} ({product.category?.code})
                  </span>
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-xl border border-blue-100 flex items-center gap-1.5"><MapPin size={14}/> {product.origin}</span>
                </div>
              </div>

              {/* GIÁ CẢ */}
              <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1">Giá bán hiện tại</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-emerald-600">{product.price?.toLocaleString("vi-VN")}₫</span>
                    {product.originalPrice && product.originalPrice > 0 && (
                      <span className="text-lg text-gray-300 line-through font-medium italic">
                        Gốc: {product.originalPrice?.toLocaleString("vi-VN")}₫
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right border-l border-emerald-100 pl-6">
                   <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Thương hiệu</p>
                   <p className="text-lg font-black text-gray-700 uppercase tracking-tighter">{product.brand || "Artisano"}</p>
                </div>
              </div>

              {/* TAGS */}
              <div className="flex flex-wrap gap-2">
                {product.tags && product.tags.length > 0 ? product.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 italic">#{tag}</span>
                )) : <span className="text-[11px] text-gray-300 italic">Chưa có thẻ tag</span>}
              </div>
            </div>
          </div>

          {/* THÔNG SỐ KỸ THUẬT */}
          <section>
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Award size={18} className="text-emerald-500" /> Thông số kỹ thuật chi tiết
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <DetailBox label="Chất liệu" value={product.specifications?.material} icon={<ImageIcon size={14}/>} />
              <DetailBox label="Độ cứng" value={product.specifications?.firmness} />
              <DetailBox label="Kích thước" value={product.specifications?.dimensions} icon={<Ruler size={14}/>} />
              <DetailBox label="Trọng lượng" value={product.specifications?.weight} icon={<Weight size={14}/>} />
              <DetailBox label="Thiết kế" value={product.specifications?.design} />
              <DetailBox label="Số chứng nhận" value={product.specifications?.certification_number} icon={<ShieldCheck size={14}/>} />
            </div>
          </section>

          {/* MÔ TẢ & NHẬT KÝ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
            <div className="space-y-3">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Tag size={16}/> Mô tả tóm tắt</p>
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 border-l-8 border-l-emerald-500 italic text-sm text-gray-600 leading-relaxed min-h-[120px]">
                {product.description || "Sản phẩm chưa cập nhật mô tả chi tiết."}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><History size={16}/> Nhật ký vận hành</p>
              <div className="p-6 bg-white rounded-3xl border border-gray-100 space-y-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><Clock size={20}/></div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-0.5">Thời điểm khởi tạo</p>
                    <p className="text-sm font-bold text-gray-700">{formatDateTime(product.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl"><History size={20}/></div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-0.5">Cập nhật lần cuối</p>
                    <p className="text-sm font-bold text-gray-700">{formatDateTime(product.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
             <Warehouse size={18} className="text-emerald-500"/>
             <div className="leading-tight">
                <p className="text-[10px] text-gray-400 font-black uppercase">Trạng thái kho</p>
                <p className="text-lg font-black text-gray-700">{product.stock_quantity} <span className="text-xs font-normal">sản phẩm sẵn sàng</span></p>
             </div>
          </div>
          <div className="flex gap-4">
             <button onClick={onClose} className="px-8 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all font-mono uppercase tracking-tighter">Đóng</button>
             <button onClick={onEdit} className="px-10 py-3 bg-emerald-600 text-white text-sm font-bold rounded-2xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2">
               <PencilLine size={18} /> Chỉnh sửa ngay
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component con 
const DetailBox = ({ label, value, icon }: { label: string, value?: string, icon?: React.ReactNode }) => (
  <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-all group">
    <p className="text-[10px] uppercase font-black text-gray-400 mb-1.5 flex items-center gap-1.5 group-hover:text-emerald-500 transition-colors">{icon} {label}</p>
    <p className="text-sm font-bold text-gray-700">{value || "—"}</p>
  </div>
);

export default ProductDetailModal;