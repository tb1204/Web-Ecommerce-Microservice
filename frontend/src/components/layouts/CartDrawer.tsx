import { useState, useMemo } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CartContents from "../Cart/CartContents";

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  type: "nem_phukien" | "boga";
  price: number;
  quantity: number;
  image: string;
  size?: string;
  thickness?: string;
  color?: string;
}

interface CartDrawerProps {
  drawerOpen: boolean;
  toggleCartDrawer: () => void;
}

function CartDrawer({ drawerOpen, toggleCartDrawer }: CartDrawerProps) {
  const navigate = useNavigate();

  const [cartProducts, setCartProducts] = useState<CartItem[]>([
    {
      productId: "p1",
      name: "Nệm foam Goodnight Eva gấp 3 nâng đỡ",
      type: "nem_phukien",
      price: 3099000,
      quantity: 1,
      image: "https://picsum.photos/200",
      size: "160x200cm",
      thickness: "10cm",
    },
    {
      productId: "p2",
      name: "Bộ ga chun Tencel Amando Confident",
      type: "boga",
      price: 1550000,
      quantity: 1,
      image: "https://picsum.photos/201",
      size: "180x200cm",
      color: "Xanh Navy",
    },
  ]);

  // Logic cập nhật số lượng
  const handleUpdateQuantity = (
    productId: string,
    variantId: string | undefined,
    newQty: number,
  ) => {
    if (newQty < 1) return;
    setCartProducts((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQty } : item,
      ),
    );
  };
  const handleContinueShopping = () => {
    toggleCartDrawer();
    navigate("/collections/all");
  };

  // Logic xóa sản phẩm
  const handleRemoveItem = (productId: string) => {
    setCartProducts((prev) =>
      prev.filter((item) => item.productId !== productId),
    );
  };

  // Tính tổng tiền tự động dựa trên cartProducts
  const totalAmount = useMemo(() => {
    return cartProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [cartProducts]);

  const handleCheckout = () => {
    toggleCartDrawer();
    navigate("/checkout");
  };
  const handleDetailCart = () => {
    navigate("/cart");
    toggleCartDrawer();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[140] transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleCartDrawer}
      />

      <aside
        className={`fixed top-0 right-0 w-full sm:w-1/2 md:w-[28rem] h-full 
        bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-[150] flex flex-col
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold">Giỏ hàng</h2>
            <p className="text-xs text-gray-500 font-medium">
              ({cartProducts.length} sản phẩm)
            </p>
          </div>
          <button
            onClick={toggleCartDrawer}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Nội dung Giỏ hàng */}
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
          {cartProducts.length > 0 ? (
            <CartContents
              cart={{ products: cartProducts, totalPrice: totalAmount }}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
              <button
                onClick={handleContinueShopping}
                className="text-[#05472a] font-bold underline"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartProducts.length > 0 && (
          <div className="p-5 bg-gray-50 dark:bg-gray-800 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Tổng cộng:
              </span>
              <span className="text-xl font-bold text-[#c91e2c]">
                {totalAmount.toLocaleString("vi-VN")}đ
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-[#05472a] text-white py-4 rounded-xl font-bold hover:bg-[#0a2e1e] transition-all"
              >
                Tiến hành thanh toán
              </button>
              <button
                onClick={handleDetailCart}
                className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Xem chi tiết giỏ hàng
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
