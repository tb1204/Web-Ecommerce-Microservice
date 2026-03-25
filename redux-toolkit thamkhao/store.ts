import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import compareReducer from "./compareSlice";
import productsReducer from "./productsSlice";
import orderReducer from "./orderSlice";
import checkoutReducer from "./checkoutSlice";
import adminReducer from "./adminSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    products: productsReducer,
    orders: orderReducer,
    checkout: checkoutReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
