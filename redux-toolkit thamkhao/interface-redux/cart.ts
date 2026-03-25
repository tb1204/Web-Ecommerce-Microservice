// ============================================================
// cartSlice.ts
// Quản lý UI state của giỏ hàng:
//   - selectedVariantIds: items đang được chọn để checkout
// Data thực (items, summary) lấy từ RTK Query cache (getCart)
// ============================================================
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface CartUIState {
  selectedVariantIds: string[]; // variantId của items được chọn
}

const initialState: CartUIState = {
  selectedVariantIds: [],
};

const cartSlice = createSlice({
  name: "cartUI",
  initialState,
  reducers: {
    /** Toggle chọn / bỏ chọn 1 item */
    toggleSelectItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.selectedVariantIds.indexOf(id);
      if (idx >= 0) {
        state.selectedVariantIds.splice(idx, 1);
      } else {
        state.selectedVariantIds.push(id);
      }
    },

    /** Chọn tất cả — truyền vào mảng variantId từ component */
    selectAll(state, action: PayloadAction<string[]>) {
      state.selectedVariantIds = action.payload;
    },

    /** Bỏ chọn tất cả */
    deselectAll(state) {
      state.selectedVariantIds = [];
    },

    /** Xóa khỏi selection sau khi checkout xong */
    removeFromSelection(state, action: PayloadAction<string[]>) {
      state.selectedVariantIds = state.selectedVariantIds.filter(
        (id) => !action.payload.includes(id),
      );
    },
  },
});

export const { toggleSelectItem, selectAll, deselectAll, removeFromSelection } =
  cartSlice.actions;

// ─── Selectors ───────────────────────────────────────────────
export const selectSelectedVariantIds = (state: RootState) =>
  state.cartUI.selectedVariantIds;

export const selectIsItemSelected = (variantId: string) => (state: RootState) =>
  state.cartUI.selectedVariantIds.includes(variantId);

export const selectIsAllSelected =
  (allVariantIds: string[]) => (state: RootState) =>
    allVariantIds.length > 0 &&
    allVariantIds.every((id) => state.cartUI.selectedVariantIds.includes(id));

export default cartSlice.reducer;
