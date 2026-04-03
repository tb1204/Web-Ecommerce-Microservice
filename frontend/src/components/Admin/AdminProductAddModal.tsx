import React, { useState, useEffect } from "react";

import {
  X,
  PlusCircle,
  Award,
  Fingerprint,
  DollarSign,
  Image as ImageIcon,
  Trash2,
  Tag,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import type { ProductVariant } from "../Products/InterfaceItem";

interface ProductAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (formData: FormData) => void;
}

interface ProductFormState {
  name: string;
  productCode: string;
  brand: string;
  origin: string;
  // Giữ đúng 4 trường như Entity mới
  category: { name: string; code: string; parentCode: string; parentName: string }; 
  specifications: {
    material: string;
    weight: string;
    firmness: string;
    design: string;
    certificationNumber: string;
  };
  variants: ProductVariant[];
  status: string;
  tags: string;
  description: string;
  imageObjects: { file: File; preview: string }[];
}


const ProductAddModal: React.FC<ProductAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const initialFormState: ProductFormState = {
    name: "",
    productCode: "Hệ thống tự tạo...",
    brand: "",
    origin: "",
    category: { name: "", code: "", parentName: "", parentCode: "" },
    specifications: {
      material: "",
      weight: "",
      firmness: "",
      design: "",
      certificationNumber: "",
    },
    variants: [],
    status: "AVAILABLE",
    tags: "",
    description: "",
    imageObjects: [],
  };
  const PRODUCT_API_URL = "http://localhost:8082";
  const [formData, setFormData] = useState<ProductFormState>(initialFormState);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get(`${PRODUCT_API_URL}/api/categories/all`);
        setCategories(res.data);
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);
      }
    };
    if (isOpen) fetchCats();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProductFormState] as object),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addVariant = () => {
    const newV: ProductVariant = {
      variantId: crypto.randomUUID(),
      sku: "Hệ thống tự tạo...",
      size: "",
      thickness: "",
      price: 0,
      originalPrice: 0,
      stockQuantity: 0,
      status: "ACTIVE",
    };
    setFormData((prev) => ({ ...prev, variants: [...prev.variants, newV] }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: any,
  ) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImageObjects = Array.from(files).map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
    }));
    setFormData((prev) => ({
      ...prev,
      imageObjects: [...prev.imageObjects, ...newImageObjects],
    }));

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(formData.imageObjects[index].preview);
    const newImages = formData.imageObjects.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, imageObjects: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.imageObjects.length === 0) {
      toast.error("Hãy thêm ít nhất 1 hình ảnh!");
      return;
    }
    if (formData.variants.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 kích thước!");
      return;
    }

    const processedTags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const productInfo = {
      name: formData.name,
      brand: formData.brand,
      origin: formData.origin,
      category: formData.category,
      variants: formData.variants.map((v) => ({
        size: v.size,
        thickness: v.thickness,
        price: Number(v.price),
        originalPrice: Number(v.originalPrice),
        stockQuantity: Number(v.stockQuantity),
        status: "ACTIVE",
      })),
      specifications: formData.specifications,
      status: formData.status === "stopselling" ? "stopselling" : "AVAILABLE",
      tags: processedTags,
      description: formData.description,
    };

    const data = new FormData();
    data.append(
      "product",
      new Blob([JSON.stringify(productInfo)], { type: "application/json" }),
    );
    formData.imageObjects.forEach((imgObj) =>
      data.append("imageFiles", imgObj.file),
    );

    onAdd(data);
    toast.success("Đang thêm sản phẩm...");
    setFormData(initialFormState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border"
      >
        <div className="p-5 border-b flex justify-between items-center bg-emerald-600 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <PlusCircle size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-none">
                Thêm sản phẩm mới
              </h2>
              <p className="text-[11px] text-emerald-100 mt-1 uppercase tracking-widest font-medium italic">
                Artisano 
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

        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide bg-gray-50/20">
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ImageIcon size={16} /> Quản lý hình ảnh
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 italic">
                    Tải ảnh lên từ thiết bị
                  </label>
                  <label
                    htmlFor="file-upload-add"
                    className="flex flex-col items-center justify-center w-full py-6 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                  >
                    <UploadCloud
                      size={28}
                      className="text-gray-400 group-hover:text-emerald-500 mb-2"
                    />
                    <span className="text-[10px] font-black text-gray-500 group-hover:text-emerald-600 uppercase tracking-tighter">
                      Nhấn để chọn ảnh
                    </span>
                    <input
                      type="file"
                      id="file-upload-add"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-4 min-h-[100px] content-start">
                {formData.imageObjects.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 group animate-in zoom-in-75"
                  >
                    <img
                      src={img.preview}
                      className="w-full h-full object-cover rounded-xl border-2 border-white shadow-sm"
                      alt="Preview"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                    >
                      <X size={12} strokeWidth={3} />
                    </button>
                    {index === 0 && (
                      <div className="absolute -bottom-1 left-1 right-1 bg-emerald-500 text-white text-[7px] font-black text-center py-0.5 rounded shadow-sm uppercase tracking-tighter">
                        Ảnh chính
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
              <Fingerprint size={16} /> Định danh & Phân loại
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <InputGroup
                label="Tên sản phẩm "
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter flex items-center gap-1">
                  Mã dòng sản phẩm
                </label>
                <input
                  type="text"
                  value="Hệ thống tự tạo..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm font-medium h-[42px]"
                  disabled
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter flex items-center gap-1">
                  Danh mục (Cha)
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-white h-[42px] focus:border-emerald-500 outline-none transition-all"
                  value={formData.category.parentCode || ""}
                  onChange={(e) => {
                    const pCode = e.target.value;
                    const parentObj = categories.find(c => c.code === pCode && !c.parentCode);
                    setFormData({
                      ...formData,
                      category: { name: "", code: "", parentCode: pCode, parentName: parentObj ? parentObj.name : "" }
                    });
                  }}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.filter(c => !c.parentCode).map((cat) => (
                    <option key={cat.code} value={cat.code}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter flex items-center gap-1">
                  Loại sản phẩm (Con)
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-white h-[42px] focus:border-emerald-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
                  disabled={!formData.category.parentCode}
                  value={formData.category.code || ""}
                  onChange={(e) => {
                    const subCode = e.target.value;
                    const subObj = categories.find(c => c.code === subCode);
                    if (subObj) {
                      setFormData({
                        ...formData,
                        category: { ...formData.category, name: subObj.name, code: subObj.code }
                      });
                    }
                  }}
                >
                  <option value="">-- Chọn loại cụ thể --</option>
                  {categories
                    .filter(c => c.parentCode === formData.category.parentCode)
                    .map((sub) => (
                      <option key={sub.code} value={sub.code}>{sub.name}</option>
                    ))}
                </select>
              </div>

              <InputGroup
                label="Thương hiệu"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />

              <InputGroup
                label="Xuất xứ"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
              />

            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-emerald-50 pb-4">
              <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                <DollarSign size={16} /> Kích thước & Giá bán
              </h3>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1.5 py-1.5 px-4 bg-emerald-600 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95"
              >
                <PlusCircle size={14} /> Thêm Size nệm
              </button>
            </div>
            <div className="space-y-4">
              {formData.variants.map((v, index) => (
                <div
                  key={v.variantId}
                  className="p-4 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-2 md:grid-cols-6 gap-3 items-end animate-in slide-in-from-right-5 relative"
                >
                  <div className="md:col-span-1">
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
                      required
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
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">
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
                      className="w-full px-3 py-2 rounded-xl border-emerald-100 text-xs font-bold outline-none h-[34px]"
                      required
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
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none h-[34px]"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">
                      Mã SKU
                    </label>
                    <input
                      type="text"
                      value="Tự tạo..."
                      className="w-full px-3 py-2 rounded-xl border bg-gray-100 text-gray-400 text-[9px] italic outline-none h-[34px]"
                      disabled
                    />
                  </div>

                  <div className="flex flex-col gap-1 items-center pb-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase">
                      Kho
                    </label>
                    <div className="flex items-center gap-2">
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
                        className="w-16 px-2 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
              <Award size={16} /> Thông số chi tiết
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputGroup
                label="Chất liệu"
                name="specifications.material"
                value={formData.specifications.material}
                onChange={handleChange}
              />
              <InputGroup
                label="Độ cứng"
                name="specifications.firmness"
                value={formData.specifications.firmness}
                onChange={handleChange}
              />
              <InputGroup
                label="Thiết kế"
                name="specifications.design"
                value={formData.specifications.design}
                onChange={handleChange}
              />
              <InputGroup
                label="Trọng lượng"
                name="specifications.weight"
                value={formData.specifications.weight}
                onChange={handleChange}
              />
              <InputGroup
                label="Chứng nhận"
                name="specifications.certificationNumber"
                value={formData.specifications.certificationNumber}
                onChange={handleChange}
              />
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter">
                  Trạng thái bán
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium bg-white h-[42px]"
                >
                  <option value="AVAILABLE">Sẵn sàng bán</option>
                  <option value="stopselling">Ngừng bán</option>
                </select>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6">
            <div className="space-y-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <InputGroup
                label="Thẻ Tags (Dấu phẩy)"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="cao_cap, em_ai"
                icon={<Tag size={12} />}
              />
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600 font-bold text-lg italic">
                  !
                </div>
                <div className="text-[10px] text-emerald-800 uppercase italic font-black leading-tight">
                  Mã dòng sản phẩm và SKU sẽ được hệ thống tự động tạo dựa trên
                  danh mục và kích thước.
                </div>
              </div>
            </div>
            <div className="space-y-1.5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter flex items-center gap-2">
                <Tag size={14} /> Mô tả tóm tắt
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 outline-none text-sm"
              />
            </div>
          </section>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-800 font-mono uppercase tracking-tighter"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-10 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <PlusCircle size={18} /> XÁC NHẬN THÊM
          </button>
        </div>
      </form>
    </div>
  );
};

const InputGroup = ({ label, icon, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter flex items-center gap-1">
      {icon} {label}
    </label>
    <input
      {...props}
      autoComplete="off"
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium bg-white h-[42px]"
    />
  </div>
);

export default ProductAddModal;