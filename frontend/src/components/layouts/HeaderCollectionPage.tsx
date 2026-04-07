// import React, { useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import { ChevronRight, ChevronLeft } from "lucide-react";
// import ProductGrid from "../Products/ProductGrid";
// import type { Product } from "../Products/InterfaceItem";

// // Assets
// import collection_banner_1 from "../../assets/banner/collection_banner_1.webp";
// import image_nem from "../../assets/about.webp";

// const HeaderCollectionPage: React.FC = () => {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // Logic hỗ trợ kéo chuột (Drag-to-scroll)
//   const [isDragging, setIsDragging] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);

//   // NEW: Biến để phân biệt Click và Drag
//   const [dragDistance, setDragDistance] = useState(0);

//   const comboProducts: Product[] = [
//     {
//       id: "p1",
//       name: "Topper memory foam nâng đỡ êm ái Comfy Noah",
//       brand: "WolfBed",
//       category: { name: "Topper", code: "topper" },
//       price: 2160000,
//       originalPrice: 2400000,
//       images: [{ url: image_nem, isPrimary: true }],
//       status: "selling",
//       rating: 5,
//       reviewCount: 120,
//       stockQuantity: 10,
//     },
//     {
//       id: "p2",
//       name: "Chiếu điều hòa cao su Doona Aqua làm mát",
//       brand: "WolfBed",
//       category: { name: "Chiếu điều hòa", code: "chieu" },
//       price: 729000,
//       originalPrice: 890000,
//       images: [{ url: image_nem, isPrimary: true }],
//       status: "selling",
//       rating: 4.8,
//       reviewCount: 92,
//       stockQuantity: 10,
//     },
//     {
//       id: "p3",
//       name: "Bảo vệ nệm Doona Bamboo chống bụi bẩn, thoáng khí",
//       brand: "WolfBed",
//       category: { name: "Bảo vệ nệm", code: "nem" },
//       price: 800000,
//       originalPrice: 900000,
//       images: [{ url: image_nem, isPrimary: true }],
//       status: "selling",
//       rating: 4.7,
//       reviewCount: 66,
//       stockQuantity: 10,
//     },
//     {
//       id: "p4",
//       name: "Ga chống thấm Goodnight Sumi mềm mại, kháng...",
//       brand: "WolfBed",
//       category: { name: "Chăn ga gối", code: "changa" },
//       price: 239000,
//       originalPrice: 390000,
//       images: [{ url: image_nem, isPrimary: true }],
//       status: "selling",
//       rating: 4.9,
//       reviewCount: 45,
//       stockQuantity: 10,
//     },
//     {
//       id: "p5",
//       name: "Chăn đông lông thỏ mềm mịn Amando Warm",
//       brand: "WolfBed",
//       category: { name: "Chăn ga gối", code: "changa" },
//       price: 1200000,
//       originalPrice: 1500000,
//       images: [{ url: image_nem, isPrimary: true }],
//       status: "selling",
//       rating: 5,
//       reviewCount: 1,
//       stockQuantity: 10,
//     },
//     {
//       id: "p6",
//       name: "Nệm Foam Nhật Bản cao cấp",
//       brand: "WolfBed",
//       category: { name: "Nệm", code: "nem" },
//       price: 7500000,
//       originalPrice: 10000000,
//       images: [{ url: image_nem, isPrimary: true }],
//       status: "selling",
//       rating: 4.8,
//       reviewCount: 92,
//       stockQuantity: 10,
//     },
//   ];

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (!scrollRef.current) return;
//     setIsDragging(true);
//     setDragDistance(0); // Reset quãng đường khi bắt đầu nhấn
//     setStartX(e.pageX - scrollRef.current.offsetLeft);
//     setScrollLeft(scrollRef.current.scrollLeft);
//   };

//   const handleMouseLeaveOrUp = () => {
//     setIsDragging(false);
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging || !scrollRef.current) return;
//     e.preventDefault();
//     const x = e.pageX - scrollRef.current.offsetLeft;
//     const walk = (x - startX) * 2;

//     // Tính toán quãng đường đã di chuyển để phân biệt click/drag
//     setDragDistance(Math.abs(x - startX));

