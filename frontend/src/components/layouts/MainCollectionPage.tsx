import React, { useState, useMemo, useRef } from "react";
import { Filter, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X } from "lucide-react";
import ProductCard from "../Products/ProductCard";
import type { Product } from "../Products/InterfaceItem";

import image_nem from "../../assets/about.webp";

const MainCollectionPage: React.FC = () => {
  const [openFilters, setOpenFilters] = useState({ 
    category: true, 
    brand: true, 
    price: true,
    origin: true 
  });
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const mainContentRef = useRef<HTMLDivElement>(null);

  const allProducts: Product[] = useMemo(() => {
    const baseProducts = [
      { _id: "p1", name: "Topper memory foam nâng đỡ êm ái Comfy Noah", brand: "WolfBed", price: 2160000, originalPrice: 2400000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 5, reviewCount: 120, stock_quantity: 10 },
      { _id: "p2", name: "Chiếu điều hòa cao su Doona Aqua làm mát", brand: "WolfBed", price: 729000, originalPrice: 890000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.8, reviewCount: 92, stock_quantity: 10 },
      { _id: "p3", name: "Bảo vệ nệm Doona Bamboo chống bụi bẩn, thoáng khí", brand: "WolfBed", price: 800000, originalPrice: 900000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.7, reviewCount: 66, stock_quantity: 10 },
      { _id: "p4", name: "Ga chống thấm Goodnight Sumi mềm mại, kháng...", brand: "WolfBed", price: 239000, originalPrice: 390000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.9, reviewCount: 45, stock_quantity: 10 },
    ];
    return Array.from({ length: 60 }, (_, i) => ({
      ...baseProducts[i % baseProducts.length],
      _id: `prod-${i}`,
      name: `${baseProducts[i % baseProducts.length].name} (Mẫu ${i + 1})`
    }));
  }, []);

  const categories = ["Topper", "Chiếu điều hòa", "Bảo vệ nệm", "Chăn lẻ", "Vỏ gối", "Gối", "Bộ chăn ga", "Nệm", "Đệm Foam", "Đệm lò xo", "Đệm cao su"];
  const brands = ["Liên Á", "Gummi", "Doona", "Aeroflow", "Comfy", "Amando", "Goodnight", "Kim Cương", "Dunlopillo"];
  const priceRanges = ["Giá dưới 200.000₫", "200.000₫ - 500.000₫", "500.000₫ - 700.000₫", "700.000₫ - 1.000.000₫", "1.000.000₫ - 3.000.000₫"];
  const origins = ["Việt Nam", "Mỹ", "Anh", "Nhật Bản"];

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = allProducts.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setIsMobileFilterOpen(false);
    if (mainContentRef.current) {
      const yOffset = -100;
      const y = mainContentRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Component Sidebar - Thêm h-full và overflow-y-auto để cuộn được trên mobile
  const SidebarContent = () => (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pb-20 scrollbar-hide lg:pb-0">
      <div className="flex items-center justify-between pb-4 border-b sticky top-0 bg-white z-10 lg:static">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-600" />
          <h2 className="font-bold text-gray-800 uppercase text-sm tracking-wide">Bộ lọc tìm kiếm</h2>
        </div>
        <button onClick={() => setIsMobileFilterOpen(false)} className="lg:hidden p-1 text-gray-500 hover:text-red-500">
          <X size={20} />
        </button>
      </div>

      <div className="border-b pb-4">
        <button onClick={() => setOpenFilters({ ...openFilters, category: !openFilters.category })} className="flex justify-between items-center w-full py-2 font-bold text-[13px] uppercase text-gray-700 hover:text-green-700 transition-colors">
          Loại sản phẩm {openFilters.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openFilters.category && (
          <div className="mt-3 space-y-2.5 pr-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer" />
                <span className="text-sm text-gray-600 group-hover:text-green-700 transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-b pb-4">
        <button onClick={() => setOpenFilters({ ...openFilters, brand: !openFilters.brand })} className="flex justify-between items-center w-full py-2 font-bold text-[13px] uppercase text-gray-700 hover:text-green-700 transition-colors">
          Thương hiệu {openFilters.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openFilters.brand && (
          <div className="mt-3 space-y-2.5 pr-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer" />
                <span className="text-sm text-gray-600 group-hover:text-green-700 transition-colors">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-b pb-4">
        <button onClick={() => setOpenFilters({ ...openFilters, origin: !openFilters.origin })} className="flex justify-between items-center w-full py-2 font-bold text-[13px] uppercase text-gray-700 hover:text-green-700 transition-colors">
          Xuất xứ {openFilters.origin ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openFilters.origin && (
          <div className="mt-3 space-y-2.5">
            {origins.map((origin) => (
              <label key={origin} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer" />
                <span className="text-sm text-gray-600 group-hover:text-green-700 transition-colors">{origin}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-b pb-4">
        <button onClick={() => setOpenFilters({ ...openFilters, price: !openFilters.price })} className="flex justify-between items-center w-full py-2 font-bold text-[13px] uppercase text-gray-700 hover:text-green-700 transition-colors">
          Mức giá {openFilters.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {openFilters.price && (
          <div className="mt-3 space-y-2.5">
            {priceRanges.map((range) => (
              <label key={range} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer" />
                <span className="text-sm text-gray-600 group-hover:text-green-700 transition-colors">{range}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      <div className="flex flex-col lg:flex-row gap-8 mt-0 mb-4">
        
        {/* SIDEBAR DESKTOP */}
        <aside className="hidden lg:block lg:w-1/4 lg:sticky lg:top-24 h-fit">
          <SidebarContent />
        </aside>

        {/* MOBILE DRAWER FILTER - Đã sửa lỗi cuộn */}
        <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${isMobileFilterOpen ? "visible" : "invisible"}`}>
          <div 
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMobileFilterOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className={`absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white p-6 shadow-2xl transition-transform duration-300 transform ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <SidebarContent />
          </div>
        </div>

        {/* DANH SÁCH SẢN PHẨM */}
        <main ref={mainContentRef} className="w-full lg:w-3/4">
          
          {/* Toolbar tích hợp nút Lọc trên Mobile */}
          <div className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 md:p-4 rounded-xl mb-8 shadow-sm">
            <div className="flex items-center gap-3">
               <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm active:scale-95 transition-transform"
               >
                 <Filter size={14} className="text-green-700" /> Lọc
               </button>
               <p className="hidden md:block text-sm text-gray-500">
                Hiển thị <span className="text-black font-bold">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, allProducts.length)}</span> sản phẩm
              </p>
            </div>

            <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-gray-400">
               <span className="text-green-700 border-b-2 border-green-700 pb-0.5 whitespace-nowrap">Mới nhất</span>
               <span className="cursor-pointer hover:text-green-700 transition-colors whitespace-nowrap">Giá tăng dần</span>
               <span className="cursor-pointer hover:text-green-700 transition-colors whitespace-nowrap">Giá giảm dần</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10">
            {currentProducts.map((p) => (
              <div key={p._id}>
                  <ProductCard products={[p]} />
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center items-center gap-1 sm:gap-2">
            <button onClick={() => goToPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronLeft size={18} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => goToPage(page)} className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${currentPage === page ? "bg-green-700 text-white shadow-lg" : "text-gray-400 hover:bg-gray-50"}`}>{page}</button>
            ))}
            <button onClick={() => goToPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all"><ChevronRight size={18} /></button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainCollectionPage;