// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import nem from "../assets/nem/nem-bong-ep.webp";
// import goi from "../assets/goi/goi-cao-su.webp";

// interface OrderItem {
//   productId: string;
//   name: string;
//   image: string;
//   variant: string;
//   price: number;
//   quantity: number;
// }

// interface OrderDetail {
//   _id: string;
//   orderNumber: string;
//   customerInfo: {
//     name: string;
//     phone: string;
//     email: string;
//   };
//   shippingAddress: string;
//   summary: {
//     totalAmount: number;
//     shippingFee: number;
//     totalQty: number;
//   };
//   payment: {
//     method: string;
//     status: "PAID" | "UNPAID";
//     transactionId?: string;
//   };
//   orderStatus:
//     | "PENDING"
//     | "PROCESSING"
//     | "SHIPPING"
//     | "DELIVERED"
//     | "CANCELLED";
//   orderItems: OrderItem[];
//   createdAt: string;
// }

// const FAKE_ORDER_DETAIL: OrderDetail = {
//   _id: "65de1234567890abcdef0001",
//   orderNumber: "ORD-2026-001",
//   customerInfo: {
//     name: "Trần Công Bằng",
//     phone: "0901234567",
//     email: "bangtran.dev@gmail.com",
//   },
//   shippingAddress: "123 Đường ABC, Phường 5, Quận Ninh Kiều, Cần Thơ",
//   summary: {
//     totalAmount: 2150000,
//     shippingFee: 30000,
//     totalQty: 2,
//   },
//   payment: {
//     method: "VNPAY",
//     status: "PAID",
//     transactionId: "VNP-999888",
//   },
//   orderStatus: "DELIVERED",
//   createdAt: "2026-01-21T12:40:00Z",
//   orderItems: [
//     {
//       productId: "prod_01",
//       name: "Bộ Ga Gối Cotton Lụa Hàn Quốc",
//       image: goi,
//       variant: "Màu Xanh Pastel - 1m8 x 2m",
//       price: 1250000,
//       quantity: 1,
//     },
//     {
//       productId: "prod_02",
//       name: "Gối Nằm Cao Su Non Chống Đau Cổ",
//       image: nem,
//       variant: "Trắng - Standard Size",
//       price: 450000,
//       quantity: 2,
//     },
//   ],
// };

// const OrderDetailsPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [order, setOrder] = useState<OrderDetail | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setOrder(FAKE_ORDER_DETAIL);
//       setLoading(false);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [id]);

//   if (loading)
//     return (
//       <div className="text-center p-20 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-700 dark:text-gray-300">
//         Đang tải thông tin đơn hàng...
//       </div>
//     );

//   if (!order)
//     return (
//       <div className="text-center p-20 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-700 dark:text-gray-300">
//         Không tìm thấy đơn hàng.
//       </div>
//     );

//   const totalPayable = order.summary.totalAmount + order.summary.shippingFee;

//   return (
//     <div
//       className="max-w-6xl mx-auto p-4 md:p-10
//       bg-gray-50 dark:bg-gray-900
//       min-h-screen transition-colors duration-300"
//     >
//       <Link
//         to="/my-orders"
//         className="text-sm font-medium
//         text-blue-600 dark:text-blue-400
//         hover:underline mb-6 inline-block"
//       >
//         Quay lại danh sách đơn hàng
//       </Link>

//       <div
//         className="flex flex-col md:flex-row justify-between
//         border-b border-gray-200 dark:border-gray-700
//         pb-8 mb-8 gap-4"
//       >
//         <div>
//           <h1
//             className="text-3xl font-black
//             text-gray-900 dark:text-white
//             uppercase tracking-tighter"
//           >
//             Chi tiết đơn hàng
//           </h1>
//           <p className="text-gray-500 dark:text-gray-400 mt-2">
//             Mã đơn:
//             <span className="font-mono font-bold text-black dark:text-white ml-2">
//               {order.orderNumber}
//             </span>
//           </p>
//           <p className="text-gray-500 dark:text-gray-400">
//             Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
//           </p>
//         </div>

//         <div className="flex flex-col sm:items-end gap-2">
//           <span
//             className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
//               order.payment.status === "PAID"
//                 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
//                 : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
//             }`}
//           >
//             {order.payment.status === "PAID"
//               ? "Đã thanh toán"
//               : "Chờ thanh toán"}
//           </span>

//           <span
//             className="px-4 py-1 rounded-full text-xs font-bold uppercase
//             bg-blue-100 text-blue-700
//             dark:bg-blue-900/30 dark:text-blue-400"
//           >
//             {order.orderStatus === "DELIVERED"
//               ? "Đã giao hàng thành công"
//               : "Đang xử lý"}
//           </span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//         <div className="lg:col-span-2 space-y-10">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <section>
//               <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase mb-4 tracking-widest">
//                 Người nhận hàng
//               </h3>
//               <p className="font-bold text-gray-900 dark:text-white">
//                 {order.customerInfo.name}
//               </p>
//               <p className="text-gray-600 dark:text-gray-300">
//                 {order.customerInfo.phone}
//               </p>
//               <p className="text-gray-600 dark:text-gray-400 italic mt-2">
//                 {order.shippingAddress}
//               </p>
//             </section>

