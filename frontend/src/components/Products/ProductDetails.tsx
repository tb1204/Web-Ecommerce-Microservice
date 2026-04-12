// import { useState } from "react";
// import {
//   Star,
//   CheckCircle,
//   ShoppingCart,
//   ShieldCheck,
//   Truck,
//   ChevronRight,
//   ChevronLeft,
// } from "lucide-react";
// import { toast } from "sonner";
// import ProductGrid from "./ProductGrid";
// import ProductReviews from "./ProductReviews";
// import image from "../../assets/banner/Banner-phu-1.webp";
// import image1 from "../../assets/banner/banner-phu-3.webp";

// const fakeSelectedProduct = {
//   _id: "p1",
//   name: "Nệm lò xo đa tầng Sleep Wave Hybrid (SleepWave) - WolfBed Edition",
//   brand: "Goodnight",
//   origin: "Chính hãng",
//   price: 4400000,
//   originalPrice: 6900000,
//   sku: "MAT-SW-2026-PREMIUM",
//   rating: 5,
//   reviewCount: 150,
//   promoBanner: image,
//   images: [
//     { url: image, is_primary: true },
//     { url: image1, is_primary: false },
//     { url: image, is_primary: false },
//     { url: image1, is_primary: false },
//     { url: image1, is_primary: false },
//     { url: image, is_primary: false },
//   ],
//   contentHtml: `
//     <div class="space-y-6 text-gray-700">
//       <h2 class="text-2xl font-bold text-green-900">1. Cấu tạo nệm Hybrid độc quyền</h2>
//       <p>SleepWave Hybrid không chỉ là một chiếc nệm, đó là thành quả của công nghệ 2026. Sự kết hợp giữa <b>lò xo túi độc lập 18cm</b> và lớp <b>Memory Foam</b> giúp ôm sát đường cong cơ thể.</p>
//       <h2 class="text-2xl font-bold text-green-900">2. Khả năng kháng khuẩn tuyệt đối</h2>
//       <p>Vỏ nệm được dệt từ sợi tơ tằm kết hợp tinh chất bạc, giúp loại bỏ 99% vi khuẩn và nấm mốc, mang lại môi trường ngủ sạch sẽ nhất cho gia đình bạn.</p>
//       <ul class="list-disc pl-5 space-y-2">
//         <li>Nâng đỡ 7 vùng cơ thể trọng yếu.</li>
//         <li>Cách ly chuyển động tuyệt đối, không gây tiếng ồn.</li>
//         <li>Độ bền lên đến 20 năm.</li>
//       </ul>
//     </div>
//   `,
//   reviews: [
//     {
//       id: 1,
//       user: "Nguyễn Văn A",
//       star: 5,
//       content:
//         "Nệm nằm rất êm, giao hàng nhanh và đóng gói cẩn thận. Rất hài lòng với dịch vụ!",
//       date: "20/01/2026",
//       hasImage: true,
//       userAvatar: image1,
//     },
//     {
//       id: 2,
//       user: "Trần Thị B",
//       star: 3,
//       content: "Hơi cứng so với mình nghĩ nhưng nằm quen thì rất thích.",
//       date: "15/01/2026",
//       hasImage: false,
//       userAvatar: image,
//     },
//     {
//       id: 3,
//       user: "Wolf Themes",
//       star: 5,
//       content: "Dịch vụ của WolfBed luôn đẳng cấp. Nệm nằm không bị nóng lưng.",
//       date: "10/01/2026",
//       hasImage: true,
//       userAvatar: image,
//     },
//   ],
// };

// // Dữ liệu cho ProductGrid
// const fakeSimilarProducts = Array(6)
//   .fill(null)
//   .map((_, i) => ({
//     _id: `s${i}`,
//     name: i % 2 === 0 ? "Gối cao su Kim Cương" : "Bộ ga chun Bamboo Premium",
//     price: 600000 + i * 50000,
//     originalPrice: 850000,
//     images: [{ url: i % 2 === 0 ? image : image1, is_primary: true }],
//     status: "selling" as const,
//     stock_quantity: 10,
//     brand: "WolfBed",
//     rating: 4.5,
//     reviewCount: 20,
//   }));

// const ProductDetails = () => {
//   const [selectedProduct] = useState(fakeSelectedProduct);
//   const [currentImgIndex, setCurrentImgIndex] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedThickness, setSelectedThickness] = useState("");

//   // Logic chuyển ảnh
//   const handleNext = () => {
//     setCurrentImgIndex((prev) =>
//       prev === selectedProduct.images.length - 1 ? 0 : prev + 1,
//     );
//   };

