import { X, Package, User, MapPin, Truck,  Phone, Mail, CreditCard, Clock, ShoppingBag, Edit } from "lucide-react";
import type { Order } from "../Products/InterfaceItem";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onEdit: () => void;
}

const AdminOrderDetailModal = ({ isOpen, onClose, order, onEdit }: Props) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300 border">
        
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center bg-emerald-600 text-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <Package size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter uppercase">
                Chi tiết đơn hàng #{order.orderNumber}
              </h2>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest"> ID: {order._id} </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-emerald-700 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto scrollbar-hide flex-1 bg-gray-50/30 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CỘT TRÁI */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* DANH SÁCH SẢN PHẨM CÓ ẢNH */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[2px] mb-6 flex items-center gap-2">
                  <ShoppingBag size={14} className="text-emerald-500" /> Sản phẩm đã đặt ({order.summary.totalQty})
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-100 group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        {/* HIỂN THỊ ẢNH SẢN PHẨM */}
                        <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                          {/* Nếu dữ liệu thật có field image: item.productImage 
                             Nếu chưa có, mình dùng một ảnh placeholder mẫu 
                          */}
                          <img 
                            src={"https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg"} 
                            alt={item.productName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div>
                          <p className="font-black text-gray-800 text-sm leading-tight mb-1">{item.productName}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Mã CT: {item.orderDetailId}</p>
                          <p className="text-[11px] font-black text-emerald-600 mt-1 italic">{item.price.toLocaleString()}₫</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-gray-400 italic">Số lượng: {item.quantity}</p>
                        <p className="text-sm font-black text-gray-900 mt-1">{(item.price * item.quantity).toLocaleString()}₫</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TỔNG KẾT */}
                <div className="mt-8 pt-6 border-t border-dashed border-gray-200 flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Tạm tính: <span className="text-gray-600">{(order.summary.totalAmount).toLocaleString()}₫</span></p>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Phí vận chuyển: <span className="text-gray-600">0₫</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Tổng thanh toán</span>
                    <span className="text-4xl font-black text-emerald-600 italic tracking-tighter leading-none">
                      {order.summary.totalAmount.toLocaleString()}₫
                    </span>
                  </div>
                </div>
              </div>

              {/* GIAO DỊCH */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[2px] mb-6 flex items-center gap-2">
                  <CreditCard size={14} className="text-emerald-500" /> Chi tiết giao dịch
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-[11px]">
                  <div className="space-y-1">
                    <p className="font-black text-gray-400 uppercase">Phương thức</p>
                    <p className="font-bold text-gray-700 flex items-center gap-1.5 uppercase underline decoration-emerald-500 decoration-2">
                      {order.payment.method}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-gray-400 uppercase">Trạng thái tiền</p>
                    <p className={`font-black uppercase italic ${order.payment.status === 'PAID' ? 'text-blue-600' : 'text-red-500'}`}>
                      {order.payment.status}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <p className="font-black text-gray-400 uppercase">Mã giao dịch (TXN)</p>
                    <p className="font-mono font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      {order.payment.transactionId || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI */}
            <div className="space-y-6">
              <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-xl shadow-emerald-100 flex items-center gap-5 relative overflow-hidden group">
                <div className="p-3 bg-white/20 rounded-2xl relative z-10">
                  <Truck size={36} className="group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase opacity-60 tracking-[2px]">Tiến độ đơn</p>
                  <p className="text-2xl font-black italic uppercase tracking-tighter">{order.orderStatus}</p>
                </div>
                <Package size={100} className="absolute -right-5 -bottom-5 opacity-10 rotate-12" />
              </div>

              {/* KHÁCH HÀNG */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
                <h4 className="text-xs font-black text-gray-800 uppercase flex items-center gap-2 border-b pb-3 border-gray-50">
                  <User size={16} className="text-emerald-500"/> Hồ sơ khách hàng
                </h4>
                <div className="space-y-4 text-[11px]">
                  <div className="flex items-center gap-3">
                    <Phone size={14} className="text-gray-400"/>
                    <p className="font-bold text-gray-700">{order.customerInfo.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={14} className="text-gray-400"/>
                    <p className="font-bold text-gray-700">{order.customerInfo.email}</p>
                  </div>
                  <div className="flex items-start gap-3 pt-2 border-t border-gray-50">
                    <MapPin size={14} className="text-emerald-500 mt-0.5"/>
                    <p className="font-medium text-gray-600 leading-relaxed italic">{order.customerInfo.shippingAddress}</p>
                  </div>
                </div>
              </div>

              {/* THỜI GIAN */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} className="text-emerald-500" /> Nhật ký thời gian
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-gray-400 uppercase">Khởi tạo:</span>
                    <span className="font-black text-gray-600">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-gray-400 uppercase">Cập nhật:</span>
                    <span className="font-black text-gray-600">{formatDate(order.updatedAt)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-4 flex-shrink-0">
          <button onClick={onClose} className="px-8 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Đóng cửa sổ</button>
          {order.orderStatus === "PENDING" && (
            <button onClick={onEdit} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all uppercase text-[10px] tracking-[2px] flex items-center gap-2">
              <Edit size={16} /> Chỉnh sửa ngay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailModal;