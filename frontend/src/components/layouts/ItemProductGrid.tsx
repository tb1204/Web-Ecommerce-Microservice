// import type { Product } from "../Products/InterfaceItem";
// import { Link } from "react-router-dom";
// import { ChevronRight } from "lucide-react";
// import ProductGrid from "../Products/ProductGrid";

// // Import hình ảnh
// import image_nem from "../../assets/about.webp";
// import image_goi1 from "../../assets/goi/goi-bong.webp";
// import image_goi2 from "../../assets/goi/goi-cao-su.webp";
// import banner_phu_1 from "../../assets/banner/Banner-phu-1.webp";
// import banner_phu_2 from "../../assets/banner/Banner-phu-2.webp";

// const products: Product[] = [
//   {
//     id: "p1",
//     name: "Nệm Cao Su Thiên Nhiên Luxury X1",
//     brand: "WolfBed",
//     price: 15000000,
//     originalPrice: 20000000,
//     images: [{ url: image_nem, isPrimary: true }],
//     status: "selling",
//     rating: 5,
//     reviewCount: 120,
//     stockQuantity: 10,
//   },
//   {
//     id: "p2",
//     name: "Nệm Foam Nhật Bản Goodnight",
//     brand: "WolfBed",
//     price: 7500000,
//     originalPrice: 10000000,
//     images: [{ url: image_nem, isPrimary: true }],
//     status: "selling",
//     rating: 4.8,
//     reviewCount: 92,
//     stockQuantity: 0, // Trạng thái: Hết hàng
//   },
//   {
//     id: "p3",
//     name: "Topper Nệm Làm Mềm Mặt Đệm",
//     brand: "WolfBed",
//     price: 1200000,
//     originalPrice: 1800000,
//     images: [{ url: image_goi1, isPrimary: true }],
//     status: "stopselling", // Trạng thái: Ngừng kinh doanh
//     rating: 4.7,
//     reviewCount: 66,
//     stockQuantity: 0,
//   },
//   {
//     id: "p4",
//     name: "Nệm Lò Xo Túi Độc Lập Cao Cấp",
//     brand: "WolfBed",
//     price: 8900000,
//     originalPrice: 12000000,
//     images: [{ url: image_goi1, isPrimary: true }],
//     status: "selling",
//     rating: 4.5,
//     reviewCount: 45,
//     stockQuantity: 5,
//   },
//   {
//     id: "p5",
//     name: "Nệm Lò Xo Túi Độc Lập Cao Cấp",
//     brand: "WolfBed",
//     price: 8900000,
//     originalPrice: 12000000,
//     images: [{ url: image_goi2, isPrimary: true }],
//     status: "selling",
//     rating: 4.5,
//     reviewCount: 45,
//     stockQuantity: 5,
//   },
//   {
//     id: "p6",
//     name: "Nệm Lò Xo Túi Độc Lập Cao Cấp",
//     brand: "WolfBed",
//     price: 8900000,
//     originalPrice: 12000000,
//     images: [{ url: image_goi2, isPrimary: true }],
//     status: "selling",
//     rating: 4.5,
//     reviewCount: 45,
//     stockQuantity: 5,
//   },
// ];

// const ItemProductGrid = () => {
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
//       {/* 2 Banner phía trên */}
//       <div className="flex flex-col md:flex-row gap-4 mb-10">
//         <div className="flex-1 overflow-hidden rounded-xl h-[200px] md:h-[280px]">
//           <img
//             src={banner_phu_1}
//             alt="Khuyến mãi nệm"
//             className="w-full h-full object-cover transition-transform duration-700 cursor-pointer hover:scale-105"
//           />
//         </div>
//         <div className="flex-1 overflow-hidden rounded-xl h-[200px] md:h-[280px]">
//           <img
//             src={banner_phu_2}
//             alt="Gối cao su thiên nhiên"
//             className="w-full h-full object-cover transition-transform duration-700 cursor-pointer hover:scale-105"
//           />
//         </div>
//       </div>

