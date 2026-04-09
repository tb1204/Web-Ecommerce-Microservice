import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Zap,
  Menu as MenuIcon,
  X,
  ChevronRight,
} from "lucide-react";
import MegaMenu from "../layouts/MegaMenu";
import axios from "axios";

// Icon assets
import nemIcon from "../../assets/icon-mega-menu/nệm.webp";
import changaIcon from "../../assets/icon-mega-menu/chăn ga.svg";
import phukienIcon from "../../assets/icon-mega-menu/phụ kiện 1.webp";
import goiIcon from "../../assets/icon-mega-menu/gối.svg";

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  hasFlash?: boolean;
}

function Menu() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSub, setActiveMobileSub] = useState<string | null>(null);
  const [activeMobileDeepSub, setActiveMobileDeepSub] = useState<string | null>(
    null,
  );
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  // 1. Lấy dữ liệu sản phẩm từ CSDL
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/all`)
      .then((res) => setAllProducts(res.data))
      .catch((err) => console.error("Menu API Error:", err));
  }, []);

  const menuItems: NavItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: "Flash Sale", href: "/flashsale", hasFlash: true },
    { label: "Sản phẩm", href: "/collections/all", hasDropdown: true },
    { label: "Giới thiệu", href: "/about" },
    { label: "Liên hệ", href: "/contact" },
  ];

  // 2. Giá tiền vẫn gán cứng theo ý ông
  const staticPrices = {
    NEM: [
      "Dưới 5 triệu",
      "5 - 10 triệu",
      "10 - 15 triệu",
      "15 - 30 triệu",
      "Trên 30 triệu",
    ],
    "CHAN-GA": ["Dưới 1 triệu", "1 - 3 triệu", "3 - 5 triệu", "Trên 5 triệu"],
    GOI: ["Dưới 200k", "200k - 500k", "500k - 1 triệu", "Trên 1 triệu"],
    "PHU-KIEN": ["Dưới 1 triệu", "1 - 3 triệu", "Trên 3 triệu"],
  };

  // 3. Logic lấy filter động (Loại, Thương hiệu, Kích thước)
  const getDynamicFilters = (catId: string) => {
    const productsInCat = allProducts.filter(
      (p) =>
        p.category?.parentCode?.toUpperCase() === catId ||
        p.category?.code?.toUpperCase() === catId,
    );

    const types = new Set<string>();
    const brands = new Set<string>();
    const sizes = new Set<string>();

    productsInCat.forEach((p) => {
      if (p.category?.name) types.add(p.category.name);
      if (p.brand) brands.add(p.brand);
      p.variants?.forEach((v: any) => {
        if (v.size) sizes.add(v.size);
      });
    });

    return {
      types: Array.from(types).sort().slice(0, 10),
      brands: Array.from(brands).sort().slice(0, 8),
      sizes: Array.from(sizes).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      ),
    };
  };

  // 4. Tổ chức lại danh mục sản phẩm để render
  const categoriesData = useMemo(() => {
    const base = [
      { id: "NEM", name: "Nệm", icon: nemIcon },
      { id: "CHAN-GA", name: "Chăn ga", icon: changaIcon },
      { id: "GOI", name: "Gối", icon: goiIcon },
      { id: "PHU-KIEN", name: "Phụ kiện", icon: phukienIcon },
    ];

    return base.map((cat) => {
      const dynamic = getDynamicFilters(cat.id);
      return {
        ...cat,
        subCategories: [
          { title: "Kích thước", key: "size", items: dynamic.sizes },
          { title: "Loại sản phẩm", key: "type", items: dynamic.types },
          { title: "Thương hiệu", key: "brand", items: dynamic.brands },
          {
            title: "Giá tiền",
            key: "price",
            items: staticPrices[cat.id as keyof typeof staticPrices] || [],
          },
        ],
      };
    });
  }, [allProducts]);

  const handleNavigate = (catId: string, key?: string, value?: string) => {
    const lowCatId = catId.toLowerCase();
    let url = `/collections/all?category=${lowCatId}`;
    if (key && value) url += `&${key}=${encodeURIComponent(value)}`;
    navigate(url);
    setIsMobileMenuOpen(false);
  };

  return (
    // SAU:
    <nav className="bg-[#05472a] dark:bg-gray-900 text-white w-full font-sans shadow-lg relative">
      <div className="container mx-auto flex items-center justify-between lg:justify-center px-4 h-16 lg:h-auto">
        <div className="flex items-center">
          <MegaMenu />
        </div>

        <button
          className="lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <MenuIcon size={28} />
        </button>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center ml-8">
          <ul className="flex items-center space-x-2">
            {menuItems.map((item, index) => (
              <li key={index} className="group relative py-5 px-4">
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

                {item.label === "Sản phẩm" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[980px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] border border-gray-100 rounded-b-md">
                    <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                      {categoriesData.map((cat, catIdx) => (
                        <div
                          key={catIdx}
                          className={`mb-8 last:mb-0 ${catIdx !== 0 ? "pt-8 border-t border-gray-100" : ""}`}
                        >
                          <div
                            className="flex items-center space-x-2 mb-6 cursor-pointer hover:text-green-700 w-fit"
                            onClick={() => handleNavigate(cat.id)}
                          >
                            {cat.icon && (
                              <img
                                src={cat.icon}
                                alt=""
                                className="w-6 h-6 object-contain"
                              />
                            )}
                            <h3 className="text-lg font-black uppercase tracking-wide dark:text-white">
                              {cat.name}
                            </h3>
                          </div>
                          <div className="grid grid-cols-4 gap-6">
                            {cat.subCategories.map((sub, subIdx) => (
                              <div key={subIdx}>
                                <h4 className="text-sm block text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 uppercase tracking-wider">
                                  {sub.title}
                                </h4>
                                <ul className="space-y-2">
                                  {sub.items.length > 0 ? (
                                    sub.items.map((subItem, iIdx) => (
                                      <li key={iIdx}>
                                        <button
                                          onClick={() =>
                                            handleNavigate(
                                              cat.id,
                                              sub.key,
                                              subItem,
                                            )
                                          }
                                          className="text-sm block text-gray-500 hover:text-green-700 hover:translate-x-1 transition-all text-left"
                                        >
                                          {subItem}
                                        </button>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="text-gray-300 text-xs italic">
                                      Đang cập nhật...
                                    </li>
                                  )}
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

        {/* MOBILE MENU */}
        <div
          className={`fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white dark:bg-gray-800 shadow-2xl transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-[#05472a] text-white flex justify-between items-center shrink-0">
              <span className="font-bold text-xl uppercase tracking-wider">
                Danh mục
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-gray-100">
                {menuItems.map((item, idx) => (
                  <li key={idx} className="flex flex-col">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer"
                      onClick={() => {
                        if (item.hasDropdown) {
                          setActiveMobileSub(
                            activeMobileSub === item.label ? null : item.label,
                          );
                        } else {
                          navigate(item.href);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {item.hasFlash && (
                          <Zap
                            size={18}
                            fill="currentColor"
                            className="text-orange-500"
                          />
                        )}
                        <span className="font-bold text-gray-800 dark:text-gray-100">
                          {item.label}
                        </span>
                      </div>
                      {item.hasDropdown && (
                        <ChevronDown
                          size={20}
                          className={`transition-transform ${activeMobileSub === item.label ? "rotate-180 text-green-700" : "text-gray-400"}`}
                        />
                      )}
                    </div>

                    {item.hasDropdown && activeMobileSub === item.label && (
                      <div className="bg-gray-50">
                        {categoriesData.map((cat, cIdx) => (
                          <div
                            key={cIdx}
                            className="border-b border-gray-200/50 last:border-0"
                          >
                            <div
                              className="flex items-center justify-between px-6 py-4 cursor-pointer"
                              onClick={() =>
                                setActiveMobileDeepSub(
                                  activeMobileDeepSub === cat.id
                                    ? null
                                    : cat.id,
                                )
                              }
                            >
                              <div className="flex items-center gap-3">
                                {cat.icon && (
                                  <img
                                    src={cat.icon}
                                    alt=""
                                    className="w-5 h-5"
                                  />
                                )}
                                <span className="font-bold text-sm text-gray-700 dark:text-gray-200 uppercase">
                                  {cat.name}
                                </span>
                              </div>
                              <ChevronRight
                                size={18}
                                className={`transition-transform ${activeMobileDeepSub === cat.id ? "rotate-90 text-green-700" : "text-gray-400"}`}
                              />
                            </div>

                            {activeMobileDeepSub === cat.id && (
                              <div className="bg-white px-8 pb-4 space-y-4">
                                {cat.subCategories.map((sub, sIdx) => (
                                  <div key={sIdx} className="py-2">
                                    <h4 className="text-[11px] font-black text-green-900 uppercase mb-3 tracking-widest border-l-2 border-green-700 pl-2">
                                      {sub.title}
                                    </h4>
                                    <div className="flex flex-col gap-2">
                                      {sub.items.map((link, lIdx) => (
                                        <button
                                          key={lIdx}
                                          onClick={() =>
                                            handleNavigate(
                                              cat.id,
                                              sub.key,
                                              link,
                                            )
                                          }
                                          className="text-left text-sm text-gray-500 dark:text-gray-400 py-1 hover:text-green-700 dark:hover:text-green-400"
                                        >
                                          {link}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => handleNavigate(cat.id)}
                                  className="w-full py-3 mt-2 bg-green-50 text-green-800 text-xs font-bold uppercase rounded-lg border border-green-100"
                                >
                                  Xem tất cả {cat.name}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-center shrink-0">
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                Artisano © 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
