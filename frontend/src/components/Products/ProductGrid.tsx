// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   ShoppingCart,
//   Star,
//   StarHalf,
//   Heart,
//   CirclePlus,
//   CheckCircle2,
//   Plus,
// } from "lucide-react";
// import image_nem from "../../assets/about.webp";
// import type { Product } from "../../types/Products";
// import { useCompare } from "../common/Compare/CompareContext";
// import { useWishlist } from "../common/WishlistContent";
// import { toast } from "sonner";

// interface ProductCardProps {
//   products?: Product[];
//   loading?: boolean;
//   onSelect?: (product: Product) => void;
//   selectedProductId?: string;
//   isBundleMode?: boolean;
//   isSliderMode?: boolean;
// }

// const ProductGrid: React.FC<ProductCardProps> = ({
//   products = [],
//   loading = false,
//   onSelect, // Nhận hàm chọn từ ProductBundle
//   selectedProductId,
//   isBundleMode = false,
//   isSliderMode = false,
// }) => {
//   const { addToCompare, compareItems } = useCompare();
//   const { addToWishlist, isInWishlist } = useWishlist();

//   const renderStars = (rating: number) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       if (i <= Math.floor(rating)) {
//         stars.push(
//           <Star
//             key={i}
//             size={14}
//             className="fill-orange-400 text-orange-400"
//           />,
//         );
//       } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
//         stars.push(
//           <StarHalf
//             key={i}
//             size={14}
//             className="fill-orange-400 text-orange-400"
//           />,
//         );
//       } else {
//         stars.push(
//           <Star
//             key={i}
//             size={14}
//             className="text-gray-300 dark:text-gray-600"
//           />,
//         );
//       }
//     }
//     return stars;
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-10 font-medium text-gray-500 dark:text-gray-400">
//         Đang tải sản phẩm...
//       </div>
//     );
//   }

//   return (
//     <div
//       className={
//         isSliderMode
//           ? "w-full"
//           : `grid gap-4 md:gap-6 ${isBundleMode ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"}`
//       }
//     >
//       {products.map((product) => {
//         const hasDiscount =
//           product.originalPrice && product.originalPrice > product.price;
//         const displayDiscount = hasDiscount
//           ? Math.round(
//               ((product.originalPrice! - product.price) /
//                 product.originalPrice!) *
//                 100,
//             )
//           : 0;
//         const isStopSelling = product.status === "stopselling";
//         const isOutOfStock =
//           product.status === "selling" && product.stockQuantity <= 0;
//         const canBuy =
//           product.status === "selling" && product.stockQuantity > 0;

//         const isSelected = selectedProductId === product.id;
//         const isFavorite = isInWishlist(product.id);
//         const isComparing = compareItems.some((item) => item.id === product.id);

//         return (
//           <div
//             key={product.id}
//             // Nếu là mode bundle thì click vào card sẽ gọi onSelect
//             onClick={() =>
//               isBundleMode && canBuy && onSelect && onSelect(product)
//             }
//             className={`
//               group rounded-xl border flex flex-col h-full overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-black/30
//               ${isBundleMode && isSelected ? "ring-2 ring-green-500 scale-[1.01]" : ""}
//               ${isBundleMode ? "cursor-pointer" : ""}
//             `}
//           >
//             {/* IMAGE */}
//             <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
//               {/* Nếu là bundle mode thì không chuyển trang khi click vào ảnh */}
//               <Link
//                 to={isBundleMode ? "#" : `/product/${product.id}`}
//                 className="block h-full"
//               >
//                 <img
//                   src={
//                     product.images.find((img) => img.isPrimary)?.url ||
//                     product.images[0]?.url ||
//                     image_nem
//                   }
//                   alt={product.name}
//                   className={`w-full h-full object-cover transition-transform duration-700 ${canBuy ? "group-hover:scale-110" : ""}`}
//                 />
//               </Link>

//               {hasDiscount && canBuy && (
//                 <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
//                   -{displayDiscount}%
//                 </div>
//               )}

//               {(isStopSelling || isOutOfStock) && (
//                 <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-white font-bold text-[10px] uppercase">
//                   {isStopSelling ? "Ngừng kinh doanh" : "Hết hàng"}
//                 </div>
//               )}

