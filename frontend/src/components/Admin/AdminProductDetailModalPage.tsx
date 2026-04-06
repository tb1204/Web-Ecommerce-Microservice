import React, { useState, useEffect } from "react";
import {
  X,
  Info,
  MapPin,
  Award,
  Weight,
  Tag,
  Warehouse,
  Clock,
  History,
  Image as ImageIcon,
  Layers,
  PencilLine,
  Box,
} from "lucide-react";
import type { Product } from "../Products/InterfaceItem";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
  onEdit,
}) => {
  const [clickedImage, setClickedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setClickedImage(null);
  }, [isOpen, product?.id]);

  if (!isOpen || !product) return null;

  const primaryImg = product.images?.find((img) => img.isPrimary)?.url;
  const defaultImage = primaryImg || product.images?.[0]?.url || "";
  const displayImage = clickedImage || defaultImage;

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "Chưa cập nhật";
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border">
        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center bg-emerald-600 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Info size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none">
                Thông tin chi tiết sản phẩm
              </h2>
              <p className="text-[11px] text-emerald-100 mt-1 uppercase tracking-widest font-medium italic">
                Mã dòng sản phẩm: {product.productCode} | Loại:{" "}
                {product.category?.code}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-700 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* ALBUM ẢNH */}
            <div className="w-full lg:w-[350px] space-y-4 flex-shrink-0">
              <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-emerald-50 shadow-md bg-gray-50 group">
                <img
                  src={displayImage}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={product.name}
                />
                <div
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg ${product.status === "AVAILABLE" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                >
                  {product.status === "AVAILABLE" ? "Đang bán" : "Ngừng bán"}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setClickedImage(img.url)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${displayImage === img.url ? "border-emerald-500 scale-105 shadow-md" : "border-transparent hover:border-emerald-200"}`}
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* THÔNG TIN TỔNG QUAN */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-3xl font-black text-gray-900 leading-tight mb-4">
                  {product.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-xl border border-emerald-100 uppercase flex items-center gap-1.5">
                    <Layers size={14} />
                    {product.category?.parentName
                      ? `${product.category.parentName} > `
                      : ""}
                    {product.category?.name}
                  </span>
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-xl border border-blue-100 flex items-center gap-1.5">
                    <MapPin size={14} /> {product.origin}
                  </span>
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-xl border flex items-center gap-1.5">
                    Hãng: {product.brand}
                  </span>
                </div>
              </div>

              {/* BẢNG BIẾN THỂ (VARIANTS) - PHẦN QUAN TRỌNG NHẤT */}
              <div className="space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Box size={16} className="text-emerald-500" /> Danh sách kích
                  thước & Giá
                </p>
                <div className="border rounded-2xl overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
<<<<<<< HEAD
                        <th className="px-4 py-3 text-left text-[10px] font-black text-gray-500 uppercase">
                          SKU / Kích thước
                        </th>
                        <th className="px-4 py-3 text-center text-[10px] font-black text-gray-500 uppercase">
                          Màu sắc
                        </th>
                        <th className="px-4 py-3 text-center text-[10px] font-black text-gray-500 uppercase">
                          Giá bán
                        </th>
                        <th className="px-4 py-3 text-center text-[10px] font-black text-gray-500 uppercase">
                          Kho
                        </th>
                        <th className="px-4 py-3 text-center text-[10px] font-black text-gray-500 uppercase">
                          Trạng thái
                        </th>
=======
                        <th className="px-4 py-3 text-left text-[10px] font-black text-gray-500 uppercase">SKU / Kích thước</th>
                        <th className="px-4 py-3 text-center text-[10px] font-black text-gray-500 uppercase">Màu sắc</th>
                        <th className="px-4 py-3 text-center text-[10px] font-black text-gray-500 uppercase">Giá bán</th>
                        <th className="px-4 py-3 text-center text-[10px] font-black text-gray-500 uppercase">Kho</th>
                        <th className="px-4 py-3 text-center text-[10px] font-black text-gray-500 uppercase">Trạng thái</th>
>>>>>>> 74a4862881035814147d4c42b376ca3aaeb01812
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {product.variants?.map((v) => (
                        <tr
                          key={v.variantId}
                          className="hover:bg-emerald-50/30 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <p className="text-xs font-bold text-gray-800">
                              {v.size} - {v.thickness}
                            </p>
                            <p className="text-[9px] text-gray-400 font-mono uppercase">
                              {v.sku}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-center text-xs font-bold text-gray-600">
                            {v.color ? (
<<<<<<< HEAD
                              <span>{v.color}</span>
                            ) : (
                              <span className="text-gray-300 italic text-[10px]">
                                --
                              </span>
=======
                              <span >
                                {v.color}
                              </span>
                            ) : (
                              <span className="text-gray-300 italic text-[10px]">--</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <p className="px-4 py-3 text-center text-xs font-bold text-gray-600">{v.price.toLocaleString("vi-VN")}₫</p>
                            {v.originalPrice > v.price && (
                              <p className="text-[9px] text-gray-300 line-through">{v.originalPrice.toLocaleString("vi-VN")}₫</p>
>>>>>>> 74a4862881035814147d4c42b376ca3aaeb01812
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <p className="px-4 py-3 text-center text-xs font-bold text-gray-600">
                              {v.price.toLocaleString("vi-VN")}₫
                            </p>
                            {v.originalPrice > v.price && (
                              <p className="text-[9px] text-gray-300 line-through">
                                {v.originalPrice.toLocaleString("vi-VN")}₫
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-xs font-bold text-gray-600">
                            {v.stockQuantity}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${v.status === "ACTIVE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                            >
                              {v.status === "ACTIVE" ? "Sẵn sàng" : "Hết hàng"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* THÔNG SỐ KỸ THUẬT */}
          <section>
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Award size={18} className="text-emerald-500" /> Thông số kỹ thuật
              chung
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DetailBox
                label="Chất liệu"
                value={product.specifications?.material}
                icon={<ImageIcon size={14} />}
              />
              <DetailBox
                label="Độ cứng"
                value={product.specifications?.firmness}
              />
              <DetailBox
                label="Trọng lượng"
                value={product.specifications?.weight}
                icon={<Weight size={14} />}
              />
              <DetailBox
                label="Thiết kế"
                value={product.specifications?.design}
              />
            </div>
          </section>

          {/* MÔ TẢ & NHẬT KÝ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
            <div className="space-y-3">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={16} /> Mô tả sản phẩm
              </p>
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 italic text-sm text-gray-600 leading-relaxed min-h-[100px]">
                {product.description || "Chưa có mô tả."}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <History size={16} /> Lịch sử hệ thống
              </p>
              <div className="p-6 bg-white rounded-3xl border border-gray-100 space-y-4 shadow-sm">
                <div className="flex items-center gap-4 text-xs">
                  <Clock size={16} className="text-blue-500" />
                  <span className="text-gray-400 uppercase font-black">
                    Khởi tạo:
                  </span>
                  <span className="font-bold text-gray-700">
                    {formatDateTime(product.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <History size={16} className="text-orange-500" />
                  <span className="text-gray-400 uppercase font-black">
                    Cập nhật:
                  </span>
                  <span className="font-bold text-gray-700">
                    {formatDateTime(product.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <Warehouse size={18} className="text-emerald-500" />
            <div className="leading-tight">
              <p className="text-[10px] text-gray-400 font-black uppercase">
                Tổng tồn kho (All Sizes)
              </p>
              <p className="text-lg font-black text-gray-700">
                {product.totalStockQuantity}{" "}
                <span className="text-xs font-normal">sản phẩm</span>
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all uppercase"
            >
              Đóng
            </button>
            <button
              onClick={onEdit}
              className="px-10 py-3 bg-emerald-600 text-white text-sm font-bold rounded-2xl shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              <PencilLine size={18} /> Chỉnh sửa ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailBox = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}) => (
  <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-[10px] uppercase font-black text-gray-400 mb-1 flex items-center gap-1.5">
      {icon} {label}
    </p>
    <p className="text-sm font-bold text-gray-700">{value || "—"}</p>
  </div>
);

export default ProductDetailModal;
