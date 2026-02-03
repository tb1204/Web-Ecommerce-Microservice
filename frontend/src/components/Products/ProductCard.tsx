// import React from "react";
// import { Link } from "react-router-dom";
// import { ShoppingCart, Star, StarHalf, Heart, CirclePlus } from "lucide-react";
// //import image_nem from "../../assets/about.webp";

// import type { Product } from "../Products/InterfaceItem";

// interface ProductCardProps {
//   products?: Product[];
//   loading?: boolean;
//   onSelect?: (product: Product) => void;
//   selectedProductId?: string;
//   isBundleMode?: boolean;
// }

// // --- Component phụ để render từng thẻ sản phẩm riêng biệt ---
// const SingleProduct: React.FC<{
//   product: Product;
//   isBundleMode: boolean;
//   isSelected: boolean;
//   onSelect?: (product: Product) => void;
//   renderStars: (rating: number) => React.ReactNode;
// }> = ({ product, isBundleMode, isSelected, onSelect, renderStars }) => {
//   const hasDiscount =
//     product.originalPrice && product.originalPrice > product.price;
//   const displayDiscount = hasDiscount
//     ? Math.round(
//         ((product.originalPrice! - product.price) / product.originalPrice!) *
//           100,
//       )
//     : 0;

//   const isStopSelling = product.status === "stopselling";
//   const isOutOfStock =
//     product.status === "selling" && product.stock_quantity <= 0;
//   const canBuy = product.status === "selling" && product.stock_quantity > 0;

//   return (
//     <div
//       className={`group bg-white rounded-xl border transition-all duration-300 flex flex-col h-full overflow-hidden ${
//         isBundleMode && isSelected
//           ? "border-green-600 ring-2 ring-green-100 scale-[1.01]"
//           : "border-gray-200 hover:shadow-lg"
//       }`}
//     >
//       {/* PHẦN ẢNH */}
//       <div className="relative aspect-square overflow-hidden bg-gray-50">
//         <Link to={`/product/${product._id}`} className="block h-full">
//           <img
//             src={
//               product.images.find((img) => img.is_primary)?.url ||
//               product.images[0]?.url
//             }
//             alt={product.name}
//             className={`w-full h-full object-cover transition-transform duration-700 ${
//               canBuy ? "group-hover:scale-110" : ""
//             }`}
//           />
//         </Link>

//         {hasDiscount && canBuy && (
//           <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
//             -{displayDiscount}%
//           </div>
//         )}

//         {(isStopSelling || isOutOfStock) && (
//           <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-white font-bold text-[10px] uppercase text-center px-2">
//             {isStopSelling ? "Ngừng kinh doanh" : "Hết hàng"}
//           </div>
//         )}

//         {!isBundleMode && canBuy && (
//           <div className="absolute top-2 -right-10 group-hover:right-2 transition-all duration-300 flex flex-col gap-2">
//             <button className="p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:bg-green-800 hover:text-white transition-colors">
//               <Heart size={14} />
//             </button>
//             <button className="p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:bg-green-800 hover:text-white transition-colors">
//               <CirclePlus size={14} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* PHẦN THÔNG TIN */}
//       <div className="p-3 flex flex-col flex-grow">
//         <div className="flex-grow">
//           <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">
//             {product.brand}
//           </p>
//           <Link to={`/product/${product._id}`}>
//             <h3 className="text-sm font-bold text-gray-800 line-clamp-2 h-10 hover:text-green-700 leading-tight mb-2 transition-colors">
//               {product.name}
//             </h3>
//           </Link>

//           <div className="flex items-center gap-1 h-4 mb-3">
//             <div className="flex">{renderStars(product.rating ?? 0)}</div>
//             <span className="text-gray-400 text-[10px]">
//               ({product.reviewCount ?? 0})
//             </span>
//           </div>

//           <div className="min-h-[42px] flex flex-col justify-end">
//             {hasDiscount && canBuy ? (
//               <div className="flex items-center gap-2 mb-0.5">
//                 <span className="text-gray-400 line-through text-[11px]">
//                   {product.originalPrice?.toLocaleString("vi-VN")}₫
//                 </span>
//                 <span className="text-green-600 text-[10px] font-bold">
//                   -{displayDiscount}%
//                 </span>
//               </div>
//             ) : (
//               <div className="h-4" />
//             )}

//             <p
//               className={`font-black text-base leading-none ${canBuy ? "text-red-600" : "text-gray-400"}`}
//             >
//               {product.price.toLocaleString("vi-VN")}₫
//             </p>
//           </div>
//         </div>

