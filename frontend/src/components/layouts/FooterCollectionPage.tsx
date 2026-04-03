import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import banner_1 from "../../assets/footercollection/footercollectionpage_1.webp";
import banner_2 from "../../assets/footercollection/footercollectionpage_2.webp";
import banner_3 from "../../assets/footercollection/footercollectionpage_3.webp";
import banner_4 from "../../assets/footercollection/footercollectionpage_4.webp";
import banner_5 from "../../assets/footercollection/footercollectionpage_5.webp";

const FooterCollectionPage: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans border-t border-gray-100 mt-10">
      <div
        className={`relative overflow-hidden transition-all duration-700 ease-in-out ${
          isExpanded ? "max-h-[9000px]" : "max-h-[400px]"
        }`}
      >
        {/* NỘI DUNG BÀI VIẾT */}
        <article className="prose prose-slate max-w-none text-gray-600 leading-relaxed text-sm md:text-base">
          <p className="mb-4">
            Chăn ga gối đệm là những sản phẩm giúp bạn có giấc ngủ ngon, đóng
            vai trò quan trọng trong việc bảo vệ sức khỏe và cải thiện chất
            lượng cuộc sống. Một bộ chăn ga gối đệm phù hợp sẽ mang lại cảm giác
            thoải mái, giúp bạn thư giãn sâu hơn, đồng thời tăng độ thẩm mỹ cho
            không gian phòng ngủ.
          </p>
          <p className="mb-6 font-medium text-gray-800">
            ARTISANO là đơn vị hàng đầu tại Việt Nam cung cấp các sản phẩm chăn
            ga gối đệm chất lượng cao từ nhiều thương hiệu uy tín. Chúng tôi
            mang đến cho khách hàng đa dạng các lựa chọn về thiết kế, màu sắc và
            chất liệu.
          </p>

          <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
            1. Lợi ích của chăn ga gối đệm
          </h2>

          <h3 className="text-lg font-bold text-gray-800 mb-2">
            1.1. Ga giường (drap)
          </h3>
          <p className="mb-4">
            <strong>Ga giường</strong>, hay còn gọi là drap, là một tấm vải phủ
            lên bề mặt của <strong>đệm</strong>, giúp bảo vệ nệm tránh bụi bẩn,
            vi khuẩn và các tác nhân gây hại khác. Khi nằm lên nệm, người dùng
            thường tiếp xúc trực tiếp với ga giường chứ không phải nệm, điều này
            giúp duy trì độ sạch sẽ cho nệm trong suốt quá trình sử dụng.
          </p>
          <p className="mb-4">
            Ga giường có nhiều thiết kế và màu sắc khác nhau, không chỉ giúp bảo
            vệ nệm mà còn tô điểm thêm vẻ đẹp cho phòng ngủ của bạn. Với các bộ
            drap đẹp mắt, phòng ngủ của bạn sẽ trở nên tươi mới và sang trọng
            hơn.
          </p>
          <p className="mb-4">
            Có hai loại ga giường phổ biến trên thị trường là:{" "}
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>
              <strong>Flat sheet (Ga trải giường):</strong> Là một tấm vải phẳng
              đơn giản, phủ lên nệm nhưng không cố định, có thể dễ dàng tháo ra
              để vệ sinh.
            </li>
            <li>
              <strong>Fitted sheet (Ga bo chun):</strong> Là loại ga giường có
              các góc hoặc cạnh được thiết kế bo chun đàn hồi, giúp ga bám chặt
              vào nệm và không bị tuột ra khỏi nệm khi sử dụng.
            </li>
          </ul>
          <img
            src={banner_1}
            alt="Ga giường Wolf Bed"
            className="w-full h-auto object-cover display-block mb-4"
          />
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            1.2. Chăn (mền)
          </h3>
          <p className="mb-4">
            Việc lựa chọn chăn phù hợp rất quan trọng, không chỉ về độ dày và
            chất liệu mà còn phụ thuộc vào thời tiết và nhu cầu sử dụng cá nhân.
            Chăn mềm mại, thoáng khí sẽ mang lại cảm giác dễ chịu, giúp bạn có
            một giấc ngủ trọn vẹn hơn.
          </p>
          <p className="mb-4">
            <strong>Chăn</strong> không chỉ giúp giữ ấm vào ban đêm mà còn mang
            lại cảm giác thoải mái, giúp bạn dễ dàng đi vào giấc ngủ sâu hơn.
            Một chiếc chăn chất lượng cao với khả năng thông thoáng và giữ nhiệt
            tốt sẽ giúp cải thiện giấc ngủ của bạn, đặc biệt là trong những đêm
            đông lạnh.
          </p>
          <img
            src={banner_2}
            alt="Ga giường Wolf Bed"
            className="w-full h-auto object-cover display-block mb-4"
          />
          <h3 className="text-lg font-bold text-gray-800 mb-2">1.3. Gối</h3>
          <p className="mb-4">
            Giấc ngủ của bạn không chỉ phụ thuộc vào nệm mà còn bị ảnh hưởng lớn
            bởi chất lượng của <strong>gối</strong>. Gối đóng vai trò hỗ trợ cổ
            và đầu, giúp duy trì vị trí đúng và tránh đau nhức sau khi thức dậy.
            Việc lựa chọn gối không nên quá thấp, quá cao hay quá cứng, bởi điều
            này có thể gây căng thẳng cho vùng cổ và vai.
          </p>
          <p className="mb-4">
            Các loại gối chất lượng như gối cao su, gối memory foam hoặc gối
            lông vũ sẽ mang lại sự êm ái, giúp bạn dễ dàng đi vào giấc ngủ sâu
            và không bị gián đoạn.
          </p>
          <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
            2. Cách chọn bộ chăn ga gối đệm phù hợp
          </h2>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            2.1. Chọn ga giường theo kích thước và chất liệu
          </h3>
          <p className="mb-4">
            Việc chọn ga giường cần đảm bảo rằng kích thước phù hợp với nệm bạn
            đang sử dụng. Kích thước không đúng có thể khiến ga bị tuột ra hoặc
            không bám chặt vào nệm, gây cảm giác khó chịu khi nằm.
          </p>
          <p className="mb-6">
            Bên cạnh đó, chất liệu của ga giường cũng rất quan trọng. Những chất
            liệu phổ biến như cotton, lụa, hoặc polyester đều có đặc điểm riêng:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>
              <strong>Cotton:</strong> Thoáng mát, dễ chịu và dễ dàng vệ sinh.
            </li>
            <li>
              <strong>Lụa:</strong> Mềm mại, sang trọng nhưng đòi hỏi sự chăm
              sóc cẩn thận hơn.
            </li>
            <li>
              <strong>Polyester:</strong> Độ bền cao, giá thành hợp lý, nhưng có
              thể gây nóng vào mùa hè.
            </li>
          </ul>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            2.2. Lựa chọn chăn theo mùa và chất liệu
          </h3>
          <p className="mb-6">
            Tùy vào mùa mà bạn nên chọn chăn có độ dày và chất liệu phù hợp. Vào
            mùa đông, những chiếc chăn bông dày hoặc chăn lông cừu sẽ giúp giữ
            ấm tốt hơn, trong khi vào mùa hè, các loại chăn nhẹ như chăn sợi
            tổng hợp hoặc chăn lụa sẽ mang lại cảm giác mát mẻ và thoải mái.
          </p>
          <p className="mb-6">
            Lựa chọn chất liệu phù hợp sẽ giúp điều hòa nhiệt độ cơ thể tốt hơn,
            tránh hiện tượng quá nóng hay quá lạnh trong khi ngủ.
          </p>
          <img
            src={banner_3}
            alt="Ga giường Wolf Bed"
            className="w-full h-auto object-cover display-block mb-4"
          />
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            2.3. Chọn gối đúng cách để hỗ trợ cổ và đầu
          </h3>
          <p className="mb-6">
            Gối phù hợp sẽ giúp duy trì tư thế ngủ đúng, tránh tình trạng đau cổ
            vai gáy. Những người ngủ nghiêng nên chọn gối dày hơn để giữ đầu và
            cổ thẳng hàng, trong khi những người ngủ ngửa có thể chọn gối mỏng
            hơn để tránh làm căng cơ cổ.
          </p>
          <p className="mb-6">Các loại gối nổi bật trên thị trường bao gồm:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>
              <strong>Gối memory foam:</strong> Gối có khả năng ôm sát theo hình
              dáng đầu và cổ, giúp giảm áp lực và hỗ trợ giấc ngủ sâu.
            </li>
            <li>
              <strong>Gối cao su thiên nhiên:</strong> Độ đàn hồi tốt, bền lâu
              và thân thiện với sức khỏe.
            </li>
            <li>
              <strong>Gối lông vũ:</strong> Mềm mại, êm ái nhưng cần chú ý vệ
              sinh thường xuyên.
            </li>
          </ul>
          <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
            3. Top 3 thương hiệu chăn ga gối đệm nổi bật tại Wolf Bed
          </h2>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            3.1. Bộ chăn ga gối Amando
          </h3>
          <p className="mb-6">
            Với chất liệu Tencel, bộ sản phẩm{" "}
            <strong>chăn ga gối Amando</strong> không chỉ mang lại sự mềm mại,
            thoáng khí mà còn thân thiện với môi trường. Tencel có khả năng điều
            hòa nhiệt độ và hút ẩm tốt, là lựa chọn tuyệt vời cho những ai có
            làn da nhạy cảm hoặc cần sự thoải mái tối ưu khi ngủ.
          </p>
          <img
            src={banner_4}
            alt="Ga giường Wolf Bed"
            className="w-full h-auto object-cover display-block mb-4"
          />
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            3.2. Bộ chăn ga gối đệm Goodnight
          </h3>
          <p className="mb-6">
            Bộ sản phẩm <strong>chăn ga gối Goodnight </strong>được thiết kế với
            chất liệu cotton mềm mại và họa tiết trang nhã, mang lại sự thoải
            mái và phong cách cho không gian ngủ. Đây là lựa chọn lý tưởng cho
            những ai yêu thích sự tối giản nhưng vẫn đảm bảo chất lượng.
          </p>
          <img
            src={banner_5}
            alt="Ga giường Wolf Bed"
            className="w-full h-auto object-cover display-block mb-4"
          />
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            3.3. Bộ chăn ga gối đệm Everon
          </h3>
          <p className="mb-6">
            Everon là thương hiệu uy tín với nhiều năm kinh nghiệm trong ngành
            chăn ga gối đệm. Sản phẩm của Everon nổi bật với chất liệu bền bỉ,
            an toàn cho da và thiết kế sang trọng, phù hợp với nhiều phong cách
            trang trí phòng ngủ.
          </p>
          <p className="mb-6">
            Bộ chăn ga gối đệm không chỉ ảnh hưởng trực tiếp đến chất lượng giấc
            ngủ mà còn là yếu tố quyết định sức khỏe tổng thể của bạn. Một bộ
            sản phẩm phù hợp sẽ mang lại giấc ngủ sâu, giúp cơ thể phục hồi và
            tạo nên tinh thần thoải mái cho một ngày mới.
          </p>
          <p className="mb-6">
            Hiện nay, Wolf Bed cung cấp đa dạng các sản phẩm chăn ga gối đệm từ
            nhiều thương hiệu uy tín, phù hợp với mọi nhu cầu và phong cách
            sống. Hãy ghé thăm <strong>hệ thống cửa hàng</strong> hoặc website
            Wolf Bed để lựa chọn cho mình bộ sản phẩm chất lượng, mang lại giấc
            ngủ ngon và không gian sống hoàn hảo.
          </p>
        </article>

        {/* LỚP PHỦ GRADIENT KHI THU NHỎ */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
        )}
      </div>

      {/* NÚT MỞ RỘNG / THU NHỎ */}
      <div className="flex justify-center mt-6">
        <button
          onClick={toggleExpand}
          className="flex items-center gap-2 px-6 py-2 border border-green-700 text-green-700 font-bold text-sm rounded-full hover:bg-green-50 transition-all uppercase tracking-wider"
        >
          {isExpanded ? (
            <>
              Thu gọn <ChevronUp size={18} />
            </>
          ) : (
            <>
              Xem thêm <ChevronDown size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FooterCollectionPage;