//   const handlePrev = () => {
//     setCurrentImgIndex((prev) =>
//       prev === 0 ? selectedProduct.images.length - 1 : prev - 1,
//     );
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans transition-colors duration-300 text-gray-900 bg-white dark:text-gray-100 dark:bg-gray-900">
//       {/* BREADCRUMB */}
//       <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs md:text-sm text-gray-400 mb-4 sm:mb-6 uppercase tracking-[0.15em] font-semibold">
//         <span className="whitespace-nowrap">Trang chủ</span>
//         <ChevronRight size={12} className="shrink-0" />
//         <span className="whitespace-nowrap">Sản phẩm</span>
//         <ChevronRight size={12} className="shrink-0" />
//         <span className="text-gray-800 dark:text-gray-200 font-bold truncate max-w-[200px] sm:max-w-none">
//           {selectedProduct.name}
//         </span>
//       </nav>

//       {/* 1. BANNER KHUYẾN MÃI */}
//       <div className="mb-12 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
//         <img
//           src={selectedProduct.promoBanner}
//           alt="Sale Banner"
//           className="w-full h-auto"
//         />
//       </div>

//       {/* 2. KHU VỰC THÔNG TIN CHÍNH */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-16 lg:mb-24">
//         {/* Bên trái: Slider ảnh */}
//         <div className="flex flex-col gap-8">
//           <div className="relative group aspect-square rounded-2xl sm:rounded-3xl lg:rounded-[40px] overflow-hidden bg-[#F8F8F8] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-inner">
//             <div
//               className="flex w-full h-full transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
//               style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
//             >
//               {selectedProduct.images.map((img, idx) => (
//                 <div key={idx} className="w-full h-full flex-shrink-0">
//                   <img
//                     src={img.url}
//                     className="w-full h-full object-cover"
//                     alt="Product"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Nút prev/next */}
//             <button
//               onClick={handlePrev}
//               className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 dark:text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
//             >
//               <ChevronLeft size={24} />
//             </button>
//             <button
//               onClick={handleNext}
//               className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 dark:text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
//             >
//               <ChevronRight size={24} />
//             </button>
//           </div>

//           {/* Indicator thanh trượt */}
//           <div className="px-4">
//             <div className="relative w-full h-[2px] bg-gray-100 dark:bg-gray-800 rounded-full">
//               <div
//                 className="absolute h-full bg-black dark:bg-green-500 rounded-full transition-all duration-700 ease-in-out"
//                 style={{
//                   width: `${100 / selectedProduct.images.length}%`,
//                   left: `${(currentImgIndex * 100) / selectedProduct.images.length}%`,
//                 }}
//               />
//             </div>
//           </div>

//           {/* Thumbnails */}
//           <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-center">
//             {selectedProduct.images.map((img, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setCurrentImgIndex(idx)}
//                 className={`w-24 h-24 flex-shrink-0 rounded-2xl border-2 transition-all ${
//                   currentImgIndex === idx
//                     ? "border-green-800 dark:border-green-500 scale-105 shadow-md"
//                     : "border-gray-100 dark:border-gray-800 opacity-60 hover:opacity-100"
//                 }`}
//               >
//                 <img
//                   src={img.url}
//                   className="w-full h-full object-cover rounded-xl"
//                   alt="thumb"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Bên phải: Thông tin & mua hàng */}
//         <div className="flex flex-col py-2">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
//               {selectedProduct.name}
//             </h1>
//             <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
//               <span>
//                 SKU: <span className="text-gray-500 italic">Đang cập nhật</span>
//               </span>
//               <span className="text-gray-200 dark:text-gray-700">|</span>
//               <span>
//                 Thương hiệu:{" "}
//                 <span className="text-green-800 dark:text-green-400 font-bold">
//                   {selectedProduct.brand}
//                 </span>
//               </span>
//               <span className="text-gray-200 dark:text-gray-700">|</span>
//               <div className="flex items-center gap-1">
//                 <div className="flex text-yellow-400">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} size={14} fill="currentColor" />
//                   ))}
//                 </div>
//                 <span className="text-xs">1 đánh giá</span>
//               </div>
//             </div>
//           </div>

//           {/* Giá cả */}
//           <div className="mb-8">
//             <div className="flex items-center gap-4">
//               <span className="text-4xl font-bold text-red-600 dark:text-red-500">
//                 {selectedProduct.price.toLocaleString()}₫
//               </span>
//               <span className="text-xl text-gray-400 line-through">
//                 {selectedProduct.originalPrice.toLocaleString()}₫
//               </span>
//             </div>
//             <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">
//               Tiết kiệm:{" "}
//               <span className="text-green-700 dark:text-green-400 font-semibold">
//                 2.500.000₫
//               </span>{" "}
//               so với giá thị trường
//             </p>
//           </div>

