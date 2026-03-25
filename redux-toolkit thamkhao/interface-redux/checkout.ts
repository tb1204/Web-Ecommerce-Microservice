// ============================================================
// checkoutSlice.ts
// Quản lý toàn bộ flow checkout:
//   - Thông tin giao hàng (form)
//   - Phương thức thanh toán
//   - Voucher
//   - paymentUrl redirect (VNPAY)
// ============================================================
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { PaymentMethod } from "./types";

// ─── Types ───────────────────────────────────────────────────
export interface ShippingForm {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  ward: string;
  addressDetail: string;
  note: string;
}

export interface AppliedVoucher {
  code: string;
  discountType: "FIXED_AMOUNT" | "PERCENTAGE";
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
}

interface CheckoutState {
  shippingForm: ShippingForm;
  paymentMethod: PaymentMethod | "";
  appliedVoucher: AppliedVoucher | null;
  // Items người dùng chọn để checkout (copy từ cartUI.selectedVariantIds)
  checkoutVariantIds: string[];
}

const emptyForm: ShippingForm = {
  fullName: "",
  phone: "",
  email: "",
  province: "",
  ward: "",
  addressDetail: "",
  note: "",
};

const initialState: CheckoutState = {
  shippingForm: emptyForm,
  paymentMethod: "",
  appliedVoucher: null,
  checkoutVariantIds: [],
};

// ─── Slice ───────────────────────────────────────────────────
const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    /** Cập nhật từng field hoặc cả form */
    setShippingForm(state, action: PayloadAction<Partial<ShippingForm>>) {
      state.shippingForm = { ...state.shippingForm, ...action.payload };
    },

    /** Điền sẵn thông tin từ hồ sơ Clerk / DB vào form */
    prefillShippingFromUser(
      state,
      action: PayloadAction<{
        fullName?: string;
        phone?: string;
        email?: string;
      }>,
    ) {
      const { fullName, phone, email } = action.payload;
      if (fullName) state.shippingForm.fullName = fullName;
      if (phone) state.shippingForm.phone = phone;
      if (email) state.shippingForm.email = email;
    },

    setPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.paymentMethod = action.payload;
    },

    /** Lưu voucher đã được server xác nhận hợp lệ */
    applyVoucher(state, action: PayloadAction<AppliedVoucher>) {
      state.appliedVoucher = action.payload;
    },

    removeVoucher(state) {
      state.appliedVoucher = null;
    },

    /** Lưu lại variantId của các items đang checkout */
    setCheckoutVariantIds(state, action: PayloadAction<string[]>) {
      state.checkoutVariantIds = action.payload;
    },

    /** Reset toàn bộ checkout sau khi tạo đơn thành công */
    resetCheckout(state) {
      state.shippingForm = emptyForm;
      state.paymentMethod = "";
      state.appliedVoucher = null;
      state.checkoutVariantIds = [];
    },
  },
});

export const {
  setShippingForm,
  prefillShippingFromUser,
  setPaymentMethod,
  applyVoucher,
  removeVoucher,
  setCheckoutVariantIds,
  resetCheckout,
} = checkoutSlice.actions;

// ─── Selectors ───────────────────────────────────────────────
export const selectShippingForm = (state: RootState) =>
  state.checkout.shippingForm;

export const selectPaymentMethod = (state: RootState) =>
  state.checkout.paymentMethod;

export const selectAppliedVoucher = (state: RootState) =>
  state.checkout.appliedVoucher;

export const selectCheckoutVariantIds = (state: RootState) =>
  state.checkout.checkoutVariantIds;

/** Tính số tiền giảm từ voucher dựa trên subtotal */
export const selectDiscountAmount =
  (subtotal: number) => (state: RootState) => {
    const v = state.checkout.appliedVoucher;
    if (!v) return 0;
    if (v.discountType === "FIXED_AMOUNT")
      return Math.min(v.discountValue, subtotal);
    const pct = (subtotal * v.discountValue) / 100;
    return Math.min(pct, v.maxDiscountAmount || pct);
  };

export default checkoutSlice.reducer;
