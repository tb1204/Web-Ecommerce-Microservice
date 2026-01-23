// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "sonner";
// import {
//   ShoppingCart,
//   ChevronRight,
//   Minus,
//   Plus,
//   Star,
//   Gift,
//   Truck,
//   ShieldCheck,
//   Heart,
//   Share2,
// } from "lucide-react";
// import ProductGrid from "./ProductGrid";
// import {
//   fetchProductDetails,
//   fetchSimilarProducts,
// } from "../../redux/slices/productsSlice";
// import { addToCart } from "../../redux/slices/CartSlice";
// import { RootState, AppDispatch } from "../../redux/store";

// // --- Interfaces dựa trên dữ liệu thật ---
// interface ProductImage {
//   url: string;
//   is_primary: boolean;
// }

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   description: string;
//   images: ProductImage[];
//   sizes: string[];
//   colors: string[];
//   brand: string;
//   material: string;
//   rating: number;
//   reviewCount: number;
//   sku: string;
// }

// const data = {
//   _id: "67890",
//   name: "Topper memory foam nâng đỡ êm ái Comfy Noah",
//   price: 2160000,
//   originalPrice: 2400000,
//   sku: "COMFY-NOAH-2024",
//   brand: "Comfy",
//   material: "Memory Foam",
//   rating: 4.5,
//   reviewCount: 24,
//   description: "Êm hơn, tiện hơn cho giấc ngủ ngon hơn...",
//   sizes: ["1m2 x 2m", "1m6 x 2m", "1m8 x 2m"],
//   colors: ["Trắng"],
//   images: [
//     { url: "link-anh-1.webp", is_primary: true },
//     { url: "link-anh-2.webp", is_primary: false },
//   ],
// };

// const ProductDetails: React.FC<{ productId?: string }> = ({ productId }) => {
//   const { id } = useParams<{ id: string }>();
//   const dispatch = useDispatch<AppDispatch>();

//   const { selectedProduct, loading, error, similarProducts } = useSelector(
//     (state: RootState) => state.products,
//   );
//   const { user, guestId } = useSelector((state: RootState) => state.auth);

//   const [mainImage, setMainImage] = useState<string | null>(null);
//   const [selectedSize, setSelectedSize] = useState<string>("");
//   const [selectedColor, setSelectedColor] = useState<string>("");
//   const [quantity, setQuantity] = useState<number>(1);
//   const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
//   const [activeTab, setActiveTab] = useState<"info" | "reviews">("info");

//   const productFetchId = productId || id;

//   useEffect(() => {
//     if (productFetchId) {
//       dispatch(fetchProductDetails(productFetchId));
//       dispatch(fetchSimilarProducts({ id: productFetchId }));
//     }
//   }, [dispatch, productFetchId]);

//   useEffect(() => {
//     if (selectedProduct?.images?.length > 0) {
//       setMainImage(selectedProduct.images[0].url);
//       if (selectedProduct.sizes?.length > 0)
//         setSelectedSize(selectedProduct.sizes[0]);
//       if (selectedProduct.colors?.length > 0)
//         setSelectedColor(selectedProduct.colors[0]);
//     }
//   }, [selectedProduct]);

//   const handleQuantityChange = (action: "plus" | "minus") => {
//     if (action === "plus") setQuantity((prev) => prev + 1);
//     if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
//   };

//   const handleAddToCart = () => {
//     if (!selectedSize || !selectedColor) {
//       toast.error("Vui lòng chọn đầy đủ thuộc tính");
//       return;
//     }
//     setIsButtonDisabled(true);
//     dispatch(
//       addToCart({
//         productId: productFetchId!,
//         quantity,
//         size: selectedSize,
//         color: selectedColor,
//         guestId,
//         userId: user?._id,
//       }),
//     )
//       .then(() => {
//         toast.success("Đã thêm vào giỏ hàng");
//       })
//       .finally(() => setIsButtonDisabled(false));
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center py-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#1a4d32]"></div>
//       </div>
//     );
//   if (error)
//     return (
//       <p className="text-center py-10 text-red-500 font-medium">Lỗi: {error}</p>
//     );
//   if (!selectedProduct) return null;

