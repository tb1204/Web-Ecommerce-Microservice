// import { useState, useMemo } from "react";
// import { IoMdClose } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import CartContents from "../Cart/CartContents";

// export interface CartItem {
//   productId: string;
//   variantId?: string;
//   name: string;
//   type: "nem_phukien" | "boga";
//   price: number;
//   quantity: number;
//   image: string;
//   size?: string;
//   thickness?: string;
//   color?: string;
// }

// interface CartDrawerProps {
//   drawerOpen: boolean;
//   toggleCartDrawer: () => void;
// }

// function CartDrawer({ drawerOpen, toggleCartDrawer }: CartDrawerProps) {
//   const navigate = useNavigate();

//   // Mock data giỏ hàng (sẽ thay bằng state/context thực tế sau)
//   const [cartProducts, setCartProducts] = useState<CartItem[]>([
//     {
//       productId: "p1",
//       name: "Nệm foam Goodnight Eva gấp 3 nâng đỡ",
//       type: "nem_phukien",
//       price: 3099000,
//       quantity: 1,
//       image: "https://picsum.photos/200",
//       size: "160x200cm",
//       thickness: "10cm",
//     },
//     {
//       productId: "p2",
//       name: "Bộ ga chun Tencel Amando Confident",
//       type: "boga",
//       price: 1550000,
//       quantity: 1,
//       image: "https://picsum.photos/201",
//       size: "180x200cm",
//       color: "Xanh Navy",
//     },
//   ]);

//   // State theo dõi các sản phẩm được chọn (dùng productId làm key)
//   const [selectedItems, setSelectedItems] = useState<string[]>([]);

//   const toggleSelectItem = (productId: string) => {
//     setSelectedItems((prev) =>
//       prev.includes(productId)
//         ? prev.filter((id) => id !== productId)
//         : [...prev, productId],
//     );
//   };

//   // Chọn / bỏ chọn tất cả
//   const toggleSelectAll = () => {
//     if (selectedItems.length === cartProducts.length) {
//       setSelectedItems([]);
//     } else {
//       setSelectedItems(cartProducts.map((item) => item.productId));
//     }
//   };

//   // Tính tổng tiền chỉ các item được chọn
//   const totalAmount = useMemo(() => {
//     return cartProducts
//       .filter((item) => selectedItems.includes(item.productId))
//       .reduce((sum, item) => sum + item.price * item.quantity, 0);
//   }, [cartProducts, selectedItems]);

//   const selectedCount = selectedItems.length;

//   // Logic cập nhật số lượng
//   const handleUpdateQuantity = (
//     productId: string,
//     variantId: string | undefined,
//     newQty: number,
//   ) => {
//     if (newQty < 1) return;
//     setCartProducts((prev) =>
//       prev.map((item) =>
//         item.productId === productId ? { ...item, quantity: newQty } : item,
//       ),
//     );
//   };

//   // Xóa sản phẩm
//   const handleRemoveItem = (productId: string) => {
//     setCartProducts((prev) =>
//       prev.filter((item) => item.productId !== productId),
//     );
//     // Bỏ chọn nếu item đang được chọn
//     setSelectedItems((prev) => prev.filter((id) => id !== productId));
//   };

//   const handleContinueShopping = () => {
//     toggleCartDrawer();
//     navigate("/collections/all");
//   };

//   const handleCheckout = () => {
//     if (selectedCount === 0) {
//       alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!");
//       return;
//     }

//     // Lọc chỉ các sản phẩm được chọn
//     const selectedProducts = cartProducts.filter((item) =>
//       selectedItems.includes(item.productId),
//     );

//     // Lưu tạm vào localStorage để dùng ở trang checkout
//     // (Sau này nên dùng context, zustand hoặc redux để tốt hơn)
//     localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));

//     toggleCartDrawer();
//     navigate("/checkout");
//   };

//   const handleDetailCart = () => {
//     navigate("/cart");
//     toggleCartDrawer();
//   };

//   return (
//     <>
//       {/* Overlay nền mờ */}
//       <div
//         className={`fixed inset-0 bg-black/50 z-[140] transition-opacity duration-300 ${
//           drawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//         onClick={toggleCartDrawer}
//       />

