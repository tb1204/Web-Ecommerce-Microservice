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
              <h4 className="text-[#c2e6ba] font-bold text-lg mb-4">
                NHẬN THÔNG BÁO
              </h4>
              <p className=" mb-4">
                Nhận tin hàng mới, ưu đãi độc quyền đăng ký ngay!
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c2e6ba] transition-all text-gray-700 placeholder-gray-400"
                  required
                />

                {/* <button
                  type="submit"
                  className="bg-[#c2e6ba] text-[#04341f] px-6 py-3 text-sm font-bold rounded-lg hover:bg-white hover:scale-105 transition-all whitespace-nowrap shadow-lg uppercase"
                >
                  Đăng ký
                </button> */}
                <button
                  type="submit"
                  className=" bg-[#c2e6ba] text-[#04341f]  px-6 py-3 text-sm font-bold rounded-lg uppercase whitespace-nowrap transition-colors duration-200 
    hover:bg-white  active:opacity-80 focus:outline-none "
                >
                  Đăng ký
                </button>
              </form>
            </div>

            {/* Cột 2: VỀ CHÚNG TÔI */}

            <div>
              <h4 className="text-[#c2e6ba] font-bold text-lg mb-4">
                ARTISANO
              </h4>
              {/* Chuyển thành ul để đồng bộ với 3 cột kia */}
              <ul className="space-y-2">
                <li>
                  <strong className="font-semibold">Email:</strong>{" "}
                  <a
                    href="mailto:duongb2204925@ctu.edu.vn"
                    className="hover:text-[#c2e6ba] transition"
                  >
                    duongb2204925@ctu.edu.vn
                  </a>
                </li>
                <li>
                  <strong className="font-semibold">Hotline:</strong>{" "}
                  <a
                    href="tel:19006750"
                    className="hover:text-[#c2e6ba] transition"
                  >
                    1900 6750
                  </a>
                </li>
                <li>
                  <strong className="font-semibold">Địa chỉ:</strong> Đường 3/2,
                  Phường Ninh Kiều, Thành phố Cần Thơ, Việt Nam
                </li>
              </ul>
            </div>

            {/* Cột 3: VỀ CHÚNG TÔI */}
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

            {/* Cột 4: CHÍNH SÁCH BÁN HÀNG */}
            <div>
              <h4 className="text-[#c2e6ba] font-bold text-lg mb-4 uppercase">
                CHÍNH SÁCH BÁN HÀNG
              </h4>
              <ul className="space-y-2 text-sm md:text-base">
                <li>
                  <Link to="/warranty-policy" className="hover:text-[#c2e6ba] transition">
                    Chính sách bảo hành
                  </Link>
                </li>
                <li>
                  <Link to="/return-policy" className="hover:text-[#c2e6ba] transition">
                    Chính sách đổi trả
                  </Link>
                </li>
                <li>
                  <Link to="/shipping-policy" className="hover:text-[#c2e6ba] transition">
                    Chính sách giao hàng
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-[#c2e6ba] transition">
                    Chính sách bảo mật
                  </Link>
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