//     scrollRef.current.scrollLeft = scrollLeft - walk;
//   };

//   const scroll = (direction: "left" | "right") => {
//     if (scrollRef.current) {
//       const container = scrollRef.current;
//       const firstItem = container.firstElementChild as HTMLElement;
//       if (firstItem) {
//         const gap = window.innerWidth < 768 ? 12 : 20;
//         const itemWidth = firstItem.offsetWidth + gap;
//         container.scrollBy({
//           left: direction === "left" ? -itemWidth : itemWidth,
//           behavior: "smooth",
//         });
//       }
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 font-sans">
//       <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
//         Tất cả sản phẩm
//       </h1>

//       <div className="w-full rounded-xl md:rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-sm">
//         <img
//           src={collection_banner_1}
//           alt="Banner"
//           className="w-full h-[160px] md:h-auto object-cover md:object-contain"
//         />
//       </div>

//       <div className="bg-[#56a77e] rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 mb-10 relative group/section overflow-hidden">
//         <div className="flex justify-between items-center mb-6 md:mb-8 px-1">
//           <h2 className="text-white text-xl md:text-5xl font-serif font-medium italic leading-tight">
//             Combo Giá Sốc
//           </h2>
//           <Link
//             to="/collections/all"
//             className="flex-shrink-0 flex items-center gap-1 text-white text-[10px] md:text-sm font-semibold hover:opacity-80 transition-all border-b border-white/30 pb-0.5"
//           >
//             Xem tất cả <ChevronRight size={14} className="bg-white/20 rounded-full p-0.5 md:p-1" />
//           </Link>
//         </div>

//         <button
//           onClick={() => scroll("left")}
//           className="absolute left-1 top-[55%] -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl text-green-700 opacity-0 group-hover/section:opacity-100 transition-all hover:bg-green-50 hidden lg:flex items-center justify-center border border-gray-100"
//         >
//           <ChevronLeft size={24} strokeWidth={2.5} />
//         </button>
//         <button
//           onClick={() => scroll("right")}
//           className="absolute right-1 top-[55%] -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl text-green-700 opacity-0 group-hover/section:opacity-100 transition-all hover:bg-green-50 hidden lg:flex items-center justify-center border border-gray-100"
//         >
//           <ChevronRight size={24} strokeWidth={2.5} />
//         </button>

//         <div
//           ref={scrollRef}
//           onMouseDown={handleMouseDown}
//           onMouseLeave={handleMouseLeaveOrUp}
//           onMouseUp={handleMouseLeaveOrUp}
//           onMouseMove={handleMouseMove}
//           className={`flex overflow-x-auto gap-3 md:gap-5 scrollbar-hide snap-x snap-mandatory pb-4 scroll-smooth touch-pan-x select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
//           style={{ WebkitOverflowScrolling: "touch" }}
//         >
//           {comboProducts.map((product) => (
//             <div
//               key={product.id}
//               className={`flex-none w-[calc(50%-6px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] snap-start`}
//               // Sửa lỗi Click: Nếu di chuyển chuột > 5px thì chặn sự kiện click vào chi tiết sản phẩm
//               onClickCapture={(e) => {
//                 if (dragDistance > 5) {
//                   e.preventDefault();
//                   e.stopPropagation();
//                 }
//               }}
//             >
//               <ProductGrid products={[product]} isBundleMode={false} isSliderMode={true} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HeaderCollectionPage;

//lấy data thật
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductGrid from "../Products/ProductGrid";
import type { Product } from "../Products/InterfaceItem";
import axios from "axios";

// Assets
import collection_banner_1 from "../../assets/banner/collection_banner_1.webp";

const BASE_URL = "http://localhost:8082";

// Map 1 product backend → Product interface frontend
const mapProduct = (p: any): Product => {
  // Lấy originalPrice từ variant đầu tiên có giảm giá
  const discountVariant = p.variants?.find(
    (v: any) => v.originalPrice && v.originalPrice > v.price,
  );
  return {
    id: p._id?.$oid ?? p.id ?? p._id,
    name: p.name,
    brand: p.brand,
    category: p.category
      ? { name: p.category.name, code: p.category.code }
      : undefined,
    price: p.price,
    originalPrice: discountVariant?.originalPrice ?? undefined,
    images: (p.images ?? []).map((img: any) => ({
      url: img.url,
      isPrimary: img.isPrimary,
    })),
    status: p.status === "AVAILABLE" ? "selling" : "stopselling",
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    stockQuantity: p.totalStockQuantity ?? 0,
  };
};

