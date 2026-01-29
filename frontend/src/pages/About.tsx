import { useState } from "react";
import about from "../assets/about.webp";
import flashsale from "../assets/flash-sale-3.webp";
import ProductGrid from "../components/Products/FeaturedCategories";
import { Link } from "react-router-dom";
interface TabItem {
  title: string;
  content: string;
}

interface TabData {
  [key: string]: TabItem;
}
const About = () => {
  const [activeTab, setActiveTab] = useState("dinh-vi");

  const tabData: TabData = {
    "dinh-vi": {
      title: "Định vị của chúng tôi",
      content:
        "Với định vị thương hiệu là 'Bạn đời mang đến giấc ngủ đáng giá', chúng tôi hiểu rằng một giấc ngủ ngon phải xứng đáng với số tiền bạn bỏ ra cả về chất lượng, cảm giác và dịch vụ. Bởi vậy, ARTISANO luôn nỗ lực nâng cấp sản phẩm, tối ưu giá thành và cải thiện trải nghiệm mua sắm, để mọi khách hàng dù ở bất kỳ phân khúc nào đều có thể dễ dàng sở hữu những chiếc nệm 'đáng đồng tiền' Chúng tôi mong rằng, khi trở về sau một ngày dài, bạn có thể thư giãn hoàn toàn, ngủ sâu trọn vẹn, thức dậy với một tâm thế mới nhẹ nhõm, tích cực và sẵn sàng sống hết mình.",
    },
    "muc-tieu": {
      title: "Mục tiêu của chúng tôi",
      content:
        "ARTISANO hướng đến mục tiêu trở thành hệ thống bán lẻ và thương mại điện tử ngành giấc ngủ lớn nhất Việt Nam vào năm 2027 với 225 cửa hàng trên toàn quốc. Chúng tôi không ngừng đổi mới để mang đến giải pháp giấc ngủ phù hợp cho mọi thế hệ, kết hợp chất lượng vượt trội, giá cả hợp lý và trải nghiệm cá nhân hóa giúp người Việt ngủ ngon hơn, sống chất lượng hơn mỗi ngày",
    },
    "quyen-loi": {
      title: "Quyền lợi của khách hàng",
      content:
        "Khách hàng của ARTISANO luôn được hưởng chế độ bảo hành dài hạn, chính sách nằm thử miễn phí và hỗ trợ vận chuyển tận nhà nhanh chóng.",
    },
  };
  return (
    <div className="flex flex-col  mx-auto w-full md:w-4/5 justify-center items-center">
      <nav className=" mt-1 w-full text-sm text-gray-500 mb-6 uppercase tracking-wider text-left self-start ">
        <Link to="/" className="hover:text-green-800 cursor-pointer">
          Trang chủ
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Giới thiệu</span>
      </nav>
      <div className="w-full ">
        <div>
          <h1 className="text-center text-2xl font-bold mb-4">Giới Thiệu</h1>
          <img src={about} alt="about" className="rounded-lg object-cover" />
          <h3 className="text-center font-normal text-3xl mt-4">
            Hành trình của ARTISANO
          </h3>
        </div>
        <div>
          <p className="font-semibold text-lg md:text-xl my-5 text-center md:text-left text-[#033d21]">
            Bạn có từng coi nhẹ "giấc ngủ" của mình và nghĩ nó không quá quan
            trọng?
          </p>

          <div className="w-full md:w-3/4 space-y-5 text-gray-700">
            <p className="leading-relaxed text-justify md:text-left">
              Trong nhịp sống hối hả, người trẻ hết mình với những lịch trình,
              những cuộc hẹn gấp gáp, thời gian dành cho giấc ngủ ngày càng “ít
              ỏi”. Nếu giấc ngủ không được “chăm sóc” đúng cách sẽ dẫn đến rất
              nhiều vấn đề về sức khỏe tinh thần và thể chất. Từ đó ảnh hưởng
              trực tiếp đến chất lượng cuộc sống của chính chúng ta.
            </p>

            <p className="leading-relaxed text-justify md:text-left border-l-4 border-[#4a8a68] pl-4 py-1 italic bg-gray-50 md:bg-transparent">
              Vì vậy để nâng cao chất lượng sống, chúng ta cần bắt đầu ngay từ
              chính phòng ngủ của mình. Nói thì dễ nhưng làm mới khó, làm sao để
              đem đến một phòng ngủ như ý với chi phí vừa ví bây giờ? Chúng tôi
              đã đi thử <strong>HÀNG TRĂM </strong>cửa hàng chăn ga gối đệm trên
              khắp cả nước và nhận ra rằng: người dân Việt Nam đang thực sự cần
              một thương hiệu tiên phong.
            </p>

            <p className="leading-relaxed text-justify md:text-left">
              Từ đó ARTISANO đã ra đời với hơn <strong>10.000 giờ</strong>{" "}
              nghiên cứu cùng những chuyên gia hàng đầu thế giới để đem đến cho
              người Việt một phòng ngủ như ý. Vì chúng tôi hiểu rằng, một giấc
              ngủ ngon chính là “bệ phóng” để bạn tỏa sáng ngày mai.
            </p>

            {/* Nhóm các gạch đầu dòng vào một khối để dễ theo dõi */}
            <div className="space-y-2 bg-[#033d21]/5 p-4 rounded-lg md:p-0 md:bg-transparent">
              <p className="font-medium">
                Với triết lý “Active sleep”, ARTISANO cam kết:
              </p>
              <ul className="list-none space-y-1 ml-2">
                <li>
                  – <span className="font-bold">An toàn:</span> nguyên liệu lành
                  tính, chứng nhận ISO & OEKO-TEX.
                </li>
                <li>
                  – <span className="font-bold">Công nghệ:</span> Tản nhiệt
                  Kikoo từ Đức, tái tạo năng lượng nhanh.
                </li>
                <li>
                  – <span className="font-bold">Thiết kế:</span> Tinh tế, cho
                  bạn tự tin “flex” không gian sống.
                </li>
              </ul>
            </div>
          </div>

          <p className="leading-relaxed mt-6 font-bold text-center md:text-left text-lg text-[#033d21]">
            “Tựa lưng êm ái, thức giấc nhẹ tênh”
          </p>
          <p className="leading-relaxed text-sm md:text-base text-gray-600 italic mb-6">
            ARTISANO đại diện cho thế hệ trẻ Việt Nam năng động, không ngừng
            tiến lên, tiên phong trong việc nâng tầm chất lượng cuộc sống & giấc
            ngủ.
          </p>
        </div>

        <img
          className="my-2 rounded-lg object-cover"
          src={flashsale}
          alt="flashsale"
        />

        {/* Phần 4: Tích hợp Tabs vào đây */}

        <div className="w-full mt-10 px-5">
          {" "}
          <div className="flex justify-center items-center bg-[#033d21] text-white rounded-t-lg">
            {Object.keys(tabData).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative py-4 px-6 md:px-10 text-xs md:text-base font-semibold transition-all duration-300 ${
                  activeTab === key
                    ? "bg-[#4a8a68] text-white"
                    : "hover:bg-[#4a8a68] text-white"
                }`}
              >
                {tabData[key as keyof typeof tabData].title}

                {activeTab === key && (
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0
            border-l-[10px] border-l-transparent
            border-r-[10px] border-r-transparent
            border-t-[10px] border-t-[#4a8a68] z-10"
                  ></div>
                )}
              </button>
            ))}
          </div>
          <div className="bg-white p-6 md:p-8 border border-gray-200 shadow-md rounded-b-lg leading-relaxed text-gray-700 text-justify mb-10">
            <p className="transition-opacity duration-500">
              {tabData[activeTab as keyof typeof tabData].content}
            </p>
          </div>
        </div>
        <ProductGrid />
      </div>
    </div>
  );
};

export default About;