//       {/* Drawer chính */}
//       <aside
//         className={`fixed top-0 right-0 w-full sm:w-1/2 md:w-[28rem] h-full
//         bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-[150] flex flex-col
//         ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-5 border-b dark:border-gray-800">
//           <div>
//             <h2 className="text-xl font-bold">Giỏ hàng</h2>
//             <p className="text-xs text-gray-500 font-medium">
//               ({cartProducts.length} sản phẩm)
//             </p>
//           </div>
//           <button
//             onClick={toggleCartDrawer}
//             className="p-2 hover:bg-gray-100 rounded-full transition"
//           >
//             <IoMdClose size={24} />
//           </button>
//         </div>

//         {/* Nội dung giỏ hàng */}
//         <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
//           {cartProducts.length > 0 ? (
//             <>
//               {/* Chọn tất cả */}
//               <div className="flex items-center gap-3 mb-4 pb-3 border-b dark:border-gray-700">
//                 <input
//                   type="checkbox"
//                   id="select-all"
//                   checked={
//                     selectedItems.length === cartProducts.length &&
//                     cartProducts.length > 0
//                   }
//                   onChange={toggleSelectAll}
//                   className="w-5 h-5 accent-[#05472a] cursor-pointer"
//                 />
//                 <label
//                   htmlFor="select-all"
//                   className="text-sm font-medium cursor-pointer select-none"
//                 >
//                   Chọn tất cả ({selectedCount}/{cartProducts.length} sản phẩm)
//                 </label>
//               </div>

//               {/* Danh sách sản phẩm */}
//               <CartContents
//                 cart={{ products: cartProducts, totalPrice: totalAmount }}
//                 selectedItems={selectedItems}
//                 onToggleSelect={toggleSelectItem}
//                 onUpdateQuantity={handleUpdateQuantity}
//                 onRemoveItem={handleRemoveItem}
//               />
//             </>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full text-center p-6">
//               <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
//               <button
//                 onClick={handleContinueShopping}
//                 className="text-[#05472a] font-bold underline"
//               >
//                 Tiếp tục mua sắm
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Footer (tổng tiền + nút) */}
//         {cartProducts.length > 0 && (
//           <div className="p-5 bg-gray-50 dark:bg-gray-800 border-t">
//             <div className="flex justify-between items-center mb-4">
//               <span className="font-medium text-gray-600 dark:text-gray-400">
//                 Tổng cộng ({selectedCount} sản phẩm):
//               </span>
//               <span className="text-xl font-bold text-[#c91e2c] dark:text-red-400">
//                 {totalAmount.toLocaleString("vi-VN")}đ
//               </span>
//             </div>

//             <div className="space-y-3">
//               <button
//                 onClick={handleCheckout}
//                 disabled={selectedCount === 0}
//                 className={`w-full py-4 rounded-xl font-bold uppercase transition-all ${
//                   selectedCount > 0
//                     ? "bg-[#05472a] text-white hover:bg-[#0a2e1e]"
//                     : "bg-gray-400 text-gray-600 cursor-not-allowed"
//                 }`}
//               >
//                 Tiến hành thanh toán
//               </button>

//               <button
//                 onClick={handleDetailCart}
//                 className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
//               >
//                 Xem chi tiết giỏ hàng
//               </button>
//             </div>
//           </div>
//         )}
//       </aside>
//     </>
//   );
// }

// export default CartDrawer;

//dùng redux lấy data thật từ backend
import { useState, useMemo, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CartContents from "../Cart/CartContents";
import type { CartItem } from "../Cart/CartContents";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useAuth } from "@clerk/clerk-react";
import {
  fetchCart,
  updateCartQuantity,
  removeFromCart,
} from "../../store/slices/cartSlice";
import { closeCartDrawer } from "../../store/slices/uiSlice";
import { selectIsCartDrawerOpen } from "../../store/selectors";

