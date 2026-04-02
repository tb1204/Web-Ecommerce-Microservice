import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ==================== TYPES ====================
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface ReviewState {
  reviews: Review[]; // Reviews cho trang admin
  productReviews: Review[]; // Reviews cho 1 sản phẩm cụ thể
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filterStatus: string;
  currentPage: number;
  itemsPerPage: number;
}

// ==================== INITIAL STATE ====================
const initialState: ReviewState = {
  reviews: [],
  productReviews: [],
  loading: false,
  error: null,
  searchTerm: "",
  filterStatus: "all",
  currentPage: 1,
  itemsPerPage: 6,
};
const BASE_URL = "http://localhost:8088";
// ==================== ASYNC THUNKS ====================

/** Lấy tất cả review (Admin) */
export const fetchAllReviews = createAsyncThunk(
  "review/fetchAll",
  async (token: string | null, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${BASE_URL}/api/reviews/all`, {
        headers,
      });
      return res.data as Review[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải danh sách đánh giá",
      );
    }
  },
);

/** Lấy review theo productId */
export const fetchReviewsByProduct = createAsyncThunk(
  "review/fetchByProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/reviews/product/${productId}`,
      );
      return res.data as Review[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải đánh giá sản phẩm",
      );
    }
  },
);

/** Gửi đánh giá mới */
export const submitReview = createAsyncThunk(
  "review/submit",
  async (
    {
      token,
      reviewData,
    }: {
      token: string | null;
      reviewData: { productId: string; rating: number; comment: string };
    },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(
        `${BASE_URL}/api/reviews/create`,
        reviewData,
        { headers },
      );
      return res.data as Review;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Gửi đánh giá thất bại",
      );
    }
  },
);

/** Admin duyệt/từ chối review */
export const updateReviewStatus = createAsyncThunk(
  "review/updateStatus",
  async (
    {
      token,
      reviewId,
      status,
    }: {
      token: string | null;
      reviewId: string;
      status: "APPROVED" | "REJECTED";
    },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.patch(
        `${BASE_URL}/api/reviews/${reviewId}/status`,
        { status },
        { headers },
      );
      return res.data as Review;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Cập nhật trạng thái đánh giá thất bại",
      );
    }
  },
);

/** Admin xóa review */
export const deleteReview = createAsyncThunk(
  "review/delete",
  async (
    { token, reviewId }: { token: string | null; reviewId: string },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${BASE_URL}/api/reviews/${reviewId}`, {
        headers,
      });
      return reviewId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Xóa đánh giá thất bại",
      );
    }
  },
);

// ==================== SLICE ====================
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    setReviewSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setReviewFilterStatus(state, action) {
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
    // fetchAllReviews
    builder
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchReviewsByProduct
    builder
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews = action.payload;
      })
      .addCase(fetchReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // submitReview
    builder
      .addCase(submitReview.fulfilled, (state, action) => {
        state.productReviews.unshift(action.payload);
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // updateReviewStatus (Admin)
    builder
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.reviews.findIndex((r) => r.id === updated.id);
        if (idx !== -1) state.reviews[idx] = updated;
      })
      .addCase(updateReviewStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // deleteReview
    builder
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r.id !== action.payload);
        state.productReviews = state.productReviews.filter(
          (r) => r.id !== action.payload,
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setReviewSearchTerm,
  setReviewFilterStatus,
  setCurrentPage,
  clearError,
} = reviewSlice.actions;

export default reviewSlice.reducer;
