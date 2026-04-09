import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, ChevronDown, ChevronRight } from "lucide-react";
import axios from "axios";

// Icon assets
import nemIcon from "../../assets/icon-mega-menu/nệm.webp";
import changaIcon from "../../assets/icon-mega-menu/chăn ga.svg";
import phukienIcon from "../../assets/icon-mega-menu/phụ kiện 1.webp";
import goiIcon from "../../assets/icon-mega-menu/gối.svg";
import khuyenmaiIcon from "../../assets/icon-mega-menu/khuyến mãi.svg";

function MegaMenu() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  // 1. Gọi API lấy dữ liệu sản phẩm
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/all`)
      .then((res) => setAllProducts(res.data))
      .catch((err) => console.error("MegaMenu API Error:", err));
  }, []);

  // 2. Định nghĩa các bộ lọc GIÁ TIỀN
  const staticFilters = {
    prices: {
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
    },
  };

  // 3. Hàm trích xuất Loại, Thương hiệu và KÍCH THƯỚC
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

      // Quét mảng variants để lấy size
      p.variants?.forEach((v: any) => {
        if (v.size) sizes.add(v.size);
      });
    });

    return {
      types: Array.from(types).sort().slice(0, 10),
      brands: Array.from(brands).sort().slice(0, 8),
      sizes: Array.from(sizes).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      ), // Sắp xếp size theo số (1m2 < 1m6)
    };
  };

  // 4. Cấu trúc Menu
  const categories = useMemo(() => {
    const baseCats = [
      { id: "NEM", name: "Nệm", icon: nemIcon },
      { id: "CHAN-GA", name: "Chăn ga", icon: changaIcon },
      { id: "GOI", name: "Gối", icon: goiIcon },
      { id: "PHU-KIEN", name: "Phụ kiện", icon: phukienIcon },
    ];

    return baseCats
      .map((cat) => {
        const dynamic = getDynamicFilters(cat.id);
        const catPrices =
          staticFilters.prices[cat.id as keyof typeof staticFilters.prices] ||
          [];

        return {
          ...cat,
          hasSub: true,
          subCategories: [
            { title: "Kích thước", key: "size", items: dynamic.sizes },
            { title: "Loại sản phẩm", key: "type", items: dynamic.types },
            { title: "Thương hiệu", key: "brand", items: dynamic.brands },
            { title: "Giá tiền", key: "price", items: catPrices },
          ],
        };
      })
      .concat([
        {
          id: "khuyen-mai",
          name: "Khuyến mãi",
          icon: khuyenmaiIcon,
          hasSub: false,
          subCategories: [],
        } as any,
      ]);
  }, [allProducts]);

  // const handleItemClick = (categoryId: string, filterKey: string, value: string) => {
  //   const lowCat = categoryId.toLowerCase();
  //   navigate(`/collections/all?category=${lowCat}&${filterKey}=${encodeURIComponent(value)}`);
  // };
  const handleItemClick = (
    categoryId: string,
    filterKey: string,
    value: string,
  ) => {
    const lowCat = categoryId.toLowerCase();

    navigate(
      `/collections/all?category=${lowCat}&${filterKey}=${encodeURIComponent(value)}`,
    );

    if (setOpenCategory) setOpenCategory(null);
  };

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
                if (category.id === "khuyen-mai") {
                  navigate("/flashsale");
                } else if (window.innerWidth < 1024) {
                  e.stopPropagation();
                  setOpenCategory(openCategory === index ? null : index);
                } else {
                  navigate(
                    `/collections/all?category=${category.id.toLowerCase()}`,
                  );
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

              {category.hasSub && (
                <div
                  className={`
                  lg:absolute lg:top-0 lg:left-full lg:w-[900px] lg:min-h-[400px] lg:grid lg:grid-cols-4 lg:gap-x-6 lg:p-8 
                  lg:opacity-0 lg:invisible lg:group-hover/item:opacity-100 lg:group-hover/item:visible 
                  lg:border-l lg:border-gray-100 lg:transition-all lg:duration-200
                  bg-white lg:bg-gray-50 overflow-hidden transition-all duration-300
                  ${openCategory === index ? "max-h-[2000px] py-4 px-8" : "max-h-0 lg:max-h-none py-0 lg:py-8"}
                `}
                >
                  {category.subCategories.map((sub, subIdx) => (
                    <div key={subIdx} className="mb-6 lg:mb-0">
                      <h3 className="font-bold text-[#004225] lg:text-black mb-4 border-b border-gray-200 lg:border-gray-200 pb-2 uppercase text-[12px] tracking-widest">
                        {sub.title}
                      </h3>
                      <ul className="space-y-2.5 text-[14px] text-gray-600">
                        {sub.items.length > 0 ? (
                          sub.items.map((text, textIdx) => (
                            <li
                              key={textIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemClick(category.id, sub.key, text);
                              }}
                              className="hover:text-[#004225] hover:font-medium hover:translate-x-1 transition-all cursor-pointer py-0.5"
                            >
                              {text}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-300 italic text-[11px]">
                            Đang cập nhật...
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                  {/*  NÚT XEM TẤT CẢ */}
                  <div className="col-span-full mt-6 pt-4 border-t border-gray-100 lg:hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/collections/all?category=${category.id.toLowerCase()}`,
                        );
                        setOpenCategory(null);
                      }}
                      className="w-full py-3 mt-2 bg-green-50 text-green-800 text-xs hover:bg-green-600 font-bold uppercase rounded-lg border border-green-100"
                    >
                      Xem tất cả {category.name}
                    </button>
                  </div>
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