//             <section>
//               <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase mb-4 tracking-widest">
//                 Phương thức thanh toán
//               </h3>
//               <p className="font-bold text-gray-900 dark:text-white">
//                 {order.payment.method}
//               </p>
//               {order.payment.transactionId && (
//                 <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
//                   Giao dịch: {order.payment.transactionId}
//                 </p>
//               )}
//             </section>
//           </div>

//           <section>
//             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
//               Danh sách sản phẩm
//             </h3>

//             <div
//               className="divide-y border-t border-b
//               border-gray-200 dark:border-gray-700
//               dark:divide-gray-700"
//             >
//               {order.orderItems.map((item) => (
//                 <div
//                   key={item.productId}
//                   className="py-6 flex items-center justify-between gap-4"
//                 >
//                   <div className="flex items-center gap-4">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-24 h-24 object-cover rounded-xl border border-gray-200 dark:border-gray-600"
//                     />
//                     <div>
//                       <Link
//                         to={`/product/${item.productId}`}
//                         className="hover:text-blue-600 dark:hover:text-blue-400 transition"
//                       >
//                         <h4 className="font-bold text-gray-900 dark:text-white">
//                           {item.name}
//                         </h4>
//                       </Link>
//                       <p className="text-sm text-gray-500 dark:text-gray-400 italic">
//                         {item.variant}
//                       </p>
//                       <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
//                         Số lượng:{" "}
//                         <span className="font-bold">{item.quantity}</span>
//                       </p>
//                     </div>
//                   </div>

//                   <p className="font-bold text-gray-900 dark:text-white whitespace-nowrap">
//                     {(item.price * item.quantity).toLocaleString()}đ
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         <div className="lg:col-span-1">
//           <div
//             className="bg-white dark:bg-gray-800
//             p-6 rounded-3xl
//             border border-gray-100 dark:border-gray-700
//             shadow-sm transition-colors"
//           >
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
//               Tổng đơn hàng
//             </h3>

//             <div className="space-y-4 text-sm">
//               <div className="flex justify-between text-gray-600 dark:text-gray-300">
//                 <span>Tạm tính</span>
//                 <span className="font-medium">
//                   {order.summary.totalAmount.toLocaleString()}đ
//                 </span>
//               </div>

//               <div className="flex justify-between text-gray-600 dark:text-gray-300">
//                 <span>Phí vận chuyển</span>
//                 <span className="font-medium">
//                   {order.summary.shippingFee.toLocaleString()}đ
//                 </span>
//               </div>

//               <div className="flex justify-between text-gray-600 dark:text-gray-300">
//                 <span>Giảm giá</span>
//                 <span className="font-medium text-red-500 dark:text-red-400">
//                   -0đ
//                 </span>
//               </div>

//               <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-end">
//                 <span className="font-bold text-gray-900 dark:text-white text-base">
//                   Tổng số tiền
//                 </span>
//                 <span className="font-black text-2xl text-green-600 dark:text-green-400 leading-none">
//                   {totalPayable.toLocaleString()}đ
//                 </span>
//               </div>
//             </div>

//             {/* ✅ NÚT XANH LÁ */}
//             <button
//               className="w-full mt-8
//               bg-green-600 hover:bg-green-700
//               dark:bg-green-500 dark:hover:bg-green-600
//               text-white py-4 rounded-2xl
//               font-bold transition
//               active:scale-95 shadow-lg"
//             >
//               In hóa đơn
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetailsPage;

//test
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Loader2 } from "lucide-react";

