import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {
  X,
  Calendar,
  Award,
  DollarSign,
  Users,
  History,
  Ticket,
  Truck,
  ShoppingBag,
  EyeOff,
  CheckCircle,
  Clock,
  PencilLine,
  ShieldCheck,
  Tag,
} from "lucide-react";
import type { Voucher } from "../Products/InterfaceItem";
//////////////////
interface AdminVoucherDetailProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: Voucher | null;
  onEdit: () => void;
}

const AdminVoucherDetailModal: React.FC<AdminVoucherDetailProps> = ({
  isOpen,
  onClose,
  voucher,
  onEdit,
}) => {
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const { getToken } = useAuth();
  // const BASE_URL = "http://localhost:8081";
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!isOpen || !voucher || voucher.userUsedList.length === 0) return;
    const fetchUsers = async () => {
      try {
        const token = await getToken({ template: "my-backend" });
        const res = await axios.get(
          `${BASE_URL}/api/admin/users?page=0&size=1000`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const map: Record<string, string> = {};
        if (res.data.content) {
          res.data.content.forEach((u: any) => {
            map[u.clerkId] = u.email;
          });
        }
        setUserMap(map);
      } catch {
        console.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, [isOpen, voucher, getToken]);

  if (!isOpen || !voucher) return null;

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "Chưa cập nhật";
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border">
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center bg-emerald-600 text-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl shadow-inner">
              <Ticket size={24} />
            </div>
            <div>
              <h2 className="font-black text-xl leading-none uppercase italic tracking-tighter">
                Chi tiết Voucher
              </h2>
              <p className="text-[11px] text-emerald-100 mt-1 uppercase tracking-[2px] font-bold">
                ID: {voucher._id}
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

        <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide bg-gray-50/30">
          {/* PHẦN CHÍNH: CODE VÀ GIÁ TRỊ */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="p-8 bg-white rounded-[32px] border border-emerald-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <Ticket size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        voucher.voucherType === "SHIPPING_DISCOUNT"
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      {voucher.voucherType === "SHIPPING_DISCOUNT" ? (
                        <>
                          <Truck size={12} className="inline mr-2" />
                          Free Shipping
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={12} className="inline mr-2" />
                          Sản phẩm
                        </>
                      )}
                    </span>
                    <span
                      className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        voucher.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : voucher.status === "EXPIRED"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                      }`}
                    >
                      {voucher.status === "ACTIVE"
                        ? "Hoạt động"
                        : voucher.status === "EXPIRED"
                          ? "Hết hạn"
                          : "Vô hiệu"}
                    </span>
                  </div>
                  <h3 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                    {voucher.code}
                  </h3>
                  <p className="text-lg text-gray-400 font-bold mt-4 italic">
                    {voucher.name}
                  </p>
                </div>
              </div>

              {/* GRID THÔNG SỐ */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem
                  label="Mức giảm"
                  value={
                    voucher.discountType === "FIXED_AMOUNT"
                      ? `${voucher.discountValue.toLocaleString("vi-VN")} VNĐ`
                      : `${voucher.discountValue}%`
                  }
                  icon={<DollarSign size={16} />}
                />
                <DetailItem
                  label="Giảm tối đa"
                  value={`${voucher.maxDiscountAmount.toLocaleString("vi-VN")} VNĐ`}
                  icon={<ShieldCheck size={16} />}
                />
                <DetailItem
                  label="Giá đơn tối thiểu"
                  value={`${voucher.minOrderAmount.toLocaleString("vi-VN")} VNĐ`}
                  icon={<Award size={16} />}
                />
              </div>
            </div>

            {/* BẢNG SỬ DỤNG VÀ THỜI GIAN */}
            <div className="w-full lg:w-[320px] space-y-4">
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Users size={16} /> Hiệu suất sử dụng
                </p>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="leading-none">
                      <p className="text-4xl font-black text-emerald-600">
                        {voucher.usageLimit.used}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                        Lượt đã dùng
                      </p>
                    </div>
                    <div className="text-right leading-none">
                      <p className="text-xl font-black text-gray-800">
                        {voucher.usageLimit.total}
                      </p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                        Tổng số mã
                      </p>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                      style={{
                        width: `${(voucher.usageLimit.used / voucher.usageLimit.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 italic text-center">
                    Mỗi khách hàng được dùng tối đa:{" "}
                    {voucher.usageLimit.perUser} lần
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CHI TIẾT THỜI GIAN & LOGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-4 shadow-sm">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={18} className="text-emerald-500" /> Thời hạn
                chương trình
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-emerald-600">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase">
                      bắt đầu
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      {formatDateTime(voucher.validity.start)}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border-2 border-emerald-100/50">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-red-500">
                    <EyeOff size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase">
                      kết thúc
                    </p>
                    <p className="text-sm font-bold text-gray-700">
                      {formatDateTime(voucher.validity.end)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-[32px] border border-gray-100 space-y-4 shadow-sm">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <History size={18} className="text-emerald-500" /> Nhật ký{" "}
              </h4>
              <div className="space-y-4">
                <LogItem
                  label="Thời điểm khởi tạo"
                  date={voucher.createdAt}
                  icon={<CheckCircle className="text-blue-500" />}
                />
                <LogItem
                  label="Cập nhật lần cuối"
                  date={voucher.updatedAt}
                  icon={<History className="text-amber-500" />}
                />
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-px flex-1 bg-gray-100"></div>
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter italic">
                    Stackable: {voucher.isStackable ? "CÓ" : "KHÔNG"}
                  </span>
                  <div className="h-px flex-1 bg-gray-100"></div>
                </div>
              </div>
            </section>
          </div>

          {/* DANH SÁCH USER ĐÃ DÙNG */}
          <section className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Tag size={18} className="text-emerald-500" /> Danh sách khách
              hàng đã áp dụng
            </h4>
            <div className="flex flex-wrap gap-2">
              {voucher.userUsedList.length > 0 ? (
                voucher.userUsedList.map((uid, i) => {
                  const isGuest = uid.startsWith("GUEST_");
                  const displayName = isGuest
                    ? `Khách vãng lai (${uid.replace("GUEST_", "").slice(0, 8)})`
                    : userMap[uid] || `@${uid}`;

                  return (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-lg border border-gray-100 font-mono tracking-tighter"
                    >
                      {displayName}
                    </span>
                  );
                })
              ) : (
                <span className="text-[11px] text-gray-300 italic">
                  Chưa có khách hàng nào sử dụng mã này.
                </span>
              )}
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-gray-50 flex justify-end items-center gap-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-3 text-xs font-black text-gray-400 hover:text-gray-600 transition-all uppercase tracking-widest"
          >
            Đóng
          </button>
          <button
            onClick={onEdit}
            className="px-10 py-3 bg-emerald-600 text-white text-xs font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest"
          >
            <PencilLine size={18} /> Chỉnh sửa Voucher
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CON ---
const DetailItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-all group">
    <p className="text-[9px] uppercase font-black text-gray-400 mb-1.5 flex items-center gap-2 group-hover:text-emerald-500 transition-colors">
      {icon} {label}
    </p>
    <p className="text-sm font-black text-gray-700 italic tracking-tighter underline decoration-emerald-500/10">
      {value}
    </p>
  </div>
);

const LogItem = ({
  label,
  date,
  icon,
}: {
  label: string;
  date: string;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
    <div className="p-2 bg-white rounded-xl shadow-sm">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">
        {label}
      </p>
      <p className="text-xs font-bold text-gray-700">
        {new Date(date).toLocaleString("vi-VN")}
      </p>
    </div>
  </div>
);

export default AdminVoucherDetailModal;
