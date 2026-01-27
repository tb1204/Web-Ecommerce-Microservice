import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Zap, Menu as MenuIcon, X } from "lucide-react";
import MegaMenu from "../layouts/MegaMenu";

// Giữ nguyên các import icon của bạn
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSub, setActiveMobileSub] = useState<string | null>(null);
  const navigate = useNavigate();

  const menuItems: NavItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: "Flash Sale", href: "/flashsale", hasFlash: true },
    { label: "Sản phẩm", href: "/collections/all", hasDropdown: true },
    { label: "Giới thiệu", href: "/about" },
    { label: "Liên hệ", href: "/contact" },
  ];

  const categories = [
    {
      name: "Nệm",
      icon: nemIcon,
      hasSub: true,
      subCategories: [
        { title: "Kích thước", items: ["100 x 200cm", "120 x 200cm", "140 x 200cm", "160 x 200cm", "180 x 200cm", "200 x 200cm"] },
        { title: "Giá tiền", items: ["Dưới 5 triệu", "5 - 10 triệu", "10 - 15 triệu", "15 - 30 triệu", "Trên 50 triệu"] },
        { title: "Loại sản phẩm", items: ["Nệm bông ép", "Nệm cao su", "Nệm lò xo", "Nệm foam"] },
        { title: "Thương hiệu", items: ["Amando", "Aeroflow", "Dunlopillo", "Goodnight", "Gummi", "Liên Á"] },
        { title: "Nhu cầu", items: ["Nệm gấp gọn", "Nệm hỗ trợ đau lưng", "Nệm làm mát", "Nệm cưới"] },
      ],
    },
    {
      name: "Chăn ga",
      icon: changaIcon,
      hasSub: true,
      subCategories: [
        { title: "Loại sản phẩm", items: ["Bộ ga chun", "Bộ chăn ga", "Vỏ gối lẻ", "Vỏ chăn lẻ"] },
        { title: "Kích thước", items: ["120 x 200cm", "160 x 200cm", "180 x 200cm", "200 x 220cm"] },
        { title: "Giá tiền", items: ["Dưới 1 triệu", "Từ 1 - 2 triệu", "Trên 4 triệu"] },
        { title: "Thương hiệu", items: ["Goodnight", "Amando"] },
      ],
    },
    {
      name: "Phụ kiện",
      icon: phukienIcon,
      hasSub: true,
      subCategories: [
        { title: "Phụ kiện nệm", items: ["Topper", "Tấm bảo vệ nệm", "Chiếu điều hòa"] },
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
    <nav className="bg-[#05472a] text-white w-full font-sans shadow-lg relative">
      <div className="container mx-auto flex items-center justify-between lg:justify-center px-4 h-16 lg:h-auto">
        
        {/* BÊN TRÁI: MegaMenu gốc */}
        <div className="flex items-center">
          <MegaMenu />
        </div>

        {/* NÚT MOBILE HAMBURGER */}
        <button 
          className="lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <MenuIcon size={28} />
        </button>

        {/* MENU CHÍNH (DESKTOP) */}
        <div className="hidden lg:flex items-center ml-8">
          <ul className="flex items-center space-x-2">
            {menuItems.map((item, index) => (
              <li key={index} className="group relative py-5 px-4">
                <Link
                  to={item.href}
                  className="flex items-center space-x-1.5 hover:text-green-300 transition-colors"
                >
                  {item.hasFlash && (
                    <Zap size={18} fill="currentColor" className="text-orange-400 animate-pulse" />
                  )}
                  <span className="font-bold text-lg whitespace-nowrap">{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown size={16} className="opacity-80 group-hover:rotate-180 transition-transform duration-300" />
                  )}
                </Link>

                {/* Dropdown Sản phẩm (Desktop) */}
                {item.label === "Sản phẩm" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[950px] bg-white text-gray-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border border-gray-100 rounded-b-md">
                    <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                      {categories.map((cat, catIdx) => (
                        <div key={catIdx} className={`mb-8 last:mb-0 ${catIdx !== 0 ? "pt-8 border-t border-gray-100" : ""}`}>
                          <div className="flex items-center space-x-2 mb-6">
                            {cat.icon && <img src={cat.icon} alt="" className="w-6 h-6 object-contain" />}
                            <h3 className="text-lg font-black text-black uppercase tracking-wide">{cat.name}</h3>
                          </div>
                          <div className="grid grid-cols-5 gap-6">
                            {cat.subCategories.map((sub, subIdx) => (
                              <div key={subIdx}>
                                <h4 className="font-bold text-[15px] mb-3 text-green-900 border-b border-gray-50 pb-1 uppercase">{sub.title}</h4>
                                <ul className="space-y-2">
                                  {sub.items.map((subItem, iIdx) => (
                                    <li key={iIdx}>
                                      <Link to="#" className="text-sm block text-gray-500 hover:text-green-700 hover:translate-x-1 transition-all">
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
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-[70%]"></span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- MOBILE OVERLAY & SIDEBAR --- */}
        <div 
          className={`fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header */}
            <div className="p-4 bg-[#05472a] text-white flex justify-between items-center">
              <span className="font-bold text-xl uppercase tracking-wider">Danh mục</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-white/10 rounded-full">
                <X size={24} />
              </button>
            </div>

            {/* Mobile List Items */}
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-gray-100">
                {menuItems.map((item, idx) => (
                  <li key={idx} className="flex flex-col">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-gray-100 active:bg-gray-200"
                      onClick={() => {
                        if (item.hasDropdown) {
                          setActiveMobileSub(activeMobileSub === item.label ? null : item.label);
                        } else {
                          navigate(item.href);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {item.hasFlash && <Zap size={18} fill="currentColor" className="text-orange-500" />}
                        <span 
                          className="font-bold text-gray-800 hover:text-green-700 transition-colors"
                          onClick={(e) => {
                            if (item.hasDropdown) {
                              e.stopPropagation(); // Ngăn hành động mở dropdown của khung cha
                              navigate(item.href);
                              setIsMobileMenuOpen(false);
                            }
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                      {item.hasDropdown && (
                        <ChevronDown 
                          size={20} 
                          className={`text-gray-400 transition-transform ${activeMobileSub === item.label ? "rotate-180 text-green-700" : ""}`} 
                        />
                      )}
                    </div>

                    {/* Mobile Sub-Categories (Accordion) */}
                    {item.hasDropdown && activeMobileSub === item.label && (
                      <div className="bg-gray-50 pb-4">
                        {categories.map((cat, cIdx) => (
                          <div key={cIdx} className="px-4 py-3 border-b border-gray-200/50">
                            <div className="flex items-center gap-2 mb-3">
                              {cat.icon && <img src={cat.icon} alt="" className="w-4 h-4" />}
                              <span className="font-bold text-sm text-green-800 uppercase">{cat.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {cat.subCategories.slice(0, 2).map((sub, sIdx) => (
                                <div key={sIdx}>
                                  <h4 className="text-[11px] font-bold text-gray-400 uppercase mb-2">{sub.title}</h4>
                                  <ul className="space-y-1.5">
                                    {sub.items.slice(0, 4).map((link, lIdx) => (
                                      <li key={lIdx}>
                                        <Link to="#" className="text-xs text-gray-600 block py-0.5 hover:text-green-700" onClick={() => setIsMobileMenuOpen(false)}>
                                          {link}
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
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50">
               <p className="text-center text-[11px] text-gray-400 uppercase tracking-widest font-bold">WolfBed © 2024</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Menu;