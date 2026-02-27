import React, { useState } from "react";
import { 
  X, Plus, Calendar, DollarSign, 
  Target, Info, 
} from "lucide-react";
import { toast } from "sonner";
// Import trực tiếp Interface từ file của bạn
import type { Voucher } from "../Products/InterfaceItem";

interface AdminVoucherAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newVoucher: Voucher) => void;
}

const AdminVoucherAddModal: React.FC<AdminVoucherAddModalProps> = ({ isOpen, onClose, onAdd }) => {
  // Khởi tạo dựa trên Interface Voucher chính thức
  const initialVoucher: Voucher = {
    _id: `vch_${Date.now()}`,
    code: "",
    name: "",
    voucherType: "PRODUCT_DISCOUNT",
    discountType: "FIXED_AMOUNT",
    discountValue: 0,
    maxDiscountAmount: 0,
    minOrderAmount: 0,
    usageLimit: {
      total: 100,
      perUser: 1,
      used: 0
    },
    validity: {
      start: new Date().toISOString(),
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    status: "ACTIVE",
    isStackable: false,
    userUsedList: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const [formData, setFormData] = useState<Voucher>(initialVoucher);

  if (!isOpen) return null;

  const handleDiscountValueChange = (val: number) => {
    let finalValue = val;
    if (formData.discountType === "PERCENTAGE") {
      if (val > 100) finalValue = 100;
      if (val < 0) finalValue = 0;
    }
    setFormData({ ...formData, discountValue: finalValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onAdd(formData);
    toast.success("Thêm Voucher thành công!");
    setFormData(initialVoucher);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border">
        
        {/* HEADER - EMERALD STYLE */}
        <div className="p-6 border-b flex justify-between items-center bg-emerald-600 text-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl shadow-inner"><Plus size={24} /></div>
            <div>
              <h2 className="font-black text-xl uppercase italic tracking-tighter leading-none">Thêm Voucher mới</h2>
              
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-700 rounded-full transition-all active:scale-90"><X size={28} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 bg-gray-50/30 scrollbar-hide text-gray-900 font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* CỘT TRÁI: THÔNG TIN CƠ BẢN & LOẠI GIẢM */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2"><Info size={16}/> Định danh mã</h4>
                <div className="space-y-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block italic">Mã ưu đãi </label>
                    <input 
                      type="text" 
                      value={formData.code} 
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all uppercase italic"
                      placeholder="VD: ARTISANO2026"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block italic">Tên chương trình</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      placeholder="VD: Khai trương chi nhánh mới"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2"><DollarSign size={16}/> Cơ chế giảm giá</h4>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
                  <div className="col-span-2 flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, voucherType: 'PRODUCT_DISCOUNT'})}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${formData.voucherType === 'PRODUCT_DISCOUNT' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-400'}`}
                    >
                      <p className="inline mr-2"/>Sản phẩm
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, voucherType: 'SHIPPING_DISCOUNT'})}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${formData.voucherType === 'SHIPPING_DISCOUNT' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                    >
                      <p className="inline mr-2"/>Phí Ship
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block italic">Cách giảm </label>
                    <select 
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value as Voucher["discountType"]})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-emerald-500"
                    >
                      <option value="FIXED_AMOUNT">Tiền mặt (₫)</option>
                      <option value="PERCENTAGE">Phần trăm (%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block italic">Giá trị </label>
                    <input 
                      type="number" 
                      value={formData.discountValue} 
                      onChange={(e) => handleDiscountValueChange(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-800 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* CỘT PHẢI: ĐIỀU KIỆN & THỜI GIAN */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2"><Target size={16}/> Điều kiện & giới hạn</h4>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block italic">Đơn tối thiểu</label>
                      <input 
                        type="number" 
                        value={formData.minOrderAmount} 
                        onChange={(e) => setFormData({...formData, minOrderAmount: Number(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block italic">Giảm tối đa</label>
                      <input 
                        type="number" 
                        value={formData.maxDiscountAmount} 
                        onChange={(e) => setFormData({...formData, maxDiscountAmount: Number(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block italic">Tổng số mã</label>
                      <input 
                        type="number" 
                        value={formData.usageLimit.total} 
                        onChange={(e) => setFormData({...formData, usageLimit: {...formData.usageLimit, total: Number(e.target.value)}})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block italic">Lượt dùng/Khách</label>
                      <input 
                        type="number" 
                        value={formData.usageLimit.perUser} 
                        onChange={(e) => setFormData({...formData, usageLimit: {...formData.usageLimit, perUser: Number(e.target.value)}})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-black text-emerald-600 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4 font-sans">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2"><Calendar size={16}/> Thời hạn chương trình</h4>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">Bắt đầu</label>
                      <input 
                        type="datetime-local" 
                        value={formData.validity.start.slice(0, 16)} 
                        onChange={(e) => setFormData({...formData, validity: {...formData.validity, start: new Date(e.target.value).toISOString()}})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 outline-none focus:border-emerald-500"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-red-400 uppercase mb-2 block">Kết thúc</label>
                      <input 
                        type="datetime-local" 
                        value={formData.validity.end.slice(0, 16)} 
                        onChange={(e) => setFormData({...formData, validity: {...formData.validity, end: new Date(e.target.value).toISOString()}})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 outline-none focus:border-emerald-500"
                      />
                   </div>
                </div>
              </section>
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="p-6 border-t bg-gray-50 flex justify-end items-center gap-4 flex-shrink-0">
          <button type="button" onClick={onClose} className="px-8 py-3 text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-all">Hủy bỏ</button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            className="px-12 py-3 bg-emerald-600 text-white text-xs font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[2px]"
          >
            <Plus size={18} /> Lưu Voucher mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminVoucherAddModal;