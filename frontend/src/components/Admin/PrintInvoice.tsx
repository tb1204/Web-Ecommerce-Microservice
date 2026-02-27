import  { forwardRef } from "react";
import type { Order } from "../Products/InterfaceItem";

interface Props {
  orderList: Order[];
}

// forwardRef giúp thư viện react-to-print có thể "túm" lấy Component này để in
export const PrintInvoice = forwardRef<HTMLDivElement, Props>(({ orderList }, ref) => {
  return (
    <div ref={ref} className="p-10 bg-white font-sans text-gray-900">
      {orderList.map((order) => (
        <div key={order._id} className="invoice-page border-b-2 border-dashed border-gray-300 pb-10 mb-10 last:border-0 last:mb-0" style={{ pageBreakAfter: 'always' }}>
          {/* Header Hóa đơn */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-emerald-600 italic">ARTISANO</h1>
            <h2 className="text-lg font-bold text-gray-500 uppercase tracking-widest mt-1">Hóa đơn bán hàng</h2>
          </div>

          {/* Thông tin đơn hàng */}
          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div className="space-y-1">
              <p><strong>Khách hàng:</strong> {order.customerInfo.name}</p>
              <p><strong>Điện thoại:</strong> {order.customerInfo.phone}</p>
              <p><strong>Địa chỉ:</strong> {order.customerInfo.shippingAddress}</p>
            </div>
            <div className="text-right space-y-1">
              <p><strong>Mã đơn:</strong> #{order.orderNumber}</p>
              <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
              <p><strong>Thanh toán:</strong> {order.payment.method}</p>
            </div>
          </div>

          {/* Bảng sản phẩm */}
          <table className="w-full text-sm border-collapse mb-8">
            <thead>
              <tr className="bg-emerald-50 text-emerald-700">
                <th className="border p-3 text-left">Tên sản phẩm</th>
                <th className="border p-3 text-center w-20">SL</th>
                <th className="border p-3 text-right">Đơn giá</th>
                <th className="border p-3 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.orderDetailId}>
                  <td className="border p-3">{item.productName}</td>
                  <td className="border p-3 text-center">{item.quantity}</td>
                  <td className="border p-3 text-right">{item.price.toLocaleString()}₫</td>
                  <td className="border p-3 text-right font-bold">{(item.price * item.quantity).toLocaleString()}₫</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tổng cộng */}
          <div className="text-right space-y-2">
            <p className="text-gray-500">Tạm tính: <span className="text-black font-bold">{(order.summary.totalAmount - order.summary.shippingFee).toLocaleString()}₫</span></p>
            <p className="text-gray-500">Phí vận chuyển: <span className="text-black font-bold">{order.summary.shippingFee.toLocaleString()}₫</span></p>
            <h3 className="text-2xl font-black text-emerald-600 mt-4 italic">TỔNG CỘNG: {order.summary.totalAmount.toLocaleString()}₫</h3>
          </div>
          
          <p className="text-center text-xs text-gray-400 italic mt-12">Cảm ơn bạn đã tin dùng Artisano!</p>
        </div>
      ))}
    </div>
  );
});