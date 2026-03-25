// Typed hooks — luôn dùng 2 hook này thay vì useDispatch / useSelector gốc
// để có TypeScript đầy đủ, không cần khai báo type mỗi lần

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

/**
 * Hook dispatch với kiểu AppDispatch (hỗ trợ thunk).
 * Dùng thay cho useDispatch() thông thường.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Hook selector với kiểu RootState đầy đủ.
 * Dùng thay cho useSelector() thông thường.
 *
 * @example
 * const cartItems = useAppSelector(selectCartItems);
 */
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector<RootState, TSelected>(selector);
