import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../components/Products/ProductGrid";
import type { Product } from "../components/Products/InterfaceItem";
import image_nem from "../assets/about.webp";
import changa from "../assets/chan-ga/bo-chan-ga.webp";
import goi from "../assets/goi/goi-bong.webp";
import phu_kien from "../assets/phukien/bao-ve-goi.webp";

// Banner danh mục vẫn dùng local
import banner_cat_nem from "../assets/flash-sale/flash-sale-2-nem.webp";
import banner_cat_changa from "../assets/flash-sale/flash-sale-3-changa.webp";
import banner_cat_goi from "../assets/flash-sale/flash-sale-4-goi.webp";
import banner_cat_phukien from "../assets/flash-sale/flash-sale-5-phukien.webp";

import { CirclePlus } from "lucide-react";

const FlashSalePage = () => {
  const BASE_URL = "http://localhost:8081";
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

  // State cho banner flashsale
  const [flashsaleBanner, setFlashsaleBanner] = useState<string | null>(null);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [bannerError, setBannerError] = useState<string | null>(null);

  // Fake data sản phẩm (giữ nguyên)
  const FAKE_DATA_BY_CAT: Record<string, Product[]> = {
    nem: Array(5)
      .fill(null)
      .map((_, i) => ({
        _id: `wb-n${i}`,
        name: `Nệm Cao Su WolfBed Luxury X${i + 1}`,
        brand: "WolfBed",
        price: 15000000,
        originalPrice: 20000000,
        images: [{ url: image_nem, is_primary: true }],
        rating: 5,
        reviewCount: 10 + i,
        status: "selling",
        stock_quantity: 10,
      })),
    "chan-ga": Array(8)
      .fill(null)
      .map((_, i) => ({
        _id: `wb-c${i}`,
        name: `Bộ Chăn Ga WolfBed Cotton Tencel ${i + 1}`,
        brand: "WolfBed",
        price: 1200000,
        originalPrice: 1800000,
        images: [{ url: changa, is_primary: true }],
        rating: 4.5,
        reviewCount: 20,
        status: "selling",
        stock_quantity: 10,
      })),
    goi: Array(5)
      .fill(null)
      .map((_, i) => ({
        _id: `wb-g${i}`,
        name: `Gối Cao Su WolfBed Massage ${i + 1}`,
        brand: "WolfBed",
        price: 500000,
        originalPrice: 800000,
        images: [{ url: goi, is_primary: true }],
        rating: 4.8,
        reviewCount: 30,
        status: "selling",
        stock_quantity: 0,
      })),
    "phu-kien": Array(5)
      .fill(null)
      .map((_, i) => ({
        _id: `wb-p${i}`,
        name: `Phụ kiện WolfBed ${i + 1}`,
        brand: "WolfBed",
        price: 500000,
        originalPrice: 800000,
        images: [{ url: phu_kien, is_primary: true }],
        rating: 4.8,
        reviewCount: 30,
        status: "stopselling",
        stock_quantity: 5,
      })),
  };

  useEffect(() => {
    const fetchFlashsaleBanner = async () => {
      try {
        setLoadingBanner(true);
        setBannerError(null);

        const res = await fetch(
          `${BASE_URL}/api/admin/sliders/banners/flashsale`,
          { cache: "no-store" },
        );

        if (!res.ok) {
          const errorText = await res.text();
          if (res.status === 404) {
            setBannerError("Chưa có banner flashsale nào");
          } else {
            setBannerError(`Lỗi server: ${res.status}`);
          }
          return;
        }

        const data = await res.json();
        const resources = data.resources || [];

        if (resources.length > 0) {
          setFlashsaleBanner(resources[0].secure_url);
        } else {
          setBannerError("Chưa có banner flashsale nào trong folder flashsale");
        }
      } catch (err: any) {
        setBannerError(`Không thể kết nối tới server: ${err.message}`);
      } finally {
        setLoadingBanner(false);
      }
    };

    fetchFlashsaleBanner();
  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    categories.forEach((cat) => {
      if (sectionRefs.current[cat.code]) {
        observer.observe(sectionRefs.current[cat.code]!);
      }
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
                <div
                  className="
                    absolute top-5 left-5
                    w-32 h-32 rounded-full
                    animate-eclipseRotate
                    origin-[64px_66px]
                    shadow-[0_4px_0_0_theme(colors.ft)]
                  "
                />
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
            className="w-full h-auto object-cover border-b-4 border-[#1a4d32] dark:border-emerald-700 dark:brightness-90 dark:contrast-110"
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

            {FAKE_DATA_BY_CAT[cat.code]?.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-md dark:shadow-gray-700/50 border border-gray-200 dark:border-gray-700">
                <ProductGrid products={FAKE_DATA_BY_CAT[cat.code]} />
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
