// Entry point duy nhất — import tất cả từ đây, không import trực tiếp từ slice file

export { store } from "./store";
export type { RootState, AppDispatch } from "./store";
export { useAppDispatch, useAppSelector } from "./hooks";

// ─── CART ─────────────────────────────────────────────────────────────────────
export {
  addToCart, updateQuantity, removeFromCart, clearCart,
  toggleSelectItem, toggleSelectAll, clearSelection,
  fetchCart, addToCartAsync, updateQuantityAsync, removeFromCartAsync,
  selectCartItems, selectCartLoading, selectSelectedItemIds,
  selectSelectedTotal, selectCartCount,
} from "./cartSlice";

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
export {
  toggleWishlist, addToWishlist, removeFromWishlist, clearWishlist,
  selectWishlistItems, selectWishlistCount, selectIsInWishlist,
} from "./wishlistSlice";

// ─── COMPARE ──────────────────────────────────────────────────────────────────
export {
  setMaxItems, addToCompare, removeFromCompare, clearCompare, clearCompareError,
  selectCompareItems, selectCompareCount, selectMaxItems,
  selectCompareError, selectIsInCompare,
} from "./compareSlice";

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export {
  fetchProductsByFilters, fetchAllProducts, fetchProductDetails,
  fetchSimilarProducts, fetchFlashSaleProducts,
  setFilters, clearFilters, setPage, clearSelectedProduct,
  selectProducts, selectSelectedProduct, selectSimilarProducts,
  selectFlashSaleProducts, selectProductLoading,
  selectProductFilters, selectProductPagination,
} from "./productsSlice";

// ─── ORDERS (user) ────────────────────────────────────────────────────────────
export {
  fetchUserOrders, fetchOrderDetails, createOrder, cancelOrder,
  clearOrderDetails, clearOrderError,
  selectUserOrders, selectOrderDetails, selectOrderLoading, selectOrderError,
} from "./orderSlice";

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────
export {
  applyVoucher, createVNPayPayment,
  setShippingInfo, setPaymentMethod, removeVoucher, resetCheckout, clearCheckoutError,
  selectShippingInfo, selectPaymentMethod, selectAppliedVoucher,
  selectVoucherLoading, selectVoucherError, selectCheckoutLoading,
  selectPaymentUrl, selectDiscountAmount,
} from "./checkoutSlice";

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export {
  // users
  fetchAllUsers, updateUserRole, deleteUser,
  // products
  fetchAdminProducts, createProduct, updateProduct, deleteProduct,
  // orders
  fetchAllOrders, updateOrderStatus, deleteOrder,
  // vouchers
  fetchAllVouchers, createVoucher, updateVoucher, deleteVoucher,
  // stats
  fetchAdminStats,
  // selectors
  selectAdminUsers, selectAdminUserLoading,
  selectAdminProducts, selectAdminProductLoading,
  selectAdminOrders, selectAdminTotalSales, selectAdminTotalOrders, selectAdminOrderLoading,
  selectAdminVouchers, selectAdminVoucherLoading,
  selectAdminStats, selectAdminStatsLoading,
} from "./adminSlice";
