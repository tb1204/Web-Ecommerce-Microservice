import React, { useState, useEffect } from "react";
import {
<<<<<<< HEAD
  X,
  Save,
  Fingerprint,
  Award,
  History,
  Image as ImageIcon,
  PlusCircle,
  RefreshCw,
  Trash2,
  Box,
  MapPin,
  Tag,
} from "lucide-react";

import { toast } from "sonner";
import type { Product, ProductVariant } from "../Products/InterfaceItem";
=======
 X,
 Save,
 Fingerprint,
 Award,
 History,
 Image as ImageIcon,
 PlusCircle,
 RefreshCw,
 Trash2,
 Box,
 MapPin,
 Tag

} from "lucide-react";

import { toast } from "sonner";
import type {
 Product,

 ProductVariant,
} from "../Products/InterfaceItem";
>>>>>>> 74a4862881035814147d4c42b376ca3aaeb01812

import axios from "axios";

interface ProductEditModalProps {
<<<<<<< HEAD
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
=======
 isOpen: boolean;
 onClose: () => void;
 product: Product | null;
 onSave: (updatedProduct: Product) => void;
>>>>>>> 74a4862881035814147d4c42b376ca3aaeb01812
}


interface ProductFormState extends Omit<Product, "images" | "tags" | "category"> {
 tags: string;
 images: string[];
 url: string;
 category: { 
  name: string; 
  code: string; 
  parentCode: string; 
  parentName: string 
 };
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
 isOpen,
 onClose,
 product,
 onSave,
}) => {
<<<<<<< HEAD
  const [formData, setFormData] = useState<ProductFormState | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const PRODUCT_API_URL = "http://localhost:8082";
  // State lưu File ảnh đại diện mới
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  // State lưu danh sách các File ảnh phụ mới (chỉ chứa những ảnh mới thêm vào)
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

  // Lấy danh mục từ DB
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get(`${PRODUCT_API_URL}/api/categories/all`);
        setCategories(res.data);
      } catch (err) {
        console.error("Không lấy được danh mục:", err);
      }
=======
 const [formData, setFormData] = useState<ProductFormState | null>(null);
 const [categories, setCategories] = useState<any[]>([]);
 const PRODUCT_API_URL = "http://localhost:8082";
 // State lưu File ảnh đại diện mới
const [primaryFile, setPrimaryFile] = useState<File | null>(null);
// State lưu danh sách các File ảnh phụ mới (chỉ chứa những ảnh mới thêm vào)
const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);

 // Lấy danh mục từ DB
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

 // Khởi tạo dữ liệu khi mở Modal
 useEffect(() => {
  if (product && isOpen) {
   const primaryImg = product.images?.find((img) => img.isPrimary === true)?.url || "";
   const subImages = product.images?.filter((img) => img.isPrimary !== true)?.map((img) => img.url) || [];

   setFormData({
    ...product,
    category: {
     name: product.category?.name || "",
     code: product.category?.code || "",
     parentCode: product.category?.parentCode || "",
     parentName: product.category?.parentName || ""
    },
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
    // variants: product.variants || [],
    variants: product.variants?.map((v) => ({
          ...v,
          color: v.color || "" 
        })) || [],
   });
  }
 }, [product, isOpen]);

 if (!isOpen || !formData) return null;

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
>>>>>>> 74a4862881035814147d4c42b376ca3aaeb01812
    };
   }
   return { ...prev, [name]: value };
  });
 };

