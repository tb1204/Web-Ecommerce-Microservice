// pages/PaymentSuccess.tsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const BASE_URL = "http://localhost:8085";
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const orderId = params.get("orderId");

  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchPayment = async () => {
  //     if (!orderId) return;
  //     try {
  //       const token = await getToken({ template: "my-backend" });
  //       const res = await axios.get(
  //         `${BASE_URL}/api/payments/order/${orderId}`,
  //         { headers: { Authorization: `Bearer ${token}` } },
  //       );
  //       setPayment(res.data);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchPayment();
  // }, [orderId]);

  //xóa item khi thanh toán thành công
  useEffect(() => {
    const fetchPayment = async () => {
      if (!orderId) return;
      try {
        const token = await getToken({ template: "my-backend" });
        const res = await axios.get(
          `${BASE_URL}/api/payments/order/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setPayment(res.data);

        // ✅ Xóa đúng cart items sau VNPAY thành công
        if (res.data?.paymentStatus === "PAID" && token) {
          const stored = sessionStorage.getItem("pendingCheckoutVariantIds");
          if (stored) {
            const variantIds = JSON.parse(stored);
            if (variantIds.length > 0) {
              try {
                await axios.delete(
                  "http://localhost:8083/api/cart/checkout-items",
                  {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { variantIds },
                  },
                );
              } catch (err) {
                console.warn("Không xóa cart items:", err);
              } finally {
                sessionStorage.removeItem("pendingCheckoutVariantIds");
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [orderId]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " đ";

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString("vi-VN");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
        {/* Icon thành công */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-500 mt-1">
            Đơn hàng của bạn đã được xác nhận
          </p>
        </div>

        {/* Thông tin giao dịch */}
        <div className="border-t border-b border-gray-100 py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mã đơn hàng</span>
            <span className="font-medium text-gray-800 truncate ml-4">
              {payment?.orderId || orderId}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Số tiền</span>
            <span className="font-medium text-gray-800">
              {payment ? formatCurrency(payment.amount) : "—"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mã giao dịch</span>
            <span className="font-medium text-gray-800">
              {payment?.transactionId || "—"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Thời gian</span>
            <span className="font-medium text-gray-800">
              {payment?.paidAt ? formatDate(payment.paidAt) : "—"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate("/my-orders")}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
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
          Cảm ơn bạn đã mua sắm tại Artisano! 🛏️
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