//           {/* Khu vực chọn biến thể */}
//           <div className="bg-[#4ea67514] dark:bg-green-950/20 border border-green-50 dark:border-green-900/30 rounded-xl p-6 mb-8 space-y-6 transition-colors">
//             {/* Kích thước */}
//             <div>
//               <p className="text-sm font-bold mb-3 dark:text-gray-200">
//                 Kích thước (cm):{" "}
//                 <span className="font-normal text-gray-500 dark:text-gray-400">
//                   {selectedSize}
//                 </span>
//               </p>
//               <div className="flex flex-wrap gap-3">
//                 {["120x200", "160x200", "180x200", "220x200"].map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => setSelectedSize(size)}
//                     className={`relative px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
//                       selectedSize === size
//                         ? "border-green-800 text-green-900 bg-white dark:bg-green-800 dark:text-white dark:border-green-400"
//                         : "border-gray-200 text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
//                     }`}
//                   >
//                     {size}
//                     {selectedSize === size && (
//                       <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-[2px]">
//                         <CheckCircle size={10} fill="currentColor" />
//                       </div>
//                     )}
//                   </button>
//                 ))}
//               </div>

//               {/* Độ dày */}
//               <div>
//                 <p className="text-sm font-bold mb-3 text-gray-800 dark:text-gray-200">
//                   Độ dày (cm):{" "}
//                   <span className="font-normal text-gray-500 dark:text-gray-400">
//                     {selectedThickness}
//                   </span>
//                 </p>

//                 <div className="flex flex-wrap gap-3">
//                   {["20", "10"].map((thick) => (
//                     <button
//                       key={thick}
//                       onClick={() => setSelectedThickness(thick)}
//                       className={`relative px-6 py-2 rounded-lg border text-sm font-medium transition
//           ${
//             selectedThickness === thick
//               ? "border-green-700 bg-green-50 text-green-900 dark:bg-green-900/30 dark:border-green-500 dark:text-green-400"
//               : "border-gray-300 bg-white text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
//           }
//         `}
//                     >
//                       {thick}

//                       {selectedThickness === thick && (
//                         <div className="absolute -top-1 -right-1 bg-green-600 dark:bg-green-500 text-white rounded-full p-[2px]">
//                           <CheckCircle size={10} fill="currentColor" />
//                         </div>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Số lượng */}
//             <div className="flex items-center gap-6">
//               <p className="text-sm font-bold dark:text-gray-200">Số lượng:</p>
//               <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
//                 <button
//                   onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                   className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-400 text-xl"
//                 >
//                   −
//                 </button>
//                 <input
//                   type="text"
//                   value={quantity}
//                   readOnly
//                   className="w-12 text-center font-bold border-x border-gray-200 dark:border-gray-700 h-10 outline-none bg-transparent"
//                 />
//                 <button
//                   onClick={() => setQuantity((q) => q + 1)}
//                   className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-400 text-xl"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Nút hành động */}
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
//               <button className="flex-[2.5] bg-[#004d31] dark:bg-green-700 hover:bg-[#003d27] dark:hover:bg-green-600 text-white py-2 sm:py-2.5 rounded-xl flex flex-col items-center justify-center transition-all active:scale-[0.98] shadow-md">
//                 <span className="font-bold text-sm sm:text-base lg:text-[15px] uppercase tracking-wider">
//                   Mua ngay
//                 </span>
//                 <span className="text-[10px] sm:text-xs lg:text-[11px] opacity-80 font-light italic">
//                   (Giao tận nơi hoặc nhận tại cửa hàng)
//                 </span>
//               </button>

//               <button
//                 onClick={() => toast.success("Đã thêm vào giỏ hàng")}
//                 className="flex-1 border-2 border-[#004d31] dark:border-green-600 text-[#004d31] dark:text-green-500 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase hover:bg-[#004d31] dark:hover:bg-green-600 hover:text-white transition-all"
//               >
//                 <ShoppingCart size={18} className="shrink-0" />
//                 <span className="whitespace-nowrap">Thêm vào giỏ</span>
//               </button>
//             </div>
//           </div>

//           {/* Chính sách */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400">
//               <ShieldCheck
//                 className="text-green-700 dark:text-green-500"
//                 size={18}
//               />{" "}
//               Bảo hành 10 năm
//             </div>
//             <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400">
//               <Truck className="text-green-700 dark:text-green-500" size={18} />{" "}
//               Miễn phí vận chuyển
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 3. CHI TIẾT SẢN PHẨM */}
//       <div className="mb-24 py-16 border-t border-gray-100 dark:border-gray-800">
//         <h2 className="text-3xl font-black mb-12 border-b-4 border-green-900 dark:border-green-500 inline-block pb-3 uppercase italic tracking-tighter dark:text-white">
//           Chi tiết sản phẩm
//         </h2>
//         <div
//           className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed"
//           dangerouslySetInnerHTML={{ __html: selectedProduct.contentHtml }}
//         />
//       </div>