// Lấy ngẫu nhiên n phần tử từ mảng (để làm Combo đa dạng)
const getRandomItems = <T,>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};

const HeaderCollectionPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  // State sản phẩm thật
  const [comboProducts, setComboProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComboProducts = async () => {
      try {
        setLoading(true);
        // Lấy tất cả sản phẩm đang bán có hàng
        const res = await axios.get<any[]>(`${BASE_URL}/api/products/all`);
        const discounted = res.data.filter(
          (p) =>
            p.status === "AVAILABLE" &&
            (p.totalStockQuantity ?? 0) > 0 &&
            p.variants?.some(
              (v: any) => v.originalPrice && v.originalPrice > v.price,
            ),
        );
        const mapped = getRandomItems(discounted, 8).map(mapProduct);
        setComboProducts(mapped);
      } catch (err: any) {
        console.error("Lỗi fetch combo products:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComboProducts();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setDragDistance(0);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    setDragDistance(Math.abs(x - startX));
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const firstItem = container.firstElementChild as HTMLElement;
      if (firstItem) {
        const gap = window.innerWidth < 768 ? 12 : 20;
        const itemWidth = firstItem.offsetWidth + gap;
        container.scrollBy({
          left: direction === "left" ? -itemWidth : itemWidth,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 font-sans">
      {/* <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
        Tất cả sản phẩm
      </h1> */}

      <div className="w-full rounded-xl md:rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-sm">
        <img
          src={collection_banner_1}
          alt="Banner"
          className="w-full h-[160px] md:h-auto object-cover md:object-contain"
        />
      </div>

      <div className="bg-[#56a77e] rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 mb-10 relative group/section overflow-hidden">
        <div className="flex justify-between items-center mb-6 md:mb-8 px-1">
          <h2 className="text-white text-xl md:text-5xl font-serif font-medium italic leading-tight">
            Giảm Giá Sốc
          </h2>
          <Link
            // to="/collections/all"
            to="/flashsale/"
            className="flex-shrink-0 flex items-center gap-1 text-white text-[10px] md:text-sm font-semibold hover:opacity-80 transition-all border-b border-white/30 pb-0.5"
          >
            Xem tất cả{" "}
            <ChevronRight
              size={14}
              className="bg-white/20 rounded-full p-0.5 md:p-1"
            />
          </Link>
        </div>

        <button
          onClick={() => scroll("left")}
          className="absolute left-1 top-[55%] -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl text-green-700 opacity-0 group-hover/section:opacity-100 transition-all hover:bg-green-50 hidden lg:flex items-center justify-center border border-gray-100"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-1 top-[55%] -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-xl text-green-700 opacity-0 group-hover/section:opacity-100 transition-all hover:bg-green-50 hidden lg:flex items-center justify-center border border-gray-100"
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>

        {/* Loading skeleton */}
        {loading ? (
          <div className="flex gap-3 md:gap-5 overflow-hidden pb-4">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex-none w-[calc(50%-6px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] rounded-xl bg-white/20 animate-pulse h-64"
                />
              ))}
          </div>
        ) : comboProducts.length === 0 ? (
          <div className="py-16 text-center text-white/70">
            Chưa có sản phẩm nào
          </div>
        ) : (
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            className={`flex overflow-x-auto gap-3 md:gap-5 scrollbar-hide snap-x snap-mandatory pb-4 scroll-smooth touch-pan-x select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {comboProducts.map((product) => (
              <div
                key={product.id}
                className="flex-none w-[calc(50%-6px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] snap-start"
                onClickCapture={(e) => {
                  if (dragDistance > 5) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
              >
                <ProductGrid
                  products={[product]}
                  isBundleMode={false}
                  isSliderMode={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderCollectionPage;
