// ============================================================
// index.ts — import tất cả từ đây, không import trực tiếp
// ============================================================

// ─── Store & types ───────────────────────────────────────────
export { store } from "./store";
export type { RootState, AppDispatch } from "./store";
export { useAppDispatch, useAppSelector } from "./hooks";

// ─── Types ───────────────────────────────────────────────────
export type {
  Product,
  ProductImage,
  ProductSpecifications,
  ProductCategory,
  Category,
  CartItem,
  CartSummary,
  CartResponse,
  AddToCartRequest,
  UpdateQuantityRequest,
  CheckoutItemsRequest,
  OrderResponse,
  OrderItemResponse,
  CreateOrderRequest,
  OrderItemRequest,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  CreatePaymentRequest,
  PaymentResponse,
  RefundRequest,
  User,
  UserResponse,
  PageResponse,
  UserUpdateDto,
  AdminUserUpdateDto,
  CreateClerkUserRequest,
  Address,
  Membership,
  ConversationResponse,
  MessageResponse,
  SendMessageRequest,
  CreateConversationRequest,
  ConversationStatus,
  SenderRole,
  MessageType,
  MediaUploadResponse,
  SliderImage,
  SliderSignResponse,
} from "./types";

// ─── RTK Query API + hooks ───────────────────────────────────
export { api, setClerkTokenGetter } from "./api";
export {
  // Products
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStockMutation,
  // Categories
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  // Cart
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartQuantityMutation,
  useRemoveFromCartMutation,
  useRemoveCheckedOutItemsMutation,
  useClearCartMutation,
  // Orders
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrdersByUserQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  // Payments
  useCreatePaymentMutation,
  useGetPaymentByOrderIdQuery,
  useGetPaymentByIdQuery,
  useGetMyPaymentsQuery,
  useConfirmCODMutation,
  useCancelPaymentMutation,
  useRefundPaymentMutation,
  // Users
  useGetMeQuery,
  useUpdateProfileMutation,
  useGetAdminUsersQuery,
  useGetAdminUserByClerkIdQuery,
  useCreateAdminUserMutation,
  useCreateClerkUserMutation,
  useUpdateAdminUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
  useLockUserMutation,
  useUnlockUserMutation,
  useDeleteAdminUserMutation,
  // Slider
  useGetSliderListQuery,
  useGetFlashsaleBannerQuery,
  useGetSliderSignatureMutation,
  useDeleteSliderMutation,
  // Chat
  useCreateConversationMutation,
  useGetMyConversationsQuery,
  useGetConversationByIdQuery,
  useGetConversationsByStatusQuery,
  useCloseConversationMutation,
  useMarkConversationReadMutation,
  useGetMessagesQuery,
  useDeleteMessageMutation,
  useUploadChatImageMutation,
  useUploadChatVideoMutation,
} from "./api";

// ─── Cart UI slice ────────────────────────────────────────────
export {
  toggleSelectItem,
  selectAll,
  deselectAll,
  removeFromSelection,
  selectSelectedVariantIds,
  selectIsItemSelected,
  selectIsAllSelected,
} from "./cartSlice";

// ─── Checkout slice ───────────────────────────────────────────
export {
  setShippingForm,
  prefillShippingFromUser,
  setPaymentMethod,
  applyVoucher,
  removeVoucher,
  setCheckoutVariantIds,
  resetCheckout,
  selectShippingForm,
  selectPaymentMethod,
  selectAppliedVoucher,
  selectCheckoutVariantIds,
  selectDiscountAmount,
} from "./checkoutSlice";
export type { ShippingForm, AppliedVoucher } from "./checkoutSlice";

// ─── Wishlist slice ───────────────────────────────────────────
export {
  toggleWishlist,
  clearWishlist,
  selectWishlistItems,
  selectWishlistCount,
  selectIsInWishlist,
} from "./wishlistSlice";

// ─── Compare slice ────────────────────────────────────────────
export {
  setMaxItems,
  addToCompare,
  removeFromCompare,
  clearCompare,
  clearCompareError,
  selectCompareItems,
  selectCompareCount,
  selectCompareError,
  selectMaxItems,
  selectIsInCompare,
} from "./compareSlice";

// ─── Chat slice ───────────────────────────────────────────────
export {
  setActiveConversation,
  setWsConnected,
  addTypingUser,
  removeTypingUser,
  setUnreadCount,
  incrementUnread,
  resetUnread,
  appendWebSocketMessage,
  updateConversationPreview,
  selectActiveConversationId,
  selectTypingUserIds,
  selectWsConnected,
  selectUnreadCount,
} from "./chatSlice";
