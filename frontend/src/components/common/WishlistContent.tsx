import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import type { Product } from "../Products/InterfaceItem";

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

const BASE_URL = "http://localhost:8081";

// Normalize _id từ backend → id chuẩn string
const normalizeId = (raw: any): string =>
  raw?._id?.$oid ?? raw?._id ?? raw?.id ?? "";

// Map product backend → Product interface frontend
const mapWishlistProduct = (p: any): Product => {
  const discountVariant = p.variants?.find(
    (v: any) => v.originalPrice && v.originalPrice > v.price,
  );
  return {
    id: normalizeId(p),
    name: p.name ?? "",
    brand: p.brand,
    origin: p.origin,
    productCode: p.productCode,
    price: p.price ?? 0,
    originalPrice: discountVariant?.originalPrice ?? undefined,
    totalStockQuantity: p.totalStockQuantity ?? 0,
    stockQuantity: p.totalStockQuantity ?? 0,
    variants: p.variants ?? [],
    images: (p.images ?? []).map((img: any) => ({
      url: img.url,
      isPrimary: img.isPrimary ?? img.is_primary ?? false,
    })),
    status:
      p.status === "AVAILABLE"
        ? "selling"
        : p.status === "OUT_OF_STOCK"
          ? "stopselling"
          : (p.status ?? "selling"),
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    category: p.category
      ? {
          name: p.category.name,
          code: p.category.code,
          parentName: p.category.parentName ?? null,
          parentCode: p.category.parentCode ?? null,
        }
      : undefined,
    tags: p.tags ?? [],
    description: p.description ?? "",
  };
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { getToken, isSignedIn } = useAuth();

  const getAuthHeader = async () => {
    const token = await getToken({ template: "my-backend" });
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchWishlist = async () => {
    if (!isSignedIn) return;
    setLoading(true);
    try {
      const token = await getToken({ template: "my-backend" });
      if (!token) return;
      const res = await axios.get(`${BASE_URL}/api/users/me/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = Array.isArray(res.data)
        ? res.data.map(mapWishlistProduct)
        : [];
      setWishlistItems(items);
    } catch (err) {
      console.error("Lỗi lấy wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: Product) => {
    if (!isSignedIn) {
      toast.error("Vui lòng đăng nhập để thêm yêu thích!");
      return;
    }
    try {
      const headers = await getAuthHeader();
      const productId = product.id;
      const isCurrentlyInWishlist = wishlistItems.some(
        (item) => item.id === productId,
      );

      if (isCurrentlyInWishlist) {
        await axios.delete(`${BASE_URL}/api/users/me/wishlist/${productId}`, {
          headers,
        });
        toast.success("Đã xóa khỏi yêu thích");
      } else {
        await axios.post(
          `${BASE_URL}/api/users/me/wishlist/${productId}`,
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

  const isInWishlist = (productId: string): boolean =>
    wishlistItems.some((item) => item.id === productId);

  useEffect(() => {
    if (isSignedIn) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
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

export default WishlistProvider;