//   return (
//     <div className="bg-[#f8f9fa] min-h-screen">
//       {/* Breadcrumb */}
//       <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs md:text-sm text-gray-500 uppercase tracking-wider">
//         <span>Trang chủ</span> <ChevronRight size={14} />
//         <span>Sản phẩm khuyến mãi</span> <ChevronRight size={14} />
//         <span className="text-gray-900 font-medium line-clamp-1">
//           {selectedProduct.name}
//         </span>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 pb-12">
//         {/* Banner Ưu đãi (Theo ảnh 3) */}
//         <div className="mb-6 bg-gradient-to-r from-[#003d71] to-[#005bb7] rounded-xl p-4 md:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg overflow-hidden relative">
//           <div className="z-10 text-center md:text-left">
//             <h2 className="text-xl md:text-2xl font-black italic tracking-tighter">
//               ĐẶT HÀNG ONLINE
//             </h2>
//             <p className="text-xs opacity-90 uppercase">
//               Nhận ngay ưu đãi khi mua qua website
//             </p>
//           </div>
//           <div className="flex flex-wrap justify-center gap-3 z-10">
//             <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 text-center">
//               <p className="text-[10px] uppercase">Voucher giảm</p>
//               <p className="font-bold text-lg">600K</p>
//             </div>
//             <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 text-center">
//               <p className="text-[10px] uppercase">Tặng Chăn Tencel</p>
//               <p className="font-bold text-lg">1 TRIỆU</p>
//             </div>
//             <div className="bg-[#ffd700] text-[#003d71] px-4 py-2 rounded-lg font-bold flex flex-col items-center justify-center">
//               <p className="text-[10px] uppercase">Ưu đãi kép</p>
//               <p className="text-lg leading-none">7-10%</p>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100">
//           {/* LEFT: Hình ảnh */}
//           <div className="lg:col-span-7 space-y-4">
//             <div className="relative aspect-video md:aspect-square overflow-hidden rounded-2xl bg-gray-50 border border-gray-100 group">
//               <img
//                 src={mainImage || ""}
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 alt={selectedProduct.name}
//               />
//               <div className="absolute top-4 right-4 flex flex-col gap-2">
//                 <button className="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white text-gray-700">
//                   <Heart size={20} />
//                 </button>
//                 <button className="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white text-gray-700">
//                   <Share2 size={20} />
//                 </button>
//               </div>
//             </div>

//             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
//               {selectedProduct.images.map((img, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setMainImage(img.url)}
//                   className={`relative min-w-[80px] md:min-w-[100px] aspect-square rounded-xl overflow-hidden border-2 transition-all ${mainImage === img.url ? "border-[#1a4d32] shadow-md" : "border-gray-100 hover:border-gray-300"}`}
//                 >
//                   <img
//                     src={img.url}
//                     className="w-full h-full object-cover"
//                     alt="thumbnail"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* RIGHT: Thông tin và lựa chọn */}
//           <div className="lg:col-span-5 space-y-6">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2 italic">
//                 {selectedProduct.name}
//               </h1>
//               <div className="flex items-center gap-4 text-sm text-gray-500">
//                 <span className="bg-gray-100 px-2 py-0.5 rounded uppercase font-medium">
//                   SKU: {selectedProduct.sku}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   Thương hiệu:{" "}
//                   <b className="text-[#1a4d32]">{selectedProduct.brand}</b>
//                 </span>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <div className="flex text-orange-400">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     size={16}
//                     fill={
//                       i < Math.floor(selectedProduct.rating)
//                         ? "currentColor"
//                         : "none"
//                     }
//                   />
//                 ))}
//               </div>
//               <span className="text-orange-500 font-bold">
//                 {selectedProduct.rating.toFixed(1)}
//               </span>
//               <span className="text-gray-400 text-sm">
//                 ({selectedProduct.reviewCount} đánh giá)
//               </span>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
//               <div className="flex items-baseline gap-3">
//                 <span className="text-3xl font-black text-[#d71920]">
//                   {selectedProduct.price.toLocaleString("vi-VN")}₫
//                 </span>
//                 {selectedProduct.originalPrice && (
//                   <span className="text-lg text-gray-400 line-through">
//                     {selectedProduct.originalPrice.toLocaleString("vi-VN")}₫
//                   </span>
//                 )}
//               </div>
//               <p className="text-sm text-green-600 mt-1 font-medium">
//                 Tiết kiệm:{" "}
//                 {(
//                   selectedProduct.originalPrice! - selectedProduct.price
//                 ).toLocaleString("vi-VN")}
//                 ₫ so với giá thị trường
//               </p>
//             </div>

