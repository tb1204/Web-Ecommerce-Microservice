import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ==================== TYPES ====================
export interface CartProduct {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  thickness?: string;
  color?: string;
  type?: "nem_phukien" | "boga";
}

export interface Cart {
  products: CartProduct[];
  totalPrice: number;
}

interface CartState {
  cart: Cart;
  selectedItems: string[]; // productId của các item được chọn để thanh toán
  loading: boolean;
  error: string | null;
}

// ==================== INITIAL STATE ====================
const initialState: CartState = {
  cart: {
    products: [],
    totalPrice: 0,
  },
  selectedItems: [],
  loading: false,
  error: null,
};
const BASE_URL = "http://localhost:8083";

// ==================== HELPER ====================
const calcTotal = (products: CartProduct[]) =>
  products.reduce((sum, item) => sum + item.price * item.quantity, 0);

// ==================== ASYNC THUNKS ====================

/** Lấy giỏ hàng của user từ cart-service */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (token: string | null, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${BASE_URL}/api/cart`, {
        headers,
      });
      return res.data as Cart;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải giỏ hàng",
      );
    }
  },
);

/** Thêm sản phẩm vào giỏ hàng */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    {
      token,
      product,
    }: { token: string | null; product: Omit<CartProduct, "type"> },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${BASE_URL}/api/cart/add`, product, {
        headers,
      });
      return res.data as Cart;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Thêm vào giỏ hàng thất bại",
      );
    }
  },
);

/** Cập nhật số lượng sản phẩm */
export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    {
      token,
      productId,
      variantId,
      newQty,
    }: {
      token: string | null;
      productId: string;
      variantId?: string;
      newQty: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.put(
        `${BASE_URL}/api/cart/update`,
        { productId, variantId, quantity: newQty },
        { headers },
      );
      return res.data as Cart;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Cập nhật số lượng thất bại",
      );
    }
  },
);

/** Xóa sản phẩm khỏi giỏ hàng */
export const removeFromCart = createAsyncThunk(
  "cart/removeItem",
  async (
    {
      token,
      productId,
      variantId,
    }: { token: string | null; productId: string; variantId?: string },
    { rejectWithValue },
  ) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${BASE_URL}/api/cart/remove`, {
        headers,
        data: { productId, variantId },
      });
      return { productId, variantId };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Xóa sản phẩm thất bại",
      );
    }
  },
);

/** Xóa toàn bộ giỏ hàng */
export const clearCartApi = createAsyncThunk(
  "cart/clearCartApi",
  async (token: string | null, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${BASE_URL}/api/cart/clear`, { headers });
      return true;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Xóa giỏ hàng thất bại",
      );
    }
  },
);

// ==================== SLICE ====================
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /** Thêm hoặc tăng số lượng sản phẩm ngay trên client (offline/guest mode) */
    addItemLocal(state, action: { payload: CartProduct }) {
      const existing = state.cart.products.find(
        (p) =>
          p.productId === action.payload.productId &&
          p.variantId === action.payload.variantId,
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cart.products.push(action.payload);
      }
      state.cart.totalPrice = calcTotal(state.cart.products);
    },

    /** Cập nhật số lượng ngay trên client */
    updateQuantityLocal(
      state,
      action: {
        payload: { productId: string; variantId?: string; newQty: number };
      },
    ) {
      const item = state.cart.products.find(
        (p) =>
          p.productId === action.payload.productId &&
          p.variantId === action.payload.variantId,
      );
      if (item) {
        item.quantity = Math.max(1, action.payload.newQty);
      }
      state.cart.totalPrice = calcTotal(state.cart.products);
    },

    /** Xóa sản phẩm ngay trên client */
    removeItemLocal(
      state,
      action: { payload: { productId: string; variantId?: string } },
    ) {
      state.cart.products = state.cart.products.filter(
        (p) =>
          !(
            p.productId === action.payload.productId &&
            p.variantId === action.payload.variantId
          ),
      );
      state.cart.totalPrice = calcTotal(state.cart.products);
    },

    /** Xóa toàn bộ giỏ hàng (client) */
    clearCartLocal(state) {
      state.cart = { products: [], totalPrice: 0 };
      state.selectedItems = [];
    },

    /** Toggle chọn/bỏ chọn item để thanh toán */
    toggleSelectItem(state, action: { payload: string }) {
      const id = action.payload;
      if (state.selectedItems.includes(id)) {
        state.selectedItems = state.selectedItems.filter((i) => i !== id);
      } else {
        state.selectedItems.push(id);
      }
    },

    /** Chọn tất cả */
    selectAllItems(state) {
      state.selectedItems = state.cart.products.map((p) => p.productId);
    },

    /** Bỏ chọn tất cả */
    deselectAllItems(state) {
      state.selectedItems = [];
    },

    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchCart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // addToCart
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateCartQuantity
    builder
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // removeFromCart
    builder
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { productId, variantId } = action.payload;
        state.cart.products = state.cart.products.filter(
          (p) => !(p.productId === productId && p.variantId === variantId),
        );
        state.cart.totalPrice = calcTotal(state.cart.products);
        state.selectedItems = state.selectedItems.filter(
          (id) => id !== productId,
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // clearCartApi
    builder.addCase(clearCartApi.fulfilled, (state) => {
      state.cart = { products: [], totalPrice: 0 };
      state.selectedItems = [];
    });
  },
});

export const {
  addItemLocal,
  updateQuantityLocal,
  removeItemLocal,
  clearCartLocal,
  toggleSelectItem,
  selectAllItems,
  deselectAllItems,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
