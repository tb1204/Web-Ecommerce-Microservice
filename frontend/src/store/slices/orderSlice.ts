import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Order } from "../../components/Products/InterfaceItem";

// ==================== TYPES ====================
interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  // Bộ lọc cho admin
  searchTerm: string;
  filterStatus: string;
  currentPage: number;
  itemsPerPage: number;
}

// ==================== INITIAL STATE ====================
const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  searchTerm: "",
  filterStatus: "all",
  currentPage: 1,
  itemsPerPage: 5,
};
// const BASE_URL = "http://localhost:8084";
 const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
// ==================== ASYNC THUNKS ====================

/** Lấy toàn bộ đơn hàng (Admin) */
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAll",
  async (token: string | null, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${BASE_URL}/api/orders/all`, {
        headers,
      });
      return res.data as Order[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải danh sách đơn hàng",
      );
    }
  },
);

/** Lấy đơn hàng của user đang đăng nhập */
export const fetchMyOrders = createAsyncThunk(
  "order/fetchMine",
  async (token: string | null, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${BASE_URL}/api/orders/my`, {
        headers,
      });
      return res.data as Order[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải đơn hàng của bạn",
      );
    }
  },
);

/** Lấy chi tiết 1 đơn hàng theo id */
export const fetchOrderById = createAsyncThunk(
  "order/fetchById",
  async (
    { token, orderId }: { token: string | null; orderId: string },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
        headers,
      });
      return res.data as Order;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải chi tiết đơn hàng",
      );
    }
  },
);

/** Cập nhật trạng thái đơn hàng (Admin) */
export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async (
    {
      token,
      orderId,
      status,
      cancelReason,
    }: {
      token: string | null;
      orderId: string;
      status: Order["orderStatus"];
      cancelReason?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.patch(
        `${BASE_URL}/api/orders/${orderId}/status`,
        { status, cancelReason },
        { headers },
      );
      return res.data as Order;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Cập nhật trạng thái thất bại",
      );
    }
  },
);

/** Tạo đơn hàng mới */
export const createOrder = createAsyncThunk(
  "order/create",
  async (
    { token, orderData }: { token: string | null; orderData: any },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${BASE_URL}/api/orders/create`, orderData, {
        headers,
      });
      return res.data as Order;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Tạo đơn hàng thất bại",
      );
    }
  },
);

// ==================== SLICE ====================
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder(state, action) {
      state.selectedOrder = action.payload;
    },
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
    setOrderSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setFilterStatus(state, action) {
      state.filterStatus = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAllOrders
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchMyOrders
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchOrderById
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateOrderStatus
    builder
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.orders.findIndex((o) => o.id === updated.id);
        if (idx !== -1) state.orders[idx] = updated;
        if (state.selectedOrder?.id === updated.id) {
          state.selectedOrder = updated;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.selectedOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedOrder,
  clearSelectedOrder,
  setOrderSearchTerm,
  setFilterStatus,
  setCurrentPage,
  clearError,
} = orderSlice.actions;

export default orderSlice.reducer;
