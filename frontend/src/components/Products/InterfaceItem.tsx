export interface ProductImage {
  url: string;
  isPrimary: boolean;
}
export interface ProductVariant {
  variantId: string;
  _id?: string | { $oid: string };
  id?: string;
  sku: string;
  size: string;
  thickness: string;
  color?: string;
  price: number;
  originalPrice: number;
  stockQuantity?: number;
  status: string;
}
export interface Category {
  id?: string;
  name: string;
  code: string;
  parentName: string | null;
  parentCode: string | null;
}
export interface Product {
  id: string;
  name: string;
  productCode?: string;
  brand?: string;
  origin?: string;
  price: number;
  originalPrice?: number;
  totalStockQuantity: number;
  stockQuantity?: number;
  variants: ProductVariant[];
  images: ProductImage[];
  status: "AVAILABLE" | "OUT_OF_STOCK" | "selling" | "stopselling";
  rating?: number;
  reviewCount?: number;
  colors?: string[];
  category?: {
    name: string;
    code: string;
    parentName: string | null;
    parentCode: string | null;
  };
  specifications?: {
    material: string;
    weight: string;
    firmness: string;
    design: string;
    certificationNumber: string;
  };
  tags?: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  orderDetailId: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  note: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    shippingAddress: string;
  };
  items: OrderItem[];
  summary: {
    totalAmount: number;
    shippingFee: number;
    totalQty: number;
  };
  payment: {
    method: "VNPAY" | "COD";
    status: "PAID" | "PENDING" | "REFUNDED" | "CANCELLED" | "FAILED";
    transactionId?: string;
  };
  orderStatus:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPING"
    | "DELIVERED"
    | "CANCELLED";
  cancelReason: string;
  createdAt: string;
  updatedAt: string;
}

//interface cho voucher
export interface UsageLimit {
  total: number;
  perUser: number;
  used: number;
}

export interface Validity {
  start: string;
  end: string;
}

export interface Voucher {
  _id: string;
  code: string;
  name: string;
  voucherType: "PRODUCT_DISCOUNT" | "SHIPPING_DISCOUNT";
  discountType: "FIXED_AMOUNT" | "PERCENTAGE";
  discountValue: number;
  maxDiscountAmount: number;
  minOrderAmount: number;
  usageLimit: UsageLimit;
  validity: Validity;
  status: "ACTIVE" | "EXPIRED" | "DISABLED";
  isStackable: boolean;
  userUsedList: string[];
  createdAt: string;
  updatedAt: string;
}
