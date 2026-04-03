import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import type { Product } from "../Products/InterfaceItem";
import axios from "axios";

// IMPORT COMPONENT
import ProductDetailModal from "./AdminProductDetailModalPage";
import ProductEditModal from "./AdminProductEditModalPage";
import ProductAddModal from "./AdminProductAddModal";

const AdminProductPage = () => {
  const PRODUCT_API_URL = "http://localhost:8082";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State điều khiển modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // STATE BỘ LỌC
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // logic chia trang
  const [currentPage, setCurrentPage] = useState(1);
  const productPerPage = 8;
  const [categories, setCategories] = useState<any[]>([]);

  // Hàm load dữ liệu từ Server
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get(`${PRODUCT_API_URL}/api/products/all`),
        axios.get(`${PRODUCT_API_URL}/api/categories/all`),
      ]);

      if (prodRes.status === 200) setProducts(prodRes.data);
      if (catRes.status === 200) setCategories(catRes.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      toast.error("Không thể kết nối với Server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // LOGIC LỌC DỮ LIỆU
  const filteredProducts = products.filter((p) => {
    const matchesName = p.name ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const matchesSku = p.variants?.some((v) =>
      v.sku && typeof v.sku === 'string' && v.sku.toLowerCase().includes(searchTerm.toLowerCase())
    ) || false;
    const matchesCategory = selectedCategory === "all" || p.category?.code === selectedCategory;

    return (matchesName || matchesSku) && matchesCategory;
  });

  // Tính toán chia trang
  const totalPages = Math.ceil(filteredProducts.length / productPerPage);
  const indexOfLastProduct = currentPage * productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
    try {
      await axios.delete(`${PRODUCT_API_URL}/api/products/delete/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi xóa:", error);
      toast.error("Không thể xóa sản phẩm!");
    }
  };

  // --- HÀM LƯU (EDIT) - KHỚP VỚI MODAL EDIT ---
  const handleSaveProduct = async (formDataPayload: any) => {
    const productId = selectedProduct?.id;
    if (!productId) return;

    try {
      const response = await axios.put(
        `${PRODUCT_API_URL}/api/products/update/${productId}`,
        formDataPayload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        setProducts(prev => prev.map(p => p.id === productId ? response.data : p));
        toast.success("Cập nhật sản phẩm thành công!");
        setIsEditOpen(false);
      }
    } catch (error: any) {
      console.error("Lỗi cập nhật:", error.response?.data || error.message);
      toast.error("Cập nhật thất bại, vui lòng kiểm tra lại!");
    }
  };

  // --- HÀM THÊM MỚI (ADD) - KHỚP VỚI MODAL ADD ---
  const handleAddProduct = async (formData: FormData) => {
    try {
      const response = await axios.post(
        `${PRODUCT_API_URL}/api/products/add`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success("Thêm sản phẩm thành công!");
        fetchData(); // Tải lại danh sách để cập nhật dữ liệu mới nhất
        setIsAddOpen(false);
      }
    } catch (error: any) {
      console.error("Lỗi thêm mới:", error.response?.data || error.message);
      toast.error("Thêm sản phẩm thất bại!");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Package className="text-emerald-600" /> Quản lý sản phẩm
        </h1>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md active:scale-95"
        >
          <PlusCircle size={20} /> Thêm sản phẩm mới
        </button>
      </div>

      {/* BỘ LỌC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-emerald-500 outline-none shadow-sm appearance-none cursor-pointer"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.filter(c => !c.parentCode).map(parent => (
              <optgroup key={parent.code} label={parent.name}>
                {categories.filter(sub => sub.parentCode === parent.code).map(sub => (
                  <option key={sub.code} value={sub.code}>{sub.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* HIỂN THỊ DỮ LIỆU */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="font-bold tracking-widest uppercase text-xs">Đang tải dữ liệu...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-20 text-center">
          <p className="text-gray-400 font-medium">Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
          <button onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }} className="text-emerald-600 font-bold mt-2 hover:underline">Xóa bộ lọc</button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase w-16">STT</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Sản phẩm</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase">Danh mục</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase">Giá & Kho</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {currentProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-center text-sm font-bold text-gray-400">{indexOfFirstProduct + index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <img src={product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url} className="w-12 h-12 rounded-lg object-cover border" alt="" />
                        <div className="max-w-[250px]">
                          <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">{product.productCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-medium text-emerald-700">
                      <span className="bg-emerald-50 px-2 py-1 rounded-md text-xs">
                        {product.category?.parentName ? `${product.category.parentName} > ` : ""}{product.category?.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-black text-gray-900">
                      {product.price?.toLocaleString("vi-VN")}₫
                      <p className={`text-[10px] mt-1 font-bold ${product.totalStockQuantity > 10 ? "text-blue-500" : "text-red-500"}`}>Kho: {product.totalStockQuantity}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => { setSelectedProduct(product); setIsDetailOpen(true); }} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={16} /></button>
                        <button onClick={() => { setSelectedProduct(product); setIsEditOpen(true); }} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pb-10">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-full bg-white border hover:bg-emerald-50 disabled:opacity-30"><ChevronLeft size={20} /></button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1 ? "bg-emerald-600 text-white shadow-md" : "bg-white border text-gray-500"}`}>{i + 1}</button>
                ))}
              </div>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-full bg-white border hover:bg-emerald-50 disabled:opacity-30"><ChevronRight size={20} /></button>
            </div>
          )}
        </>
      )}

      {/* MODALS */}
      <ProductDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} product={selectedProduct} onEdit={() => { setIsDetailOpen(false); setIsEditOpen(true); }} />
      <ProductEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} product={selectedProduct} onSave={handleSaveProduct} />
      <ProductAddModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAddProduct} />
    </div>
  );
};

export default AdminProductPage;