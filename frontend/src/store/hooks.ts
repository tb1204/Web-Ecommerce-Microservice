import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";

/**
 * Hook dispatch có type - dùng thay cho useDispatch() thông thường.
 * Hỗ trợ dispatch async thunks với đầy đủ TypeScript typings.
 *
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(fetchAllProducts());
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Hook selector có type - dùng thay cho useSelector() thông thường.
 * Tự động nhận biết kiểu RootState, không cần khai báo thủ công.
 *
 * @example
 * const products = useAppSelector((state) => state.product.products);
 * const cartItems = useAppSelector((state) => state.cart.cart.products);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
