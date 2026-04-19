//fix lỗi chọn 1sp nhưng bị click nhiều sản phẩm cùng tên
import { RiDeleteBin3Line } from "react-icons/ri";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

export interface CartProduct {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  thickness?: string;
  color?: string;
}

export interface Cart {
  products: CartProduct[];
  totalPrice: number;
}

interface CartContentsProps {
  cart: Cart;
  selectedItems: string[];
  stockErrors?: any[];
  onToggleSelect: (key: string) => void;
  onUpdateQuantity: (
    productId: string,
    variantId: string | undefined,
    newQty: number,
  ) => void;
  onRemoveItem: (productId: string, variantId: string | undefined) => void;
}

// Helper tạo unique key cho mỗi cart item
const getItemKey = (productId: string, variantId?: string) =>
  `${productId}::${variantId ?? ""}`;

const CartContents = ({
  cart,
  selectedItems,
  stockErrors = [],
  onToggleSelect,
  onUpdateQuantity,
  onRemoveItem,
}: CartContentsProps) => {
  const renderProductSpecs = (product: CartProduct) => {
    return (
      <div className="text-xs text-gray-500 mt-1 space-y-0.5">
        {product.size && <p>Kích thước: {product.size}</p>}
        {product.color ? (
          <p>Màu sắc: {product.color}</p>
        ) : (
          product.thickness && <p>Độ dày: {product.thickness}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {cart.products && cart.products.length > 0 ? (
        cart.products.map((product, index) => {
          // ✅ SỬA: dùng composite key
          const itemKey = getItemKey(product.productId, product.variantId);
          const isSelected = selectedItems.includes(itemKey);
          // Tìm lỗi dựa trên productId và variantId
          const error = stockErrors.find(e => 
              e.productId === product.productId && e.variantId === product.variantId
          );
          // Phân loại trạng thái để khóa UI
          const isOutOfStock = error?.status === "OUT_OF_STOCK";
          const isStopSelling = error?.status === "stopselling";
          const isDisabled = isOutOfStock || isStopSelling; // Khóa nếu rơi vào 2 case này

          return (
            <div
              key={itemKey}
              // className="bg-white dark:bg-transparent flex items-start gap-4 py-5 border-b dark:border-gray-800 last:border-0"
              className={`flex items-start gap-4 py-5 border-b dark:border-gray-800 last:border-0 transition-all ${
                isDisabled ? "opacity-50 grayscale" : "opacity-100"
              }`}
            >
              <div className="pt-2">
                <input
                  type="checkbox"
                  checked={isSelected && !isDisabled}
                  disabled={isDisabled}
                  onChange={() => onToggleSelect(itemKey)} // ✅ SỬA
                  // className="w-5 h-5 accent-[#05472a] cursor-pointer rounded"
                  className="w-5 h-5 accent-[#05472a] cursor-pointer rounded disabled:cursor-not-allowed"
                />
              </div>

              {/* <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-xl shadow-sm border dark:border-gray-700"
              /> */}
              <div className="relative">
                <img src={product.image} className="w-24 h-24 object-cover rounded-xl border" />
                {/* Hiển thị Badge đè lên ảnh cho chuyên nghiệp */}
                {isOutOfStock && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-[10px] font-bold uppercase rounded-xl">
                    Hết hàng
                  </span>
                )}
                {isStopSelling && (
                  <span className="absolute inset-0 flex items-center justify-center bg-red-600/60 text-white text-[10px] font-bold uppercase rounded-xl text-center p-1">
                    Ngừng bán
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between self-stretch">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <button
                      onClick={() =>
                        onRemoveItem(product.productId, product.variantId)
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Xóa sản phẩm"
                    >
                      <RiDeleteBin3Line size={20} />
                    </button>
                  </div>

                  {renderProductSpecs(product)}

                  <p className="font-bold text-red-600 dark:text-red-400 text-lg mt-2">
                    {product.price.toLocaleString("vi-VN")} đ
                  </p>

                  {/* moi them- */}
                  {error && (
                    <p className="text-red-500 text-[11px] font-semibold mt-1 animate-pulse">
                      {isStopSelling ? "Thông báo: " : "Lưu ý: "}
                      {error.message}
                    </p>
                  )}
                </div>

                {!isDisabled && (
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden h-8">
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          product.productId,
                          product.variantId,
                          product.quantity - 1,
                        )
                      }
                      className="px-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400"
                      disabled={product.quantity <= 1}
                    >
                      <AiOutlineMinus size={14} />
                    </button>
                    <span className="px-4 text-sm font-semibold border-x dark:border-gray-700 min-w-[40px] text-center">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          product.productId,
                          product.variantId,
                          product.quantity + 1,
                        )
                      }
                      className="px-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400"
                    >
                      <AiOutlinePlus size={14} />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 uppercase block leading-none">
                      Thành tiền
                    </span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      {(product.price * product.quantity).toLocaleString(
                        "vi-VN",
                      )}{" "}
                      đ
                    </span>
                  </div>
                </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
        </div>
      )}
    </div>
  );
};

export default CartContents;
