

import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../components/Products/ProductGrid";
import type { Product } from "../components/Products/InterfaceItem";
import axios from "axios";

// Banner danh mục vẫn dùng local
import banner_cat_nem from "../assets/flash-sale/flash-sale-2-nem.webp";
import banner_cat_changa from "../assets/flash-sale/flash-sale-3-changa.webp";
import banner_cat_goi from "../assets/flash-sale/flash-sale-4-goi.webp";
import banner_cat_phukien from "../assets/flash-sale/flash-sale-5-phukien.webp";

import { CirclePlus } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // <-- Sửa thành 8082, port của product-service
// const SLIDER_URL = "http://localhost:8081";

const PARENT_CODE_MAP: Record<string, string> = {
  NEM: "nem",
  "CHAN-GA": "chan-ga", // ← Sửa thành dấu gạch ngang
  GOI: "goi",
  "PHU-KIEN": "phu-kien", // ← Nên sửa luôn cho nhất quán
};

// Chuyển 1 product từ backend sang Product interface frontend
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
const FlashSalePage = () => {
  const categories = [
    { name: "NỆM", code: "nem", categoryBanner: banner_cat_nem },
    { name: "CHĂN GA", code: "chan-ga", categoryBanner: banner_cat_changa },
    { name: "GỐI", code: "goi", categoryBanner: banner_cat_goi },
    { name: "PHỤ KIỆN", code: "phu-kien", categoryBanner: banner_cat_phukien },
  ];

  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0].code,
  );
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // State banner flashsale
  const [flashsaleBanner, setFlashsaleBanner] = useState<string | null>(null);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [bannerError, setBannerError] = useState<string | null>(null);

  // State sản phẩm thật theo danh mục
  const [productsByCategory, setProductsByCategory] = useState<
    Record<string, Product[]>
  >({
    nem: [],
    "chan-ga": [],
    goi: [],
    "phu-kien": [],
  });
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch banner flashsale từ service 8081
  useEffect(() => {
    const fetchFlashsaleBanner = async () => {
      try {
        setLoadingBanner(true);
        setBannerError(null);
        const res = await axios.get(
          `${BASE_URL}/api/admin/sliders/banners/flashsale`,
          {
            headers: { "Cache-Control": "no-store" },
          },
        );
        const resources = res.data.resources ?? [];
        if (resources.length > 0) {
          setFlashsaleBanner(resources[0].secure_url);
        } else {
          setBannerError("Chưa có banner flashsale nào trong folder flashsale");
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setBannerError("Chưa có banner flashsale nào");
        } else {
          setBannerError(`Không thể kết nối tới server: ${err.message}`);
        }
      } finally {
        setLoadingBanner(false);
      }
    };
    fetchFlashsaleBanner();
  }, []);

  // Fetch sản phẩm có discount từ product-service 8082
  useEffect(() => {
    const fetchDiscountProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await axios.get<any[]>(`${BASE_URL}/api/products/discount`);
        const mapped = res.data.map(mapProduct);

        // Phân loại theo parentCode của category
        const grouped: Record<string, Product[]> = {
          nem: [],
          "chan-ga": [],
          goi: [],
          "phu-kien": [],
        };

        res.data.forEach((raw: any, idx: number) => {
          const parentCode =
            raw.category?.parentCode ?? raw.category?.code ?? "";
          const frontendCode = PARENT_CODE_MAP[parentCode];
          if (frontendCode && grouped[frontendCode]) {
            grouped[frontendCode].push(mapped[idx]);
          }
        });

        setProductsByCategory(grouped);
      } catch (err: any) {
        console.error("Lỗi fetch sản phẩm discount:", err.message);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchDiscountProducts();
  }, []);

  // Intersection Observer — highlight category tab khi scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveCategory(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    categories.forEach((cat) => {
      if (sectionRefs.current[cat.code])
        observer.observe(sectionRefs.current[cat.code]!);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (code: string) => {
    const element = sectionRefs.current[code];
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 pb-20">
      {/* Banner chính Flash Sale */}
      <div className="w-full">
        {loadingBanner ? (
          <div className="w-full h-64 bg-gray-50 dark:bg-gray-800 flex items-center justify-center relative">
            <div className="w-[180px] h-[180px] overflow-hidden relative">
              <div className="w-full h-full relative">
                <div className="absolute top-5 left-5 w-32 h-32 rounded-full animate-eclipseRotate origin-[64px_66px] shadow-[0_4px_0_0_theme(colors.ft)]" />
              </div>
            </div>
            <p className="absolute bottom-8 text-ft dark:text-emerald-300 font-medium animate-pulse text-base md:text-lg">
              Đang tải Flash Sale...
            </p>
          </div>
        ) : bannerError ? (
          <div className="w-full h-64 bg-red-50 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400 font-medium">
            {bannerError}
          </div>
        ) : flashsaleBanner ? (
          <img
            src={flashsaleBanner}
            alt="Flash Sale WolfBed"
            className="w-full h-auto max-h-[500px] object-cover border-b-4 border-[#1a4d32] dark:border-emerald-700 dark:brightness-90 dark:contrast-110"
            // className="w-full h-auto object-cover border-b-4 border-[#1a4d32] dark:border-emerald-700 dark:brightness-90 dark:contrast-110"
            onError={(e) => {
              e.currentTarget.src = "/fallback-flashsale.jpg";
            }}
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
            Chưa có banner flashsale
          </div>
        )}
      </div>

      {/* Thanh menu category - sticky */}
      <div className="sticky top-0 z-[110] bg-[#1a4d32] dark:bg-emerald-950 py-3 shadow-lg border-t border-white/10 dark:border-gray-700">
        <div className="max-w-[1440px] mx-auto flex justify-center gap-2 md:gap-4 px-4 overflow-x-auto no-scrollbar touch-pan-x">
          {categories.map((cat) => (
            <button
              key={cat.code}
              onClick={() => scrollToSection(cat.code)}
              className={`px-4 md:px-8 py-2 rounded-full font-bold text-[10px] md:text-sm transition-all shrink-0 border whitespace-nowrap ${
                activeCategory === cat.code
                  ? "bg-white text-[#1a4d32] dark:bg-gray-200 dark:text-emerald-950 border-white dark:border-gray-300 shadow-md"
                  : "bg-[#4ea675] text-white border-white/10 dark:bg-emerald-800 dark:border-gray-600 hover:bg-emerald-700 dark:hover:bg-emerald-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Nội dung các danh mục */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-20 md:px-10 mt-12 space-y-20">
        {categories.map((cat) => (
          <div
            key={cat.code}
            id={cat.code}
            ref={(el) => {
              sectionRefs.current[cat.code] = el;
            }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-[#1a4d32] dark:text-emerald-300 uppercase italic shrink-0">
                <span className="bg-yellow-400 dark:bg-yellow-500 p-1 rounded-md mr-2">
                  ⚡
                </span>
                {cat.name}
              </h2>
              <div className="flex-1 h-[2px] bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <div className="w-full mb-8">
              <img
                src={cat.categoryBanner}
                alt={`Banner ${cat.name}`}
                className="w-full h-auto object-cover rounded-2xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer dark:brightness-90 dark:contrast-110"
              />
            </div>

            {loadingProducts ? (
              <div className="py-20 text-center text-gray-400 dark:text-gray-500">
                Đang tải sản phẩm...
              </div>
            ) : productsByCategory[cat.code]?.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-md dark:shadow-gray-700/50 border border-gray-200 dark:border-gray-700">
                <ProductGrid products={productsByCategory[cat.code]} />
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                Sản phẩm đang cập nhật...
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link
                to={`/collections/all?category=${cat.code}`}
                className="group flex items-center gap-3 bg-white dark:bg-gray-800 border-2 border-[#1a4d32] dark:border-emerald-600 text-[#1a4d32] dark:text-emerald-300 px-12 py-3 rounded-full font-black text-sm uppercase hover:bg-[#1a4d32] hover:text-white dark:hover:bg-emerald-700 dark:hover:text-white transition-all shadow-md hover:shadow-lg"
              >
                Tất cả {cat.name}
                <CirclePlus
                  size={18}
                  className="group-hover:rotate-90 transition-transform text-[#1a4d32] dark:text-emerald-300 group-hover:text-white"
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSalePage;
