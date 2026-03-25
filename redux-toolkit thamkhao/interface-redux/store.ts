// ============================================================
// store.ts
// ============================================================
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import cartUIReducer from "./cartSlice";
import checkoutReducer from "./checkoutSlice";
import wishlistReducer from "./wishlistSlice";
import compareReducer from "./compareSlice";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    // RTK Query cache — tất cả data từ server đều ở đây
    [api.reducerPath]: api.reducer,

    // UI / local state
    cartUI: cartUIReducer, // selected items trong giỏ
    checkout: checkoutReducer, // form giao hàng, voucher, payment method
    wishlist: wishlistReducer, // yêu thích (localStorage)
    compare: compareReducer, // so sánh sản phẩm
    chat: chatReducer, // WS connection state, typing, unread
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
