import React, { useState, useEffect } from "react";
import { X, Save, Info, Fingerprint, DollarSign, Award, History, Image as ImageIcon, PlusCircle, RefreshCw, Tag, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductImage } from "../Products/InterfaceItem";

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
}

// Định nghĩa Interface cho InputGroup 
interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

// Định nghĩa kiểu dữ liệu riêng cho FormState 
interface ProductFormState extends Omit<Product, 'images' | 'tags'> {
  tags: string;
  images: string[];
  image_url: string; // Trường bổ sung để quản lý ảnh chính trong form
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState<ProductFormState | null>(null);
  const [isEditingMainImage, setIsEditingMainImage] = useState(false);
  const [editingGalleryIndex, setEditingGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    // 
    if (product && isOpen && formData?._id !== product._id) {
      const primaryImg = product.images?.find((img) => img.is_primary === true)?.url || "";
      const subImages = product.images
        ?.filter((img) => img.is_primary !== true)
        ?.map((img) => img.url) || [];

      setFormData({
        ...product,
        category: product.category || { name: "", code: "" },
        specifications: product.specifications || { 
          material: "", weight: "", dimensions: "", 
          firmness: "", design: "", certification_number: "" 
        },
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
        images: subImages,
        image_url: primaryImg
      });

      setIsEditingMainImage(false);
      setEditingGalleryIndex(null);
    }
  }, [product, isOpen, formData?._id]);

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

  const handleGalleryChange = (index: number, value: string) => {
    if (!formData) return;
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addGalleryImage = () => {
    if (!formData) return;
    setFormData({ ...formData, images: [...formData.images, ""] });
    setEditingGalleryIndex(formData.images.length);
  };

  const removeGalleryImage = (index: number) => {
    if (!formData) return;
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setEditingGalleryIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    // Chuyển đổi ngược lại cấu trúc images đúng định dạng DB
    const updatedImages: ProductImage[] = [
      { url: formData.image_url, is_primary: true },
      ...formData.images.map((url) => ({ url, is_primary: false }))
    ];

    const finalTags = formData.tags.split(",").map(t => t.trim()).filter(Boolean);

    const finalData: Product = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      stock_quantity: Number(formData.stock_quantity),
      tags: finalTags,
      images: updatedImages,
      updated_at: new Date().toISOString()
    } as Product;

    onSave(finalData);
    toast.success("Đã cập nhật thông tin sản phẩm!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <form onSubmit={handleSubmit} autoComplete="off" className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
        
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
          
          {/* QUẢN LÝ HÌNH ẢNH */}
          <section className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={18} /> Quản lý hình ảnh
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[11px] font-bold text-emerald-600 uppercase tracking-wider italic">
                  <span>Ảnh đại diện (*)</span>
                  <button type="button" onClick={() => setIsEditingMainImage(!isEditingMainImage)} className="flex items-center gap-1 hover:underline">
                    {isEditingMainImage ? "Đóng" : <><RefreshCw size={12}/> Thay đổi</>}
                  </button>
                </div>
                <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border-2 border-emerald-500/20 flex items-center justify-center shadow-inner">
                  {formData.image_url ? <img src={formData.image_url} alt="Main" className="w-full h-full object-contain p-2" /> : <ImageIcon size={48} className="opacity-20" />}
                </div>
                {isEditingMainImage && (
                  <InputGroup 
                    label="Link ảnh chính (URL)" 
                    name="image_url" 
                    value={formData.image_url} 
                    onChange={handleChange} 
                  />
                )}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider italic">Ảnh phụ bổ trợ ({formData.images.length})</label>
                  <button type="button" onClick={addGalleryImage} className="flex items-center gap-1.5 py-1.5 px-4 bg-emerald-600 text-white rounded-full text-[11px] font-bold hover:bg-emerald-700 transition-all shadow-md active:scale-95">
                    <PlusCircle size={14} /> Thêm ảnh mới
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.images.map((img, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-2xl border border-gray-100 space-y-2 group animate-in zoom-in-95">
                      <div className="flex gap-3 items-center">
                        <div className="w-16 h-16 bg-white rounded-xl border flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {img ? <img src={img} className="w-full h-full object-contain" alt="" /> : <ImageIcon className="opacity-10" />}
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <button type="button" onClick={() => setEditingGalleryIndex(editingGalleryIndex === index ? null : index)} className="text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded">Sửa link</button>
                          <button type="button" onClick={() => removeGalleryImage(index)} className="text-[10px] font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded">Xóa ảnh</button>
                        </div>
                      </div>
                      {editingGalleryIndex === index && <input type="text" value={img} onChange={(e) => handleGalleryChange(index, e.target.value)} className="w-full px-3 py-1.5 text-[10px] rounded-lg border border-emerald-200 outline-none" />}
                    </div>
                  ))}
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
                <input type="text" value={formData.product_code || ""} className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 text-sm" disabled />
              </div>
              <InputGroup label="Thương hiệu" name="brand" value={formData.brand || ""} onChange={handleChange} />
              <InputGroup label="Xuất xứ" name="origin" value={formData.origin || ""} onChange={handleChange} icon={<MapPin size={12}/>} />
              <InputGroup label="Tags" name="tags" value={formData.tags} onChange={handleChange} icon={<Tag size={12}/>} placeholder="cao_cap, khang_khuan..." />
              <InputGroup label="Danh mục (Tên)" name="category.name" value={formData.category?.name || ""} onChange={handleChange} />
              <InputGroup label="Danh mục (Code)" name="category.code" value={formData.category?.code || ""} onChange={handleChange} />
            </div>
          </section>

          {/* TÀI CHÍNH & KHO */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 "><DollarSign size={16} className="text-emerald-500" /> Tài chính & Kho hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <InputGroup label="Giá bán hiện tại (₫)" name="price" type="number" value={formData.price} onChange={handleChange} required />
              <InputGroup label="Giá gốc (₫)" name="originalPrice" type="number" value={formData.originalPrice || ""} onChange={handleChange} />
              <InputGroup label="Số lượng tồn kho" name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleChange} required />
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
              <InputGroup label="Số chứng nhận" name="specifications.certification_number" value={formData.specifications?.certification_number || ""} onChange={handleChange} />
            </div>
          </section>

          {/* MÔ TẢ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
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