import { Link } from "react-router-dom";
import { ChevronDown, Zap } from "lucide-react"; // Thêm Zap icon
import MegaMenu from "../layouts/MegaMenu";
import nemIcon from "../../assets/icon-mega-menu/nệm.webp";
import changaIcon from "../../assets/icon-mega-menu/chăn ga.svg";
import phukienIcon from "../../assets/icon-mega-menu/phụ kiện 1.webp";
import noithatIcon from "../../assets/icon-mega-menu/nội thất.svg";
import goiIcon from "../../assets/icon-mega-menu/gối.svg";
import khuyenmaiIcon from "../../assets/icon-mega-menu/khuyến mãi.svg";

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  hasFlash?: boolean;
}

function Menu() {
  const menuItems: NavItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: "Flash Sale", href: "/flashsale", hasFlash: true }, 
    { label: "Sản phẩm", href: "/collections/all", hasDropdown: true },
    { label: "Giới thiệu", href: "/about" },
    { label: "Liên hệ", href: "/contact" },

  ];

// data mau
  const categories = [
    {
      name: "Nệm",
      icon: nemIcon, 
      hasSub: true, 
      // Them href vao 
      subCategories: [
        {
          title: "Kích thước",
          items: ["100 x 200cm","120 x 200cm","140 x 200cm","160 x 200cm","180 x 200cm","200 x 200cm","220 x 200cm",],
        },
        {
          title: "Giá tiền",
          items: ["Dưới 5 triệu","5 triệu - 10 triệu","10 triệu - 15 triệu","15 triệu - 30 triệu","30 triệu - 50 triệu","Trên 50 triệu",],
        },
        {
          title: "Loại sản phẩm",
          items: ["Nệm bông ép", "Nệm cao su", "Nệm lò xo", "Nệm foam"],
        },
        {
          title: "Thương hiệu",
          items: ["Amando","Aeroflow","Dunlopillo","Goodnight","Gummi","Kim Cương","Liên Á","Comfy",],
        },
        {
          title: "Nhu cầu",
          items: ["Nệm gấp gọn","Nệm hỗ trợ đau lưng","Nệm làm mát","Nệm khách sạn","Nệm cao cấp","Nệm cưới",
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
          items: ["Bộ ga chun","Bộ chăn ga chun","Bộ ga chun chần","Chăn lẻ","Ga lẻ","Vỏ gối lẻ","Vỏ chăn lẻ","Bộ ga phủ"],
        },
        {
          title: "Kích thước",
          items: ["120 x 200cm", "160 x 200cm", "180 x 200cm", "200 x 220cm"],
        },
        {
          title: "Giá tiền",
          items: ["Dưới 1 triệu","Từ 1 - 2 triệu","Từ 2 - 4 triệu","Trên 4 triệu",],
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
//data mau

  return (
    <nav className="bg-[#05472a] text-white w-full font-sans shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-center px-4">
        {/* Danh mục sản phẩm */}
        <MegaMenu />

        {/* Danh sách menu chính */}
        <div className="flex flex-wrap items-center justify-center ml-8">
          <ul className="flex items-center space-x-2">
            {menuItems.map((item, index) => (
              <li key={index} className="group relative py-4 px-2 sm:px-4">
                <Link
                  to={item.href}
                  className="flex items-center space-x-1.5 hover:text-green-300 transition-colors"
                >
                  {item.hasFlash && (
                    <Zap 
                      size={18} 
                      fill="currentColor" 
                      className="text-orange-400 animate-pulse" 
                    />
                  )}
                  
                  <span className="font-bold text-lg whitespace-nowrap">
                    {item.label}
                  </span>

                  {item.hasDropdown && (
                    <ChevronDown
                      size={16}
                      className="opacity-80 group-hover:rotate-180 transition-transform duration-300"
                    />
                  )}
                </Link>
                {/* Dropdown cua san pham */}
                {item.label === "Sản phẩm" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[950px] bg-white text-gray-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border border-gray-100 rounded-b-md">
                    <div 
                      className="p-6 max-h-[60vh] overflow-y-auto overflow-x-hidden"
                      // style={{ 
                      //   scrollbarWidth: 'none', 
                      //   msOverflowStyle: 'none' 
                      // }}
                    >
                      {/* CSS ẩn thanh cuộn cho Chrome/Safari
                      <style dangerouslySetInnerHTML={{ __html: `
                        div::-webkit-scrollbar { display: none; }
                      `}} /> */}
                      
                      {categories.map((cat, catIdx) => (
                        <div key={catIdx} className={`mb-4 last:mb-0 ${catIdx !== 0 ? "pt-6 border-t border-gray-100" : ""}`}>
                          <Link 
                            to={"#"} 
                            className="flex items-center space-x-2 mb-4 group w-fit "
                          >
                            {cat.icon && (
                              <img src={cat.icon} alt={cat.name} className="w-6 h-6 object-contain" />
                            )}
                            <h3 className="text-[16px] font-bold text-black hover:text-green-700 uppercase leading-none transition-colors">
                              {cat.name}
                            </h3>
                          </Link>
                          
                          <div className="grid grid-cols-5 gap-4">
                            {cat.subCategories.map((sub, subIdx) => (
                              <div key={subIdx}>
                                <h4 className="font-bold text-[16px] mb-2 text-black border-b border-gray-50 pb-1">{sub.title}</h4>
                                <ul className="space-y-1">
                                  {sub.items.map((subItem, iIdx) => (
                                    <li key={iIdx}>
                                      <Link to="#" className="text-[16px] block text-gray-500 hover:text-green-700 transition-colors">
                                        {subItem}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Thanh line dưới chân menu khi hover */}
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-[80%]"></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;