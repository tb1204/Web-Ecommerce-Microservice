import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShoppingCart, Trash2 } from "lucide-react";
import ProductGrid from "./ProductGrid";
import type { Product } from "../Products/InterfaceItem";
import image_nem from "../../assets/about.webp";
import banner_phu_3 from "../../assets/banner/Banner-phu-3.webp";

// Mock data (Giữ nguyên và đảm bảo các key khớp với steps)
const productsData: Record<string, Product[]> = {
  nem: [
    {
      _id: "nem1",
      name: "Nệm foam Goodnight Eva gấp 3 nâng đỡ dày 10cm",
      brand: "WolfBed",
      price: 3099000,
      originalPrice: 4599000,
      images: [{ url: image_nem, is_primary: true }],
      status: "selling",
      rating: 4,
      reviewCount: 150,
      stock_quantity: 20,
    },
    {
      _id: "nem2",
      name: "Nệm foam tổng hợp Kim Cương Erica Smart Tech",
      brand: "WolfBed",
      price: 4239000,
      originalPrice: 4999000,
      images: [{ url: image_nem, is_primary: true }],
      status: "selling",
      rating: 4.7,
      reviewCount: 120,
      stock_quantity: 15,
    },
  ],
  chanGa: [
    {
      _id: "cg1",
      name: "Bộ ga chun Goodnight Airsilk 3CT màu xanh than",
      brand: "WolfBed",
      price: 650000,
      originalPrice: 850000,
      images: [{ url: image_nem, is_primary: true }],
      status: "selling",
      rating: 4.5,
      reviewCount: 60,
      stock_quantity: 30,
    },
  ],
  goi: [
    {
      _id: "g1",
      name: "Gối nằm cao cấp Artisano",
      brand: "WolfBed",
      price: 450000,
      originalPrice: 650000,
      images: [{ url: image_nem, is_primary: true }],
      status: "selling",
      rating: 4.5,
      reviewCount: 60,
      stock_quantity: 30,
    },
  ],
  phuKien: [
    {
      _id: "pk1",
      name: "Tấm bảo vệ nệm Artisano",
      brand: "WolfBed",
      price: 250000,
      originalPrice: 450000,
      images: [{ url: image_nem, is_primary: true }],
      status: "selling",
      rating: 4.5,
      reviewCount: 60,
      stock_quantity: 30,
    },
  ],
};

const steps = [
  { id: 1, key: "nem", title: "Nệm" },
  { id: 2, key: "chanGa", title: "Chăn ga" },
  { id: 3, key: "goi", title: "Gối" },
  { id: 4, key: "phuKien", title: "Phụ kiện" },
];

const ProductBundle: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, Product | null>>({
    nem: null,
    chanGa: null,
    goi: null,
    phuKien: null,
  });

  const totalPrice = Object.values(selectedProducts).reduce(
    (sum, product) => sum + (product?.price || 0),
    0,
  );


  const handleSelectProduct = (product: Product) => {
    const currentStepKey = steps[currentStep - 1].key;
    
    setSelectedProducts((prev) => ({
      ...prev,
      [currentStepKey]: product,
    }));

    // Tự động chuyển bước sau một khoảng thời gian ngắn để user kịp thấy feedback
    if (currentStep < 4) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 400);
    }
  };

  const handleRemoveProduct = (key: string) => {
    setSelectedProducts((prev) => ({ ...prev, [key]: null }));
  };

  const handleStepClick = (stepId: number) => {
    if (stepId === 1 || selectedProducts[steps[stepId - 2].key]) {
      setCurrentStep(stepId);
    }
  };

  const currentProducts = productsData[steps[currentStep - 1].key] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-white min-h-screen font-sans text-[#333]">
      {/* Banner */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-1 overflow-hidden rounded-xl h-[200px] md:h-[280px] shadow-sm">
          <img
            src={banner_phu_3}
            alt="Promotion"
            className="w-full h-full object-cover transition-transform duration-700 cursor-pointer hover:scale-105"
          />
        </div>
      </div>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#111] mb-3 uppercase tracking-tight">
          Tạo bộ sản phẩm Giấc Ngủ Hoàn Hảo
        </h1>
      </header>

      
      <div className="flex items-center mb-10 w-full overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
        <div className="flex w-full min-w-[450px] md:min-w-0"> 
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isDone = !!selectedProducts[step.key];

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`
                  relative flex-1 py-3 md:py-4 flex items-center justify-center font-bold text-[11px] md:text-base transition-all duration-300
                  ${isActive || isDone ? "bg-[#0b4a32] text-white" : "bg-[#f1f1f1] text-[#b5b5b5]"}
                  ${index === 0 ? "rounded-l-lg" : ""}
                  ${index === steps.length - 1 ? "rounded-r-lg" : ""}
                `}
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
                <span className={`
                  flex-shrink-0 flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full border text-[10px] md:text-xs mr-2
                  ${isActive || isDone ? "border-white" : "border-[#b5b5b5]"}
                `}>
                  {isDone ? "✓" : step.id}
                </span>
                <span className="truncate">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-800 italic">
              Bước {currentStep}: Chọn {steps[currentStep - 1].title}
            </h2>
          </div>

          <ProductGrid
            products={currentProducts}
            loading={false}
            onSelect={handleSelectProduct}
            selectedProductId={selectedProducts[steps[currentStep - 1].key]?._id}
            isBundleMode={true}
          />
        </div>

        {/* Sidebar Summary */}
        <aside className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg sticky top-8 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-[#0b4a32] text-white">
              <h3 className="text-xl font-bold uppercase italic tracking-tighter">Bộ sản phẩm của bạn</h3>
            </div>

            <div className="p-6 space-y-0">
              {steps.map((step) => {
                const selected = selectedProducts[step.key];
                return (
                  <div key={step.id} className="py-4 border-b border-gray-100 last:border-0">
                    <p className="text-[10px] font-black uppercase text-emerald-600 mb-2 tracking-[0.2em]">
                      {step.title}
                    </p>
                    {selected ? (
                      <div className="flex gap-4 items-center animate-in fade-in slide-in-from-right-2 duration-300">
                        <img
                          src={selected.images.find((img) => img.is_primary)?.url || image_nem}
                          alt={selected.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-100 shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight italic">
                            {selected.name}
                          </p>
                          <p className="text-red-600 font-black text-sm mt-1">
                            {selected.price.toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveProduct(step.key)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStepClick(step.id)}
                        className="w-full text-left text-gray-400 text-sm py-2 hover:text-[#0b4a32] transition-colors italic border border-dashed border-gray-100 rounded-lg px-2"
                      >
                        {step.id}. Vui lòng chọn {step.title}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-700 uppercase italic">Tổng cộng:</span>
                <span className="text-2xl font-black text-red-600 tracking-tighter">
                  {totalPrice.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <button
                disabled={Object.values(selectedProducts).some((p) => !p)}
                onClick={() => alert("Đã thêm combo hoàn hảo vào giỏ hàng của bạn!")}
                className="w-full py-4 bg-[#0b4a32] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#083625] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-md uppercase tracking-widest text-sm"
              >
                <ShoppingCart size={20} />
                Thêm tất cả vào giỏ
              </button>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-16 flex justify-center">
        <Link
          to="/collections/all"
          className="flex items-center gap-3 text-gray-500 hover:text-[#0b4a32] font-black text-xs uppercase tracking-widest transition-all group"
        >
          Tiếp tục mua sắm
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#0b4a32] group-hover:bg-[#0b4a32] group-hover:text-white transition-all shadow-sm">
            <ChevronRight size={16} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductBundle;