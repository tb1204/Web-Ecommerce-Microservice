import { RiDeleteBin3Line } from "react-icons/ri";

import type { Cart } from "../../types/Cart";

interface CartContentsProps {
  cart: Cart;
  userId?: string | null;
  guestId?: string;
}

const CartContents = ({ cart, userId, guestId }: CartContentsProps) => {
  console.log("Current User:", userId, "Guest:", guestId);
  // Logic xử lý Redux tạm thời comment lại để không lỗi runtime
  /*
  const dispatch = useDispatch();
  const handleQuantityChange = (...) => { ... }
  const handleRemoveFromCart = (...) => { ... }
  */

  return (
    <div className="space-y-4">
      {cart.products && cart.products.length > 0 ? (
        cart.products.map((product, index) => (
          <div
            key={`${product.productId}-${index}`}
            className="flex items-start justify-between py-4 border-b dark:border-gray-800"
          >
            {/* Ảnh và Thông tin sản phẩm */}
            <div className="flex items-start">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-24 object-cover mr-4 rounded-lg shadow-sm"
              />
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 uppercase">
                  {product.size && `Size: ${product.size}`}
                  {product.size && product.color && " | "}
                  {product.color && `Màu: ${product.color}`}
                </p>

                {/* Nút tăng giảm số lượng (Tạm thời chỉ hiển thị UI) */}
                <div className="flex items-center mt-3 border dark:border-gray-700 w-fit rounded-lg overflow-hidden">
                  <button className="px-3 py-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    -
                  </button>
                  <span className="px-4 text-sm font-medium">
                    {product.quantity}
                  </span>
                  <button className="px-3 py-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Giá tiền và Nút xóa */}
            <div className="flex flex-col items-end justify-between self-stretch">
              <p className="font-bold text-[#3cb371]">
                {(product.price * product.quantity).toLocaleString("vi-VN")} đ
              </p>
              <button
                className="text-red-500 hover:text-red-700 transition p-1"
                title="Xóa sản phẩm"
              >
                <RiDeleteBin3Line size={20} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center py-8 text-gray-500">Giỏ hàng trống</p>
      )}
    </div>
  );
};

export default CartContents;
