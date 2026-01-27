import { useState } from "react";
import { LayoutGrid, ChevronDown, ChevronRight } from "lucide-react";
import nemIcon from "../../assets/icon-mega-menu/nệm.webp";
import changaIcon from "../../assets/icon-mega-menu/chăn ga.svg";
import phukienIcon from "../../assets/icon-mega-menu/phụ kiện 1.webp";
import noithatIcon from "../../assets/icon-mega-menu/nội thất.svg";
import goiIcon from "../../assets/icon-mega-menu/gối.svg";
import khuyenmaiIcon from "../../assets/icon-mega-menu/khuyến mãi.svg";

function MegaMenu() {
  // State để quản lý đóng mở menu trên mobile
  const [openCategory, setOpenCategory] = useState<number | null>(null);

  const categories = [
    {
      name: "Nệm",
      icon: nemIcon,
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
          ],
        },
        {
          title: "Giá tiền",
          items: [
            "Dưới 5 triệu",
            "5 - 10 triệu",
            "10 - 15 triệu",
            "15 - 30 triệu",
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
            "Liên Á",
          ],
        },
        {
          title: "Nhu cầu",
          items: [
            "Nệm gấp gọn",
            "Nệm hỗ trợ đau lưng",
            "Nệm làm mát",
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
          items: ["Bộ ga chun", "Bộ chăn ga chun", "Ga lẻ", "Vỏ gối lẻ"],
        },
        {
          title: "Kích thước",
          items: ["120 x 200cm", "160 x 200cm", "180 x 200cm", "200 x 220cm"],
        },
      ],
    },
    {
      name: "Phụ kiện",
      icon: phukienIcon,
      hasSub: true,
      subCategories: [
        { title: "Phụ kiện nệm", items: ["Topper", "Tấm bảo vệ nệm"] },
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
    <div className="flex items-center space-x-2 bg-[#004225] px-4 md:px-6 py-3 md:py-4 cursor-pointer group relative text-white w-full lg:w-fit transition-all duration-300">
      <LayoutGrid size={18} />
      <span className="font-bold tracking-wide text-[13px] md:text-[15px] uppercase flex-1 lg:flex-none">
        Danh mục sản phẩm
      </span>
      <ChevronDown
        size={18}
        className="group-hover:rotate-180 transition-transform ml-2"
      />

      {/* Dropdown Container: Trên Mobile là Full-width, Trên Desktop là w-72 */}
      <div
        className="absolute top-full -left-2 lg:-left-2 w-full lg:w-72 bg-white text-gray-800 shadow-xl opacity-0 invisible 
                   group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border-t-2 border-[#004225]
                   max-h-[80vh] overflow-y-auto lg:overflow-visible"
      >
        <ul className="w-full">
          {categories.map((category, index) => (
            <li
              key={index}
              className="group/item border-b border-gray-50 last:border-0"
              onClick={(e) => {
                // Chỉ xử lý click cho Mobile (màn hình nhỏ hơn 1024px)
                if (window.innerWidth < 1024) {
                  e.stopPropagation();
                  setOpenCategory(openCategory === index ? null : index);
                }
              }}
            >
              <div className="flex items-center justify-between px-4 py-4 hover:bg-gray-100 lg:hover:bg-gray-200 hover:text-[#004225] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-full h-full object-contain grayscale group-hover/item:grayscale-0 transition-all"
                    />
                  </div>
                  <span className="font-medium">{category.name}</span>
                </div>
                {category.hasSub && (
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform duration-300 lg:group-hover/item:rotate-0 ${openCategory === index ? "rotate-90" : ""}`}
                  />
                )}
              </div>

              {/* Mega Menu Content */}
              {category.hasSub && (
                <div
                  className={`
                  /* Desktop: Bay sang ngang */
                  lg:absolute lg:top-0 lg:left-full lg:w-[800px] lg:min-h-full lg:grid lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10 lg:p-6 lg:opacity-0 lg:invisible lg:group-hover/item:opacity-100 lg:group-hover/item:visible lg:border-l lg:border-gray-100 lg:transition-all lg:duration-200
                  
                  /* Mobile: Xổ xuống dạng Accordion */
                  bg-gray-50 overflow-hidden transition-all duration-300 px-8
                  ${openCategory === index ? "max-h-[2000px] py-4" : "max-h-0 lg:max-h-none py-0 lg:py-6"}
                `}
                >
                  {category.subCategories.map((sub, subIdx) => (
                    <div key={subIdx} className="mb-6 lg:mb-0">
                      <h3 className="font-bold text-[#004225] lg:text-black mb-3 border-b border-gray-200 lg:border-gray-100 pb-2 uppercase text-[12px] md:text-[13px] tracking-wide">
                        {sub.title}
                      </h3>
                      <ul className="space-y-2 text-[14px] text-gray-600">
                        {sub.items.map((text, textIdx) => (
                          <li
                            key={textIdx}
                            className="hover:text-[#004225] hover:translate-x-1 transition-transform cursor-pointer py-1 lg:py-0"
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
