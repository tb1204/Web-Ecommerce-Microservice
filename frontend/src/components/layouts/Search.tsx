import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";

const BASE_URL = "http://localhost:8082";

//  BẢNG MAP THÔNG MINH: Nhận diện danh mục và gán bộ lọc (type) tự động
const CATEGORY_MAP: Record<string, { cat: string; filter?: string }> = {
  // --- NHÓM NỆM (NEM) ---
  "nệm": { cat: "NEM" }, "nem": { cat: "NEM" },
  
  // Nệm bông ép
  "nệm bông ép": { cat: "NEM", filter: "Nệm bông ép" },
  "nem bong ep": { cat: "NEM", filter: "Nệm bông ép" },
  "bông ép": { cat: "NEM", filter: "Nệm bông ép" },
  "bong ep": { cat: "NEM", filter: "Nệm bông ép" },

  // Nệm cao su
  "nệm cao su": { cat: "NEM", filter: "Nệm cao su" },
  "nem cao su": { cat: "NEM", filter: "Nệm cao su" },
  "cao su": { cat: "NEM", filter: "Nệm cao su" },

  // Nệm lò xo
  "nệm lò xo": { cat: "NEM", filter: "Nệm lò xo" },
  "nem lo xo": { cat: "NEM", filter: "Nệm lò xo" },
  "lò xo": { cat: "NEM", filter: "Nệm lò xo" },
  "lo xo": { cat: "NEM", filter: "Nệm lò xo" },

  // Nệm foam
  "nệm foam": { cat: "NEM", filter: "Nệm foam" },
  "nem foam": { cat: "NEM", filter: "Nệm foam" },
  "foam": { cat: "NEM", filter: "Nệm foam" },

  // --- NHÓM CHĂN GA (CHAN_GA) ---
  "chăn ga": { cat: "CHAN-GA" }, "chan ga": { cat: "CHAN-GA" },
  "chăn": { cat: "CHAN-GA" }, "chan": { cat: "CHAN-GA" },
  "ga": { cat: "CHAN-GA" }, "drap": { cat: "CHAN-GA" }, "ra": { cat: "CHAN-GA" },
  "mền": { cat: "CHAN-GA" }, "men": { cat: "CHAN-GA" },

  // Loại chi tiết trong chăn ga
  "bộ chăn ga": { cat: "CHAN-GA", filter: "Bộ chăn ga" },
  "bo chan ga": { cat: "CHAN-GA", filter: "Bộ chăn ga" },
  "vỏ chăn": { cat: "CHAN-GA", filter: "Vỏ chăn" },
  "vo chan": { cat: "CHAN-GA", filter: "Vỏ chăn" },
  "ga phủ": { cat: "CHAN-GA", filter: "Bộ ga phủ" },
  "ga phu": { cat: "CHAN-GA", filter: "Bộ ga phủ" },
  "ga chun": { cat: "CHAN-GA", filter: "Bộ chăn ga chun" },

  // --- NHÓM GỐI (GOI) ---
  "gối": { cat: "GOI" }, "goi": { cat: "GOI" },
  "gối bông": { cat: "GOI", filter: "Gối bông" },
  "goi bong": { cat: "GOI", filter: "Gối bông" },
  "gối cao su": { cat: "GOI", filter: "Gối cao su" },
  "goi cao su": { cat: "GOI", filter: "Gối cao su" },
  "gối foam": { cat: "GOI", filter: "Gối foam" },
  "goi foam": { cat: "GOI", filter: "Gối foam" },
  "gối lông vũ": { cat: "GOI", filter: "Gối lông vũ" },
  "goi long vu": { cat: "GOI", filter: "Gối lông vũ" },

  // --- NHÓM PHỤ KIỆN (PHU-KIEN) ---
  "phụ kiện": { cat: "PHU-KIEN" }, "phu kien": { cat: "PHU-KIEN" }
};

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // --- 1. Suggetions (Debounce 300ms) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsLoading(true);
        try {
          // API Search ở Backend đã được ông thêm logic makeFuzzy tìm không dấu
          const res = await axios.get(`${BASE_URL}/api/products/search?q=${searchTerm}`);
          setSuggestions(res.data.slice(0, 5));
          setShowSuggestions(true);
        } catch (err) {
          console.error("Lỗi gợi ý nhanh:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // --- 2. Đóng dropdown khi click ra ngoài ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 3. Logic Tìm kiếm & Điều hướng Thông minh ---
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;

    let targetCat = "";
    let targetFilter = "";

    //  TÌM KHỚP: Duyệt qua toàn bộ keys để xem term có CHỨA key nào không
    // Sắp xếp keys từ dài nhất đến ngắn nhất để tránh khớp nhầm "chăn" trước "chăn ga"
    const sortedKeys = Object.keys(CATEGORY_MAP).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      if (term.includes(key)) {
        targetCat = CATEGORY_MAP[key].cat;
        targetFilter = CATEGORY_MAP[key].filter || "";
        break; // Tìm thấy thằng dài nhất và khớp nhất thì dừng
      }
    }

    //  ĐIỀU HƯỚNG:
    let url = `/collections/all?q=${encodeURIComponent(searchTerm.trim())}`;
    
    // Nếu tìm thấy danh mục (vd: gõ "chăn" -> tìm thấy key "chăn" -> cat: "CHAN_GA")
    if (targetCat) {
      url += `&category=${targetCat}`;
    }
    
    // Nếu tìm thấy loại lọc cụ thể (vd: gõ "nem lo xo" -> filter: "Nệm lò xo")
    if (targetFilter) {
      url += `&type=${encodeURIComponent(targetFilter)}`;
    }

    navigate(url);
    setShowSuggestions(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      {/* THANH SEARCH */}
      <form onSubmit={handleSearch} className="flex items-center w-full border border-gray-200 dark:border-gray-700 rounded-full pl-5 pr-1.5 py-1 bg-gray-50 dark:bg-gray-800 focus-within:border-[#3cb371] focus-within:bg-white dark:focus-within:bg-gray-900 transition-all shadow-sm">
        <input
          type="text"
          placeholder="Tìm nệm, gối, chăn ga..."
          value={searchTerm}
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none bg-transparent text-sm py-1"
        />
        <button type="submit" className="p-2 hover:bg-[#3cb371]/10 rounded-full text-gray-500 transition-colors">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-[#3cb371] border-t-transparent rounded-full animate-spin" />
          ) : (
            <IoIosSearch size={24} className="shrink-0" />
          )}
        </button>
      </form>

      {/* DROPDOWN GỢI Ý */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-[150] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          
        
          {/* KHU VỰC 2: SẢN PHẨM KHỚP NHẤT */}
          <div className="border-t border-gray-100 dark:border-gray-700">
            <p className="p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sản phẩm nổi bật</p>
            <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
              {suggestions.length > 0 ? (
                suggestions.map(p => {
                  const primaryImg = p.images?.find((i: any) => i.isPrimary)?.url || p.images?.[0]?.url;
                  return (
                    <div 
                      key={p.id} 
                      onClick={() => { navigate(`/product/${p.id}`); setShowSuggestions(false); setSearchTerm(""); }}
                      className="flex items-center gap-4 p-3 hover:bg-green-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0"
                    >
                      <img src={primaryImg} className="w-10 h-10 object-cover rounded-lg shadow-sm" alt="" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-gray-800 dark:text-gray-100 truncate">{p.name}</h4>
                        <p className="text-xs text-red-600 font-black">{p.price?.toLocaleString("vi-VN")}₫</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-sm text-gray-400 italic">Không có sản phẩm nào phù hợp</div>
              )}
            </div>
          </div>

          {/* NÚT XEM TẤT CẢ */}
          {suggestions.length > 0 && (
            <button 
              onClick={() => handleSearch()}
              className="w-full py-3 bg-gray-50 dark:bg-gray-900/50 text-center text-[11px] font-black text-[#3cb371] uppercase border-t border-gray-100 dark:border-gray-700 hover:bg-green-50 transition-colors"
            >
              Xem tất cả kết quả cho "{searchTerm}"
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;