function CartDrawer() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();

  const drawerOpen = useAppSelector(selectIsCartDrawerOpen);
  // const cartItemsRaw = useAppSelector((state) => state.cart.cart.products);
  const cartItemsRaw = useAppSelector(
    (state) => state.cart?.cart?.products ?? [],
  );
  const cartLoading = useAppSelector((state) => state.cart.loading);

  const cartProducts: CartItem[] = cartItemsRaw.map((item) => ({
    productId: item.productId,
    variantId: item.variantId,
    name: item.name,

    price: Number(item.price) || 0,
    quantity: Number(item.quantity) || 0,
    image: item.image,
    size: item.size,
    thickness: item.thickness,
    color: item.color,
  }));

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  // === THÊM 2 BIẾN NÀY (thay thế totalAmount cũ) ===
  const totalAllAmount = useMemo(() => {
    return cartProducts.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [cartProducts]);

  const totalSelectedAmount = useMemo(() => {
    return cartProducts
      .filter((item) => selectedItems.includes(item.productId))
      .reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);
  }, [cartProducts, selectedItems]);
  useEffect(() => {
    if (drawerOpen) {
      getToken({ template: "my-backend" }).then((token) => {
        dispatch(fetchCart(token));
      });
    }
  }, [drawerOpen]);

  const handleCloseDrawer = () => dispatch(closeCartDrawer());

  const toggleSelectItem = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartProducts.map((item) => item.productId));
    }
  };

  const totalAmount = useMemo(() => {
    return cartProducts
      .filter((item) => selectedItems.includes(item.productId))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartProducts, selectedItems]);

  const selectedCount = selectedItems.length;

  const handleUpdateQuantity = async (
    productId: string,
    variantId: string | undefined,
    newQty: number,
  ) => {
    if (newQty < 1) return;
    const token = await getToken({ template: "my-backend" });
    dispatch(updateCartQuantity({ token, productId, variantId, newQty }));
  };

  const handleRemoveItem = async (productId: string, variantId?: string) => {
    const token = await getToken({ template: "my-backend" });
    dispatch(removeFromCart({ token, productId, variantId }));
    setSelectedItems((prev) => prev.filter((id) => id !== productId));
  };

  const handleContinueShopping = () => {
    handleCloseDrawer();
    navigate("/collections/all");
  };

  const handleCheckout = () => {
    if (selectedCount === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!");
      return;
    }
    const selectedProducts = cartProducts.filter((item) =>
      selectedItems.includes(item.productId),
    );
    localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));
    handleCloseDrawer();
    navigate("/checkout");
  };

  const handleDetailCart = () => {
    navigate("/cart");
    handleCloseDrawer();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[140] transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={handleCloseDrawer}
      />

      {/* Drawer */}
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
            onClick={handleCloseDrawer}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
          {cartLoading ? (
            <div className="space-y-4 mt-2">
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                  />
                ))}
            </div>
          ) : cartProducts.length > 0 ? (
            <>
              {/* Chọn tất cả */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b dark:border-gray-700">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={
                    selectedItems.length === cartProducts.length &&
                    cartProducts.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="w-5 h-5 accent-[#05472a] cursor-pointer"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer select-none"
                >
                  Chọn tất cả ({selectedCount}/{cartProducts.length} sản phẩm)
                </label>
              </div>

              <CartContents
                cart={{ products: cartProducts, totalPrice: totalAmount }}
                selectedItems={selectedItems}
                onToggleSelect={toggleSelectItem}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </>
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
        {/* {cartProducts.length > 0 && (
          <div className="p-5 bg-gray-50 dark:bg-gray-800 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Tổng cộng ({selectedCount} sản phẩm):
              </span>
              <span className="text-xl font-bold text-[#c91e2c] dark:text-red-400">
                {totalAmount.toLocaleString("vi-VN")}đ
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={selectedCount === 0}
                className={`w-full py-4 rounded-xl font-bold uppercase transition-all ${
                  selectedCount > 0
                    ? "bg-[#05472a] text-white hover:bg-[#0a2e1e]"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
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
        )} */}
        {/* Footer */}
        {cartProducts.length > 0 && (
          <div className="p-5 bg-gray-50 dark:bg-gray-800 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-600 dark:text-gray-400">
                Tổng cộng ({cartProducts.length} sản phẩm):
              </span>
              <span className="text-xl font-bold text-[#c91e2c] dark:text-red-400">
                {totalAllAmount.toLocaleString("vi-VN")}đ
              </span>
            </div>

            {/* {selectedCount > 0 && selectedCount < cartProducts.length && (
              <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                <span>Đã chọn ({selectedCount} sản phẩm):</span>
                <span className="font-medium">
                  {totalSelectedAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            )} */}

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={selectedCount === 0}
                className={`w-full py-4 rounded-xl font-bold uppercase transition-all ${
                  selectedCount > 0
                    ? "bg-[#05472a] text-white hover:bg-[#0a2e1e]"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
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
