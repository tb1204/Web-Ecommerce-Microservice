import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { XCircle } from "lucide-react";

const PaymentFailed = () => {
  const BASE_URL = "http://localhost:8085";
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const orderId = params.get("orderId");

  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const token = await getToken({ template: "my-backend" });
        const res = await axios.get(
          `${BASE_URL}/api/payments/order/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setPayment(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [orderId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
        {/* Icon thất bại */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Thanh toán thất bại!
          </h1>
          <p className="text-gray-500 mt-1 text-center">
            Giao dịch không thành công. Vui lòng thử lại.
          </p>
        </div>

        {/* Thông tin đơn hàng */}
        {orderId && (
          <div className="border-t border-b border-gray-100 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mã đơn hàng</span>
              <span className="font-medium text-gray-800 truncate ml-4">
                {orderId}
              </span>
            </div>
          </div>
        )}

        {/* Lý do thất bại từ backend — hiện nếu có */}
        {payment?.failedReason ? (
          <div className="mt-4 p-4 bg-red-50 rounded-xl">
            <p className="text-sm font-medium text-red-700 mb-1">
              Lý do thất bại:
            </p>
            <p className="text-sm text-red-600">{payment.failedReason}</p>
          </div>
        ) : (
          /* Lý do thường gặp — hiện nếu không có failedReason */
          <div className="mt-4 p-4 bg-red-50 rounded-xl">
            <p className="text-sm font-medium text-red-700 mb-2">
              Nguyên nhân có thể:
            </p>
            <ul className="text-sm text-red-600 space-y-1 list-disc list-inside">
              <li>Số dư tài khoản không đủ</li>
              <li>Thông tin thẻ không chính xác</li>
              <li>Giao dịch bị huỷ bởi người dùng</li>
              <li>Giao dịch quá thời gian cho phép</li>
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
          >
            Thử lại thanh toán
          </button>
          <button
            onClick={() => navigate("/my-orders")}
            className="w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition"
          >
            Xem đơn hàng
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition"
          >
            Về trang chủ
          </button>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Cần hỗ trợ? Liên hệ chúng tôi qua trang{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/contact")}
          >
            Liên hệ
          </span>
        </p>
      </div>
    </div>
  );
};

export default PaymentFailed;
