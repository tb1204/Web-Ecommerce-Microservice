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
  averageRating?: number; // có thể truyền vào nếu tính động sau này
}

export default function ProductReviews({
  reviews,
  reviewCount,
  averageRating = 4.9,
}: ProductReviewsProps) {
  const [filterStar, setFilterStar] = useState(0);
  const [filterHasImage, setFilterHasImage] = useState(false);

  const filteredReviews = reviews.filter((rev) => {
    const matchStar = filterStar === 0 || rev.star === filterStar;
    const matchImg = !filterHasImage || rev.hasImage;
    return matchStar && matchImg;
  });

  return (
    <div
      className="
        bg-[#FBFBFB] 
        rounded-2xl sm:rounded-[32px] lg:rounded-[40px]
        p-5 sm:p-8 lg:p-12
        mb-12 sm:mb-16 lg:mb-24
        border border-gray-50
      "
    >
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 mb-10 lg:mb-16">
        {/* Rating tổng */}
        <div className="text-center lg:text-left">
          <p className="text-5xl sm:text-6xl lg:text-7xl font-black text-green-900 mb-2 tracking-tighter">
            {averageRating.toFixed(1)}
          </p>

          <div className="flex text-orange-400 justify-center lg:justify-start mb-3 sm:mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className="sm:hidden"
                fill="currentColor"
              />
            ))}
            {[...Array(5)].map((_, i) => (
              <Star
                key={`lg-${i}`}
                size={20}
                className="hidden sm:block"
                fill="currentColor"
              />
            ))}
          </div>

          <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest italic">
            Dựa trên {reviewCount} đánh giá
          </p>
        </div>

        {/* Bộ lọc */}
        <div className="flex flex-wrap gap-2 sm:gap-3 flex-1">
          <button
            onClick={() => setFilterStar(0)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
              filterStar === 0
                ? "bg-green-900 border-green-900 text-white"
                : "bg-white border-gray-100 text-gray-400"
            }`}
          >
            Tất cả
          </button>

          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStar(s)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                filterStar === s
                  ? "bg-green-900 border-green-900 text-white"
                  : "bg-white border-gray-100 text-gray-400"
              }`}
            >
              {s} Điểm
            </button>
          ))}

          <button
            onClick={() => setFilterHasImage(!filterHasImage)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1 sm:gap-2 ${
              filterHasImage
                ? "bg-green-900 border-green-900 text-white"
                : "bg-white border-gray-100 text-gray-400"
            }`}
          >
            <ImageIcon size={14} className="sm:hidden" />
            <ImageIcon size={16} className="hidden sm:block" />
            Có hình ảnh
          </button>
        </div>
      </div>

      {/* Danh sách bình luận */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-50"
          >
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={rev.userAvatar}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  alt="avatar"
                />
                <div>
                  <h4 className="font-black text-xs sm:text-sm uppercase flex items-center gap-2">
                    {rev.user}
                    <CheckCircle
                      size={14}
                      className="text-blue-500"
                      fill="currentColor"
                    />
                  </h4>
                  <div className="flex text-orange-400">
                    {[...Array(rev.star)].map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className="sm:size-[12px]"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-300 italic uppercase whitespace-nowrap">
                {rev.date}
              </span>
            </div>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 italic">
              "{rev.content}"
            </p>

            {rev.hasImage && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border">
                <img
                  src={rev.userAvatar} // hoặc dùng ảnh review riêng nếu có
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
