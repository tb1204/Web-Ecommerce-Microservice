import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Product } from "../../types/Products";

// ==================== TYPES ====================
interface UserInfo {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: "user" | "admin";
  phone?: string;
}

interface UserState {
  userInfo: UserInfo | null;
  wishlistItems: Product[];
  loading: boolean;
  wishlistLoading: boolean;
  error: string | null;
}

// ==================== INITIAL STATE ====================
const initialState: UserState = {
  userInfo: null,
  wishlistItems: [],
  loading: false,
  wishlistLoading: false,
  error: null,
};
// const BASE_URL = "http://localhost:8081";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
// ==================== ASYNC THUNKS ====================

/** Lấy thông tin user từ userservice */
export const fetchUserInfo = createAsyncThunk(
  "user/fetchInfo",
  async (token: string | null, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${BASE_URL}/api/users/me`, {
        headers,
      });
      return res.data as UserInfo;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải thông tin người dùng",
      );
    }
  },
);

/** Lấy danh sách sản phẩm yêu thích của user */
export const fetchWishlist = createAsyncThunk(
  "user/fetchWishlist",
  async (token: string | null, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${BASE_URL}/api/users/me/wishlist`, {
        headers,
      });
      return res.data as Product[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải danh sách yêu thích",
      );
    }
  },
);

/** Thêm hoặc xóa sản phẩm khỏi wishlist (toggle) */
export const toggleWishlistItem = createAsyncThunk(
  "user/toggleWishlist",
  async (
    {
      token,
      productId,
      isInWishlist,
    }: { token: string | null; productId: string; isInWishlist: boolean },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      if (isInWishlist) {
        await axios.delete(`${BASE_URL}/api/users/me/wishlist/${productId}`, {
          headers,
        });
      } else {
        await axios.post(
          `${BASE_URL}/api/users/me/wishlist/${productId}`,
          {},
          { headers },
        );
      }
      // Fetch lại wishlist sau khi thay đổi
      const res = await axios.get(`${BASE_URL}/api/users/me/wishlist`, {
        headers,
      });
      return res.data as Product[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Thao tác wishlist thất bại",
      );
    }
  },
);

// ==================== SLICE ====================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo(state, action: { payload: UserInfo }) {
      state.userInfo = action.payload;
    },
    clearUserInfo(state) {
      state.userInfo = null;
      state.wishlistItems = [];
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchUserInfo
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchWishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.wishlistLoading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.wishlistLoading = false;
        state.error = action.payload as string;
      });

    // toggleWishlistItem
    builder
      .addCase(toggleWishlistItem.pending, (state) => {
        state.wishlistLoading = true;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(toggleWishlistItem.rejected, (state, action) => {
        state.wishlistLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUserInfo, clearUserInfo, clearError } = userSlice.actions;

export default userSlice.reducer;
