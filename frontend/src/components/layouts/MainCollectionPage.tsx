

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  X,
} from "lucide-react";
import ProductGrid from "../Products/ProductGrid";
import type { Product } from "../Products/InterfaceItem";
import axios from "axios";
import { toast } from "sonner";
// const BASE_URL = "http://localhost:8082";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const mapProduct = (p: any): Product => {
  // Tìm variant có giảm giá (nếu có)
  const discountVariant = p.variants?.find(
    (v: any) => v.originalPrice && v.originalPrice > (v.price || p.price),
  );

  return {
    id: p._id?.$oid ?? p.id ?? p._id ?? "",
    name: p.name ?? "",
    brand: p.brand ?? "",
    origin: p.origin,
    productCode: p.productCode,

    price: Number(p.price) || 0,

    originalPrice: discountVariant?.originalPrice ?? undefined,

    // ================== SỬA CHÍNH Ở ĐÂY ==================
    variants: Array.isArray(p.variants)
      ? p.variants.map((v: any) => ({
          variantId: v.variantId || v.id || "",
          sku: v.sku || "",
          size: v.size || "",
          thickness: v.thickness || "",
          color: v.color || "",
          price: Number(v.price) || Number(p.price) || 0,
          originalPrice: v.originalPrice ? Number(v.originalPrice) : undefined,
          stockQuantity: Number(v.stockQuantity) || 0,
          status: v.status || "ACTIVE",
        }))
      : [],
    // ====================================================

    images: (p.images ?? []).map((img: any) => ({
      url: img.url,
      isPrimary: Boolean(img.isPrimary),
    })),

    status: p.status || "AVAILABLE",

    rating: Number(p.rating) || 0,
    reviewCount: Number(p.reviewCount) || 0,
    totalStockQuantity: Number(p.totalStockQuantity) || 0,
    stockQuantity: Number(p.totalStockQuantity) || 0,

    category: p.category
      ? {
          name: p.category.name,
          code: p.category.code,
          parentName: p.category.parentName ?? null,
          parentCode: p.category.parentCode ?? null,
        }
      : undefined,

    specifications: p.specifications ?? undefined,
    tags: p.tags ?? [],
    description: p.description ?? "",
    createdAt: p.createdAt?.$date ?? p.createdAt,
    updatedAt: p.updatedAt?.$date ?? p.updatedAt,
  };
};

const categoryNameMap: Record<string, string> = {
  NEM: "Nệm",
  "CHAN-GA": "Chăn ga",
  GOI: "Gối",
  "PHU-KIEN": "Phụ kiện",
};

// Logic kiểm tra khoảng giá
const checkPrice = (price: number, range: string) => {
  if (range === "Dưới 1 triệu") return price < 1000000;
  if (range === "1 - 3 triệu") return price >= 1000000 && price <= 3000000;
  if (range === "3 - 5 triệu") return price > 3000000 && price <= 5000000;
  if (range === "Dưới 5 triệu") return price < 5000000;
  if (range === "5 - 10 triệu") return price >= 5000000 && price <= 10000000;
  if (range === "10 - 15 triệu") return price > 10000000 && price <= 15000000;
  if (range === "15 - 30 triệu") return price > 15000000 && price <= 30000000;
  if (range === "Trên 30 triệu") return price > 30000000;
  if (range === "Trên 50 triệu") return price > 50000000;
  if (range === "Dưới 200k") return price < 200000;
  if (range === "200k - 500k") return price >= 200000 && price <= 500000;
  if (range === "500k - 1 triệu") return price > 500000 && price <= 1000000;
  if (range === "Trên 1 triệu") return price > 1000000;
  if (range === "Trên 5 triệu") return price > 5000000;
  return true;
};

type SortType = "newest" | "price_asc" | "price_desc";

const MainCollectionPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const currentCatKey = (searchParams.get("category") || "").toUpperCase();

  //search

  const query = searchParams.get("q");


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let endpoint = "";

        // 1. Nếu có từ khóa Search (q) -> Gọi API Search
        if (query) {
          endpoint = `${BASE_URL}/api/products/search?q=${query}`;
        }
        // 2. Nếu có Category trên URL (NEM, CHAN-GA...) -> Gọi thẳng API Category của Backend
        else if (currentCatKey) {
          endpoint = `${BASE_URL}/api/products/parent-category/${currentCatKey}`;
        }
        // 3. Mặc định -> Lấy tất cả
        else {
          endpoint = `${BASE_URL}/api/products/all`;
        }

        const res = await axios.get<any[]>(endpoint);
        setAllProducts(res.data.map(mapProduct));
        setError(null);
      } catch (err: any) {
        console.error("Lỗi tải sản phẩm:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    // Thêm currentCatKey vào mảng dependency để khi chuyển Tab Nệm -> Gối nó tự load lại API
  }, [query, currentCatKey]);

  // --- STATE BỘ LỌC ---
  const [selectedFilters, setSelectedFilters] = useState<{
    categories: string[];
    brands: string[];
    priceRanges: string[];
    sizes: string[];
    origins: string[];
    colors: string[];
  }>({
    categories: [],
    brands: [],
    priceRanges: [],
    sizes: [],
    origins: [],
    colors: [],
  });

  const [openFilters, setOpenFilters] = useState({
    category: true,
    brand: true,
    price: true,
    size: true,
    origin: true,
    color: true,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState<SortType>("newest");
  const itemsPerPage = 16;
  const mainContentRef = useRef<HTMLDivElement>(null);

  // --- ĐỒNG BỘ URL PARAMS ---
  // useEffect(() => {
  //   const brand = searchParams.get("brand");
  //   const size = searchParams.get("size");
  //   const type = searchParams.get("type");
  //   const price = searchParams.get("price");

  //   if (brand || size || type || price) {
  //     setSelectedFilters(prev => ({
  //       ...prev,
  //       categories: type ? [type] : prev.categories,
  //       brands: brand ? [brand] : prev.brands,
  //       sizes: size ? [size] : prev.sizes,
  //       priceRanges: price ? [price] : prev.priceRanges
  //     }));
  //   }
  //   setCurrentPage(1);
  // }, [searchParams]);
  useEffect(() => {
    const brand = searchParams.get("brand");
    const size = searchParams.get("size");
    const type = searchParams.get("type"); // Lấy cái filter "Nệm lò xo" ông vừa gán ở Search
    const price = searchParams.get("price");

    // setSelectedFilters(prev => ({
    //   ...prev,
    //   //  Nếu URL có type thì tự động tích checkbox "Loại sản phẩm" tương ứng
    //   categories: type ? [type] : (brand || size || price ? prev.categories : []),
    //   brands: brand ? [brand] : prev.brands,
    //   sizes: size ? [size] : prev.sizes,
    //   priceRanges: price ? [price] : prev.priceRanges
    // }));
    setSelectedFilters({
      categories: type ? [type] : [],
      brands: brand ? [brand] : [],
      sizes: size ? [size] : [],
      priceRanges: price ? [price] : [],
      origins: [],
      colors: [],
    });

    setCurrentPage(1);
  }, [searchParams]);

  //Tu dong scroll
  useEffect(() => {
    const hasFilters = searchParams.toString().length > 0;

    if (hasFilters && mainContentRef.current) {
      const offset = mainContentRef.current.offsetTop - 100;
      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [searchParams]); // Lắng nghe mỗi khi URL thay đổi

  // ---  LOGIC LẤY OPTION ĐỘNG TỪ CSDL ---
  // const dynamicOptions = useMemo(() => {
  //   // Chỉ lấy sản phẩm thuộc category hiện tại để lọc cho sát
  //   const productsInCat = currentCatKey
  //     ? allProducts.filter(p => p.category?.parentCode?.toUpperCase() === currentCatKey || p.category?.code?.toUpperCase() === currentCatKey)
  //     : allProducts;

  //   const cats = new Set<string>();
  //   const brs = new Set<string>();
  //   const szs = new Set<string>();
  //   const ogs = new Set<string>();
  //   const cls = new Set<string>();

  //   productsInCat.forEach(p => {
  //     if (p.category?.name) cats.add(p.category.name);
  //     if (p.brand) brs.add(p.brand);
  //     if (p.origin) ogs.add(p.origin);
  //     p.variants?.forEach((v: any) => {
  //       if (v.size) szs.add(v.size);
  //       if (v.color) cls.add(v.color);
  //     });
  //   });

  //   return {
  //     categories: Array.from(cats).sort(),
  //     brands: Array.from(brs).sort(),
  //     origins: Array.from(ogs).sort(),
  //     colors: Array.from(cls).sort(),
  //     sizes: Array.from(szs).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
  //     // Khoảng giá gán cứng theo danh mục
  //     priceRanges: currentCatKey === "NEM"
  //       ? ["Dưới 5 triệu", "5 - 10 triệu", "10 - 15 triệu", "15 - 30 triệu", "Trên 30 triệu"]
  //       : currentCatKey === "GOI"
  //         ? ["Dưới 200k", "200k - 500k", "500k - 1 triệu", "Trên 1 triệu"]
  //         : ["Dưới 1 triệu", "1 - 3 triệu", "3 - 5 triệu", "Trên 5 triệu"]
  //   };
  // }, [allProducts, currentCatKey]);
  const dynamicOptions = useMemo(() => {
    // 1. Lấy sản phẩm thuộc category hiện tại (hoặc tất cả nếu ở trang chủ)
    const productsInCat = currentCatKey
      ? allProducts.filter(
          (p) =>
            p.category?.parentCode?.toUpperCase() === currentCatKey ||
            p.category?.code?.toUpperCase() === currentCatKey,
        )
      : allProducts;

    const cats = new Set<string>();
    const brs = new Set<string>();
    const ogs = new Set<string>();
    const cls = new Set<string>();
    const szs = new Set<string>(); // Thêm Set cho kích thước

    productsInCat.forEach((p) => {
      //  Lấy Category Name động (Nếu ở trong danh mục cụ thể)
      if (p.category?.name) cats.add(p.category.name);

      //  Thương hiệu, Xuất xứ lấy ĐỘNG
      if (p.brand) brs.add(p.brand);
      if (p.origin) ogs.add(p.origin);

      //  Kích thước, Màu sắc lấy ĐỘNG từ variants

      p.variants?.forEach((v: any) => {
        if (v.size) szs.add(v.size);
        if (v.color) cls.add(v.color);
      });
    });

    return {
      //  LOẠI SẢN PHẨM: Trang 'Tất cả' hiện 4 cha, trang cụ thể hiện con ĐỘNG
      categories: !currentCatKey
        ? ["Nệm", "Chăn ga", "Gối", "Phụ kiện"]
        : Array.from(cats).sort(),

      brands: Array.from(brs).sort(),
      origins: Array.from(ogs).sort(),
      colors: Array.from(cls).sort(),

      //  KÍCH THƯỚC: Quay lại lấy ĐỘNG từ Database
      sizes: Array.from(szs).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      ),

      //  KHOẢNG GIÁ: Giữ nguyên GÁN CỨNG theo logic của ông
      priceRanges:
        currentCatKey === "NEM"
          ? [
              "Dưới 5 triệu",
              "5 - 10 triệu",
              "10 - 15 triệu",
              "15 - 30 triệu",
              "Trên 30 triệu",
            ]
          : currentCatKey === "GOI"
            ? ["Dưới 200k", "200k - 500k", "500k - 1 triệu", "Trên 1 triệu"]
            : ["Dưới 1 triệu", "1 - 3 triệu", "3 - 5 triệu", "Trên 5 triệu"],
    };
  }, [allProducts, currentCatKey]);

  // --- LOGIC LỌC CHÍNH ---
  // const filteredProducts = useMemo(() => {
  //   let result = allProducts.filter((p: any) => {
  //     const pCode = p.category?.code?.toUpperCase() || "";
  //     const pParentCode = p.category?.parentCode?.toUpperCase() || "";
  //     const urlCatMatch = !currentCatKey || pCode === currentCatKey || pParentCode === currentCatKey;

  //     const catMatch = selectedFilters.categories.length === 0 || selectedFilters.categories.includes(p.category?.name || "");
  //     const brandMatch = selectedFilters.brands.length === 0 || selectedFilters.brands.includes(p.brand || "");
  //     const originMatch = selectedFilters.origins.length === 0 || selectedFilters.origins.includes(p.origin || "");
  //     const colorMatch = selectedFilters.colors.length === 0 || p.variants?.some((v: any) => selectedFilters.colors.includes(v.color));
  //     const sizeMatch = selectedFilters.sizes.length === 0 || p.variants?.some((v: any) => selectedFilters.sizes.includes(v.size));
  //     const priceMatch = selectedFilters.priceRanges.length === 0 || selectedFilters.priceRanges.some((range) => checkPrice(p.price || 0, range));

  //     return urlCatMatch && catMatch && brandMatch && priceMatch && sizeMatch && originMatch && colorMatch;
  //   });

  //   if (sortType === "price_asc") result = [...result].sort((a, b) => a.price - b.price);
  //   else if (sortType === "price_desc") result = [...result].sort((a, b) => b.price - a.price);

  //   return result;
  // }, [allProducts, selectedFilters, currentCatKey, sortType]);
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((p: any) => {
      const pCode = p.category?.code?.toUpperCase() || "";
      const pParentCode = p.category?.parentCode?.toUpperCase() || "";

      const urlCatMatch =
        !currentCatKey ||
        pCode === currentCatKey ||
        pParentCode === currentCatKey;

      //  Khớp Category: Check cả tên con (name) và tên cha (parentName) cho trang 'Tất cả'
      const catMatch =
        selectedFilters.categories.length === 0 ||
        selectedFilters.categories.includes(p.category?.name || "") ||
        selectedFilters.categories.includes(p.category?.parentName || "");

      const brandMatch =
        selectedFilters.brands.length === 0 ||
        selectedFilters.brands.includes(p.brand || "");
      const originMatch =
        selectedFilters.origins.length === 0 ||
        selectedFilters.origins.includes(p.origin || "");
      const colorMatch =
        selectedFilters.colors.length === 0 ||
        p.variants?.some((v: any) => selectedFilters.colors.includes(v.color));
      const sizeMatch =
        selectedFilters.sizes.length === 0 ||
        p.variants?.some((v: any) => selectedFilters.sizes.includes(v.size));
      const priceMatch =
        selectedFilters.priceRanges.length === 0 ||
        selectedFilters.priceRanges.some((range) =>
          checkPrice(p.price || 0, range),
        );

      return (
        urlCatMatch &&
        catMatch &&
        brandMatch &&
        priceMatch &&
        sizeMatch &&
        originMatch &&
        colorMatch
      );
    });

    if (sortType === "price_asc")
      result = [...result].sort((a, b) => a.price - b.price);
    else if (sortType === "price_desc")
      result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [allProducts, selectedFilters, currentCatKey, sortType]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleFilterToggle = (
    type: keyof typeof selectedFilters,
    value: string,
  ) => {
    setSelectedFilters((prev) => {
      const current = prev[type];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [type]: next };
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedFilters({
      categories: [],
      brands: [],
      priceRanges: [],
      sizes: [],
      origins: [],
      colors: [],
    });
    setSearchParams(currentCatKey ? { category: currentCatKey } : {});
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    if (mainContentRef.current)
      window.scrollTo({
        top: mainContentRef.current.offsetTop - 80,
        behavior: "smooth",
      });
  };

  // --- SIDEBAR CONTENT ---
  const renderSidebarContent = () => (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between pb-5 border-b bg-white sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <Filter size={20} className="text-green-800" />
          <h2 className="font-extrabold text-gray-900 uppercase text-sm tracking-widest">
            Bộ lọc
          </h2>
        </div>
        <button
          onClick={resetFilters}
          className="text-[11px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-1"
        >
          <RotateCcw size={12} /> Làm mới
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-3 space-y-7 scrollbar-hide">
        {[
          {
            title: "Loại sản phẩm",
            key: "categories",
            options: dynamicOptions.categories,
            stateKey: "category",
          },
          {
            title: "Thương hiệu",
            key: "brands",
            options: dynamicOptions.brands,
            stateKey: "brand",
          },
          {
            title: "Kích thước",
            key: "sizes",
            options: dynamicOptions.sizes,
            stateKey: "size",
          },
          {
            title: "Khoảng giá",
            key: "priceRanges",
            options: dynamicOptions.priceRanges,
            stateKey: "price",
          },
          {
            title: "Xuất xứ",
            key: "origins",
            options: dynamicOptions.origins,
            stateKey: "origin",
          },
          {
            title: "Màu sắc",
            key: "colors",
            options: dynamicOptions.colors,
            stateKey: "color",
          },
        ].map((group) => (
          <div key={group.key} className="border-b border-gray-100 pb-6">
            <button
              onClick={() =>
                setOpenFilters({
                  ...openFilters,
                  [group.stateKey as keyof typeof openFilters]:
                    !openFilters[group.stateKey as keyof typeof openFilters],
                })
              }
              className="flex justify-between items-center w-full mb-4 font-black text-xs uppercase tracking-tighter text-gray-800 hover:text-green-700 transition-colors"
            >
              {group.title}{" "}
              {openFilters[group.stateKey as keyof typeof openFilters] ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>
            {openFilters[group.stateKey as keyof typeof openFilters] && (
              <div className="grid grid-cols-1 gap-3">
                {group.options.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-3 cursor-pointer group w-fit"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters[
                        group.key as keyof typeof selectedFilters
                      ].includes(opt)}
                      onChange={() => handleFilterToggle(group.key as any, opt)}
                      className="w-5 h-5 rounded border-gray-300 text-green-700 focus:ring-green-500 transition-all cursor-pointer"
                    />
                    <span
                      className={`text-[13px] font-medium transition-colors ${selectedFilters[group.key as keyof typeof selectedFilters].includes(opt) ? "text-green-800 font-bold" : "text-gray-500 group-hover:text-gray-900"}`}
                    >
                      {opt}
                    </span>
                  </label>
                ))}
                {group.options.length === 0 && (
                  <p className="text-[11px] text-gray-300 italic">
                    Đang cập nhật...
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 lg:py-10 font-sans">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <aside className="hidden lg:block lg:w-[260px] lg:sticky lg:top-28 h-fit">
          {renderSidebarContent()}
        </aside>

        {/* MOBILE DRAWER */}
        <div
          className={`fixed inset-0 z-[1000] lg:hidden transition-all duration-300 ${isMobileFilterOpen ? "visible" : "invisible"}`}
        >
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${isMobileFilterOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div
            className={`absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white p-6 shadow-2xl transition-transform duration-500 ease-out ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <button
              className="absolute top-4 right-4 p-2 text-gray-400"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <X size={24} />
            </button>
            {renderSidebarContent()}
          </div>
        </div>

        <main ref={mainContentRef} className="flex-1">
          {/* HEADER DANH MỤC */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-black text-[#004225] uppercase tracking-tight mb-2">
              {categoryNameMap[currentCatKey] || "Tất cả sản phẩm"}
            </h1>
            <div className="w-16 lg:w-20 h-1.5 bg-[#004225] rounded-full"></div>
          </div>

          {/* TOOLBAR */}
          <div className="flex flex-wrap justify-between items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl mb-8 shadow-sm">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-green-50 text-green-800 rounded-xl text-sm font-bold"
            >
              <Filter size={18} /> Bộ lọc
            </button>

            <p className="hidden md:block text-sm font-medium text-gray-500">
              Đang hiển thị{" "}
              <span className="text-black font-bold">
                {currentProducts.length}
              </span>{" "}
              /{" "}
              <span className="text-black font-bold">
                {filteredProducts.length}
              </span>{" "}
              sản phẩm
            </p>

            <div className="flex items-center gap-6 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-gray-400">
              {(["newest", "price_asc", "price_desc"] as SortType[]).map(
                (type) => {
                  const label =
                    type === "newest"
                      ? "Mới nhất"
                      : type === "price_asc"
                        ? "Giá thấp - cao"
                        : "Giá cao - thấp";
                  return (
                    <span
                      key={type}
                      onClick={() => setSortType(type)}
                      className={`cursor-pointer whitespace-nowrap transition-colors ${sortType === type ? "text-green-700 border-b-2 border-green-700 pb-1" : "hover:text-green-700"}`}
                    >
                      {label}
                    </span>
                  );
                },
              )}
            </div>
          </div>

          {/* GRID & LOADING */}
          <div className="min-h-[600px]">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-gray-100 animate-pulse h-72"
                    />
                  ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-32 bg-red-50 rounded-3xl border border-red-100">
                <p className="text-red-600 font-bold">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold"
                >
                  Thử lại
                </button>
              </div>
            ) : currentProducts.length > 0 ? (
              <ProductGrid products={currentProducts} isSliderMode={false} />
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500 font-bold text-lg mb-2">
                  Rất tiếc, không tìm thấy sản phẩm!
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-green-800 text-white rounded-xl text-sm font-bold"
                >
                  Làm mới bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && !loading && !error && (
            <div className="mt-16 flex justify-center items-center gap-3">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-black transition-all ${currentPage === page ? "bg-green-800 text-white shadow-lg" : "bg-white text-gray-400 hover:bg-gray-50"}`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 text-gray-400 disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MainCollectionPage;
