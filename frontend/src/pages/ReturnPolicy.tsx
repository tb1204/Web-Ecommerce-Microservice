import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 pt-32">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
        <div className="bg-gradient-to-r from-[#04341f] to-[#0a5c36] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-10 -mt-10 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          <div className="absolute bottom-5 right-5 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>

          <h1 className="relative text-3xl md:text-5xl font-extrabold text-[#c2e6ba] tracking-tight drop-shadow-md">
            Chính Sách Đổi Trả Sản Phẩm
          </h1>
          <p className="relative mt-4 text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto">
            Quyền lợi Nằm thử ngủ thật - Thảnh thơi đổi trả dễ dàng, an tâm quyết định cùng HỆ THỐNG CỦA TÔI!
          </p>
        </div>
        
        <div className="p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p className="lead italic mb-8">
            Chúng tôi hiểu rằng một bộ nệm mới cần thời gian để cơ thể bạn làm quen. Do đó, <strong>HỆ THỐNG CỦA TÔI</strong> đưa ra đặc quyền "Ngủ thử lên đến 120 đêm" mang tính tiên phong, nhằm tạo sự an tâm tuyệt đối khi khách hàng đầu tư vào chất lượng giấc ngủ.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">1. Chương Trình Nằm Thử 120 Đêm Dành Cho Nệm</h2>
          <p className="mb-4">Đây là chương trình mang tính trọng điểm giúp kết nối cơ thể và cấu trúc nệm, cho phép quý khách thay đổi quyết định nếu nệm quá mềm, hoặc quá cứng. Cụ thể:</p>
          <ul className="list-disc pl-5 space-y-3 mb-8 marker:text-[#0a5c36] dark:marker:text-[#c2e6ba]">
            <li><strong>Trong vòng 30 đêm đầu tiên:</strong> Khách hàng được quyền đổi sang mẫu nệm khác cùng kích thước (bù trừ chênh lệch giá trị) <strong>KHÔNG mất phí khấu hao sản phẩm</strong>. (Khách hàng chỉ chịu chi phí vận chuyển 2 chiều đổi).</li>
            <li><strong>Từ đêm thứ 31 đến đêm thứ 120:</strong> Khách hàng sẽ phải chịu mức phí khấu hao theo chính sách của công ty áp dụng (Dao động từ 15% - 30% giá trị nệm tùy cấp độ thời gian) + Chi phí vận chuyển đổi hàng 2 chiều.</li>
            <li>Sản phẩm đổi phải có giá trị tương đương hoặc lớn hơn sản phẩm cũ (trong trường hợp giá nhỏ hơn, HỆ THỐNG CỦA TÔI không hoàn lại phần tiền chênh lệch này).</li>
            <li><strong>Lưu ý:</strong> Mỗi sản phẩm/Đơn hàng chỉ được hưởng chương trình đổi do nằm thử duy nhất 1 lần.</li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-10">2. Chính Sách Đổi Trả Chăn Ga Gối và Phụ Kiện</h2>
          <ul className="list-disc pl-5 space-y-3 mb-8 marker:text-[#0a5c36] dark:marker:text-[#c2e6ba]">
            <li><strong>Phụ kiện, chăn ga, đồ tiêu hao:</strong> Chỉ chấp nhận đổi trong thời hạn <strong>7 - 30 ngày</strong> với điều kiện sản phẩm CHƯA qua sử dụng, chưa qua giặt tẩy, tem nhãn bao bì vỡn nguyên vẹn 100%.</li>
            <li>Trường hợp nhận hàng phát hiện rách, đứt chỉ, lủng lỗ ngay tại thời điểm đồng kiểm hoặc trong vòng 24h: <strong>HỆ THỐNG CỦA TÔI</strong> đổi mới 100% không chịu bất kì phí nào.</li>
            <li>Quà tặng kèm theo không được áp dụng đổi trả hay quy đổi ra tiền mặt.</li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-10">3. Điều Kiện Bắt Buộc Khi Đổi Trả</h2>
          <p className="mb-4">Dù đang trong khu vực thời gian đổi trả hay nằm thử linh hoạt, nệm/phụ kiện của quý khách vẫn phải đáp ứng một cách tuyệt đối những tiêu chuẩn sau:</p>
          <ul className="list-none pl-0 space-y-4 mb-8">
            <li className="flex items-start bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
              <span className="text-[#0a5c36] dark:text-[#c2e6ba] mr-4 font-bold text-2xl leading-none mt-1">✓</span>
              <span><strong>Không hư hại vật lý:</strong> Sản phẩm không bị lấm bẩn, ố vàng, không có mùi hôi hắc ám khói, không ngấm chất lỏng sinh hoạt, không rách da bọc hoặc lủng lỗ kim tiêm/vật sắc nhọn.</span>
            </li>
            <li className="flex items-start bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
              <span className="text-[#0a5c36] dark:text-[#c2e6ba] mr-4 font-bold text-2xl leading-none mt-1">✓</span>
              <span><strong>Đủ chứng từ hợp lệ:</strong> Sản phẩm được giữ toàn bộ tem (Tag) logo (có thể tháo rời nhưng không mất vỏ hộp/card), có đầy đủ hóa đơn chứng từ mua hàng trực tiếp từ hệ thống.</span>
            </li>
            <li className="flex items-start bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
              <span className="text-[#0a5c36] dark:text-[#c2e6ba] mr-4 font-bold text-2xl leading-none mt-1">✓</span>
              <span><strong>Kích thước chuẩn:</strong> Đối với các loại nệm cắt theo kích thước đóng khuôn, kích thước phi tiêu chuẩn theo yêu cầu gắt gao của khách, chúng tôi xin từ chối đổi trả lý do nhu cầu.</span>
            </li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-10">4. Quy Trình và Hoàn Tiền</h2>
          <p className="mb-4">Khi có nhu cầu đổi đơn hàng:</p>
          <ol className="list-decimal pl-5 space-y-3 mb-8 marker:text-[#0a5c36] dark:marker:text-[#c2e6ba] font-medium">
            <li>Quý khách gửi yêu cầu qua Hotline CSKH, cung cấp hóa đơn, sđt và hình ảnh hiện tại bề mặt chăn nệm để nhân viên sơ duyệt.</li>
            <li>Trong vòng tối đa 72h, chúng tôi sẽ phản hồi xét duyệt hoặc cử kỹ thuật viên xác minh tại gốc.</li>
            <li>Trường hợp Hủy và Trả hàng hoàn tiền (Áp dụng với mặt hàng bị lỗi nghiêm trọng 100% của xưởng sản xuất không thể đổi mẫu khác tương tự): Số tiền hoàn lại sẽ được trừ các phí đã thỏa thuận và chuyển khoản về tài khoản ngân hàng của quý khách từ 5 - 15 ngày làm việc theo đúng quy trình kế toán ngân hàng.</li>
          </ol>

          <div className="mt-10 p-5 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-xl text-yellow-800 dark:text-yellow-200 text-base leading-relaxed">
            <p className="font-bold mb-2">Lưu ý quan trọng:</p>
            Mọi quyết định cuối cùng trong việc chấp thuận đổi trả phụ thuộc vào tình trạng thực tế của sản phẩm được bộ phận Quản lý chất lượng kiểm tra và đánh giá lại khi nhận hàng. Rất mong quý khách đồng kiểm tra với nhân sự để đối chiếu khách quan.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