//               {/* ICON ACTIONS - Chỉ hiện khi KHÔNG phải bundle mode */}
//               {!isBundleMode && canBuy && (
//                 <div className="absolute top-2 -right-10 group-hover:right-2 transition-all duration-300 flex flex-col gap-2">
//                   <button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation(); // Ngăn việc trigger click của card
//                       addToWishlist(product);
//                       toast.success(
//                         isFavorite
//                           ? "Đã xóa khỏi yêu thích"
//                           : "Đã thêm vào yêu thích",
//                       );
//                     }}
//                     className={`p-1.5 rounded-full shadow-md transition-colors ${isFavorite ? "bg-green-700 text-white" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-700 hover:text-white"}`}
//                   >
//                     <Heart
//                       size={14}
//                       className={isFavorite ? "fill-current" : ""}
//                     />
//                   </button>

//                   <button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       addToCompare(product);
//                     }}
//                     className={`p-1.5 rounded-full shadow-md transition-colors ${isComparing ? "bg-green-700 text-white" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-700 hover:text-white"}`}
//                   >
//                     {isComparing ? (
//                       <CheckCircle2 size={14} />
//                     ) : (
//                       <CirclePlus size={14} />
//                     )}
//                   </button>
//                 </div>
//               )}

//               {/* Overlay khi được chọn trong mode Bundle */}
//               {isBundleMode && isSelected && (
//                 <div className="absolute inset-0 bg-green-500/10 backdrop-blur-[1px] flex items-center justify-center">
//                   <div className="bg-green-600 text-white p-2 rounded-full shadow-lg">
//                     <CheckCircle2 size={24} />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* INFO */}
//             <div className="p-3 flex flex-col flex-grow">
//               <div className="flex-grow">
//                 <p className="text-[10px] uppercase font-bold tracking-widest mb-1 text-gray-400 dark:text-gray-500">
//                   {product.brand}
//                 </p>
//                 <Link to={isBundleMode ? "#" : `/product/${product.id}`}>
//                   <h3 className="text-sm font-bold line-clamp-2 h-10 leading-tight mb-2 transition-colors text-gray-800 dark:text-gray-100 hover:text-green-700 dark:hover:text-green-400">
//                     {product.name}
//                   </h3>
//                 </Link>
//                 <div className="flex items-center gap-1 mb-3">
//                   <div className="flex">{renderStars(product.rating ?? 0)}</div>
//                   <span className="text-gray-400 dark:text-gray-500 text-[10px]">
//                     ({product.reviewCount ?? 0})
//                   </span>
//                 </div>
//                 {hasDiscount && canBuy && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-400 dark:text-gray-500 line-through text-[11px]">
//                       {product.originalPrice?.toLocaleString("vi-VN")}₫
//                     </span>
//                     <span className="text-green-600 dark:text-green-400 text-[10px] font-bold">
//                       -{displayDiscount}%
//                     </span>
//                   </div>
//                 )}
//                 <p
//                   className={`font-black text-base mt-1 ${canBuy ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-500"}`}
//                 >
//                   {product.price.toLocaleString("vi-VN")}₫
//                 </p>
//               </div>

//               {/* BUTTON */}
//               <div className="mt-4">
//                 <button
//                   disabled={!canBuy}
//                   onClick={(e) => {
//                     if (isBundleMode) {
//                       e.stopPropagation();
//                       if (onSelect) {
//                         onSelect(product);
//                       }
//                     }
//                   }}
//                   className={`w-full py-2.5 rounded-lg font-bold text-[11px] uppercase flex items-center justify-center gap-2 transition-all
//                     ${
//                       isBundleMode
//                         ? isSelected
//                           ? "bg-green-600 text-white"
//                           : "bg-green-900 dark:bg-gray-700 text-white dark:text-gray-300 hover:bg-green-800"
//                         : "bg-green-900 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 text-white disabled:bg-gray-200 dark:disabled:bg-gray-700"
//                     }
//                   `}
//                 >
//                   {isBundleMode ? (
//                     isSelected ? (
//                       <>
//                         <CheckCircle2 size={14} /> ĐÃ CHỌN
//                       </>
//                     ) : (
//                       <>
//                         <Plus size={14} /> CHỌN SẢN PHẨM
//                       </>
//                     )
//                   ) : canBuy ? (
//                     <>
//                       <ShoppingCart size={14} /> THÊM VÀO GIỎ
//                     </>
//                   ) : isStopSelling ? (
//                     "NGỪNG BÁN"
//                   ) : (
//                     "HẾT HÀNG"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default ProductGrid;

