// import React, { useState } from "react";
// import {
//   ChevronRight,
//   Bed,
//   Wind,
//   Package,
//   Sofa,
//   Layout,
//   Megaphone,
//   ChevronDown,
//   Zap,
//   LayoutGrid,
// } from "lucide-react";

// // --- 1. Interfaces & Data ---
// interface MenuColumn {
//   title: string;
//   items: string[];
// }

// interface MenuCategory {
//   columns: MenuColumn[];
// }

// type MenuDataKeys = "Nệm" | "Chăn ga" | "Phụ kiện" | "Nội thất" | "Gối";

// const menuData: Record<MenuDataKeys, MenuCategory> = {
//   Nệm: {
//     columns: [
//       {
//         title: "Kích thước",
//         items: [
//           "100 x 200cm",
//           "120 x 200cm",
//           "140 x 200cm",
//           "160 x 200cm",
//           "180 x 200cm",
//           "200 x 200cm",
//           "220 x 200cm",
//         ],
//       },
//       {
//         title: "Giá tiền",
//         items: [
//           "Dưới 5 triệu",
//           "5 triệu - 10 triệu",
//           "10 triệu - 15 triệu",
//           "15 triệu - 30 triệu",
//           "30 triệu - 50 triệu",
//           "Trên 50 triệu",
//         ],
//       },
//       {
//         title: "Loại sản phẩm",
//         items: ["Nệm bông ép", "Nệm cao su", "Nệm lò xo", "Nệm foam"],
//       },
//       {
//         title: "Thương hiệu",
//         items: [
//           "Amando",
//           "Aeroflow",
//           "Dunlopillo",
//           "Goodnight",
//           "Gummi",
//           "Kim Cương",
//           "Liên Á",
//           "Comfy",
//         ],
//       },
//       {
//         title: "Nhu cầu",
//         items: [
//           "Nệm gấp gọn",
//           "Nệm hỗ trợ đau lưng",
//           "Nệm làm mát",
//           "Nệm khách sạn",
//           "Nệm cao cấp",
//           "Nệm cưới",
//         ],
//       },
//     ],
//   },
//   "Chăn ga": {
//     columns: [
//       {
//         title: "Loại sản phẩm",
//         items: [
//           "Bộ ga chun",
//           "Bộ chăn ga chun",
//           "Bộ ga chun chần",
//           "Chăn lẻ",
//           "Ga lẻ",
//           "Vỏ gối lẻ",
//           "Vỏ chăn lẻ",
//           "Bộ ga phủ",
//         ],
//       },
//       {
//         title: "Kích thước",
//         items: ["120 x 200cm", "160 x 200cm", "180 x 200cm", "200 x 220cm"],
//       },
//       {
//         title: "Giá tiền",
//         items: [
//           "Dưới 1 triệu",
//           "Từ 1 - 2 triệu",
//           "Từ 2 - 4 triệu",
//           "Trên 4 triệu",
//         ],
//       },
//       { title: "Thương hiệu", items: ["Goodnight", "Amando"] },
//       {
//         title: "Nhu cầu",
//         items: ["Chăn ga cưới", "Chăn ga làm mát", "Chăn ga khách sạn"],
//       },
//     ],
//   },
//   "Phụ kiện": {
//     columns: [
//       {
//         title: "Loại sản phẩm",
//         items: ["Topper nệm", "Tấm bảo vệ nệm", "Bảo vệ gối"],
//       },
//       {
//         title: "Giá tiền",
//         items: ["Dưới 1 triệu", "Từ 1 - 3 triệu", "Trên 3 triệu"],
//       },
//       {
//         title: "Thương hiệu",
//         items: ["Aeroflow", "Goodnight", "Doona", "Sasana", "Xiaomi"],
//       },
//     ],
//   },
//   "Nội thất": {
//     columns: [
//       {
//         title: "Loại sản phẩm",
//         items: [
//           "Giường",
//           "Giường điều khiển từ xa",
//           "Ghế massage",
//           "Giường bọc đệm",
//         ],
//       },
//       {
//         title: "Kích thước",
//         items: ["120 x 200 cm", "160 x 200 cm", "180 x 200 cm", "220 x 200 cm"],
//       },
//       {
//         title: "Giá tiền",
//         items: ["Từ 3 - 5 triệu", "Từ 5 - 7 triệu", "Trên 7 triệu"],
//       },
//       { title: "Thương hiệu", items: ["Amando", "Sleeptek", "Ogawa"] },
//     ],
//   },
//   Gối: {
//     columns: [
//       {
//         title: "Giá tiền",
//         items: [
//           "Dưới 200.000đ",
//           "Từ 200K - 500K",
//           "Từ 500K - 1 Triệu",
//           "Trên 1 triệu",
//         ],
//       },
//       {
//         title: "Thương hiệu",
//         items: [
//           "Gummi",
//           "Aeroflow",
//           "Goodnight",
//           "Comfy",
//           "Dreamland",
//           "iComfy",
//         ],
//       },
//       {
//         title: "Chất liệu",
//         items: ["Gối bông", "Gối foam", "Gối cao su", "Gối lông vũ"],
//       },
//       {
//         title: "Nhu cầu",
//         items: [
//           "Gối công thái học",
//           "Gối giảm đau vai gáy",
//           "Gối giảm ngáy",
//           "Gối làm mát",
//           "Gối trang trí",
//           "Gối trẻ em",
//         ],
//       },
//     ],
//   },
// };

