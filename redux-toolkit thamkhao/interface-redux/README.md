# Redux Toolkit Store — Hướng dẫn tích hợp đầy đủ

## Kiến trúc

```
src/store/
├── types.ts        ← Interface TS khớp 1:1 với Java entity/DTO
├── api.ts          ← RTK Query: TẤT CẢ endpoints thực tế từ backend
├── cartSlice.ts    ← UI state: selectedVariantIds
├── checkoutSlice.ts← Form giao hàng, voucher, paymentMethod
├── wishlistSlice.ts← Yêu thích (persist localStorage)
├── compareSlice.ts ← So sánh sản phẩm
├── chatSlice.ts    ← WebSocket state + append messages vào RTK cache
├── store.ts        ← configureStore
├── hooks.ts        ← useAppDispatch, useAppSelector
└── index.ts        ← Barrel export (import tất cả từ đây)
```

**Triết lý thiết kế:**

- **RTK Query** (`api.ts`) → toàn bộ data từ server: products, cart, orders, payments, users, chat
- **createSlice** → chỉ dùng cho UI state thuần: selections, form, wishlist, compare, WS status

---

## 1. Cài đặt

```bash
npm install @reduxjs/toolkit react-redux
```

---

## 2. Kết nối Clerk token vào RTK Query (main.tsx)

```tsx
// main.tsx
import { Provider } from "react-redux";
import { store, setClerkTokenGetter } from "./store";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

// Component trung gian để inject Clerk token vào RTK Query
function ClerkTokenBridge({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  // Gọi 1 lần — sau đó RTK Query tự gọi mỗi request
  setClerkTokenGetter(() => getToken());
  return <>{children}</>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerk_key} ...>
      <Provider store={store}>
        <ClerkTokenBridge>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </ClerkTokenBridge>
      </Provider>
    </ClerkProvider>
  </StrictMode>
);
```

---

## 3. Xóa WishlistProvider & CompareProvider khỏi App.tsx

Redux thay thế hoàn toàn 2 Context này. Xóa bọc trong `App.tsx`:

```tsx
// Trước
<WishlistProvider>
  <CompareProvider>...</CompareProvider>
</WishlistProvider>

// Sau — xóa hẳn 2 wrapper
```

---

## 4. Ví dụ dùng RTK Query

### Lấy giỏ hàng

```tsx
import { useGetCartQuery, useAddToCartMutation } from "@/store";

function CartDrawer() {
  const { data: cart, isLoading } = useGetCartQuery();
  const [addToCart, { isLoading: adding }] = useAddToCartMutation();

  const handleAdd = () =>
    addToCart({ productId: "abc", variantId: "v1", quantity: 1 });

  return <div>{cart?.items.length} sản phẩm</div>;
}
```

### Tạo đơn hàng

```tsx
import { useCreateOrderMutation, useUser } from "@clerk/clerk-react";
import { useCreateOrderMutation } from "@/store";

function CheckoutButton() {
  const { user } = useUser();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handleOrder = async () => {
    const order = await createOrder({
      userId: user!.id,
      name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "a@gmail.com",
      shippingAddress: "123 ABC, Cần Thơ",
      items: [{ productId: "prod-1", quantity: 2 }],
      paymentMethod: "VNPAY",
    }).unwrap();

    // Sau khi tạo order → tạo payment
    // ...
  };
}
```

### Thanh toán VNPAY — redirect user

```tsx
import { useCreatePaymentMutation } from "@/store";

const [createPayment] = useCreatePaymentMutation();

const handlePayVNPay = async (orderId: string, amount: number) => {
  const payment = await createPayment({
    orderId,
    paymentMethod: "VNPAY",
    amount,
    clientIp: "127.0.0.1",
  }).unwrap();

  if (payment.paymentUrl) {
    window.location.href = payment.paymentUrl; // redirect sang VNPAY
  }
};
```

### Admin — cập nhật trạng thái đơn hàng (Optimistic Update tự động)

```tsx
import { useUpdateOrderStatusMutation } from "@/store";

const [updateStatus] = useUpdateOrderStatusMutation();

// UI cập nhật ngay lập tức, rollback nếu server lỗi
await updateStatus({ id: orderId, status: "SHIPPING" });
```

---

## 5. Xử lý WebSocket (ChatWebSocketHandler)

