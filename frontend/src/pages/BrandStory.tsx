import main from "../assets/brand-story/main.jpg";
import design from "../assets/brand-story/design.webp";

const BrandStory = () => {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src={main}
          className="absolute inset-0 w-full h-full object-cover"
          alt="Brand Background"
        />
        <div className="relative z-20 max-w-3xl px-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            Artisano
            <br className="sm:hidden" /> Bản Giao Hưởng Của Giấc Ngủ
          </h1>
          <p className="text-lg md:text-xl font-light leading-relaxed opacity-95">
            Nơi nghệ thuật nghỉ ngơi hòa quyện cùng khoa học nâng đỡ, để mỗi đêm
            là một hành trình trở về với chính mình.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto py-20 px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-serif text-[#0a422e] font-bold mb-8">
              Khởi Nguồn Từ Một Triết Lý
            </h2>
            <div className="space-y-6 text-gray-700 leading-relaxed text-justify">
              <p>
                ARTISANO không chỉ chế tạo nệm — chúng tôi kiến tạo những không
                gian chữa lành. Trong nhịp sống hối hả, khi mọi thứ dường như
                chạy đua, chúng tôi tin rằng giấc ngủ chính là nơi con người
                thực sự được trở về với bản thể nguyên sơ nhất.
              </p>
              <p>
                Hàng ngàn giờ nghiên cứu nhân trắc học, phân tích tư thế ngủ và
                thử nghiệm vật liệu đã được dành trọn để mỗi đường cong, mỗi lớp
                foam, mỗi lò xo đều trở thành một nốt nhạc hoàn hảo trong bản
                giao hưởng nâng đỡ cơ thể bạn suốt đêm dài.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2">
            <img
              src={design}
              alt="Design process"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#f4f7f5] py-20">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 text-center">
          <div>
            <div className="text-5xl font-bold text-[#0a422e] mb-3">10+</div>
            <div className="text-sm md:text-base text-gray-600 uppercase tracking-widest font-medium">
              Năm đồng hành
            </div>
          </div>
          <div>
            <div className="text-5xl font-bold text-[#0a422e] mb-3">
              50.000+
            </div>
            <div className="text-sm md:text-base text-gray-600 uppercase tracking-widest font-medium">
              Gia đình tin dùng
            </div>
          </div>
          <div>
            <div className="text-5xl font-bold text-[#0a422e] mb-3">100%</div>
            <div className="text-sm md:text-base text-gray-600 uppercase tracking-widest font-medium">
              Nguyên liệu đạt chuẩn an toàn
            </div>
          </div>
          <div>
            <div className="text-5xl font-bold text-[#0a422e] mb-3">24/7</div>
            <div className="text-sm md:text-base text-gray-600 uppercase tracking-widest font-medium">
              Hỗ trợ tận tâm
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandStory;
