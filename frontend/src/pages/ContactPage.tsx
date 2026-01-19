import { MapPin, Phone, Mail } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans text-gray-800">
      {/* Breadcrumb đơn giản */}
      <nav className="text-sm text-gray-500 mb-6 uppercase tracking-wider">
        <span className="hover:text-green-800 cursor-pointer">Trang chủ</span>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Liên hệ</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* CỘT TRÁI: THÔNG TIN & FORM */}
        <div>
          <h1 className="text-3xl font-bold mb-4">ARTISANO</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Mua Đệm, Chăn ga gối & Phụ kiện chính hãng đến ngay ARTISANO. Tư vấn
            cá nhân hoá, Nằm thử 120 đêm, Đổi trả dễ, Giao tận nơi, Giá ưu đãi,
            Hỗ trợ trả góp 0%!
          </p>

          {/* Danh sách thông tin trực tiếp */}
          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <p>
                <span className="font-bold">Địa chỉ:</span> Đường 3/2, Phường
                Ninh Kiều, Thành phố Cần Thơ, Việt Nam
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <p>
                <span className="font-bold">Hotline:</span> 1900 6750
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <p>
                <span className="font-bold">Email:</span>{" "}
                duongb2204925@student.ctu.edu.vn
              </p>
            </div>
          </div>

          {/* Form liên hệ */}
          <div>
            <h2 className="text-xl font-bold mb-6">Liên hệ với chúng tôi</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Họ và tên*"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-800"
                  required
                />
                <input
                  type="email"
                  placeholder="Email*"
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-800"
                  required
                />
              </div>
              <input
                type="tel"
                placeholder="Điện thoại*"
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-800"
                required
              />
              <textarea
                placeholder="Nội dung*"
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-800"
                required
              ></textarea>

              <button
                type="submit"
                className="w-full bg-[#004225] text-white font-bold py-3 rounded-md hover:bg-green-900 transition-colors tracking-widest uppercase text-sm"
              >
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>

        {/* CỘT PHẢI: BẢN ĐỒ */}
        <div className="h-[500px] lg:h-auto min-h-[400px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <iframe
            title="Đại học Cần Thơ Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8415184082086!2d105.7684266102377!3d10.02993369003507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBD4bqnbiBUaMah!5e0!3m2!1svi!2s!4v1715832000000!5m2!1svi!2s"
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
