

//test xóa sản phẩm khi thanh toán thành công
import { useState, useMemo, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CartContents, { type CartProduct } from "../Cart/CartContents";
import { setCheckoutItems } from "../../store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useAuth } from "@clerk/clerk-react";
import {
  fetchCart,
  updateCartQuantity,
  removeFromCart,
} from "../../store/slices/cartSlice";
import { closeCartDrawer } from "../../store/slices/uiSlice";
import { selectIsCartDrawerOpen } from "../../store/selectors";

// ✅ Helper tạo key giống CartContents
const getItemKey = (productId: string, variantId?: string) =>
  `${productId}::${variantId ?? ""}`;

function CartDrawer() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();

  const drawerOpen = useAppSelector(selectIsCartDrawerOpen);
  const cartItemsRaw = useAppSelector(
    (state) => state.cart?.cart?.products ?? [],
  );
  const cartLoading = useAppSelector((state) => state.cart.loading);

  // const cartProducts: CartItem[] = cartItemsRaw.map((item) => ({
  //   productId: item.productId,
  //   variantId: item.variantId,
  //   name: item.name,
  //   price: Number(item.price) || 0,
  //   quantity: Number(item.quantity) || 0,
  //   image: item.image,
  //   size: item.size,
  //   thickness: item.thickness,
  //   color: item.color,
  // }));
  const cartProducts: CartProduct[] = cartItemsRaw.map((item) => ({
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
  // ✅ selectedItems dùng key "productId::variantId" giống CartContents
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const totalAllAmount = useMemo(() => {
    return cartProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [cartProducts]);

  const totalSelectedAmount = useMemo(() => {
    return cartProducts
      .filter((item) =>
        selectedItems.includes(getItemKey(item.productId, item.variantId)),
      )
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartProducts, selectedItems]);

  useEffect(() => {
    if (drawerOpen) {
      getToken({ template: "my-backend" }).then((token) => {
        dispatch(fetchCart(token));
      });
    }
  }, [drawerOpen]);

  // Reset selection khi cart thay đổi (xóa item)
  useEffect(() => {
    const validKeys = cartProducts.map((item) =>
      getItemKey(item.productId, item.variantId),
    );
    setSelectedItems((prev) => prev.filter((key) => validKeys.includes(key)));
  }, [cartItemsRaw]);

  const handleCloseDrawer = () => dispatch(closeCartDrawer());

  // ✅ toggle dùng key composite
  const toggleSelectItem = (key: string) => {
    setSelectedItems((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key],
    );
  };

  const toggleSelectAll = () => {
    const allKeys = cartProducts.map((item) =>
      getItemKey(item.productId, item.variantId),
    );
    if (selectedItems.length === cartProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allKeys);
    }
  };

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
    // Xóa key tương ứng khỏi selectedItems
    const key = getItemKey(productId, variantId);
    setSelectedItems((prev) => prev.filter((id) => id !== key));
  };

  const handleContinueShopping = () => {
    handleCloseDrawer();
    navigate("/collections/all");
  };

  // ✅ Fix lỗi 1 + 3: map key composite → CartProduct để dispatch
  const handleCheckout = () => {
    if (selectedCount === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!");
      return;
    }

    // ✅ Lọc đúng sản phẩm dựa vào key composite
    const selectedProducts = cartProducts.filter((item) =>
      selectedItems.includes(getItemKey(item.productId, item.variantId)),
    );

    dispatch(setCheckoutItems({ items: selectedProducts, isBuyNow: false }));
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
                cart={{
                  products: cartProducts,
                  totalPrice: totalSelectedAmount,
                }}
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
        {cartProducts.length > 0 && (
          <div className="p-5 bg-gray-50 dark:bg-gray-800 border-t">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Tổng tất cả ({cartProducts.length} sp):
              </span>
              <span className="font-bold text-gray-700 dark:text-gray-300">
                {totalAllAmount.toLocaleString("vi-VN")}đ
              </span>
            </div>

            {selectedCount > 0 && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Đã chọn ({selectedCount} sp):
                </span>
                <span className="font-bold text-red-600 dark:text-red-400 text-lg">
                  {totalSelectedAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={selectedCount === 0}
                className={`w-full py-4 rounded-xl font-bold uppercase transition-all ${
                  selectedCount > 0
                    ? "bg-[#05472a] text-white hover:bg-[#0a2e1e]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {selectedCount > 0
                  ? `Thanh toán (${selectedCount} sản phẩm)`
                  : "Chọn sản phẩm để thanh toán"}
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
