import { LayoutGrid, ChevronDown, ChevronRight } from "lucide-react";
import nemIcon from "../../assets/icon-mega-menu/nệm.webp";
import changaIcon from "../../assets/icon-mega-menu/chăn ga.svg";
import phukienIcon from "../../assets/icon-mega-menu/phụ kiện.webp";
import noithatIcon from "../../assets/icon-mega-menu/nội thất.svg";
import goiIcon from "../../assets/icon-mega-menu/gối.svg";
import khuyenmaiIcon from "../../assets/icon-mega-menu/khuyến mãi.svg";

function MegaMenu() {
  // 1. Cập nhật icon thành đường dẫn hình ảnh (URL)
  const categories = [
    {
      name: "Nệm",
      icon: nemIcon, // Truyền link ảnh vào đây
      hasSub: true,
      subCategories: [
        {
          title: "Kích thước",
          items: [
            "100 x 200cm",
            "120 x 200cm",
            "140 x 200cm",
            "160 x 200cm",
            "180 x 200cm",
            "200 x 200cm",
            "220 x 200cm",
          ],
        },
        {
          title: "Giá tiền",
          items: [
            "Dưới 5 triệu",
            "5 triệu - 10 triệu",
            "10 triệu - 15 triệu",
            "15 triệu - 30 triệu",
            "30 triệu - 50 triệu",
            "Trên 50 triệu",
          ],
        },
        {
          title: "Loại sản phẩm",
          items: ["Nệm bông ép", "Nệm cao su", "Nệm lò xo", "Nệm foam"],
        },
        {
          title: "Thương hiệu",
          items: [
            "Amando",
            "Aeroflow",
            "Dunlopillo",
            "Goodnight",
            "Gummi",
            "Kim Cương",
            "Liên Á",
            "Comfy",
          ],
        },
        {
          title: "Nhu cầu",
          items: [
            "Nệm gấp gọn",
            "Nệm hỗ trợ đau lưng",
            "Nệm làm mát",
            "Nệm khách sạn",
            "Nệm cao cấp",
            "Nệm cưới",
          ],
        },
      ],
    },
    {
      name: "Chăn ga",
      icon: changaIcon,
      hasSub: true,
      subCategories: [
        {
          title: "Loại sản phẩm",
          items: [
            "Bộ ga chun",
            "Bộ chăn ga chun",
            "Bộ ga chun chần",
            "Chăn lẻ",
            "Ga lẻ",
            "Vỏ gối lẻ",
            "Vỏ chăn lẻ",
            "Bộ ga phủ",
          ],
        },
        {
          title: "Kích thước",
          items: ["120 x 200cm", "160 x 200cm", "180 x 200cm", "200 x 220cm"],
        },
        {
          title: "Giá tiền",
          items: [
            "Dưới 1 triệu",
            "Từ 1 - 2 triệu",
            "Từ 2 - 4 triệu",
            "Trên 4 triệu",
          ],
        },
        { title: "Thương hiệu", items: ["Goodnight", "Amando"] },
        {
          title: "Nhu cầu",
          items: ["Chăn ga cưới", "Chăn ga làm mát", "Chăn ga khách sạn"],
        },
      ],
    },
    {
      name: "Phụ kiện",
      icon: phukienIcon,
      hasSub: true,
      subCategories: [
        {
          title: "Phụ kiện nệm",
          items: ["Topper", "Tấm bảo vệ nệm", "Chiếu điều hòa"],
        },
        { title: "Khác", items: ["Tinh dầu", "Xịt thơm"] },
      ],
    },
    {
      name: "Nội thất",
      icon: noithatIcon,
      hasSub: true,
      subCategories: [{ title: "Giường", items: ["Giường gỗ", "Giường da"] }],
    },
    {
      name: "Gối",
      icon: goiIcon,
      hasSub: true,
      subCategories: [{ title: "Loại gối", items: ["Gối cao su", "Gối foam"] }],
    },
    {
      name: "Khuyến mãi",
      icon: khuyenmaiIcon,
      hasSub: false,
      subCategories: [],
    },
  ];

  return (
    <div className="flex items-center space-x-2 bg-[#004225] px-6 py-4 cursor-pointer group relative text-white w-fit">
      <LayoutGrid size={18} />
      <span className="font-bold tracking-wide text-[15px] uppercase">
        Danh mục sản phẩm
      </span>
      <ChevronDown
        size={18}
        className="group-hover:rotate-180 transition-transform ml-2"
      />

      {/* Dropdown Container */}
      <div
        className="absolute top-full -left-2 w-72 bg-white text-gray-800 shadow-xl opacity-0 invisible 
                    group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border-t-2 border-[#004225]"
      >
        {/* Sidebar Menu */}
        <ul className="w-full">
          {categories.map((category, index) => (
            <li
              key={index}
              className="group/item flex items-center justify-between px-4 py-4 hover:bg-gray-200 hover:text-[#004225] transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center space-x-3">
                {/* Thay đổi từ Component sang thẻ img */}
                <div className="w-6 h-6 flex items-center justify-center">
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-full h-full object-contain grayscale group-hover/item:grayscale-0 transition-all"
                    // Mẹo: grayscale giúp icon đồng màu xám, khi hover sẽ hiện màu gốc của ảnh
                  />
                </div>
                <span className="font-medium">{category.name}</span>
              </div>
              {category.hasSub && (
                <ChevronRight size={16} className="text-gray-400" />
              )}

              {/* Mega Menu Content */}
              {category.hasSub && (
                <div className="absolute top-0 left-full w-[800px] min-h-full bg-white shadow-2xl p-6 grid grid-cols-3 gap-x-8 gap-y-10 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible border-l border-gray-100 transition-all duration-200">
                  {category.subCategories.map((sub, subIdx) => (
                    <div key={subIdx}>
                      <h3 className="font-bold text-black mb-3 border-b border-gray-100 pb-2 uppercase text-[13px] tracking-wide">
                        {sub.title}
                      </h3>
                      <ul className="space-y-2 text-[14px] text-gray-600">
                        {sub.items.map((text, textIdx) => (
                          <li
                            key={textIdx}
                            className="hover:text-[#004225] hover:translate-x-1 transition-transform cursor-pointer"
                          >
                            {text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MegaMenu;
