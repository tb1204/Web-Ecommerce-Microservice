import React, { useState, useEffect } from "react";

import {
  X,
  Save,
  Info,
  Fingerprint,
  Award,
  History,
  Image as ImageIcon,
  PlusCircle,
  RefreshCw,
  Tag,
  MapPin,
  Trash2,
  Box,
} from "lucide-react";

import { toast } from "sonner";
import type {
  Product,
  ProductImage,
  ProductVariant,
} from "../Products/InterfaceItem";

import axios from "axios";

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
}

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

interface ProductFormState extends Omit<Product, "images" | "tags"> {
  tags: string;
  images: string[];
  url: string;
}

const generateCategoryCode = (name: string) => {
  return name
    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProductFormState | null>(null);

  const [categories, setCategories] = useState<
    { name: string; code: string }[]
  >([]);

  const [isNewCategory, setIsNewCategory] = useState(false);
  const PRODUCT_API_URL = "http://localhost:8082";
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get(`${PRODUCT_API_URL}/api/categories/all`);
        setCategories(res.data);
      } catch (err) {
        console.error("Không lấy được danh mục:", err);
      }
    };
    if (isOpen) fetchCats();
  }, [isOpen]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/categories/all");
        setCategories(res.data);
      } catch (err) {
        console.error("Không lấy được danh mục:", err);
      }
    };
    if (isOpen) fetchCats();
  }, [isOpen]);

  useEffect(() => {
    if (product && isOpen) {
      const primaryImg =
        product.images?.find((img) => img.isPrimary === true)?.url || "";
      const subImages =
        product.images
          ?.filter((img) => img.isPrimary !== true)
          ?.map((img) => img.url) || [];

      setFormData({
        ...product,
        category: product.category || { name: "", code: "" },

        specifications: product.specifications || {
          material: "",
          weight: "",
          firmness: "",
          design: "",
          certificationNumber: "",
        },
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
        images: subImages,
        url: primaryImg,

        variants: product.variants || [],
      });
    }
  }, [product, isOpen, formData?.id]);

  if (!isOpen || !formData) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (!prev) return null;

      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        const parentKey = parent as keyof ProductFormState;
        return {
          ...prev,
          [parentKey]: {
            ...(prev[parentKey] as object),
            [child]: value,
          },
        };
      }
      return { ...prev, [name]: value };
    });
  };

  // --- LOGIC BIẾN THỂ (MỚI THÊM) ---
  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: any,
  ) => {
    if (!formData) return;
    const newVariants = [...(formData.variants || [])];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    if (!formData) return;
    const newV: ProductVariant = {
      variantId: crypto.randomUUID(),
      sku: `${formData.productCode || "SKU"}-${Date.now()}`,
      size: "",
      thickness: "",
      price: 0,
      originalPrice: 0,
      stockQuantity: 0,
      status: "ACTIVE",
    };
    setFormData({
      ...formData,
      variants: [...(formData.variants || []), newV],
    });
  };

  const removeVariant = (index: number) => {
    if (!formData) return;
    const newVariants = formData.variants?.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) =>
        prev ? { ...prev, url: reader.result as string } : null,
      );
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) =>
          prev
            ? { ...prev, images: [...prev.images, reader.result as string] }
            : null,
        );
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeGalleryImage = (index: number) => {
    if (!formData) return;
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (isNewCategory && formData.category!.name) {
      try {
        await axios.post("http://localhost:8082/api/categories/add", {
          name: formData.category!.name,
          code: formData.category!.code,
        });
      } catch (err) {
        console.error("Lỗi lưu danh mục mới:", err);
      }
    }

    const updatedImages: ProductImage[] = [
      { url: formData.url, isPrimary: true },
      ...formData.images.map((url) => ({ url, isPrimary: false })),
    ];

    const finalTags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Tự động tính lại tổng kho và giá thấp nhất
    const totalStock =
      formData.variants?.reduce((sum, v) => sum + Number(v.stockQuantity), 0) ||
      0;
    const minPrice =
      formData.variants?.reduce((min, v) => Math.min(min, v.price), Infinity) ||
      0;

    const finalData: Product = {
      ...formData,
      id: product?.id,

      price: minPrice === Infinity ? 0 : minPrice,
      totalStockQuantity: totalStock, // Cập nhật tổng kho

      tags: finalTags,
      images: updatedImages,
      updatedAt: new Date().toISOString(),
    } as Product;

    onSave(finalData);
    toast.success("Đã cập nhật thông tin sản phẩm!");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border"
      >
        {/* Header - GIỮ NGUYÊN */}

        <div className="p-5 border-b flex justify-between items-center bg-emerald-600 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Save size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none">
                Chỉnh sửa sản phẩm
              </h2>
              <p className="text-[11px] text-emerald-100 mt-1 uppercase tracking-widest font-mono italic font-bold">
                Mã dòng sản phẩm: {formData.productCode}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-emerald-700 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide bg-gray-50/30">
          {/* QUẢN LÝ HÌNH ẢNH - GIỮ NGUYÊN */}

          <section className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={18} /> Quản lý hình ảnh
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[11px] font-bold text-emerald-600 uppercase tracking-wider italic">
                  <span>Ảnh đại diện (*)</span>
                  <label
                    htmlFor="main-image-edit"
                    className="flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <RefreshCw size={12} /> Thay đổi ảnh
                  </label>
                  <input
                    type="file"
                    id="main-image-edit"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainFileChange}
                  />
                </div>
                <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border-2 border-emerald-500/20 flex items-center justify-center shadow-inner">
                  {formData.url ? (
                    <img
                      src={formData.url}
                      alt="Main"
                      className="w-full h-full object-contain p-2 animate-in fade-in duration-500"
                    />
                  ) : (
                    <ImageIcon size={48} className="opacity-20" />
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider italic">
                    Ảnh phụ bổ trợ ({formData.images.length})
                  </label>
                  <label
                    htmlFor="gallery-images-edit"
                    className="flex items-center gap-1.5 py-1.5 px-4 bg-emerald-600 text-white rounded-full text-[11px] font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <PlusCircle size={14} /> Thêm ảnh phụ
                  </label>
                  <input
                    type="file"
                    id="gallery-images-edit"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleGalleryFileChange}
                  />
                </div>
                <div className="grid grid-cols-4 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar content-start bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                  {formData.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-white p-2 rounded-2xl border border-gray-100 shadow-sm group animate-in zoom-in-95"
                    >
                      <img
                        src={img}
                        className="w-full h-full object-cover rounded-xl"
                        alt=""
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* THÔNG TIN CƠ BẢN - GIỮ NGUYÊN */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2 font-black">
              <Info size={16} className="text-emerald-500" /> Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <InputGroup
                label="Tên sản phẩm"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <div className="space-y-1.5 font-mono">
                <label className="text-xs text-gray-500 ml-1 italic font-black flex items-center gap-1">
                  <Fingerprint size={12} /> Mã nội bộ
                </label>
                <input
                  type="text"
                  value={formData.productCode || ""}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm"
                  disabled
                />
              </div>

              <InputGroup
                label="Thương hiệu"
                name="brand"
                value={formData.brand || ""}
                onChange={handleChange}
              />
              <InputGroup
                label="Xuất xứ"
                name="origin"
                value={formData.origin || ""}
                onChange={handleChange}
                icon={<MapPin size={12} />}
              />
              <InputGroup
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                icon={<Tag size={12} />}
                placeholder="cao_cap, khang_khuan..."
              />

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 font-black uppercase italic">
                  Danh mục
                </label>
                {!isNewCategory ? (
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-white h-[42px] focus:border-emerald-500 outline-none"
                    value={formData.category?.name || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "ADD_NEW") {
                        setIsNewCategory(true);
                        setFormData((prev) =>
                          prev
                            ? { ...prev, category: { name: "", code: "" } }
                            : null,
                        );
                      } else {
                        const selected = categories.find((c) => c.name === val);
                        setFormData((prev) =>
                          prev
                            ? {
                                ...prev,
                                category: selected || { name: val, code: "" },
                              }
                            : null,
                        );
                      }
                    }}
                  >
                    {categories.map((cat) => (
                      <option key={cat.code} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    <option
                      value="ADD_NEW"
                      className="text-emerald-600 font-bold"
                    >
                      + THÊM DANH MỤC MỚI
                    </option>
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-emerald-500 bg-white text-sm font-medium outline-none"
                      placeholder="Nhập tên danh mục mới"
                      value={formData.category?.name || ""}
                      onChange={(e) => {
                        const newName = e.target.value;
                        setFormData((prev) =>
                          prev
                            ? {
                                ...prev,
                                category: {
                                  name: newName,
                                  code: generateCategoryCode(newName),
                                },
                              }
                            : null,
                        );
                      }}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsNewCategory(false)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-red-500 font-bold hover:underline"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SECTION BIẾN THỂ  */}
          <section className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                <Box size={18} /> Danh sách kích thước & Giá
              </h3>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1.5 py-1.5 px-4 bg-emerald-600 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-md"
              >
                <PlusCircle size={14} /> Thêm size mới
              </button>
            </div>
            <div className="space-y-4">
              {formData.variants?.map((v, index) => (
                <div
                  key={v.variantId}
                  className="p-4 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-2 md:grid-cols-6 gap-4 items-end animate-in slide-in-from-right-5 relative group"
                >
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">
                      Kích thước
                    </label>
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) =>
                        handleVariantChange(index, "size", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500"
                      placeholder="160x200"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">
                      Độ dày
                    </label>
                    <input
                      type="text"
                      value={v.thickness}
                      onChange={(e) =>
                        handleVariantChange(index, "thickness", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500"
                      placeholder="10cm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-emerald-600 uppercase ml-1">
                      Giá bán (₫)
                    </label>
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "price",
                          Number(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl border-emerald-100 text-xs font-bold outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">
                      Giá gốc (₫)
                    </label>
                    <input
                      type="number"
                      value={v.originalPrice}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "originalPrice",
                          Number(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">
                      Kho
                    </label>
                    <input
                      type="number"
                      value={v.stockQuantity}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "stockQuantity",
                          Number(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* THÔNG SỐ KỸ THUẬT  */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2 font-black">
              <Award size={16} className="text-emerald-500" /> Thông số kỹ thuật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <InputGroup
                label="Chất liệu"
                name="specifications.material"
                value={formData.specifications?.material || ""}
                onChange={handleChange}
              />
              <InputGroup
                label="Độ cứng"
                name="specifications.firmness"
                value={formData.specifications?.firmness || ""}
                onChange={handleChange}
              />
              <InputGroup
                label="Thiết kế"
                name="specifications.design"
                value={formData.specifications?.design || ""}
                onChange={handleChange}
              />
              <InputGroup
                label="Trọng lượng"
                name="specifications.weight"
                value={formData.specifications?.weight || ""}
                onChange={handleChange}
              />
              <InputGroup
                label="Số chứng nhận"
                name="specifications.certificationNumber"
                value={formData.specifications?.certificationNumber || ""}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* MÔ TẢ  */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
            <div className="space-y-1.5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <label className="text-sm text-gray-400 uppercase tracking-widest mb-3 block ml-1 font-bold">
                Mô tả sản phẩm
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={4}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 outline-none text-sm leading-relaxed"
              />
            </div>
            <div className="space-y-3 text-right">
              <label className="text-sm text-gray-400 uppercase tracking-widest mb-3 block mr-1 font-bold">
                Trạng thái bán
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium bg-white cursor-pointer shadow-sm"
              >
                <option value="AVAILABLE">Đang bán</option>
                <option value="OUT_OF_STOCK">Hết hàng</option>
                <option value="stopselling">Ngừng kinh doanh</option>
              </select>
              <div className="p-5 mt-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4 text-left">
                <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600">
                  <History size={24} />
                </div>
                <div className="text-[10px] text-emerald-800 uppercase italic font-black">
                  Giá hiển thị đại diện và Tổng kho sẽ tự động tính từ danh sách
                  biến thể.
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-all font-mono uppercase tracking-widest underline underline-offset-4"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-10 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save size={18} /> Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

const InputGroup = ({ label, icon, ...props }: InputGroupProps) => (
  <div className="space-y-1.5">
    <label className="text-xs text-gray-500 ml-1 italic font-black flex items-center gap-1 uppercase tracking-tighter">
      {" "}
      {icon} {label}{" "}
    </label>
    <input
      {...props}
      autoComplete="off"
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium h-[42px]"
    />
  </div>
);

export default ProductEditModal;