```tsx
// hooks/useChatWebSocket.ts
import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import {
  setWsConnected,
  appendWebSocketMessage,
  updateConversationPreview,
  addTypingUser,
  removeTypingUser,
  incrementUnread,
} from "@/store";
import { useAuth } from "@clerk/clerk-react";

export function useChatWebSocket(conversationId: string) {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();

  useEffect(() => {
    let ws: WebSocket;

    const connect = async () => {
      const token = await getToken();
      ws = new WebSocket(
        `ws://localhost:8080/ws/chat?token=${token}&conversationId=${conversationId}`,
      );

      ws.onopen = () => dispatch(setWsConnected(true));
      ws.onclose = () => dispatch(setWsConnected(false));

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "NEW_MESSAGE":
            dispatch(appendWebSocketMessage(data.message));
            dispatch(updateConversationPreview(data.message));
            dispatch(incrementUnread());
            break;
          case "TYPING_START":
            dispatch(addTypingUser(data.senderId));
            break;
          case "TYPING_STOP":
            dispatch(removeTypingUser(data.senderId));
            break;
        }
      };
    };

    connect();
    return () => ws?.close();
  }, [conversationId]);
}
```

---

## 6. Gửi tin nhắn qua WebSocket (không dùng HTTP)

Backend dùng STOMP WebSocket cho tin nhắn. Để gửi:

```tsx
// stompClient.send("/app/chat.send", {}, JSON.stringify(sendMessageRequest));
```

Để nhận tin nhắn đã gửi xong, append vào RTK Query cache:

```tsx
dispatch(appendWebSocketMessage(newMessage));
```

---

## 7. Map API routes → RTK Query hooks

| Backend endpoint                                  | RTK Query hook                             |
| ------------------------------------------------- | ------------------------------------------ |
| `GET /api/products/all`                           | `useGetAllProductsQuery()`                 |
| `GET /api/products/detail/{id}`                   | `useGetProductByIdQuery(id)`               |
| `POST /api/products/add`                          | `useAddProductMutation()`                  |
| `PUT /api/products/update/{id}`                   | `useUpdateProductMutation()`               |
| `DELETE /api/products/delete/{id}`                | `useDeleteProductMutation()`               |
| `GET /api/categories/all`                         | `useGetAllCategoriesQuery()`               |
| `GET /api/cart`                                   | `useGetCartQuery()`                        |
| `POST /api/cart/items`                            | `useAddToCartMutation()`                   |
| `PATCH /api/cart/items`                           | `useUpdateCartQuantityMutation()`          |
| `DELETE /api/cart/items/{productId}/{variantId}`  | `useRemoveFromCartMutation()`              |
| `DELETE /api/cart/checkout-items`                 | `useRemoveCheckedOutItemsMutation()`       |
| `DELETE /api/cart`                                | `useClearCartMutation()`                   |
| `POST /api/orders/add`                            | `useCreateOrderMutation()`                 |
| `GET /api/orders/all`                             | `useGetAllOrdersQuery()`                   |
| `GET /api/orders/user/{userId}`                   | `useGetOrdersByUserQuery(userId)`          |
| `PATCH /api/orders/status/{id}`                   | `useUpdateOrderStatusMutation()`           |
| `PUT /api/orders/cancel/{id}`                     | `useCancelOrderMutation()`                 |
| `POST /api/payments`                              | `useCreatePaymentMutation()`               |
| `GET /api/payments/order/{orderId}`               | `useGetPaymentByOrderIdQuery(orderId)`     |
| `GET /api/payments/my`                            | `useGetMyPaymentsQuery()`                  |
| `PATCH /api/payments/order/{orderId}/confirm-cod` | `useConfirmCODMutation()`                  |
| `PATCH /api/payments/order/{orderId}/cancel`      | `useCancelPaymentMutation()`               |
| `PATCH /api/payments/order/{orderId}/refund`      | `useRefundPaymentMutation()`               |
| `GET /api/users/me`                               | `useGetMeQuery()`                          |
| `PUT /api/users/me`                               | `useUpdateProfileMutation()`               |
| `GET /api/admin/users`                            | `useGetAdminUsersQuery({page, size})`      |
| `PATCH /api/admin/users/{clerkId}`                | `useUpdateAdminUserMutation()`             |
| `PATCH /api/admin/users/{clerkId}/ban`            | `useBanUserMutation()`                     |
| `PATCH /api/admin/users/{clerkId}/unban`          | `useUnbanUserMutation()`                   |
| `PATCH /api/admin/users/{clerkId}/lock`           | `useLockUserMutation()`                    |
| `DELETE /api/admin/users/{clerkId}`               | `useDeleteAdminUserMutation()`             |
| `GET /api/admin/sliders/list`                     | `useGetSliderListQuery({folder, max})`     |
| `POST /api/admin/sliders/sign`                    | `useGetSliderSignatureMutation()`          |
| `DELETE /api/admin/sliders/delete`                | `useDeleteSliderMutation()`                |
| `POST /api/chat/conversations`                    | `useCreateConversationMutation()`          |
| `GET /api/chat/conversations/my`                  | `useGetMyConversationsQuery()`             |
| `GET /api/chat/conversations/admin`               | `useGetConversationsByStatusQuery(status)` |
| `PATCH /api/chat/conversations/{id}/close`        | `useCloseConversationMutation()`           |
| `PATCH /api/chat/conversations/{id}/read`         | `useMarkConversationReadMutation()`        |
| `GET /api/chat/messages/{conversationId}`         | `useGetMessagesQuery(conversationId)`      |
| `DELETE /api/chat/messages/{messageId}`           | `useDeleteMessageMutation()`               |

---

## 8. .env.local

```env
VITE_API_URL=http://localhost:8080
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```
