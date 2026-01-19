import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <footer className="bg-ft w-full p-6 md:p-10 lg:p-12 text-white">
        {/* Phần trên: Giới thiệu + Hotline */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col justify-center items-center mb-10">
            <div className="mb-6 text-center">
              <h3 className="text-[#c2e6ba] font-bold text-xl md:text-2xl mb-3">
                ARTISANO
              </h3>
              <p className="font-extralight text-base md:text-lg mb-2">
                Mua Đệm, Chăn ga gối & Phụ kiện chính hãng đến ngay ARTISANO. Tư
                vấn cá nhân hoá, Nằm thử 120 đêm
              </p>
              <p className="font-extralight text-base md:text-lg">
                Đổi trả dễ, Giao tận nơi, Giá ưu đãi, Hỗ trợ trả góp 0%!
              </p>
            </div>

            <div className="w-full max-w-4xl">
              <h3 className="text-[#c2e6ba] font-bold text-lg md:text-xl mb-4 text-center">
                Hotline hỗ trợ
              </h3>
              <div className="bg-[#04341f] flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 px-6 md:px-2 py-4 md:py-2 rounded-lg">
                <div className="text-center">
                  <p className="text-[#c2e6ba] text-sm md:text-base">
                    Tư vấn mua hàng (Miễn phí)
                  </p>
                  <b className="text-gray-100 text-lg md:text-xl hover:underline block mt-1">
                    1900 6750
                  </b>
                </div>
                <div className="text-center">
                  <p className="text-[#c2e6ba] text-sm md:text-base">
                    Hỗ trợ kỹ thuật
                  </p>
                  <b className="text-gray-100 text-lg md:text-xl hover:underline block mt-1">
                    1900 6750
                  </b>
                </div>
                <div className="text-center">
                  <p className="text-[#c2e6ba] text-sm md:text-base">
                    Góp ý, khiếu nại
                  </p>
                  <b className="text-gray-100 text-lg md:text-xl hover:underline block mt-1">
                    1900 6750 <span className="text-sm">(8h00 - 22h00)</span>
                  </b>
                </div>
              </div>
            </div>
          </div>

          {/* Phần chính: 4 cột menu + thông tin liên hệ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12">
            {/* Cột 1:  ARTISANO */}
            <div>
              <h4 className="text-[#c2e6ba] font-bold text-lg mb-4 ">
                ARTISANO
              </h4>
              {/* Thông tin liên hệ */}
              <div className="mt-6">
                <p className="text-sm mb-2">
                  <strong>Email:</strong> duongb2204925@ctu.edu.vn
                </p>
                <p className="text-sm mb-2">
                  <strong>Hotline:</strong> 1900 6750
                </p>
                <p className="text-sm">
                  <strong>Địa chỉ:</strong> Đường 3/2, Phường Ninh Kiều, Thành
                  phố Cần Thơ, Việt Nam
                </p>
              </div>
            </div>

            {/* Cột 2: VỀ CHÚNG TÔI */}
            <div>
              <h4 className="text-[#c2e6ba] font-bold text-lg mb-4 uppercase">
                VỀ CHÚNG TÔI
              </h4>
              <ul className="space-y-2 text-sm md:text-base">
                <li>
                  <Link to="/about" className="hover:text-[#c2e6ba] transition">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-[#c2e6ba] transition"
                  >
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/brandstory"
                    className="hover:text-[#c2e6ba] transition"
                  >
                    Câu chuyện thương hiệu
                  </Link>
                </li>
                <li>
                  <Link
                    to="/awards"
                    className="hover:text-[#c2e6ba] transition"
                  >
                    Chứng nhận và giải thưởng
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 3: CHÍNH SÁCH BÁN HÀNG */}
            <div>
              <h4 className="text-[#c2e6ba] font-bold text-lg mb-4 uppercase">
                CHÍNH SÁCH BÁN HÀNG
              </h4>
              <ul className="space-y-2 text-sm md:text-base">
                <li>
                  <a href="#" className="hover:text-[#c2e6ba] transition">
                    Chính sách bảo hành
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c2e6ba] transition">
                    Chính sách đổi trả
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c2e6ba] transition">
                    Chính sách giao hàng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c2e6ba] transition">
                    Chính sách trả góp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c2e6ba] transition">
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>

            {/* Cột 4: DỊCH VỤ & THÔNG TIN KHÁC */}
            <div>
              <h4 className="text-[#c2e6ba] font-bold text-lg mb-4 uppercase">
                DỊCH VỤ & THÔNG TIN KHÁC
              </h4>
              <ul className="space-y-2 text-sm md:text-base">
                <li>
                  <a href="#" className="hover:text-[#c2e6ba] transition">
                    Chính sách vận chuyển
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c2e6ba] transition">
                    Khách hàng thân thiết
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c2e6ba] transition">
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#c2e6ba] transition">
                    Điều khoản & điều kiện
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Phần dưới cùng - Copyright */}
          <div className="border-t border-[#c2e6ba]/30 pt-6 text-center text-sm">
            <p>© {new Date().getFullYear()} ARTISANO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
