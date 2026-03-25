import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Order } from "../components/Products/InterfaceItem";
import { useAuth } from "@clerk/clerk-react";

// ==================== TYPES ====================
// Dữ liệu gửi lên khi tạo đơn hàng mới
export interface CreateOrderPayload {
  items: {
    productId: string;
    variantId?: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
    thickness?: string;
    color?: string;
    type: "nem_phukien" | "boga";
  }[];
  shippingAddress: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  paymentMethod: "VNPAY" | "CASH" | "MOMO";
  voucherCode?: string;
  note?: string;
}

export interface OrderState {
  orders: Order[];
  orderDetails: Order | null;
  loading: boolean;
  error: string | null;
}

const BASE_URL = import.meta.env.VITE_API_URL;

// ==================== ASYNC THUNKS ====================

// Lấy danh sách đơn hàng của user đang đăng nhập
// token là Clerk session token — lấy từ useAuth().getToken() rồi truyền vào
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as Order[];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi lấy đơn hàng");
      return rejectWithValue("Lỗi lấy đơn hàng");
    }
  }
);

// Lấy chi tiết 1 đơn hàng theo ID
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async ({ orderId, token }: { orderId: string; token: string }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as Order;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi lấy chi tiết đơn hàng");
      return rejectWithValue("Lỗi lấy chi tiết đơn hàng");
    }
  }
);

// Tạo đơn hàng mới
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (
    { payload, token }: { payload: CreateOrderPayload; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/orders`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as Order;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi tạo đơn hàng");
      return rejectWithValue("Lỗi tạo đơn hàng");
    }
  }
);

// Hủy đơn hàng
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (
    { orderId, reason, token }: { orderId: string; reason: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/orders/${orderId}/cancel`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data as Order;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi hủy đơn hàng");
      return rejectWithValue("Lỗi hủy đơn hàng");
    }
  }
);

// ==================== INITIAL STATE ====================
const initialState: OrderState = {
  orders: [],
  orderDetails: null,
  loading: false,
  error: null,
};

// ==================== SLICE ====================
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderDetails(state) {
      state.orderDetails = null;
    },
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchUserOrders
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchOrderDetails
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload); // Thêm đơn mới lên đầu danh sách
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // cancelOrder
    builder
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.orders.findIndex((o) => o.id === updated.id);
        if (idx !== -1) state.orders[idx] = updated;
        if (state.orderDetails?.id === updated.id) state.orderDetails = updated;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearOrderDetails, clearOrderError } = orderSlice.actions;

// ==================== SELECTORS ====================
export const selectUserOrders = (state: { orders: OrderState }) => state.orders.orders;
export const selectOrderDetails = (state: { orders: OrderState }) => state.orders.orderDetails;
export const selectOrderLoading = (state: { orders: OrderState }) => state.orders.loading;
export const selectOrderError = (state: { orders: OrderState }) => state.orders.error;

export default orderSlice.reducer;
