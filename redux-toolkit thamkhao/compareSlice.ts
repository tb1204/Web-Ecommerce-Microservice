import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../components/Products/InterfaceItem";

// ==================== TYPES ====================
export interface CompareState {
  items: Product[];
  maxItems: number; // Giới hạn theo thiết bị (set từ component)
}

// ==================== INITIAL STATE ====================
const initialState: CompareState = {
  items: [],
  maxItems: 4, // Mặc định máy tính (component sẽ dispatch setMaxItems khi resize)
};

// ==================== SLICE ====================
const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    // Cập nhật giới hạn theo kích thước màn hình
    setMaxItems(state, action: PayloadAction<number>) {
      state.maxItems = action.payload;
    },

    // Thêm sản phẩm vào danh sách so sánh
    // Trả về lỗi dạng string để UI hiển thị toast (dùng selector)
    addToCompare(
      state,
      action: PayloadAction<{
        product: Product;
        onError?: (msg: string) => void; // callback (không lưu trong state)
      }>
    ) {
      const { product } = action.payload;

      // 1. Kiểm tra cùng loại danh mục
      if (
        state.items.length > 0 &&
        state.items[0].category?.code !== product.category?.code
      ) {
        state.compareError = `Chỉ có thể so sánh sản phẩm cùng loại (${state.items[0].category?.name})`;
        return;
      }

      // 2. Kiểm tra trùng lặp
      if (state.items.find((p) => p._id === product._id)) {
        state.compareError = "Sản phẩm này đã có trong danh sách so sánh";
        return;
      }

      // 3. Kiểm tra giới hạn
      if (state.items.length >= state.maxItems) {
        state.compareError = `Chỉ có thể so sánh tối đa ${state.maxItems} sản phẩm`;
        return;
      }

      state.items.push(product);
      state.compareError = null;
    },

    // Xóa 1 sản phẩm khỏi danh sách so sánh
    removeFromCompare(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p) => p._id !== action.payload);
    },

    // Xóa toàn bộ danh sách so sánh
    clearCompare(state) {
      state.items = [];
      state.compareError = null;
    },

    // Xóa thông báo lỗi (sau khi đã hiển thị toast)
    clearCompareError(state) {
      state.compareError = null;
    },
  },
});

// Thêm compareError vào type (Immer cho phép mở rộng trong reducer)
declare module "./compareSlice" {
  interface CompareState {
    compareError: string | null;
  }
}

// Gán giá trị mặc định cho compareError
initialState.compareError = null;

export const {
  setMaxItems,
  addToCompare,
  removeFromCompare,
  clearCompare,
  clearCompareError,
} = compareSlice.actions;

// ==================== SELECTORS ====================
export const selectCompareItems = (state: { compare: CompareState }) =>
  state.compare.items;

export const selectCompareCount = (state: { compare: CompareState }) =>
  state.compare.items.length;

export const selectMaxItems = (state: { compare: CompareState }) =>
  state.compare.maxItems;

export const selectCompareError = (state: { compare: CompareState }) =>
  state.compare.compareError;

// Kiểm tra sản phẩm đã có trong danh sách so sánh chưa
export const selectIsInCompare =
  (productId: string) => (state: { compare: CompareState }) =>
    state.compare.items.some((p) => p._id === productId);

export default compareSlice.reducer;
