import { useState, useMemo } from "react";
import { Trash2, Plus, Minus, Phone } from "lucide-react";
import nem from "../assets/nem/nem-bong-ep.webp";
import changa from "../assets/chan-ga/bo-chan-ga.webp";
import { useNavigate } from "react-router-dom";

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface CartItem {
  id: number;
  name: string;
  type: "nem_phukien" | "boga"; // Phân loại để hiển thị thông số khác nhau
  price: number;
  quantity: number;
  image: string;
  size?: string; // Kích thước (chung)
  thickness?: string; // Độ dày (cho nệm/phụ kiện)
  color?: string; // Màu sắc (cho bộ ga)
}

const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Chiếu điều hòa cao su Doona Aqua làm mát",
      type: "nem_phukien",
      price: 729000,
      quantity: 2,
      image: nem,
      size: "180x200cm",
      thickness: "1cm",
    },
    {
      id: 2,
      name: "Nệm foam Goodnight Eva gấp 3 nâng đỡ",
      type: "nem_phukien",
      price: 3099000,
      quantity: 1,
      image: nem,
      size: "160x200cm",
      thickness: "10cm",
    },
    {
      id: 3,
      name: "Bộ ga chun Tencel Amando Confident",
      type: "boga",
      price: 1550000,
      quantity: 1,
      image: changa,
      size: "180x200cm",
      color: "Xanh Navy",
    },
    {
      id: 4,
      name: "Chiếu điều hòa cao su Doona Aqua làm mát",
      type: "nem_phukien",
      price: 729000,
      quantity: 2,
      image: nem,
      size: "180x200cm",
      thickness: "1cm",
    },
    {
      id: 5,
      name: "Nệm foam Goodnight Eva gấp 3 nâng đỡ",
      type: "nem_phukien",
      price: 3099000,
      quantity: 1,
      image: nem,
      size: "160x200cm",
      thickness: "10cm",
    },
    {
      id: 6,
      name: "Bộ ga chun Tencel Amando Confident",
      type: "boga",
      price: 1550000,
      quantity: 1,
      image: changa,
      size: "180x200cm",
      color: "Xanh Navy",
    },
  ]);

  // Hàm thay đổi số lượng
  const updateQuantity = (id: number, delta: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };
  const navigate = useNavigate();

  // Hàm xóa sản phẩm
  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Tính tổng tiền sản phẩm (Tự động cập nhật khi state 'items' thay đổi)
  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-10 font-sans text-[#333]">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs mb-6 uppercase tracking-wider text-gray-400">
          Trang chủ / <span className="text-black font-semibold">Giỏ hàng</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8">Giỏ hàng của bạn</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Danh sách sản phẩm */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-xl p-4 flex gap-5 shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 object-cover rounded-lg bg-gray-100"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1">
                        {item.name}
                      </h3>
                      {/* Hiển thị thông số theo loại sản phẩm */}
                      <div className="text-sm text-gray-500 space-y-1">
                        {item.size && <p>Kích thước: {item.size}</p>}
                        {item.type === "nem_phukien"
                          ? item.thickness && <p>Độ dày: {item.thickness}</p>
                          : item.color && <p>Màu sắc: {item.color}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-between items-end gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">Giá:</span>
                        <span className="font-bold text-red-600">
                          {item.price.toLocaleString()}đ
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">Số lượng:</span>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors border-r"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-4 py-1 font-semibold min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors border-l"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-gray-400 text-xs block mb-1">
                        Tổng cộng:
                      </span>
                      <span className="font-bold text-red-600 text-lg">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border">
                <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
              </div>
            )}
          </div>

          {/* Sidebar Tóm tắt đơn hàng */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-10">
              <h2 className="text-xl font-bold mb-6 border-bottom pb-4">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">
                    Tổng tiền sản phẩm:
                  </span>
                  <span className="text-2xl font-black text-red-600">
                    {totalPrice.toLocaleString()}đ
                  </span>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <p className="text-xs text-green-700 leading-relaxed">
                    🌟 Đơn hàng của bạn đã đủ điều kiện{" "}
                    <strong>miễn phí vận chuyển</strong>!
                  </p>
                  <div className="mt-2 w-full bg-green-200 h-1.5 rounded-full">
                    <div className="bg-green-600 h-full w-full rounded-full"></div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-[#004225] text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-900 transition-all active:scale-[0.98] shadow-md shadow-green-900/20"
              >
                Thanh toán ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nút liên hệ */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-[#004225] w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-90">
          <Phone size={24} fill="white" />
        </button>
      </div>
    </div>
  );
};

export default CartPage;