<<<<<<< HEAD
  // Khởi tạo dữ liệu khi mở Modal
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
        category: {
          name: product.category?.name || "",
          code: product.category?.code || "",
          parentCode: product.category?.parentCode || "",
          parentName: product.category?.parentName || "",
        },
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
        // variants: product.variants || [],
        variants:
          product.variants?.map((v) => ({
            ...v,
            color: v.color || "",
          })) || [],
      });
    }
  }, [product, isOpen]);

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
=======
 // --- LOGIC BIẾN THỂ ---
 const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
  if (!formData) return;
  const newVariants = [...(formData.variants || [])];
  newVariants[index] = { ...newVariants[index], [field]: value };
  setFormData({ ...formData, variants: newVariants });
 };

 const addVariant = () => {
  if (!formData) return;
  const newV: ProductVariant = {
   variantId: crypto.randomUUID(),
   sku: "Tự tạo...",
   size: "",
   thickness: "",
   color: "",
   price: 0,
   originalPrice: 0,
   stockQuantity: 0,
   status: "ACTIVE",
>>>>>>> 74a4862881035814147d4c42b376ca3aaeb01812
  };
  setFormData({ ...formData, variants: [...(formData.variants || []), newV] });
 };

 const removeVariant = (index: number) => {
  if (!formData) return;
  const newVariants = formData.variants?.filter((_, i) => i !== index);
  setFormData({ ...formData, variants: newVariants });
 };

