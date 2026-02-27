import React, { useState } from "react";
import { 
  X, PlusCircle, Award, Fingerprint, DollarSign, 
  Image as ImageIcon, Trash2, Tag, UploadCloud
} from "lucide-react";
import { toast } from "sonner";
import type { Product, ProductImage } from "../Products/InterfaceItem";

interface ProductAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newProduct: Product) => void;
}

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

interface ProductFormState {
  name: string;
  sku: string;
  product_code: string;
  brand: string;
  origin: string;
  category: { name: string; code: string };
  price: string;
  originalPrice: string;
  specifications: {
    material: string;
    weight: string;
    dimensions: string;
    firmness: string;
    design: string;
    certification_number: string;
  };
  stock_quantity: string;
  status: "selling" | "stopselling";
  tags: string;
  description: string;
  images: ProductImage[];
}

const ProductAddModal: React.FC<ProductAddModalProps> = ({ isOpen, onClose, onAdd }) => {
  const initialFormState: ProductFormState = {
    name: "",
    sku: "",
    product_code: "", 
    brand: "",
    origin: "",
    category: { name: "", code: "" },
    price: "",
    originalPrice: "",
    specifications: {
      material: "",
      weight: "",
      dimensions: "",
      firmness: "",
      design: "",
      certification_number: ""
    },
    stock_quantity: "",
    status: "selling",
    tags: "", 
    description: "",
    images: [] 
  };

  const [formData, setFormData] = useState<ProductFormState>(initialFormState);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: { 
          ...(prev[parent as keyof ProductFormState] as object), 
          [child]: value 
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- HÀM XỬ LÝ CHỌN FILE TỪ MÁY TÍNH ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            { url: base64String, is_primary: prev.images.length === 0 }
          ]
        }));
      };
      reader.readAsDataURL(file);
    });
    // Reset input để có thể chọn lại cùng 1 file nếu xóa đi
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    // Nếu xóa ảnh chính thì đặt ảnh đầu tiên còn lại làm ảnh chính
    if (newImages.length > 0 && formData.images[index].is_primary) {
      newImages[0].is_primary = true;
    }
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error("Hãy thêm ít nhất 1 hình ảnh sản phẩm!");
      return;
    }

    const processedTags = formData.tags.split(',').map((t) => t.trim()).filter((t) => t !== "");
    
    const newProduct: Product = { 
      _id: `p${Date.now()}`,
      name: formData.name,
      sku: formData.sku,
      product_code: formData.product_code,
      brand: formData.brand,
      origin: formData.origin,
      category: formData.category,
      price: Number(formData.price) || 0,
      originalPrice: Number(formData.originalPrice) || 0,
      specifications: formData.specifications,
      stock_quantity: Number(formData.stock_quantity) || 0,
      status: formData.status,
      tags: processedTags,
      description: formData.description,
      images: formData.images,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onAdd(newProduct);
    toast.success("Thêm sản phẩm mới thành công!");
    setFormData(initialFormState); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <form onSubmit={handleSubmit} autoComplete="off" className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border">
        
        <div className="p-5 border-b flex justify-between items-center bg-emerald-600 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><PlusCircle size={20} /></div>
            <div>
              <h2 className="font-bold text-lg leading-none">Thêm sản phẩm mới</h2>
              <p className="text-[11px] text-emerald-100 mt-1 uppercase tracking-widest font-medium italic">Artisano Mattress System</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-emerald-700 rounded-full transition-all"><X size={24} /></button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide bg-gray-50/20">
          {/* PHẦN HÌNH ẢNH - ĐÃ SỬA SANG CHỌN FILE */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ImageIcon size={16} /> Quản lý hình ảnh
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 italic">Tải ảnh lên từ thiết bị</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="file-upload"
                      multiple 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                    <label 
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full py-6 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                    >
                      <UploadCloud size={28} className="text-gray-400 group-hover:text-emerald-500 mb-2" />
                      <span className="text-[10px] font-black text-gray-500 group-hover:text-emerald-600 uppercase tracking-tighter">Nhấn để chọn ảnh</span>
                    </label>
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 italic text-center">Hỗ trợ định dạng: JPG, PNG, WEBP. Ảnh đầu tiên sẽ tự động làm ảnh chính.</p>
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-4 min-h-[100px] content-start">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative w-20 h-20 group animate-in zoom-in-75">
                    <img src={img.url} className="w-full h-full object-cover rounded-xl border-2 border-white shadow-sm" alt="Preview" />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(index)} 
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                    >
                      <Trash2 size={12} />
                    </button>
                    {img.is_primary && (
                      <div className="absolute -bottom-1 left-1 right-1 bg-emerald-500 text-white text-[7px] font-black text-center py-0.5 rounded shadow-sm uppercase tracking-tighter">
                        Ảnh chính
                      </div>
                    )}
                  </div>
                ))}
                {formData.images.length === 0 && (
                  <div className="w-full flex items-center justify-center text-gray-300 italic text-xs">
                    Chưa có hình ảnh nào được chọn...
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* PHẦN THÔNG TIN CƠ BẢN */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2"><Fingerprint size={16} /> Định danh & Phân loại</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <InputGroup label="Tên sản phẩm (*)" name="name" value={formData.name} onChange={handleChange} required />
              <InputGroup label="Mã SKU" name="sku" value={formData.sku} onChange={handleChange} />
              <InputGroup label="Mã nội bộ" name="product_code" value={formData.product_code} onChange={handleChange} />
              <InputGroup label="Danh mục (Tên)" name="category.name" value={formData.category.name} onChange={handleChange} />
              <InputGroup label="Danh mục (Code)" name="category.code" value={formData.category.code} onChange={handleChange} />
              <InputGroup label="Thương hiệu" name="brand" value={formData.brand} onChange={handleChange} />
            </div>

            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2 pt-4"><DollarSign size={16} /> Tài chính & Kho hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <InputGroup label="Giá bán (₫) (*)" name="price" type="number" value={formData.price} onChange={handleChange} required />
              <InputGroup label="Giá gốc (₫)" name="originalPrice" type="number" value={formData.originalPrice} onChange={handleChange} />
              <InputGroup label="Số lượng tồn (*)" name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleChange} required />
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter">Trạng thái</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm font-medium bg-white h-[42px]">
                  <option value="selling">Đang bán</option>
                  <option value="stopselling">Ngừng bán</option>
                </select>
              </div>
            </div>
          </section>

          {/* THÔNG SỐ KỸ THUẬT */}
          <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2"><Award size={16} /> Thông số chi tiết</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputGroup label="Chất liệu" name="specifications.material" value={formData.specifications.material} onChange={handleChange} />
              <InputGroup label="Độ cứng" name="specifications.firmness" value={formData.specifications.firmness} onChange={handleChange} />
              <InputGroup label="Kích thước" name="specifications.dimensions" value={formData.specifications.dimensions} onChange={handleChange} />
              <InputGroup label="Trọng lượng" name="specifications.weight" value={formData.specifications.weight} onChange={handleChange} />
              <InputGroup label="Thiết kế" name="specifications.design" value={formData.specifications.design} onChange={handleChange} />
              <InputGroup label="Chứng nhận" name="specifications.certification_number" value={formData.specifications.certification_number} onChange={handleChange} />
            </div>
          </section>

          {/* TAGS & MÔ TẢ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6">
            <div className="space-y-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <InputGroup label="Tags (Dấu phẩy)" name="tags" value={formData.tags} onChange={handleChange} placeholder="cao_cap, em_ai" />
              <InputGroup label="Xuất xứ" name="origin" value={formData.origin} onChange={handleChange} />
            </div>
            <div className="space-y-1.5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter flex items-center gap-2"><Tag size={14} /> Mô tả tóm tắt</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-emerald-500 outline-none text-sm" />
            </div>
          </section>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 font-mono uppercase tracking-tighter">Hủy bỏ</button>
          <button type="submit" className="px-10 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2">
            <PlusCircle size={18} /> XÁC NHẬN THÊM
          </button>
        </div>
      </form>
    </div>
  );
};

const InputGroup = ({ label, ...props }: InputGroupProps) => (
  <div className="space-y-1.5">
    <label className="text-xs text-gray-500 ml-1 uppercase font-black tracking-tighter">{label}</label>
    <input 
      {...props} 
      autoComplete="off"
      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium bg-white" 
    />
  </div>
);

export default ProductAddModal;