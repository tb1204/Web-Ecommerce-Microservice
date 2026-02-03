import { RiDeleteBin3Line } from "react-icons/ri";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

// Tự định nghĩa interface ngay tại đây
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
  userId?: string | null;
  guestId?: string;
  onUpdateQuantity: (
    productId: string,
    variantId: string | undefined,
    newQty: number,
  ) => void;
  onRemoveItem: (productId: string, variantId: string | undefined) => void;
}

const CartContents = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
}: CartContentsProps) => {
  // Hàm bổ trợ để kiểm tra loại sản phẩm dựa trên tên hoặc dữ liệu có sẵn
  const renderProductSpecs = (product: CartProduct) => {
    // Logic: Nếu tên có chữ "ga" hoặc "set" thì coi là bộ ga (hiện màu), ngược lại hiện độ dày
    const isBeddingSet =
      product.name.toLowerCase().includes("ga") ||
      product.name.toLowerCase().includes("set");

    return (
      <div className="text-xs text-gray-500 mt-1 space-y-0.5">
        {product.size && <p>Kích thước: {product.size}</p>}

        {isBeddingSet
          ? product.color && <p>Màu sắc: {product.color}</p>
          : product.thickness && <p>Độ dày: {product.thickness}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {cart.products && cart.products.length > 0 ? (
        cart.products.map((product, index) => (
          <div
            key={`${product.productId}-${product.variantId || index}`}
            className="bg-white dark:bg-transparent flex items-start gap-4 py-5 border-b dark:border-gray-800 last:border-0"
          >
            {/* Ảnh sản phẩm */}
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-xl shadow-sm border dark:border-gray-700"
            />

            {/* Thông tin sản phẩm */}
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

                {/* Hiển thị thông số theo loại (Màu sắc hoặc Độ dày) */}
                {renderProductSpecs(product)}

                {/* Giá sản phẩm (Thẻ p nằm dưới tên như yêu cầu) */}
                <p className="font-bold text-[#c91e2c] text-lg mt-2">
                  {product.price.toLocaleString("vi-VN")} đ
                </p>
              </div>

              {/* Bộ điều khiển số lượng và Thành tiền */}
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
                    {(product.price * product.quantity).toLocaleString("vi-VN")}{" "}
                    đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
        </div>
      )}
    </div>
  );
};

export default CartContents;
