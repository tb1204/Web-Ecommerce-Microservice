import { useState } from "react";
import {
  Star,
  CheckCircle,
  ShoppingCart,
  ShieldCheck,
  Truck,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import ProductReviews from "./ProductReviews";
import image from "../../assets/banner/Banner-phu-1.webp";
import image1 from "../../assets/banner/banner-phu-3.webp";

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
    { url: image, is_primary: false },
    { url: image1, is_primary: false },
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
      star: 3,
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

// Dữ liệu cho ProductGrid
const fakeSimilarProducts = Array(6)
  .fill(null)
  .map((_, i) => ({
    _id: `s${i}`,
    name: i % 2 === 0 ? "Gối cao su Kim Cương" : "Bộ ga chun Bamboo Premium",
    price: 600000 + i * 50000,
    originalPrice: 850000,
    images: [{ url: i % 2 === 0 ? image : image1, is_primary: true }],
    status: "selling" as const,
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

  // Logic chuyển ảnh
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-16 lg:mb-24">
        {/* Bên trái: Slider ảnh */}
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

            {/* Nút prev/next */}
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

          {/* Indicator thanh trượt */}
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

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-center">
            {selectedProduct.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImgIndex(idx)}
                className={`w-24 h-24 flex-shrink-0 rounded-2xl border-2 transition-all ${
                  currentImgIndex === idx
                    ? "border-green-800 scale-105 shadow-md"
                    : "border-gray-100 opacity-60 hover:opacity-100"
                }`}
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

        {/* Bên phải: Thông tin & mua hàng */}
        <div className="flex flex-col py-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
              {selectedProduct.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
              <span>
                SKU: <span className="text-gray-500 italic">Đang cập nhật</span>
              </span>
              <span className="text-gray-200">|</span>
              <span>
                Thương hiệu:{" "}
                <span className="text-green-800 font-bold">
                  {selectedProduct.brand}
                </span>
              </span>
              <span className="text-gray-200">|</span>
              <div className="flex items-center gap-1">
                <div className="flex text-gray-300">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <span className="text-xs">1 đánh giá</span>
              </div>
            </div>
          </div>

          {/* 3. Giá cả và Tiết kiệm */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-red-600">
                {selectedProduct.price.toLocaleString()}₫
              </span>
              <span className="text-xl text-gray-400 line-through">
                {selectedProduct.originalPrice.toLocaleString()}₫
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1 italic">
              Tiết kiệm:{" "}
              <span className="text-green-700 font-semibold">2.500.000₫</span>{" "}
              so với giá thị trường
            </p>
          </div>

          {/* 5. Khu vực chọn biến thể (Box màu xanh nhạt) */}
          <div className="bg-[#4ea67514] border border-green-50 rounded-xl p-6 mb-8 space-y-6">
            {/* Kích thước */}
            <div>
              <p className="text-sm font-bold mb-3">
                Kích thước (cm):{" "}
                <span className="font-normal text-gray-500">
                  {selectedSize}
                </span>
              </p>
              <div className="flex flex-wrap gap-3">
                {["120x200", "160x200", "180x200", "220x200"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`relative px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-green-800 text-green-900 bg-white"
                        : "border-gray-200 text-gray-500 bg-white"
                    }`}
                  >
                    {size}
                    {selectedSize === size && (
                      <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-[2px]">
                        <CheckCircle size={10} fill="currentColor" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Độ dày */}
            <div>
              <p className="text-sm font-bold mb-3">
                Độ dày (cm):{" "}
                <span className="font-normal text-gray-500">
                  {selectedThickness}
                </span>
              </p>
              <div className="flex flex-wrap gap-3">
                {["20"].map((thick) => (
                  <button
                    key={thick}
                    className="relative px-6 py-2 rounded-lg border border-green-800 text-green-900 bg-white text-sm font-medium"
                  >
                    {thick}
                    <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-[2px]">
                      <CheckCircle size={10} fill="currentColor" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Số lượng */}
            <div className="flex items-center gap-6">
              <p className="text-sm font-bold">Số lượng:</p>
              <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-800 text-xl"
                >
                  −
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-12 text-center font-bold border-x border-gray-200 h-10 outline-none"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-800 text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button className="flex-[2.5] bg-[#004d31] hover:bg-[#003d27] text-white py-3 sm:py-4 rounded-xl flex flex-col items-center justify-center transition-all active:scale-[0.98] shadow-md shadow-green-900/10">
                <span className="font-bold text-sm sm:text-base lg:text-[15px] uppercase tracking-wider">
                  Mua ngay
                </span>
                <span className="text-[10px] sm:text-xs lg:text-[11px] opacity-80 font-light italic">
                  (Giao tận nơi hoặc nhận tại cửa hàng)
                </span>
              </button>

              {/* Nút Thêm vào giỏ - Icon và chữ LUÔN cùng 1 hàng */}
              <button
                onClick={() => toast.success("Đã thêm vào giỏ hàng")}
                className="flex-1 border-2 border-[#004d31] text-[#004d31] py-3 sm:py-4 rounded-xl flex flex-row items-center justify-center gap-2 font-bold text-xs sm:text-[11px] lg:text-[12px] uppercase hover:bg-green-50 transition-all active:scale-[0.98]"
              >
                <ShoppingCart
                  size={18}
                  className="shrink-0 sm:size-5 lg:size-4"
                />
                <span className="whitespace-nowrap">Thêm vào giỏ</span>
              </button>
            </div>
          </div>

          {/* 6. Chính sách */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-gray-500">
              <ShieldCheck className="text-green-700" size={18} /> Bảo hành 10
              năm
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-gray-500">
              <Truck className="text-green-700" size={18} /> Miễn phí vận chuyển
            </div>
          </div>
        </div>
      </div>

      {/* 3. CHI TIẾT SẢN PHẨM */}
      <div className="mb-24 py-16 border-t border-gray-100">
        <h2 className="text-3xl font-black mb-12 border-b-4 border-green-900 inline-block pb-3 uppercase italic tracking-tighter">
          Chi tiết sản phẩm
        </h2>
        <div
          className="prose prose-lg prose-green max-w-none text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: selectedProduct.contentHtml }}
        />
      </div>

      {/* 4. ĐÁNH GIÁ & BÌNH LUẬN - Sử dụng component riêng */}
      <ProductReviews
        reviews={selectedProduct.reviews}
        reviewCount={selectedProduct.reviewCount}
        averageRating={4.9}
      />

      {/* 5. SẢN PHẨM TƯƠNG TỰ */}
      <div className="border-t border-gray-100 pt-24 pb-24">
        <div className="flex justify-between items-end mb-16 px-2">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
              Sản phẩm tương tự
            </h2>
            <p className="text-gray-400 text-sm mt-2 font-medium underline">
              Artisano gợi ý cho không gian của bạn
            </p>
          </div>
          <button className="text-green-900 font-black border-b-4 border-green-900 pb-1 text-sm uppercase tracking-widest">
            Xem tất cả
          </button>
        </div>

        <ProductGrid products={fakeSimilarProducts} />
      </div>
    </div>
  );
};

export default ProductDetails;
