// ============================================================
// wishlistSlice.ts — persist localStorage
// ============================================================
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { Product } from "./types";

interface WishlistState {
  items: Product[];
}

const STORAGE_KEY = "wishlist";

const loadFromStorage = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: loadFromStorage() } as WishlistState,
  reducers: {
    /** Toggle: thêm nếu chưa có, xóa nếu đã có */
    toggleWishlist(state, action: PayloadAction<Product>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
      saveToStorage(state.items);
    },

    clearWishlist(state) {
      state.items = [];
      saveToStorage([]);
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistCount = (state: RootState) =>
  state.wishlist.items.length;
export const selectIsInWishlist = (productId: string) => (state: RootState) =>
  state.wishlist.items.some((i) => i.id === productId);

export default wishlistSlice.reducer;
