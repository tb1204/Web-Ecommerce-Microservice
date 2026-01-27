import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Gift,
  Truck,
  ShieldCheck,
  Heart,
  Share2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

// --- FAKE COMPONENT TRONG KHI CHỜ PRODUCT GRID THẬT ---
const ProductGridMock = ({ products }: any) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {products.map((p: any) => (
      <div key={p._id} className="border p-2 rounded-lg bg-white shadow-sm">
        <img
          src={p.images[0].url}
          className="w-full aspect-square object-cover rounded"
        />
        <p className="text-xs font-bold mt-2 line-clamp-2">{p.name}</p>
        <p className="text-[#d71920] font-bold">{p.price.toLocaleString()}₫</p>
      </div>
    ))}
  </div>
);

const ProductDetails: React.FC<{ productId?: string }> = ({ productId }) => {
  const { id } = useParams<{ id: string }>();

  // --- FAKE DATA BACKEND TRẢ VỀ ---
  const selectedProduct = {
    _id: id || "1",
    name: "Nệm Cao Su Thiên Nhiên WolfBed Luxury - Nâng Đỡ Đa Tầng",
    price: 15000000,
    originalPrice: 20000000,
    sku: "WOLF-LUX-2024",
    brand: "WolfBed",
    rating: 4.8,
    reviewCount: 125,
    description:
      "Dòng nệm cao su thiên nhiên WolfBed Luxury được sản xuất từ 100% mủ cao su tự nhiên tinh khiết. Thiết kế với hàng triệu lỗ thông hơi giúp thoáng khí tối đa, kháng khuẩn và bảo vệ cột sống người nằm một cách hoàn hảo.\n\nSản phẩm đạt tiêu chuẩn chất lượng quốc tế, phù hợp cho mọi lứa tuổi.",
    sizes: ["120x200cm", "160x200cm", "180x200cm", "200x220cm"],
    images: [
      { url: "https://picsum.photos/800/800?random=11" },
      { url: "https://picsum.photos/800/800?random=12" },
      { url: "https://picsum.photos/800/800?random=13" },
      { url: "https://picsum.photos/800/800?random=14" },
    ],
  };

  const similarProducts = [
    {
      _id: "s1",
      name: "Nệm Foam Goodnight Luna",
      price: 4500000,
      images: [{ url: "https://picsum.photos/400/400?random=21" }],
    },
    {
      _id: "s2",
      name: "Nệm Lò Xo Túi Cao Cấp",
      price: 8900000,
      images: [{ url: "https://picsum.photos/400/400?random=22" }],
    },
    {
      _id: "s3",
      name: "Topper Làm Mềm Nệm",
      price: 1200000,
      images: [{ url: "https://picsum.photos/400/400?random=23" }],
    },
    {
      _id: "s4",
      name: "Gối Cao Su Non",
      price: 550000,
      images: [{ url: "https://picsum.photos/400/400?random=24" }],
    },
  ];

  // --- STATE QUẢN LÝ ---
  const [mainImage, setMainImage] = useState<string>(
    selectedProduct.images[0].url,
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    selectedProduct.sizes[0],
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  // Giả lập dữ liệu "Đã xem" bên Sidebar
  const [recentlyViewed] = useState<any[]>([
    {
      _id: "v1",
      name: "Chiếu điều hòa cao su Doona",
      price: 729000,
      originalPrice: 890000,
      image: "https://picsum.photos/200/200?random=1",
    },
    {
      _id: "v2",
      name: "Ga chống thấm Goodnight Sumi",
      price: 239000,
      originalPrice: 390000,
      image: "https://picsum.photos/200/200?random=2",
    },
    {
      _id: "v3",
      name: "Nệm foam Goodnight Core",
      price: null,
      isContact: true,
      image: "https://picsum.photos/200/200?random=3",
    },
  ]);

  const handleQuantityChange = (type: "plus" | "minus") => {
    if (type === "plus") setQuantity((q) => q + 1);
    else if (type === "minus" && quantity > 1) setQuantity((q) => q - 1);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-[11px] md:text-xs text-gray-500 uppercase tracking-widest">
        <Link to="/" className="hover:text-[#1a4d32]">
          Trang chủ
        </Link>{" "}
        <ChevronRight size={12} />
        <span>Sản phẩm khuyến mãi</span> <ChevronRight size={12} />
        <span className="text-gray-900 font-bold line-clamp-1">
          {selectedProduct.name}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Banner Ưu đãi */}
        <div className="mb-6 bg-gradient-to-r from-[#003d71] to-[#005bb7] rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
          <div className="z-10 text-center md:text-left">
            <h2 className="text-2xl font-black italic leading-none uppercase">
              ĐẶT HÀNG ONLINE
            </h2>
            <p className="text-[10px] opacity-80 uppercase mt-1 tracking-wider">
              Nhận ngay ưu đãi khi mua qua website
            </p>
          </div>
          <div className="flex gap-3 z-10 mt-4 md:mt-0">
            <div className="bg-white/10 border border-white/20 p-2 rounded text-center min-w-[90px]">
              <p className="text-[9px] uppercase">Voucher giảm</p>
              <p className="font-bold text-xl leading-none">600K</p>
            </div>
            <div className="bg-white/10 border border-white/20 p-2 rounded text-center min-w-[90px]">
              <p className="text-[9px] uppercase">Quà tặng</p>
              <p className="font-bold text-xl leading-none">1 TRIỆU</p>
            </div>
            <div className="bg-[#ffd700] text-[#003d71] px-4 py-2 rounded font-bold text-center flex flex-col justify-center">
              <p className="text-[9px] uppercase">Ưu đãi kép</p>
              <p className="text-xl leading-none">7-10%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT CHÍNH */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ảnh sản phẩm */}
              <div className="space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group relative">
                  <img
                    src={mainImage}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt="Main"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-colors">
                    <Heart size={18} className="text-gray-600" />
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {selectedProduct.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      onClick={() => setMainImage(img.url)}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover cursor-pointer border-2 transition-all ${mainImage === img.url ? "border-[#1a4d32] shadow-md" : "border-transparent hover:border-gray-300"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Info cơ bản */}
              <div className="space-y-5">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight italic">
                    {selectedProduct.name}
                  </h1>
                  <div className="text-[10px] text-gray-400 uppercase mt-2 flex gap-4">
                    <span>SKU: {selectedProduct.sku}</span>
                    <span>
                      Thương hiệu:{" "}
                      <span className="text-[#1a4d32] font-bold">
                        {selectedProduct.brand}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < 4 ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">
                    ({selectedProduct.reviewCount} đánh giá)
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-baseline gap-2 text-[#d71920]">
                    <span className="text-3xl font-black">
                      {selectedProduct.price.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-sm text-gray-400 line-through font-normal">
                      {selectedProduct.originalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>

                <div className="bg-[#f0f9f4] p-3 rounded-lg border border-[#c3e6cb] flex items-center gap-2 text-[#155724] text-[13px]">
                  <Gift size={16} className="shrink-0" />
                  <p>
                    <span className="font-bold uppercase text-[10px]">
                      Quà tặng:
                    </span>{" "}
                    Tặng 01 Chăn Tencel cao cấp trị giá 1.200.000₫
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase text-gray-500 tracking-wider">
                    Kích thước:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg font-bold text-xs transition-all ${selectedSize === size ? "bg-[#1a4d32] text-white border-[#1a4d32] shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a4d32]"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg h-10 w-28 overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange("minus")}
                      className="w-full h-full hover:bg-gray-50 flex justify-center items-center"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-full text-center font-bold text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange("plus")}
                      className="w-full h-full hover:bg-gray-50 flex justify-center items-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button className="flex-[2] bg-[#1a4d32] text-white py-3.5 rounded-xl font-black uppercase text-sm hover:bg-[#143a26] transition-all active:scale-95 shadow-lg shadow-green-900/20">
                    Mua ngay
                  </button>
                  <button
                    onClick={() => toast.success("Đã thêm vào giỏ")}
                    className="flex-1 bg-white border-2 border-[#1a4d32] text-[#1a4d32] py-3.5 rounded-xl font-black uppercase text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                  >
                    <ShoppingCart size={18} /> Giỏ hàng
                  </button>
                </div>
              </div>
            </div>

            {/* Nội dung chi tiết */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex bg-gray-50 border-b border-gray-100">
                <button className="px-8 py-4 text-xs font-black uppercase border-b-2 border-[#1a4d32] text-[#1a4d32]">
                  Thông tin sản phẩm
                </button>
                <button className="px-8 py-4 text-xs font-bold uppercase text-gray-400">
                  Đánh giá
                </button>
              </div>
              <div className="p-6 md:p-10">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base italic">
                  {selectedProduct.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                  <div className="p-5 bg-[#f8f9fa] rounded-xl flex gap-4 border border-gray-100">
                    <Truck className="text-[#1a4d32] shrink-0" size={24} />
                    <div>
                      <p className="font-bold text-xs uppercase tracking-tight">
                        Giao hàng miễn phí
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Nội thành trong 2H, toàn quốc 2-3 ngày
                      </p>
                    </div>
                  </div>
                  <div className="p-5 bg-[#f8f9fa] rounded-xl flex gap-4 border border-gray-100">
                    <ShieldCheck
                      className="text-[#1a4d32] shrink-0"
                      size={24}
                    />
                    <div>
                      <p className="font-bold text-xs uppercase tracking-tight">
                        Bảo hành 10 năm
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Đổi trả ngay nếu xẹp lún hoặc lỗi từ NSX
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
                <Eye size={20} className="text-[#1a4d32]" /> Bạn đã xem
              </h3>
              <div className="space-y-6">
                {recentlyViewed.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 group cursor-pointer"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                      <img
                        src={item.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-[12px] font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#1a4d32] transition-colors">
                        {item.name}
                      </h4>
                      <div className="mt-1">
                        {item.isContact ? (
                          <span className="text-[#d71920] font-black text-xs italic uppercase">
                            Liên hệ
                          </span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-[#d71920] font-bold text-sm">
                              {item.price?.toLocaleString()}₫
                            </span>
                            <span className="text-[10px] text-gray-400 line-through leading-none">
                              {item.originalPrice?.toLocaleString()}₫
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-2.5 border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-[#1a4d32] hover:text-white transition-all">
                Xem thêm sản phẩm
              </button>
            </div>

            {/* Banner nhỏ quảng cáo sidebar */}
            <div className="rounded-2xl overflow-hidden shadow-lg group">
              <img
                src="https://picsum.photos/400/600?random=55"
                className="w-full object-cover h-[350px] group-hover:scale-105 transition-transform duration-700"
                alt="Ad"
              />
            </div>
          </aside>
        </div>

        {/* Gợi ý tương tự cuối trang */}
        <div className="mt-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#1a4d32] shrink-0">
              Gợi ý tương tự
            </h2>
            <div className="h-px w-full bg-gray-100"></div>
          </div>
          {/* Gọi Component Grid Mock */}
          <ProductGridMock products={similarProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
