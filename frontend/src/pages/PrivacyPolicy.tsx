import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 pt-32">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
        <div className="bg-gradient-to-r from-[#04341f] to-[#0a5c36] p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#c2e6ba] opacity-5 rounded-full blur-3xl"></div>
          
          <h1 className="relative text-3xl md:text-5xl font-extrabold text-[#c2e6ba] tracking-tight drop-shadow-md">
            Chính Sách Bảo Mật Bức Tường Lửa
          </h1>
          <p className="relative mt-4 text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto">
            Tại HỆ THỐNG CỦA TÔI, mọi dữ liệu hành vi thu thập đều xoay quanh việc phục vụ lợi ích lâu dài của quý khách với công nghệ mã hóa tối tân.
          </p>
        </div>
        
        <div className="p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p className="lead italic mb-8">
            Thông qua thao tác truy cập, sử dụng hệ thống web, tạo tài khoản cá nhân đăng nhập hay thực hiện các bước Checkout mua nệm/chăn ga tại <strong className="text-gray-900 dark:text-white">HỆ THỐNG CỦA TÔI</strong>, quý khách cam kết đã đọc và tự nguyện đồng thuận tuân thủ các quy định dưới đây.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">1. Phân Lớp Mục Đích Của Việc Thu Thập Thông Tin Cá Nhân</h2>
          <p className="mb-4">Những dữ liệu mà quý khách tự nguyện khai báo hoặc hệ thống nhận diện từ Cookie (họ tên, e-mail, điện thoại, địa chỉ IP giao hàng nhận) sẽ được sử dụng cho các mục đích thiết yếu và tích cực sau:</p>
          <ul className="list-none pl-0 space-y-4 mb-8">
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1 opacity-80 text-xl">🎯</span>
              <span><strong>Xử lý đơn hàng cốt lõi:</strong> Hỗ trợ thiết lập chứng từ mua hàng, cung cấp địa chỉ cho bộ phận kế toán và đơn vị Logistic đi giao hàng, xác nhận nhận khoản tiền thanh toán.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1 opacity-80 text-xl">🎯</span>
              <span><strong>Chăm sóc hậu mãi liên tục:</strong> Ghi nhận dữ liệu thời hạn cấu trúc để tự động nhắc lịch chăm sóc, vệ sinh nệm định kỳ, đổi quà tặng, và xử lý bảo hành tại nhà.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-3 mt-1 opacity-80 text-xl">🎯</span>
              <span><strong>Theo dõi người dùng tinh tế (UI/UX):</strong> Sử dụng lịch sử lướt xem nệm lưới để đề xuất dòng nệm làm mát, nệm kháng khuẩn theo đúng sở thích, tối ưu hóa giao diện ứng dụng sao cho dễ dùng hơn.</span>
            </li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-10">2. Mạng Lưới Đơn Vị Được Phép Chia Sẻ Khai Thác Nội Bộ</h2>
          <p className="mb-4">Chúng tôi áp dụng cam kết pháp lý: Tuyệt đối Không Mua Bán - Trao Đổi dữ liệu ra ngoài với mục đích thương mại tiếp thị độc hại. Tuy nhiên, thông tin sẽ được chia sẻ giới hạn trong một số trường hợp hợp tác vận hành cho hệ sinh thái:</p>
          <ul className="list-disc pl-5 space-y-3 mb-8 marker:text-[#0a5c36] dark:marker:text-[#c2e6ba]">
            <li><strong>Nhà cung cấp dịch vụ giao vận (Logistic):</strong> Chia sẻ tên, địa chỉ sđt, giá trị COD để tiến hành đi tuyến vận chuyển (AhaMove, Giao hàng nhanh, nội bộ xe công ty...).</li>
            <li><strong>Cổng thanh toán tự động điện tử:</strong> VNPay, MoMo, tích hợp giao dịch chuyển khoản bảo mật ngân hàng nhằm xác minh giao dịch chuẩn xác, không chia sẻ thẻ tín dụng.</li>
            <li><strong>Theo yêu cầu của Cơ quan ban ngành:</strong> Cung cấp nếu có yêu cầu tư pháp theo quy định Pháp Luật VN.</li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-10">3. Thời Gian Duy Trì Giữ Dữ Liệu Hồ Sơ</h2>
          <p className="leading-relaxed mb-8">
            Dữ liệu cá nhân cung cấp từ khách hàng sẽ được hệ thống lưu trữ có bảo mật cơ sở dữ liệu trên Cloud Server liên tục vô thời hạn. Điều kiện chấm dứt xảy ra khi: (1) Ban quản trị quyết định thanh lọc dữ liệu định kỳ với tài khoản mạn hạn, (2) Đích thân khách hàng vào mục User Profile, yêu cầu Xóa Tài Khoản vĩnh viễn trên server máy chủ.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-10">4. Bảo Hộ Phương Thức Thanh Toán Ngân Hàng Số</h2>
          <p className="leading-relaxed mb-6">
            Mọi thẻ tín dụng hay thẻ ghi nợ bạn tiến hành giao dịch đều được mã hóa theo chứng chỉ SSL 256 bits, đạt tiêu chuẩn quốc tế bảo mật hệ thống thanh toán điện tử. Đội ngũ kỹ sư <strong>HỆ THỐNG CỦA TÔI</strong> và các đối tác giám sát chặt chẽ hệ thống ngăn ngừa Ddos, SQL injection, hay dò rỉ chéo sang các trang lừa đảo.
          </p>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/50 relative overflow-hidden flex items-start">
            <div className="text-4xl mr-4 mt-1 opacity-70">🛡️</div>
            <div>
              <h4 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-2">Quyền Lợi & Giám Sát Của Quý Khách</h4>
              <p className="text-blue-800 dark:text-blue-100/80 leading-relaxed text-base">
                Quý khách có thể tự thay đổi, đính chính bổ sung thông tin qua khu vực Trang Quản Trị cá nhân. Mọi phản ánh nghi ngờ có trục lợi dữ liệu, xin vui lòng gọi Tổng đài Giải Quyết Khiếu Nại riêng lập tứ trực 24/7.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
