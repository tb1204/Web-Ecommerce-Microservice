import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { CartItem } from "./cartSlice";

// ==================== TYPES ====================
export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  ward: string;
  addressDetail: string;
  note: string;
}

export interface VoucherInfo {
  code: string;
  discountType: "FIXED_AMOUNT" | "PERCENTAGE";
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
}

export interface CheckoutState {
  // Thông tin giao hàng (form)
  shippingInfo: ShippingInfo;
  // Phương thức thanh toán
  paymentMethod: "VNPAY" | "CASH" | "MOMO" | "";
  // Voucher đã áp dụng
  appliedVoucher: VoucherInfo | null;
  voucherLoading: boolean;
  voucherError: string | null;
  // Tạo đơn / tạo link thanh toán
  checkoutLoading: boolean;
  checkoutError: string | null;
  // URL redirect VNPAY (nếu dùng VNPAY)
  paymentUrl: string | null;
}

const BASE_URL = import.meta.env.VITE_API_URL;

// ==================== ASYNC THUNKS ====================

// Kiểm tra & áp dụng voucher
export const applyVoucher = createAsyncThunk(
  "checkout/applyVoucher",
  async (
    { code, orderAmount, token }: { code: string; orderAmount: number; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/vouchers/apply`,
        { code, orderAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data as VoucherInfo;
    } catch (err: unknown) {
      if (axios.isAxiosError(err))
        return rejectWithValue(err.response?.data?.message || "Mã voucher không hợp lệ");
      return rejectWithValue("Mã voucher không hợp lệ");
    }
  }
);

// Tạo link thanh toán VNPAY
export const createVNPayPayment = createAsyncThunk(
  "checkout/createVNPay",
  async (
    {
      items,
      shippingInfo,
      totalAmount,
      voucherCode,
      token,
    }: {
      items: CartItem[];
      shippingInfo: ShippingInfo;
      totalAmount: number;
      voucherCode?: string;
      token: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/payment/vnpay/create`,
        { items, shippingInfo, totalAmount, voucherCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.paymentUrl as string;
    } catch (err: unknown) {
      if (axios.isAxiosError(err))
        return rejectWithValue(err.response?.data?.message || "Lỗi tạo thanh toán VNPAY");
      return rejectWithValue("Lỗi tạo thanh toán VNPAY");
    }
  }
);

// ==================== INITIAL STATE ====================
const initialState: CheckoutState = {
  shippingInfo: {
    fullName: "",
    phone: "",
    email: "",
    province: "",
    ward: "",
    addressDetail: "",
    note: "",
  },
  paymentMethod: "",
  appliedVoucher: null,
  voucherLoading: false,
  voucherError: null,
  checkoutLoading: false,
  checkoutError: null,
  paymentUrl: null,
};

// ==================== SLICE ====================
const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    // Cập nhật form thông tin giao hàng
    setShippingInfo(state, action: PayloadAction<Partial<ShippingInfo>>) {
      state.shippingInfo = { ...state.shippingInfo, ...action.payload };
    },

    // Chọn phương thức thanh toán
    setPaymentMethod(state, action: PayloadAction<"VNPAY" | "CASH" | "MOMO">) {
      state.paymentMethod = action.payload;
    },

    // Xóa voucher đang áp dụng
    removeVoucher(state) {
      state.appliedVoucher = null;
      state.voucherError = null;
    },

    // Reset toàn bộ checkout (sau khi đặt hàng thành công)
    resetCheckout(state) {
      state.shippingInfo = initialState.shippingInfo;
      state.paymentMethod = "";
      state.appliedVoucher = null;
      state.voucherError = null;
      state.checkoutError = null;
      state.paymentUrl = null;
    },

    clearCheckoutError(state) {
      state.checkoutError = null;
    },
  },
  extraReducers: (builder) => {
    // applyVoucher
    builder
      .addCase(applyVoucher.pending, (state) => {
        state.voucherLoading = true;
        state.voucherError = null;
      })
      .addCase(applyVoucher.fulfilled, (state, action) => {
        state.voucherLoading = false;
        state.appliedVoucher = action.payload;
      })
      .addCase(applyVoucher.rejected, (state, action) => {
        state.voucherLoading = false;
        state.voucherError = action.payload as string;
        state.appliedVoucher = null;
      });

    // createVNPayPayment
    builder
      .addCase(createVNPayPayment.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
      })
      .addCase(createVNPayPayment.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.paymentUrl = action.payload;
      })
      .addCase(createVNPayPayment.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError = action.payload as string;
      });
  },
});

export const {
  setShippingInfo,
  setPaymentMethod,
  removeVoucher,
  resetCheckout,
  clearCheckoutError,
} = checkoutSlice.actions;

// ==================== SELECTORS ====================
export const selectShippingInfo = (state: { checkout: CheckoutState }) =>
  state.checkout.shippingInfo;
export const selectPaymentMethod = (state: { checkout: CheckoutState }) =>
  state.checkout.paymentMethod;
export const selectAppliedVoucher = (state: { checkout: CheckoutState }) =>
  state.checkout.appliedVoucher;
export const selectVoucherLoading = (state: { checkout: CheckoutState }) =>
  state.checkout.voucherLoading;
export const selectVoucherError = (state: { checkout: CheckoutState }) =>
  state.checkout.voucherError;
export const selectCheckoutLoading = (state: { checkout: CheckoutState }) =>
  state.checkout.checkoutLoading;
export const selectPaymentUrl = (state: { checkout: CheckoutState }) =>
  state.checkout.paymentUrl;

// Tính số tiền giảm từ voucher
export const selectDiscountAmount =
  (subtotal: number) => (state: { checkout: CheckoutState }) => {
    const v = state.checkout.appliedVoucher;
    if (!v) return 0;
    if (v.discountType === "FIXED_AMOUNT") return Math.min(v.discountValue, subtotal);
    const percent = (subtotal * v.discountValue) / 100;
    return Math.min(percent, v.maxDiscountAmount || percent);
  };

export default checkoutSlice.reducer;