//       {/* 4. ĐÁNH GIÁ & SẢN PHẨM TƯƠNG TỰ - Đảm bảo component con cũng nhận được dark mode */}
//       <ProductReviews
//         reviews={selectedProduct.reviews}
//         reviewCount={selectedProduct.reviewCount}
//         averageRating={4.9}
//       />

//       <div className="border-t border-gray-100 dark:border-gray-800 pt-24 pb-24">
//         <div className="flex justify-between items-end mb-16 px-2">
//           <div>
//             <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 dark:text-white">
//               Sản phẩm tương tự
//             </h2>
//             <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 font-medium underline">
//               Artisano gợi ý cho không gian của bạn
//             </p>
//           </div>
//           <button className="text-green-900 dark:text-green-500 font-black border-b-4 border-green-900 dark:border-green-500 pb-1 text-sm uppercase tracking-widest">
//             Xem tất cả
//           </button>
//         </div>
//         <ProductGrid products={fakeSimilarProducts} />
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

//lấy dữ liệu thật từ backend
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice";
import { openCartDrawer } from "../../store/slices/uiSlice";
import { setCheckoutItems } from "../../store/slices/cartSlice";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import type { Product, ProductVariant } from "../Products/InterfaceItem";

// const BASE_URL = "http://localhost:8082";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const mapProduct = (p: any): Product => {
  const discountVariant = p.variants?.find(
    (v: any) => v.originalPrice && v.originalPrice > v.price,
  );
  return {
    id: p._id?.$oid ?? p.id ?? p._id,
    name: p.name ?? "",
    brand: p.brand,
    origin: p.origin,
    productCode: p.productCode,
    price: p.price ?? 0,
    originalPrice: discountVariant?.originalPrice ?? undefined,
    totalStockQuantity: p.totalStockQuantity ?? 0,
    stockQuantity: p.totalStockQuantity ?? 0,
    variants: p.variants ?? [],
    images: (p.images ?? []).map((img: any) => ({
      url: img.url,
      isPrimary: img.isPrimary ?? false,
    })),
    status:
      p.status === "AVAILABLE"
        ? "selling"
        : p.status === "OUT_OF_STOCK"
          ? "stopselling"
          : (p.status ?? "selling"),
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    category: p.category
      ? {
          name: p.category.name,
          code: p.category.code,
          parentName: p.category.parentName ?? null,
          parentCode: p.category.parentCode ?? null,
        }
      : undefined,
    specifications: p.specifications ?? undefined,
    tags: p.tags ?? [],
    description: p.description ?? "",
    createdAt: p.createdAt?.$date ?? p.createdAt,
    updatedAt: p.updatedAt?.$date ?? p.updatedAt,
  };
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [addingToCart, setAddingToCart] = useState(false);

  // ✅ State rating thực tế từ ReviewService
  const [actualRating, setActualRating] = useState<number>(0);
  const [actualReviewCount, setActualReviewCount] = useState<number>(0);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setCurrentImgIndex(0);
        setSelectedVariant(null);

        const res = await axios.get(`${BASE_URL}/api/products/detail/${id}`);
        const mapped = mapProduct(res.data);
        setProduct(mapped);

        const firstAvailable =
          mapped.variants?.find((v) => (v.stockQuantity ?? 0) > 0) ??
          mapped.variants?.[0] ??
          null;
        setSelectedVariant(firstAvailable);

        // ✅ Lấy rating thực tế từ ReviewService
        try {
          const ratingRes = await axios.post(
            `${BASE_URL}/api/reviews/ratings/batch`,
            [mapped.id],
          );
          const ratingData = ratingRes.data[mapped.id];
          if (ratingData) {
            setActualRating(ratingData.rating ?? 0);
            setActualReviewCount(ratingData.reviewCount ?? 0);
          } else {
            setActualRating(mapped.rating ?? 0);
            setActualReviewCount(mapped.reviewCount ?? 0);
          }
        } catch {
          // Nếu ReviewService lỗi, dùng giá trị từ product-service
          setActualRating(mapped.rating ?? 0);
          setActualReviewCount(mapped.reviewCount ?? 0);
        }

        if (res.data.category?.parentCode) {
          const similarRes = await axios.get(
            `${BASE_URL}/api/products/parent-category/${res.data.category.parentCode}`,
          );
          // ✅ Đảm bảo data là array trước khi .map().filter() — tránh lỗi "a.filter is not a function"
          const rawData = Array.isArray(similarRes.data) ? similarRes.data : [];
          const mappedSimilar = rawData
            .map(mapProduct)
            .filter((p: Product) => p.id !== mapped.id)
            .slice(0, 6);
          setSimilarProducts(mappedSimilar);
        }
      } catch (err: any) {
        setError("Không tìm thấy sản phẩm. Vui lòng thử lại.");
        console.error("Lỗi fetch product detail:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ TÁCH LOGIC THÊM VÀO GIỎ THÀNH HÀM RIÊNG
  const addProductToCart = async () => {
    if (!product || !selectedVariant) return;
    if ((selectedVariant.stockQuantity ?? 0) <= 0)
      throw new Error("Biến thể này đã hết hàng!");

    const token = await getToken({ template: "my-backend" });
    await dispatch(
      addToCart({
        token,
        product: {
          productId: product.id,
          variantId: selectedVariant.variantId,
          name: product.name,
          price: selectedVariant.price ?? product.price,
          quantity,
          image:
            product.images?.find((img) => img.isPrimary)?.url ||
            product.images?.[0]?.url ||
            "",
          size: selectedVariant.size,
          thickness: selectedVariant.thickness,
          color: selectedVariant.color,
        },
      }),
    ).unwrap();
  };

  // ✅ SỬA: chỉ mở drawer khi bấm "Thêm vào giỏ"
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Vui lòng chọn biến thể sản phẩm!");
      return;
    }
    setAddingToCart(true);
    try {
      await addProductToCart();
      toast.success("Đã thêm vào giỏ hàng!");
      // dispatch(openCartDrawer());
    } catch (err: any) {
      toast.error(err?.message ?? "Thêm vào giỏ thất bại!");
    } finally {
      setAddingToCart(false);
    }
  };

  // ✅ SỬA: KHÔNG mở drawer, chỉ navigate sang checkout
  // const handleBuyNow = async () => {
  //   if (!selectedVariant) {
  //     toast.error("Vui lòng chọn biến thể sản phẩm!");
  //     return;
  //   }
  //   setAddingToCart(true);
  //   try {
  //     await addProductToCart();
  //     navigate("/checkout");
  //   } catch (err: any) {
  //     toast.error(err?.message ?? "Thêm vào giỏ thất bại!");
  //   } finally {
  //     setAddingToCart(false);
  //   }
  // };

  //fix lỗi mua ngay
  const handleBuyNow = () => {
    if (!selectedVariant) {
      toast.error("Vui lòng chọn biến thể sản phẩm!");
      return;
    }
    if ((selectedVariant.stockQuantity ?? 0) <= 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }

    const buyNowItem = {
      productId: product!.id,
      variantId: selectedVariant.variantId,
      name: product!.name,
      price: selectedVariant.price ?? product!.price,
      quantity,
      image:
        product!.images?.find((img) => img.isPrimary)?.url ||
        product!.images?.[0]?.url ||
        "",
      size: selectedVariant.size,
      thickness: selectedVariant.thickness,
      color: selectedVariant.color,
    };

    // Dispatch vào Redux, không cần đăng nhập
    dispatch(setCheckoutItems({ items: [buyNowItem], isBuyNow: true }));
    navigate("/checkout");
  };
  const handleNext = () =>
    setCurrentImgIndex((prev) =>
      prev === (product?.images.length ?? 1) - 1 ? 0 : prev + 1,
    );

  const handlePrev = () =>
    setCurrentImgIndex((prev) =>
      prev === 0 ? (product?.images.length ?? 1) - 1 : prev - 1,
    );

  const displayPrice = selectedVariant?.price ?? product?.price ?? 0;
  const displayOriginalPrice =
    selectedVariant?.originalPrice ?? product?.originalPrice;
  const hasDiscount =
    displayOriginalPrice && displayOriginalPrice > displayPrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((displayOriginalPrice! - displayPrice) / displayOriginalPrice!) * 100,
      )
    : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/2" />
            <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/3" />
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
                />
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <p className="text-red-500 font-bold text-lg mb-4">
          {error ?? "Không tìm thấy sản phẩm"}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-green-800 text-white rounded-xl font-bold hover:bg-green-900 transition-all"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans transition-colors duration-300 text-gray-900 bg-white dark:text-gray-100 dark:bg-gray-900">
      {/* BREADCRUMB */}
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs md:text-sm text-gray-400 mb-4 sm:mb-6 uppercase tracking-[0.15em] font-semibold">
        <span
          className="whitespace-nowrap cursor-pointer hover:text-green-700"
          onClick={() => navigate("/")}
        >
          Trang chủ
        </span>
        <ChevronRight size={12} className="shrink-0" />
        <span
          className="whitespace-nowrap cursor-pointer hover:text-green-700"
          onClick={() => navigate("/collections/all")}
        >
          Sản phẩm
        </span>
        <ChevronRight size={12} className="shrink-0" />
        <span className="text-gray-800 dark:text-gray-200 font-bold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* KHU VỰC THÔNG TIN CHÍNH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-16 lg:mb-24">
        {/* Bên trái: Slider ảnh */}
        <div className="flex flex-col gap-8">
          <div className="relative group aspect-square rounded-2xl sm:rounded-3xl lg:rounded-[40px] overflow-hidden bg-[#F8F8F8] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-inner">
            <div
              className="flex w-full h-full transition-transform duration-700"
              style={{ transform: `translateX(-${currentImgIndex * 100}%)` }}
            >
              {product.images.map((img, idx) => (
                <div key={idx} className="w-full h-full flex-shrink-0">
                  <img
                    src={img.url}
                    className="w-full h-full object-cover"
                    alt={`${product.name} ${idx + 1}`}
                  />
                </div>
              ))}
            </div>

            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                -{discountPercent}%
              </div>
            )}

            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 dark:text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 dark:text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="px-4">
            <div className="relative w-full h-[2px] bg-gray-100 dark:bg-gray-800 rounded-full">
              <div
                className="absolute h-full bg-black dark:bg-green-500 rounded-full transition-all duration-700 ease-in-out"
                style={{
                  width: `${100 / (product.images.length || 1)}%`,
                  left: `${(currentImgIndex * 100) / (product.images.length || 1)}%`,
                }}
              />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-center">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImgIndex(idx)}
                className={`w-24 h-24 flex-shrink-0 rounded-2xl border-2 transition-all ${
                  currentImgIndex === idx
                    ? "border-green-800 dark:border-green-500 scale-105 shadow-md"
                    : "border-gray-100 dark:border-gray-800 opacity-60 hover:opacity-100"
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              {product.name}
            </h1>
            {/* <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
              <span>
                Mã SP:{" "}
                <span className="text-gray-500 italic">
                  {product.productCode ?? "Đang cập nhật"}
                </span>
              </span>
              <span className="text-gray-200 dark:text-gray-700">|</span>
              <span>
                Thương hiệu:{" "}
                <span className="text-green-800 dark:text-green-400 font-bold">
                  {product.brand ?? "—"}
                </span>
              </span>
              <span className="text-gray-200 dark:text-gray-700">|</span>
              <span>
                Xuất xứ:{" "}
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {product.origin ?? "—"}
                </span>
              </span>
              {product.rating && product.rating > 0 ? (
                <>
                  <span className="text-gray-200 dark:text-gray-700">|</span>
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={
                            i < Math.floor(product.rating!)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs">
                      ({product.reviewCount ?? 0} đánh giá)
                    </span>
                  </div>
                </>
              ) : null}
            </div> */}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
              <span>
                Mã SP:{" "}
                <span className="text-gray-500 italic">
                  {product.productCode ?? "Đang cập nhật"}
                </span>
              </span>

              {/* ← THÊM SKU của variant đang chọn */}
              {selectedVariant?.sku && (
                <>
                  <span className="text-gray-200 dark:text-gray-700">|</span>
                  <span>
                    SKU:{" "}
                    <span className="text-gray-500  ">
                      {selectedVariant.sku}
                    </span>
                  </span>
                </>
              )}

              <span className="text-gray-200 dark:text-gray-700">|</span>
              <span>
                Thương hiệu:{" "}
                <span className="text-green-800 dark:text-green-400 font-bold">
                  {product.brand ?? "—"}
                </span>
              </span>

              <span className="text-gray-200 dark:text-gray-700">|</span>
              <span>
                Xuất xứ:{" "}
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {product.origin ?? "—"}
                </span>
              </span>

              {/* ← LUÔN hiện sao, dùng rating thực tế từ ReviewService */}
              <span className="text-gray-200 dark:text-gray-700">|</span>
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={
                        i < Math.floor(actualRating)
                          ? "currentColor"
                          : i < actualRating
                            ? "currentColor"
                            : "none"
                      }
                      className={
                        i < Math.floor(actualRating)
                          ? "text-yellow-400"
                          : i < actualRating
                            ? "text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  {actualRating > 0 ? actualRating.toFixed(1) : "0"} (
                  {actualReviewCount} đánh giá)
                </span>
              </div>
            </div>
          </div>
          {/* Giá cả */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-red-600 dark:text-red-500">
                {displayPrice.toLocaleString("vi-VN")}₫
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">
                  {displayOriginalPrice!.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">
                Tiết kiệm:{" "}
                <span className="text-green-700 dark:text-green-400 font-semibold">
                  {(displayOriginalPrice! - displayPrice).toLocaleString(
                    "vi-VN",
                  )}
                  ₫
                </span>{" "}
                so với giá gốc
              </p>
            )}
          </div>

          {/* Chọn biến thể */}
          <div className="bg-[#4ea67514] dark:bg-green-950/20 border border-green-50 dark:border-green-900/30 rounded-xl p-6 mb-8 space-y-6">
            {/* KÍCH THƯỚC */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <p className="text-sm font-bold mb-3 dark:text-gray-200">
                  Kích thước: (cm)
                </p>
                <div className="flex flex-wrap gap-3">
                  {/* Lọc unique sizes */}
                  {[
                    ...new Map(
                      product.variants.map((v) => [v.size, v]),
                    ).values(),
                  ].map((v) => {
                    // Kiểm tra size này còn hàng không (ít nhất 1 variant với size này còn hàng)
                    const hasStock = product.variants.some(
                      (pv) => pv.size === v.size && (pv.stockQuantity ?? 0) > 0,
                    );
                    const isSelected = selectedVariant?.size === v.size;

                    return (
                      <button
                        key={v.size}
                        disabled={!hasStock}
                        onClick={() => {
                          const currentThickness = selectedVariant?.thickness;
                          const matchVariant =
                            product.variants.find(
                              (pv) =>
                                pv.size === v.size &&
                                pv.thickness === currentThickness &&
                                (pv.stockQuantity ?? 0) > 0,
                            ) ??
                            product.variants.find(
                              (pv) =>
                                pv.size === v.size &&
                                (pv.stockQuantity ?? 0) > 0,
                            ) ??
                            product.variants.find((pv) => pv.size === v.size);

                          setSelectedVariant(matchVariant ?? null);
                        }}
                        className={`relative px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          isSelected
                            ? "border-green-800 text-green-900 bg-white dark:bg-green-800 dark:text-white dark:border-green-400"
                            : !hasStock
                              ? "border-gray-200 text-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 cursor-not-allowed line-through"
                              : "border-gray-200 text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-green-600"
                        }`}
                      >
                        {v.size}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-[2px]">
                            <CheckCircle size={10} fill="currentColor" />
                          </div>
                        )}
                        {!hasStock && (
                          <span className="absolute -top-1 -right-1 text-[9px] bg-red-500 text-white px-1 rounded">
                            Hết
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ĐỘ DÀY — chỉ hiện nếu có ít nhất 1 variant có thickness */}
            {product.variants?.some((v) => v.thickness) &&
              (() => {
                // Lọc các thickness có thể chọn với size hiện tại
                const currentSize = selectedVariant?.size;
                const availableThicknesses = [
                  ...new Map(
                    product.variants
                      .filter((v) => !currentSize || v.size === currentSize)
                      .filter((v) => v.thickness)
                      .map((v) => [v.thickness, v]),
                  ).values(),
                ];

                if (availableThicknesses.length === 0) return null;

                return (
                  <div>
                    <p className="text-sm font-bold mb-3 dark:text-gray-200">
                      Độ dày: (cm)
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {availableThicknesses.map((v) => {
                        // Tìm variant với size hiện tại + thickness này
                        const targetVariant = product.variants.find(
                          (pv) =>
                            pv.thickness === v.thickness &&
                            (!currentSize || pv.size === currentSize),
                        );
                        const outOfStock =
                          (targetVariant?.stockQuantity ?? 0) <= 0;
                        const isSelected =
                          selectedVariant?.thickness === v.thickness;

                        return (
                          <button
                            key={v.thickness}
                            disabled={outOfStock}
                            onClick={() => {
                              if (targetVariant)
                                setSelectedVariant(targetVariant);
                            }}
                            className={`relative px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                              isSelected
                                ? "border-green-800 text-green-900 bg-white dark:bg-green-800 dark:text-white dark:border-green-400"
                                : outOfStock
                                  ? "border-gray-200 text-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 cursor-not-allowed line-through"
                                  : "border-gray-200 text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-green-600"
                            }`}
                          >
                            {v.thickness}
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-[2px]">
                                <CheckCircle size={10} fill="currentColor" />
                              </div>
                            )}
                            {outOfStock && (
                              <span className="absolute -top-1 -right-1 text-[9px] bg-red-500 text-white px-1 rounded">
                                Hết
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

            {/* MÀU SẮC — chỉ hiện nếu có */}
            {product.variants?.some((v) => v.color && v.color.trim() !== "") &&
              (() => {
                const currentSize = selectedVariant?.size;
                const currentThickness = selectedVariant?.thickness;
                const availableColors = [
                  ...new Map(
                    product.variants
                      .filter((v) => v.color && v.color.trim() !== "")
                      .filter((v) => !currentSize || v.size === currentSize)
                      .map((v) => [v.color, v]),
                  ).values(),
                ];

                if (availableColors.length === 0) return null;

                return (
                  <div>
                    <p className="text-sm font-bold mb-3 dark:text-gray-200">
                      Màu sắc:{" "}
                      <span className="font-normal text-gray-500">
                        {selectedVariant?.color ?? ""}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {availableColors.map((v) => {
                        const targetVariant = product.variants.find(
                          (pv) =>
                            pv.color === v.color &&
                            (!currentSize || pv.size === currentSize) &&
                            (!currentThickness ||
                              pv.thickness === currentThickness),
                        );
                        const isSelected = selectedVariant?.color === v.color;

                        return (
                          <button
                            key={v.color}
                            onClick={() => {
                              if (targetVariant)
                                setSelectedVariant(targetVariant);
                            }}
                            className={`relative px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                              isSelected
                                ? "border-green-800 bg-green-50 text-green-900 dark:bg-green-800 dark:text-white dark:border-green-400"
                                : "border-gray-200 text-gray-500 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:border-green-600"
                            }`}
                          >
                            {v.color}
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-[2px]">
                                <CheckCircle size={10} fill="currentColor" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

            {/* TỒN KHO */}
            {selectedVariant && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Còn lại:{" "}
                <span
                  className={`font-bold ${
                    (selectedVariant.stockQuantity ?? 0) > 5
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {selectedVariant.stockQuantity ?? 0} sản phẩm
                </span>
              </p>
            )}

            {/* SỐ LƯỢNG */}
            <div className="flex items-center gap-6">
              <p className="text-sm font-bold dark:text-gray-200">Số lượng:</p>
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-800 dark:hover:text-green-400 text-xl"
                >
                  −
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-12 text-center font-bold border-x border-gray-200 dark:border-gray-700 h-10 outline-none bg-transparent"
                />
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(q + 1, selectedVariant?.stockQuantity ?? 99),
                    )
                  }
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-green-800 dark:hover:text-green-400 text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* NÚT HÀNH ĐỘNG */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                onClick={handleBuyNow}
                disabled={
                  addingToCart ||
                  !selectedVariant ||
                  (selectedVariant.stockQuantity ?? 0) <= 0
                }
                className="flex-[2.5] bg-[#004d31] dark:bg-green-700 hover:bg-[#003d27] dark:hover:bg-green-600 text-white py-2 sm:py-2.5 rounded-xl flex flex-col items-center justify-center transition-all active:scale-[0.98] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-bold text-sm sm:text-base uppercase tracking-wider">
                  Mua ngay
                </span>
                <span className="text-[10px] sm:text-xs opacity-80 font-light italic">
                  (Giao tận nơi hoặc nhận tại cửa hàng)
                </span>
              </button>

              <button
                onClick={handleAddToCart}
                disabled={
                  addingToCart ||
                  !selectedVariant ||
                  (selectedVariant.stockQuantity ?? 0) <= 0
                }
                className="flex-1 border-2 border-[#004d31] dark:border-green-600 text-[#004d31] dark:text-green-500 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-xs uppercase hover:bg-[#004d31] dark:hover:bg-green-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} className="shrink-0" />
                <span className="whitespace-nowrap">
                  {addingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
                </span>
              </button>
            </div>
          </div>
          {/* Chính sách */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400">
              <ShieldCheck
                className="text-green-700 dark:text-green-500"
                size={18}
              />
              Bảo hành 10 năm
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400">
              <Truck className="text-green-700 dark:text-green-500" size={18} />
              Miễn phí vận chuyển
            </div>
          </div>
        </div>
      </div>

      {/* CHI TIẾT SẢN PHẨM */}
      {product.description && (
        <div className="mb-24 py-16 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-black mb-12 border-b-4 border-green-900 dark:border-green-500 inline-block pb-3 uppercase italic tracking-tighter dark:text-white">
            Chi tiết sản phẩm
          </h2>

          {product.specifications && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications.material && (
                <div className="flex gap-2 text-sm">
                  <span className="font-bold text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Chất liệu:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {product.specifications.material}
                  </span>
                </div>
              )}
              {product.specifications.firmness && (
                <div className="flex gap-2 text-sm">
                  <span className="font-bold text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Độ cứng:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {product.specifications.firmness}
                  </span>
                </div>
              )}
              {product.specifications.weight && (
                <div className="flex gap-2 text-sm">
                  <span className="font-bold text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Khối lượng:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {product.specifications.weight}
                  </span>
                </div>
              )}
              {product.specifications.design && (
                <div className="flex gap-2 text-sm">
                  <span className="font-bold text-gray-700 dark:text-gray-300 min-w-[120px]">
                    Thiết kế:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {product.specifications.design}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.description}
          </div>
        </div>
      )}

      {/* ĐÁNH GIÁ */}
      {/* <ProductReviews
        reviews={[]}
        reviewCount={product.reviewCount ?? 0}
        averageRating={product.rating ?? 0}
      /> */}
      {product && <ProductReviews productId={product.id} />}

      {/* SẢN PHẨM TƯƠNG TỰ */}
      {similarProducts.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-800 pt-24 pb-24">
          <div className="flex justify-between items-end mb-16 px-2">
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 dark:text-white">
                Sản phẩm tương tự
              </h2>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 font-medium underline">
                Artisano gợi ý cho không gian của bạn
              </p>
            </div>
            <button
              onClick={() => navigate("/collections/all")}
              className="text-green-900 dark:text-green-500 font-black border-b-4 border-green-900 dark:border-green-500 pb-1 text-sm uppercase tracking-widest"
            >
              Xem tất cả
            </button>
          </div>
          <ProductGrid products={similarProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