// // --- 2. Sub-Components ---
// const CategoryItem: React.FC<{
//   label: string;
//   icon: React.ReactNode;
//   data?: MenuCategory;
// }> = ({ label, icon, data }) => (
//   <li className="group/item flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none relative">
//     <div className="flex items-center gap-3 text-gray-700">
//       <span className="text-gray-400 group-hover/item:text-[#0a422e]">
//         {icon}
//       </span>
//       <span className="text-[14px] font-medium group-hover/item:text-[#0a422e]">
//         {label}
//       </span>
//     </div>
//     <ChevronRight
//       size={14}
//       className="text-gray-300 group-hover/item:text-[#0a422e]"
//     />

//     {data && (
//       <div className="invisible group-hover/item:visible absolute left-full top-0 w-[800px] min-h-[400px] bg-white shadow-xl border border-gray-200 z-[100] p-8 grid grid-cols-4 gap-6 cursor-default ml-[1px]">
//         {data.columns.map((col, idx) => (
//           <div key={idx} className="flex flex-col gap-3">
//             <h3 className="font-bold text-gray-900 text-[13px] border-b border-gray-100 pb-2 uppercase">
//               {col.title}
//             </h3>
//             <ul className="flex flex-col gap-2">
//               {col.items.map((item, i) => (
//                 <li
//                   key={i}
//                   className="text-gray-600 hover:text-[#0a422e] text-[13px] transition-colors"
//                 >
//                   {item}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     )}
//   </li>
// );

// const NavItem: React.FC<{
//   label: string;
//   icon?: React.ReactNode;
//   hasArrow?: boolean;
// }> = ({ label, icon, hasArrow }) => (
//   <li className="flex items-center gap-1.5 px-4 py-3 cursor-pointer hover:text-green-300 transition-colors border-r border-white/10 last:border-none">
//     {icon}
//     <span className="uppercase text-[13px] font-bold tracking-tight whitespace-nowrap">
//       {label}
//     </span>
//     {hasArrow && <ChevronDown size={14} />}
//   </li>
// );

// // --- 3. Main Combined Component ---
// const HeroSection: React.FC = () => {
//   return (
//     <div className="w-full flex flex-col">
//       {/* NAVBAR NGANG */}
//       <nav className="bg-[#0a422e] text-white w-full h-[50px] flex items-center z-50">
//         <div className="container mx-auto flex items-center h-full">
//           {/* Nút danh mục */}
//           <div className="h-full bg-[#083626] flex items-center px-6 gap-3 cursor-pointer min-w-[240px]">
//             <LayoutGrid size={18} />
//             <span className="uppercase text-[13px] font-bold">
//               Danh mục sản phẩm
//             </span>
//             <ChevronDown size={14} />
//           </div>

//           {/* Các links ngang */}
//           <ul className="flex items-center h-full">
//             <NavItem label="Trang chủ" />
//             <NavItem
//               label="Flash Sale"
//               icon={
//                 <Zap size={14} className="text-orange-400 fill-orange-400" />
//               }
//             />
//             <NavItem label="Sản phẩm" hasArrow />
//             <NavItem label="Tin tức" hasArrow />
//             <NavItem label="Giới thiệu" />
//             <NavItem label="Liên hệ" />
//             <NavItem label="Hệ thống cửa hàng" />
//           </ul>
//         </div>
//       </nav>

//       {/* PHẦN DƯỚI (MENU DỌC + BANNER) */}
//       <div className="container mx-auto flex relative items-start">
//         {/* MENU DỌC (LUÔN HIỆN) */}
//         <div className="w-[240px] bg-white border border-gray-200 shadow-lg z-40 shrink-0">
//           <ul className="flex flex-col">
//             <CategoryItem
//               label="Nệm"
//               icon={<Bed size={18} />}
//               data={menuData["Nệm"]}
//             />
//             <CategoryItem
//               label="Chăn ga"
//               icon={<Wind size={18} />}
//               data={menuData["Chăn ga"]}
//             />
//             <CategoryItem
//               label="Phụ kiện"
//               icon={<Package size={18} />}
//               data={menuData["Phụ kiện"]}
//             />
//             <CategoryItem
//               label="Nội thất"
//               icon={<Sofa size={18} />}
//               data={menuData["Nội thất"]}
//             />
//             <CategoryItem
//               label="Gối"
//               icon={<Layout size={18} />}
//               data={menuData["Gối"]}
//             />
//             <CategoryItem label="Khuyến mãi" icon={<Megaphone size={18} />} />
//           </ul>
//         </div>

//         {/* BANNER ẢNH (BÊN CẠNH MENU) */}
//         <div className="flex-grow h-[450px] overflow-hidden relative">
//           <img
//             src="/path-to-your-banner-image.jpg" // Thay bằng link ảnh của bạn
//             alt="Banner Artisano"
//             className="w-full h-full object-cover"
//           />
//           {/* Overlay text nếu cần */}
//           <div className="absolute inset-0 flex flex-col justify-center p-12 bg-black/5">
//             <h2 className="text-4xl font-serif text-[#0a422e] font-bold leading-tight">
//               Vinh dự & Tự hào!
//               <br />
//               ĐƯỢC YÊU THÍCH NHẤT 2025
//             </h2>
//             <p className="mt-4 text-gray-700 max-w-md">
//               Sự ủng hộ từ cộng đồng là động lực để Artisano không ngừng đổi
//               mới...
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;

// import React, { useState } from "react";
// import {
//   ChevronRight,
//   Bed,
//   Wind,
//   Package,
//   Sofa,
//   Layout,
//   Megaphone,
//   ChevronDown,
//   Zap,
//   LayoutGrid,
// } from "lucide-react";

// // --- 1. Interfaces & Data ---
// interface MenuColumn {
//   title: string;
//   items: string[];
// }

// interface MenuCategory {
//   columns: MenuColumn[];
// }

// type MenuDataKeys = "Nệm" | "Chăn ga" | "Phụ kiện" | "Nội thất" | "Gối";

