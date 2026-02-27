import { useState } from "react";
import { Star, ImageIcon, CheckCircle } from "lucide-react";

interface Review {
  id: number;
  user: string;
  star: number;
  content: string;
  date: string;
  hasImage: boolean;
  userAvatar: string;
}

interface ProductReviewsProps {
  reviews: Review[];
  reviewCount: number;
  averageRating?: number;
}

function ProductReviews({
  reviews,
  reviewCount,
  averageRating = 4.9,
}: ProductReviewsProps) {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "image" | 1 | 2 | 3 | 4 | 5
  >("all");

  const filteredReviews = reviews.filter((rev) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "image") return rev.hasImage;
    return rev.star === activeFilter;
  });

  return (
    <div
      className="
        bg-[#FBFBFB] dark:bg-gray-900
        text-gray-900 dark:text-gray-100
        rounded-2xl sm:rounded-[32px] lg:rounded-[40px]
        p-5 sm:p-8 lg:p-12
        mb-12 sm:mb-16 lg:mb-24
        border border-gray-50 dark:border-gray-700
        transition-colors duration-300
      "
    >
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 mb-10 lg:mb-16">
        {/* Rating tổng */}
        <div className="text-center lg:text-left">
          <p className="text-5xl sm:text-6xl lg:text-7xl font-black text-green-900 dark:text-green-400 mb-2 tracking-tighter">
            {averageRating.toFixed(1)}
          </p>

          <div className="flex text-orange-400 justify-center lg:justify-start mb-3 sm:mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill="currentColor" />
            ))}
          </div>

          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">
            Dựa trên {reviewCount} đánh giá
          </p>
        </div>

        {/* Bộ lọc */}
        <div className="flex flex-wrap gap-3 flex-1">
          {/* Tất cả */}
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all ${
              activeFilter === "all"
                ? "bg-green-900 dark:bg-green-600 border-green-900 dark:border-green-600 text-white"
                : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-300"
            }`}
          >
            Tất cả
          </button>

          {/* Lọc theo sao */}
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setActiveFilter(s as 1 | 2 | 3 | 4 | 5)}
              className={`px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all ${
                activeFilter === s
                  ? "bg-green-900 dark:bg-green-600 border-green-900 dark:border-green-600 text-white"
                  : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-300"
              }`}
            >
              {s} Điểm
            </button>
          ))}

          {/* Có hình ảnh */}
          <button
            onClick={() => setActiveFilter("image")}
            className={`px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeFilter === "image"
                ? "bg-green-900 dark:bg-green-600 border-green-900 dark:border-green-600 text-white"
                : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-300"
            }`}
          >
            <ImageIcon size={16} />
            Có hình ảnh
          </button>
        </div>
      </div>

      {/* Danh sách bình luận */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="
              bg-white dark:bg-gray-800
              p-6
              rounded-3xl
              shadow-sm
              border border-gray-50 dark:border-gray-700
              transition-colors duration-300
            "
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={rev.userAvatar}
                  className="w-12 h-12 rounded-full object-cover"
                  alt="avatar"
                />
                <div>
                  <h4 className="font-black text-sm uppercase flex items-center gap-2">
                    {rev.user}
                    <CheckCircle
                      size={14}
                      className="text-blue-500"
                      fill="currentColor"
                    />
                  </h4>

                  <div className="flex text-orange-400">
                    {[...Array(rev.star)].map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 italic uppercase">
                {rev.date}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm italic mb-4">
              "{rev.content}"
            </p>

            {rev.hasImage && (
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img
                  src={rev.userAvatar}
                  className="w-full h-full object-cover"
                  alt="review"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductReviews;
