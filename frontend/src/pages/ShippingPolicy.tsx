import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 pt-32">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
        <div className="bg-gradient-to-r from-[#04341f] to-[#0a5c36] p-10 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -ml-16 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 -mr-16 w-32 h-32 bg-[#c2e6ba] opacity-10 rounded-full blur-2xl"></div>

          <h1 className="relative text-3xl md:text-5xl font-extrabold text-[#c2e6ba] tracking-tight drop-shadow-md">
            Chính Sách Vận Chuyển Theo Tuyến
          </h1>
          <p className="relative mt-4 text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto">
            Hệ thống logistic được đồng bộ chuyên nghiệp đảm bảo sản phẩm cồng kềnh như nệm luôn vẹn nguyên đến tận phòng ngủ của bạn.
          </p>
        </div>
        
        <div className="p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p className="lead italic mb-8">
            Việc vận chuyển các tảng nệm kích thước lớn và trọng lượng nặng luôn là một thách thức, tuy nhiên <strong className="text-gray-900 dark:text-white">HỆ THỐNG CỦA TÔI</strong> đã xây dựng quy trình chuyên biệt, mang lại trải nghiệm giao hàng thảnh thơi nhất trên 63 tỉnh thành toàn quốc.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">1. Biểu Phí Vận Chuyển</h2>
          <p className="mb-4">Chúng tôi hướng đến mang lại lợi ích tối đa cho khách hàng với nhiều chính sách trợ giá và miễn phí vận chuyển:</p>
          
          <div className="overflow-x-auto mb-8">
            <table className="w-full text-left border-collapse border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-4 border border-gray-200 dark:border-gray-600 font-bold text-gray-900 dark:text-white">Khu Vực Đầu Nhận</th>
                  <th className="p-4 border border-gray-200 dark:border-gray-600 font-bold text-gray-900 dark:text-white">Giá Trị Đơn Hàng</th>
                  <th className="p-4 border border-gray-200 dark:border-gray-600 font-bold text-gray-900 dark:text-white">Chi Phí Áp Dụng</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                <tr>
                  <td className="p-4 border border-gray-200 dark:border-gray-700">Nội thành TP tĩnh (Bán kính &lt; 30km)</td>
                  <td className="p-4 border border-gray-200 dark:border-gray-700">Chăn ga gối &gt; 1 Triệu<br/>Mua Nệm bất kỳ</td>
                  <td className="p-4 border border-gray-200 dark:border-gray-700 font-bold text-green-600 dark:text-green-400">Miễn Phí 100%</td>
                </tr>
                <tr>
                  <td className="p-4 border border-gray-200 dark:border-gray-700">Nội thành TP tĩnh (Bán kính &lt; 30km)</td>
                  <td className="p-4 border border-gray-200 dark:border-gray-700">Các đơn nhỏ lẻ dưới 1 Triệu</td>
                  <td className="p-4 border border-gray-200 dark:border-gray-700">30,000 VND - 50,000 VND</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-4 border border-gray-200 dark:border-gray-700">Ngoại thành / Liên Tỉnh (Trên 30km)</td>
                  <td className="p-4 border border-gray-200 dark:border-gray-700">Đơn mua nệm (Hàng nặng)</td>
                  <td className="p-4 border border-gray-200 dark:border-gray-700">Miễn Phí 30km đầu, KM tiếp theo phụ thu theo thỏa thuận chành xe (có trợ giá)</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-4 border border-gray-200 dark:border-gray-700">Ngoại thành / Liên Tỉnh (Ship COD)</td>
                  <td className="p-4 border border-gray-200 dark:border-gray-700">Chăn ga gối, phụ kiện</td>
                  <td className="p-4 border border-gray-200 dark:border-gray-700">Áp dụng theo cước phí Viettel Post, GHN... hiển thị ở giỏ hàng</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-10">2. Thời Gian Giao Hàng Dự Kiến</h2>
          <p className="mb-4">Tùy từng khu vực sẽ có sự khác biệt về lưu lượng giao thông và nhân sự xuất kho:</p>
          <ul className="list-none pl-0 space-y-4 mb-8">
            <li className="flex items-start">
              <span className="text-[#0a5c36] dark:text-[#c2e6ba] mr-3 font-bold text-xl mt-1">🚚</span>
              <div>
                <strong className="text-gray-900 dark:text-white block mb-1">Khu vực trung tâm thị xã / thành phố:</strong>
                <span className="text-gray-600 dark:text-gray-400">Giao nhanh trong 24 giờ kể từ khi xác nhận. Hỗ trợ chọn khung giờ hành chính.</span>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-[#0a5c36] dark:text-[#c2e6ba] mr-3 font-bold text-xl mt-1">📦</span>
              <div>
                <strong className="text-gray-900 dark:text-white block mb-1">Giao qua đối tác vận chuyển thứ 3:</strong>
                <span className="text-gray-600 dark:text-gray-400">Khu vực ngoại thành cấp huyện hoặc tỉnh nhỏ, thường dao động từ 3 - 6 ngày vận chuyển. Có mã Tracking Code cho khách tự theo dõi.</span>
              </div>
            </li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-10">3. Chính Sách Trách Nhiệm Với Hàng Hóa</h2>
          <ul className="list-disc pl-5 space-y-3 mb-8 marker:text-[#0a5c36] dark:marker:text-[#c2e6ba]">
            <li>Trường hợp đội ngũ giao hàng nội bộ của <strong>HỆ THỐNG CỦA TÔI</strong> phụ trách: Chúng tôi chịu hoàn toàn 100% rủi ro mất mát, trầy xước, dính bẩn trong toàn bộ đoạn đường đến nhà bạn. Nhân viên hỗ trợ mang lên phòng ngủ. Riêng trường hợp cầu thang ngõ hẹp không thể chuyển lên, chúng tôi không hỗ trợ các phương pháp cẩu kéo phá dỡ.</li>
            <li>Trường hợp giao qua Đối tác vận chuyển (Viettel Post...): Quý khách <strong>BẮT BUỘC ĐỒNG KIỂM</strong> - quay video hoặc chụp ảnh hàng hóa ngay khi nhận. Nếu phát hiện sai hàng, hư hỏng hộp, nilon bảo vệ bị rách rưới thảm hại: Xin vui lòng Từ chối nhận và gọi <strong>1900 6750</strong> để chúng tôi khiếu nại nhà vận chuyển. Rủi ro sau nghiệm thu chúng tôi sẽ không có căn cứ xử lý.</li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-10">4. Thay đổi lộ trình - Bảo lưu kho</h2>
          <p className="leading-relaxed mb-6">
            Nếu quý khách đang thi công nhà mới và muốn mua giữ ngay đợt ưu đãi, <strong>HỆ THỐNG CỦA TÔI</strong> hỗ trợ Lưu kho giữ hàng miễn phí lên tới 30 ngày (sau khi đã thanh toán hoặc đặt cọc định danh). Phù hợp cho kế hoạch chuyển nhà tân gia của gia đình bạn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
