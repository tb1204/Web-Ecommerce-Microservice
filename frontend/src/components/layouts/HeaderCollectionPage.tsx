import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "../Products/ProductCard";
import type { Product } from "../Products/InterfaceItem";

// Giả sử đây là banner Gummi Signature trong ảnh
import collection_banner_1 from "../../assets/banner/collection_banner_1.webp"; 
import image_nem from "../../assets/about.webp";

const HeaderCollectionPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock data khớp với ảnh của bạn
  const comboProducts: Product[] = [
    { _id: "p1", name: "Topper memory foam nâng đỡ êm ái Comfy Noah", brand: "Comfy", price: 2160000, originalPrice: 2400000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 0, reviewCount: 0, stock_quantity: 10 },
    { _id: "p2", name: "Chiếu điều hòa cao su Doona Aqua làm mát", brand: "Doona", price: 729000, originalPrice: 890000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 0, reviewCount: 0, stock_quantity: 10 },
    { _id: "p3", name: "Bảo vệ nệm Doona Bamboo chống bụi bẩn, thoáng khí", brand: "Doona", price: 800000, originalPrice: 900000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 0, reviewCount: 0, stock_quantity: 10 },
    { _id: "p4", name: "Ga chống thấm Goodnight Sumi mềm mại, kháng...", brand: "Goodnight", price: 239000, originalPrice: 390000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 0, reviewCount: 0, stock_quantity: 10 },
    { _id: "p5", name: "Chăn đông lông thỏ mềm mịn Amando Warm", brand: "Amando", price: 1200000, originalPrice: 1500000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 5, reviewCount: 1, stock_quantity: 10 },
    { _id: "p5", name: "Chăn đông lông thỏ mềm mịn Amando Warm", brand: "Amando", price: 1200000, originalPrice: 1500000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 5, reviewCount: 1, stock_quantity: 10 },
    { _id: "p5", name: "Chăn đông lông thỏ mềm mịn Amando Warm", brand: "Amando", price: 1200000, originalPrice: 1500000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 5, reviewCount: 1, stock_quantity: 10 },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8; 
      scrollRef.current.scrollTo({ 
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount, 
        behavior: "smooth" 
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* 1. Tiêu đề trang */}
      <h1 className="text-xl font-bold text-gray-900 mb-4">Tất cả sản phẩm</h1>

      {/* 2. Banner chính */}
      <div className="w-full rounded-2xl overflow-hidden mb-6 shadow-sm">
        <img src={collection_banner_1} alt="Gummi Signature" className="w-full h-auto object-cover" />
      </div>

      {/* 3. SECTION COMBO GIÁ SỐC (Màu xanh lá đặc trưng) */}
      <div className="bg-[#56a77e] rounded-xl p-4 md:p-6 mb-10 relative group">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-3xl md:text-5xl font-serif font-medium">Combo Giá Sốc</h2>
          <Link to="#" className="flex items-center gap-1 text-white text-sm hover:opacity-80 transition-all">
            Xem tất cả <ChevronRight size={18} className="bg-white/20 rounded-full p-0.5" />
          </Link>
        </div>

        {/* Nút điều hướng tinh tế hơn */}
        <button 
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl text-green-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-green-50 hidden lg:block"
        >
          <ChevronLeft size={28} />
        </button>
        <button 
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-xl text-green-700 opacity-0 group-hover:opacity-100 transition-all hover:bg-green-50 hidden lg:block"
        >
          <ChevronRight size={28} />
        </button>

        {/* Khung cuộn sản phẩm - Layout Card trong combo */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-1 md:gap-1 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {comboProducts.map((product) => (
            <div 
              key={product._id} 
              // Trong ảnh là 5 cột, mỗi card chiếm khoảng 20%
              className="flex-none w-[280px] md:w-[240px] lg:w-[calc(20%-13px)] snap-start"
            >
              <ProductCard products={[product]} isBundleMode={false} />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Section lọc & danh sách bên dưới */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ... Phần Filter của bạn giữ nguyên ... */}
          
          <div className="lg:col-span-3">
             {/* Toolbar hiển thị số lượng */}
             <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-6">
                <span className="text-sm font-medium">Hiển thị {comboProducts.length} sản phẩm</span>
                <select className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer font-semibold">
                  <option>Mới nhất</option>
                  <option>Giá thấp đến cao</option>
                </select>
             </div>

             {/* Danh sách sản phẩm chính */}
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {/* Map products ở đây */}
             </div>
          </div>
      </div>
    </div>
  );
};

export default HeaderCollectionPage;