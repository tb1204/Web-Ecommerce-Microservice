export interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  status: "selling" | "stopselling";
  stockQuantity: number;
  rating?: number;
  reviewCount?: number;
  images: { url: string; isPrimary: boolean }[];
  category?: { name: string; code: string };
  tags?: string[];
  description?: string;
}
