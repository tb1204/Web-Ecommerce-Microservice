import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Product, Order, Voucher } from "../components/Products/InterfaceItem";

// ==================== TYPES ====================
export interface AdminUser {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  imageUrl?: string;
  totalOrders?: number;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  cancelledOrders: number;
  revenueByDay: { date: string; revenue: number }[];
  revenueByWeek: { week: string; revenue: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
}

export interface AdminState {
  // Users
  users: AdminUser[];
  userLoading: boolean;
  userError: string | null;

  // Products (admin view)
  products: Product[];
  productLoading: boolean;
  productError: string | null;

  // Orders (admin view)
  orders: Order[];
  totalOrders: number;
  totalSales: number;
  orderLoading: boolean;
  orderError: string | null;

  // Vouchers
  vouchers: Voucher[];
  voucherLoading: boolean;
  voucherError: string | null;

  // Statistics
  stats: AdminStats | null;
  statsLoading: boolean;
  statsError: string | null;
}

const BASE_URL = import.meta.env.VITE_API_URL;

// ==================== HELPER ====================
// Lấy token Clerk — truyền vào từ component khi dispatch
const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

// ============================================================
// USERS
// ============================================================
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/users`, {
        headers: authHeader(token),
      });
      return res.data as AdminUser[];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi lấy users");
      return rejectWithValue("Lỗi lấy users");
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async (
    { userId, role, token }: { userId: string; role: "admin" | "user"; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/admin/users/${userId}/role`,
        { role },
        { headers: authHeader(token) }
      );
      return res.data as AdminUser;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi cập nhật role");
      return rejectWithValue("Lỗi cập nhật role");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async ({ userId, token }: { userId: string; token: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/users/${userId}`, {
        headers: authHeader(token),
      });
      return userId;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi xóa user");
      return rejectWithValue("Lỗi xóa user");
    }
  }
);

// ============================================================
// PRODUCTS (Admin)
// ============================================================
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/products`, {
        headers: authHeader(token),
      });
      return res.data as Product[];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi lấy sản phẩm");
      return rejectWithValue("Lỗi lấy sản phẩm");
    }
  }
);

export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (
    { productData, token }: { productData: Partial<Product>; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/products`, productData, {
        headers: authHeader(token),
      });
      return res.data as Product;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi tạo sản phẩm");
      return rejectWithValue("Lỗi tạo sản phẩm");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async (
    { id, productData, token }: { id: string; productData: Partial<Product>; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/products/${id}`, productData, {
        headers: authHeader(token),
      });
      return res.data as Product;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi cập nhật sản phẩm");
      return rejectWithValue("Lỗi cập nhật sản phẩm");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`, {
        headers: authHeader(token),
      });
      return id;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi xóa sản phẩm");
      return rejectWithValue("Lỗi xóa sản phẩm");
    }
  }
);

// ============================================================
// ORDERS (Admin)
// ============================================================
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/orders`, {
        headers: authHeader(token),
      });
      return res.data as Order[];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi lấy đơn hàng");
      return rejectWithValue("Lỗi lấy đơn hàng");
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async (
    { orderId, status, token }: { orderId: string; status: Order["orderStatus"]; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/admin/orders/${orderId}/status`,
        { status },
        { headers: authHeader(token) }
      );
      return res.data as Order;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi cập nhật trạng thái");
      return rejectWithValue("Lỗi cập nhật trạng thái");
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async ({ orderId, token }: { orderId: string; token: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/orders/${orderId}`, {
        headers: authHeader(token),
      });
      return orderId;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi xóa đơn hàng");
      return rejectWithValue("Lỗi xóa đơn hàng");
    }
  }
);

// ============================================================
// VOUCHERS (Admin)
// ============================================================
export const fetchAllVouchers = createAsyncThunk(
  "admin/fetchAllVouchers",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/vouchers`, {
        headers: authHeader(token),
      });
      return res.data as Voucher[];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi lấy vouchers");
      return rejectWithValue("Lỗi lấy vouchers");
    }
  }
);

export const createVoucher = createAsyncThunk(
  "admin/createVoucher",
  async (
    { voucherData, token }: { voucherData: Partial<Voucher>; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/vouchers`, voucherData, {
        headers: authHeader(token),
      });
      return res.data as Voucher;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi tạo voucher");
      return rejectWithValue("Lỗi tạo voucher");
    }
  }
);

export const updateVoucher = createAsyncThunk(
  "admin/updateVoucher",
  async (
    { id, voucherData, token }: { id: string; voucherData: Partial<Voucher>; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/vouchers/${id}`, voucherData, {
        headers: authHeader(token),
      });
      return res.data as Voucher;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi cập nhật voucher");
      return rejectWithValue("Lỗi cập nhật voucher");
    }
  }
);

export const deleteVoucher = createAsyncThunk(
  "admin/deleteVoucher",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/vouchers/${id}`, {
        headers: authHeader(token),
      });
      return id;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi xóa voucher");
      return rejectWithValue("Lỗi xóa voucher");
    }
  }
);

