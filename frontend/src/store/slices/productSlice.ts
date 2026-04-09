import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Product } from "../../components/Products/InterfaceItem";
import type { Category } from "../../components/Products/InterfaceItem";

// ==================== TYPES ====================
interface ProductState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  // Bộ lọc
  searchTerm: string;
  selectedCategory: string;
  // Phân trang
  currentPage: number;
  itemsPerPage: number;
}

// ==================== INITIAL STATE ====================
const initialState: ProductState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  searchTerm: "",
  selectedCategory: "all",
  currentPage: 1,
  itemsPerPage: 8,
};
// const BASE_URL = "http://localhost:8082";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
// ==================== ASYNC THUNKS ====================

/** Lấy toàn bộ sản phẩm từ product-service */
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products/all`);
      return res.data as Product[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải danh sách sản phẩm",
      );
    }
  },
);

/** Lấy toàn bộ danh mục từ product-service */
export const fetchAllCategories = createAsyncThunk(
  "product/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories/all`);
      return res.data as Category[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải danh mục",
      );
    }
  },
);

/** Thêm sản phẩm mới */
export const addProduct = createAsyncThunk(
  "product/add",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/products/add`, formData);
      return res.data as Product;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Thêm sản phẩm thất bại",
      );
    }
  },
);

/** Cập nhật sản phẩm */
export const updateProduct = createAsyncThunk(
  "product/update",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue },
  ) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/products/update/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return res.data as Product;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Cập nhật sản phẩm thất bại",
      );
    }
  },
);

/** Xóa sản phẩm */
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/delete/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Xóa sản phẩm thất bại",
      );
    }
  },
);

// ==================== SLICE ====================
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset về trang 1 khi tìm kiếm
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    clearFilters(state) {
      state.searchTerm = "";
      state.selectedCategory = "all";
      state.currentPage = 1;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
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

    // fetchAllCategories
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });

    // addProduct
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateProduct
    builder
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.products.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.products[idx] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // deleteProduct
    builder
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setCurrentPage,
  clearFilters,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;
