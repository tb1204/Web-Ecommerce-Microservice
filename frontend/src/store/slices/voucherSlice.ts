import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Voucher } from "../../components/Products/InterfaceItem";

// ==================== TYPES ====================
interface VoucherState {
  vouchers: Voucher[];
  appliedVoucher: Voucher | null; // Voucher đang áp dụng ở checkout
  discountAmount: number; // Số tiền được giảm
  loading: boolean;
  applyLoading: boolean; // Loading riêng cho việc apply voucher
  error: string | null;
  applyError: string | null;
  // Bộ lọc cho admin
  searchTerm: string;
  selectedType: string;
  currentPage: number;
  itemsPerPage: number;
  // Thống kê dashboard
  voucherStats: {
    total: number;
    active: number;
    expired: number;
    disabled: number;
    totalUsed: number;
  } | null;
}

// ==================== INITIAL STATE ====================
const initialState: VoucherState = {
  vouchers: [],
  appliedVoucher: null,
  discountAmount: 0,
  loading: false,
  applyLoading: false,
  error: null,
  applyError: null,
  searchTerm: "",
  selectedType: "all",
  currentPage: 1,
  itemsPerPage: 5,
  // === THÊM DÒNG NÀY ===
  voucherStats: null,
};
const BASE_URL = "http://localhost:8089";
// ==================== ASYNC THUNKS ====================

/** Lấy toàn bộ voucher từ voucher-service (Admin) */
export const fetchAllVouchers = createAsyncThunk(
  "voucher/fetchAll",
  async (token: string | null, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${BASE_URL}/api/admin/vouchers`, {
        headers,
      });
      return res.data as Voucher[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải danh sách voucher",
      );
    }
  },
);

/** Lấy thống kê voucher cho dashboard admin */
export const fetchVoucherStats = createAsyncThunk(
  "voucher/fetchStats",
  async (token: string | null, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${BASE_URL}/api/admin/vouchers/stats`, {
        headers,
      });
      return res.data as {
        total: number;
        active: number;
        expired: number;
        disabled: number;
        totalUsed: number;
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải thống kê voucher",
      );
    }
  },
);

/** Áp dụng voucher theo mã code - kiểm tra hợp lệ và tính giảm giá */
export const applyVoucherByCode = createAsyncThunk(
  "voucher/apply",
  async (
    {
      token,
      code,
      orderAmount,
    }: { token: string | null; code: string; orderAmount: number },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(
        `${BASE_URL}/api/vouchers/apply`,
        { code, orderAmount },
        { headers },
      );
      // Backend trả về { voucher, discountAmount }
      return res.data as { voucher: Voucher; discountAmount: number };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Mã voucher không hợp lệ hoặc đã hết hạn",
      );
    }
  },
);

/** Thêm voucher mới (Admin) */
export const createVoucher = createAsyncThunk(
  "voucher/create",
  async (
    {
      token,
      voucherData,
    }: { token: string | null; voucherData: Partial<Voucher> },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(
        `${BASE_URL}/api/admin/vouchers`,
        voucherData,
        { headers },
      );
      return res.data as Voucher;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Tạo voucher thất bại",
      );
    }
  },
);

/** Cập nhật voucher (Admin) */
export const updateVoucher = createAsyncThunk(
  "voucher/update",
  async (
    {
      token,
      id,
      voucherData,
    }: { token: string | null; id: string; voucherData: Partial<Voucher> },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.put(
        `${BASE_URL}/api/admin/vouchers/${id}`,
        voucherData,
        { headers },
      );
      return res.data as Voucher;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Cập nhật voucher thất bại",
      );
    }
  },
);

/** Xóa voucher (Admin) */
export const deleteVoucher = createAsyncThunk(
  "voucher/delete",
  async (
    { token, id }: { token: string | null; id: string },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${BASE_URL}/api/admin/vouchers/${id}`, {
        headers,
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Xóa voucher thất bại",
      );
    }
  },
);
export const toggleVoucherStatus = createAsyncThunk(
  "voucher/toggleStatus",
  async (
    { token, id }: { token: string | null; id: string },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.patch(
        `${BASE_URL}/api/admin/vouchers/${id}/toggle-status`,
        {},
        { headers },
      );
      return res.data as Voucher;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Thao tác thất bại",
      );
    }
  },
);

// ==================== SLICE ====================
const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    /** Hủy áp dụng voucher */
    removeAppliedVoucher(state) {
      state.appliedVoucher = null;
      state.discountAmount = 0;
      state.applyError = null;
    },

    setVoucherSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSelectedType(state, action) {
      state.selectedType = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },

    /** Thêm voucher tạm thời vào danh sách (dùng sau khi add thành công) */
    addVoucherToList(state, action: { payload: Voucher }) {
      state.vouchers.unshift(action.payload);
    },

    clearError(state) {
      state.error = null;
      state.applyError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAllVouchers
    builder
      .addCase(fetchAllVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVouchers.fulfilled, (state, action) => {
        state.loading = false;
        console.log("✅ Danh sách vouchers từ server:", action.payload);
        state.vouchers = action.payload;
      })
      .addCase(fetchAllVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // applyVoucherByCode
    builder
      .addCase(applyVoucherByCode.pending, (state) => {
        state.applyLoading = true;
        state.applyError = null;
      })
      .addCase(applyVoucherByCode.fulfilled, (state, action) => {
        state.applyLoading = false;
        state.appliedVoucher = action.payload.voucher;
        state.discountAmount = action.payload.discountAmount;
      })
      .addCase(applyVoucherByCode.rejected, (state, action) => {
        state.applyLoading = false;
        state.applyError = action.payload as string;
        state.appliedVoucher = null;
        state.discountAmount = 0;
      });

    // createVoucher
    builder
      .addCase(createVoucher.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVoucher.fulfilled, (state, action) => {
        state.loading = false;
        console.log("✅ Backend trả về sau create:", action.payload); // kiểm tra cấu trúc
        state.vouchers.unshift(action.payload);
      })
      .addCase(createVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateVoucher
    builder
      .addCase(updateVoucher.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.vouchers.findIndex((v) => v._id === updated._id);
        if (idx !== -1) state.vouchers[idx] = updated;
      })
      .addCase(updateVoucher.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // fetchVoucherStats
    builder
      .addCase(fetchVoucherStats.pending, () => {
        // Có thể thêm loading riêng nếu muốn, hiện tại dùng chung loading cũng được
      })
      .addCase(fetchVoucherStats.fulfilled, (state, action) => {
        state.voucherStats = action.payload;
      })
      .addCase(fetchVoucherStats.rejected, (state) => {
        state.voucherStats = null;
      });

    // deleteVoucher
    builder
      .addCase(deleteVoucher.fulfilled, (state, action) => {
        state.vouchers = state.vouchers.filter((v) => v._id !== action.payload);
      })
      .addCase(deleteVoucher.rejected, (state, action) => {
        state.error = action.payload as string;
      });
    builder
      .addCase(toggleVoucherStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.vouchers.findIndex((v) => v._id === updated._id);
        if (idx !== -1) state.vouchers[idx] = updated;
      })
      .addCase(toggleVoucherStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  removeAppliedVoucher,
  // fetchVoucherStats,
  setVoucherSearchTerm,
  setSelectedType,
  setCurrentPage,
  addVoucherToList,
  clearError,
} = voucherSlice.actions;

export default voucherSlice.reducer;
