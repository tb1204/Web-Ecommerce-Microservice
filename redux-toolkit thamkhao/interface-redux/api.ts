// ============================================================
// RTK QUERY — api.ts
// Base API + tất cả endpoints khớp 100% với backend
// Gateway port: 8080
// Clerk session token truyền qua prepareHeaders
// ============================================================
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Product,
  Category,
  CartResponse,
  AddToCartRequest,
  UpdateQuantityRequest,
  CheckoutItemsRequest,
  OrderResponse,
  CreateOrderRequest,
  CreatePaymentRequest,
  PaymentResponse,
  RefundRequest,
  User,
  UserResponse,
  PageResponse,
  UserUpdateDto,
  AdminUserUpdateDto,
  CreateClerkUserRequest,
  ConversationResponse,
  MessageResponse,
  SendMessageRequest,
  CreateConversationRequest,
  ConversationStatus,
  MediaUploadResponse,
  SliderImage,
  SliderSignResponse,
} from "./types";

// ─── Lấy Clerk token qua callback ────────────────────────────
// Được inject từ ClerkProvider trong main.tsx
// Gọi: setClerkTokenGetter(() => getToken())
let _getToken: (() => Promise<string | null>) | null = null;

export const setClerkTokenGetter = (fn: () => Promise<string | null>) => {
  _getToken = fn;
};

