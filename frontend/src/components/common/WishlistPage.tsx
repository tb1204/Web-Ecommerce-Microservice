import React from "react";
import { useWishlist } from "./WishlistContent"; 
import { Link } from "react-router-dom";
import { HeartOff } from "lucide-react";
import ProductGrid from "../Products/ProductGrid"; 

const WishlistPage: React.FC = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-[60vh]">
      {/* Tiêu đề trang */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-tight">Sản phẩm yêu thích</h1>
        <div className="w-24 h-0.5 bg-green-700 mx-auto mt-2"></div>
      </div>

      {wishlistItems.length === 0 ? (
        /* Giao diện khi trống */
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <HeartOff size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-6 font-medium">Danh sách yêu thích của bạn đang trống.</p>
          <Link
            to="/collections/all"
            className="bg-green-800 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-md inline-block"
          >
            TIẾP TỤC MUA SẮM
          </Link>
        </div>
      ) : (
        
        <div className="animate-in fade-in duration-500">
          <ProductGrid products={wishlistItems} />
        </div>
      )}
    </div>
  );
};

export default WishlistPage;