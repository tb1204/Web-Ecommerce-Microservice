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
}

export interface Cart {
  products: CartProduct[];
  totalPrice: number;
}

//fix lỗi mua ngay
interface CartState {
  cart: Cart;
  selectedItems: string[];
  checkoutItems: CartProduct[];
  isBuyNow: boolean; // ← THÊM: phân biệt mua ngay vs từ giỏ
  loading: boolean;
  error: string | null;
}

// ==================== INITIAL STATE ====================
const initialState: CartState = {
  cart: {
    products: [],
    totalPrice: 0,
  },
  checkoutItems: [], // fix lỗi mua ngay
  isBuyNow: false, //fix lỗi mua ngay
  selectedItems: [],
  loading: false,
  error: null,
};

// const BASE_URL = "http://localhost:8083";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// ==================== HELPER ====================
const calcTotal = (products: CartProduct[]) =>
  products.reduce((sum, item) => sum + item.price * item.quantity, 0);

// ✅ THÊM: map response từ backend (items/summary) → Cart (products/totalPrice)
const mapCartResponse = (res: any): Cart => ({
  products: (res.items ?? []).map((item: any) => ({
    productId: item.productId,
    variantId: item.variantId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    size: item.size,
    thickness: item.thickness,
    color: item.color,
  })),
  totalPrice: res.summary?.subtotal ?? 0,
});

// ==================== ASYNC THUNKS ====================

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (token: string | null, { rejectWithValue }) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${BASE_URL}/api/cart`, { headers });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải giỏ hàng",
      );
    }
  },
);

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
      const res = await axios.post(`${BASE_URL}/api/cart/items`, product, {
        headers,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Thêm vào giỏ hàng thất bại",
      );
    }
  },
);

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
      const res = await axios.patch(
        `${BASE_URL}/api/cart/items`,
        { productId, variantId, quantity: newQty },
        { headers },
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Cập nhật số lượng thất bại",
      );
    }
  },
);

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
      await axios.delete(
        `${BASE_URL}/api/cart/items/${productId}/${variantId}`,
        { headers },
      );
      return { productId, variantId }; //xóa trong giỏ hàng
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Xóa sản phẩm thất bại",
      );
    }
  },
);

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

    clearCartLocal(state) {
      state.cart = { products: [], totalPrice: 0 };
      state.selectedItems = [];
    },

    toggleSelectItem(state, action: { payload: string }) {
      const id = action.payload;
      if (state.selectedItems.includes(id)) {
        state.selectedItems = state.selectedItems.filter((i) => i !== id);
      } else {
        state.selectedItems.push(id);
      }
    },

    selectAllItems(state) {
      state.selectedItems = state.cart.products.map((p) => p.productId);
    },

    deselectAllItems(state) {
      state.selectedItems = [];
    },

    clearError(state) {
      state.error = null;
    },
    // Trong reducers — THÊM 2 action: fix mua ngay
    setCheckoutItems(
      state,
      action: { payload: { items: CartProduct[]; isBuyNow: boolean } },
    ) {
      state.checkoutItems = action.payload.items;
      state.isBuyNow = action.payload.isBuyNow;
    },
    clearCheckoutItems(state) {
      state.checkoutItems = [];
      state.isBuyNow = false;
    },
    //
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
        state.cart = mapCartResponse(action.payload); // ✅ SỬA
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
        state.cart = mapCartResponse(action.payload); // ✅ SỬA
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateCartQuantity
    builder
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.cart = mapCartResponse(action.payload); // ✅ SỬA
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
  setCheckoutItems, // fix muua ngay
  clearCheckoutItems, // fix mua ngay
} = cartSlice.actions;

export default cartSlice.reducer; //dùng khi tajo store
