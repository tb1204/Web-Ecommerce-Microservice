/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

import type { Product } from "../../types/Products";
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
  const { getToken, isSignedIn } = useAuth();
  const BASE_URL = "http://localhost:8081";
  const getAuthHeader = async () => {
    const token = await getToken({ template: "my-backend" });
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // const fetchWishlist = async () => {
  //   setLoading(true);
  //   try {
  //     const headers = await getAuthHeader();
  //     const res = await axios.get(`${BASE_URL}/api/users/me/wishlist`, {
  //       headers,
  //     });
  //     setWishlistItems(res.data as Product[]);
  //   } catch (err) {
  //     console.error("Lỗi lấy wishlist:", err);
  //     toast.error("Không thể tải danh sách yêu thích");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // Sửa fetchWishlist:
  const fetchWishlist = async () => {
    if (!isSignedIn) return; // ← thêm guard
    setLoading(true);
    try {
      const token = await getToken({ template: "my-backend" });
      if (!token) return; // ← thêm guard
      const res = await axios.get(`${BASE_URL}/api/users/me/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi lấy wishlist:", err);
    } finally {
      setLoading(false);
    }
  };
  const addToWishlist = async (product: Product) => {
    try {
      const headers = await getAuthHeader();
      const isCurrentlyInWishlist = wishlistItems.some(
        (item) => item.id === product.id,
      );

      if (isCurrentlyInWishlist) {
        await axios.delete(`${BASE_URL}/api/users/me/wishlist/${product.id}`, {
          headers,
        });
        toast.success("Đã xóa khỏi yêu thích");
      } else {
        await axios.post(
          `${BASE_URL}/api/users/me/wishlist/${product.id}`,
          {},
          { headers },
        );
        toast.success("Đã thêm vào yêu thích ❤️");
      }

      await fetchWishlist();
    } catch (err) {
      console.error(err);
      toast.error("Thao tác thất bại, vui lòng thử lại");
    }
  };

  // const isInWishlist = (productId: string): boolean =>
  //   wishlistItems.some((item) => item.id === productId);
  const isInWishlist = (productId: string): boolean =>
    wishlistItems.some(
      (item) => item.id === productId || (item as any)._id === productId,
    );
  useEffect(() => {
    if (isSignedIn) {
      fetchWishlist();
    } else {
      setWishlistItems([]); // reset khi logout
    }
  }, [isSignedIn]);

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
