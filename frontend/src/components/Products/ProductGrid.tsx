import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  StarHalf,
  Heart,
  CirclePlus,
  CheckCircle2,
} from "lucide-react";
import image_nem from "../../assets/about.webp";
import type { Product } from "./InterfaceItem";
import { useCompare } from "../common/Compare/CompareContext";
import { useWishlist } from "../common/WishlistContent";
import { toast } from "sonner";

interface ProductCardProps {
  products?: Product[];
  loading?: boolean;
  onSelect?: (product: Product) => void;
  selectedProductId?: string;
  isBundleMode?: boolean;
  isSliderMode?: boolean;
}

const ProductGrid: React.FC<ProductCardProps> = ({
  products = [],
  loading = false,
  onSelect,
  selectedProductId,
  isBundleMode = false,
  isSliderMode = false,
}) => {
  const { addToCompare, compareItems } = useCompare();
  const { addToWishlist, isInWishlist } = useWishlist();

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <Star
            key={i}
            size={14}
            className="fill-orange-400 text-orange-400"
          />,
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(
          <StarHalf
            key={i}
            size={14}
            className="fill-orange-400 text-orange-400"
          />,
        );
      } else {
        stars.push(
          <Star
            key={i}
            size={14}
            className="text-gray-300 dark:text-gray-600"
          />,
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="text-center py-10 font-medium text-gray-500 dark:text-gray-400">
        Đang tải sản phẩm...
      </div>
    );
  }

  return (
    <div
      className={
        isSliderMode
          ? "w-full"
          : `grid gap-4 md:gap-6 ${
              isBundleMode
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
            }`
      }
    >
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

        const isStopSelling = product.status === "stopselling";
        const isOutOfStock =
          product.status === "selling" && product.stock_quantity <= 0;
        const canBuy =
          product.status === "selling" && product.stock_quantity > 0;

        const isSelected = selectedProductId === product._id;
        const isFavorite = isInWishlist(product._id);
        const isComparing = compareItems.some(
          (item) => item._id === product._id,
        );

        return (
          <div
            key={product._id}
            className={`
              group rounded-xl border flex flex-col h-full overflow-hidden
              transition-all duration-300
              bg-white dark:bg-gray-800
              border-gray-200 dark:border-gray-700
              hover:shadow-lg dark:hover:shadow-black/30
              ${
                isBundleMode && isSelected
                  ? "ring-2 ring-green-500 scale-[1.01]"
                  : ""
              }
            `}
          >
            {/* IMAGE */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700">
              <Link to={`/product/${product._id}`} className="block h-full">
                <img
                  src={
                    product.images.find((img) => img.is_primary)?.url ||
                    product.images[0]?.url ||
                    image_nem
                  }
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    canBuy ? "group-hover:scale-110" : ""
                  }`}
                />
              </Link>

              {hasDiscount && canBuy && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  -{displayDiscount}%
                </div>
              )}

              {(isStopSelling || isOutOfStock) && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-white font-bold text-[10px] uppercase">
                  {isStopSelling ? "Ngừng kinh doanh" : "Hết hàng"}
                </div>
              )}

              {/* ICON ACTIONS */}
              {!isBundleMode && canBuy && (
                <div className="absolute top-2 -right-10 group-hover:right-2 transition-all duration-300 flex flex-col gap-2">
                  {/* Wishlist */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToWishlist(product);
                      toast.success(
                        isFavorite
                          ? "Đã xóa khỏi yêu thích"
                          : "Đã thêm vào yêu thích",
                      );
                    }}
                    className={`
                      p-1.5 rounded-full shadow-md transition-colors
                      ${
                        isFavorite
                          ? "bg-green-700 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-700 hover:text-white"
                      }
                    `}
                  >
                    <Heart
                      size={14}
                      className={isFavorite ? "fill-current" : ""}
                    />
                  </button>

                  {/* Compare */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCompare(product);
                    }}
                    className={`
                      p-1.5 rounded-full shadow-md transition-colors
                      ${
                        isComparing
                          ? "bg-green-700 text-white"
                          : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-700 hover:text-white"
                      }
                    `}
                  >
                    {isComparing ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <CirclePlus size={14} />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="p-3 flex flex-col flex-grow">
              <div className="flex-grow">
                <p className="text-[10px] uppercase font-bold tracking-widest mb-1 text-gray-400 dark:text-gray-500">
                  {product.brand}
                </p>

                <Link to={`/product/${product._id}`}>
                  <h3
                    className="text-sm font-bold line-clamp-2 h-10 leading-tight mb-2 transition-colors
                    text-gray-800 dark:text-gray-100
                    hover:text-green-700 dark:hover:text-green-400"
                  >
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">{renderStars(product.rating ?? 0)}</div>
                  <span className="text-gray-400 dark:text-gray-500 text-[10px]">
                    ({product.reviewCount ?? 0})
                  </span>
                </div>

                {hasDiscount && canBuy && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 dark:text-gray-500 line-through text-[11px]">
                      {product.originalPrice?.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-green-600 dark:text-green-400 text-[10px] font-bold">
                      -{displayDiscount}%
                    </span>
                  </div>
                )}

                <p
                  className={`font-black text-base mt-1 ${
                    canBuy
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {product.price.toLocaleString("vi-VN")}₫
                </p>
              </div>

              {/* BUTTON */}
              <div className="mt-4">
                <button
                  disabled={!canBuy}
                  className="
                    w-full py-2.5 rounded-lg font-bold text-[11px] uppercase
                    flex items-center justify-center gap-2
                    transition-all
                    bg-green-900 hover:bg-green-800
                    dark:bg-green-700 dark:hover:bg-green-600
                    text-white
                    disabled:bg-gray-200 dark:disabled:bg-gray-700
                  "
                >
                  {canBuy ? (
                    <>
                      <ShoppingCart size={14} /> THÊM VÀO GIỎ
                    </>
                  ) : isStopSelling ? (
                    "NGỪNG BÁN"
                  ) : (
                    "HẾT HÀNG"
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
