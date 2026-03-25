import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
// import type { Product } from "../Products/InterfaceItem";
import { toast } from "sonner";

// interface WishlistContextType {
//   wishlistItems: Product[];
//   addToWishlist: (product: Product) => Promise<void>;
//   isInWishlist: (productId: string) => boolean;
//   loading: boolean;
//   refetch: () => Promise<void>;
// }
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

  // Hàm lấy token giống hệt AdminUsersPage của bạn
  const getAuthHeader = async () => {
    const token = await getToken({ template: "my-backend" });
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Lấy wishlist từ backend
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const headers = await getAuthHeader();
      const res = await axios.get(
        "http://localhost:8080/api/users/me/wishlist",
        { headers },
      );

      // Hiện tại backend trả về List<String> (chỉ productId)
      // Nếu bạn muốn hiển thị full Product → sau này sửa backend
      console.log("Wishlist IDs:", res.data);

      // Tạm thời để rỗng (bạn sẽ cải tiến sau)
      setWishlistItems(res.data as Product[]);
    } catch (err) {
      console.error("Lỗi lấy wishlist:", err);
      toast.error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  // Thêm / Xóa (toggle)
  const addToWishlist = async (product: Product) => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlyInWishlist = wishlistItems.some(
        (item) => item._id === product._id,
      );

      if (isCurrentlyInWishlist) {
        // Xóa
        await axios.delete(
          `http://localhost:8080/api/users/me/wishlist/${product._id}`,
          { headers },
        );
        toast.success("Đã xóa khỏi yêu thích");
      } else {
        // Thêm
        await axios.post(
          `http://localhost:8080/api/users/me/wishlist/${product._id}`,
          {},
          { headers },
        );
        toast.success("Đã thêm vào yêu thích ❤️");
      }

      // Refresh lại danh sách
      await fetchWishlist();
    } catch (err: any) {
      console.error(err);
      toast.error("Thao tác thất bại, vui lòng thử lại");
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item._id === productId);
  };

  // Load wishlist khi mở app
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
  if (!context)
    throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
