import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Ticket,
  Calendar,
  DollarSign,
  Target,
  Info,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import type { Voucher } from "../Products/InterfaceItem";

// interface AdminVoucherEditModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   voucher: Voucher | null;
//   onSave: (updatedVoucher: Voucher) => void;
// }
// THAY BẰNG
interface AdminVoucherEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: Voucher | null;
  onSave: (updatedVoucher: Voucher) => void;
  onToggle: (id: string) => void;
}

const toLocalISOString = (isoString?: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const tzoffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
};

const localToUTCISOString = (localString: string) => {
  if (!localString) return new Date().toISOString();
  return new Date(localString).toISOString();
};
const AdminVoucherEditModal: React.FC<AdminVoucherEditModalProps> = ({
  isOpen,
  onClose,
  voucher,
  onSave,
  onToggle,
}) => {
  const [formData, setFormData] = useState<Voucher | null>(null);

  useEffect(() => {
    if (voucher) setFormData({ ...voucher });
  }, [voucher, isOpen]);

  if (!isOpen || !formData) return null;

  // --- HÀM XỬ LÝ RÀNG BUỘC GIÁ TRỊ GIẢM ---
  const handleDiscountValueChange = (val: number) => {
    let finalValue = val;

    if (formData.discountType === "PERCENTAGE") {
      // Chặn dưới 1 và chặn trên 100
      if (val > 100) finalValue = 100;
      if (val < 1 && val !== 0) finalValue = 1;
    }

    setFormData({ ...formData, discountValue: finalValue });
  };

  // --- KHI ĐỔI LOẠI GIẢM GIÁ, CŨNG CẦN KIỂM TRA LẠI GIÁ TRỊ ---
  const handleTypeChange = (type: Voucher["discountType"]) => {
    let currentVal = formData.discountValue;
    if (type === "PERCENTAGE" && currentVal > 100) {
      currentVal = 100;
    }
    setFormData({ ...formData, discountType: type, discountValue: currentVal });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (formData.discountValue < 1) {
      toast.error("Giá trị giảm phải ít nhất là 1");
      return;
    }

    if (formData.minOrderAmount < 0 || formData.maxDiscountAmount < 0) {
      toast.error("Số tiền không được âm");
      return;
    }

    if (formData.usageLimit.total < 1 || formData.usageLimit.perUser < 1) {
      toast.error("Giới hạn sử dụng phải ít nhất là 1");
      return;
    }

    if (new Date(formData.validity.end) <= new Date(formData.validity.start)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }

    const finalData: Voucher = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    onSave(finalData);
    // onSave already handles toast likely, or I can keep the one here
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border">
        {/* HEADER - ĐÃ ĐỔI SANG EMERALD */}
        <div className="p-6 border-b flex justify-between items-center bg-emerald-600 text-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl shadow-inner">
              <Ticket size={24} />
            </div>
            <div>
              <h2 className="font-black text-xl uppercase italic tracking-tighter leading-none">
                Chỉnh sửa Voucher
              </h2>
              <p className="text-[11px] text-emerald-100 mt-1 uppercase tracking-[2px] font-bold">
                ID: {formData._id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-700 rounded-full transition-all active:scale-90"
          >
            <X size={28} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 bg-gray-50/30 scrollbar-hide text-gray-900"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CỘT TRÁI */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                  <Info size={16} /> Định danh mã
                </h4>
                <div className="space-y-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm font-sans">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">
                      Mã ưu đãi (Unique)
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all uppercase italic"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">
                      Tên chương trình
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                  <DollarSign size={16} /> Cơ chế giảm giá
                </h4>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
                  <div className="col-span-2 flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          voucherType: "PRODUCT_DISCOUNT",
                        })
                      }
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${formData.voucherType === "PRODUCT_DISCOUNT" ? "bg-white text-amber-600 shadow-sm" : "text-gray-400"}`}
                    >
                      Sản phẩm
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          voucherType: "SHIPPING_DISCOUNT",
                        })
                      }
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${formData.voucherType === "SHIPPING_DISCOUNT" ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400"}`}
                    >
                      Phí ship
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block italic">
                      Cách giảm
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) =>
                        handleTypeChange(
                          e.target.value as Voucher["discountType"],
                        )
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-emerald-500"
                    >
                      <option value="FIXED_AMOUNT">Tiền mặt (₫)</option>
                      <option value="PERCENTAGE">Phần trăm (%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block italic">
                      Giá trị{" "}
                      {formData.discountType === "PERCENTAGE"
                        ? "(1 - 100%)"
                        : "(₫)"}
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) =>
                        handleDiscountValueChange(Number(e.target.value))
                      }
                      min={1}
                      max={
                        formData.discountType === "PERCENTAGE" ? 100 : undefined
                      }
                      className={`w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-black text-gray-800 outline-none focus:ring-2 ${formData.discountType === "PERCENTAGE" ? "focus:ring-amber-500/20 focus:border-amber-500" : "focus:ring-emerald-500/20 focus:border-emerald-500"}`}
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* CỘT PHẢI */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                  <Target size={16} /> Điều kiện & Giới hạn
                </h4>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 font-sans">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">
                        Gía đơn tối thiểu
                      </label>
                      <input
                        type="number"
                        value={formData.minOrderAmount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minOrderAmount: Number(e.target.value),
                          })
                        }
                        min={0}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">
                        Giảm tối đa
                      </label>
                      <input
                        type="number"
                        value={formData.maxDiscountAmount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxDiscountAmount: Number(e.target.value),
                          })
                        }
                        min={0}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">
                        Tổng số mã
                      </label>
                      <input
                        type="number"
                        value={formData.usageLimit.total}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            usageLimit: {
                              ...formData.usageLimit,
                              total: Number(e.target.value),
                            },
                          })
                        }
                        min={1}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block">
                        Lượt dùng/Khách
                      </label>
                      <input
                        type="number"
                        value={formData.usageLimit.perUser}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            usageLimit: {
                              ...formData.usageLimit,
                              perUser: Number(e.target.value),
                            },
                          })
                        }
                        min={1}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4 font-sans">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                  <Calendar size={16} /> Thời hạn chương trình
                </h4>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block italic">
                      Bắt đầu
                    </label>
                    <input
                      type="datetime-local"
                      value={toLocalISOString(formData.validity.start)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          validity: {
                            ...formData.validity,
                            start: localToUTCISOString(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black  uppercase mb-2 block italic text-red-400">
                      Kết thúc
                    </label>
                    <input
                      type="datetime-local"
                      value={toLocalISOString(formData.validity.end)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          validity: {
                            ...formData.validity,
                            end: localToUTCISOString(e.target.value),
                          },
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </form>

        {/* FOOTER - ĐÃ ĐỔI SANG EMERALD */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center flex-shrink-0">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                onToggle(formData._id);
                onClose();
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === "DISABLED" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}
            >
              {formData.status === "DISABLED" ? (
                <RefreshCw size={14} />
              ) : (
                <Trash2 size={14} />
              )}
              {formData.status === "DISABLED" ? "Khôi phục mã" : "Vô hiệu hóa"}
            </button>
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-12 py-3 bg-emerald-600 text-white text-xs font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-[2px]"
            >
              <Save size={18} /> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVoucherEditModal;
