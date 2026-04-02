// import React from "react";
// import { useWishlist } from "../components/common/WishlistContent";
// import { Link } from "react-router-dom";
// import { HeartOff } from "lucide-react";
// import ProductGrid from "../components/Products/ProductGrid";
// // import type { Product } from "../../types/Products";
// const WishlistPage: React.FC = () => {
//   const { wishlistItems, loading } = useWishlist();

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <p className="text-gray-500">Đang tải...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10 min-h-[60vh]">
//       <div className="text-center mb-10">
//         <h1 className="text-3xl font-bold text-gray-800 dark:text-white uppercase tracking-tight">
//           Sản phẩm yêu thích
//         </h1>
//         <div className="w-24 h-0.5 bg-green-700 mx-auto mt-2"></div>
//       </div>

//       {wishlistItems.length === 0 ? (
//         <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
//           <HeartOff size={64} className="mx-auto text-gray-300 mb-4" />
//           <p className="text-gray-500 mb-6 font-medium">
//             Danh sách yêu thích của bạn đang trống.
//           </p>
//           <Link
//             to="/collections/all"
//             className="bg-green-800 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-md inline-block"
//           >
//             TIẾP TỤC MUA SẮM
//           </Link>
//         </div>
//       ) : (
//         <div className="animate-in fade-in duration-500">
//           <ProductGrid products={wishlistItems} />
//         </div>
//       )}
//     </div>

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  status: string;
  stock_quantity: number;
  rating?: number;
  reviewCount?: number;
  images: { url: string; is_primary: boolean }[];
  category?: { name: string; code: string };
  tags?: string[];
  description?: string;
}

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const BASE_URL = "http://localhost:8081";
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const getAuthHeader = async () => {
    const token = await getToken({ template: "my-backend" });
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Lấy danh sách wishlist từ backend
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeader();
      const res = await axios.get(`${BASE_URL}/api/users/me/wishlist`, {
        headers,
      });

      console.log("Wishlist response:", res.data);

      // Backend hiện đang trả về mảng Product → ép kiểu an toàn
      setWishlistItems(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error("Lỗi lấy wishlist:", err);
      toast.error("Không thể tải danh sách yêu thích");
      setWishlistItems([]); // Tránh lỗi undefined khi render
    } finally {
      setLoading(false);
    }
  };

  // Thêm / Xóa khỏi wishlist (toggle)
  const addToWishlist = async (product: Product) => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlyInWishlist = wishlistItems.some(
        (item) => item._id === product._id,
      );

      if (isCurrentlyInWishlist) {
        await axios.delete(`${BASE_URL}/api/users/me/wishlist/${product._id}`, {
          headers,
        });
        toast.success("Đã xóa khỏi yêu thích");
      } else {
        await axios.post(
          `${BASE_URL}/api/users/me/wishlist/${product._id}`,
          {},
          { headers },
        );
        toast.success("Đã thêm vào yêu thích ❤️");
      }

      // Refresh lại danh sách sau khi thêm/xóa
      await fetchWishlist();
    } catch (err: any) {
      console.error("Wishlist error:", err);
      toast.error("Thao tác thất bại, vui lòng thử lại");
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item._id === productId);
  };

  // Tự động load wishlist khi component mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        isInWishlist,
        loading,
        refetch: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

// ==================== EXPORT DEFAULT Ở CUỐI FILE ====================
export default WishlistProvider;