// // //lấy dữ liệu thật
// // import React from "react";
// // import { Link } from "react-router-dom";
// // import {
// //   ShoppingCart,
// //   Star,
// //   StarHalf,
// //   Heart,
// //   CirclePlus,
// //   CheckCircle2,
// //   Plus,
// // } from "lucide-react";
// // import image_nem from "../../assets/about.webp";
// // import type { Product } from "../../types/Products";
// // import { useCompare } from "../common/Compare/CompareContext";
// // import { useWishlist } from "../common/WishlistContent";
// // import { toast } from "sonner";

// // interface ProductCardProps {
// //   products?: Product[];
// //   loading?: boolean;
// //   onSelect?: (product: Product) => void;
// //   selectedProductId?: string;
// //   isBundleMode?: boolean;
// //   isSliderMode?: boolean;
// // }

// // const ProductGrid: React.FC<ProductCardProps> = ({
// //   products = [],
// //   loading = false,
// //   onSelect,
// //   selectedProductId,
// //   isBundleMode = false,
// //   isSliderMode = false,
// // }) => {
// //   const { addToCompare, compareItems } = useCompare();
// //   const { addToWishlist, isInWishlist } = useWishlist();

// //   const renderStars = (rating: number) => {
// //     const stars = [];
// //     for (let i = 1; i <= 5; i++) {
// //       if (i <= Math.floor(rating)) {
// //         stars.push(
// //           <Star
// //             key={i}
// //             size={14}
// //             className="fill-orange-400 text-orange-400"
// //           />,
// //         );
// //       } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
// //         stars.push(
// //           <StarHalf
// //             key={i}
// //             size={14}
// //             className="fill-orange-400 text-orange-400"
// //           />,
// //         );
// //       } else {
// //         stars.push(
// //           <Star
// //             key={i}
// //             size={14}
// //             className="text-gray-300 dark:text-gray-600"
// //           />,
// //         );
// //       }
// //     }
// //     return stars;
// //   };

// //   if (loading) {
// //     return (
// //       <div className="text-center py-10 font-medium text-gray-500 dark:text-gray-400">
// //         Đang tải sản phẩm...
// //       </div>
// //     );
// //   }

// //   return (
// //     <div
// //       className={
// //         isSliderMode
// //           ? "w-full"
// //           : `grid gap-4 md:gap-6 ${isBundleMode ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"}`
// //       }
// //     >
// //       {products.map((product) => {
// //         // ==================== LOGIC STOCK & DISCOUNT SỬA ĐÚNG ====================
// //         const hasDiscount =
// //           product.originalPrice && product.originalPrice > product.price;

// //         const displayDiscount = hasDiscount
// //           ? Math.round(
// //               ((product.originalPrice! - product.price) /
// //                 product.originalPrice!) *
// //                 100,
// //             )
// //           : 0;

// //         const isStopSelling = product.status === "stopselling";

// //         // Tính stock đúng theo dữ liệu backend
// //         const totalStock = product.totalStockQuantity ?? 0;
// //         const variantStock =
// //           product.variants?.reduce((sum: number, v: any) => {
// //             return sum + (Number(v?.stockQuantity) || 0);
// //           }, 0) ?? 0;

// //         const availableStock = Math.max(totalStock, variantStock);

// //         const isOutOfStock = availableStock <= 0;
// //         const canBuy = !isStopSelling && availableStock > 0;
// //         // =====================================================================

// //         // Sử dụng _id vì backend trả về _id
// //         const productId = product._id || product.id;

// //         const isSelected = selectedProductId === productId;
// //         const isFavorite = isInWishlist(productId);
// //         const isComparing = compareItems.some((item) => item.id === productId);

