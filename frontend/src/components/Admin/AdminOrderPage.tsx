import { useState, useEffect, useRef } from "react";
import {
  Eye,
  ShoppingBag,
  Search,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Clock,
  User,
  Printer,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import type { Order } from "../Products/InterfaceItem";
import { PrintInvoice } from "./PrintInvoice";
import AdminOrderDetailModal from "./AdminOrderDetailPage";
import { useAuth } from "@clerk/clerk-react";

const AdminOrderPage = () => {
  const { getToken } = useAuth();
  // const BASE_URL = "http://localhost:8084";
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // --- QUẢN LÝ IN ẤN ---
  const contentRef = useRef<HTMLDivElement>(null);
  const [itemsToPrint, setItemsToPrint] = useState<Order[]>([]);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Hoa_Don_Artisano",
  });

  // --- QUẢN LÝ MODAL ---
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // --- BỘ LỌC ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState(""); // Lọc từ ngày
  const [endDate, setEndDate] = useState(""); // Lọc đến ngày

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/orders/all`);
      if (response.status === 200) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
      toast.error("Không thể tải danh sách đơn hàng từ Server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // const handleStatusChange = async (id: string, newStatus: string) => {
  //   try {
  //     // Khớp với @PatchMapping("/status/{id}") @RequestParam String status ở Backend
  //     const response = await axios.patch(
  //       `${BASE_URL}/api/orders/status/${id}?status=${newStatus}`,
  //     );

  //     if (response.status === 200) {
  //       setOrders((prev) => prev.map((o) => (o.id === id ? response.data : o)));
  //       toast.success(`Đã cập nhật đơn hàng sang: ${newStatus}`);
  //     }
  //   } catch (error: any) {
  //     // Bắt lỗi "Đơn hàng đã hủy không thể đổi trạng thái" từ Backend trả về
  //     const errorMsg =
  //       error.response?.data?.message || "Lỗi server từ chối cập nhật!";
  //     toast.error(errorMsg);
  //     console.error("Lỗi update status:", error);
  //   }
  // };

  // const handleStatusChange = async (id: string, newStatus: string) => {
  //   let reason = "";
  //   if (newStatus === "CANCELLED") {
  //     reason = window.prompt("Vui lòng nhập lý do hủy đơn hàng:", "Khách hàng đổi ý") || "";
  //     if (reason === null) return; // Nếu không nhập lý do thì không cho hủy
  //   }

  //   try {
  //     if (newStatus === "CANCELLED") {
  //         await axios.put(`${BASE_URL}/api/orders/cancel/${id}`, { cancelReason: reason });
  //     } else {
  //         await axios.patch(`${BASE_URL}/api/orders/status/${id}?status=${newStatus}`);
  //     }

  //     fetchOrders();
  //     toast.success(`Cập nhật thành công!`);
  //   } catch (error: any) {
  //     toast.error(error.response?.data?.message || "Thao tác thất bại");
  //   }
  // };
  const handleStatusChange = async (id: string, newStatus: string) => {
    let reason = "";
    if (newStatus === "CANCELLED") {
      reason =
        window.prompt(
          "Vui lòng nhập lý do hủy đơn hàng:",
          "Khách hàng đổi ý",
        ) || "";
      if (reason === null) return;
    }

    // 1. Lấy Token "giấy thông hành" từ Clerk
    const token = await getToken({ template: "my-backend" });

    try {
      // 2. Tạo cấu hình Header có chứa Token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (newStatus === "CANCELLED") {
        // Gửi bằng PUT kèm body và config (headers)
        await axios.put(
          `${BASE_URL}/api/orders/cancel/${id}`,
          { cancelReason: reason },
          config,
        );
      } else {
        // Gửi bằng PATCH kèm config (headers)
        await axios.patch(
          `${BASE_URL}/api/orders/status/${id}?status=${newStatus}`,
          {},
          config,
        );
      }

      fetchOrders();
      toast.success(`Cập nhật thành công!`);
    } catch (error: any) {
      console.error("Lỗi cập nhật:", error.response?.data);
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handlePrintInvoice = (order: Order) => {
    setItemsToPrint([order]);
    setTimeout(() => {
      reactToPrintFn();
    }, 100);
  };

  const handlePrintAllProcessing = () => {
    const processingOrders = orders.filter(
      (o) => o.orderStatus === "PROCESSING",
    );
    if (processingOrders.length === 0) {
      toast.error("Không có đơn hàng nào đang đóng gói để in!");
      return;
    }
    setItemsToPrint(processingOrders);
    setTimeout(() => {
      reactToPrintFn();
    }, 100);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  // const handleConfirmPayment = async (orderNumber: string) => {
  //   if (!window.confirm("Xác nhận khách hàng đã trả tiền mặt cho đơn này?")) return;
  //   try {
  //     // Gọi sang Payment Service (Cổng 8085 của bạn ông)
  //     await axios.patch(`http://localhost:8085/api/payments/order/${orderNumber}/confirm-cod`);
  //     toast.success("Đã cập nhật trạng thái: Đã thu tiền!");
  //     fetchOrders(); // Load lại danh sách
  //   } catch (error) {
  //     toast.error("Không thể cập nhật trạng thái thanh toán!");
  //   }
  // };
  const handleConfirmPayment = async (orderId: string) => {
    // Nhận thêm orderId
    const token = await getToken({ template: "my-backend" });

    try {
      await axios.patch(
        //  ĐỔI TẠI ĐÂY: Dùng orderId thay vì orderNumber
        `${BASE_URL}/api/payments/order/${orderId}/confirm-cod`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Xác nhận thanh toán thành công!");
      fetchOrders();
    } catch (error: unknown) {
      console.error("Lỗi:", error);

      if (error && typeof error === "object" && "response" in error) {
        const err = error as any;
        console.error("Lỗi:", err.response?.data);
        toast.error(
          "Lỗi: " + (err.response?.data?.message || "Không thể cập nhật"),
        );
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    }
  };

  // --- LOGIC LỌC TỔNG HỢP ---
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt).getTime();
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate
      ? new Date(endDate).setHours(23, 59, 59, 999)
      : Infinity;

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.payment.method === paymentFilter;
    const matchesDate = orderDate >= start && orderDate <= end;

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  const getStatusColor = (status: Order["orderStatus"]) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "PROCESSING":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "SHIPPING":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "CANCELLED":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-900">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ShoppingBag className="text-emerald-600" /> Quản lý đơn hàng
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {(searchTerm ||
            statusFilter !== "all" ||
            paymentFilter !== "all" ||
            startDate ||
            endDate) && (
            <button
              onClick={handleResetFilters}
              className="text-[10px] font-black text-red-500 uppercase flex items-center gap-1 hover:underline transition-all"
            >
              <X size={14} /> Xóa lọc
            </button>
          )}
          <button
            onClick={handlePrintAllProcessing}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md active:scale-95"
          >
            <Printer size={18} /> In tất cả
          </button>
        </div>
      </div>

      {/* BỘ LỌC */}
      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 mb-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest flex items-center gap-2">
              <Search size={12} className="text-emerald-500" /> Tìm kiếm đơn
              hàng
            </label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Mã đơn, tên khách..."
                className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white text-sm font-bold transition-all"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest flex items-center gap-2">
              <Filter size={12} className="text-emerald-500" /> Trạng thái
            </label>
            <select
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white text-sm font-bold text-gray-600 appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="PROCESSING">Đang đóng gói</option>
              <option value="SHIPPING">Đang giao hàng</option>
              <option value="DELIVERED">Đã giao hàng</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest flex items-center gap-2">
              <CreditCard size={12} className="text-emerald-500" /> Thanh toán
            </label>
            <select
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white text-sm font-bold text-gray-600 appearance-none cursor-pointer"
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Mọi phương thức</option>
              <option value="VNPAY">VNPAY</option>
              <option value="CASH">Tiền mặt (COD)</option>
            </select>
          </div>
        </div>

        {/* LỌC THEO THỜI GIAN */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-50">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <Calendar size={12} /> Khoảng ngày đặt hàng:
          </span>
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100 w-fit shadow-inner">
            <input
              type="date"
              className="bg-transparent px-3 py-1.5 text-xs font-bold text-gray-600 outline-none cursor-pointer"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="text-gray-300 font-bold">→</span>
            <input
              type="date"
              className="bg-transparent px-3 py-1.5 text-xs font-bold text-gray-600 outline-none cursor-pointer"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* BẢNG DỮ LIỆU */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-400 text-[12px] font-black tracking-[3px]">
            Đang tải dữ liệu...
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden mb-8">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                  <th className="px-6 py-5 text-left">Mã đơn</th>
                  <th className="px-6 py-5 text-left">Ngày tạo</th>
                  <th className="px-6 py-5 text-left">Khách hàng</th>
                  <th className="px-6 py-5 text-center">Thanh toán</th>
                  <th className="px-6 py-5 text-center">Trạng thái đơn hàng</th>
                  <th className="px-6 py-5 text-center">Tổng tiền</th>
                  <th className="px-6 py-5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {currentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-all group"
                  >
                    <td className="px-6 py-4 font-black text-emerald-600 text-sm italic group-hover:scale-105 transition-transform origin-left">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      <span className="block text-[10px] text-gray-400 font-bold uppercase italic">
                        <Clock size={10} className="inline mr-1" />
                        {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                          <User size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-800 leading-none">
                            {order.customerInfo.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                            {order.customerInfo.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black border-2 uppercase ${order.payment.status === "PAID" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-red-50 text-red-600 border-red-100"}`}
                      >
                        {order.payment.status === "PAID"
                          ? "Đã trả"
                          : "Chưa trả"}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        {/* Khối bọc chung: Tạo khung và đổ màu theo trạng thái */}
                        <div
                          className={`flex items-center rounded-xl border-2 transition-all shadow-sm overflow-hidden ${
                            order.payment.status === "PAID"
                              ? "bg-blue-50 border-blue-100"
                              : order.payment.status === "REFUNDED"
                              ? "bg-pink-50 border-pink-100"
                              : order.payment.status === "FAILED" || order.payment.status === "CANCELLED"
                              ? "bg-gray-100 border-gray-200"
                              : "bg-red-50 border-red-100 hover:border-red-300"
                          }`}
                        >
                          {/* 1. SELECT: Loại bỏ border/bg riêng để hòa vào khung chung */}
                          <select
                            disabled={
                              ["PAID", "REFUNDED", "FAILED", "CANCELLED"].includes(order.payment.status) ||
                              order.payment.method === "VNPAY"
                            }
                            value={order.payment.status}
                            onChange={(e) => {
                              const nextStatus = e.target.value;
                              if (nextStatus === "PAID") {
                                // Hiện hộp thoại xác nhận của trình duyệt
                                const isConfirmed = window.confirm("Xác nhận đơn hàng này đã thanh toán tiền mặt thành công?");
                                
                                if (isConfirmed) {
                                  handleConfirmPayment(order.id);
                                } else {
                                  // Nếu nhấn Cancel thì trả lại giá trị cũ, không đổi
                                  e.target.value = order.payment.status;
                                }
                              }
                            }}
                            className={`bg-transparent px-2 py-2 text-[10px] font-black uppercase outline-none transition-colors ${
                              order.payment.status === "PAID"
                                ? "text-blue-600"
                                : order.payment.status === "REFUNDED"
                                ? "text-pink-600"
                                : order.payment.status === "FAILED" || order.payment.status === "CANCELLED"
                                ? "text-gray-500"
                                : "text-red-600"
                            } ${order.payment.method === "VNPAY" ? "cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <option value="PENDING">Chờ thanh toán</option>
                            <option value="PAID">Đã thanh toán</option>
                            {order.payment.status === "FAILED" && <option value="FAILED">Thanh toán lỗi</option>}
                            {order.payment.status === "CANCELLED" && <option value="CANCELLED">Đã hủy</option>}
                            {order.payment.status === "REFUNDED" && <option value="REFUNDED">Đã hoàn tiền</option>}
                          </select>

                          {/* 2. Dấu gạch đứng phân cách mỏng */}
                          <div
                            className={`w-[1px] h-4 ${
                              order.payment.status === "PAID"
                                ? "bg-blue-200"
                                : order.payment.status === "REFUNDED"
                                ? "bg-pink-200"
                                : "bg-red-200"
                            }`}
                          ></div>

                          {/* 3. Nhãn phương thức: Nằm ngay bên phải select trên cùng 1 hàng */}
                          <div className="px-2">
                            <span
                              className={`text-[8px] font-black uppercase whitespace-nowrap ${
                                order.payment.status === "PAID"
                                  ? "text-blue-400"
                                  : order.payment.status === "REFUNDED"
                                  ? "text-pink-400"
                                  : "text-red-400"
                              }`}
                            >
                              {order.payment.method === "COD" ? "COD" : "VNPAY"}
                            </span>
                          </div>
                        </div>

                      
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        disabled={
                          order.orderStatus === "CANCELLED" ||
                          order.orderStatus === "DELIVERED"
                        }
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as Order["orderStatus"],
                          )
                        }
                        className={`w-[140px] px-2 py-2 rounded-xl text-[10px] font-black uppercase border-2 outline-none transition-all shadow-sm text-center ${getStatusColor(order.orderStatus)}`}
                      >
                        <option value="PENDING">Chờ xác nhận</option>
                        <option value="PROCESSING">Đang đóng gói</option>
                        <option value="SHIPPING">Đang giao hàng</option>
                        <option value="DELIVERED">Đã giao hàng</option>
                        <option value="CANCELLED">Hủy đơn hàng</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-gray-900 tracking-tighter italic underline decoration-emerald-500/20">
                      {order.summary.totalAmount.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          disabled={order.orderStatus !== "PROCESSING"}
                          onClick={() => handlePrintInvoice(order)}
                          className={`p-2 rounded-xl shadow-sm transition-all active:scale-90 border ${order.orderStatus === "PROCESSING" ? "text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-600 hover:text-white" : "text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed"}`}
                          title="In hóa đơn"
                        >
                          <Printer size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                          className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm transition-all active:scale-90 border border-emerald-100"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
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
            <div className="flex justify-center items-center gap-4 pb-12">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2.5 rounded-full bg-white border hover:bg-emerald-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1 ? "bg-emerald-600 text-white shadow-md scale-110" : "bg-white border text-gray-500 hover:bg-gray-50 shadow-sm"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="p-2.5 rounded-full bg-white border hover:bg-emerald-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {/* COMPONENT PHỤC VỤ IN */}
      <div style={{ display: "none" }}>
        <PrintInvoice ref={contentRef} orderList={itemsToPrint} />
      </div>

      {/* MODAL */}
      <AdminOrderDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        order={selectedOrder}
        onEdit={() => {
          setIsDetailOpen(false);
        }}
      />
    </div>
  );
};

export default AdminOrderPage;
