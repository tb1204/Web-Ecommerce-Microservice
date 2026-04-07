import React from "react";
import { useWishlist } from "../components/common/WishlistContent";
import { Link } from "react-router-dom";
import { HeartOff } from "lucide-react";
import ProductGrid from "../components/Products/ProductGrid";

const WishlistPage: React.FC = () => {
  const { wishlistItems, loading } = useWishlist();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white uppercase tracking-tight">
            Sản phẩm yêu thích
          </h1>
          <div className="w-24 h-0.5 bg-green-700 mx-auto mt-2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse h-72"
              />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-[60vh]">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white uppercase tracking-tight">
          Sản phẩm yêu thích
        </h1>
        <div className="w-24 h-0.5 bg-green-700 mx-auto mt-2"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          {wishlistItems.length} sản phẩm
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <HeartOff size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">
            Danh sách yêu thích của bạn đang trống.
          </p>
          <Link
            to="/collections/all"
            className="bg-green-800 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-md inline-block"
          >
            TIẾP TỤC MUA SẮM
          </Link>
        </div>
      ) : (
        <ProductGrid products={wishlistItems} />
      )}
    </div>
  );
};

export default WishlistPage;
