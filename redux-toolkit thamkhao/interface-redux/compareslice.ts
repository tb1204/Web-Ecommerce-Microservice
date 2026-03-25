// ============================================================
// compareSlice.ts — so sánh sản phẩm
// ============================================================
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { Product } from "./types";

interface CompareState {
  items: Product[];
  maxItems: number; // cập nhật theo resize từ component
  error: string | null;
}

const compareSlice = createSlice({
  name: "compare",
  initialState: {
    items: [],
    maxItems: 4,
    error: null,
  } as CompareState,
  reducers: {
    /** Cập nhật giới hạn theo breakpoint (dispatch từ useEffect resize) */
    setMaxItems(state, action: PayloadAction<number>) {
      state.maxItems = action.payload;
    },

    addToCompare(state, action: PayloadAction<Product>) {
      const product = action.payload;
      // 1. Cùng danh mục
      if (
        state.items.length > 0 &&
        state.items[0].category?.code !== product.category?.code
      ) {
        state.error = `Chỉ so sánh sản phẩm cùng loại (${state.items[0].category?.name})`;
        return;
      }
      // 2. Trùng lặp
      if (state.items.find((p) => p.id === product.id)) {
        state.error = "Sản phẩm đã có trong danh sách so sánh";
        return;
      }
      // 3. Quá giới hạn
      if (state.items.length >= state.maxItems) {
        state.error = `Chỉ so sánh tối đa ${state.maxItems} sản phẩm`;
        return;
      }
      state.items.push(product);
      state.error = null;
    },

    removeFromCompare(state, action: PayloadAction<string>) {
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
export const selectIsInCompare = (productId: string) => (state: RootState) =>
  state.compare.items.some((p) => p.id === productId);

export default compareSlice.reducer;
