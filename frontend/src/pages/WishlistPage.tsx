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
      const res = await axios.get(
        "http://localhost:8081/api/users/me/wishlist",
        { headers },
      );

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
        await axios.delete(
          `http://localhost:8081/api/users/me/wishlist/${product._id}`,
          { headers },
        );
        toast.success("Đã xóa khỏi yêu thích");
      } else {
        await axios.post(
          `http://localhost:8081/api/users/me/wishlist/${product._id}`,
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
