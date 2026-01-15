import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CartContents from "../Cart/CartContents";
import type { Cart } from "../../types/Cart";
// import CartContents from "../Cart/CartContents"; // Bỏ comment khi dùng
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store"; // Giả định bạn có RootState

interface CartDrawerProps {
  drawerOpen: boolean;
  toggleCartDrawer: () => void;
}

function CartDrawer({ drawerOpen, toggleCartDrawer }: CartDrawerProps) {
  const fakeCart: Cart = {
    products: [
      {
        productId: "p1",
        name: "Sữa rửa mặt Cetaphil Gentle Skin Cleanser",
        price: 250000,
        quantity: 1,
        image: "https://picsum.photos/200", // Link ảnh demo
        color: "Trắng",
        size: "500ml",
      },
      {
        productId: "p2",
        name: "Kem dưỡng ẩm Neutrogena Hydro Boost",
        price: 320000,
        quantity: 2,
        image: "https://picsum.photos/201",
        size: "50g",
      },
    ],
    totalPrice: 890000,
  };
  const cart = fakeCart;
  const navigate = useNavigate();

  // Giả định dữ liệu lấy từ Redux (đã type hóa)
  // const { user } = useSelector((state: RootState) => state.auth);
  // const { cart } = useSelector((state: RootState) => state.cart);

  const userId = "123";
  const guestId = "guest_123";

  const handleCheckout = () => {
    toggleCartDrawer();
    const user = null; // Giả định check user
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <>
      {/* Overlay: Giúp đóng drawer khi nhấn ra ngoài và làm tối nền */}
      <div
        className={`fixed inset-0 bg-black/50 z-[140] transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleCartDrawer}
      />

      <aside
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full 
        bg-white dark:bg-gray-900 text-black dark:text-white shadow-2xl 
        transform transition-transform duration-300 ease-in-out z-[150] flex flex-col
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header Drawer */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <h2 className="text-xl font-bold">Giỏ hàng của bạn</h2>
          <button
            onClick={toggleCartDrawer}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <IoMdClose className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Nội dung giỏ hàng có thanh cuộn */}
        <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
          {cart && cart.products.length > 0 ? (
            <CartContents cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Giỏ hàng của bạn đang trống
              </p>
              <button
                onClick={toggleCartDrawer}
                className="text-[#3cb371] font-medium underline"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          )}
        </div>

        {/* Footer: Nút thanh toán cố định */}
        {cart && cart.products.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
            <button
              onClick={handleCheckout}
              className="w-full bg-[#3cb371] hover:bg-[#2e8b57] text-white py-4 rounded-xl font-bold shadow-lg transition-all transform active:scale-[0.98]"
            >
              Tiến hành thanh toán
            </button>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-3 text-center leading-tight">
              Phí vận chuyển sẽ được tính toán chính xác tại trang thanh toán.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
