import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { Order } from "../components/Products/InterfaceItem";

const AdminHomePage: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentOrders: [] as Order[],
    topProducts: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPING":
        return "Đang giao";
      case "DELIVERED":
        return "Đã giao";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // 3. Gọi API đổ dữ liệu
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [revRes, countRes, topRes, ordersRes, prodRes] =
          await Promise.all([
            axios.get(`${BASE_URL}/api/orders/statistics/total-revenue`),
            axios.get(`${BASE_URL}/api/orders/statistics/order-counts`),
            axios.get(
              `${BASE_URL}/api/orders/statistics/top-selling-dashboard`,
            ),
            axios.get(`${BASE_URL}/api/orders/all`),
            axios.get(`${BASE_URL}/api/products/all`),
          ]);

        setStats({
          totalSales: revRes.data || 0,
          totalOrders: countRes.data?.total || 0,
          totalProducts: prodRes.data?.length || 0,
          topProducts: topRes.data || [],
          recentOrders: (ordersRes.data || [])
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .slice(0, 5),
        });
      } catch (err) {
        console.error("Lỗi lấy dữ liệu dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center font-bold">Đang tải dữ liệu...</div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="p-6 shadow-md rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold text-emerald-800">Doanh thu</h2>
          <p className="text-3xl font-bold text-emerald-700 mt-2">
            {stats.totalSales.toLocaleString("vi-VN")} ₫
          </p>
        </div>

        <div className="p-6 shadow-md rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold text-sky-800">
            {" "}
            Tổng số đơn hàng{" "}
          </h2>
          <p className="text-3xl font-bold text-sky-700 mt-2">
            {stats.totalOrders}
          </p>
          <Link
            to="/admin/orders"
            className="text-sky-600 hover:underline text-sm mt-3 inline-block"
          >
            Quản lý đơn hàng
          </Link>
        </div>

        <div className="p-6 shadow-md rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold text-amber-800">
            {" "}
            Tổng số sản phẩm{" "}
          </h2>
          <p className="text-3xl font-bold text-amber-700 mt-2">
            {" "}
            {stats.totalProducts}{" "}
          </p>
          <Link
            to="/admin/product"
            className="text-amber-600 hover:underline text-sm mt-3 inline-block"
          >
            Quản lý sản phẩm
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* ĐƠN HÀNG GẦN ĐÂY */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold">Đơn hàng gần đây</h2>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase">
                <tr>
                  <th className="py-3 px-6">Mã Đơn</th>
                  <th className="py-3 px-6">Ngày đặt</th>
                  <th className="py-3 px-6">Người đặt</th>
                  <th className="py-3 px-6">Tổng tiền</th>
                  <th className="py-3 px-6">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-4 px-6 font-medium font-mono text-blue-600">
                      #{order.orderNumber}
                    </td>
                    <td className="py-4 px-6">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-4 px-6">{order.customerInfo.name}</td>
                    <td className="py-4 px-6 font-medium">
                      {order.summary.totalAmount.toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.orderStatus)}`}
                      >
                        {getStatusText(order.orderStatus)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP 5 BÁN CHẠY */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-orange-600">
              {" "}
              Top 5 Bán Chạy{" "}
            </h2>
          </div>

          <div className="p-6 space-y-4 flex-1">
            {stats.topProducts.map((p, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b last:border-0 pb-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-400 w-6 text-center">
                    {" "}
                    #{index + 1}{" "}
                  </span>
                  <span className="text-sm font-medium truncate max-w-[180px]">
                    {" "}
                    {p.name}{" "}
                  </span>
                </div>
                <span className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                  {p.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
