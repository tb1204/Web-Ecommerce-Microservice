// import { useState } from "react";
// import { Star, ImageIcon, CheckCircle } from "lucide-react";

// interface Review {
//   id: number;
//   user: string;
//   star: number;
//   content: string;
//   date: string;
//   hasImage: boolean;
//   userAvatar: string;
// }

// interface ProductReviewsProps {
//   reviews: Review[];
//   reviewCount: number;
//   averageRating?: number;
// }

// function ProductReviews({
//   reviews,
//   reviewCount,
//   averageRating = 4.9,
// }: ProductReviewsProps) {
//   const [activeFilter, setActiveFilter] = useState<
//     "all" | "image" | 1 | 2 | 3 | 4 | 5
//   >("all");

//   const filteredReviews = reviews.filter((rev) => {
//     if (activeFilter === "all") return true;
//     if (activeFilter === "image") return rev.hasImage;
//     return rev.star === activeFilter;
//   });

//   return (
//     <div
//       className="
//         bg-[#FBFBFB] dark:bg-gray-900
//         text-gray-900 dark:text-gray-100
//         rounded-2xl sm:rounded-[32px] lg:rounded-[40px]
//         p-5 sm:p-8 lg:p-12
//         mb-12 sm:mb-16 lg:mb-24
//         border border-gray-50 dark:border-gray-700
//         transition-colors duration-300
//       "
//     >
//       {/* HEADER */}
//       <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12 mb-10 lg:mb-16">
//         {/* Rating tổng */}
//         <div className="text-center lg:text-left">
//           <p className="text-5xl sm:text-6xl lg:text-7xl font-black text-green-900 dark:text-green-400 mb-2 tracking-tighter">
//             {averageRating.toFixed(1)}
//           </p>

//           <div className="flex text-orange-400 justify-center lg:justify-start mb-3 sm:mb-4">
//             {[...Array(5)].map((_, i) => (
//               <Star key={i} size={20} fill="currentColor" />
//             ))}
//           </div>

//           <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">
//             Dựa trên {reviewCount} đánh giá
//           </p>
//         </div>

//         {/* Bộ lọc */}
//         <div className="flex flex-wrap gap-3 flex-1">
//           {/* Tất cả */}
//           <button
//             onClick={() => setActiveFilter("all")}
//             className={`px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all ${
//               activeFilter === "all"
//                 ? "bg-green-900 dark:bg-green-600 border-green-900 dark:border-green-600 text-white"
//                 : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-300"
//             }`}
//           >
//             Tất cả
//           </button>

//           {/* Lọc theo sao */}
//           {[5, 4, 3, 2, 1].map((s) => (
//             <button
//               key={s}
//               onClick={() => setActiveFilter(s as 1 | 2 | 3 | 4 | 5)}
//               className={`px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all ${
//                 activeFilter === s
//                   ? "bg-green-900 dark:bg-green-600 border-green-900 dark:border-green-600 text-white"
//                   : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-300"
//               }`}
//             >
//               {s} Điểm
//             </button>
//           ))}

//           {/* Có hình ảnh */}
//           <button
//             onClick={() => setActiveFilter("image")}
//             className={`px-6 py-3 rounded-2xl border-2 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
//               activeFilter === "image"
//                 ? "bg-green-900 dark:bg-green-600 border-green-900 dark:border-green-600 text-white"
//                 : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-300"
//             }`}
//           >
//             <ImageIcon size={16} />
//             Có hình ảnh
//           </button>
//         </div>
//       </div>

//       {/* Danh sách bình luận */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {filteredReviews.map((rev) => (
//           <div
//             key={rev.id}
//             className="
//               bg-white dark:bg-gray-800
//               p-6
//               rounded-3xl
//               shadow-sm
//               border border-gray-50 dark:border-gray-700
//               transition-colors duration-300
//             "
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={rev.userAvatar}
//                   className="w-12 h-12 rounded-full object-cover"
//                   alt="avatar"
//                 />
//                 <div>
//                   <h4 className="font-black text-sm uppercase flex items-center gap-2">
//                     {rev.user}
//                     <CheckCircle
//                       size={14}
//                       className="text-blue-500"
//                       fill="currentColor"
//                     />
//                   </h4>

//                   <div className="flex text-orange-400">
//                     {[...Array(rev.star)].map((_, i) => (
//                       <Star key={i} size={12} fill="currentColor" />
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <span className="text-xs font-bold text-gray-400 dark:text-gray-500 italic uppercase">
//                 {rev.date}
//               </span>
//             </div>

//             <p className="text-gray-600 dark:text-gray-300 text-sm italic mb-4">
//               "{rev.content}"
//             </p>

//             {rev.hasImage && (
//               <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
//                 <img
//                   src={rev.userAvatar}
//                   className="w-full h-full object-cover"
//                   alt="review"
//                 />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ProductReviews;
import { useState, useEffect } from "react";
import { Star, CheckCircle, X, Camera, Loader2, Send } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "sonner";

