import { Link } from "react-router-dom";
import awardImage from "../assets/awards/awards.jpg";

import customerReviewImage from "../assets/chung-nhan-va-giai-thuong/flash-sale-3.webp";

const AwardsAndCertifications = () => {
  return (
    <div className="flex flex-col items-center w-full px-4 md:px-0 py-10">
      {/* Breadcrumb */}
      <nav className="w-full border-b border-gray-200 mb-8 md:mb-12">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-0 py-4 text-sm text-gray-500 uppercase tracking-wider">
          <span className="hover:text-green-800 cursor-pointer transition-colors duration-200">
            Trang chủ
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Chứng nhận & Giải thưởng</span>
        </div>
      </nav>

      <div className="w-full max-w-6xl">
        <h1 className="text-center text-4xl font-bold text-[#033d21] mb-12">
          Chứng Nhận & Giải Thưởng
        </h1>

        {/* Phần Giới thiệu chung */}
        <div className="text-center mb-16 px-4 md:px-10">
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Tại ARTISANO, chúng tôi tự hào về hành trình không ngừng nỗ lực mang
            đến giấc ngủ chất lượng cho mọi gia đình Việt. Những giải thưởng và
            chứng nhận dưới đây là minh chứng cho sự cam kết về chất lượng sản
            phẩm, dịch vụ vượt trội và niềm tin mà khách hàng đã dành tặng cho
            chúng tôi.
          </p>
        </div>

        {/* Phần Giải thưởng nổi bật */}
        <div className="bg-gradient-to-r from-[#e6f0e6] to-[#d9e6d9] p-8 md:p-12 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold text-[#033d21] mb-4">
              Giải thưởng "Thương hiệu Nệm được yêu thích nhất 2025"
            </h2>
            <p className="text-lg text-gray-800 leading-relaxed mb-6">
              Chúng tôi vô cùng vinh dự khi nhận được giải thưởng danh giá này,
              một sự công nhận từ cộng đồng và các chuyên gia trong ngành chăn
              ga gối nệm. Đây là động lực to lớn để ARTISANO tiếp tục đổi mới và
              phát triển.
            </p>
            <p className="text-base text-gray-600 italic">
              (Được trao bởi Hiệp hội Ngành Hàng Nội thất Việt Nam)
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src={awardImage}
              alt="Giải thưởng thương hiệu nệm được yêu thích nhất"
              className="w-64 h-64 md:w-80 md:h-80 object-cover"
            />
          </div>
        </div>

        {/* Phần Đánh giá từ Khách hàng */}
        <div className="bg-gray-50 p-8 md:p-12 rounded-2xl shadow-inner mb-16">
          <h2 className="text-center text-3xl font-bold text-[#033d21] mb-8">
            Khách Hàng Nói Về Chúng Tôi
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
            <div className="md:w-1/3 flex-shrink-0">
              <img
                src={customerReviewImage}
                alt="Khách hàng hài lòng"
                className="w-48 h-48 md:w-full md:h-auto rounded-full object-cover mx-auto shadow-lg"
              />
            </div>
            <div className="md:w-2/3 text-center md:text-left">
              <p className="text-xl italic text-gray-800 mb-4">
                "Tôi đã sử dụng nệm ARTISANO được hơn một năm và thực sự rất hài
                lòng. Giấc ngủ sâu hơn, không còn đau lưng và cảm thấy tràn đầy
                năng lượng mỗi sáng. Sản phẩm thực sự chất lượng và dịch vụ rất
                tận tâm!"
              </p>
              <p className="font-semibold text-lg text-[#4a8a68]">
                — Chị Trương Linh, Cần Thơ
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action (Thúc đẩy hành động) */}
        <div className="text-center py-12 bg-[#033d21] rounded-2xl text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-4">
            Trải Nghiệm Giấc Ngủ ARTISANO
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Khám phá các sản phẩm nệm và phụ kiện phòng ngủ cao cấp của chúng
            tôi để tự mình cảm nhận sự khác biệt.
          </p>
          <Link to="/collections/all">
            <button className="bg-[#4a8a68] hover:bg-[#6ec28c] text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md">
              Xem Sản Phẩm Ngay
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AwardsAndCertifications;