// //         return (
// //           <div
// //             key={productId}
// //             onClick={() =>
// //               isBundleMode && canBuy && onSelect && onSelect(product)
// //             }
// //             className={`
// //               group rounded-xl border flex flex-col h-full overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-black/30
// //               ${isBundleMode && isSelected ? "ring-2 ring-green-500 scale-[1.01]" : ""}
// //               ${isBundleMode ? "cursor-pointer" : ""}
// //             `}
// //           >
// //             {/* IMAGE */}
// //             <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
// //               <Link
// //                 to={isBundleMode ? "#" : `/product/${productId}`}
// //                 className="block h-full"
// //               >
// //                 <img
// //                   src={
// //                     product.images?.find((img) => img.isPrimary)?.url ||
// //                     product.images?.[0]?.url ||
// //                     image_nem
// //                   }
// //                   alt={product.name}
// //                   className={`w-full h-full object-cover transition-transform duration-700 ${canBuy ? "group-hover:scale-110" : ""}`}
// //                 />
// //               </Link>

// //               {hasDiscount && canBuy && (
// //                 <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
// //                   -{displayDiscount}%
// //                 </div>
// //               )}

// //               {(isStopSelling || isOutOfStock) && (
// //                 <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-white font-bold text-[10px] uppercase">
// //                   {isStopSelling ? "Ngừng kinh doanh" : "Hết hàng"}
// //                 </div>
// //               )}

// //               {/* ICON ACTIONS */}
// //               {!isBundleMode && canBuy && (
// //                 <div className="absolute top-2 -right-10 group-hover:right-2 transition-all duration-300 flex flex-col gap-2">
// //                   <button
// //                     onClick={(e) => {
// //                       e.preventDefault();
// //                       e.stopPropagation();
// //                       addToWishlist(product);
// //                       toast.success(
// //                         isFavorite
// //                           ? "Đã xóa khỏi yêu thích"
// //                           : "Đã thêm vào yêu thích",
// //                       );
// //                     }}
// //                     className={`p-1.5 rounded-full shadow-md transition-colors ${
// //                       isFavorite
// //                         ? "bg-green-700 text-white"
// //                         : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-700 hover:text-white"
// //                     }`}
// //                   >
// //                     <Heart
// //                       size={14}
// //                       className={isFavorite ? "fill-current" : ""}
// //                     />
// //                   </button>

// //                   <button
// //                     onClick={(e) => {
// //                       e.preventDefault();
// //                       e.stopPropagation();
// //                       addToCompare(product);
// //                     }}
// //                     className={`p-1.5 rounded-full shadow-md transition-colors ${
// //                       isComparing
// //                         ? "bg-green-700 text-white"
// //                         : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-700 hover:text-white"
// //                     }`}
// //                   >
// //                     {isComparing ? (
// //                       <CheckCircle2 size={14} />
// //                     ) : (
// //                       <CirclePlus size={14} />
// //                     )}
// //                   </button>
// //                 </div>
// //               )}

// //               {isBundleMode && isSelected && (
// //                 <div className="absolute inset-0 bg-green-500/10 backdrop-blur-[1px] flex items-center justify-center">
// //                   <div className="bg-green-600 text-white p-2 rounded-full shadow-lg">
// //                     <CheckCircle2 size={24} />
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* INFO */}
// //             <div className="p-3 flex flex-col flex-grow">
// //               <div className="flex-grow">
// //                 <p className="text-[10px] uppercase font-bold tracking-widest mb-1 text-gray-400 dark:text-gray-500">
// //                   {product.brand}
// //                 </p>
// //                 <Link to={isBundleMode ? "#" : `/product/${productId}`}>
// //                   <h3 className="text-sm font-bold line-clamp-2 h-10 leading-tight mb-2 transition-colors text-gray-800 dark:text-gray-100 hover:text-green-700 dark:hover:text-green-400">
// //                     {product.name}
// //                   </h3>
// //                 </Link>

// //                 <div className="flex items-center gap-1 mb-3">
// //                   <div className="flex">{renderStars(product.rating ?? 0)}</div>
// //                   <span className="text-gray-400 dark:text-gray-500 text-[10px]">
// //                     ({product.reviewCount ?? 0})
// //                   </span>
// //                 </div>