interface ReviewResponse {
  id: string;
  username: string;
  rating: number;
  comment: string;
  images: string[];
  adminReplyContent?: string;
  createAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

const REVIEW_API = "http://localhost:8088/api/reviews"; 

function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, isSignedIn } = useUser();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [activeFilter, setActiveFilter] = useState<"all" | "image" | 1 | 2 | 3 | 4 | 5>("all");
  
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formImageFiles, setFormImageFiles] = useState<File[]>([]); 
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); 

  const fetchReviewData = async () => {
    if (!productId) return;
    try {
      const [resReviews, resRating] = await Promise.all([
        axios.get(`${REVIEW_API}/product/${productId}`),
        axios.get(`${REVIEW_API}/rating/${productId}`)
      ]);
      setReviews(resReviews.data || []);
      setAverageRating(resRating.data || 0);
    } catch (err) { console.warn("ReviewService Offline"); }
  };

  useEffect(() => { fetchReviewData(); }, [productId]);


  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    setFormImageFiles(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    e.target.value = ""; // Reset input để chọn lại file cũ nếu muốn
  };

  const removeSelectedImage = (index: number) => {
    setFormImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async () => {
    if (!isSignedIn) return toast.error("Đăng nhập mới đánh giá được!");
    if (!formComment.trim()) return toast.error("Nhập cảm nhận của bạn!");
    
    setIsSubmitting(true);
    const toastId = toast.loading("Đang kiểm tra đơn hàng và xử lý ảnh...");

    const formData = new FormData();
    
    const reviewData = {
      productId,
      userId: user?.id,
      userName: user?.fullName || "Khách hàng",
      comment: formComment,
      rating: formRating
    };

    // Append JSON dưới dạng Blob để Spring Boot @RequestPart hiểu được
    formData.append("review", new Blob([JSON.stringify(reviewData)], { type: "application/json" }));

    // Append danh sách file ảnh
    formImageFiles.forEach(file => {
      formData.append("images", file);
    });

    try {
      await axios.post(`${REVIEW_API}/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      toast.success("Đánh giá thành công! ", { id: toastId });
      
      // Reset Form
      setFormComment(""); setFormImageFiles([]); setImagePreviews([]); setFormRating(5);
      fetchReviewData();
    } catch (err: any) {
      console.error("Lỗi gửi review:", err);
      const errorMessage = err.response?.data?.message || "Bạn đã dùng hết lượt đánh giá cho các lần mua sản phẩm này rồi!";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = reviews.filter((rev) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "image") return rev.images && rev.images.length > 0;
    return rev.rating === activeFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-10">
      <div className="bg-white dark:bg-gray-800 rounded-[32px] p-6 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-green-800 rounded-full"></div>
          <h3 className="text-2xl font-black uppercase italic text-gray-900 dark:text-white tracking-tighter">Viết đánh giá của bạn</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Bạn chấm mấy sao?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={32} onClick={() => setFormRating(s)} fill={s <= formRating ? "#166534" : "none"} className={`cursor-pointer transition-all hover:scale-110 ${s <= formRating ? "text-green-800" : "text-gray-200"}`} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Thêm hình ảnh</p>
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((url, i) => (
                  <div key={i} className="relative w-16 h-16">
                    <img src={url} className="w-full h-full object-cover rounded-xl border" />
                    <button onClick={() => removeSelectedImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm">
                      <X size={10}/>
                    </button>
                  </div>
                ))}
                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-green-800">
                  <Camera size={20} />
                  <input type="file" hidden accept="image/*" multiple onChange={handleImageSelect} />
                </label>
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 space-y-4">
             <textarea value={formComment} onChange={(e) => setFormComment(e.target.value)} placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm nhé..." className="w-full h-32 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-green-800 focus:bg-white outline-none text-sm dark:text-white" />
             <button onClick={handleSubmitReview} disabled={isSubmitting} className="w-full py-4 bg-green-900 text-white rounded-2xl font-black uppercase text-xs hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Gửi đánh giá ngay"} <Send size={16} />
             </button>
          </div>
        </div>
      </div>

      {/* DANH SÁCH ĐÁNH GIÁ */}
      <div className="bg-[#FBFBFB] dark:bg-gray-900 rounded-[40px] p-6 sm:p-10 border border-gray-50 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-6">
            <p className="text-6xl font-black text-green-900 dark:text-green-400 tracking-tighter">{averageRating.toFixed(1)}</p>
            <div>
              <div className="flex text-orange-400 mb-1">
                {[...Array(5)].map((_, i) => (<Star key={i} size={18} fill={i < Math.round(averageRating) ? "currentColor" : "none"} />))}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dựa trên {reviews.length} đánh giá</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveFilter("all")} className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase ${activeFilter === "all" ? "bg-green-900 text-white border-green-900" : "text-gray-400"}`}>Tất cả</button>
            <button onClick={() => setActiveFilter("image")} className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase ${activeFilter === "image" ? "bg-green-900 text-white border-green-900" : "text-gray-400"}`}>Có hình ảnh</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="bg-white dark:bg-gray-800 p-6 rounded-[24px] shadow-sm border border-gray-50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-black text-sm">
                    {rev.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase flex items-center gap-2">{rev.username} <CheckCircle size={12} className="text-blue-500" fill="currentColor" /></h4>
                    <div className="flex text-orange-400">
                      {[...Array(5)].map((_, i) => (<Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} />))}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-gray-300 uppercase">{new Date(rev.createAt).toLocaleDateString("vi-VN")}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-xs italic mb-4 leading-relaxed">"{rev.comment}"</p>
              {rev.images && rev.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {rev.images.map((imgUrl, idx) => (<img key={idx} src={imgUrl} className="w-14 h-14 rounded-lg object-cover border" alt="review" />))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductReviews;