import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../components/Products/InterfaceItem";

// ==================== TYPES ====================
export interface WishlistState {
  items: Product[];
}

// ==================== HELPERS ====================
// Persist vào localStorage để giữ dữ liệu khi reload
const WISHLIST_KEY = "wishlist";

const loadFromStorage = (): Product[] => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items: Product[]) => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

// ==================== INITIAL STATE ====================
const initialState: WishlistState = {
  items: loadFromStorage(),
};

// ==================== SLICE ====================
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Toggle thích / bỏ thích sản phẩm
    toggleWishlist(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const idx = state.items.findIndex((item) => item._id === product._id);
      if (idx >= 0) {
        // Đã có → bỏ thích
        state.items.splice(idx, 1);
      } else {
        // Chưa có → thêm vào
        state.items.push(product);
      }
      saveToStorage(state.items);
    },

    // Thêm vào wishlist (không toggle, chỉ thêm nếu chưa có)
    addToWishlist(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const exists = state.items.some((item) => item._id === product._id);
      if (!exists) {
        state.items.push(product);
        saveToStorage(state.items);
      }
    },

    // Xóa khỏi wishlist
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item._id !== action.payload);
      saveToStorage(state.items);
    },

    // Xóa toàn bộ wishlist
    clearWishlist(state) {
      state.items = [];
      saveToStorage(state.items);
    },
  },
});

export const {
  toggleWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

// ==================== SELECTORS ====================
export const selectWishlistItems = (state: { wishlist: WishlistState }) =>
  state.wishlist.items;

export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.items.length;

// Kiểm tra một sản phẩm có trong wishlist không
export const selectIsInWishlist =
  (productId: string) => (state: { wishlist: WishlistState }) =>
    state.wishlist.items.some((item) => item._id === productId);

export default wishlistSlice.reducer;
