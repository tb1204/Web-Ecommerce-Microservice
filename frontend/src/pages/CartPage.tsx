import { useMemo, useEffect, useState } from "react";
import { Trash2, Plus, Minus, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useAuth } from "@clerk/clerk-react";
import { setCheckoutItems } from "../store/slices/cartSlice";
import {
  fetchCart,
  updateCartQuantity,
  removeFromCart,
} from "../store/slices/cartSlice";
import axios from "axios";
import { toast } from "sonner";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();

  const cartItems = useAppSelector((state) => state.cart.cart.products || []);
  const cartLoading = useAppSelector((state) => state.cart.loading);

  const [stockErrors, setStockErrors] = useState<any[]>([]);

  // ====================== KIỂM TRA STOCK ======================
  useEffect(() => {
    const validateStock = async () => {
      if (cartItems.length === 0) {
        setStockErrors([]);
        return;
      }

      try {
        const token = await getToken({ template: "my-backend" });

        const payload = {
          items: cartItems.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
          })),
        };

        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/products/validate-stock`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStockErrors([]);
      } catch (error: any) {
        if (error.response?.status === 400) {
          const errorsData = error.response.data;
          const errorsArray = Array.isArray(errorsData) ? errorsData : [errorsData];
          setStockErrors(errorsArray);
        } else {
          setStockErrors([]);
        }
      }
    };

    validateStock();
  }, [cartItems, getToken]);

  // ====================== LỌC SẢN PHẨM HỢP LỆ ======================
  const validCartItems = useMemo(() => {
    if (!stockErrors || stockErrors.length === 0) {
      return cartItems;
    }

    return cartItems.filter((item) => {
      const error = stockErrors.find((e: any) => {
        const productMatch = String(e.productId || "") === String(item.productId || "");
        const errorVariant = String(e.variantId || "").trim();
        const itemVariant = String(item.variantId || "").trim();
        const variantMatch = !errorVariant || errorVariant === itemVariant || errorVariant === "null";

        return productMatch && variantMatch;
      });

      if (!error) return true;

      const status = String(error.status || "").trim().toUpperCase();
      const isCritical = status === "OUT_OF_STOCK" || 
                        status === "STOPSELLING" || 
                        status.includes("STOP");

      return !isCritical; // Chỉ ẩn OUT_OF_STOCK và STOPSELLING
    });
  }, [cartItems, stockErrors]);

  // ====================== KIỂM TRA INSUFFICIENT STOCK ======================
  const hasInsufficientStock = useMemo(() => {
    return stockErrors.some((e: any) => 
      String(e.status || "").trim().toUpperCase() === "INSUFFICIENT_STOCK"
    );
  }, [stockErrors]);

  // Thông báo khi loại sản phẩm lỗi
  const removedCount = cartItems.length - validCartItems.length;
  useEffect(() => {
    if (removedCount > 0) {
      toast.warning(`Đã loại bỏ ${removedCount} sản phẩm hết hàng hoặc ngừng bán`, {
        duration: 5500,
      });
    }
  }, [removedCount]);

  // ====================== HÀM XỬ LÝ ======================
  const handleUpdateQuantity = async (
    productId: string,
    variantId: string | undefined,
    delta: number,
    currentQty: number,
  ) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    const token = await getToken({ template: "my-backend" });
    dispatch(updateCartQuantity({ token, productId, variantId, newQty }));
  };

  const handleRemoveItem = async (productId: string, variantId?: string) => {
    const token = await getToken({ template: "my-backend" });
    dispatch(removeFromCart({ token, productId, variantId }));
  };

  const handleCheckoutAll = () => {
    if (validCartItems.length === 0) {
      toast.error("Không có sản phẩm hợp lệ để thanh toán!");
      return;
    }

    if (hasInsufficientStock) {
      toast.error("Một số sản phẩm không đủ số lượng tồn kho!", {
        description: "Vui lòng giảm số lượng hoặc xóa sản phẩm đó trước khi thanh toán.",
        duration: 6000,
      });
      return;
    }

    dispatch(setCheckoutItems({ items: validCartItems, isBuyNow: false }));
    navigate("/checkout");
  };

  const totalPrice = useMemo(
    () => validCartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
    [validCartItems]
  );

  if (cartLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-10">
        <div className="max-w-6xl mx-auto space-y-4">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl h-32 animate-pulse" />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-10 font-sans text-[#333] dark:text-gray-200 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <nav className="text-xs mb-6 uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Trang chủ /{" "}
          <span className="text-black dark:text-white font-semibold">Giỏ hàng</span>
        </nav>

        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
          Giỏ hàng của bạn
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {validCartItems.length > 0 ? (
              validCartItems.map((item) => {
                const error = stockErrors.find((e: any) => 
                  String(e.productId || "") === String(item.productId || "") &&
                  (String(e.variantId || "") === String(item.variantId || "") || 
                   String(e.variantId || "") === "")
                );

                const status = error ? String(error.status || "").trim().toUpperCase() : "";
                const isInsufficient = status === "INSUFFICIENT_STOCK";
                const remainingStock = error?.remainingStock || error?.currentStock || "ít";

                return (
                  <div
                    key={`${item.productId}-${item.variantId || ""}`}
                    className={`bg-white dark:bg-gray-800 border rounded-xl p-4 flex gap-5 shadow-sm transition-colors ${
                      isInsufficient 
                        ? "border-red-400 bg-yellow-50 dark:bg-yellow-950/30" 
                        : "border-gray-100 dark:border-gray-700"
                    }`}
                  >
                    <img
                      src={item.image || ""}
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-lg bg-gray-100 dark:bg-gray-700"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg leading-tight mb-1 text-gray-900 dark:text-gray-100">
                            {item.name}
                          </h3>
                          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                            {item.size && <p>Kích thước: {item.size}</p>}
                            {item.color ? (
                              <p>Màu sắc: {item.color}</p>
                            ) : (
                              item.thickness && <p>Độ dày: {item.thickness}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.productId, item.variantId)}
                          className="text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      {/* Cảnh báo thiếu hàng */}
                      {isInsufficient && (
                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                           Chỉ còn <strong>{remainingStock}</strong> sản phẩm. 
                          Vui lòng giảm số lượng trước khi thanh toán.
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap justify-between items-end gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400 dark:text-gray-500">Giá:</span>
                            <span className="font-bold text-red-400">
                              {item.price.toLocaleString("vi-VN")}₫
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-400 dark:text-gray-500">Số lượng:</span>
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.variantId, -1, item.quantity)}
                                className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 border-r dark:border-gray-600"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-4 py-1 font-semibold min-w-[40px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.productId, item.variantId, 1, item.quantity)}
                                disabled={isInsufficient}
                                className={`px-3 py-1 border-l dark:border-gray-600 transition-colors ${
                                  isInsufficient 
                                    ? "opacity-50 cursor-not-allowed" 
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-gray-400 dark:text-gray-500 text-xs block mb-1">Tổng cộng:</span>
                          <span className="font-bold text-red-400 text-lg">
                            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border">
                <p className="text-gray-500">
                  {cartItems.length > 0 
                    ? "Tất cả sản phẩm trong giỏ đã hết hàng hoặc ngừng bán." 
                    : "Giỏ hàng của bạn đang trống."}
                </p>
              </div>
            )}
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-10">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Tổng tiền sản phẩm:</span>
                  <span className="text-2xl font-black text-red-400">
                    {totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>

                {totalPrice > 3000000 && (
                  <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border border-green-100 dark:border-green-800">
                    <p className="text-xs text-green-700 dark:text-green-400 leading-relaxed">
                       Đơn hàng của bạn đã đủ điều kiện <strong>miễn phí vận chuyển</strong>!
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleCheckoutAll}
                disabled={validCartItems.length === 0 || hasInsufficientStock}
                className="w-full bg-[#004225] text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-900 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Thanh toán ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <button className="bg-[#004225] w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
          <Phone size={24} fill="white" />
        </button>
      </div>
    </div>
  );
};

export default CartPage;