import { Link } from "react-router-dom";
import notfound from "./../assets/notfound/404notfound.jpg";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col ">
      {/* Breadcrumb - Căn lề trái theo container chung */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-2 text-[10px] md:text-[11px] text-gray-400 uppercase tracking-wider">
          <Link to="/" className="hover:text-[#1a4d32] transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-gray-600 font-semibold">
            404 Không tìm thấy trang
          </span>
        </div>
      </div>

      {/* Nội dung chính - Căn giữa toàn bộ */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-[600px] mb-8">
          <img
            src={notfound}
            alt="404 Illustration with characters"
            className="w-full h-auto object-contain "
          />
        </div>

        {/* Khối Text và Button */}
        <div className="text-center space-y-4">
          <h1 className="text-xl md:text-3xl font-black text-gray-900 leading-tight">
            Oops! Trang bạn tìm kiếm không tồn tại.
          </h1>

          <div className="text-gray-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            <p>Chúng tôi không thể tìm thấy trang bạn yêu cầu.</p>
            <p>
              Bạn vui lòng trở lại trang chủ, thử tìm kiếm với từ khóa khác hoặc
              tiếp tục mua sắm!
            </p>
          </div>

          <div className="pt-6">
            <Link
              to="/"
              className="inline-block bg-[#1a4d32] text-white px-8 py-3 rounded font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-[#143a26] transition-all shadow-lg "
            >
              Trở về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
