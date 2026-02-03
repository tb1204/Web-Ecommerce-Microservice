import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import nem from "../assets/nem/nem-bong-ep.webp";
import goi from "../assets/goi/goi-cao-su.webp";
// 1. Định nghĩa kiểu dữ liệu theo Schema của bạn
interface OrderItem {
  productId: string;
  name: string;
  image: string;
  variant: string;
  price: number;
  quantity: number;
}

interface OrderDetail {
  _id: string;
  orderNumber: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  shippingAddress: string;
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
  orderItems: OrderItem[];
  createdAt: string;
}

// 2. Biến Fake Data (Dữ liệu giả)
const FAKE_ORDER_DETAIL: OrderDetail = {
  _id: "65de1234567890abcdef0001",
  orderNumber: "ORD-2026-001",
  customerInfo: {
    name: "Trần Công Bằng",
    phone: "0901234567",
    email: "bangtran.dev@gmail.com",
  },
  shippingAddress: "123 Đường ABC, Phường 5, Quận Ninh Kiều, Cần Thơ",
  summary: {
    totalAmount: 2150000, // Tổng tiền hàng
    shippingFee: 30000,
    totalQty: 2,
  },
  payment: {
    method: "VNPAY",
    status: "PAID",
    transactionId: "VNP-999888",
  },
  orderStatus: "DELIVERED",
  createdAt: "2026-01-21T12:40:00Z",
  orderItems: [
    {
      productId: "prod_01",
      name: "Bộ Ga Gối Cotton Lụa Hàn Quốc",
      image: goi,
      variant: "Màu Xanh Pastel - 1m8 x 2m",
      price: 1250000,
      quantity: 1,
    },
    {
      productId: "prod_02",
      name: "Gối Nằm Cao Su Non Chống Đau Cổ",
      image: nem,
      variant: "Trắng - Standard Size",
      price: 450000,
      quantity: 2,
    },
  ],
};

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập việc fetch data từ API
    const timer = setTimeout(() => {
      setOrder(FAKE_ORDER_DETAIL);
      setLoading(false);
    }, 500); // Đợi 0.5s cho giống thật

    return () => clearTimeout(timer);
  }, [id]);

  if (loading)
    return (
      <div className="text-center p-20">Đang tải thông tin đơn hàng...</div>
    );
  if (!order)
    return <div className="text-center p-20">Không tìm thấy đơn hàng.</div>;

  const totalPayable = order.summary.totalAmount + order.summary.shippingFee;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 bg-white min-h-screen font-sans">
      <Link
        to="/my-orders"
        className="text-sm font-medium text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Quay lại danh sách đơn hàng
      </Link>

      <div className="flex flex-col md:flex-row justify-between border-b pb-8 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
            Chi tiết đơn hàng
          </h1>
          <p className="text-gray-500 mt-2">
            Mã đơn:
            <span className="font-mono font-bold text-black">
              {order.orderNumber}
            </span>
          </p>
          <p className="text-gray-500">
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-2">
          <span
            className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${order.payment.status === "PAID" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {order.payment.status === "PAID"
              ? "Đã thanh toán"
              : "Chờ thanh toán"}
          </span>
          <span className="px-4 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-700">
            {order.orderStatus === "DELIVERED"
              ? "Đã giao hàng thành công"
              : "Đang xử lý"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cột trái: Thông tin & Sản phẩm */}
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">
                Người nhận hàng
              </h3>
              <p className="font-bold text-gray-900">
                {order.customerInfo.name}
              </p>
              <p className="text-gray-600">{order.customerInfo.phone}</p>
              <p className="text-gray-600 italic mt-2">
                {order.shippingAddress}
              </p>
            </section>
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">
                Phương thức thanh toán
              </h3>
              <p className="font-bold text-gray-900">{order.payment.method}</p>
              {order.payment.transactionId && (
                <p className="text-xs text-gray-500 font-mono mt-1">
                  Giao dịch: {order.payment.transactionId}
                </p>
              )}
            </section>
          </div>

          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Danh sách sản phẩm
            </h3>
            <div className="divide-y border-t border-b">
              {order.orderItems.map((item) => (
                <div
                  key={item.productId}
                  className="py-6 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl border"
                    />
                    <div>
                      <Link
                        to={`/product/${item.productId}`}
                        className="hover:text-blue-600 transition"
                      >
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                      </Link>
                      <p className="text-sm text-gray-500 italic">
                        {item.variant}
                      </p>
                      <p className="text-sm mt-1">
                        Số lượng:{" "}
                        <span className="font-bold">{item.quantity}</span>
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 whitespace-nowrap">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Cột phải: Thanh toán */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 ">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Tổng đơn hàng
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span className="font-medium">
                  {order.summary.totalAmount.toLocaleString()}đ
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium">
                  {order.summary.shippingFee.toLocaleString()}đ
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Giảm giá</span>
                <span className="font-medium text-red-500">-0đ</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-end">
                <span className="font-bold text-gray-900 text-base">
                  Tổng số tiền
                </span>
                <span className="font-black text-2xl text-blue-600 leading-none">
                  {totalPayable.toLocaleString()}đ
                </span>
              </div>
            </div>

            <button className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition active:scale-95 shadow-lg">
              In hóa đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
