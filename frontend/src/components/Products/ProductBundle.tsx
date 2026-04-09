import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ShoppingCart,
  Trash2,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import ProductGrid from "./ProductGrid";
import type { Product } from "../Products/InterfaceItem";
import axios from "axios";
import banner_phu_3 from "../../assets/banner/banner-phu-3.webp";

import { addToCart } from "../../store/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react"; // Để lấy token
import { toast } from "sonner"; // Hoặc thư viện thông báo ông đang dùng

// const BASE_URL = "http://localhost:8082";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- HÀM MAP DỮ LIỆU CHUẨN (GIỮ NGUYÊN TỪ BẠN ÔNG) ---
const mapProduct = (p: any): Product => {
  const discountVariant = p.variants?.find(
    (v: any) => v.originalPrice && v.originalPrice > v.price,
  );
  return {
    id: p._id?.$oid ?? p.id ?? p._id,
    name: p.name,
    brand: p.brand,
    price: p.price ?? 0,
    originalPrice: discountVariant?.originalPrice ?? undefined,
    images: (p.images ?? []).map((img: any) => ({
      url: img.url,
      isPrimary: img.isPrimary,
    })),
    status: p.status === "AVAILABLE" ? "selling" : "stopselling",
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    totalStockQuantity: p.totalStockQuantity ?? 0,
    variants: p.variants ?? [],
    category: p.category,
  };
};

const steps = [
  { id: 1, key: "nem", title: "Nệm", code: "NEM" },
  { id: 2, key: "chanGa", title: "Chăn ga", code: "CHAN-GA" },
  { id: 3, key: "goi", title: "Gối", code: "GOI" },
  { id: 4, key: "phuKien", title: "Phụ kiện", code: "PHU-KIEN" },
];

