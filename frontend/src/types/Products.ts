export interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  status: "selling" | "stopselling" | "AVAILABLE" | "UNAVAILABLE" | "OUT_OF_STOCK";
  stockQuantity: number;
  rating?: number;
  reviewCount?: number;
  colors?: string[]; // Thêm mảng màu sắc để hỗ trợ chăn ga, gối
  images: { url: string; isPrimary: boolean }[];
  category?: { name: string; code: string };
  tags?: string[];
  description?: string;
}
