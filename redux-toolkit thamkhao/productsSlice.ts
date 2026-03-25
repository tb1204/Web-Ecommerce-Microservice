import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { Product } from "../components/Products/InterfaceItem";

// ==================== TYPES ====================
export interface ProductFilters {
  category: string;
  search: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string; // "price_asc" | "price_desc" | "newest" | "rating"
  brand: string;
  collection: string; // "nem" | "chan-ga" | "goi" | "phu-kien" | ...
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  similarProducts: Product[];
  flashSaleProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  // Phân trang
  totalPages: number;
  currentPage: number;
}

const BASE_URL = import.meta.env.VITE_API_URL;

// ==================== ASYNC THUNKS ====================

// Lấy danh sách sản phẩm theo filter
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async (filters: Partial<ProductFilters> & { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== "") query.append(key, String(val));
      });
      const res = await axios.get(`${BASE_URL}/api/products?${query.toString()}`);
      return res.data as { products: Product[]; totalPages: number; currentPage: number };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi lấy sản phẩm");
      return rejectWithValue("Lỗi lấy sản phẩm");
    }
  }
);

// Lấy tất cả sản phẩm (dùng cho admin)
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/all`);
      return res.data as Product[];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi lấy sản phẩm");
      return rejectWithValue("Lỗi lấy sản phẩm");
    }
  }
);

// Lấy chi tiết 1 sản phẩm theo ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/${id}`);
      return res.data as Product;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Không tìm thấy sản phẩm");
      return rejectWithValue("Không tìm thấy sản phẩm");
    }
  }
);

// Lấy sản phẩm tương tự (dùng ở trang chi tiết sản phẩm)
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilar",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/similar/${id}`);
      return res.data as Product[];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi lấy sản phẩm tương tự");
      return rejectWithValue("Lỗi lấy sản phẩm tương tự");
    }
  }
);

// Lấy sản phẩm flash sale
export const fetchFlashSaleProducts = createAsyncThunk(
  "products/fetchFlashSale",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/flash-sale`);
      return res.data as Product[];
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) return rejectWithValue(err.response?.data?.message || "Lỗi lấy flash sale");
      return rejectWithValue("Lỗi lấy flash sale");
    }
  }
);

// ==================== INITIAL STATE ====================
const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  similarProducts: [],
  flashSaleProducts: [],
  loading: false,
  error: null,
  filters: {
    category: "",
    search: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    brand: "",
    collection: "",
  },
  totalPages: 1,
  currentPage: 1,
};

// ==================== SLICE ====================
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Cập nhật 1 hoặc nhiều filter cùng lúc
    setFilters(state, action: PayloadAction<Partial<ProductFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset về trang 1 khi đổi filter
    },
    clearFilters(state) {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProductsByFilters
    builder
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        // Backend trả về { products, totalPages, currentPage } hoặc mảng thẳng
        if (Array.isArray(action.payload)) {
          state.products = action.payload;
        } else {
          state.products = action.payload.products;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.currentPage;
        }
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchAllProducts
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchProductDetails
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchSimilarProducts
    builder
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.similarProducts = action.payload;
      });

    // fetchFlashSaleProducts
    builder
      .addCase(fetchFlashSaleProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFlashSaleProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.flashSaleProducts = action.payload;
      })
      .addCase(fetchFlashSaleProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, setPage, clearSelectedProduct } = productsSlice.actions;

// ==================== SELECTORS ====================
export const selectProducts = (state: { products: ProductState }) => state.products.products;
export const selectSelectedProduct = (state: { products: ProductState }) => state.products.selectedProduct;
export const selectSimilarProducts = (state: { products: ProductState }) => state.products.similarProducts;
export const selectFlashSaleProducts = (state: { products: ProductState }) => state.products.flashSaleProducts;
export const selectProductLoading = (state: { products: ProductState }) => state.products.loading;
export const selectProductFilters = (state: { products: ProductState }) => state.products.filters;
export const selectProductPagination = (state: { products: ProductState }) => ({
  totalPages: state.products.totalPages,
  currentPage: state.products.currentPage,
});

export default productsSlice.reducer;
