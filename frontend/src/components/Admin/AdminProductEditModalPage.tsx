import React, { useState, useEffect } from "react";
import { X, Save, Info, Fingerprint, DollarSign, Award, History, Image as ImageIcon, PlusCircle, RefreshCw, Tag, MapPin, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductImage } from "../Products/InterfaceItem";

import axios from "axios";

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
  // onSave: (id: string, data: FormData) => void;
}

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

interface ProductFormState extends Omit<Product, 'images' | 'tags'> {
  tags: string;
  images: string[];
  url: string; 
}

const generateCategoryCode = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toUpperCase()
    .trim()
    .replace(/\s+/g, "-")           // Khoảng trắng thành gạch ngang
    .replace(/[^\w-]/g, "");        // Xóa ký tự đặc biệt
};

const ProductEditModal: React.FC<ProductEditModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState<ProductFormState | null>(null);

  const [categories, setCategories] = useState<{name: string, code: string}[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);

  useEffect(() => {
  const fetchCats = async () => {
    try {
      const res = await axios.get("http://localhost:9001/api/categories/all");
      setCategories(res.data);
    } catch (err) {
      console.error("Không lấy được danh mục:", err);
    }
  };
  if (isOpen) fetchCats();
}, [isOpen]);

  useEffect(() => {
    if (product && isOpen ) {
      const primaryImg = product.images?.find((img) => img.isPrimary === true)?.url || "";
      const subImages = product.images
        ?.filter((img) => img.isPrimary !== true)
        ?.map((img) => img.url) || [];

      setFormData({
        ...product,
        category: product.category || { name: "", code: "" },
        specifications: product.specifications || { 
          material: "", weight: "", dimensions: "", 
          firmness: "", design: "", certificationNumber: "" 
        },
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
        images: subImages,
        url: primaryImg
      });
    }
  }, [product, isOpen, formData?.id]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      if (!prev) return null;

      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        const parentKey = parent as keyof ProductFormState;
        return {
          ...prev,
          [parentKey]: {
            ...(prev[parentKey] as object),
            [child]: value
          }
        };
      }
      return { ...prev, [name]: value };
    });
  };

  // --- HÀM XỬ LÝ CHỌN ẢNH CHÍNH TỪ MÁY TÍNH ---
  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => prev ? { ...prev, url: reader.result as string } : null);
    };
    reader.readAsDataURL(file);
  };

  // --- HÀM XỬ LÝ CHỌN ẢNH PHỤ TỪ MÁY TÍNH ---
  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => 
          prev ? { ...prev, images: [...prev.images, reader.result as string] } : null
        );
      };
      reader.readAsDataURL(file);
    });
    e.target.value = ""; // Reset để chọn lại cùng file nếu cần
  };

  const removeGalleryImage = (index: number) => {
    if (!formData) return;
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    if (isNewCategory && formData.category.name) {
    try {
      await axios.post("http://localhost:9001/api/categories/add", {
        name: formData.category.name,
        code: formData.category.code
      });
      
    } catch (err) {
      console.error("Lỗi lưu danh mục mới:", err);
    }
  }

    const updatedImages: ProductImage[] = [
      { url: formData.url, isPrimary: true },
      ...formData.images.map((url) => ({ url, isPrimary: false }))
    ];

    const finalTags = formData.tags.split(",").map(t => t.trim()).filter(Boolean);

    const finalData: Product = {
      ...formData,
      id: product?.id,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stockQuantity: Number(formData.stockQuantity),
      tags: finalTags,
      images: updatedImages,
      updatedAt: new Date().toISOString()
    } as Product;

    onSave(finalData);
    // onSave(product._id, formData);
    toast.success("Đã cập nhật thông tin sản phẩm!");

    const newCat = { name: formData.category.name, code: formData.category.code };
    setCategories(prev => [...prev, newCat]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <form onSubmit={handleSubmit} autoComplete="off" className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border">
        
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-emerald-600 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><Save size={20} /></div>
            <div>
              <h2 className="font-bold text-lg leading-none">Chỉnh sửa sản phẩm</h2>
              <p className="text-[11px] text-emerald-100 mt-1 uppercase tracking-widest font-mono italic font-bold">SKU: {formData.sku}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-emerald-700 rounded-full transition-all"><X size={24} /></button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide bg-gray-50/30">
          
          {/* QUẢN LÝ HÌNH ẢNH - ĐÃ CẬP NHẬT CHỌN FILE */}
          <section className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={18} /> Quản lý hình ảnh
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Ảnh chính */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[11px] font-bold text-emerald-600 uppercase tracking-wider italic">
                  <span>Ảnh đại diện (*)</span>
                  <label htmlFor="main-image-edit" className="flex items-center gap-1 hover:underline cursor-pointer">
                    <RefreshCw size={12}/> Thay đổi ảnh
                  </label>
                  <input type="file" id="main-image-edit" accept="image/*" className="hidden" onChange={handleMainFileChange} />
                </div>
                <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border-2 border-emerald-500/20 flex items-center justify-center shadow-inner">
                  {formData.url ? (
                    <img src={formData.url} alt="Main" className="w-full h-full object-contain p-2 animate-in fade-in duration-500" />
                  ) : (
                    <ImageIcon size={48} className="opacity-20" />
                  )}
                </div>
              </div>

              {/* Ảnh Gallery */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider italic">Ảnh phụ bổ trợ ({formData.images.length})</label>
                  <label htmlFor="gallery-images-edit" className="flex items-center gap-1.5 py-1.5 px-4 bg-emerald-600 text-white rounded-full text-[11px] font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95 cursor-pointer">
                    <PlusCircle size={14} /> Thêm ảnh phụ
                  </label>
                  <input type="file" id="gallery-images-edit" multiple accept="image/*" className="hidden" onChange={handleGalleryFileChange} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar content-start">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative aspect-square bg-white p-2 rounded-2xl border border-gray-100 shadow-sm group animate-in zoom-in-95">
                      <img src={img} className="w-full h-full object-cover rounded-xl" alt="" />
                      <button 
                        type="button" 
                        onClick={() => removeGalleryImage(index)} 
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {formData.images.length === 0 && (
                    <div className="col-span-full py-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl text-gray-300">
                       <UploadCloud size={32} className="mb-2 opacity-20" />
                       <p className="text-[10px] font-bold uppercase tracking-tighter">Chưa có ảnh phụ</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* THÔNG TIN CƠ BẢN */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2 font-black"><Info size={16} className="text-emerald-500" /> Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <InputGroup label="Tên sản phẩm" name="name" value={formData.name} onChange={handleChange} required />
              <InputGroup label="Mã SKU" name="sku" value={formData.sku || ""} onChange={handleChange} required />
              <div className="space-y-1.5 font-mono">
                <label className="text-xs text-gray-500 ml-1 italic font-black flex items-center gap-1"><Fingerprint size={12}/> Mã nội bộ</label>
                <input type="text" value={formData.productCode || ""} className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm" disabled />
              </div>
              <InputGroup label="Thương hiệu" name="brand" value={formData.brand || ""} onChange={handleChange} />
              <InputGroup label="Xuất xứ" name="origin" value={formData.origin || ""} onChange={handleChange} icon={<MapPin size={12}/>} />
              <InputGroup label="Tags" name="tags" value={formData.tags} onChange={handleChange} icon={<Tag size={12}/>} placeholder="cao_cap, khang_khuan..." />
              {/* <InputGroup label="Danh mục (Tên)" name="category.name" value={formData.category?.name || ""} onChange={handleChange} />
              <InputGroup label="Danh mục (Code)" name="category.code" value={formData.category?.code || ""} onChange={handleChange} /> */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> */}
              <>
  {/* Cột Tên Danh Mục */}
  <div className="space-y-1.5">
    <label className="text-xs text-gray-500 font-black uppercase italic">Danh mục (Tên)</label>
    {!isNewCategory ? (
      <select 
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium bg-white h-[42px] focus:border-emerald-500 outline-none"
        value={formData.category?.name || ""}
        onChange={(e) => {
          const val = e.target.value;
          if (val === "ADD_NEW") {
            setIsNewCategory(true);
            setFormData(prev => prev ? { ...prev, category: { name: "", code: "" } } : null);
          } else {
            const selected = categories.find(c => c.name === val);
            setFormData(prev => prev ? { ...prev, category: selected || { name: val, code: "" } } : null);
          }
        }}
      >
        {/* <option value="">-- Chọn danh mục --</option> */}
        {categories.map(cat => (
          <option key={cat.code} value={cat.name}>{cat.name}</option>
        ))}
        <option value="ADD_NEW" className="text-emerald-600 font-bold">+ THÊM DANH MỤC MỚI</option>
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
            setFormData(prev => prev ? { 
              ...prev, 
              category: { name: newName, code: generateCategoryCode(newName) } 
            } : null);
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

  {/* Cột Code (Tự động nhảy theo Name) */}
  <div className="space-y-1.5">
    <label className="text-xs text-gray-500 font-black uppercase italic">Danh mục (Code)</label>
    <input 
      type="text"
      className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-100 text-gray-500 text-sm font-medium "
      value={formData.category?.code || ""}
      readOnly // Khóa lại không cho sửa tay để đảm bảo chuẩn dữ liệu
      placeholder="Mã tự động"
    />
  </div></>
{/* </div> */}
            </div>
          </section>

          {/* TÀI CHÍNH & KHO */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 "><DollarSign size={16} className="text-emerald-500" /> Tài chính & Kho hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <InputGroup label="Giá bán hiện tại (₫)" name="price" type="number" value={formData.price} onChange={handleChange} required />
              <InputGroup label="Giá gốc (₫)" name="originalPrice" type="number" value={formData.originalPrice || ""} onChange={handleChange} />
              <InputGroup label="Số lượng tồn kho" name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleChange} required />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 ml-1 italic ">Trạng thái bán</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium bg-white cursor-pointer h-[42px]">
                  <option value="selling">Đang bán</option>
                  <option value="stopselling">Ngừng bán</option>
                </select>
              </div>
            </div>
          </section>

          {/* THÔNG SỐ KỸ THUẬT */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-sm  text-gray-400 uppercase tracking-widest flex items-center gap-2 font-black"><Award size={16} className="text-emerald-500" /> Thông số kỹ thuật</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <InputGroup label="Chất liệu" name="specifications.material" value={formData.specifications?.material || ""} onChange={handleChange} />
              <InputGroup label="Độ cứng" name="specifications.firmness" value={formData.specifications?.firmness || ""} onChange={handleChange} />
              <InputGroup label="Kích thước" name="specifications.dimensions" value={formData.specifications?.dimensions || ""} onChange={handleChange} />
              <InputGroup label="Trọng lượng" name="specifications.weight" value={formData.specifications?.weight || ""} onChange={handleChange} />
              <InputGroup label="Thiết kế" name="specifications.design" value={formData.specifications?.design || ""} onChange={handleChange} />
              <InputGroup label="Số chứng nhận" name="specifications.certificationNumber" value={formData.specifications?.certificationNumber || ""} onChange={handleChange} />
            </div>
          </section>

          {/* MÔ TẢ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
            <div className="space-y-1.5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <label className="text-sm  text-gray-400 uppercase tracking-widest mb-3 block ml-1 font-bold">Mô tả sản phẩm</label>
              <textarea name="description" value={formData.description || ""} onChange={handleChange} rows={4} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 outline-none text-sm leading-relaxed" />
            </div>
            <div className="space-y-3">
                <label className="text-sm  text-gray-400 uppercase tracking-widest mb-3 block ml-1 text-right font-bold">Hệ thống</label>
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4 shadow-sm">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600"><History size={24}/></div>
                  <div className="text-[11px]  text-emerald-800 uppercase italic font-black">Thời gian cập nhật sẽ được ghi nhận khi bạn nhấn Lưu.</div>
                </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 transition-all font-mono uppercase tracking-widest underline underline-offset-4">Hủy bỏ</button>
          <button type="submit" className="px-10 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2">
            <Save size={18} /> Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

const InputGroup = ({ label, icon, ...props }: InputGroupProps) => (
  <div className="space-y-1.5">
    <label className="text-xs  text-gray-500 ml-1 italic font-black flex items-center gap-1 uppercase tracking-tighter">
      {icon} {label}
    </label>
    <input 
      {...props} 
      autoComplete="off" 
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium h-[42px]" 
    />
  </div>
);

export default ProductEditModal;