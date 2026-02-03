/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../../Products/InterfaceItem";
import { toast } from "sonner"; // Sử dụng sonner để thông báo đẹp hơn alert

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    // 1. KIỂM TRA CÙNG LOẠI SẢN PHẨM (Sử dụng thuộc tính .code)
    // Dùng Optional Chaining (?.) để tránh lỗi nếu product bị thiếu category
    if (
      compareItems.length > 0 && 
      compareItems[0].category?.code !== product.category?.code
    ) {
      toast.error(`Chỉ có thể so sánh các sản phẩm cùng loại (${compareItems[0].category?.name})!`);
      return;
    }

    // 2. Kiểm tra trùng lặp
    if (compareItems.find((p) => p._id === product._id)) {
      toast.warning("Sản phẩm này đã có trong danh sách so sánh!");
      return;
    }

    // 3. Giới hạn 3 sản phẩm
    if (compareItems.length >= 3) {
      toast.info("Chỉ có thể so sánh tối đa 3 sản phẩm!");
      return;
    }

    setCompareItems([...compareItems, product]);
    toast.success("Đã thêm vào bảng so sánh");
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems(compareItems.filter((p) => p._id !== productId));
  };

  const clearCompare = () => setCompareItems([]);

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within a CompareProvider");
  return context;
};