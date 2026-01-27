import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ShoppingCart, Trash2 } from "lucide-react";
import ProductCard from "../Products/ProductCard";
import type { Product } from "../Products/InterfaceItem";
import image_nem from "../../assets/about.webp";
import banner_phu_3 from "../../assets/banner/Banner-phu-3.webp";
// Mock data (Giữ nguyên)
const productsData: Record<string, Product[]> = {
  nem: [
    { _id: "nem1", name: "Nệm foam Goodnight Eva gấp 3 nâng đỡ dày 10cm", brand: "WolfBed", price: 3099000, originalPrice: 4599000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.8, reviewCount: 150, stock_quantity: 20 },
    { _id: "nem2", name: "Nệm foam tổng hợp Kim Cương Erica Smart Tech", brand: "WolfBed", price: 4239000, originalPrice: 4999000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.7, reviewCount: 120, stock_quantity: 15 },
    { _id: "nem3", name: "Nệm foam tổng hợp Kim Cương Erica Smart Tech", brand: "WolfBed", price: 4239000, originalPrice: 4999000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.7, reviewCount: 120, stock_quantity: 15 },
    { _id: "nem4", name: "Nệm foam tổng hợp Kim Cương Erica Smart Tech", brand: "WolfBed", price: 4239000, originalPrice: 4999000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.7, reviewCount: 120, stock_quantity: 15 },
    { _id: "nem5", name: "Nệm foam tổng hợp Kim Cương Erica Smart Tech", brand: "WolfBed", price: 4239000, originalPrice: 4999000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.7, reviewCount: 120, stock_quantity: 15 },
    { _id: "nem6", name: "Nệm foam tổng hợp Kim Cương Erica Smart Tech", brand: "WolfBed", price: 4239000, originalPrice: 4999000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.7, reviewCount: 120, stock_quantity: 15 },
    { _id: "nem7", name: "Nệm foam tổng hợp Kim Cương Erica Smart Tech", brand: "WolfBed", price: 4239000, originalPrice: 4999000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.7, reviewCount: 120, stock_quantity: 15 },
  ],
  chanGa: [
    { _id: "cg1", name: "Bộ ga chun Goodnight Airsilk 3CT màu xanh than", brand: "WolfBed", price: 650000, originalPrice: 850000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.5, reviewCount: 60, stock_quantity: 30 },
    { _id: "cg2", name: "Bộ ga chun Goodnight Airsilk 3CT màu xanh than", brand: "WolfBed", price: 650000, originalPrice: 850000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.5, reviewCount: 60, stock_quantity: 30 },
    { _id: "cg3", name: "Bộ ga chun Goodnight Airsilk 3CT màu xanh than", brand: "WolfBed", price: 650000, originalPrice: 850000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.5, reviewCount: 60, stock_quantity: 30 },
    { _id: "cg4", name: "Bộ ga chun Goodnight Airsilk 3CT màu xanh than", brand: "WolfBed", price: 650000, originalPrice: 850000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.5, reviewCount: 60, stock_quantity: 30 },
  ],
  goi: [
    { _id: "g1", name: "Bộ ga chun Goodnight Airsilk 3CT màu xanh than", brand: "WolfBed", price: 650000, originalPrice: 850000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.5, reviewCount: 60, stock_quantity: 30 },
    { _id: "g2", name: "Bộ ga chun Goodnight Airsilk 3CT màu xanh than", brand: "WolfBed", price: 650000, originalPrice: 850000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.5, reviewCount: 60, stock_quantity: 30 },
  ],
  phuKien: [
    { _id: "pk1", name: "Bộ ga chun Goodnight Airsilk 3CT màu xanh than", brand: "WolfBed", price: 650000, originalPrice: 850000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.5, reviewCount: 60, stock_quantity: 30 },
    { _id: "pk2", name: "Bộ ga chun Goodnight Airsilk 3CT màu xanh than", brand: "WolfBed", price: 650000, originalPrice: 850000, images: [{ url: image_nem, is_primary: true }], status: "selling", rating: 4.5, reviewCount: 60, stock_quantity: 30 },
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
    0
  );

  // Logic giữ nguyên
  const handleSelectProduct = (product: Product) => {
    const stepKey = steps[currentStep - 1].key;
    setSelectedProducts((prev) => ({ ...prev, [stepKey]: product }));
    if (currentStep < 4) setCurrentStep(currentStep + 1);
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
      {/*Banner  */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-1 overflow-hidden rounded-xl h-[200px] md:h-[280px]">
          <img
            src={banner_phu_3}
            alt="Khuyến mãi nệm" 
            className="w-full h-full object-cover transition-transform duration-700 cursor-pointer hover:scale-105"
          />
        </div>
      </div>
      {/* Header */}
      <header className=" mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#111] mb-3 uppercase tracking-tight">
          Tạo bộ sản phẩm Giấc Ngủ Hoàn Hảo
        </h1>
      </header>

      {/* Progress Bar - Arrow Style (Clip-path) */}
      <div className="flex items-center justify-start mb-12 w-full overflow-hidden">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isDone = !!selectedProducts[step.key];
          
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`
                relative flex-1 py-4 flex items-center justify-center font-bold text-base md:text-lg transition-all
                ${isActive || isDone ? "bg-[#0b4a32] text-white" : "bg-[#f1f1f1] text-[#b5b5b5]"}
                ${index === 0 ? "rounded-l-sm" : ""}
              `}
              style={{
                clipPath: index === steps.length - 1 
                  ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 5% 50%)" 
                  : index === 0 
                  ? "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%)"
                  : "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%)",
                marginLeft: index === 0 ? "0" : "-12px"
              }}
            >
              <span className={`
                flex items-center justify-center w-6 h-6 rounded-full border text-xs mr-3
                ${isActive || isDone ? "border-white" : "border-[#b5b5b5]"}
              `}>
                {isDone ? "✓" : step.id}
              </span>
              {step.title}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Bước {currentStep}: Chọn {steps[currentStep - 1].title}
            </h2>
          </div>

          <ProductCard
            products={currentProducts}
            loading={false}
            onSelect={handleSelectProduct}
            selectedProductId={selectedProducts[steps[currentStep - 1].key]?._id}
            isBundleMode={true}
          />
        </div>

        {/* Sidebar Summary */}
        <aside className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-8 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-white">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                Bộ sản phẩm của bạn
              </h3>
            </div>

            <div className="p-6 space-y-0">
              {steps.map((step) => {
                const selected = selectedProducts[step.key];
                return (
                  <div key={step.id} className="py-4 border-b border-gray-100 last:border-0">
                    <p className="text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-[0.2em]">{step.title}</p>
                    {selected ? (
                      <div className="flex gap-4 items-center">
                        <img
                          src={selected.images.find((img) => img.is_primary)?.url || image_nem}
                          alt={selected.name}
                          className="w-16 h-16 object-cover rounded border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">{selected.name}</p>
                          <p className="text-red-600 font-bold text-sm mt-1">
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
                        className="w-full text-left text-gray-400 text-sm py-1 hover:text-[#0b4a32] transition-colors"
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
                <span className="text-lg font-bold text-gray-700">Tổng tiền:</span>
                <span className="text-2xl font-black text-red-600 tracking-tight">
                  {totalPrice.toLocaleString("vi-VN")}₫
                </span>
              </div>

              <button
                disabled={Object.values(selectedProducts).some((p) => !p)}
                className="w-full py-4 bg-[#0b4a32] text-white rounded-lg font-bold text-base flex items-center justify-center gap-3 hover:bg-[#083625] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-md uppercase tracking-wide"
              >
                <ShoppingCart size={20} />
                Thêm tất cả vào giỏ
              </button>
            </div>
          </div>

        </aside>
      </div>
      {/* Nút xem thêm */}
            <div className="mt-10 flex justify-center">
              <Link 
                to="/collections/all" 
                className="flex items-center gap-2 text-gray-700 hover:text-[#1a4d32] font-medium transition-all group"
              >
                Xem thêm sản phẩm 
                <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center group-hover:border-[#1a4d32] group-hover:bg-[#1a4d32] group-hover:text-white transition-all">
                  <ChevronRight size={14} />
                </div>
              </Link>
            </div>
    </div>
    
  );
};

export default ProductBundle;