// const menuData: Record<MenuDataKeys, MenuCategory> = {
//   Nệm: {
//     columns: [
//       {
//         title: "Kích thước",
//         items: ["100 x 200cm", "120 x 200cm", "180 x 200cm", "200 x 200cm"],
//       },
//       {
//         title: "Giá tiền",
//         items: ["Dưới 5 triệu", "5 - 10 triệu", "Trên 30 triệu"],
//       },
//       {
//         title: "Loại sản phẩm",
//         items: ["Nệm bông ép", "Nệm cao su", "Nệm lò xo", "Nệm foam"],
//       },
//       {
//         title: "Thương hiệu",
//         items: ["Amando", "Gummi", "Liên Á", "Kim Cương"],
//       },
//     ],
//   },
//   "Chăn ga": {
//     columns: [
//       {
//         title: "Loại sản phẩm",
//         items: ["Bộ ga chun", "Chăn lẻ", "Vỏ gối", "Ga phủ"],
//       },
//       {
//         title: "Kích thước",
//         items: ["120 x 200cm", "160 x 200cm", "180 x 200cm"],
//       },
//       {
//         title: "Giá tiền",
//         items: ["Dưới 1 triệu", "Từ 1 - 2 triệu", "Trên 4 triệu"],
//       },
//       { title: "Thương hiệu", items: ["Goodnight", "Amando"] },
//     ],
//   },
//   "Phụ kiện": {
//     columns: [
//       {
//         title: "Loại sản phẩm",
//         items: ["Topper nệm", "Tấm bảo vệ nệm", "Bảo vệ gối"],
//       },
//       { title: "Thương hiệu", items: ["Aeroflow", "Goodnight", "Doona"] },
//     ],
//   },
//   "Nội thất": {
//     columns: [
//       {
//         title: "Loại sản phẩm",
//         items: ["Giường", "Ghế massage", "Giường bọc đệm"],
//       },
//       { title: "Kích thước", items: ["160 x 200 cm", "180 x 200 cm"] },
//       { title: "Thương hiệu", items: ["Amando", "Sleeptek"] },
//     ],
//   },
//   Gối: {
//     columns: [
//       {
//         title: "Chất liệu",
//         items: ["Gối bông", "Gối foam", "Gối cao su", "Gối lông vũ"],
//       },
//       {
//         title: "Nhu cầu",
//         items: ["Gối công thái học", "Gối giảm đau vai gáy", "Gối làm mát"],
//       },
//     ],
//   },
// };

// // --- 2. Sub-Components ---

// const NavItem: React.FC<{
//   label: string;
//   icon?: React.ReactNode;
//   hasArrow?: boolean;
// }> = ({ label, icon, hasArrow }) => (
//   <li className="flex items-center gap-1.5 px-4 py-3 cursor-pointer hover:text-green-300 transition-colors border-r border-white/10 last:border-none">
//     {icon}
//     <span className="uppercase text-[13px] font-bold tracking-tight whitespace-nowrap">
//       {label}
//     </span>
//     {hasArrow && <ChevronDown size={14} />}
//   </li>
// );

// // --- 3. Main Combined Component ---
// const HeroSection: React.FC = () => {
//   const [isCategoryHovered, setIsCategoryHovered] = useState(false);

//   return (
//     <div className="w-full flex flex-col items-center">
//       {/* NAVBAR NGANG */}
//       <nav className="bg-[#0a422e] text-white w-full h-[50px] flex justify-center z-[110]">
//         <div className="container mx-auto flex items-center h-full px-4">
//           {/* NÚT DANH MỤC (Trigger hover) */}
//           <div
//             className="h-full bg-[#083626] flex items-center px-6 gap-3 cursor-pointer min-w-[240px] relative group/main"
//             onMouseEnter={() => setIsCategoryHovered(true)}
//             onMouseLeave={() => setIsCategoryHovered(false)}
//           >
//             <LayoutGrid size={18} />
//             <span className="uppercase text-[13px] font-bold">
//               Danh mục sản phẩm
//             </span>
//             <ChevronDown
//               size={14}
//               className={`transition-transform ${isCategoryHovered ? "rotate-180" : ""}`}
//             />

