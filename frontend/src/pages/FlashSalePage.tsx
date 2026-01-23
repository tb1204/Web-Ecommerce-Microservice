import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/Products/ProductCard";
import type { Product } from "../components/Products/ProductCard";
import image_nem from "../assets/about.webp";
import banner_flashsale from "../assets/flash-sale/banner-sale.webp";
import changa from "../assets/chan-ga/bo-chan-ga.webp";
import goi from "../assets/goi/goi-bong.webp";
import phu_kien from "../assets/phukien/bao-ve-goi.webp";

// Import các ảnh banner riêng cho từng danh mục (Bạn thay đường dẫn đúng nhé)
import banner_cat_nem from "../assets/flash-sale/flash-sale-2-nem.webp";
import banner_cat_changa from "../assets/flash-sale/flash-sale-3-changa.webp";
import banner_cat_goi from "../assets/flash-sale/flash-sale-4-goi.webp";
import banner_cat_phukien from "../assets/flash-sale/flash-sale-5-phukien.webp";

import { CirclePlus } from "lucide-react";

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
        _id: `wb-g${i}`,
        name: `Phụ kiện  WolfBed Massage ${i + 1}`,
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
        top: element.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen  pb-20">
      {/* Banner chính Flash Sale */}
      <div className="w-full">
        <img
          src={banner_flashsale}
          alt="Flash Sale WolfBed"
          className="w-full h-auto object-cover border-b-4 border-[#1a4d32]"
        />
      </div>

      {/* 2. THANH MENU CATEGORY - Bám dính (Sticky) */}
      <div className="sticky top-0 z-[110] bg-[#1a4d32] py-3 shadow-lg border-t border-white/10">
        <div className="max-w-[1440px] mx-auto flex justify-center gap-2 md:gap-4 px-4 overflow-x-auto no-scrollbar touch-pan-x">
          {categories.map((cat) => (
            <button
              key={cat.code}
              onClick={() => scrollToSection(cat.code)}
              className={`px-4 md:px-8 py-2 rounded-full font-bold text-[10px] md:text-sm transition-all shrink-0 border whitespace-nowrap ${
                activeCategory === cat.code
                  ? "bg-white text-[#1a4d32] border-white"
                  : "bg-[#4ea675] text-white border-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

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
            {/* Tiêu đề danh mục */}
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-[#1a4d32] uppercase italic shrink-0">
                <span className="bg-yellow-400 p-1 rounded-md mr-2">⚡</span>
                {cat.name}
              </h2>
              <div className="flex-1 h-[2px] bg-gray-200"></div>
            </div>

            {/* --- THÊM THẺ IMG BANNER DANH MỤC Ở ĐÂY --- */}
            <div className="w-full mb-8">
              <img
                src={cat.categoryBanner}
                alt={`Banner ${cat.name}`}
                className="w-full h-auto object-cover rounded-2xl shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              />
            </div>

            {/* Danh sách sản phẩm */}
            {FAKE_DATA_BY_CAT[cat.code]?.length > 0 ? (
              <ProductCard products={FAKE_DATA_BY_CAT[cat.code]} />
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white text-gray-400">
                Sản phẩm đang cập nhật...
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link
                to={`/collections/all?category=${cat.code}`}
                className="group flex items-center gap-3 bg-white border-2 border-[#1a4d32] text-[#1a4d32] px-12 py-3 rounded-full font-black text-sm uppercase hover:bg-[#1a4d32] hover:text-white transition-all shadow-sm"
              >
                Tất cả {cat.name}
                <CirclePlus
                  size={18}
                  className="group-hover:rotate-90 transition-transform"
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
