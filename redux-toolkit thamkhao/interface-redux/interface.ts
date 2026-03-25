// ============================================================
// TYPES — khớp 1:1 với backend Java entities & DTOs
// ============================================================

// ─── PRODUCT ────────────────────────────────────────────────
export interface ProductImage {
  url: string;
  isPrimary: boolean;
}

export interface ProductSpecifications {
  material: string;
  weight: string;
  dimensions: string;
  firmness: string;
  design: string;
  certificationNumber: string;
}

export interface ProductCategory {
  name: string;
  code: string;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  productCode?: string;
  category?: ProductCategory;
  brand?: string;
  origin?: string;
  price: number;
  originalPrice?: number;
  specifications?: ProductSpecifications;
  stockQuantity: number;
  tags?: string[];
  images: ProductImage[];
  status: "selling" | "stopselling";
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  code: string;
}

// ─── CART ────────────────────────────────────────────────────
export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  lineTotal: number;
  size?: string;
  thickness?: string;
  color?: string;
}

export interface CartSummary {
  subtotal: number;
  shippingThreshold: number;
  totalQty: number;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItem[];
  summary: CartSummary;
  note?: string;
  status?: string;
}

// Request DTOs — khớp Java @RequestBody
export interface AddToCartRequest {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface UpdateQuantityRequest {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CheckoutItemsRequest {
  variantIds: string[];
}

// ─── ORDER ───────────────────────────────────────────────────
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "VNPAY" | "CASH" | "MOMO";
export type PaymentStatus = "PAID" | "UNPAID" | "REFUNDED" | "CANCELLED";

export interface OrderItemResponse {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  userId: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    shippingAddress: string;
  };
  summary: {
    totalAmount: number;
    shippingFee: number;
    totalQty: number;
  };
  payment: {
    method: string;
    status: string;
    transactionId?: string;
  };
  items: OrderItemResponse[];
  orderStatus: OrderStatus;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  userId: string;
  name: string;
  phone: string;
  email: string;
  shippingAddress: string;
  items: OrderItemRequest[];
  paymentMethod: PaymentMethod;
  cancelReason?: string;
}

// ─── PAYMENT ─────────────────────────────────────────────────
export interface CreatePaymentRequest {
  orderId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  voucherCode?: string;
  voucherDiscount?: number;
  clientIp?: string;
}

export interface PaymentResponse {
  id: string;
  orderId: string;
  userId: string;
  paymentMethod: PaymentMethod;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED";
  amount: number;
  currency: string;
  paymentUrl?: string;
  transactionId?: string;
  voucherCode?: string;
  voucherDiscount?: number;
  refundAmount?: number;
  refundReason?: string;
  failedReason?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefundRequest {
  reason: string;
}

// ─── USER ────────────────────────────────────────────────────
export type Membership = "MEMBER" | "SILVER" | "GOLD" | "DIAMOND";

export interface Address {
  id?: string;
  label?: string;
  fullAddress: string;
  province: string;
  ward?: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  clerkId: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  avatarUrl?: string;
  totalSpent?: number;
  membership: Membership;
  purchaseCount?: number;
  roles: string[];
  addresses?: Address[];
  isActive: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// UserResponse (admin list — có pagination)
export interface UserResponse {
  id: string;
  clerkId: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  avatarUrl?: string;
  roles: string[];
  isActive: boolean;
  isBlocked: boolean;
  membership: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page
}

export interface UserUpdateDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  avatarUrl?: string;
  email?: string;
  username?: string;
}

export interface AdminUserUpdateDto {
  clerkId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  phone?: string;
  gender?: string;
  avatarUrl?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  roles?: string[];
  membership?: string;
}

export interface CreateClerkUserRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  role?: string;
}

// ─── CHAT ────────────────────────────────────────────────────
export type ConversationStatus = "WAITING" | "ACTIVE" | "BOT_ONLY" | "CLOSED";
export type SenderRole = "USER" | "BOT" | "ADMIN";
export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "SYSTEM";

export interface ConversationResponse {
  id: string;
  userId: string;
  adminId?: string;
  status: ConversationStatus;
  lastMessage?: string;
  lastMessageAt?: string;
  lastSenderRole?: SenderRole;
  userLastReadAt?: string;
  adminLastReadAt?: string;
  botEnabled: boolean;
  handoffToAdmin: boolean;
  userDisplayName?: string;
  userAvatarUrl?: string;
  isPinned: boolean;
  isMuted: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: SenderRole;
  type: MessageType;
  content?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mimeType?: string;
  mediaSize?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
  isDeleted: boolean;
  createdAt: string;
}

export interface SendMessageRequest {
  conversationId: string;
  type: MessageType;
  content?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mimeType?: string;
  mediaSize?: number;
  duration?: number;
}

export interface CreateConversationRequest {
  title?: string;
  tags?: string[];
}

export interface MediaUploadResponse {
  url: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
  duration?: number;
}

// ─── SLIDER (admin) ──────────────────────────────────────────
export interface SliderImage {
  public_id: string;
  secure_url: string;
  context?: { title?: string };
  created_at?: string;
}

export interface SliderSignResponse {
  timestamp: number;
  signature: string;
  cloudName: string;
  apiKey: string;
  folder: string;
  context?: string;
}