//             {/* DANH SÁCH CẤP 1 (Nệm, Chăn ga...) - Chỉ hiện khi hover nút chính */}
//             <div
//               className={`absolute left-0 top-full w-[240px] bg-white border border-gray-200 shadow-xl transition-all duration-200
//               ${isCategoryHovered ? "opacity-100 visible" : "opacity-0 invisible"}`}
//             >
//               <ul className="flex flex-col py-0">
//                 {(Object.keys(menuData) as MenuDataKeys[]).map((key) => (
//                   <li
//                     key={key}
//                     className="group/item flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none relative"
//                   >
//                     <div className="flex items-center gap-3 text-gray-700">
//                       <span className="text-gray-400 group-hover/item:text-[#0a422e]">
//                         {key === "Nệm" && <Bed size={18} />}
//                         {key === "Chăn ga" && <Wind size={18} />}
//                         {key === "Phụ kiện" && <Package size={18} />}
//                         {key === "Nội thất" && <Sofa size={18} />}
//                         {key === "Gối" && <Layout size={18} />}
//                       </span>
//                       <span className="text-[14px] font-medium group-hover/item:text-[#0a422e]">
//                         {key}
//                       </span>
//                     </div>
//                     <ChevronRight
//                       size={14}
//                       className="text-gray-300 group-hover/item:text-[#0a422e]"
//                     />

//                     {/* DANH SÁCH CẤP 2 (Mega Content) - Chỉ hiện khi hover vào từng mục */}
//                     <div className="invisible group-hover/item:visible absolute left-full top-[-1px] w-[760px] min-h-[400px] bg-white shadow-2xl border border-gray-200 z-[120] p-8 grid grid-cols-4 gap-6 cursor-default ml-0">
//                       {menuData[key].columns.map((col, idx) => (
//                         <div key={idx} className="flex flex-col gap-3">
//                           <h3 className="font-bold text-gray-900 text-[13px] border-b border-gray-100 pb-2 uppercase tracking-tighter">
//                             {col.title}
//                           </h3>
//                           <ul className="flex flex-col gap-2">
//                             {col.items.map((item, i) => (
//                               <li
//                                 key={i}
//                                 className="text-gray-600 hover:text-[#0a422e] text-[13px] transition-colors"
//                               >
//                                 {item}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       ))}
//                     </div>
//                   </li>
//                 ))}
//                 <li className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700">
//                   <Megaphone size={18} className="text-gray-400" />
//                   <span className="text-[14px] font-medium">Khuyến mãi</span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* CÁC LINKS NGANG KHÁC */}
//           <ul className="flex items-center h-full">
//             <NavItem label="Trang chủ" />
//             <NavItem
//               label="Flash Sale"
//               icon={
//                 <Zap size={14} className="text-orange-400 fill-orange-400" />
//               }
//             />
//             <NavItem label="Sản phẩm" hasArrow />
//             <NavItem label="Tin tức" hasArrow />
//             <NavItem label="Giới thiệu" />
//             <NavItem label="Liên hệ" />
//             <NavItem label="Hệ thống cửa hàng" />
//           </ul>
//         </div>
//       </nav>

//       {/* PHẦN BANNER (Canh giữa đồng bộ với Navbar) */}
//       <div className="container mx-auto px-4 relative">
//         <div className="w-full h-[450px] overflow-hidden rounded-sm relative z-10">
//           <img
//             src="https://vuanem.com/blog/wp-content/uploads/2023/09/banner-nem-cao-su-arttisano.jpg"
//             alt="Banner Artisano"
//             className="w-full h-full object-cover"
//           />
//           {/* Lớp phủ Text trên Banner */}
//           <div className="absolute inset-0 flex flex-col justify-center p-16 bg-gradient-to-r from-white/40 to-transparent">
//             <h2 className="text-5xl font-serif text-[#0a422e] font-bold leading-tight drop-shadow-sm">
//               Nệm Nghệ Thuật <br /> Artisano 2026
//             </h2>
//             <p className="mt-4 text-gray-800 max-w-md font-medium">
//               Sự kết hợp hoàn hảo giữa công nghệ làm mát và thiết kế sang trọng
//               cho giấc ngủ chuẩn thượng lưu.
//             </p>
//             <button className="mt-8 bg-[#0a422e] text-white px-8 py-3 w-fit rounded-full font-bold hover:bg-[#083626] transition-all">
//               KHÁM PHÁ NGAY
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeroSection;

//NGROK
