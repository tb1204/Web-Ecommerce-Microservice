import React, { useState, useEffect } from "react";
import {
  Star,
  ImageIcon,
  CheckCircle,
  ShoppingCart,
  ShieldCheck,
  Truck,
  ChevronRight,
  ChevronLeft,
  Heart,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import image from "../../assets/banner/Banner-phu-1.webp";
import image1 from "../../assets/banner/banner-phu-3.webp";

// --- 1. DỮ LIỆU GIẢ LẬP CHI TIẾT (FAKE DATA) ---
const fakeSelectedProduct = {
  _id: "p1",
  name: "Nệm lò xo đa tầng Sleep Wave Hybrid (SleepWave) - WolfBed Edition",
  brand: "Goodnight",
  origin: "Chính hãng",
  price: 4400000,
  originalPrice: 6900000,
  sku: "MAT-SW-2026-PREMIUM",
  rating: 5,
  reviewCount: 150,
  promoBanner: image,
  images: [
    { url: image, is_primary: true },
    { url: image1, is_primary: false },
    {
      url: image,
      is_primary: false,
    },
    {
      url: image1,
      is_primary: false,
    },
    { url: image1, is_primary: false },
    { url: image, is_primary: false },
  ],
  contentHtml: `
    <div class="space-y-6 text-gray-700">
      <h2 class="text-2xl font-bold text-green-900">1. Cấu tạo nệm Hybrid độc quyền</h2>
      <p>SleepWave Hybrid không chỉ là một chiếc nệm, đó là thành quả của công nghệ 2026. Sự kết hợp giữa <b>lò xo túi độc lập 18cm</b> và lớp <b>Memory Foam</b> giúp ôm sát đường cong cơ thể.</p>
      <h2 class="text-2xl font-bold text-green-900">2. Khả năng kháng khuẩn tuyệt đối</h2>
      <p>Vỏ nệm được dệt từ sợi tơ tằm kết hợp tinh chất bạc, giúp loại bỏ 99% vi khuẩn và nấm mốc, mang lại môi trường ngủ sạch sẽ nhất cho gia đình bạn.</p>
      <ul class="list-disc pl-5 space-y-2">
        <li>Nâng đỡ 7 vùng cơ thể trọng yếu.</li>
        <li>Cách ly chuyển động tuyệt đối, không gây tiếng ồn.</li>
        <li>Độ bền lên đến 20 năm.</li>
      </ul>
    </div>
  `,
  reviews: [
    {
      id: 1,
      user: "Nguyễn Văn A",
      star: 5,
      content:
        "Nệm nằm rất êm, giao hàng nhanh và đóng gói cẩn thận. Rất hài lòng với dịch vụ!",
      date: "20/01/2026",
      hasImage: true,
      userAvatar: image1,
    },
    {
      id: 2,
      user: "Trần Thị B",
      star: 4,
      content: "Hơi cứng so với mình nghĩ nhưng nằm quen thì rất thích.",
      date: "15/01/2026",
      hasImage: false,
      userAvatar: image,
    },
    {
      id: 3,
      user: "Wolf Themes",
      star: 5,
      content: "Dịch vụ của WolfBed luôn đẳng cấp. Nệm nằm không bị nóng lưng.",
      date: "10/01/2026",
      hasImage: true,
      userAvatar: image,
    },
  ],
};

// Dữ liệu cho ProductGrid xử lý
const fakeSimilarProducts = Array(6)
  .fill(null)
  .map((_, i) => ({
    _id: `s${i}`,
    name: i % 2 === 0 ? "Gối cao su Kim Cương" : "Bộ ga chun Bamboo Premium",
    price: 600000 + i * 50000,
    originalPrice: 850000,
    images: [{ url: i % 2 === 0 ? image : image1, is_primary: true }],
    status: "selling" as const, // Ép kiểu cho interface
    stock_quantity: 10,
    brand: "WolfBed",
    rating: 4.5,
    reviewCount: 20,
  }));

const ProductDetails = () => {
  const [selectedProduct] = useState(fakeSelectedProduct);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("160x200");
  const [selectedThickness, setSelectedThickness] = useState("15cm");

  const [filterStar, setFilterStar] = useState(0);
  const [filterHasImage, setFilterHasImage] = useState(false);

  // --- Logic Chuyển Ảnh ---
  const handleNext = () => {
    setCurrentImgIndex((prev) =>
      prev === selectedProduct.images.length - 1 ? 0 : prev + 1,
    );
  };
  const handlePrev = () => {
    setCurrentImgIndex((prev) =>
      prev === 0 ? selectedProduct.images.length - 1 : prev - 1,
    );
  };

  // --- Logic Lọc Bình Luận ---
  const filteredReviews = selectedProduct.reviews.filter((rev) => {
    const matchStar = filterStar === 0 || rev.star === filterStar;
    const matchImg = !filterHasImage || rev.hasImage;
    return matchStar && matchImg;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-gray-900 bg-white">
      {/* BREADCRUMB */}
      <nav
        className="
    flex flex-wrap items-center gap-x-2 gap-y-1
    text-[11px] sm:text-xs md:text-sm
    text-gray-400 mb-4 sm:mb-6
    uppercase tracking-[0.15em] font-semibold
  "
      >
        <span className="whitespace-nowrap">Trang chủ</span>
        <ChevronRight size={12} className="shrink-0" />

        <span className="whitespace-nowrap">Sản phẩm</span>
        <ChevronRight size={12} className="shrink-0" />

        <span className="text-gray-800 font-bold truncate max-w-[200px] sm:max-w-none">
          {selectedProduct.name}
        </span>
      </nav>

      {/* 1. BANNER KHUYẾN MÃI */}
      <div className="mb-12 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <img
          src={selectedProduct.promoBanner}
          alt="Sale Banner"
          className="w-full h-auto"
        />
      </div>

      {/* 2. KHU VỰC THÔNG TIN CHÍNH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 lg:mb-24">
        {/* BÊN TRÁI: SLIDER ẢNH CAO CẤP */}
        <div className="flex flex-col gap-8">
          <div className="relative aspect-square rounded-2xl sm:rounded-3xl lg:rounded-[40px] overflow-hidden bg-[#F8F8F8] border border-gray-100 shadow-inner">
            <div
              className="flex w-full h-full transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
              style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
            >
              {selectedProduct.images.map((img, idx) => (
                <div key={idx} className="w-full h-full flex-shrink-0">
                  <img
                    src={img.url}
                    className="w-full h-full object-cover"
                    alt="Product"
                  />
                </div>
              ))}
            </div>

            {/* Nút Nav */}
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* INDICATOR: THANH ĐEN DI CHUYỂN */}
          <div className="px-4">
            <div className="relative w-full h-[2px] bg-gray-100 rounded-full">
              <div
                className="absolute h-full bg-black rounded-full transition-all duration-700 ease-in-out"
                style={{
                  width: `${100 / selectedProduct.images.length}%`,
                  left: `${(currentImgIndex * 100) / selectedProduct.images.length}%`,
                }}
              />
            </div>
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-center">
            {selectedProduct.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImgIndex(idx)}
                className={`w-24 h-24 flex-shrink-0 rounded-2xl border-2 transition-all ${currentImgIndex === idx ? "border-green-800 scale-105 shadow-md" : "border-gray-100 opacity-60 hover:opacity-100"}`}
              >
                <img
                  src={img.url}
                  className="w-full h-full object-cover rounded-xl"
                  alt="thumb"
                />
              </button>
            ))}
          </div>
        </div>

        {/* BÊN PHẢI: THÔNG TIN VÀ ĐẶT HÀNG */}
        <div className="flex flex-col py-2">
          <div className="mb-8">
            <p className="text-green-800 font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-green-800"></span> Thương hiệu{" "}
              {selectedProduct.brand}
            </p>
            <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4 italic uppercase tracking-tighter">
              {selectedProduct.name}
            </h1>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
              <div className="flex text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span>SKU: {selectedProduct.sku}</span>
              <span className="text-gray-200">|</span>
              <span className="text-blue-600 underline cursor-pointer">
                {selectedProduct.reviewCount} Đánh giá
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-6 mb-10">
            <span className="text-5xl font-black text-red-600 tracking-tighter">
              {selectedProduct.price.toLocaleString()}₫
            </span>
            <span className="text-2xl text-gray-300 line-through font-light">
              {selectedProduct.originalPrice.toLocaleString()}₫
            </span>
          </div>

          {/* QUY CÁCH: KÍCH THƯỚC & ĐỘ DÀY */}
          <div className="space-y-8 mb-10">
            <div>
              <p className="text-[11px] font-black uppercase text-gray-400 mb-4 tracking-widest">
                1. Chọn kích thước (cm):
              </p>
              <div className="flex flex-wrap gap-3">
                {["120x200", "160x200", "180x200", "220x200"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-xl border-2 text-sm font-bold transition-all ${selectedSize === size ? "bg-green-50 border-green-800 text-green-900" : "bg-white border-gray-100 text-gray-400 hover:border-green-800"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase text-gray-400 mb-4 tracking-widest">
                2. Chọn độ dày nệm:
              </p>
              <div className="flex flex-wrap gap-3">
                {["10cm", "15cm", "20cm", "25cm"].map((thick) => (
                  <button
                    key={thick}
                    onClick={() => setSelectedThickness(thick)}
                    className={`px-8 py-3 rounded-xl border-2 text-sm font-bold transition-all ${selectedThickness === thick ? "bg-green-50 border-green-800 text-green-900" : "bg-white border-gray-100 text-gray-400 hover:border-green-800"}`}
                  >
                    {thick}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* HÀNH ĐỘNG: MUA NGAY (2/3) - GIỎ HÀNG (1/3) */}
          <div className="flex flex-col gap-4 mb-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-100 rounded-2xl h-16 bg-gray-50/50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-12 h-full flex items-center justify-center font-bold text-xl"
                >
                  -
                </button>
                <span className="w-10 text-center font-black">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-12 h-full flex items-center justify-center font-bold text-xl"
                >
                  +
                </button>
              </div>

              {/* MUA NGAY: 2 PHẦN */}
              <button className="flex-[2] bg-green-900 h-16 rounded-2xl text-white font-black text-sm uppercase tracking-widest hover:bg-green-800 transition-all shadow-xl shadow-green-900/20">
                Mua ngay
              </button>

              {/* GIỎ HÀNG: 1 PHẦN */}
              <button
                onClick={() => toast.success("Đã thêm vào giỏ hàng")}
                className="flex-[1] border-2 border-green-900 h-16 rounded-2xl text-green-900 font-black text-[10px] uppercase flex flex-col items-center justify-center gap-1 hover:bg-green-50 transition-all"
              >
                <ShoppingCart size={18} />
                Giỏ hàng
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase text-gray-500 tracking-widest">
              <ShieldCheck className="text-green-700" size={18} /> Bảo hành 10
              năm
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase text-gray-500 tracking-widest">
              <Truck className="text-green-700" size={18} /> Miễn phí vận chuyển
            </div>
          </div>
        </div>
      </div>

      {/* 3. NỘI DUNG CHI TIẾT */}
      <div className="mb-24 py-16 border-t border-gray-100">
        <h2 className="text-3xl font-black mb-12 border-b-4 border-green-900 inline-block pb-3 uppercase italic tracking-tighter">
          Chi tiết sản phẩm
        </h2>
        <div
          className="prose prose-lg prose-green max-w-none text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: selectedProduct.contentHtml }}
        />
      </div>

      {/* 4. ĐÁNH GIÁ VÀ BÌNH LUẬN */}
      <div
        className="bg-[#FBFBFB] 
             rounded-2xl sm:rounded-[32px] lg:rounded-[40px]
             p-5 sm:p-8 lg:p-12
             mb-12 sm:mb-16 lg:mb-24
             border border-gray-50"
      >
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 mb-10 lg:mb-16">
          {/* RATING */}
          <div className="text-center lg:text-left">
            <p className="text-5xl sm:text-6xl lg:text-7xl font-black text-green-900 mb-2 tracking-tighter">
              4.9
            </p>

            <div className="flex text-orange-400 justify-center lg:justify-start mb-3 sm:mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="sm:hidden"
                  fill="currentColor"
                />
              ))}
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`lg-${i}`}
                  size={20}
                  className="hidden sm:block"
                  fill="currentColor"
                />
              ))}
            </div>

            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest italic">
              Dựa trên 150 đánh giá
            </p>
          </div>

          {/* FILTER */}
          <div className="flex flex-wrap gap-2 sm:gap-3 flex-1">
            <button
              onClick={() => setFilterStar(0)}
              className={`px-4 sm:px-6 py-2 sm:py-3
                    rounded-xl sm:rounded-2xl
                    border-2 text-[10px] sm:text-xs
                    font-black uppercase tracking-widest
                    transition-all
                    ${
                      filterStar === 0
                        ? "bg-green-900 border-green-900 text-white"
                        : "bg-white border-gray-100 text-gray-400"
                    }`}
            >
              Tất cả
            </button>

            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStar(s)}
                className={`px-4 sm:px-6 py-2 sm:py-3
                      rounded-xl sm:rounded-2xl
                      border-2 text-[10px] sm:text-xs
                      font-black uppercase tracking-widest
                      transition-all
                      ${
                        filterStar === s
                          ? "bg-green-900 border-green-900 text-white"
                          : "bg-white border-gray-100 text-gray-400"
                      }`}
              >
                {s} Điểm
              </button>
            ))}

            <button
              onClick={() => setFilterHasImage(!filterHasImage)}
              className={`px-4 sm:px-6 py-2 sm:py-3
                    rounded-xl sm:rounded-2xl
                    border-2 text-[10px] sm:text-xs
                    font-black uppercase tracking-widest
                    transition-all flex items-center gap-1 sm:gap-2
                    ${
                      filterHasImage
                        ? "bg-green-900 border-green-900 text-white"
                        : "bg-white border-gray-100 text-gray-400"
                    }`}
            >
              <ImageIcon size={14} className="sm:hidden" />
              <ImageIcon size={16} className="hidden sm:block" />
              Có hình ảnh
            </button>
          </div>
        </div>

        {/* REVIEW LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 sm:p-6 lg:p-8
                   rounded-2xl sm:rounded-3xl
                   shadow-sm border border-gray-50"
            >
              {/* HEADER CARD */}
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={rev.userAvatar}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                    alt="avatar"
                  />

                  <div>
                    <h4 className="font-black text-xs sm:text-sm uppercase flex items-center gap-2">
                      {rev.user}
                      <CheckCircle
                        size={14}
                        className="text-blue-500"
                        fill="currentColor"
                      />
                    </h4>

                    <div className="flex text-orange-400">
                      {[...Array(rev.star)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className="sm:size-[12px]"
                          fill="currentColor"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-[9px] sm:text-[10px] font-bold text-gray-300 italic uppercase whitespace-nowrap">
                  {rev.date}
                </span>
              </div>

              {/* CONTENT */}
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 italic">
                "{rev.content}"
              </p>

              {/* IMAGE */}
              {rev.hasImage && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border">
                  <img
                    src={image}
                    className="w-full h-full object-cover"
                    alt="review"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. SẢN PHẨM TƯƠNG TỰ - TRUYỀN DỮ LIỆU XUỐNG PRODUCTGRID */}
      <div className="border-t border-gray-100 pt-24 pb-24">
        <div className="flex justify-between items-end mb-16 px-2">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
              Sản phẩm tương tự
            </h2>
            <p className="text-gray-400 text-sm mt-2 font-medium underline">
              WolfBed gợi ý cho không gian của bạn
            </p>
          </div>
          <button className="text-green-900 font-black border-b-4 border-green-900 pb-1 text-sm uppercase tracking-widest">
            Xem tất cả
          </button>
        </div>

        {/* Truyền dữ liệu xuống ProductGrid */}
        <ProductGrid products={fakeSimilarProducts} />
      </div>
    </div>
  );
};

export default ProductDetails;
