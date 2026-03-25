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

const load = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
};

const save = (items: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: load() } as WishlistState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<Product>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
      save(state.items);
    },
    clearWishlist(state) {
      state.items = [];
      save([]);
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

// ============================================================
// compareSlice.ts — so sánh sản phẩm (giới hạn theo màn hình)
// ============================================================
import { createSlice as createSlice2 } from "@reduxjs/toolkit";
import type { PayloadAction as PA2 } from "@reduxjs/toolkit";

interface CompareState {
  items: Product[];
  maxItems: number;
  error: string | null;
}

const compareSlice = createSlice2({
  name: "compare",
  initialState: {
    items: [],
    maxItems: 4,
    error: null,
  } as CompareState,
  reducers: {
    setMaxItems(state, action: PA2<number>) {
      state.maxItems = action.payload;
    },
    addToCompare(state, action: PA2<Product>) {
      const product = action.payload;
      if (
        state.items.length > 0 &&
        state.items[0].category?.code !== product.category?.code
      ) {
        state.error = `Chỉ so sánh sản phẩm cùng loại (${state.items[0].category?.name})`;
        return;
      }
      if (state.items.find((p) => p.id === product.id)) {
        state.error = "Sản phẩm đã có trong danh sách so sánh";
        return;
      }
      if (state.items.length >= state.maxItems) {
        state.error = `Chỉ so sánh tối đa ${state.maxItems} sản phẩm`;
        return;
      }
      state.items.push(product);
      state.error = null;
    },
    removeFromCompare(state, action: PA2<string>) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    clearCompare(state) {
      state.items = [];
      state.error = null;
    },
    clearCompareError(state) {
      state.error = null;
    },
  },
});

export const {
  setMaxItems,
  addToCompare,
  removeFromCompare,
  clearCompare,
  clearCompareError,
} = compareSlice.actions;

export const selectCompareItems = (state: RootState) => state.compare.items;
export const selectCompareCount = (state: RootState) =>
  state.compare.items.length;
export const selectCompareError = (state: RootState) => state.compare.error;
export const selectMaxItems = (state: RootState) => state.compare.maxItems;
export const selectIsInCompare = (id: string) => (state: RootState) =>
  state.compare.items.some((p) => p.id === id);

export const compareReducer = compareSlice.reducer;
export default wishlistSlice.reducer; // re-export wishlist as default (file split below)