//         <div className="mt-4">
//           {isBundleMode ? (
//             <button
//               onClick={() => onSelect?.(product)}
//               disabled={!canBuy}
//               className={`w-full py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all border-2 ${
//                 isSelected
//                   ? "bg-green-600 text-white border-green-600"
//                   : "bg-white text-green-700 border-green-600 hover:bg-green-600 hover:text-white"
//               } disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
//             >
//               {isSelected ? "ĐÃ CHỌN" : "CHỌN SẢN PHẨM"}
//             </button>
//           ) : (
//             <button
//               disabled={!canBuy}
//               className="w-full py-2.5 bg-green-900 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-green-800 flex items-center justify-center gap-2 transition-all disabled:bg-gray-200 disabled:cursor-not-allowed"
//             >
//               {canBuy ? (
//                 <>
//                   <ShoppingCart size={14} />
//                   THÊM VÀO GIỎ
//                 </>
//               ) : isStopSelling ? (
//                 "NGỪNG BÁN"
//               ) : (
//                 "HẾT HÀNG"
//               )}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Main Component ---
// const ProductCard: React.FC<ProductCardProps> = ({
//   products = [],
//   loading = false,
//   onSelect,
//   selectedProductId,
//   isBundleMode = false,
// }) => {
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
//         stars.push(<Star key={i} size={14} className="text-gray-300" />);
//       }
//     }
//     return stars;
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-10 font-medium text-gray-500">
//         Đang tải sản phẩm...
//       </div>
//     );
//   }

//   return (
//     <div
//       className={
//         products.length > 1
//           ? `grid gap-4 md:gap-6 ${
//               isBundleMode
//                 ? "grid-cols-3 md:grid-cols-3 lg:grid-cols-4"
//                 : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
//             }`
//           : "w-full h-full"
//       }
//     >
//       {products.map((product) => (
//         <SingleProduct
//           key={product._id}
//           product={product}
//           isBundleMode={isBundleMode}
//           isSelected={selectedProductId === product._id}
//           onSelect={onSelect}
//           renderStars={renderStars}
//         />
//       ))}
//     </div>
//   );
// };

// export default ProductCard;

// // import React from "react";
// // import { Link } from "react-router-dom";
// // import { ShoppingCart, Star, StarHalf, Heart, CirclePlus } from "lucide-react";
// // //import image_nem from "../../assets/about.webp";

// // import type { Product } from "../Products/InterfaceItem";

// // interface ProductCardProps {
// //   products?: Product[];
// //   loading?: boolean;
// //   onSelect?: (product: Product) => void;
// //   selectedProductId?: string;
// //   isBundleMode?: boolean;
// // }

// // // --- Component phụ để render từng thẻ sản phẩm riêng biệt ---
// // const SingleProduct: React.FC<{
// //   product: Product;
// //   isBundleMode: boolean;
// //   isSelected: boolean;
// //   onSelect?: (product: Product) => void;
// //   renderStars: (rating: number) => React.ReactNode;
// // }> = ({ product, isBundleMode, isSelected, onSelect, renderStars }) => {
// //   const hasDiscount = product.originalPrice && product.originalPrice > product.price;
// //   const displayDiscount = hasDiscount
// //     ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
// //     : 0;

// //   const isStopSelling = product.status === "stopselling";
// //   const isOutOfStock = product.status === "selling" && product.stock_quantity <= 0;
// //   const canBuy = product.status === "selling" && product.stock_quantity > 0;

// //   return (
// //     <div
// //       className={`group bg-white rounded-xl border transition-all duration-300 flex flex-col h-full overflow-hidden ${
// //         isBundleMode && isSelected
// //           ? "border-green-600 ring-2 ring-green-100 scale-[1.01]"
// //           : "border-gray-200 hover:shadow-lg"
// //       }`}
// //     >
// //       {/* PHẦN ẢNH */}
// //       <div className="relative aspect-square overflow-hidden bg-gray-50">
// //         <Link to={`/product/${product._id}`} className="block h-full">
// //           <img
// //             src={product.images.find((img) => img.is_primary)?.url || product.images[0]?.url}
// //             alt={product.name}
// //             className={`w-full h-full object-cover transition-transform duration-700 ${
// //               canBuy ? "group-hover:scale-110" : ""
// //             }`}
// //           />
// //         </Link>

// //         {hasDiscount && canBuy && (
// //           <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
// //             -{displayDiscount}%
// //           </div>
// //         )}

// //         {(isStopSelling || isOutOfStock) && (
// //           <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-white font-bold text-[10px] uppercase text-center px-2">
// //             {isStopSelling ? "Ngừng kinh doanh" : "Hết hàng"}
// //           </div>
// //         )}

