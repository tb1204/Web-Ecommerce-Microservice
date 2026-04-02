import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import voucherReducer from "./slices/voucherSlice";
import userReducer from "./slices/userSlice";
import uiReducer from "./slices/uiSlice";
import reviewReducer from "./slices/reviewSlice";

// ==================== STORE ====================
export const store = configureStore({
  reducer: {
    product: productReducer, // Quản lý danh sách sản phẩm, danh mục, bộ lọc
    cart: cartReducer, // Quản lý giỏ hàng (local + API)
    order: orderReducer, // Quản lý đơn hàng (user + admin)
    voucher: voucherReducer, // Quản lý voucher (admin) + áp dụng voucher (checkout)
    user: userReducer, // Quản lý user info + wishlist
    ui: uiReducer, // Quản lý UI state (modals, drawer, theme, loading)
    review: reviewReducer, // Quản lý đánh giá sản phẩm
  },
});

// ==================== TYPES ====================
// Lấy kiểu RootState từ store.getState()
export type RootState = ReturnType<typeof store.getState>;

// Lấy kiểu AppDispatch từ store.dispatch
export type AppDispatch = typeof store.dispatch;
export default store;