// const BASE_URL = "http://localhost:8084";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  lineTotal: number;
  size?: string;
  thickness?: string;
  color?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    shippingAddress: string;
  };
  summary: {
    totalAmount: number;
    shippingFee: number;
    totalQty: number;
  };
  payment: {
    method: string;
    status: string;
    transactionId?: string;
  };
  orderStatus: string;
  cancelReason?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "PROCESSING":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "SHIPPING":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "CANCELLED":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "PENDING":
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "PROCESSING":
      return "Đang xử lý";
    case "SHIPPING":
      return "Đang giao hàng";
    case "DELIVERED":
      return "Đã giao hàng";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
};

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const token = await getToken({ template: "my-backend" });
        const res = await axios.get(`${BASE_URL}/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let orderData = { ...res.data };

        if (orderData.payment?.orderStatus && !orderData.orderStatus) {
          orderData.orderStatus = orderData.payment.orderStatus;
        }
        if (!orderData.items || !Array.isArray(orderData.items)) {
          orderData.items = [];
        }

        setOrder(orderData);
      } catch (err: any) {
        console.error("Lỗi fetch order:", err.response?.data || err.message);
        setError("Không tìm thấy đơn hàng hoặc có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center p-20 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-700 dark:text-gray-300">
        <p>{error ?? "Không tìm thấy đơn hàng."}</p>
        <button
          onClick={() => navigate("/my-orders")}
          className="mt-4 text-blue-600 underline text-sm"
        >
          Quay lại danh sách đơn hàng
        </button>
      </div>
    );
  }

  const subTotal =
    (order.summary?.totalAmount ?? 0) - (order.summary?.shippingFee ?? 0);
  const shippingFee = order.summary?.shippingFee ?? 0;
  const totalPayable = order.summary?.totalAmount ?? 0;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Link
        to="/my-orders"
        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
      >
        Quay lại danh sách đơn hàng
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between border-b border-gray-200 dark:border-gray-700 pb-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
            Chi tiết đơn hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Mã đơn:
            <span className="font-mono font-bold text-black dark:text-white ml-2">
              {order.orderNumber}
            </span>
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2">
          <span
            className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(order.orderStatus)}`}
          >
            {getStatusLabel(order.orderStatus)}
          </span>
          <span
            className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
              order.payment?.status === "PAID"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            }`}
          >
            {order.payment?.status === "PAID"
              ? "Đã thanh toán"
              : "Chờ thanh toán"}
          </span>
          {order.orderStatus === "CANCELLED" && order.cancelReason && (
            <p className="text-xs text-red-500 dark:text-red-400 max-w-xs text-right">
              Lý do: {order.cancelReason}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          {/* Thông tin người nhận & thanh toán */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 tracking-widest">
                Người nhận hàng
              </h3>
              <p className="font-bold text-gray-900 dark:text-white">
                {order.customerInfo?.name}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-0.5">
                {order.customerInfo?.phone}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {order.customerInfo?.email}
              </p>
              <p className="text-gray-500 dark:text-gray-400 italic mt-2 text-sm leading-relaxed">
                {order.customerInfo?.shippingAddress}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 tracking-widest">
                Phương thức thanh toán
              </h3>
              <p className="font-bold text-gray-900 dark:text-white">
                {order.payment?.method}
              </p>
              <p
                className={`text-sm mt-1 font-medium ${
                  order.payment?.status === "PAID"
                    ? "text-green-600 dark:text-green-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {order.payment?.status === "PAID"
                  ? "✓ Đã thanh toán"
                  : "⏳ Chờ thanh toán"}
              </p>
              {order.payment?.transactionId && (
                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-1">
                  Mã GD: {order.payment.transactionId}
                </p>
              )}
            </div>
          </div>

          {/* ✅ Bảng danh sách sản phẩm */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white">
                Danh sách sản phẩm
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({order.items?.length ?? 0} sản phẩm)
                </span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    <th className="text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                      Sản phẩm
                    </th>
                    <th className="text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                      Đơn giá
                    </th>
                    <th className="text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                      Số lượng
                    </th>
                    <th className="text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-3">
                      Tổng
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {order.items?.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-10 text-gray-400 text-sm"
                      >
                        Không có sản phẩm nào trong đơn hàng.
                      </td>
                    </tr>
                  )}

                  {order.items?.map((item, idx) => (
                    <tr
                      key={`${item.productId}-${idx}`}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      {/* Cột sản phẩm */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* Ảnh */}
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-14 h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
                              <span className="text-gray-400 text-[10px] text-center">
                                No img
                              </span>
                            </div>
                          )}

                          {/* Tên + variant */}
                          <div>
                            <Link
                              to={`/product/${item.productId}`}
                              className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-2 leading-snug"
                            >
                              {item.productName}
                            </Link>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.size && (
                                <span className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                                  {item.size}
                                </span>
                              )}
                              {item.thickness && (
                                <span className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                                  {item.thickness}
                                </span>
                              )}
                              {item.color && (
                                <span className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                                  {item.color}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Đơn giá */}
                      <td className="px-4 py-4 text-right text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {(item.price ?? 0).toLocaleString("vi-VN")}đ
                      </td>

                      {/* Số lượng */}
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg">
                          {item.quantity}
                        </span>
                      </td>

                      {/* Tổng */}
                      <td className="px-5 py-4 text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        {(
                          item.lineTotal ?? item.price * item.quantity
                        ).toLocaleString("vi-VN")}
                        đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right - Tổng đơn hàng */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Tổng đơn hàng
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Tạm tính ({order.summary?.totalQty ?? 0} sản phẩm)</span>
                <span className="font-medium">
                  {subTotal.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Phí vận chuyển</span>
                <span className="font-medium">
                  {shippingFee === 0 ? (
                    <span className="text-green-600 font-semibold">
                      Miễn phí
                    </span>
                  ) : (
                    `${shippingFee.toLocaleString("vi-VN")}đ`
                  )}
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-900 dark:text-white">
                  Tổng cộng
                </span>
                <span className="font-black text-2xl text-green-600 dark:text-green-400">
                  {totalPayable.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full mt-5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-3.5 rounded-2xl font-bold transition active:scale-95 shadow-lg text-sm"
            >
              In hóa đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