const ProductBundle: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [tempProduct, setTempProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, Product | null>
  >({
    nem: null,
    chanGa: null,
    goi: null,
    phuKien: null,
  });
  const dispatch = useDispatch<any>();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // --- HÀM XỬ LÝ ĐẨY LÊN GIỎ HÀNG ---
  const handleAddBundleToCart = async () => {
    const bundleItems = Object.values(selectedProducts).filter(
      (p) => p !== null,
    );

    if (bundleItems.length < 4) {
      toast.error("Vui lòng chọn đủ 4 món nhen Bằng ơi!");
      return;
    }

    try {
      const token = await getToken();

      for (const product of bundleItems as any[]) {
        const itemToStore = {
          productId: product.id,
          variantId: product.selectedVariant?.variantId,
          name: product.name,
          price: product.price,
          image: product.images.find((img: any) => img.isPrimary)?.url || "",
          quantity: 1,
          size: product.selectedVariant?.size,
          thickness: product.selectedVariant?.thickness,
          color: product.selectedVariant?.color,
        };

        await dispatch(addToCart({ token, product: itemToStore })).unwrap();
        console.log(`Đã thêm xong món: ${product.name}`);
      }

      toast.success("Tuyệt vời! Đã thêm trọn bộ combo vào giỏ hàng!");
      navigate("/cart");
    } catch (err) {
      console.error("Lỗi thêm combo:", err);
      toast.error("Gặp sự cố khi gom bộ sản phẩm rồi.");
    }
  };

  //  Gọi API lấy toàn bộ sản phẩm
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${BASE_URL}/api/products/all`);
        setAllProducts(res.data.map(mapProduct));
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm bundle.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  // 2. Phân loại sản phẩm theo từng bước (Step) dựa trên Category Code
  const productsByStep = useMemo(() => {
    const grouped: Record<string, Product[]> = {
      nem: [],
      chanGa: [],
      goi: [],
      phuKien: [],
    };

    allProducts.forEach((p) => {
      const pParentCode = p.category?.parentCode?.toUpperCase();
      const pCode = p.category?.code?.toUpperCase();

      if (pParentCode === "NEM" || pCode === "NEM") grouped.nem.push(p);
      else if (pParentCode === "CHAN-GA" || pCode === "CHAN-GA")
        grouped.chanGa.push(p);
      else if (pParentCode === "GOI" || pCode === "GOI") grouped.goi.push(p);
      else if (pParentCode === "PHU-KIEN" || pCode === "PHU-KIEN")
        grouped.phuKien.push(p);
    });
    return grouped;
  }, [allProducts]);

  const totalPrice = Object.values(selectedProducts).reduce(
    (sum, p) => sum + (p?.price || 0),
    0,
  );

  // const handleSelectProduct = (product: Product) => {
  //   const currentStepKey = steps[currentStep - 1].key;
  //   setSelectedProducts(prev => ({ ...prev, [currentStepKey]: product }));
  //   if (currentStep < 4) {
  //     setTimeout(() => setCurrentStep(prev => prev + 1), 400);
  //   }
  // };
  const handleSelectProduct = (product: Product) => {
    setTempProduct(product);
    // Mặc định chọn biến thể đầu tiên cho khách đỡ phải click nhiều
    setSelectedVariant(product.variants?.[0] || null);
    setIsVariantModalOpen(true);
  };

  // --- HÀM XÁC NHẬN CHỌN BIẾN THỂ ---
  const confirmSelection = () => {
    if (!tempProduct || !selectedVariant) return;

    const currentStepKey = steps[currentStep - 1].key;

    // Gộp sản phẩm gốc với thông tin biến thể đã chọn
    const finalSelection = {
      ...tempProduct,
      selectedVariant: selectedVariant,
      price: selectedVariant.price, // Lấy giá của size đã chọn
    };

    setSelectedProducts((prev) => ({
      ...prev,
      [currentStepKey]: finalSelection,
    }));

    // Đóng Modal và qua bước tiếp theo
    setIsVariantModalOpen(false);
    setTempProduct(null);

    if (currentStep < 4) {
      setTimeout(() => setCurrentStep((prev) => prev + 1), 400);
    }
  };

  const handleRemoveProduct = (key: string) =>
    setSelectedProducts((prev) => ({ ...prev, [key]: null }));

  const handleStepClick = (stepId: number) => {
    if (stepId === 1 || selectedProducts[steps[stepId - 2].key]) {
      setCurrentStep(stepId);
    }
  };

  const currentProducts = productsByStep[steps[currentStep - 1].key] || [];

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-40 min-h-screen">
        <Loader2 className="w-12 h-12 text-[#0b4a32] animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
          Đang khởi tạo bộ giấc ngủ...
        </p>
      </div>
    );

  return (
    // <div className="max-w-7xl mx-auto px-4 py-10 bg-white min-h-screen font-sans text-[#333]">

    <div className="max-w-7xl mx-auto px-4 py-10 bg-white dark:bg-gray-900 min-h-screen font-sans text-[#333] dark:text-gray-100 transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-1 overflow-hidden rounded-xl h-[200px] md:h-[280px] shadow-sm">
          <img
            src={banner_phu_3}
            alt="Promotion"
            className="w-full h-full object-cover transition-transform duration-700 cursor-pointer hover:scale-105"
          />
        </div>
      </div>

      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#111] dark:text-white mb-3 uppercase tracking-tight">
          Tạo bộ sản phẩm Giấc Ngủ Hoàn Hảo
        </h1>
        <p className="text-gray-500 dark:text-gray-400 italic text-sm">
          Lựa chọn từng món đồ để xây dựng không gian nghỉ ngơi lý tưởng của
          riêng bạn.
        </p>
      </header>

      {/* Steps Progress */}
      <div className="flex items-center mb-10 w-full overflow-x-auto scrollbar-hide pb-2">
        <div className="flex w-full min-w-[500px]">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`relative flex-1 py-4 flex items-center justify-center font-bold text-[12px] md:text-sm transition-all duration-300
                ${currentStep === step.id || !!selectedProducts[step.key] ? "bg-[#0b4a32] text-white" : "bg-[#f1f1f1] text-[#b5b5b5]"}
                ${index === 0 ? "rounded-l-lg" : ""} ${index === steps.length - 1 ? "rounded-r-lg" : ""}`}
              style={{
                clipPath:
                  index === steps.length - 1
                    ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 4% 50%)"
                    : index === 0
                      ? "polygon(0% 0%, 96% 0%, 100% 50%, 96% 100%, 0% 100%)"
                      : "polygon(0% 0%, 96% 0%, 100% 50%, 96% 100%, 0% 100%, 4% 50%)",
                marginLeft: index === 0 ? "0" : "-10px",
              }}
            >
              <span
                className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border text-[10px] mr-2 ${currentStep === step.id || !!selectedProducts[step.key] ? "border-white" : "border-[#b5b5b5]"}`}
              >
                {!!selectedProducts[step.key] ? "✓" : step.id}
              </span>
              <span className="truncate">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-800 italic">
              Bước {currentStep}: Chọn {steps[currentStep - 1].title}
            </h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {currentProducts.length} sản phẩm sẵn có
            </span>
          </div>

          {currentProducts.length > 0 ? (
            <ProductGrid
              products={currentProducts}
              loading={false}
              onSelect={handleSelectProduct}
              selectedProductId={
                selectedProducts[steps[currentStep - 1].key]?.id
              }
              isBundleMode={true}
            />
          ) : (
            <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <AlertCircle className="mx-auto text-gray-300 mb-4" size={40} />
              <p className="text-gray-400 font-medium">
                Hiện chưa có sản phẩm {steps[currentStep - 1].title} nào trong
                kho.
              </p>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg sticky top-8 overflow-hidden">
            <div className="p-5 bg-[#0b4a32] text-white flex justify-between items-center">
              <h3 className="text-lg font-bold uppercase italic tracking-tighter">
                Bộ sản phẩm của bạn
              </h3>
            </div>

            <div className="p-6">
              {steps.map((step) => {
                const selected = selectedProducts[step.key];
                return (
                  <div
                    key={step.id}
                    className="py-4 border-b border-gray-100 last:border-0"
                  >
                    <p className="text-[9px] font-black uppercase text-emerald-600 mb-2 tracking-[0.2em]">
                      {step.title}
                    </p>
                    {selected ? (
                      <div className="flex gap-4 items-center animate-in fade-in slide-in-from-right-2 duration-300">
                        <img
                          src={
                            selected.images.find((img) => img.isPrimary)?.url
                          }
                          alt={selected.name}
                          className="w-14 h-14 object-cover rounded-lg border shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight italic">
                            {selected.name}
                          </p>
                          <p className="text-red-500 font-black text-sm mt-1">
                            {selected.price.toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveProduct(step.key)}
                          className="text-gray-300 hover:text-red-500 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStepClick(step.id)}
                        className="w-full text-left text-gray-400 text-[13px] py-2 hover:text-[#0b4a32] transition-colors italic border border-dashed border-gray-100 rounded-lg px-3"
                      >
                        {step.id}. Chọn {step.title}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase italic">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-black text-red-600 tracking-tighter">
                  {totalPrice.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <button
                disabled={Object.values(selectedProducts).some((p) => !p)}
                onClick={handleAddBundleToCart}
                className="w-full py-4 bg-[#0b4a32] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#083625] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-md uppercase tracking-widest text-sm"
              >
                <ShoppingCart size={20} /> Thêm tất cả vào giỏ
              </button>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-16 flex justify-center">
        <Link
          to="/collections/all"
          className="flex items-center gap-3 text-gray-400 hover:text-[#0b4a32] font-black text-xs uppercase tracking-widest transition-all group"
        >
          Tiếp tục mua sắm
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#0b4a32] group-hover:bg-[#0b4a32] group-hover:text-white transition-all shadow-sm">
            <ChevronRight size={16} />
          </div>
        </Link>
      </div>

      {/* --- MODAL CHỌN BIẾN THỂ --- */}
      {isVariantModalOpen && tempProduct && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">
            {/* Header Modal */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
              <h3 className="font-bold text-gray-800 dark:text-gray-100">
                Chọn kích thước
              </h3>
              <button
                onClick={() => setIsVariantModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex gap-4 mb-6">
                <img
                  src={tempProduct.images.find((i) => i.isPrimary)?.url}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  alt={tempProduct.name}
                />
                <div>
                  <h4 className="font-bold text-sm line-clamp-2 text-gray-900 dark:text-gray-100">
                    {tempProduct.name}
                  </h4>
                  <p className="text-emerald-600 dark:text-emerald-400 font-black text-lg mt-1">
                    {selectedVariant?.price.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              </div>

              {/* Danh sách size */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest mb-3">
                  Kích thước sẵn có:
                </p>
                {tempProduct.variants?.map((v: any) => (
                  <div
                    key={v.variantId}
                    onClick={() => setSelectedVariant(v)}
                    className={`flex justify-between items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedVariant?.variantId === v.variantId
                        ? "border-[#0b4a32] bg-green-50 dark:bg-green-900/40 dark:border-emerald-500"
                        : "border-gray-100 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedVariant?.variantId === v.variantId
                            ? "border-[#0b4a32] dark:border-emerald-400"
                            : "border-gray-300 dark:border-gray-500"
                        }`}
                      >
                        {selectedVariant?.variantId === v.variantId && (
                          <div className="w-2 h-2 bg-[#0b4a32] dark:bg-emerald-400 rounded-full" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                        {v.size} {v.thickness ? `- Dày ${v.thickness}` : ""}
                      </span>
                    </div>
                    <span className="text-xs font-black text-gray-500 dark:text-gray-400">
                      {v.price.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={confirmSelection}
                className="w-full mt-8 py-4 bg-[#0b4a32] hover:bg-[#083625] dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg transition-all active:scale-95"
              >
                Xác nhận chọn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductBundle;

// //test

// import React, { useState, useEffect, useMemo } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   ChevronRight,
//   ShoppingCart,
//   Trash2,
//   Loader2,
//   AlertCircle,
//   X,
// } from "lucide-react";
// import ProductGrid from "./ProductGrid";
// import type { Product } from "../Products/InterfaceItem";
// import axios from "axios";
// import banner_phu_3 from "../../assets/banner/Banner-phu-3.webp";

// import { addToCart } from "../../store/slices/cartSlice";
// import { useDispatch } from "react-redux";
// import { useAuth } from "@clerk/clerk-react"; // Để lấy token
// import { toast } from "sonner"; // Hoặc thư viện thông báo ông đang dùng

// const BASE_URL = "http://localhost:8082";

// // --- HÀM MAP DỮ LIỆU CHUẨN (GIỮ NGUYÊN TỪ BẠN ÔNG) ---
// const mapProduct = (p: any): Product => {
//   const discountVariant = p.variants?.find(
//     (v: any) => v.originalPrice && v.originalPrice > v.price,
//   );
//   return {
//     id: p._id?.$oid ?? p.id ?? p._id,
//     name: p.name,
//     brand: p.brand,
//     price: p.price ?? 0,
//     originalPrice: discountVariant?.originalPrice ?? undefined,
//     images: (p.images ?? []).map((img: any) => ({
//       url: img.url,
//       isPrimary: img.isPrimary,
//     })),
//     status: p.status === "AVAILABLE" ? "selling" : "stopselling",
//     rating: p.rating ?? 0,
//     reviewCount: p.reviewCount ?? 0,
//     totalStockQuantity: p.totalStockQuantity ?? 0,
//     variants: p.variants ?? [],
//     category: p.category,
//   };
// };

// const steps = [
//   { id: 1, key: "nem", title: "Nệm", code: "NEM" },
//   { id: 2, key: "chanGa", title: "Chăn ga", code: "CHAN-GA" },
//   { id: 3, key: "goi", title: "Gối", code: "GOI" },
//   { id: 4, key: "phuKien", title: "Phụ kiện", code: "PHU-KIEN" },
// ];

// const ProductBundle: React.FC = () => {
//   const [allProducts, setAllProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
//   const [tempProduct, setTempProduct] = useState<Product | null>(null);
//   const [selectedVariant, setSelectedVariant] = useState<any>(null);
//   const [selectedProducts, setSelectedProducts] = useState<
//     Record<string, Product | null>
//   >({
//     nem: null,
//     chanGa: null,
//     goi: null,
//     phuKien: null,
//   });
//   const dispatch = useDispatch<any>();
//   const { getToken } = useAuth();
//   const navigate = useNavigate();

//   // --- HÀM XỬ LÝ ĐẨY LÊN GIỎ HÀNG ---
//   const handleAddBundleToCart = async () => {
//     const bundleItems = Object.values(selectedProducts).filter(
//       (p) => p !== null,
//     );

//     if (bundleItems.length < 4) {
//       toast.error("Vui lòng chọn đủ 4 món nhen Bằng ơi!");
//       return;
//     }

//     try {
//       const token = await getToken();

//       for (const product of bundleItems as any[]) {
//         const itemToStore = {
//           productId: product.id,
//           variantId: product.selectedVariant?.variantId,
//           name: product.name,
//           price: product.price,
//           image: product.images.find((img: any) => img.isPrimary)?.url || "",
//           quantity: 1,
//           size: product.selectedVariant?.size,
//           thickness: product.selectedVariant?.thickness,
//           color: product.selectedVariant?.color,
//         };

//         await dispatch(addToCart({ token, product: itemToStore })).unwrap();
//         console.log(`Đã thêm xong món: ${product.name}`);
//       }

//       toast.success("Tuyệt vời! Đã thêm trọn bộ combo vào giỏ hàng!");
//       navigate("/cart");
//     } catch (err) {
//       console.error("Lỗi thêm combo:", err);
//       toast.error("Gặp sự cố khi gom bộ sản phẩm rồi.");
//     }
//   };

//   //  Gọi API lấy toàn bộ sản phẩm
//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         setIsLoading(true);
//         const res = await axios.get(`${BASE_URL}/api/products/all`);
//         setAllProducts(res.data.map(mapProduct));
//       } catch (err) {
//         setError("Không thể tải danh sách sản phẩm bundle.");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   // 2. Phân loại sản phẩm theo từng bước (Step) dựa trên Category Code
//   const productsByStep = useMemo(() => {
//     const grouped: Record<string, Product[]> = {
//       nem: [],
//       chanGa: [],
//       goi: [],
//       phuKien: [],
//     };

//     allProducts.forEach((p) => {
//       const pParentCode = p.category?.parentCode?.toUpperCase();
//       const pCode = p.category?.code?.toUpperCase();

//       if (pParentCode === "NEM" || pCode === "NEM") grouped.nem.push(p);
//       else if (pParentCode === "CHAN-GA" || pCode === "CHAN-GA")
//         grouped.chanGa.push(p);
//       else if (pParentCode === "GOI" || pCode === "GOI") grouped.goi.push(p);
//       else if (pParentCode === "PHU-KIEN" || pCode === "PHU-KIEN")
//         grouped.phuKien.push(p);
//     });
//     return grouped;
//   }, [allProducts]);

//   const totalPrice = Object.values(selectedProducts).reduce(
//     (sum, p) => sum + (p?.price || 0),
//     0,
//   );

//   // const handleSelectProduct = (product: Product) => {
//   //   const currentStepKey = steps[currentStep - 1].key;
//   //   setSelectedProducts(prev => ({ ...prev, [currentStepKey]: product }));
//   //   if (currentStep < 4) {
//   //     setTimeout(() => setCurrentStep(prev => prev + 1), 400);
//   //   }
//   // };
//   const handleSelectProduct = (product: Product) => {
//     setTempProduct(product);
//     // Mặc định chọn biến thể đầu tiên cho khách đỡ phải click nhiều
//     setSelectedVariant(product.variants?.[0] || null);
//     setIsVariantModalOpen(true);
//   };

//   // --- HÀM XÁC NHẬN CHỌN BIẾN THỂ ---
//   const confirmSelection = () => {
//     if (!tempProduct || !selectedVariant) return;

//     const currentStepKey = steps[currentStep - 1].key;

//     // Gộp sản phẩm gốc với thông tin biến thể đã chọn
//     const finalSelection = {
//       ...tempProduct,
//       selectedVariant: selectedVariant,
//       price: selectedVariant.price, // Lấy giá của size đã chọn
//     };

//     setSelectedProducts((prev) => ({
//       ...prev,
//       [currentStepKey]: finalSelection,
//     }));

//     // Đóng Modal và qua bước tiếp theo
//     setIsVariantModalOpen(false);
//     setTempProduct(null);

//     if (currentStep < 4) {
//       setTimeout(() => setCurrentStep((prev) => prev + 1), 400);
//     }
//   };

//   const handleRemoveProduct = (key: string) =>
//     setSelectedProducts((prev) => ({ ...prev, [key]: null }));

//   const handleStepClick = (stepId: number) => {
//     if (stepId === 1 || selectedProducts[steps[stepId - 2].key]) {
//       setCurrentStep(stepId);
//     }
//   };

//   const currentProducts = productsByStep[steps[currentStep - 1].key] || [];

//   if (isLoading)
//     return (
//       <div className="flex flex-col items-center justify-center py-40 min-h-screen">
//         <Loader2 className="w-12 h-12 text-[#0b4a32] animate-spin mb-4" />
//         <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
//           Đang khởi tạo bộ giấc ngủ...
//         </p>
//       </div>
//     );

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10 bg-white min-h-screen font-sans text-[#333]">
//       <div className="flex flex-col md:flex-row gap-4 mb-10">
//         <div className="flex-1 overflow-hidden rounded-xl h-[200px] md:h-[280px] shadow-sm">
//           <img
//             src={banner_phu_3}
//             alt="Promotion"
//             className="w-full h-full object-cover transition-transform duration-700 cursor-pointer hover:scale-105"
//           />
//         </div>
//       </div>

//       <header className="mb-10">
//         <h1 className="text-3xl md:text-4xl font-extrabold text-[#111] mb-3 uppercase tracking-tight">
//           Tạo bộ sản phẩm Giấc Ngủ Hoàn Hảo
//         </h1>
//         <p className="text-gray-500 italic text-sm">
//           Lựa chọn từng món đồ để xây dựng không gian nghỉ ngơi lý tưởng của
//           riêng bạn.
//         </p>
//       </header>

//       {/* Steps Progress */}
//       <div className="flex items-center mb-10 w-full overflow-x-auto scrollbar-hide pb-2">
//         <div className="flex w-full min-w-[500px]">
//           {steps.map((step, index) => (
//             <button
//               key={step.id}
//               onClick={() => handleStepClick(step.id)}
//               className={`relative flex-1 py-4 flex items-center justify-center font-bold text-[12px] md:text-sm transition-all duration-300
//                 ${currentStep === step.id || !!selectedProducts[step.key] ? "bg-[#0b4a32] text-white" : "bg-[#f1f1f1] text-[#b5b5b5]"}
//                 ${index === 0 ? "rounded-l-lg" : ""} ${index === steps.length - 1 ? "rounded-r-lg" : ""}`}
//               style={{
//                 clipPath:
//                   index === steps.length - 1
//                     ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 4% 50%)"
//                     : index === 0
//                       ? "polygon(0% 0%, 96% 0%, 100% 50%, 96% 100%, 0% 100%)"
//                       : "polygon(0% 0%, 96% 0%, 100% 50%, 96% 100%, 0% 100%, 4% 50%)",
//                 marginLeft: index === 0 ? "0" : "-10px",
//               }}
//             >
//               <span
//                 className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border text-[10px] mr-2 ${currentStep === step.id || !!selectedProducts[step.key] ? "border-white" : "border-[#b5b5b5]"}`}
//               >
//                 {!!selectedProducts[step.key] ? "✓" : step.id}
//               </span>
//               <span className="truncate">{step.title}</span>
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
//         <div className="lg:col-span-8">
//           <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
//             <h2 className="text-2xl font-bold text-gray-800 italic">
//               Bước {currentStep}: Chọn {steps[currentStep - 1].title}
//             </h2>
//             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
//               {currentProducts.length} sản phẩm sẵn có
//             </span>
//           </div>

//           {currentProducts.length > 0 ? (
//             <ProductGrid
//               products={currentProducts}
//               loading={false}
//               onSelect={handleSelectProduct}
//               selectedProductId={
//                 selectedProducts[steps[currentStep - 1].key]?.id
//               }
//               isBundleMode={true}
//             />
//           ) : (
//             <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
//               <AlertCircle className="mx-auto text-gray-300 mb-4" size={40} />
//               <p className="text-gray-400 font-medium">
//                 Hiện chưa có sản phẩm {steps[currentStep - 1].title} nào trong
//                 kho.
//               </p>
//             </div>
//           )}
//         </div>

//         <aside className="lg:col-span-4">
//           <div className="bg-white rounded-xl border border-gray-200 shadow-lg sticky top-8 overflow-hidden">
//             <div className="p-5 bg-[#0b4a32] text-white flex justify-between items-center">
//               <h3 className="text-lg font-bold uppercase italic tracking-tighter">
//                 Bộ sản phẩm của bạn
//               </h3>
//             </div>

//             <div className="p-6">
//               {steps.map((step) => {
//                 const selected = selectedProducts[step.key];
//                 return (
//                   <div
//                     key={step.id}
//                     className="py-4 border-b border-gray-100 last:border-0"
//                   >
//                     <p className="text-[9px] font-black uppercase text-emerald-600 mb-2 tracking-[0.2em]">
//                       {step.title}
//                     </p>
//                     {selected ? (
//                       <div className="flex gap-4 items-center animate-in fade-in slide-in-from-right-2 duration-300">
//                         <img
//                           src={
//                             selected.images.find((img) => img.isPrimary)?.url
//                           }
//                           alt={selected.name}
//                           className="w-14 h-14 object-cover rounded-lg border shadow-sm"
//                         />
//                         <div className="flex-1 min-w-0">
//                           <p className="font-bold text-xs text-gray-900 line-clamp-2 leading-tight italic">
//                             {selected.name}
//                           </p>
//                           <p className="text-red-600 font-black text-sm mt-1">
//                             {selected.price.toLocaleString("vi-VN")}₫
//                           </p>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveProduct(step.key)}
//                           className="text-gray-300 hover:text-red-500 p-1"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => handleStepClick(step.id)}
//                         className="w-full text-left text-gray-400 text-[13px] py-2 hover:text-[#0b4a32] transition-colors italic border border-dashed border-gray-100 rounded-lg px-3"
//                       >
//                         {step.id}. Chọn {step.title}
//                       </button>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="p-6 bg-gray-50 border-t border-gray-100">
//               <div className="flex justify-between items-center mb-6">
//                 <span className="text-sm font-bold text-gray-700 uppercase italic">
//                   Tổng cộng:
//                 </span>
//                 <span className="text-2xl font-black text-red-600 tracking-tighter">
//                   {totalPrice.toLocaleString("vi-VN")}₫
//                 </span>
//               </div>
//               <button
//                 disabled={Object.values(selectedProducts).some((p) => !p)}
//                 onClick={handleAddBundleToCart}
//                 className="w-full py-4 bg-[#0b4a32] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#083625] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-md uppercase tracking-widest text-sm"
//               >
//                 <ShoppingCart size={20} /> Thêm tất cả vào giỏ
//               </button>
//             </div>
//           </div>
//         </aside>
//       </div>

//       <div className="mt-16 flex justify-center">
//         <Link
//           to="/collections/all"
//           className="flex items-center gap-3 text-gray-400 hover:text-[#0b4a32] font-black text-xs uppercase tracking-widest transition-all group"
//         >
//           Tiếp tục mua sắm
//           <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#0b4a32] group-hover:bg-[#0b4a32] group-hover:text-white transition-all shadow-sm">
//             <ChevronRight size={16} />
//           </div>
//         </Link>
//       </div>

//       {/* --- MODAL CHỌN BIẾN THỂ (Thêm vào cuối file) --- */}
//       {isVariantModalOpen && tempProduct && (
//         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
//             {/* Header Modal */}
//             <div className="p-4 border-b flex justify-between items-center bg-gray-50">
//               <h3 className="font-bold text-gray-800">Chọn kích thước</h3>
//               <button
//                 onClick={() => setIsVariantModalOpen(false)}
//                 className="text-gray-400 hover:text-black"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6">
//               <div className="flex gap-4 mb-6">
//                 <img
//                   src={tempProduct.images.find((i) => i.isPrimary)?.url}
//                   className="w-20 h-20 object-cover rounded-lg border"
//                 />
//                 <div>
//                   <h4 className="font-bold text-sm line-clamp-2">
//                     {tempProduct.name}
//                   </h4>
//                   <p className="text-emerald-600 font-black text-lg mt-1">
//                     {selectedVariant?.price.toLocaleString("vi-VN")}₫
//                   </p>
//                 </div>
//               </div>

//               {/* Danh sách size */}
//               <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
//                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3">
//                   Kích thước sẵn có:
//                 </p>
//                 {tempProduct.variants?.map((v: any) => (
//                   <div
//                     key={v.variantId}
//                     onClick={() => setSelectedVariant(v)}
//                     className={`flex justify-between items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
//                       selectedVariant?.variantId === v.variantId
//                         ? "border-[#0b4a32] bg-green-50"
//                         : "border-gray-100 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div
//                         className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
//                           selectedVariant?.variantId === v.variantId
//                             ? "border-[#0b4a32]"
//                             : "border-gray-300"
//                         }`}
//                       >
//                         {selectedVariant?.variantId === v.variantId && (
//                           <div className="w-2 h-2 bg-[#0b4a32] rounded-full" />
//                         )}
//                       </div>
//                       <span className="text-sm font-bold text-gray-700">
//                         {v.size} {v.thickness ? `- Dày ${v.thickness}` : ""}
//                       </span>
//                     </div>
//                     <span className="text-xs font-black text-gray-500">
//                       {v.price.toLocaleString("vi-VN")}₫
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               <button
//                 onClick={confirmSelection}
//                 className="w-full mt-8 py-4 bg-[#0b4a32] text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg hover:bg-[#083625] transition-all active:scale-95"
//               >
//                 Xác nhận chọn
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductBundle;