// ─── Base API ────────────────────────────────────────────────
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:8080",
    prepareHeaders: async (headers) => {
      if (_getToken) {
        const token = await _getToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Cart",
    "Product",
    "Category",
    "Order",
    "Payment",
    "User",
    "AdminUser",
    "Conversation",
    "Message",
    "Slider",
  ],

  endpoints: (build) => ({
    // ════════════════════════════════════════════════════════
    // PRODUCT SERVICE  →  /api/products/**  &  /api/categories/**
    // ════════════════════════════════════════════════════════

    /** GET /api/products/all */
    getAllProducts: build.query<Product[], void>({
      query: () => "/api/products/all",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Product" as const, id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    /** GET /api/products/detail/{id} */
    getProductById: build.query<Product, string>({
      query: (id) => `/api/products/detail/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Product", id }],
    }),

    /** POST /api/products/add  (multipart) */
    addProduct: build.mutation<Product, FormData>({
      query: (formData) => ({
        url: "/api/products/add",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
      // Optimistic: thêm ngay vào cache trước khi server trả về
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newProduct } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData("getAllProducts", undefined, (draft) => {
              draft.unshift(newProduct);
            }),
          );
        } catch {}
      },
    }),

    /** PUT /api/products/update/{id}  (multipart) */
    updateProduct: build.mutation<Product, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/api/products/update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Product", id }],
      // Optimistic update
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updated } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData("getAllProducts", undefined, (draft) => {
              const idx = draft.findIndex((p) => p.id === id);
              if (idx !== -1) draft[idx] = updated;
            }),
          );
        } catch {}
      },
    }),

    /** DELETE /api/products/delete/{id} */
    deleteProduct: build.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/api/products/delete/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
      // Optimistic: xóa ngay khỏi cache
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData("getAllProducts", undefined, (draft) => {
            const idx = draft.findIndex((p) => p.id === id);
            if (idx !== -1) draft.splice(idx, 1);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo(); // rollback nếu server lỗi
        }
      },
    }),

    /** PUT /api/products/updateStock?productId=&quantity= */
    updateStock: build.mutation<
      string,
      { productId: string; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: `/api/products/updateStock?productId=${productId}&quantity=${quantity}`,
        method: "PUT",
      }),
      invalidatesTags: (_r, _e, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),

    // ── Categories ───────────────────────────────────────────

    /** GET /api/categories/all */
    getAllCategories: build.query<Category[], void>({
      query: () => "/api/categories/all",
      providesTags: [{ type: "Category", id: "LIST" }],
    }),

    /** POST /api/categories/add */
    addCategory: build.mutation<Category, Pick<Category, "name" | "code">>({
      query: (body) => ({ url: "/api/categories/add", method: "POST", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // ════════════════════════════════════════════════════════
    // CART SERVICE  →  /api/cart/**
    // ════════════════════════════════════════════════════════

    /** GET /api/cart */
    getCart: build.query<CartResponse, void>({
      query: () => "/api/cart",
      providesTags: ["Cart"],
    }),

    /** POST /api/cart/items */
    addToCart: build.mutation<CartResponse, AddToCartRequest>({
      query: (body) => ({ url: "/api/cart/items", method: "POST", body }),
      invalidatesTags: ["Cart"],
      // Optimistic: tăng số lượng ngay lập tức
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData("getCart", undefined, (draft) => {
            const existing = draft.items.find(
              (i) =>
                i.productId === arg.productId && i.variantId === arg.variantId,
            );
            if (existing) {
              existing.quantity += arg.quantity;
              existing.lineTotal = existing.price * existing.quantity;
            }
            // Nếu chưa có thì chờ server trả về (không đủ data để thêm mới)
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    /** PATCH /api/cart/items */
    updateCartQuantity: build.mutation<CartResponse, UpdateQuantityRequest>({
      query: (body) => ({ url: "/api/cart/items", method: "PATCH", body }),
      invalidatesTags: ["Cart"],
      // Optimistic
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData("getCart", undefined, (draft) => {
            const item = draft.items.find(
              (i) =>
                i.productId === arg.productId && i.variantId === arg.variantId,
            );
            if (item) {
              item.quantity = arg.quantity;
              item.lineTotal = item.price * arg.quantity;
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    /** DELETE /api/cart/items/{productId}/{variantId} */
    removeFromCart: build.mutation<
      CartResponse,
      { productId: string; variantId: string }
    >({
      query: ({ productId, variantId }) => ({
        url: `/api/cart/items/${productId}/${variantId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
      // Optimistic: xóa ngay khỏi danh sách
      async onQueryStarted(
        { productId, variantId },
        { dispatch, queryFulfilled },
      ) {
        const patch = dispatch(
          api.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items = draft.items.filter(
              (i) => !(i.productId === productId && i.variantId === variantId),
            );
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    /** DELETE /api/cart/checkout-items — xóa items sau thanh toán */
    removeCheckedOutItems: build.mutation<CartResponse, CheckoutItemsRequest>({
      query: (body) => ({
        url: "/api/cart/checkout-items",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    /** DELETE /api/cart — xóa toàn bộ giỏ hàng */
    clearCart: build.mutation<CartResponse, void>({
      query: () => ({ url: "/api/cart", method: "DELETE" }),
      invalidatesTags: ["Cart"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData("getCart", undefined, (draft) => {
            draft.items = [];
            draft.summary = { subtotal: 0, shippingThreshold: 0, totalQty: 0 };
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    // ════════════════════════════════════════════════════════
    // ORDER SERVICE  →  /api/orders/**
    // ════════════════════════════════════════════════════════

    /** POST /api/orders/add */
    createOrder: build.mutation<OrderResponse, CreateOrderRequest>({
      query: (body) => ({ url: "/api/orders/add", method: "POST", body }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),

    /** GET /api/orders/all  (admin) */
    getAllOrders: build.query<OrderResponse[], void>({
      query: () => "/api/orders/all",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Order" as const, id })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),

    /** GET /api/orders/user/{userId} */
    getOrdersByUser: build.query<OrderResponse[], string>({
      query: (userId) => `/api/orders/user/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Order" as const, id })),
              { type: "Order", id: "USER_LIST" },
            ]
          : [{ type: "Order", id: "USER_LIST" }],
    }),

    /** PATCH /api/orders/status/{id}?status= */
    updateOrderStatus: build.mutation<
      OrderResponse,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/api/orders/status/${id}?status=${status}`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Order", id }],
      // Optimistic: cập nhật status ngay
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        const patchAll = dispatch(
          api.util.updateQueryData("getAllOrders", undefined, (draft) => {
            const order = draft.find((o) => o.id === id);
            if (order)
              order.orderStatus = status as OrderResponse["orderStatus"];
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchAll.undo();
        }
      },
    }),

    /** PUT /api/orders/cancel/{id} */
    cancelOrder: build.mutation<
      OrderResponse,
      { id: string; cancelReason: string }
    >({
      query: ({ id, cancelReason }) => ({
        url: `/api/orders/cancel/${id}`,
        method: "PUT",
        body: { cancelReason },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "USER_LIST" },
      ],
    }),

    // ════════════════════════════════════════════════════════
    // PAYMENT SERVICE  →  /api/payments/**
    // ════════════════════════════════════════════════════════

    /** POST /api/payments */
    createPayment: build.mutation<PaymentResponse, CreatePaymentRequest>({
      query: (body) => ({ url: "/api/payments", method: "POST", body }),
      invalidatesTags: [{ type: "Payment", id: "LIST" }],
    }),

    /** GET /api/payments/order/{orderId} */
    getPaymentByOrderId: build.query<PaymentResponse, string>({
      query: (orderId) => `/api/payments/order/${orderId}`,
      providesTags: (_r, _e, orderId) => [{ type: "Payment", id: orderId }],
    }),

    /** GET /api/payments/{paymentId} */
    getPaymentById: build.query<PaymentResponse, string>({
      query: (id) => `/api/payments/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Payment", id }],
    }),

    /** GET /api/payments/my */
    getMyPayments: build.query<PaymentResponse[], void>({
      query: () => "/api/payments/my",
      providesTags: [{ type: "Payment", id: "MY_LIST" }],
    }),

    /** PATCH /api/payments/order/{orderId}/confirm-cod */
    confirmCOD: build.mutation<PaymentResponse, string>({
      query: (orderId) => ({
        url: `/api/payments/order/${orderId}/confirm-cod`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, orderId) => [{ type: "Payment", id: orderId }],
    }),

    /** PATCH /api/payments/order/{orderId}/cancel */
    cancelPayment: build.mutation<PaymentResponse, string>({
      query: (orderId) => ({
        url: `/api/payments/order/${orderId}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, orderId) => [{ type: "Payment", id: orderId }],
    }),

    /** PATCH /api/payments/order/{orderId}/refund */
    refundPayment: build.mutation<
      PaymentResponse,
      { orderId: string; body: RefundRequest }
    >({
      query: ({ orderId, body }) => ({
        url: `/api/payments/order/${orderId}/refund`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { orderId }) => [
        { type: "Payment", id: orderId },
      ],
    }),

    // ════════════════════════════════════════════════════════
    // USER SERVICE  →  /api/users/**  &  /api/admin/users/**
    // ════════════════════════════════════════════════════════

    /** GET /api/users/me */
    getMe: build.query<User, void>({
      query: () => "/api/users/me",
      providesTags: ["User"],
    }),

    /** PUT /api/users/me */
    updateProfile: build.mutation<User, UserUpdateDto>({
      query: (body) => ({ url: "/api/users/me", method: "PUT", body }),
      invalidatesTags: ["User"],
      // Optimistic update hồ sơ cá nhân
      async onQueryStarted(dto, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData("getMe", undefined, (draft) => {
            Object.assign(draft, dto);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    // ── Admin user management ────────────────────────────────

    /** GET /api/admin/users?page=&size= */
    getAdminUsers: build.query<
      PageResponse<UserResponse>,
      { page?: number; size?: number }
    >({
      query: ({ page = 0, size = 10 } = {}) =>
        `/api/admin/users?page=${page}&size=${size}`,
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ id }) => ({
                type: "AdminUser" as const,
                id,
              })),
              { type: "AdminUser", id: "LIST" },
            ]
          : [{ type: "AdminUser", id: "LIST" }],
    }),

    /** GET /api/admin/users/{clerkId} */
    getAdminUserByClerkId: build.query<User, string>({
      query: (clerkId) => `/api/admin/users/${clerkId}`,
      providesTags: (_r, _e, clerkId) => [{ type: "AdminUser", id: clerkId }],
    }),

    /** POST /api/admin/users */
    createAdminUser: build.mutation<User, AdminUserUpdateDto>({
      query: (body) => ({ url: "/api/admin/users", method: "POST", body }),
      invalidatesTags: [{ type: "AdminUser", id: "LIST" }],
    }),

    /** POST /api/admin/users/create-clerk-user */
    createClerkUser: build.mutation<
      { clerkId: string; message: string },
      CreateClerkUserRequest
    >({
      query: (body) => ({
        url: "/api/admin/users/create-clerk-user",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "AdminUser", id: "LIST" }],
    }),

    /** PATCH /api/admin/users/{clerkId} */
    updateAdminUser: build.mutation<
      User,
      { clerkId: string; dto: AdminUserUpdateDto }
    >({
      query: ({ clerkId, dto }) => ({
        url: `/api/admin/users/${clerkId}`,
        method: "PATCH",
        body: dto,
      }),
      invalidatesTags: (_r, _e, { clerkId }) => [
        { type: "AdminUser", id: clerkId },
        { type: "AdminUser", id: "LIST" },
      ],
    }),

    /** PATCH /api/admin/users/{clerkId}/ban */
    banUser: build.mutation<void, string>({
      query: (clerkId) => ({
        url: `/api/admin/users/${clerkId}/ban`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, clerkId) => [
        { type: "AdminUser", id: clerkId },
        { type: "AdminUser", id: "LIST" },
      ],
    }),

    /** PATCH /api/admin/users/{clerkId}/unban */
    unbanUser: build.mutation<void, string>({
      query: (clerkId) => ({
        url: `/api/admin/users/${clerkId}/unban`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, clerkId) => [
        { type: "AdminUser", id: clerkId },
        { type: "AdminUser", id: "LIST" },
      ],
    }),

    /** PATCH /api/admin/users/{clerkId}/lock */
    lockUser: build.mutation<void, string>({
      query: (clerkId) => ({
        url: `/api/admin/users/${clerkId}/lock`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, clerkId) => [
        { type: "AdminUser", id: clerkId },
      ],
    }),

    /** PATCH /api/admin/users/{clerkId}/unlock */
    unlockUser: build.mutation<void, string>({
      query: (clerkId) => ({
        url: `/api/admin/users/${clerkId}/unlock`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, clerkId) => [
        { type: "AdminUser", id: clerkId },
      ],
    }),

    /** DELETE /api/admin/users/{clerkId} */
    deleteAdminUser: build.mutation<void, string>({
      query: (clerkId) => ({
        url: `/api/admin/users/${clerkId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "AdminUser", id: "LIST" }],
      // Optimistic: ẩn khỏi danh sách ngay
      async onQueryStarted(clerkId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData(
            "getAdminUsers",
            { page: 0, size: 10 },
            (draft) => {
              draft.content = draft.content.filter(
                (u) => u.clerkId !== clerkId,
              );
              draft.totalElements -= 1;
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    // ── Slider ───────────────────────────────────────────────

    /** GET /api/admin/sliders/list?folder=&max= */
    getSliderList: build.query<
      { resources: SliderImage[] },
      { folder?: string; max?: number }
    >({
      query: ({ folder = "slider", max = 20 } = {}) =>
        `/api/admin/sliders/list?folder=${folder}&max=${max}`,
      providesTags: ["Slider"],
    }),

    /** GET /api/admin/sliders/banners/flashsale */
    getFlashsaleBanner: build.query<{ resources: SliderImage[] }, void>({
      query: () => "/api/admin/sliders/banners/flashsale",
      providesTags: ["Slider"],
    }),

    /** POST /api/admin/sliders/sign */
    getSliderSignature: build.mutation<
      SliderSignResponse,
      { folder?: string; title?: string }
    >({
      query: (body) => ({
        url: "/api/admin/sliders/sign",
        method: "POST",
        body,
      }),
    }),

    /** DELETE /api/admin/sliders/delete */
    deleteSlider: build.mutation<string, { publicId: string }>({
      query: (body) => ({
        url: "/api/admin/sliders/delete",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Slider"],
    }),

    // ════════════════════════════════════════════════════════
    // CHAT SERVICE  →  /api/chat/**
    // ════════════════════════════════════════════════════════

    /** POST /api/chat/conversations */
    createConversation: build.mutation<
      ConversationResponse,
      CreateConversationRequest
    >({
      query: (body) => ({
        url: "/api/chat/conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    /** GET /api/chat/conversations/my */
    getMyConversations: build.query<ConversationResponse[], void>({
      query: () => "/api/chat/conversations/my",
      providesTags: [{ type: "Conversation", id: "LIST" }],
    }),

    /** GET /api/chat/conversations/{id} */
    getConversationById: build.query<ConversationResponse, string>({
      query: (id) => `/api/chat/conversations/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Conversation", id }],
    }),

    /** GET /api/chat/conversations/admin?status= (Admin) */
    getConversationsByStatus: build.query<
      ConversationResponse[],
      ConversationStatus
    >({
      query: (status) => `/api/chat/conversations/admin?status=${status}`,
      providesTags: [{ type: "Conversation", id: "ADMIN_LIST" }],
    }),

    /** PATCH /api/chat/conversations/{id}/close */
    closeConversation: build.mutation<ConversationResponse, string>({
      query: (id) => ({
        url: `/api/chat/conversations/${id}/close`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Conversation", id },
        { type: "Conversation", id: "LIST" },
        { type: "Conversation", id: "ADMIN_LIST" },
      ],
    }),

    /** PATCH /api/chat/conversations/{id}/read */
    markConversationRead: build.mutation<void, string>({
      query: (id) => ({
        url: `/api/chat/conversations/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, id) => [{ type: "Conversation", id }],
    }),

    // ── Messages ─────────────────────────────────────────────

    /** GET /api/chat/messages/{conversationId} */
    getMessages: build.query<MessageResponse[], string>({
      query: (conversationId) => `/api/chat/messages/${conversationId}`,
      providesTags: (_r, _e, conversationId) => [
        { type: "Message", id: conversationId },
      ],
    }),

    /** DELETE /api/chat/messages/{messageId} */
    deleteMessage: build.mutation<MessageResponse, string>({
      query: (messageId) => ({
        url: `/api/chat/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Message", id: "LIST" }],
      // Optimistic: đánh dấu isDeleted ngay
      async onQueryStarted(messageId, { dispatch, getState, queryFulfilled }) {
        // Cần biết conversationId — tìm trong cache
        const cacheEntries = api.util.selectInvalidatedBy(getState() as never, [
          { type: "Message" },
        ]);
        const patches = cacheEntries
          .filter((e) => e.endpointName === "getMessages")
          .map(({ originalArgs: convId }) =>
            dispatch(
              api.util.updateQueryData(
                "getMessages",
                convId as string,
                (draft) => {
                  const msg = draft.find((m) => m.id === messageId);
                  if (msg) msg.isDeleted = true;
                },
              ),
            ),
          );
        try {
          await queryFulfilled;
        } catch {
          patches.forEach((p) => p.undo());
        }
      },
    }),

    // ── Media ────────────────────────────────────────────────

    /** POST /api/chat/media/image */
    uploadChatImage: build.mutation<MediaUploadResponse, FormData>({
      query: (formData) => ({
        url: "/api/chat/media/image",
        method: "POST",
        body: formData,
      }),
    }),

    /** POST /api/chat/media/video */
    uploadChatVideo: build.mutation<MediaUploadResponse, FormData>({
      query: (formData) => ({
        url: "/api/chat/media/video",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

// ─── Export hooks ────────────────────────────────────────────
export const {
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
} = api;