//             {/* Thuộc tính */}
//             <div className="space-y-5">
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
//                   Kích thước:
//                 </label>
//                 <div className="flex flex-wrap gap-2">
//                   {selectedProduct.sizes.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`px-4 py-2.5 rounded-lg border-2 text-sm font-bold transition-all ${selectedSize === size ? "bg-[#1a4d32] border-[#1a4d32] text-white shadow-md" : "bg-white border-gray-200 text-gray-600 hover:border-[#1a4d32]"}`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex items-center gap-6">
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
//                     Số lượng:
//                   </label>
//                   <div className="flex items-center border-2 border-gray-200 rounded-xl h-12 w-32 overflow-hidden shadow-sm">
//                     <button
//                       onClick={() => handleQuantityChange("minus")}
//                       className="flex-1 hover:bg-gray-50 transition-colors flex justify-center"
//                     >
//                       <Minus size={18} />
//                     </button>
//                     <span className="flex-1 text-center font-bold text-lg">
//                       {quantity}
//                     </span>
//                     <button
//                       onClick={() => handleQuantityChange("plus")}
//                       className="flex-1 hover:bg-gray-50 transition-colors flex justify-center"
//                     >
//                       <Plus size={18} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Quà tặng & Ưu đãi (Ảnh 4) */}
//             <div className="bg-[#e9f5ee] rounded-xl border border-[#c3e6cb] overflow-hidden">
//               <div className="bg-[#1a4d32] px-4 py-2 flex items-center gap-2 text-white font-bold text-sm uppercase">
//                 <Gift size={18} /> Quà tặng và ưu đãi
//               </div>
//               <ul className="p-4 space-y-3 text-sm text-[#155724] font-medium">
//                 <li className="flex items-start gap-2">
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#1a4d32] mt-1.5 shrink-0"></span>
//                   Giảm 10% cho đơn hàng từ 3 sản phẩm trở lên.
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#1a4d32] mt-1.5 shrink-0"></span>
//                   Miễn phí giao hàng toàn quốc cho đơn hàng trên 500.000 VNĐ.
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="w-1.5 h-1.5 rounded-full bg-[#1a4d32] mt-1.5 shrink-0"></span>
//                   Tặng ngay voucher 50.000 VNĐ cho khách hàng mới.
//                 </li>
//               </ul>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 pt-4">
//               <button
//                 onClick={handleAddToCart}
//                 disabled={isButtonDisabled}
//                 className="flex-[2] bg-[#1a4d32] text-white py-4 rounded-xl font-black text-lg hover:bg-[#143a26] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
//               >
//                 <ShoppingCart size={24} />
//                 {isButtonDisabled ? "ĐANG THÊM..." : "THÊM VÀO GIỎ HÀNG"}
//               </button>
//               <button className="flex-1 bg-white border-2 border-[#1a4d32] text-[#1a4d32] py-4 rounded-xl font-black text-lg hover:bg-gray-50 transition-all uppercase">
//                 Mua ngay
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tab chi tiết (Ảnh 5 & 6) */}
//         <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="flex border-b border-gray-100 bg-gray-50/50">
//             {["Thông tin sản phẩm", "Đánh giá"].map((tab, i) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(i === 0 ? "info" : "reviews")}
//                 className={`px-8 py-5 font-bold text-sm uppercase tracking-widest transition-all ${
//                   (i === 0 && activeTab === "info") ||
//                   (i === 1 && activeTab === "reviews")
//                     ? "text-[#1a4d32] border-b-2 border-[#1a4d32] bg-white"
//                     : "text-gray-400 hover:text-gray-600"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           <div className="p-6 md:p-10">
//             {activeTab === "info" ? (
//               <div className="prose prose-slate max-w-none">
//                 <h3 className="text-xl font-bold mb-4">Mô tả sản phẩm</h3>
//                 <p className="text-gray-600 leading-loose whitespace-pre-line">
//                   {selectedProduct.description}
//                 </p>

//                 <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="p-6 bg-[#f8f9fa] rounded-2xl border border-gray-100">
//                     <h4 className="font-bold flex items-center gap-2 mb-4 text-[#1a4d32]">
//                       <Truck size={20} /> Chính sách giao hàng
//                     </h4>
//                     <p className="text-sm text-gray-600">
//                       Giao hàng nhanh trong 2h tại TP.HCM & Hà Nội. Miễn phí vận
//                       chuyển toàn quốc cho đơn từ 500k.
//                     </p>
//                   </div>
//                   <div className="p-6 bg-[#f8f9fa] rounded-2xl border border-gray-100">
//                     <h4 className="font-bold flex items-center gap-2 mb-4 text-[#1a4d32]">
//                       <ShieldCheck size={20} /> Bảo hành chính hãng
//                     </h4>
//                     <p className="text-sm text-gray-600">
//                       Bảo hành 1 đổi 1 trong vòng 7 ngày nếu lỗi do NSX. Bảo
//                       hành nệm lên đến 10 năm.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-10">
//                 <p className="text-gray-500 italic mb-6">
//                   Hiện tại sản phẩm chưa có đánh giá nào, bạn hãy trở thành
//                   người đầu tiên đánh giá cho sản phẩm này
//                 </p>
//                 <button className="bg-[#1a4d32] text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wide">
//                   Gửi đánh giá của bạn
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Similar Products */}
//         <div className="mt-16">
//           <div className="flex items-center justify-between mb-8">
//             <h2 className="text-2xl font-black italic uppercase tracking-tighter text-[#1a4d32]">
//               Gợi ý cho bạn
//             </h2>
//             <div className="h-px flex-1 bg-gray-100 mx-6 hidden md:block"></div>
//           </div>
//           <ProductGrid
//             products={similarProducts}
//             loading={loading}
//             error={error}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

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
