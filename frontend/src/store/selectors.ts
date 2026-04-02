/**
 * SELECTORS - Các hàm lấy state đã được tính toán sẵn
 * Dùng với useAppSelector để truy cập state dễ dàng hơn.
 *
 * Cách dùng:
 *   import { selectFilteredProducts } from "@/store/selectors";
 *   const filtered = useAppSelector(selectFilteredProducts);
 */

import type { RootState } from "./index";

/** Danh sách sản phẩm đã lọc theo searchTerm + selectedCategory */
export const selectFilteredProducts = (state: RootState) => {
  const { products, searchTerm, selectedCategory } = state.product;
  return products.filter((p) => {
    const matchName =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat =
      selectedCategory === "all" || p.category?.code === selectedCategory;
    return matchName && matchCat;
  });
};

/** Tổng số trang sau khi lọc */
export const selectProductTotalPages = (state: RootState) => {
  const filtered = selectFilteredProducts(state);
  return Math.ceil(filtered.length / state.product.itemsPerPage);
};

/** Danh sách sản phẩm trên trang hiện tại */
export const selectCurrentPageProducts = (state: RootState) => {
  const filtered = selectFilteredProducts(state);
  const { currentPage, itemsPerPage } = state.product;
  const start = (currentPage - 1) * itemsPerPage;
  return filtered.slice(start, start + itemsPerPage);
};

/** Danh sách danh mục */
export const selectCategories = (state: RootState) => state.product.categories;

/** Loading state của product */
export const selectProductLoading = (state: RootState) => state.product.loading;

// CART SELECTORS

/** Toàn bộ cart object */
export const selectCart = (state: RootState) => state.cart.cart;

/** Danh sách sản phẩm trong giỏ */
export const selectCartItems = (state: RootState) => state.cart.cart.products;

/** Tổng số sản phẩm (count badges) */
export const selectCartItemCount = (state: RootState) =>
  state.cart.cart.products.reduce((sum, item) => sum + item.quantity, 0);

/** Tổng tiền giỏ hàng */
export const selectCartTotalPrice = (state: RootState) =>
  state.cart.cart.products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

/** Danh sách productId được chọn để thanh toán */
export const selectSelectedItems = (state: RootState) =>
  state.cart.selectedItems;

/** Tổng tiền của các sản phẩm được chọn */
export const selectSelectedItemsTotal = (state: RootState) => {
  const { products } = state.cart.cart;
  const { selectedItems } = state.cart;
  return products
    .filter((p) => selectedItems.includes(p.productId))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
};

/** Loading state của cart */
export const selectCartLoading = (state: RootState) => state.cart.loading;

// ORDER SELECTORS

/** Danh sách đơn hàng đã lọc */
export const selectFilteredOrders = (state: RootState) => {
  const { orders, searchTerm, filterStatus } = state.order;
  return orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      filterStatus === "all" || o.orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });
};

/** Tổng số trang đơn hàng */
export const selectOrderTotalPages = (state: RootState) => {
  const filtered = selectFilteredOrders(state);
  return Math.ceil(filtered.length / state.order.itemsPerPage);
};

/** Đơn hàng trên trang hiện tại */
export const selectCurrentPageOrders = (state: RootState) => {
  const filtered = selectFilteredOrders(state);
  const { currentPage, itemsPerPage } = state.order;
  const start = (currentPage - 1) * itemsPerPage;
  return filtered.slice(start, start + itemsPerPage);
};

/** Đơn hàng đang được xem chi tiết */
export const selectSelectedOrder = (state: RootState) =>
  state.order.selectedOrder;

/** Loading state của order */
export const selectOrderLoading = (state: RootState) => state.order.loading;

// VOUCHER SELECTORS

/** Danh sách voucher đã lọc */
export const selectFilteredVouchers = (state: RootState) => {
  const { vouchers, searchTerm, selectedType } = state.voucher;
  return vouchers.filter((v) => {
    const matchSearch =
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === "all" || v.voucherType === selectedType;
    return matchSearch && matchType;
  });
};

/** Tổng số trang voucher */
export const selectVoucherTotalPages = (state: RootState) => {
  const filtered = selectFilteredVouchers(state);
  return Math.ceil(filtered.length / state.voucher.itemsPerPage);
};

/** Voucher đang được áp dụng trong checkout */
export const selectAppliedVoucher = (state: RootState) =>
  state.voucher.appliedVoucher;

/** Số tiền được giảm từ voucher */
export const selectVoucherDiscount = (state: RootState) =>
  state.voucher.discountAmount;

/** Loading apply voucher */
export const selectApplyLoading = (state: RootState) =>
  state.voucher.applyLoading;

/** Lỗi apply voucher */
export const selectApplyError = (state: RootState) => state.voucher.applyError;

// USER SELECTORS
/** Thông tin user */
export const selectUserInfo = (state: RootState) => state.user.userInfo;

/** Danh sách sản phẩm yêu thích */
export const selectWishlistItems = (state: RootState) =>
  state.user.wishlistItems;

/** Kiểm tra 1 sản phẩm có trong wishlist không */
export const selectIsInWishlist = (productId: string) => (state: RootState) =>
  state.user.wishlistItems.some((p) => p.id === productId);

/** Số lượng sản phẩm trong wishlist */
export const selectWishlistCount = (state: RootState) =>
  state.user.wishlistItems.length;

// UI SELECTORS

/** Trạng thái mở của Cart Drawer */
export const selectIsCartDrawerOpen = (state: RootState) =>
  state.ui.isCartDrawerOpen;

/** Trạng thái tìm kiếm */
export const selectIsSearchOpen = (state: RootState) => state.ui.isSearchOpen;

/** Dark mode */
export const selectIsDarkMode = (state: RootState) => state.ui.isDarkMode;

/** Global loading */
export const selectIsGlobalLoading = (state: RootState) =>
  state.ui.isGlobalLoading;

export const selectGlobalLoadingMessage = (state: RootState) =>
  state.ui.globalLoadingMessage;

// REVIEW SELECTORS

/** Danh sách review đã lọc (Admin) */
export const selectFilteredReviews = (state: RootState) => {
  const { reviews, searchTerm, filterStatus } = state.review;
  return reviews.filter((r) => {
    const matchSearch =
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });
};

/** Reviews của 1 sản phẩm cụ thể */
export const selectProductReviews = (state: RootState) =>
  state.review.productReviews;

/** Điểm đánh giá trung bình của sản phẩm */
export const selectAverageRating = (state: RootState) => {
  const reviews = state.review.productReviews;
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
};
