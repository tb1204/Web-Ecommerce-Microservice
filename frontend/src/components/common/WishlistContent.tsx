/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import type { Product } from "../Products/InterfaceItem";

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
  
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const addToWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      const isExist = prev.find((item) => item._id === product._id);
      let newList;
      if (isExist) {
        newList = prev.filter((item) => item._id !== product._id); // Toggle: Bỏ thích nếu nhấn lại
      } else {
        newList = [...prev, product];
      }
      localStorage.setItem("wishlist", JSON.stringify(newList));
      return newList;
    });
  };

  const isInWishlist = (productId: string) => wishlistItems.some((item) => item._id === productId);

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};