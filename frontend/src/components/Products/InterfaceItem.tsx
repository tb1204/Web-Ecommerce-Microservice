
export interface ProductImage {
  url: string;
  is_primary: boolean;
}
export interface Product {
  _id: string;
  name: string;
  sku?: string;
  product_code?: string;
  brand?: string;
  origin?: string;
  price: number;
  stock_quantity: number;
  originalPrice?: number;
  images: ProductImage[];
  status: "selling" | "stopselling";
  rating?: number;
  reviewCount?: number;
  category?: { name: string; code: string };
  specifications?: {
    material: string;
    weight: string;
    dimensions: string;
    firmness: string;
    design: string;
    certification_number: string;
  };
  tags?: string[];
  description?: string;
  created_at?: string; 
  updated_at?: string;
}
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
  _id: string;
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
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPING" | "DELIVERED" | "CANCELLED" ;
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