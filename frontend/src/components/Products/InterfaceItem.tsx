
interface ProductImage {
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
}