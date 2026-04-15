import React, { useState, useEffect } from "react";
import {
  Ticket,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  ShoppingBag,
  ArrowUpRight,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchAllVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  toggleVoucherStatus,
  setVoucherSearchTerm,
  setSelectedType,
  setCurrentPage,
  fetchVoucherStats,
} from "../../store/slices/voucherSlice";
import {
  selectFilteredVouchers,
  selectVoucherTotalPages,
} from "../../store/selectors";
import { toast } from "sonner";
import type { Voucher } from "../Products/InterfaceItem";

// IMPORT CÁC MODAL
import AdminVoucherDetailModal from "./AdminVoucherDetailModal";
import AdminVoucherEditModal from "./AdminVoucherEditModal";
import AdminVoucherAddModal from "./AdminVoucherAddModal";

const AdminVoucherPage: React.FC = () => {
  // const [vouchers, setVouchers] = useState<Voucher[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);

  // --- STATE ĐIỀU KHIỂN MODALS ---
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);


  const voucherStats = useAppSelector((s) => s.voucher.voucherStats);
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const { loading, currentPage, itemsPerPage, searchTerm, selectedType } =
    useAppSelector((s) => s.voucher);
  const filteredVouchers = useAppSelector(selectFilteredVouchers);
  const totalPages = useAppSelector(selectVoucherTotalPages);

  useEffect(() => {
    const load = async () => {
      const token = await getToken({ template: "my-backend" });
      dispatch(fetchAllVouchers(token));
      dispatch(fetchVoucherStats(token));
    };
    load();
  }, []);

  // --- LOGIC XỬ LÝ CHI TIẾT ---
  const handleViewDetail = (v: Voucher) => {
    setSelectedVoucher(v);
    setIsDetailOpen(true);
  };

  // --- LOGIC XỬ LÝ CHỈNH SỬA ---
  const handleOpenEdit = (v: Voucher) => {
    setSelectedVoucher(v);
    setIsEditOpen(true);
  };


  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentVouchers = filteredVouchers.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage,
  );


  const handleSaveVoucher = async (updatedVoucher: Voucher) => {
    const token = await getToken({ template: "my-backend" });
    const result = await dispatch(
      updateVoucher({
        token,
        id: updatedVoucher._id,
        voucherData: updatedVoucher,
      }),
    );
    if (updateVoucher.fulfilled.match(result)) {
      toast.success("Cập nhật thành công!");
      setIsEditOpen(false);
    } else {
      toast.error("Cập nhật thất bại!");
    }
  };

  // };
  const handleAddVoucher = async (newVoucher: Voucher) => {
    const token = await getToken({ template: "my-backend" });
    const result = await dispatch(
      createVoucher({ token, voucherData: newVoucher }),
    );

    if (createVoucher.fulfilled.match(result)) {
      toast.success("Thêm Voucher thành công!");

      // FIX 1: Refetch danh sách sau khi thêm
      const freshToken = await getToken({ template: "my-backend" });
      await dispatch(fetchAllVouchers(freshToken));

      setIsAddOpen(false);
    } else {
      toast.error(result.error?.message || "Thêm voucher thất bại!");
      console.error("Create error:", result.error);
    }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Xác nhận xóa mã khuyến mãi này?")) return;
    const token = await getToken({ template: "my-backend" });
    const result = await dispatch(deleteVoucher({ token, id }));
    if (deleteVoucher.fulfilled.match(result)) {
      toast.success("Xóa voucher thành công!");
    } else {
      toast.error("Xóa thất bại!");
    }
  };

  const handleToggleStatus = async (id: string) => {
    const token = await getToken({ template: "my-backend" });
    await dispatch(toggleVoucherStatus({ token, id }));
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Ticket className="text-emerald-600" /> Quản lý Voucher
          </h1>
        </div>
        {/* NÚT THÊM MỚI: GẮN SỰ KIỆN MỞ MODAL TẠI ĐÂY */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md active:scale-95"
        >
          <PlusCircle size={20} /> Thêm Voucher mới
        </button>
      </div>


      {/* THỐNG KÊ ĐỘNG TỪ BACKEND */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Đang hoạt động"
          value={`${voucherStats?.active || 0} mã`}
          icon={<CheckCircle />}
          color="emerald"
        />
        <StatCard
          title="Tổng lượt đã dùng"
          value={(voucherStats?.totalUsed || 0).toLocaleString("vi-VN")}
          icon={<ArrowUpRight />}
          color="blue"
        />
        <StatCard
          title="Hết hạn"
          value={`${voucherStats?.expired || 0} mã`}
          icon={<Clock />}
          color="red"
        />
        <StatCard
          title="Đã vô hiệu hóa"
          value={`${voucherStats?.disabled || 0} mã`}
          icon={<EyeOff />}
          color="gray"
        />
      </div>
      {/* BỘ LỌC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm theo mã code hoặc tên voucher..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => {
              dispatch(setVoucherSearchTerm(e.target.value));
            }}
          />
        </div>
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <select
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none shadow-sm appearance-none cursor-pointer font-bold text-gray-700"
            value={selectedType}
            onChange={(e) => {
              dispatch(setSelectedType(e.target.value));
            }}
          >
            <option value="all">Tất cả loại mã</option>
            <option value="SHIPPING_DISCOUNT">Voucher FreeShip</option>
            <option value="PRODUCT_DISCOUNT">Voucher Sản phẩm</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-400 text-[10px] font-black uppercase tracking-[3px]">
            Đang tải dữ liệu...
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase w-16 tracking-widest">
                    STT
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-widest">
                    Thông tin mã
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-widest">
                    Loại
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-widest">
                    Giá trị giảm
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-widest">
                    Sử dụng
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-widest">
                    Trạng thái
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-widest">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {currentVouchers.map((v, index) => (
                  <tr
                    key={v._id}
                    className="hover:bg-emerald-50/10 transition-colors"
                  >
                    <td className="px-4 py-4 text-center text-sm font-bold text-gray-400">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                          {v.code}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                          {v.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${v.voucherType === "SHIPPING_DISCOUNT" ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}
                      >
                        {v.voucherType === "SHIPPING_DISCOUNT" ? (
                          <Truck size={14} />
                        ) : (
                          <ShoppingBag size={14} />
                        )}
                        <span className="text-[10px] font-black uppercase">
                          {v.voucherType === "SHIPPING_DISCOUNT"
                            ? "Ship"
                            : "Mã SP"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <p className="text-sm font-black text-gray-900 leading-none italic">
                        {v.discountType === "FIXED_AMOUNT"
                          ? `${v.discountValue.toLocaleString("vi-VN")}₫`
                          : `${v.discountValue}%`}
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase italic mt-1">
                        Min: {v.minOrderAmount.toLocaleString("vi-VN")}₫
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-full max-w-[100px] mx-auto">
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span className="text-gray-400 italic">
                            {v.usageLimit.used}/{v.usageLimit.total}
                          </span>
                          <span className="text-emerald-600">
                            {Math.round(
                              (v.usageLimit.used / v.usageLimit.total) * 100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{
                              width: `${(v.usageLimit.used / v.usageLimit.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border ${
                          v.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : v.status === "EXPIRED"
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-gray-100 text-gray-400 border-gray-200"
                        }`}
                      >
                        {v.status === "ACTIVE"
                          ? "Hoạt động"
                          : v.status === "EXPIRED"
                            ? "Hết hạn"
                            : "Vô hiệu"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => handleViewDetail(v)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(v._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pb-10">
              <button
                disabled={currentPage === 1}
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                className="p-2 rounded-full bg-white border hover:bg-emerald-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2 text-xs font-black">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => dispatch(setCurrentPage(i + 1))}
                    className={`w-10 h-10 rounded-xl transition-all ${
                      currentPage === i + 1
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-100"
                        : "bg-white border text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                className="p-2 rounded-full bg-white border hover:bg-emerald-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
      {/* --- CÁC MODALS ĐIỀU KHIỂN --- */}
      <AdminVoucherDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        voucher={selectedVoucher}
        onEdit={() => {
          setIsDetailOpen(false);
          setIsEditOpen(true);
        }}
      />

      {/* // THAY BẰNG */}
      <AdminVoucherEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        voucher={selectedVoucher}
        onSave={handleSaveVoucher}
        onToggle={handleToggleStatus}
      />
      {/* MODAL THÊM VOUCHER MỚI */}
      <AdminVoucherAddModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddVoucher}
      />
    </div>
  );
};

// --- SUB-COMPONENTS ---
const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-all group">
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
      {title}
    </p>
    <h3 className="text-xl font-black text-gray-800 mt-1 truncate italic tracking-tighter">
      {value}
    </h3>
  </div>
);

export default AdminVoucherPage;
