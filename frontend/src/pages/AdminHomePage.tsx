import React from "react";
import { Link } from "react-router-dom";

// 1. Định nghĩa Interfaces cho dữ liệu
interface User {
  name: string;
}

interface Order {
  _id: string;
  user: User;
  totalPrice: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

interface Product {
  _id: string;
  name: string;
}

const AdminHomePage: React.FC = () => {
  // 2. Fake dữ liệu (Thay thế cho Redux/API)
  const products: Product[] = [
    { _id: "p1", name: "Sản phẩm 1" },
    { _id: "p2", name: "Sản phẩm 2" },
    { _id: "p3", name: "Sản phẩm 3" },
  ];

  const orders: Order[] = [
    {
      _id: "ORD001",
      user: { name: "Nguyễn Văn A" },
      totalPrice: 250000,
      status: "Processing",
    },
    {
      _id: "ORD002",
      user: { name: "Trần Thị B" },
      totalPrice: 500000,
      status: "Shipped",
    },
    {
      _id: "ORD003",
      user: { name: "Lê Văn C" },
      totalPrice: 120000,
      status: "Delivered",
    },
  ];

  const totalSales = 870000;
  const totalOrders = orders.length;
  const productsLoading = false;
  const ordersLoading = false;
  const productsError = null;
  const ordersError = null;

  // 3. Render giao diện
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {productsLoading || ordersLoading ? (
        <p>Loading ...</p>
      ) : productsError ? (
        <p className="text-red-500">Error fetching products: {productsError}</p>
      ) : ordersError ? (
        <p className="text-red-500">Error fetching orders: {ordersError}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 shadow-md rounded-lg bg-white dark:bg-gray-700">
            <h2 className="text-xl font-semibold">Doanh thu</h2>
            <p className="text-2xl font-bold text-green-600">
              {totalSales.toLocaleString()}đ
            </p>
          </div>

          <div className="p-4 shadow-md rounded-lg bg-white dark:bg-gray-700">
            <h2 className="text-xl font-semibold">Tổng số đơn hàng</h2>
            <p className="text-2xl font-bold">{totalOrders}</p>
            <Link
              to="/admin/orders"
              className="text-blue-500 hover:underline text-sm"
            >
              Quản lý đơn hàng
            </Link>
          </div>

          <div className="p-4 shadow-md rounded-lg bg-white dark:bg-gray-700">
            <h2 className="text-xl font-semibold">Tổng số sản phẩm</h2>
            <p className="text-2xl font-bold">{products.length}</p>
            <Link
              to="/admin/products"
              className="text-blue-500 hover:underline text-sm"
            >
              Quản lý sản phẩm
            </Link>
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Đơn hàng gần đây</h2>
        <div className="overflow-x-auto bg-white dark:bg-gray-700 shadow-md rounded-lg">
          <table className="min-w-full text-left text-gray-500 dark:text-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-600 text-xs uppercase text-gray-700 dark:text-gray-200">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Người đặt</th>
                <th className="py-3 px-4">Tổng tiền</th>
                <th className="py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 cursor-pointer"
                  >
                    <td className="p-4 font-medium">{order._id}</td>
                    <td className="p-4">{order.user.name}</td>
                    <td className="p-4">
                      {order.totalPrice.toLocaleString()}đ
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status === "Processing"
                          ? "Đang xử lý"
                          : order.status === "Shipped"
                          ? "Đã gửi hàng"
                          : order.status === "Delivered"
                          ? "Đã giao hàng"
                          : order.status === "Cancelled"
                          ? "Đã hủy"
                          : order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