// //         {!isBundleMode && canBuy && (
// //           <div className="absolute top-2 -right-10 group-hover:right-2 transition-all duration-300 flex flex-col gap-2">
// //             <button className="p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:bg-green-800 hover:text-white transition-colors">
// //               <Heart size={14} />
// //             </button>
// //             <button className="p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:bg-green-800 hover:text-white transition-colors">
// //               <CirclePlus size={14} />
// //             </button>
// //           </div>
// //         )}
// //       </div>

// //       {/* PHẦN THÔNG TIN */}
// //       <div className="p-3 flex flex-col flex-grow">
// //         <div className="flex-grow">
// //           <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">
// //             {product.brand}
// //           </p>
// //           <Link to={`/product/${product._id}`}>
// //             <h3 className="text-sm font-bold text-gray-800 line-clamp-2 h-10 hover:text-green-700 leading-tight mb-2 transition-colors">
// //               {product.name}
// //             </h3>
// //           </Link>

// //           <div className="flex items-center gap-1 h-4 mb-3">
// //             <div className="flex">{renderStars(product.rating ?? 0)}</div>
// //             <span className="text-gray-400 text-[10px]">({product.reviewCount ?? 0})</span>
// //           </div>

// //           <div className="min-h-[42px] flex flex-col justify-end">
// //             {hasDiscount && canBuy ? (
// //               <div className="flex items-center gap-2 mb-0.5">
// //                 <span className="text-gray-400 line-through text-[11px]">
// //                   {product.originalPrice?.toLocaleString("vi-VN")}₫
// //                 </span>
// //                 <span className="text-green-600 text-[10px] font-bold">-{displayDiscount}%</span>
// //               </div>
// //             ) : <div className="h-4" />}

// //             <p className={`font-black text-base leading-none ${canBuy ? "text-red-600" : "text-gray-400"}`}>
// //               {product.price.toLocaleString("vi-VN")}₫
// //             </p>
// //           </div>
// //         </div>

// //         <div className="mt-4">
// //           {isBundleMode ? (
// //             <button
// //               onClick={() => onSelect?.(product)}
// //               disabled={!canBuy}
// //               className={`w-full py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all border-2 ${
// //                 isSelected
// //                   ? "bg-green-600 text-white border-green-600"
// //                   : "bg-white text-green-700 border-green-600 hover:bg-green-600 hover:text-white"
// //               } disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
// //             >
// //               {isSelected ? "ĐÃ CHỌN" : "CHỌN SẢN PHẨM"}
// //             </button>
// //           ) : (
// //             <button
// //               disabled={!canBuy}
// //               className="w-full py-2.5 bg-green-900 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-green-800 flex items-center justify-center gap-2 transition-all disabled:bg-gray-200 disabled:cursor-not-allowed"
// //             >
// //               {canBuy ? (
// //                 <>
// //                   <ShoppingCart size={14} />
// //                   THÊM VÀO GIỎ
// //                 </>
// //               ) : (
// //                 isStopSelling ? "NGỪNG BÁN" : "HẾT HÀNG"
// //               )}
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // --- Main Component ---
// // const ProductCard: React.FC<ProductCardProps> = ({
// //   products = [],
// //   loading = false,
// //   onSelect,
// //   selectedProductId,
// //   isBundleMode = false,
// // }) => {
// //   const renderStars = (rating: number) => {
// //     const stars = [];
// //     for (let i = 1; i <= 5; i++) {
// //       if (i <= Math.floor(rating)) {
// //         stars.push(<Star key={i} size={14} className="fill-orange-400 text-orange-400" />);
// //       } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
// //         stars.push(<StarHalf key={i} size={14} className="fill-orange-400 text-orange-400" />);
// //       } else {
// //         stars.push(<Star key={i} size={14} className="text-gray-300" />);
// //       }
// //     }
// //     return stars;
// //   };

// //   if (loading) {
// //     return <div className="text-center py-10 font-medium text-gray-500">Đang tải sản phẩm...</div>;
// //   }

// //   return (
// //     <div
// //       className={products.length > 1 ? `grid gap-4 md:gap-6 ${
// //         isBundleMode
// //           ? "grid-cols-3 md:grid-cols-3 lg:grid-cols-4"
// //           : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
// //       }` : "w-full h-full"}
// //     >
// //       {products.map((product) => (
// //         <SingleProduct
// //           key={product._id}
// //           product={product}
// //           isBundleMode={isBundleMode}
// //           isSelected={selectedProductId === product._id}
// //           onSelect={onSelect}
// //           renderStars={renderStars}
// //         />
// //       ))}
// //     </div>
// //   );
// // };

// // export default ProductCard;
