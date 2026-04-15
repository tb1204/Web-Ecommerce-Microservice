
//lấy data thật
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductGrid from "../Products/ProductGrid";
import type { Product } from "../Products/InterfaceItem";
import axios from "axios";

// Assets
import collection_banner_1 from "../../assets/banner/collection_banner_1.webp";

// const BASE_URL = "http://localhost:8082";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      ? {
          name: p.category.name || p.category,
          code: p.category.code || "",
          parentName: p.category.parentName || null,
          parentCode: p.category.parentCode || null,
        }
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
  } as Product;
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
        // Lấy danh sách ID sản phẩm bán chạy từ order-service
        const topIdsRes = await axios.get<string[]>(`${BASE_URL}/api/orders/statistics/top-selling-ids?limit=8`);
        const topIds = topIdsRes.data;

        if (topIds && topIds.length > 0) {
          // Lấy chi tiết các sản phẩm từ product-service
          const res = await axios.get<any[]>(`${BASE_URL}/api/products/by-ids?ids=${topIds.join(",")}`);
          const products = res.data.filter((p) => p.status === "AVAILABLE" && (p.totalStockQuantity ?? 0) > 0);
          
          // Map dữ liệu và giữ nguyên thứ tự bán chạy
          const mapped = products
            .map(mapProduct)
            .sort((a, b) => topIds.indexOf(a.id) - topIds.indexOf(b.id));

          setComboProducts(mapped);
        } else {
          setComboProducts([]);
        }
      } catch (err: any) {
        console.error("Lỗi fetch top selling products:", err.message);
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
          <h2 className="text-white text-xl md:text-5xl font-sans font-bold leading-tight tracking-tight">
            Sản Phẩm Bán Nhiều Nhất
          </h2>

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