// //                 {hasDiscount && canBuy && (
// //                   <div className="flex items-center gap-2">
// //                     <span className="text-gray-400 dark:text-gray-500 line-through text-[11px]">
// //                       {product.originalPrice?.toLocaleString("vi-VN")}₫
// //                     </span>
// //                     <span className="text-green-600 dark:text-green-400 text-[10px] font-bold">
// //                       -{displayDiscount}%
// //                     </span>
// //                   </div>
// //                 )}

// //                 <p
// //                   className={`font-black text-base mt-1 ${canBuy ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-500"}`}
// //                 >
// //                   {product.price.toLocaleString("vi-VN")}₫
// //                 </p>
// //               </div>

// //               {/* BUTTON */}
// //               <div className="mt-4">
// //                 <button
// //                   disabled={!canBuy}
// //                   onClick={(e) => {
// //                     if (isBundleMode) {
// //                       e.stopPropagation();
// //                       if (onSelect) onSelect(product);
// //                     }
// //                   }}
// //                   className={`w-full py-2.5 rounded-lg font-bold text-[11px] uppercase flex items-center justify-center gap-2 transition-all
// //                     ${
// //                       isBundleMode
// //                         ? isSelected
// //                           ? "bg-green-600 text-white"
// //                           : "bg-green-900 dark:bg-gray-700 text-white dark:text-gray-300 hover:bg-green-800"
// //                         : "bg-green-900 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 text-white disabled:bg-gray-200 dark:disabled:bg-gray-700"
// //                     }`}
// //                 >
// //                   {isBundleMode ? (
// //                     isSelected ? (
// //                       <>
// //                         <CheckCircle2 size={14} /> ĐÃ CHỌN
// //                       </>
// //                     ) : (
// //                       <>
// //                         <Plus size={14} /> CHỌN SẢN PHẨM
// //                       </>
// //                     )
// //                   ) : canBuy ? (
// //                     <>
// //                       <ShoppingCart size={14} /> THÊM VÀO GIỎ
// //                     </>
// //                   ) : isStopSelling ? (
// //                     "NGỪNG BÁN"
// //                   ) : (
// //                     "HẾT HÀNG"
// //                   )}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // };

// // export default ProductGrid;

//dùng ređux

import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  StarHalf,
  Heart,
  CirclePlus,
  CheckCircle2,
  Plus,
} from "lucide-react";
import image_nem from "../../assets/about.webp";
import type { Product } from "../Products/InterfaceItem";
import { useCompare } from "../common/Compare/CompareContext";
import { useWishlist } from "../common/WishlistContent";
import { toast } from "sonner";
import { useAppDispatch } from "../../store/hooks";
import { useAuth } from "@clerk/clerk-react";
import { addToCart } from "../../store/slices/cartSlice";
import { openCartDrawer } from "../../store/slices/uiSlice";
import { useNavigate } from "react-router-dom";

//Them sao
import { useState, useEffect } from "react";
import axios from "axios";

interface ProductCardProps {
  products?: Product[];
  loading?: boolean;
  onSelect?: (product: Product) => void;
  selectedProductId?: string;
  isBundleMode?: boolean;
  isSliderMode?: boolean;
}

