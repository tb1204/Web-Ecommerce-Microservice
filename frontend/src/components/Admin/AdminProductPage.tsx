import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Edit, Trash2, PlusCircle, Eye, Package, ChevronLeft, ChevronRight 
} from "lucide-react";
//import { useAuth } from "@clerk/clerk-react";
import type { Product } from "../Products/InterfaceItem";
//import image_nem from "../../assets/about.webp";

// IMPORT COMPONENT 
import ProductDetailModal from "./AdminProductDetailModalPage"; 
import ProductEditModal from "./AdminProductEditModalPage";
import ProductAddModal from "./AdminProductAddModal";

const AdminProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  //const { getToken } = useAuth();

  // STATE ĐIỀU KHIỂN MODAL
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // LOGIC CHIA TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3; 

  // 1. DỮ LIỆU
  const mockProducts: Product[] = [
    { 
      _id: "69705ecc51b0eaa48fd14ae5", 
      name: "Nệm Cao Su Thiên Nhiên WolfBed Luxury", 
      sku: "WB-LUX-001",
      product_code: "MAT-2026-X1",
      brand: "WolfBed", 
      origin: "Việt Nam",
      category: { name: "Nệm", code: "nem-cao-su" }, 
      price: 15000000, 
      specifications: {
        material: "Cao su nguyên chất",
        weight: "35kg",
        dimensions: "180x200x15cm",
        firmness: "Medium Firm",
        design: "Công nghệ làm mát Hybrid",
        certification_number: "ISO-9001:2026-WB"
      },
      stock_quantity: 15, 
      status: "selling", 
      images: [{ url: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg", is_primary: true },
                { url: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg", is_primary: false }
      ], 
      tags: ["cao_cap", "ben_bi", "khang_khuan"],
      description: "Dòng nệm cao cấp nhất dành cho biệt thự và căn hộ hạng sang.",
      rating: 5, 
      reviewCount: 45 
    },
    { 
      _id: "69705ecc51b0eaa48fd14ae4", 
      name: "Topper Memory Foam Nâng Đỡ", 
      sku: "WB-TOP-002",
      product_code: "TOP-2026-M1",
      brand: "WolfBed", 
      origin: "Việt Nam",
      category: { name: "Topper", code: "topper" }, 
      price: 2160000, 
      specifications: {
        material: "Memory Foam",
        weight: "10kg",
        dimensions: "160x200x5cm",
        firmness: "Soft",
        design: "Ergonomic 7-zone",
        certification_number: "CERT-2026-TOP"
      },
      stock_quantity: 8, 
      status: "selling", 
      images: [{ url: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg", is_primary: true },
                { url: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg", is_primary: false }
      ], 
      tags: ["nem", "goi"],
      description: "Giải pháp gia tăng sự êm ái cho mọi loại nệm.",
      rating: 4.8, 
      reviewCount: 120 
    },
    { 
      _id: "69705ecc51b0eaa48fd14ae6", 
      name: "Topper Memory Foam Nâng Đỡ", 
      sku: "WB-TOP-002",
      product_code: "TOP-2026-M1",
      brand: "WolfBed", 
      origin: "Việt Nam",
      category: { name: "Topper", code: "topper" }, 
      price: 2160000, 
      specifications: {
        material: "Memory Foam",
        weight: "10kg",
        dimensions: "160x200x5cm",
        firmness: "Soft",
        design: "Ergonomic 7-zone",
        certification_number: "CERT-2026-TOP"
      },
      stock_quantity: 8, 
      status: "selling", 
      images: [{ url: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg", is_primary: true },
                { url: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg", is_primary: false }
      ], 
      tags: ["em_ai", "nang_do"],
      description: "Giải pháp gia tăng sự êm ái cho mọi loại nệm.",
      rating: 4.8, 
      reviewCount: 120 
    },
    { 
      _id: "69705ecc51b0eaa48fd14ae7", 
      name: "Topper Memory Foam Nâng Đỡ", 
      sku: "WB-TOP-002",
      product_code: "TOP-2026-M1",
      brand: "WolfBed", 
      origin: "Việt Nam",
      category: { name: "Topper", code: "topper" }, 
      price: 2160000, 
      specifications: {
        material: "Memory Foam",
        weight: "10kg",
        dimensions: "160x200x5cm",
        firmness: "Soft",
        design: "Ergonomic 7-zone",
        certification_number: "CERT-2026-TOP"
      },
      stock_quantity: 8, 
      status: "selling", 
      images: [{ url: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg", is_primary: true },
                { url: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg", is_primary: false }
      ], 
      tags: ["em_ai", "nang_do"],
      description: "Giải pháp gia tăng sự êm ái cho mọi loại nệm.",
      rating: 4.8, 
      reviewCount: 120 
    },
    { 
      _id: "69705ecc51b0eaa48fd14ae8", 
      name: "Topper Memory Foam Nâng Đỡ", 
      sku: "WB-TOP-002",
      product_code: "TOP-2026-M1",
      brand: "WolfBed", 
      origin: "Việt Nam",
      category: { name: "Topper", code: "topper" }, 
      price: 2160000, 
      specifications: {
        material: "Memory Foam",
        weight: "10kg",
        dimensions: "160x200x5cm",
        firmness: "Soft",
        design: "Ergonomic 7-zone",
        certification_number: "CERT-2026-TOP"
      },
      stock_quantity: 8, 
      status: "selling", 
      images: [{ url: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg", is_primary: true },
                { url: "https://cdn-media.sforum.vn/storage/app/media/anh-dep-82.jpg", is_primary: false }
      ], 
      tags: ["em_ai", "nang_do"],
      description: "Giải pháp gia tăng sự êm ái cho mọi loại nệm.",
      rating: 4.8, 
      reviewCount: 120 
    },
    
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setTimeout(() => {
        setProducts(mockProducts);
        setLoading(false);
      }, 500);
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Xác nhận xóa sản phẩm?")) return;
    setProducts(products.filter(p => p._id !== id));
    toast.success("Xóa thành công (Demo)");
  };

  // HÀM MỞ CHI TIẾT
  const handleViewDetail = (openProduct: Product) => {
    setSelectedProduct(openProduct);
    setIsDetailOpen(true);
  };

  //HÀM MỞ EDIT
  const handleSaveProduct = (updatedProduct: Product) => {
  setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
  setIsEditOpen(false);
  };

  //HÀM MỞ ADD
  const handleAddProduct = (newProduct: Product) => {
  setProducts(prev => [newProduct, ...prev]); // Đưa SP mới lên đầu danh sách
  };

  // TÍNH TOÁN DỮ LIỆU TRANG
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Package className="text-emerald-600" /> Quản lý Sản phẩm
          </h1>
          <p className="text-gray-500 mt-1">
            Hiển thị {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, products.length)} trên tổng {products.length} sản phẩm
          </p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-md active:scale-95"
        >
        <PlusCircle size={20} /> Thêm sản phẩm mới
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase w-16">STT</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Sản phẩm</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Danh mục</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Giá & Kho</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {currentProducts.map((product, index) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-center text-sm font-bold text-gray-400">
                      {indexOfFirstProduct + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={product.images[0]?.url} className="w-12 h-12 rounded-lg object-cover border" alt="" />
                        <div className="max-w-[200px]">
                          <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-emerald-700">
                       <span className="bg-emerald-50 px-2 py-1 rounded-md">{product.category?.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900">
                      {product.price.toLocaleString("vi-VN")}₫
                      <p className={`text-[11px] mt-1 font-bold ${product.stock_quantity > 10 ? 'text-blue-500' : 'text-red-500'}`}>
                        Kho: {product.stock_quantity}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleViewDetail(product)} 
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => { setSelectedProduct(product); setIsEditOpen(true); }}
                          className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                        <Edit size={16} />
                        </button>
                        
                        <button onClick={() => handleDelete(product._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* THANH ĐIỀU HƯỚNG CHIA TRANG */}
          <div className="flex justify-center items-center gap-4 pb-10">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-full bg-white border hover:bg-emerald-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all ${
                    currentPage === i + 1 ? "bg-emerald-600 text-white shadow-md" : "bg-white border text-gray-500"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-full bg-white border hover:bg-emerald-50 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}

     
      <ProductDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        product={selectedProduct} 
        onEdit={() => {
        setIsDetailOpen(false); // Tắt modal xem
        setIsEditOpen(true);    // Bật modal sửa
        }}
      />

      <ProductEditModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        product={selectedProduct} 
        onSave={handleSaveProduct}
      />

      <ProductAddModal 
      isOpen={isAddOpen} 
      onClose={() => setIsAddOpen(false)} 
      onAdd={handleAddProduct} 
      />

    </div>
    );
};

export default AdminProductPage;