//       {/* Header tiêu đề và Link danh mục */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4">
//         <Link to="/danh-muc-nem" className="group">
//           <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-6 md:mb-0 max-w-lg leading-tight group-hover:text-[#1a4d32] dark:group-hover:text-green-400 transition-colors duration-300">
//             Nệm êm giá đẹp
//           </h2>
//         </Link>

//         <div className="flex items-center gap-4 md:gap-8 text-sm md:text-base font-medium text-gray-600">
//           <Link
//             to="/nem-bong-ep"
//             className="hover:text-[#1a4d32]  text-gray-600 dark:text-gray-300 hover:underline underline-offset-8 transition-all"
//           >
//             Nệm bông ép
//           </Link>
//           <Link
//             to="/nem-cao-su"
//             className="hover:text-[#1a4d32] text-gray-600 dark:text-gray-300 hover:underline underline-offset-8 transition-all"
//           >
//             Nệm cao su
//           </Link>
//           <Link
//             to="/nem-lo-xo"
//             className="hover:text-[#1a4d32] text-gray-600 dark:text-gray-300 hover:underline underline-offset-8 transition-all"
//           >
//             Nệm lò xo
//           </Link>
//         </div>
//       </div>

//       {/* Grid hiển thị danh sách sản phẩm */}

//       <ProductGrid products={products} loading={false} />

//       {/* Nút xem thêm */}
//       <div className="mt-10 flex justify-center">
//         <Link
//           to="/collections/all"
//           className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#1a4d32] dark:hover:text-green-400 font-medium transition-all group"
//         >
//           Xem thêm sản phẩm
//           <div className="w-6 h-6 rounded-full border border-gray-400 dark:border-gray-600 flex items-center justify-center group-hover:border-[#1a4d32] dark:group-hover:border-green-400 group-hover:bg-[#1a4d32] dark:group-hover:bg-green-400 group-hover:text-white transition-all">
//             <ChevronRight size={14} />
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default ItemProductGrid;

//lấy data thật

import { useState, useEffect } from "react";
import type { Product } from "../Products/InterfaceItem";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProductGrid from "../Products/ProductGrid";
import axios from "axios";

// Import hình ảnh banner (vẫn dùng local)
import banner_phu_1 from "../../assets/banner/banner-phu-1.webp";
import banner_phu_2 from "../../assets/banner/banner-phu-2.webp";