const ProductGrid: React.FC<ProductCardProps> = ({
  products = [],
  loading = false,
  onSelect,
  selectedProductId,
  isBundleMode = false,
  isSliderMode = false,
}) => {
  const { addToCompare, compareItems } = useCompare();
  const { addToWishlist, isInWishlist } = useWishlist();
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  //Them sao
  //  State để quản lý danh sách sản phẩm kèm Rating thực tế
  const [displayProducts, setDisplayProducts] = useState<Product[]>(products);

  //  Effect lấy Rating từ ReviewService (Port 8088)
  useEffect(() => {
    if (!products || products.length === 0) {
      setDisplayProducts([]);
      return;
    }

    const fetchRatings = async () => {
      try {
        const productIds = products.map((p) => p.id || (p as any)._id);

        // Gọi tới API Batch vừa viết ở Backend
        const response = await axios.post(
          `${BASE_URL}/api/reviews/ratings/batch`,
          productIds,
        );
        const ratingMap = response.data;

        // Trộn dữ liệu Rating vào danh sách sản phẩm hiện tại
        const updated = products.map((p) => {
          const pid = p.id || (p as any)._id;
          return {
            ...p,
            rating: ratingMap[pid]?.rating ?? 0,
            reviewCount: ratingMap[pid]?.reviewCount ?? 0,
          };
        });

        setDisplayProducts(updated);
      } catch (err) {
        console.error("Lỗi lấy rating từ ReviewService:", err);
        setDisplayProducts(products); // Lỗi thì hiện dữ liệu gốc
      }
    };

    fetchRatings();
  }, [products]); //HetThemsao///////////////

  const handleAddToCart = async (product: Product) => {
    // Kiểm tra số kích thước (size) khác nhau
    const uniqueSizes = new Set(
      (product.variants ?? []).map((v) => v.size).filter(Boolean),
    );

    // Nếu sản phẩm có nhiều size khác nhau → buộc user vào trang chi tiết để chọn
    if (uniqueSizes.size > 1) {
      toast.info("📌 Vui lòng chọn kích thước trước khi thêm vào giỏ!");
      navigate(`/product/${product.id}`);
      return;
    }

    // Nếu chỉ có 1 size (hoặc không có variants có size) → tự chọn variant đầu tiên có hàng
    const availableVariant =
      product.variants?.find((v) => (v.stockQuantity ?? 0) > 0) ??
      product.variants?.[0];

    if (!availableVariant?.variantId) {
      // toast.error("Sản phẩm chưa có biến thể, vui lòng xem chi tiết!");
      toast.info("📌 Vui lòng chọn kích thước trước khi thêm vào giỏ!");
      navigate(`/product/${product.id}`);
      return;
    }

    try {
      const token = await getToken({ template: "my-backend" });
      await dispatch(
        addToCart({
          token,
          product: {
            productId: product.id,
            variantId: availableVariant.variantId,
            name: product.name,
            price: availableVariant.price ?? product.price,
            quantity: 1,
            image:
              product.images?.find((img) => img.isPrimary)?.url ||
              product.images?.[0]?.url ||
              "",
            size: availableVariant.size,
            thickness: availableVariant.thickness,
            color: availableVariant.color,
          },
        }),
      ).unwrap();
      toast.success("Đã thêm vào giỏ hàng!");
      dispatch(openCartDrawer());
    } catch (err: any) {
      toast.error(err?.message ?? "Thêm vào giỏ thất bại!");
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <Star
            key={i}
            size={14}
            className="fill-orange-400 text-orange-400"
          />,
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(
          <StarHalf
            key={i}
            size={14}
            className="fill-orange-400 text-orange-400"
          />,
        );
      } else {
        stars.push(
          <Star
            key={i}
            size={14}
            className="text-gray-300 dark:text-gray-600"
          />,
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="text-center py-10 font-medium text-gray-500 dark:text-gray-400">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <div
      className={
        isSliderMode
          ? "w-full"
          : `grid gap-4 md:gap-6 ${
              isBundleMode
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
            }`
      }
    >
      {displayProducts.map((product) => {
        const productId = product.id || (product as any)._id;

        const availableStock =
          product.stockQuantity ??
          product.totalStockQuantity ??
          product.variants?.reduce(
            (sum: number, v: any) => sum + (Number(v?.stockQuantity) || 0),
            0,
          ) ??
          0;

        const hasDiscount =
          product.originalPrice && product.originalPrice > product.price;
        const displayDiscount = hasDiscount
          ? Math.round(
              ((product.originalPrice! - product.price) /
                product.originalPrice!) *
                100,
            )
          : 0;

        const isStopSelling = product.status === "stopselling";
        const isOutOfStock = !isStopSelling && availableStock <= 0;
        const canBuy = !isStopSelling && availableStock > 0;

        const isSelected = selectedProductId === productId;
        const isFavorite = isInWishlist(productId);
        const isComparing = compareItems.some((item) => item.id === productId);

        return (
          <div
            key={productId}
            onClick={() =>
              isBundleMode && canBuy && onSelect && onSelect(product)
            }
            className={`
              group rounded-xl border flex flex-col h-full overflow-hidden transition-all duration-300
              bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
              hover:shadow-lg dark:hover:shadow-black/30
              ${isBundleMode && isSelected ? "ring-2 ring-green-500 scale-[1.01]" : ""}
              ${isBundleMode ? "cursor-pointer" : ""}
            `}
          >
            {/* IMAGE */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
              <Link
                to={isBundleMode ? "#" : `/product/${productId}`}
                className="block h-full"
              >
                <img
                  src={
                    product.images?.find((img) => img.isPrimary)?.url ||
                    product.images?.[0]?.url ||
                    image_nem
                  }
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${canBuy ? "group-hover:scale-110" : ""}`}
                />
              </Link>

              {hasDiscount && canBuy && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  -{displayDiscount}%
                </div>
              )}

              {(isStopSelling || isOutOfStock) && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-white font-bold text-[10px] uppercase">
                  {isStopSelling ? "Ngừng kinh doanh" : "Hết hàng"}
                </div>
              )}

              {!isBundleMode && canBuy && (
                <div className="absolute top-2 -right-10 group-hover:right-2 transition-all duration-300 flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToWishlist(product);
                    }}
                    className={`p-1.5 rounded-full shadow-md transition-colors ${
                      isFavorite
                        ? "bg-green-700 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-700 hover:text-white"
                    }`}
                  >
                    <Heart
                      size={14}
                      className={isFavorite ? "fill-current" : ""}
                    />
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCompare(product);
                    }}
                    className={`p-1.5 rounded-full shadow-md transition-colors ${
                      isComparing
                        ? "bg-green-700 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-700 hover:text-white"
                    }`}
                  >
                    {isComparing ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <CirclePlus size={14} />
                    )}
                  </button>
                </div>
              )}

              {isBundleMode && isSelected && (
                <div className="absolute inset-0 bg-green-500/10 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="bg-green-600 text-white p-2 rounded-full shadow-lg">
                    <CheckCircle2 size={24} />
                  </div>
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="p-3 flex flex-col flex-grow">
              <div className="flex-grow">
                <p className="text-[10px] uppercase font-bold tracking-widest mb-1 text-gray-400 dark:text-gray-500">
                  {product.brand}
                </p>
                <Link to={isBundleMode ? "#" : `/product/${productId}`}>
                  <h3 className="text-sm font-bold line-clamp-2 h-10 leading-tight mb-2 transition-colors text-gray-800 dark:text-gray-100 hover:text-green-700 dark:hover:text-green-400">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">{renderStars(product.rating ?? 0)}</div>
                  <span className="text-gray-400 dark:text-gray-500 text-[10px]">
                    ({product.reviewCount ?? 0})
                  </span>
                </div>

                {hasDiscount && canBuy && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 dark:text-gray-500 line-through text-[11px]">
                      {product.originalPrice?.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-green-600 dark:text-green-400 text-[10px] font-bold">
                      -{displayDiscount}%
                    </span>
                  </div>
                )}

                <p
                  className={`font-black text-base mt-1 ${canBuy ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-500"}`}
                >
                  {(product.price ?? 0).toLocaleString("vi-VN")}₫
                </p>
              </div>

              {/* BUTTON */}
              <div className="mt-4">
                <button
                  disabled={!canBuy}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isBundleMode) {
                      if (onSelect) onSelect(product);
                    } else if (canBuy) {
                      handleAddToCart(product);
                    }
                  }}
                  className={`w-full py-2.5 rounded-lg font-bold text-[11px] uppercase flex items-center justify-center gap-2 transition-all
                    ${
                      isBundleMode
                        ? isSelected
                          ? "bg-green-600 text-white"
                          : "bg-green-900 dark:bg-gray-700 text-white dark:text-gray-300 hover:bg-green-800"
                        : "bg-green-900 hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-600 text-white disabled:bg-gray-200 dark:disabled:bg-gray-700"
                    }`}
                >
                  {isBundleMode ? (
                    isSelected ? (
                      <>
                        <CheckCircle2 size={14} /> ĐÃ CHỌN
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> CHỌN SẢN PHẨM
                      </>
                    )
                  ) : canBuy ? (
                    <>
                      <ShoppingCart size={14} /> THÊM VÀO GIỎ
                    </>
                  ) : isStopSelling ? (
                    "NGỪNG BÁN"
                  ) : (
                    "HẾT HÀNG"
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
