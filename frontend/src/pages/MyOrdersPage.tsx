import React from "react";
import { useNavigate } from "react-router-dom";
import nem from "../assets/nem/nem-bong-ep.webp";
import goi from "../assets/goi/goi-bong.webp";
// Interface cho sản phẩm Chăn Ga Gối Nệm
interface OrderItem {
  name: string;
  image: string;
  variant: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  shippingAddress: string;
  orderItems: OrderItem[];
  summary: {
    totalAmount: number;
    shippingFee: number;
    totalQty: number;
  };
  payment: {
    method: string;
    status: "PAID" | "UNPAID";
    transactionId?: string;
  };
  orderStatus:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPING"
    | "DELIVERED"
    | "CANCELLED";
  createdAt: string;
}

const FAKE_ORDERS: Order[] = [
  {
    _id: "65de1234567890abcdef0001",
    orderNumber: "ORD-2026-001",
    shippingAddress: "123 Đường ABC, Phường 5, Quận Ninh Kiều, Cần Thơ",
    orderItems: [
      {
        name: "Nệm Cao Su Thiên Nhiên Liên Á",
        image: nem,
        variant: "1m8 x 2m - 10cm",
        quantity: 1,
        price: 12500000,
      },
    ],
    summary: { totalAmount: 12500000, shippingFee: 0, totalQty: 1 },
    payment: { method: "VNPAY", status: "PAID", transactionId: "VNP-999888" },
    orderStatus: "DELIVERED",
    createdAt: "2026-01-21T12:40:00Z",
  },
  {
    _id: "65de1234567890abcdef0002",
    orderNumber: "ORD-2026-002",
    shippingAddress: "56 Nguyễn Văn Linh, Hưng Lợi, Ninh Kiều, Cần Thơ",
    orderItems: [
      {
        name: "Gối Nằm Lông Vũ Nhân Tạo",
        image: goi,
        variant: "Size 50x70cm",
        quantity: 2,
        price: 450000,
      },
    ],
    summary: { totalAmount: 900000, shippingFee: 30000, totalQty: 2 },
    payment: { method: "COD", status: "UNPAID" },
    orderStatus: "PROCESSING",
    createdAt: "2026-02-01T08:15:00Z",
  },
];

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRowClick = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Đơn hàng của tôi
          </h2>
          <p className="text-gray-500 text-sm">
            Theo dõi lịch sử mua sắm chăn ga gối nệm
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
        >
          Tiếp tục mua sắm
        </button>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Mã đơn
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                  Ngày mua
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Địa chỉ
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase ">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {FAKE_ORDERS.map((order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="hover:bg-gray-50/80 transition-all cursor-pointer group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={order.orderItems[0].image}
                          alt="product"
                          className="w-14 h-14 object-cover rounded-xl border border-gray-200 shadow-sm"
                        />
                        {order.orderItems.length > 1 && (
                          <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                            +{order.orderItems.length - 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {order.orderItems[0].name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.orderItems[0].variant}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-mono text-blue-600 font-medium tracking-tighter">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm text-gray-500 line-clamp-2 max-w-[200px]">
                      {order.shippingAddress}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <p className="text-sm font-bold text-gray-900">
                      {(
                        order.summary.totalAmount + order.summary.shippingFee
                      ).toLocaleString()}
                      đ
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-medium">
                      {order.payment.method}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center whitespace-nowrap">
                    <span
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(order.orderStatus)}`}
                    >
                      {order.orderStatus === "DELIVERED"
                        ? "Đã giao hàng"
                        : "Đang xử lý"}
                    </span>
                    <p
                      className={`text-[10px] mt-1 font-medium ${order.payment.status === "PAID" ? "text-green-500" : "text-amber-500"}`}
                    >
                      ●{" "}
                      {order.payment.status === "PAID"
                        ? "Đã thanh toán"
                        : "Chờ thanh toán"}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
