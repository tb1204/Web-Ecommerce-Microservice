

//lấy data từ backend
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Loader2 } from "lucide-react";

// const BASE_URL = "http://localhost:8084";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

interface Order {
  id: string;
  orderNumber: string;
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
  items: OrderItem[];
  createdAt: string;
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

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isSignedIn, user } = useUser();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     if (!isSignedIn || !user) {
  //       setLoading(false);
  //       return;
  //     }
  //     try {
  //       const token = await getToken({ template: "my-backend" });
  //       const res = await axios.get(`${BASE_URL}/api/orders/user/${user.id}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       // Sắp xếp mới nhất lên đầu
  //       const sorted = (res.data as Order[]).sort(
  //         (a, b) =>
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  //       );
  //       setOrders(sorted);
  //     } catch (err: any) {
  //       setError("Không thể tải danh sách đơn hàng.");
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchOrders();
  // }, [isSignedIn, user]);

  //fix user chưa có tài khoản đặt hàng
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isSignedIn || !user) {
        setLoading(false);
        return;
      }
      try {
        const token = await getToken({ template: "my-backend" });
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Lấy theo userId
        const resByUserId = await axios.get(
          `${BASE_URL}/api/orders/user/${user.id}`,
          { headers },
        );
        let allOrders: Order[] = resByUserId.data ?? [];

        // 2. Nếu có email, lấy thêm theo email (bắt đơn đặt lúc chưa đăng nhập)
        const userEmail = user.primaryEmailAddress?.emailAddress;
        if (userEmail) {
          try {
            const resByEmail = await axios.get(
              `${BASE_URL}/api/orders/email/${encodeURIComponent(userEmail)}`,
              { headers },
            );
            const byEmail: Order[] = resByEmail.data ?? [];

            // Merge — tránh trùng id
            const existingIds = new Set(allOrders.map((o) => o.id));
            const newOrders = byEmail.filter((o) => !existingIds.has(o.id));
            allOrders = [...allOrders, ...newOrders];
          } catch {
            // Email không có đơn nào cũng không sao
          }
        }

        // Sắp xếp mới nhất lên đầu
        const sorted = allOrders.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setOrders(sorted);
      } catch (err: any) {
        setError("Không thể tải danh sách đơn hàng.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isSignedIn, user]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Đơn hàng của tôi
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Theo dõi lịch sử mua sắm chăn ga gối nệm
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
        >
          Tiếp tục mua sắm
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {!isSignedIn ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          Vui lòng{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => navigate("/login")}
          >
            đăng nhập
          </span>{" "}
          để xem đơn hàng.
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {/* <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">
                    Sản phẩm
                  </th> */}
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">
                    Mã đơn
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase whitespace-nowrap">
                    Ngày mua
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">
                    Địa chỉ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-300 uppercase">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all cursor-pointer"
                  >
                    {/* Sản phẩm */}
                    {/* <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {order.items?.[0]?.productName ?? "Sản phẩm"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {order.items?.length > 1
                              ? `+${order.items.length - 1} sản phẩm khác`
                              : `x${order.items?.[0]?.quantity ?? 1}`}
                          </p>
                        </div>
                      </div>
                    </td> */}

                    {/* Mã đơn */}
                    <td className="px-6 py-5 text-sm font-mono text-blue-600 dark:text-blue-400 font-medium tracking-tighter">
                      {order.orderNumber}
                    </td>

                    {/* Ngày mua */}
                    <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>

                    {/* Địa chỉ */}
                    <td className="px-6 py-5">
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-[200px]">
                        {order.customerInfo?.shippingAddress ?? "—"}
                      </p>
                    </td>

                    {/* Tổng tiền */}
                    <td className="px-6 py-5 text-center">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {(order.summary?.totalAmount ?? 0).toLocaleString(
                          "vi-VN",
                        )}
                        đ
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase font-medium">
                        {order.payment?.method}
                      </p>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-5 text-center whitespace-nowrap">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyle(order.orderStatus)}`}
                      >
                        {getStatusLabel(order.orderStatus)}
                      </span>
                      <p
                        className={`text-[10px] mt-1 font-medium ${
                          order.payment?.status === "PAID"
                            ? "text-green-500 dark:text-green-400"
                            : "text-amber-500 dark:text-amber-400"
                        }`}
                      >
                        ●{" "}
                        {order.payment?.status === "PAID"
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
      )}
    </div>
  );
};

export default MyOrdersPage;