// const BASE_URL = "http://localhost:8082";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const mapProduct = (p: any): Product => ({
//   id: p._id?.$oid ?? p.id ?? p._id,
//   name: p.name,
//   brand: p.brand,
//   price: p.price,
//   originalPrice:
//     p.variants?.find((v: any) => v.originalPrice)?.originalPrice ?? undefined,
//   images: (p.images ?? []).map((img: any) => ({
//     url: img.url,
//     isPrimary: img.isPrimary,
//   })),
//   status:
//     p.status === "AVAILABLE"
//       ? "selling"
//       : p.status === "DISCONTINUED"
//         ? "stopselling"
//         : "selling",
//   rating: p.rating ?? 0,
//   reviewCount: p.reviewCount ?? 0,
//   stockQuantity: p.totalStockQuantity ?? 0,
// });
const mapProduct = (p: any): Product => ({
  id: p._id?.$oid ?? p.id ?? p._id,
  name: p.name,
  brand: p.brand,
  price: p.price,
  originalPrice:
    p.variants?.find((v: any) => v.originalPrice)?.originalPrice ?? undefined,

  images: (p.images ?? []).map((img: any) => ({
    url: img.url,
    isPrimary: img.isPrimary,
  })),

  status:
    p.status === "AVAILABLE"
      ? "selling"
      : p.status === "DISCONTINUED"
        ? "stopselling"
        : "selling",

  rating: p.rating ?? 0,
  reviewCount: p.reviewCount ?? 0,

  // === THÊM 2 FIELD BỊ THIẾU ===
  totalStockQuantity: p.totalStockQuantity ?? p.stockQuantity ?? 0,
  variants: p.variants ?? [],

  // Nếu Product interface còn yêu cầu thêm field nào khác (sku, parentName, parentCode...) thì thêm tiếp:
  // sku: p.sku ?? "",
});
const ItemProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNemProducts = async () => {
      try {
        setLoading(true);
        // Lấy tất cả sản phẩm thuộc danh mục cha "NEM"
        const res = await axios.get<any[]>(
          `${BASE_URL}/api/products/parent-category/NEM`,
        );
        // Chỉ hiển thị tối đa 6 sản phẩm trên homepage
        setProducts(res.data.slice(0, 6).map(mapProduct));
      } catch (err: any) {
        console.error("Lỗi fetch sản phẩm nệm:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNemProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
      {/* 2 Banner phía trên */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-1 overflow-hidden rounded-xl h-[200px] md:h-[280px]">
          {/* <img
            src={banner_phu_1}
            alt="Khuyến mãi nệm"
            className="w-full h-full object-cover transition-transform duration-700 cursor-pointer hover:scale-105"
          /> */}
          <Link
            to="/collections/all"
            className="flex-1 overflow-hidden rounded-xl h-[200px] md:h-[280px] group"
          >
            <img
              src={banner_phu_1}
              alt="Khuyến mãi nệm"
              className="w-full h-full object-cover transition-transform duration-700 cursor-pointer group-hover:scale-105"
            />
          </Link>
        </div>
        <div className="flex-1 overflow-hidden rounded-xl h-[200px] md:h-[280px]">
          {/* <img
            src={banner_phu_2}
            alt="Gối cao su thiên nhiên"
            className="w-full h-full object-cover transition-transform duration-700 cursor-pointer hover:scale-105"
          /> */}
          <Link
            to="/collections/all"
            className="flex-1 overflow-hidden rounded-xl h-[200px] md:h-[280px] group"
          >
            <img
              src={banner_phu_2}
              alt="Gối cao su thiên nhiên"
              className="w-full h-full object-cover transition-transform duration-700 cursor-pointer group-hover:scale-105"
            />
          </Link>
        </div>
      </div>

      {/* Header tiêu đề và Link danh mục */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4">
        <Link to="/collections/all?category=nem" className="group">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-6 md:mb-0 max-w-lg leading-tight group-hover:text-[#1a4d32] dark:group-hover:text-green-400 transition-colors duration-300">
            Nệm êm giá đẹp
          </h2>
        </Link>

        <div className="flex items-center gap-4 md:gap-8 text-sm md:text-base font-medium text-gray-600">
          <Link
            // to="/nem-bong-ep"
            to="/collections/all?category=nem&type=Nệm bông ép"
            className="hover:text-[#1a4d32] text-gray-600 dark:text-gray-300 hover:underline underline-offset-8 transition-all"
          >
            Nệm bông ép
          </Link>
          <Link
            // to="/nem-cao-su"
            to="/collections/all?category=nem&type=Nệm cao su"
            className="hover:text-[#1a4d32] text-gray-600 dark:text-gray-300 hover:underline underline-offset-8 transition-all"
          >
            Nệm cao su
          </Link>
          <Link
            // to="/nem-lo-xo"
            to="/collections/all?category=nem&type=Nệm lò xo"
            className="hover:text-[#1a4d32] text-gray-600 dark:text-gray-300 hover:underline underline-offset-8 transition-all"
          >
            Nệm lò xo
          </Link>
          <Link
            // to="/nem-lo-xo"
            to="/collections/all?category=nem&type=Nệm Foam"
            className="hover:text-[#1a4d32] text-gray-600 dark:text-gray-300 hover:underline underline-offset-8 transition-all"
          >
            Nệm Foam
          </Link>
        </div>
      </div>

      {/* Grid hiển thị danh sách sản phẩm */}
      <ProductGrid products={products} loading={loading} />

      {/* Nút xem thêm */}
      <div className="mt-10 flex justify-center">
        <Link
          to="/collections/all"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#1a4d32] dark:hover:text-green-400 font-medium transition-all group"
        >
          Xem thêm sản phẩm
          <div className="w-6 h-6 rounded-full border border-gray-400 dark:border-gray-600 flex items-center justify-center group-hover:border-[#1a4d32] dark:group-hover:border-green-400 group-hover:bg-[#1a4d32] dark:group-hover:bg-green-400 group-hover:text-white transition-all">
            <ChevronRight size={14} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ItemProductGrid;
