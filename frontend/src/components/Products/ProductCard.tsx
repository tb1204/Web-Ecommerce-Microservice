import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, StarHalf, Heart, CirclePlus } from "lucide-react";
import image_nem from "../../assets/about.webp";

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

interface ProductCardProps {
  products?: Product[];
  loading?: boolean;
}

// DỮ LIỆU GÁN CỨNG (Mock data để test các trạng thái khác nhau)
const DEFAULT_FAKE_PRODUCTS: Product[] = [
  {
    _id: "p1",
    name: "Nệm Cao Su Thiên Nhiên Luxury X1",
    brand: "WolfBed",
    price: 15000000,
    originalPrice: 20000000,
    images: [{ url: image_nem, is_primary: true }],
    status: "selling",
    rating: 5,
    reviewCount: 120,
    stock_quantity: 10,
  },
  {
    _id: "p3",
    name: "Nệm Foam Nhật Bản Goodnight",
    brand: "WolfBed",
    price: 7500000,
    originalPrice: 10000000,
    images: [{ url: image_nem, is_primary: true }],
    status: "selling",
    rating: 4.8,
    reviewCount: 92,
    stock_quantity: 0,
  },
  {
    _id: "p5",
    name: "Topper Nệm Làm Mềm Mặt Đệm",
    brand: "WolfBed",
    price: 1200000,
    originalPrice: 1800000,
    images: [{ url: image_nem, is_primary: true }],
    status: "stopselling",
    rating: 4.7,
    reviewCount: 66,
    stock_quantity: 0,
  },
];

const ProductCard: React.FC<ProductCardProps> = ({
  products = DEFAULT_FAKE_PRODUCTS,
  loading = false,
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <Star
            key={i}
            size={12}
            className="fill-orange-400 text-orange-400"
          />,
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(
          <StarHalf
            key={i}
            size={12}
            className="fill-orange-400 text-orange-400"
          />,
        );
      } else {
        stars.push(<Star key={i} size={12} className="text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading)
    return <div className="text-center py-10 font-medium">Đang tải...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {products.map((product) => {
        const hasDiscount =
          product.originalPrice && product.originalPrice > product.price;
        const displayDiscount = hasDiscount
          ? Math.round(
              ((product.originalPrice! - product.price) /
                product.originalPrice!) *
                100,
            )
          : 0;

        // BIẾN KIỂM TRA TRẠNG THÁI MUA HÀNG
        const isStopSelling = product.status === "stopselling";
        const isOutOfStock =
          product.status === "selling" && product.stock_quantity <= 0;
        const canBuy =
          product.status === "selling" && product.stock_quantity > 0;

        return (
          <div
            key={product._id}
            className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
          >
            {/* 1. PHẦN ẢNH VÀ BADGE TRẠNG THÁI */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-t-xl">
              <Link to={`/product/${product._id}`}>
                <img
                  src={
                    product.images.find((img) => img.is_primary)?.url ||
                    product.images[0]?.url
                  }
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    canBuy ? "group-hover:scale-110" : ""
                  }`}
                />
              </Link>

              {/* Nút yêu thích và thêm nhanh (Chỉ hiện khi có thể mua) */}
              {canBuy && (
                <div className="absolute top-2 -right-10 group-hover:right-2 transition-all duration-300 flex flex-col gap-2">
                  <button className="p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:bg-[#1a4d32] hover:text-white">
                    <Heart size={16} />
                  </button>
                  <button className="p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:bg-[#1a4d32] hover:text-white">
                    <CirclePlus size={16} />
                  </button>
                </div>
              )}

              {/* Nhãn giảm giá */}
              {hasDiscount && canBuy && (
                <div className="absolute top-2 left-2 bg-[#ff6b35] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  -{displayDiscount}%
                </div>
              )}

              {/* LOGIC HIỂN THỊ BADGE TRÊN ẢNH */}
              {isStopSelling ? (
                <div className="absolute inset-0 bg-gray-500/60 flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider text-center px-2">
                  Ngừng kinh doanh
                </div>
              ) : isOutOfStock ? (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">
                  Hết hàng
                </div>
              ) : null}
            </div>

            {/* 2. PHẦN THÔNG TIN CHI TIẾT */}
            <div className="p-2 md:p-3 flex flex-col flex-grow">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">
                {product.brand}
              </p>
              <Link to={`/product/${product._id}`}>
                <h3 className="text-[12px] md:text-[14px] font-semibold text-gray-800 line-clamp-2 min-h-[32px] md:min-h-[40px] hover:text-[#1a4d32] leading-tight">
                  {product.name}
                </h3>
              </Link>

              <div className="mt-1 flex items-center gap-1">
                <div className="flex">{renderStars(product.rating || 0)}</div>
                <span className="text-gray-400 text-[9px]">
                  ({product.reviewCount})
                </span>
              </div>

              {/* 3. PHẦN GIÁ VÀ NÚT BẤM */}
              <div className="mt-auto pt-3">
                <div className="flex justify-start items-end min-h-[24px]">
                  <span
                    className={`font-bold text-sm md:text-base whitespace-nowrap ${canBuy ? "text-[#d71920]" : "text-gray-400"}`}
                  >
                    {product.price.toLocaleString("vi-VN")}₫
                  </span>
                  {hasDiscount && canBuy && (
                    <span className="text-gray-400 ml-1 line-through text-[11px] md:text-sm font-light">
                      {product.originalPrice?.toLocaleString("vi-VN")}₫
                    </span>
                  )}
                </div>

                {/* LOGIC NÚT BẤM DƯỚI CARD */}
                {canBuy ? (
                  <button className="w-full mt-2 py-2 border border-[#1a4d32] text-[#1a4d32] rounded-lg font-bold text-[10px] md:text-xs flex items-center justify-center gap-1.5 hover:bg-[#1a4d32] hover:text-white transition-all group/btn">
                    <ShoppingCart
                      size={14}
                      className="group-hover/btn:animate-bounce"
                    />
                    Thêm vào giỏ
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full mt-2 py-2 border border-gray-200 text-gray-400 bg-gray-50 rounded-lg font-bold text-[10px] md:text-xs flex items-center justify-center cursor-not-allowed"
                  >
                    {isStopSelling ? "NGỪNG KINH DOANH" : "HẾT HÀNG"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCard;