<<<<<<< HEAD
  const addVariant = () => {
    if (!formData) return;
    const newV: ProductVariant = {
      variantId: crypto.randomUUID(),
      sku: "Tự tạo...",
      size: "",
      thickness: "",
      color: "",
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

    setPrimaryFile(file);
    setFormData((prev) =>
      prev ? { ...prev, url: URL.createObjectURL(file) } : null,
    );
    e.target.value = "";
  };

  // Khi thêm ảnh phụ
  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setNewGalleryFiles((prev) => [...prev, ...fileArray]);

    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setFormData((prev) =>
      prev ? { ...prev, images: [...prev.images, ...newPreviews] } : null,
    );
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

    const toastId = toast.loading("Đang chuẩn bị dữ liệu...");
    try {
      //  toast.loading("Đang chuẩn bị dữ liệu...");
      const data = new FormData();
      const remainingOldImages = formData.images
        .filter((img) => !img.startsWith("blob:"))
        .map((url) => ({ url, isPrimary: false }));
      if (!formData.url.startsWith("blob:")) {
        remainingOldImages.unshift({ url: formData.url, isPrimary: true });
      }

      const productInfo = {
        ...formData,
        id: product?.id,
        images: remainingOldImages,
        variants:
          formData.variants?.map((v) => ({
            ...v,
            price: Number(v.price),
            originalPrice: Number(v.originalPrice),
            stockQuantity: Number(v.stockQuantity),
            color: v.color?.trim() || "",
          })) || [],
        colors: Array.from(
          new Set(
            formData.variants?.map((v) => v.color?.trim()).filter(Boolean),
          ),
        ),
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        price:
          formData.variants?.reduce(
            (min, v) => Math.min(min, v.price),
            Infinity,
          ) || 0,
        totalStockQuantity:
          formData.variants?.reduce(
            (sum, v) => sum + Number(v.stockQuantity),
            0,
          ) || 0,
      };

      data.append(
        "product",
        new Blob([JSON.stringify(productInfo)], { type: "application/json" }),
      );

      if (formData.url.startsWith("blob:")) {
        const res = await fetch(formData.url);
        const blob = await res.blob();
        data.append(
          "imageFiles",
          new File([blob], "primary_image.png", { type: blob.type }),
        );
      }

      const newSubImages = formData.images.filter((img) =>
        img.startsWith("blob:"),
      );
      for (const [index, url] of newSubImages.entries()) {
        const res = await fetch(url);
        const blob = await res.blob();
        data.append(
          "imageFiles",
          new File([blob], `sub_image_${index}.png`, { type: blob.type }),
        );
      }

      toast.dismiss(toastId);
      onSave(data);
      onClose();
    } catch (error) {
      toast.dismiss();
      console.error("Lỗi:", error);
      toast.error("Gặp sự cố khi sắp xếp hình ảnh!");
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border"
      >
        {/* Header */}
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
          {/* QUẢN LÝ HÌNH ẢNH */}
          <section className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={18} /> Quản lý hình ảnh
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[11px] font-bold text-emerald-600 uppercase tracking-wider italic">
                  <span>Ảnh đại diện (*)</span>

                  <label
                    htmlFor="edit-main-image"
                    className="flex items-center gap-1 hover:underline cursor-pointer bg-emerald-50 px-2 py-1 rounded-lg"
                  >
                    <RefreshCw size={12} /> Thay đổi ảnh
                  </label>
                  <input
                    type="file"
                    id="edit-main-image"
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
                    htmlFor="edit-gallery-images"
                    className="flex items-center gap-1.5 py-1.5 px-4 bg-emerald-600 text-white rounded-full text-[11px] font-bold hover:bg-emerald-700 cursor-pointer shadow-md active:scale-95 transition-all"
                  >
                    <PlusCircle size={14} /> Thêm ảnh phụ
                  </label>
                  <input
                    type="file"
                    id="edit-gallery-images"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleGalleryFileChange}
                  />
                </div>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar content-start bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
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
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-10"
                      >
                        <X size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                  {formData.images.length === 0 && (
                    <div className="col-span-full py-10 flex flex-col items-center justify-center text-gray-300">
                      <ImageIcon size={32} className="mb-2 opacity-20" />
                      <span className="text-[10px] font-black uppercase">
                        Trống
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ĐỊNH DANH & PHÂN LOẠI */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
              <Fingerprint size={16} /> Định danh & Phân loại
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <InputGroup
                label="Tên sản phẩm"
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
                  value={formData.productCode || "Hệ thống tự tạo..."}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm h-[42px]"
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
                    const parentObj = categories.find(
                      (c) => c.code === pCode && !c.parentCode,
                    );
                    setFormData({
                      ...formData,
                      category: {
                        name: "",
                        code: "",
                        parentCode: pCode,
                        parentName: parentObj ? parentObj.name : "",
                      },
                    });
                  }}
                >
                  <option value="">-- Chọn ngành hàng --</option>
                  {categories
                    .filter((c) => !c.parentCode)
                    .map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.name}
                      </option>
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
                    const subObj = categories.find((c) => c.code === subCode);
                    if (subObj) {
                      setFormData({
                        ...formData,
                        category: {
                          ...formData.category,
                          name: subObj.name,
                          code: subObj.code,
                        },
                      });
                    }
                  }}
                >
                  <option value="">-- Chọn loại cụ thể --</option>
                  {categories
                    .filter(
                      (c) => c.parentCode === formData.category.parentCode,
                    )
                    .map((sub) => (
                      <option key={sub.code} value={sub.code}>
                        {sub.name}
                      </option>
                    ))}
                </select>
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
            </div>
          </section>

          {/* SECTION BIẾN THỂ */}
          <section className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-emerald-50 pb-4">
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
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-1">
                      Màu sắc
                    </label>
                    <input
                      type="text"
                      value={v.color || ""}
                      onChange={(e) =>
                        handleVariantChange(index, "color", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500"
                      placeholder="White, Blue..."
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
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500"
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
                    <label className="text-[9px] font-black text-blue-400 uppercase ml-1 italic tracking-tighter">
                      Mã SKU
                    </label>
                    <input
                      type="text"
                      value="Tự tạo..."
                      className="w-full px-3 py-2 rounded-xl border bg-gray-100 text-gray-400 text-[9px] h-[34px]"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
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

          {/* THÔNG SỐ KỸ THUẬT */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
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
                  <option value="OUT_OF_STOCK">Hết hàng</option>
                </select>
              </div>
            </div>
          </section>

          {/* MÔ TẢ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
            <div className="space-y-1.5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter">
                Mô tả sản phẩm
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={4}
                className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-emerald-500 outline-none text-sm leading-relaxed"
              />
            </div>
            <div className="space-y-3">
              {/* <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter">Trạng thái bán</label>
       <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium bg-white cursor-pointer shadow-sm">
        <option value="AVAILABLE">Đang bán</option>
        <option value="OUT_OF_STOCK">Hết hàng</option>
        <option value="stopselling">Ngừng kinh doanh</option>
       </select> */}
              <InputGroup
                label="Thẻ Tags "
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="cao_cap, em_ai, khuyen_mai..."
                icon={<Tag size={12} />}
              />
              <div className="p-5 mt-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600">
                  <History size={24} />
                </div>
                <div className="text-[10px] text-emerald-800 uppercase italic font-black leading-tight">
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
            className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-800 font-mono uppercase tracking-widest"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-10 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save size={18} /> Lưu thay đổi
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
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium bg-white h-[42px]"
    />
=======
const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;

 setPrimaryFile(file); 
 setFormData(prev => prev ? { ...prev, url: URL.createObjectURL(file) } : null); 
 e.target.value = ""; 
};

// Khi thêm ảnh phụ
const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const files = e.target.files;
 if (!files) return;

 const fileArray = Array.from(files);
 setNewGalleryFiles(prev => [...prev, ...fileArray]); 

 const newPreviews = fileArray.map(file => URL.createObjectURL(file));
 setFormData(prev => prev ? { ...prev, images: [...prev.images, ...newPreviews] } : null);
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

  const toastId = toast.loading("Đang chuẩn bị dữ liệu...");
  try {
  //  toast.loading("Đang chuẩn bị dữ liệu...");
   const data = new FormData();
   const remainingOldImages = formData.images
    .filter((img) => !img.startsWith("blob:"))
    .map((url) => ({ url, isPrimary: false }));
   if (!formData.url.startsWith("blob:")) {
    remainingOldImages.unshift({ url: formData.url, isPrimary: true });
   }

   const productInfo = {
    ...formData,
    id: product?.id,
    images: remainingOldImages, 
    variants: formData.variants?.map((v) => ({
        ...v,
        price: Number(v.price),
        originalPrice: Number(v.originalPrice),
        stockQuantity: Number(v.stockQuantity),
        color: v.color?.trim() || "", 
      })) || [],
    colors: Array.from(
        new Set(formData.variants?.map((v) => v.color?.trim()).filter(Boolean))
      ),
    tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
    price: formData.variants?.reduce((min, v) => Math.min(min, v.price), Infinity) || 0,
    totalStockQuantity: formData.variants?.reduce((sum, v) => sum + Number(v.stockQuantity), 0) || 0,
   };

   data.append("product", new Blob([JSON.stringify(productInfo)], { type: "application/json" }));

   if (formData.url.startsWith("blob:")) {
    const res = await fetch(formData.url);
    const blob = await res.blob();
    data.append("imageFiles", new File([blob], "primary_image.png", { type: blob.type }));
   }

   const newSubImages = formData.images.filter((img) => img.startsWith("blob:"));
   for (const [index, url] of newSubImages.entries()) {
    const res = await fetch(url);
    const blob = await res.blob();
    data.append("imageFiles", new File([blob], `sub_image_${index}.png`, { type: blob.type }));
   }

   toast.dismiss(toastId);
   onSave(data); 
   onClose();
  } catch (error) {
   toast.dismiss();
   console.error("Lỗi:", error);
   toast.error("Gặp sự cố khi sắp xếp hình ảnh!");
  }
 };

 return (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
   <form
    onSubmit={handleSubmit}
    autoComplete="off"
    className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border"
   >
    {/* Header */}
    <div className="p-5 border-b flex justify-between items-center bg-emerald-600 text-white shrink-0">
     <div className="flex items-center gap-3">
      <div className="p-2 bg-white/20 rounded-lg">
       <Save size={20} />
      </div>
      <div>
       <h2 className="font-bold text-lg leading-none">Chỉnh sửa sản phẩm</h2>
       <p className="text-[11px] text-emerald-100 mt-1 uppercase tracking-widest font-mono italic font-bold">
        Mã dòng sản phẩm: {formData.productCode}
       </p>
      </div>
     </div>
     <button type="button" onClick={onClose} className="p-2 hover:bg-emerald-700 rounded-full transition-all">
      <X size={24} />
     </button>
    </div>

    <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide bg-gray-50/30">
     {/* QUẢN LÝ HÌNH ẢNH */}
     <section className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
      <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
       <ImageIcon size={18} /> Quản lý hình ảnh
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <div className="space-y-4">
        <div className="flex justify-between items-center text-[11px] font-bold text-emerald-600 uppercase tracking-wider italic">
         <span>Ảnh đại diện (*)</span>
     
         <label htmlFor="edit-main-image" className="flex items-center gap-1 hover:underline cursor-pointer bg-emerald-50 px-2 py-1 rounded-lg">
          <RefreshCw size={12} /> Thay đổi ảnh
         </label>
         <input type="file" id="edit-main-image" accept="image/*" className="hidden" onChange={handleMainFileChange} />
        </div>
        <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border-2 border-emerald-500/20 flex items-center justify-center shadow-inner">
         {formData.url ? (
          <img src={formData.url} alt="Main" className="w-full h-full object-contain p-2 animate-in fade-in duration-500" />
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
        
         <label htmlFor="edit-gallery-images" className="flex items-center gap-1.5 py-1.5 px-4 bg-emerald-600 text-white rounded-full text-[11px] font-bold hover:bg-emerald-700 cursor-pointer shadow-md active:scale-95 transition-all">
          <PlusCircle size={14} /> Thêm ảnh phụ
         </label>
         <input type="file" id="edit-gallery-images" multiple accept="image/*" className="hidden" onChange={handleGalleryFileChange} />
        </div>
        <div className="grid grid-cols-4 md:grid-cols-5 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar content-start bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
         {formData.images.map((img, index) => (
          <div key={index} className="relative aspect-square bg-white p-2 rounded-2xl border border-gray-100 shadow-sm group animate-in zoom-in-95">
           <img src={img} className="w-full h-full object-cover rounded-xl" alt="" />
           <button 
            type="button" 
            onClick={() => removeGalleryImage(index)} 
            className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-10"
           >
            <X size={12} strokeWidth={3} />
           </button>
          </div>
         ))}
         {formData.images.length === 0 && (
          <div className="col-span-full py-10 flex flex-col items-center justify-center text-gray-300">
           <ImageIcon size={32} className="mb-2 opacity-20" />
           <span className="text-[10px] font-black uppercase">Trống</span>
          </div>
         )}
        </div>
       </div>
      </div>
     </section>

     {/* ĐỊNH DANH & PHÂN LOẠI */}
     <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
      <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
       <Fingerprint size={16} /> Định danh & Phân loại
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
       <InputGroup label="Tên sản phẩm" name="name" value={formData.name} onChange={handleChange} required />

       <div className="space-y-1.5">
        <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter flex items-center gap-1">
         Mã dòng sản phẩm
        </label>
        <input
         type="text"
         value={formData.productCode || "Hệ thống tự tạo..."}
         className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm h-[42px]"
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
         <option value="">-- Chọn ngành hàng --</option>
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

       <InputGroup label="Thương hiệu" name="brand" value={formData.brand || ""} onChange={handleChange} />
       <InputGroup label="Xuất xứ" name="origin" value={formData.origin || ""} onChange={handleChange} icon={<MapPin size={12} />} />
       
      </div>
     </section>

     {/* SECTION BIẾN THỂ */}
     <section className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-emerald-50 pb-4">
       <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
        <Box size={18} /> Danh sách kích thước & Giá
       </h3>
       <button type="button" onClick={addVariant} className="flex items-center gap-1.5 py-1.5 px-4 bg-emerald-600 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-md">
        <PlusCircle size={14} /> Thêm size mới
       </button>
      </div>
      <div className="space-y-4">
       {formData.variants?.map((v, index) => (
        <div key={v.variantId} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-2 md:grid-cols-6 gap-4 items-end animate-in slide-in-from-right-5 relative group">
         <div>
          <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Kích thước</label>
          <input type="text" value={v.size} onChange={(e) => handleVariantChange(index, "size", e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500" placeholder="160x200" />
         </div>
         <div>
          <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Độ dày</label>
          <input type="text" value={v.thickness} onChange={(e) => handleVariantChange(index, "thickness", e.target.value)} className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500" placeholder="10cm" />
         </div>
         <div>
          <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Màu sắc</label>
          <input 
            type="text" 
            value={v.color || ""} 
            onChange={(e) => handleVariantChange(index, "color", e.target.value)} 
            className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500" 
            placeholder="White, Blue..." 
          />
         </div>
         <div>
          <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Giá bán (₫)</label>
          <input type="number" value={v.price} onChange={(e) => handleVariantChange(index, "price", Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500" />
         </div>
         <div>
          <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Giá gốc (₫)</label>
          <input type="number" value={v.originalPrice} onChange={(e) => handleVariantChange(index, "originalPrice", Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500" />
         </div>
         <div>
          <label className="text-[9px] font-black text-blue-400 uppercase ml-1 italic tracking-tighter">Mã SKU</label>
          <input type="text" value="Tự tạo..." className="w-full px-3 py-2 rounded-xl border bg-gray-100 text-gray-400 text-[9px] h-[34px]" disabled />
         </div>
         <div className="flex items-center gap-2">
          <div className="flex-1">
           <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Kho</label>
           <input type="number" value={v.stockQuantity} onChange={(e) => handleVariantChange(index, "stockQuantity", Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border text-xs outline-none focus:border-emerald-500" />
          </div>
          <button type="button" onClick={() => removeVariant(index)} className="p-2 text-red-400 hover:text-red-600 transition-colors">
           <Trash2 size={18} />
          </button>
         </div>
        </div>
       ))}
      </div>
     </section>

     {/* THÔNG SỐ KỸ THUẬT */}
     <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
      <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
       <Award size={16} className="text-emerald-500" /> Thông số kỹ thuật
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
       <InputGroup label="Chất liệu" name="specifications.material" value={formData.specifications?.material || ""} onChange={handleChange} />
       <InputGroup label="Độ cứng" name="specifications.firmness" value={formData.specifications?.firmness || ""} onChange={handleChange} />
       <InputGroup label="Thiết kế" name="specifications.design" value={formData.specifications?.design || ""} onChange={handleChange} />
       <InputGroup label="Trọng lượng" name="specifications.weight" value={formData.specifications?.weight || ""} onChange={handleChange} />
       <InputGroup label="Số chứng nhận" name="specifications.certificationNumber" value={formData.specifications?.certificationNumber || ""} onChange={handleChange} />
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
                  <option value="OUT_OF_STOCK">Hết hàng</option>
                </select>
              </div>
      </div>
     </section>

     {/* MÔ TẢ */}
     <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
      <div className="space-y-1.5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
       <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter">Mô tả sản phẩm</label>
       <textarea name="description" value={formData.description || ""} onChange={handleChange} rows={4} className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:border-emerald-500 outline-none text-sm leading-relaxed" />
      </div>
      <div className="space-y-3">
       {/* <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter">Trạng thái bán</label>
       <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium bg-white cursor-pointer shadow-sm">
        <option value="AVAILABLE">Đang bán</option>
        <option value="OUT_OF_STOCK">Hết hàng</option>
        <option value="stopselling">Ngừng kinh doanh</option>
       </select> */}
       <InputGroup 
          label="Thẻ Tags " 
          name="tags" 
          value={formData.tags} 
          onChange={handleChange} 
          placeholder="cao_cap, em_ai, khuyen_mai..." 
          icon={<Tag size={12} />} 
        />
       <div className="p-5 mt-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
        <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600"><History size={24} /></div>
        <div className="text-[10px] text-emerald-800 uppercase italic font-black leading-tight">
         Giá hiển thị đại diện và Tổng kho sẽ tự động tính từ danh sách biến thể.
        </div>
       </div>
      </div>
     </section>
    </div>

    {/* Footer */}
    <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
     <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-800 font-mono uppercase tracking-widest">Hủy bỏ</button>
     <button type="submit" className="px-10 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2">
      <Save size={18} /> Lưu thay đổi
     </button>
    </div>
   </form>
>>>>>>> 74a4862881035814147d4c42b376ca3aaeb01812
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
   className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium bg-white h-[42px]"
  />
 </div>
);

export default ProductEditModal;