// ============================================================
// STATISTICS
// ============================================================
export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (
    { token, timeFilter = "day" }: { token: string; timeFilter?: "day" | "week" | "month" },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/statistics?timeFilter=${timeFilter}`,
        { headers: authHeader(token) }
      );
      return res.data as AdminStats;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi lấy thống kê");
      return rejectWithValue("Lỗi lấy thống kê");
    }
  }
);

// ==================== INITIAL STATE ====================
const initialState: AdminState = {
  users: [], userLoading: false, userError: null,
  products: [], productLoading: false, productError: null,
  orders: [], totalOrders: 0, totalSales: 0, orderLoading: false, orderError: null,
  vouchers: [], voucherLoading: false, voucherError: null,
  stats: null, statsLoading: false, statsError: null,
};

// ==================== SLICE ====================
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ---- USERS ----
    builder
      .addCase(fetchAllUsers.pending, (state) => { state.userLoading = true; state.userError = null; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.userLoading = false; state.users = action.payload; })
      .addCase(fetchAllUsers.rejected, (state, action) => { state.userLoading = false; state.userError = action.payload as string; })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });

    // ---- PRODUCTS ----
    builder
      .addCase(fetchAdminProducts.pending, (state) => { state.productLoading = true; state.productError = null; })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => { state.productLoading = false; state.products = action.payload; })
      .addCase(fetchAdminProducts.rejected, (state, action) => { state.productLoading = false; state.productError = action.payload as string; })
      .addCase(createProduct.fulfilled, (state, action) => { state.products.unshift(action.payload); })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.products[idx] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });

    // ---- ORDERS ----
    builder
      .addCase(fetchAllOrders.pending, (state) => { state.orderLoading = true; state.orderError = null; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        state.totalSales = action.payload.reduce((sum, o) => sum + o.summary.totalAmount, 0);
      })
      .addCase(fetchAllOrders.rejected, (state, action) => { state.orderLoading = false; state.orderError = action.payload as string; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.orders[idx] = action.payload;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o.id !== action.payload);
        state.totalOrders = state.orders.length;
      });

    // ---- VOUCHERS ----
    builder
      .addCase(fetchAllVouchers.pending, (state) => { state.voucherLoading = true; state.voucherError = null; })
      .addCase(fetchAllVouchers.fulfilled, (state, action) => { state.voucherLoading = false; state.vouchers = action.payload; })
      .addCase(fetchAllVouchers.rejected, (state, action) => { state.voucherLoading = false; state.voucherError = action.payload as string; })
      .addCase(createVoucher.fulfilled, (state, action) => { state.vouchers.unshift(action.payload); })
      .addCase(updateVoucher.fulfilled, (state, action) => {
        const idx = state.vouchers.findIndex((v) => v._id === action.payload._id);
        if (idx !== -1) state.vouchers[idx] = action.payload;
      })
      .addCase(deleteVoucher.fulfilled, (state, action) => {
        state.vouchers = state.vouchers.filter((v) => v._id !== action.payload);
      });

    // ---- STATISTICS ----
    builder
      .addCase(fetchAdminStats.pending, (state) => { state.statsLoading = true; state.statsError = null; })
      .addCase(fetchAdminStats.fulfilled, (state, action) => { state.statsLoading = false; state.stats = action.payload; })
      .addCase(fetchAdminStats.rejected, (state, action) => { state.statsLoading = false; state.statsError = action.payload as string; });
  },
});

// ==================== SELECTORS ====================
export const selectAdminUsers = (state: { admin: AdminState }) => state.admin.users;
export const selectAdminUserLoading = (state: { admin: AdminState }) => state.admin.userLoading;

export const selectAdminProducts = (state: { admin: AdminState }) => state.admin.products;
export const selectAdminProductLoading = (state: { admin: AdminState }) => state.admin.productLoading;

export const selectAdminOrders = (state: { admin: AdminState }) => state.admin.orders;
export const selectAdminTotalSales = (state: { admin: AdminState }) => state.admin.totalSales;
export const selectAdminTotalOrders = (state: { admin: AdminState }) => state.admin.totalOrders;
export const selectAdminOrderLoading = (state: { admin: AdminState }) => state.admin.orderLoading;

export const selectAdminVouchers = (state: { admin: AdminState }) => state.admin.vouchers;
export const selectAdminVoucherLoading = (state: { admin: AdminState }) => state.admin.voucherLoading;

export const selectAdminStats = (state: { admin: AdminState }) => state.admin.stats;
export const selectAdminStatsLoading = (state: { admin: AdminState }) => state.admin.statsLoading;

export default adminSlice.reducer;
