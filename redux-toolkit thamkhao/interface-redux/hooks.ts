// ============================================================
// hooks.ts — typed hooks
// ============================================================
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

/** Dùng thay cho useDispatch() — có type AppDispatch (hỗ trợ thunk) */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Dùng thay cho useSelector() — có type RootState đầy đủ */
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector<RootState, T>(selector);
