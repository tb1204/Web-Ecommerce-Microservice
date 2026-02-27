//     <div className="max-w-7xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
//         Admin Dashboard
//       </h1>

//       {productsLoading || ordersLoading ? (
//         <p className="text-center text-lg text-gray-500">Đang tải dữ liệu...</p>
//       ) : productsError ? (
//         <p className="text-red-500 text-center">
//           Lỗi tải sản phẩm: {productsError}
//         </p>
//       ) : ordersError ? (
//         <p className="text-red-500 text-center">
//           Lỗi tải đơn hàng: {ordersError}
//         </p>
//       ) : (
//         <>
//           {/* Section 1: Thống kê nhanh - Gradient đẹp, phù hợp shop nệm chăn ga */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
//             {/* Doanh thu - Tông teal tươi mát, tăng trưởng */}
//             <div className="p-6 shadow-lg rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 hover:shadow-xl transition-shadow">
//               <h2 className="text-xl font-semibold text-teal-800">Doanh thu</h2>
//               <p className="text-3xl font-bold text-teal-700 mt-2">
//                 {totalSales.toLocaleString("vi-VN")} ₫
//               </p>
//             </div>

//             {/* Tổng số đơn hàng - Tông xanh dương yên bình */}
//             <div className="p-6 shadow-lg rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-xl transition-shadow">
//               <h2 className="text-xl font-semibold text-blue-800">
//                 Tổng số đơn hàng
//               </h2>
//               <p className="text-3xl font-bold text-blue-700 mt-2">
//                 {totalOrders}
//               </p>
//               <Link
//                 to="/admin/orders"
//                 className="text-blue-600 hover:text-blue-800 hover:underline text-sm mt-3 inline-block font-medium"
//               >
//                 Quản lý đơn hàng
//               </Link>
//             </div>

//             {/* Tổng số sản phẩm - Tông tím lavender sang trọng */}
//             <div className="p-6 shadow-lg rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-xl transition-shadow">
//               <h2 className="text-xl font-semibold text-purple-800">
//                 Tổng số sản phẩm
//               </h2>
//               <p className="text-3xl font-bold text-purple-700 mt-2">
//                 {totalProducts}
//               </p>
//               <Link
//                 to="/admin/product"
//                 className="text-purple-600 hover:text-purple-800 hover:underline text-sm mt-3 inline-block font-medium"
//               >
//                 Quản lý sản phẩm
//               </Link>
//             </div>
//           </div>

import { Link } from "react-router-dom";

interface User {
  name: string;
}

interface Order {
  _id: string;
  user: User;
  totalPrice: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  sold: number;
}

const AdminHomePage: React.FC = () => {
  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "Processing":
        return "Đang xử lý";
      case "Shipped":
        return "Đã gửi";
      case "Delivered":
        return "Đã giao";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };
  const getStatusStyle = (status: Order["status"]) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  const products: Product[] = [
    { _id: "p1", name: "Nệm cao su thiên nhiên 1m8", sold: 120 },
    { _id: "p2", name: "Chăn ga gối cotton 4 món", sold: 85 },
    { _id: "p3", name: "Gối ôm lông vũ", sold: 70 },
    { _id: "p4", name: "Nệm lò xo Dunlopillo", sold: 200 },
    { _id: "p5", name: "Ruột chăn đông ấm", sold: 95 },
    { _id: "p6", name: "Phụ kiện gối kê cổ", sold: 2 },
  ];

  const orders: Order[] = [
    {
      _id: "ORD001",
      user: { name: "Nguyễn Văn A" },
      totalPrice: 2500000,
      status: "Processing",
      createdAt: "2025-02-20",
    },
    {
      _id: "ORD002",
      user: { name: "Trần Thị B" },
      totalPrice: 4500000,
      status: "Shipped",
      createdAt: "2025-02-19",
    },
    {
      _id: "ORD003",
      user: { name: "Lê Văn C" },
      totalPrice: 1800000,
      status: "Delivered",
      createdAt: "2025-02-18",
    },

    {
      _id: "ORD004",
      user: { name: "Phạm Văn E" },
      totalPrice: 2200000,
      status: "Cancelled",
      createdAt: "2025-02-16",
    },
  ];

  // ===== Logic =====
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  const totalSales = 8700000;
  const totalOrders = orders.length;
  const totalProducts = products.length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Admin Dashboard
      </h1>

      {/* KPI SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="p-6 shadow-md rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold text-emerald-800">Doanh thu</h2>
          <p className="text-3xl font-bold text-emerald-700 mt-2">
            {totalSales.toLocaleString("vi-VN")} ₫
          </p>
        </div>

        <div className="p-6 shadow-md rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold text-sky-800">
            Tổng số đơn hàng
          </h2>
          <p className="text-3xl font-bold text-sky-700 mt-2">{totalOrders}</p>
          <Link
            to="/admin/orders"
            className="text-sky-600 hover:underline text-sm mt-3 inline-block"
          >
            Quản lý đơn hàng
          </Link>
        </div>

        <div className="p-6 shadow-md rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
          <h2 className="text-lg font-semibold text-amber-800">
            Tổng số sản phẩm
          </h2>
          <p className="text-3xl font-bold text-amber-700 mt-2">
            {totalProducts}
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
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Ngày</th>
                  <th className="py-3 px-6">Người đặt</th>
                  <th className="py-3 px-6">Tổng tiền</th>
                  <th className="py-3 px-6">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="py-4 px-6 font-medium">{order._id}</td>
                    <td className="py-4 px-6">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-4 px-6">{order.user.name}</td>
                    <td className="py-4 px-6 font-medium">
                      {order.totalPrice.toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          order.status,
                        )}`}
                      >
                        {getStatusText(order.status)}
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
              Top 5 Bán Chạy
            </h2>
          </div>

          <div className="p-6 space-y-4 flex-1">
            {topProducts.map((p, index) => (
              <div
                key={p._id}
                className="flex items-center justify-between border-b last:border-0 pb-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-400 w-6 text-center">
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium truncate max-w-[180px]">
                    {p.name}
                  </span>
                </div>
                <span className="text-xs bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                  {p.sold} lượt
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
