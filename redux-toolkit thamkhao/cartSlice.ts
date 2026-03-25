import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// ==================== TYPES ====================
export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  type: "nem_phukien" | "boga";
  price: number;
  quantity: number;
  image: string;
  size?: string;
  thickness?: string;
  color?: string;
}

export interface CartState {
  items: CartItem[];
  selectedItemIds: string[]; // productId của các item được chọn
  loading: boolean;
  error: string | null;
}

// ==================== HELPERS ====================
const makeCartKey = (productId: string, variantId?: string) =>
  variantId ? `${productId}_${variantId}` : productId;

// ==================== ASYNC THUNKS ====================
// Lấy giỏ hàng từ server (dùng userId từ Clerk)
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/cart/${userId}`
      );
      return res.data as CartItem[];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Lỗi tải giỏ hàng");
      }
      return rejectWithValue("Lỗi tải giỏ hàng");
    }
  }
);

// Thêm sản phẩm vào giỏ (sync với server)
export const addToCartAsync = createAsyncThunk(
  "cart/addToCartAsync",
  async (
    { userId, item }: { userId: string; item: CartItem },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/${userId}/add`,
        item
      );
      return res.data as CartItem[];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Lỗi thêm vào giỏ");
      }
      return rejectWithValue("Lỗi thêm vào giỏ");
    }
  }
);

// Cập nhật số lượng sản phẩm trên server
export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantityAsync",
  async (
    {
      userId,
      productId,
      variantId,
      quantity,
    }: {
      userId: string;
      productId: string;
      variantId?: string;
      quantity: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/cart/${userId}/update`,
        { productId, variantId, quantity }
      );
      return res.data as CartItem[];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Lỗi cập nhật số lượng");
      }
      return rejectWithValue("Lỗi cập nhật số lượng");
    }
  }
);

// Xóa sản phẩm khỏi giỏ hàng trên server
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCartAsync",
  async (
    {
      userId,
      productId,
      variantId,
    }: { userId: string; productId: string; variantId?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart/${userId}/remove`,
        { data: { productId, variantId } }
      );
      return res.data as CartItem[];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || "Lỗi xóa sản phẩm");
      }
      return rejectWithValue("Lỗi xóa sản phẩm");
    }
  }
);

// ==================== INITIAL STATE ====================
const initialState: CartState = {
  items: [],
  selectedItemIds: [],
  loading: false,
  error: null,
};

// ==================== SLICE ====================
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ (local, không cần server)
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const key = makeCartKey(item.productId, item.variantId);
      const existing = state.items.find(
        (i) => makeCartKey(i.productId, i.variantId) === key
      );
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },

    // Cập nhật số lượng (local)
    updateQuantity(
      state,
      action: PayloadAction<{
        productId: string;
        variantId?: string;
        quantity: number;
      }>
    ) {
      const { productId, variantId, quantity } = action.payload;
      if (quantity < 1) return;
      const key = makeCartKey(productId, variantId);
      const item = state.items.find(
        (i) => makeCartKey(i.productId, i.variantId) === key
      );
      if (item) item.quantity = quantity;
    },

    // Xóa sản phẩm (local)
    removeFromCart(
      state,
      action: PayloadAction<{ productId: string; variantId?: string }>
    ) {
      const { productId, variantId } = action.payload;
      const key = makeCartKey(productId, variantId);
      state.items = state.items.filter(
        (i) => makeCartKey(i.productId, i.variantId) !== key
      );
      state.selectedItemIds = state.selectedItemIds.filter(
        (id) => id !== productId
      );
    },

    // Xóa toàn bộ giỏ hàng
    clearCart(state) {
      state.items = [];
      state.selectedItemIds = [];
    },

    // Toggle chọn 1 sản phẩm
    toggleSelectItem(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.selectedItemIds.indexOf(id);
      if (idx >= 0) {
        state.selectedItemIds.splice(idx, 1);
      } else {
        state.selectedItemIds.push(id);
      }
    },

    // Chọn / bỏ chọn tất cả
    toggleSelectAll(state) {
      if (state.selectedItemIds.length === state.items.length) {
        state.selectedItemIds = [];
      } else {
        state.selectedItemIds = state.items.map((i) => i.productId);
      }
    },

    // Bỏ chọn tất cả (dùng sau khi checkout)
    clearSelection(state) {
      state.selectedItemIds = [];
    },
  },

  // ==================== EXTRA REDUCERS (Async) ====================
  extraReducers: (builder) => {
    // fetchCart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // addToCartAsync
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateQuantityAsync
    builder
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // removeFromCartAsync
    builder
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  toggleSelectItem,
  toggleSelectAll,
  clearSelection,
} = cartSlice.actions;

// ==================== SELECTORS ====================
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartLoading = (state: { cart: CartState }) =>
  state.cart.loading;

export const selectSelectedItemIds = (state: { cart: CartState }) =>
  state.cart.selectedItemIds;

// Tổng tiền các sản phẩm được chọn
export const selectSelectedTotal = (state: { cart: CartState }) => {
  const { items, selectedItemIds } = state.cart;
  return items
    .filter((item) => selectedItemIds.includes(item.productId))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// Tổng số sản phẩm trong giỏ (dùng hiển thị badge)
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export default cartSlice.reducer;
