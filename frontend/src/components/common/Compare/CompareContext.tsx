/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Product } from "../../Products/InterfaceItem";
import { toast } from "sonner";

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  maxItems: number; // Thêm biến này để các component khác biết giới hạn hiện tại
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [maxItems, setMaxItems] = useState(4); // Mặc định là máy tính

  // Logic xác định giới hạn sản phẩm dựa trên kích thước màn hình
  useEffect(() => {
    const updateLimit = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setMaxItems(2); // Điện thoại: tối đa 2
      } else if (width < 1024) {
        setMaxItems(3); // Máy tính bảng: tối đa 3
      } else {
        setMaxItems(4); // Máy tính: tối đa 4
      }
    };

    updateLimit(); // Chạy lần đầu khi mount
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  const addToCompare = (product: Product) => {
    // 1. Kiểm tra cùng loại
    if (
      compareItems.length > 0 && 
      compareItems[0].category?.code !== product.category?.code
    ) {
      toast.error(`Chỉ có thể so sánh các sản phẩm cùng loại (${compareItems[0].category?.name})!`);
      return;
    }

    // 2. Kiểm tra trùng lặp
    if (compareItems.find((p) => p.id === product.id)) {
      toast.warning("Sản phẩm này đã có trong danh sách!");
      return;
    }

    // 3. KIỂM TRA GIỚI HẠN THEO THIẾT BỊ 
    if (compareItems.length >= maxItems) {
      //const deviceName = maxItems === 2 ? "điện thoại" : maxItems === 3 ? "máy tính bảng" : "máy tính";
      toast.info(`Bạn chỉ có thể so sánh tối đa ${maxItems} sản phẩm!`);
      return;
    }

    setCompareItems([...compareItems, product]);
    toast.success("Đã thêm vào bảng so sánh");
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems(compareItems.filter((p) => p.id !== productId));
  };

  const clearCompare = () => setCompareItems([]);

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare, maxItems }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within a CompareProvider");
  return context;
};