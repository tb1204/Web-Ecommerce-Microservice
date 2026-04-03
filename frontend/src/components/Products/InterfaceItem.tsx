export interface ProductImage {
  url: string;
  isPrimary: boolean;
}
export interface ProductVariant {
  variantId: string;
  sku: string;
  size: string;
  thickness: string;
  color?: string;
  price: number;
  originalPrice: number;
  stockQuantity: number;
  status: string;
}
export interface Product {
  id: string;
  name: string;
  productCode?: string;
  brand?: string;
  origin?: string;
  price: number; 
  totalStockQuantity: number; 
  variants: ProductVariant[];
  images: ProductImage[];
<<<<<<< HEAD
  status:
    | "selling"
    | "stopselling"
    | "AVAILABLE"
    | "UNAVAILABLE"
    | "OUT_OF_STOCK";
=======
  status: "AVAILABLE" | "OUT_OF_STOCK" | "selling" | "stopselling"; 
>>>>>>> af0095bb6f3b5393467dfca637e6aca43c0f5811
  rating?: number;
  reviewCount?: number;
  colors?: string[]; // Thêm mảng màu sắc để hỗ trợ chăn ga, gối
  category?: { name: string; code: string };
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
// export interface Product {
//   id: string;
//   name: string;
//   sku?: string;
//   productCode?: string;
//   brand?: string;
//   origin?: string;
//   price: number;
//   stockQuantity: number;
//   originalPrice?: number;
//   images: ProductImage[];
//   status: "selling" | "stopselling";
//   rating?: number;
//   reviewCount?: number;
//   category?: { name: string; code: string };
//   specifications?: {
//     material: string;
//     weight: string;
//     firmness: string;
//     size: string;
//     thickness: string;
//     design: string;
//     certificationNumber: string;
//   };
//   tags?: string[];
//   description?: string;
//   createdAt?: string; 
//   updatedAt?: string;
// }
// interface cho admin order
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
    method: "VNPAY" | "CASH" | "MOMO";
    status: "PAID" | "UNPAID";
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

export interface Category {
  id?: string;
  name: string;
  code: string;
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
