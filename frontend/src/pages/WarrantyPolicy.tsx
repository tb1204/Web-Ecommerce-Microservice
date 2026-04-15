import React from 'react';

const WarrantyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 pt-32">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
        <div className="bg-gradient-to-r from-[#04341f] to-[#0a5c36] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <h1 className="relative text-3xl md:text-5xl font-extrabold text-[#c2e6ba] tracking-tight drop-shadow-md">
            Chính Sách Bảo Hành Sản Phẩm
          </h1>
          <p className="relative mt-4 text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto">
            HỆ THỐNG CỦA TÔI luôn cam kết mang lại chất lượng và sự an tâm tuyệt đối cho khách hàng trong suốt quá trình sử dụng sản phẩm.
          </p>
        </div>
        
        <div className="p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <p className="lead italic mb-8">
            Chính sách bảo hành này được thiết lập nhằm bảo vệ quyền lợi chính đáng của Quý khách hàng khi mua sắm tại phân phối chính thức của <strong className="text-gray-900 dark:text-white">HỆ THỐNG CỦA TÔI</strong>. Quý khách vui lòng đọc kỹ để nắm rõ quy định.
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">1. Thời gian bảo hành theo danh mục sản phẩm</h2>
          <p className="mb-4">Mỗi dòng sản phẩm tại <strong>HỆ THỐNG CỦA TÔI</strong> đều có thời hạn bảo hành riêng biệt dựa trên đặc tính vật liệu và cam kết từ nhà sản xuất:</p>
          <ul className="list-disc pl-5 space-y-2 mb-8 marker:text-[#0a5c36] dark:marker:text-[#c2e6ba]">
            <li><strong>Nệm Cao Su Thiên Nhiên:</strong> Bảo hành từ 10 - 15 năm (Tùy thương hiệu đóng dấu trên sản phẩm).</li>
            <li><strong>Nệm Lò Xo (Túi độc lập / Liên kết):</strong> Bảo hành từ 5 - 10 năm về kết cấu lò xo và độ lún xẹp.</li>
            <li><strong>Nệm Foam / Memory Foam:</strong> Bảo hành cấu trúc lõi từ 5 - 10 năm.</li>
            <li><strong>Nệm Bông Ép:</strong> Bảo hành từ 3 - 5 năm tùy thuộc vào tỉ trọng chần bông.</li>
            <li><strong>Sản phẩm chăn ga gối / Phụ kiện:</strong> Hỗ trợ bảo hành đường may, khóa kéo trong vòng 1 - 3 tháng. Đổi mới trong 7 ngày nếu lỗi cấu trúc vải do khâu sản xuất.</li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-10">2. Điều kiện được bảo hành (Hợp lệ)</h2>
          <p className="mb-4">Sản phẩm của Quý khách sẽ được khắc phục sự cố hoặc bảo hành miễn phí nếu đáp ứng đầy đủ các tiêu chí bảo hành từ chúng tôi:</p>
          <ul className="list-none pl-0 space-y-3 mb-8">
            <li className="flex items-start">
              <span className="text-[#0a5c36] dark:text-[#c2e6ba] mr-3 font-bold text-xl">✓</span>
              Sản phẩm phải được hệ thống ghi nhận chính xác thời gian mua, còn thời hạn bảo hành theo quy định kể từ ngày giao hàng.
            </li>
            <li className="flex items-start">
              <span className="text-[#0a5c36] dark:text-[#c2e6ba] mr-3 font-bold text-xl">✓</span>
              Có phiếu bảo hành gốc rõ ràng (không tẩy xóa, rách nát) hoặc chứng từ mua hàng/tra cứu số điện thoại hợp lệ trên hệ thống <strong className="ml-1 text-gray-900 dark:text-white">HỆ THỐNG CỦA TÔI</strong>.
            </li>
            <li className="flex items-start">
              <span className="text-[#0a5c36] dark:text-[#c2e6ba] mr-3 font-bold text-xl">✓</span>
              Lỗi kỹ thuật xuất phát từ quy trình sản xuất: Ví dụ như lò xo bị gãy đâm lên bề mặt, lõi cao su bị bở mục, nứt gãy bất thường, foam xẹp lún hơn 10% độ dày nguyên bản mà không có tác động từ ngoại lực sai cách.
            </li>
            <li className="flex items-start">
              <span className="text-[#0a5c36] dark:text-[#c2e6ba] mr-3 font-bold text-xl">✓</span>
              Tên thương hiệu, tem mác trên nệm phải nguyên vẹn như lúc mới giao.
            </li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-10">3. Các trường hợp từ chối bảo hành</h2>
          <p className="mb-4">Rất tiếc <strong>HỆ THỐNG CỦA TÔI</strong> sẽ không thể tiếp nhận bảo hành đối với các trường hợp bị mất quyền bảo hành như sau:</p>
          <ul className="list-none pl-0 space-y-3 mb-8 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="text-red-500 mr-3 font-bold text-xl">⨯</span>
              Quá thời hạn bảo hành quy định của sản phẩm.
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-3 font-bold text-xl">⨯</span>
              Sản phẩm bị dơ bẩn, hoen ố, ngấm chất lỏng, rách vỏ bọc (cháy nổ, vật sắc nhọn cắt) do trong quá trình sử dụng khách hàng bất cẩn.
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-3 font-bold text-xl">⨯</span>
              Sản phẩm được dùng sai mục đích thiết kế (đặt trên bề mặt lồi lõm không bằng phẳng, nhún nhảy quá mức, uốn cong bẻ gập sai quy cách).
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-3 font-bold text-xl">⨯</span>
              Hàng thanh lý, xả kho không đi kèm biên bản bảo hành tiêu chuẩn.
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-3 font-bold text-xl">⨯</span>
              Trường hợp xẹp lún thông thường của vật liệu mềm (dưới 10% đối với nệm foam/cao su, lún cơ sinh học tự nhiên theo cơ thể người).
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-3 font-bold text-xl">⨯</span>
              Sản phẩm đã bị can thiệp sửa chữa bởi bất kỳ đơn vị bảo trì nào khác không được ủy quyền.
            </li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-[#04341f] dark:text-[#c2e6ba] border-b border-gray-200 dark:border-gray-700 pb-3 mb-6 mt-10">4. Quy trình giải quyết yêu cầu bảo hành</h2>
          <p className="mb-4">Để đảm bảo dịch vụ kịp thời cho quý khách, chúng tôi áp dụng quy trình tinh gọn:</p>
          <ol className="list-decimal pl-5 space-y-4 mb-8 marker:text-[#0a5c36] dark:marker:text-[#c2e6ba] marker:font-bold">
            <li><strong>Tiếp nhận thông tin:</strong> Khách hàng liên hệ với hotline hoặc fanpage của <strong>HỆ THỐNG CỦA TÔI</strong> và cung cấp hình ảnh hiện trạng nệm, thông tin mua hàng.</li>
            <li><strong>Xác minh và kiểm tra:</strong> Trong vòng 48h, kỹ thuật viên sẽ liên hệ, yêu cầu video/hình ảnh bổ sung, hoặc sắp xếp nhân sự đến trực tiếp tận nơi thẩm định lỗi.</li>
            <li><strong>Phương án xử lý:</strong> Sau khi có kết luận chính thức, nếu lỗi thuộc diện bảo hành hợp lệ, chúng tôi sẽ tiến hành đưa nệm hoặc lõi nệm mới thay thế cho khách hàng, hoặc mang nệm về nhà máy sửa chữa tùy vào kết cấu sản phẩm.</li>
            <li><strong>Bàn giao kết quả:</strong> Thông thường từ 5 - 15 ngày làm việc theo lịch tuyến xe.</li>
          </ol>

          <p className="italic text-sm text-gray-500 dark:text-gray-400 mb-8 pb-4 border-b border-dashed border-gray-300 dark:border-gray-600">
            * Đối với những sản phẩm lớn và công kềnh, nhân sự giao nhận của HỆ THỐNG CỦA TÔI sẽ sử dụng các biện pháp an toàn cao nhất khi luân chuyển bảo hành.
          </p>

          <div className="mt-8 p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm flex items-center justify-center sm:justify-start hover:shadow-md transition-shadow duration-300">
            <div className="text-4xl mr-5">📞</div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Tổng đài CSKH và Bảo Hành (8:00 - 21:00)</p>
              <p className="text-3xl font-extrabold text-[#04341f] dark:text-[#c2e6ba]">1900 6750</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPolicy;
