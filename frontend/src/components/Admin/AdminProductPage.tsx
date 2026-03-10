import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Edit, Trash2, PlusCircle, Eye, Package, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import type { Product } from "../Products/InterfaceItem";

import axios from "axios";

// IMPORT COMPONENT 
import ProductDetailModal from "./AdminProductDetailModalPage"; 
import ProductEditModal from "./AdminProductEditModalPage";
import ProductAddModal from "./AdminProductAddModal";

const AdminProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State điều khiển modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // STATE BỘ LỌC (MỚI)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // logic chia trang
  const [currentPage, setCurrentPage] = useState(1);
  const productPerPage = 3;
  const [categories, setCategories] = useState<{name: string, code: string}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi song song cả 2 API để tối ưu tốc độ
        const [prodRes, catRes] = await Promise.all([
          axios.get("http://localhost:9001/api/products/all"),
          axios.get("http://localhost:9001/api/categories/all")
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
    fetchData();
  }, []);

  // Dữ liệu mẫu
  

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setLoading(true);
  //     setTimeout(() => {
  //       setProducts(mockProducts);
  //       setLoading(false);
  //     }, 500);
  //   };
  //   fetchProducts();
  // }, []);

  useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    /* LOGIC CŨ CỦA BẰNG
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
    */
    
    // KẾT NỐI THẬT:
    try {
      const response = await axios.get("http://localhost:9001/api/products/all");
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu từ Backend:", error);
      toast.error("Không thể tải danh sách nệm từ Server!");
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);
  
  // LOGIC LỌC DỮ LIỆU (QUAN TRỌNG)
  const filteredProducts = products.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category?.code === selectedCategory;
    return matchesName && matchesCategory;
  });

  // Tính toán chia trang dựa trên danh sách ĐÃ LỌC
  const totalPages = Math.ceil(filteredProducts.length / productPerPage);
  const indexOfLastProduct = currentPage * productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

const handleDelete = async (id: string) => {
  if (!window.confirm("Bạn có chắc muốn xóa không?")) return;
  if (!id) {
    toast.error("Lỗi: Không tìm thấy ID sản phẩm!"); // Đây là cái lỗi Bằng đang gặp nè
    return;
  }

  try {
    
    await axios.delete(`http://localhost:9001/api/products/delete/${id}`); 
    
    setProducts(products.filter(p => p.id !== id)); // Dùng _id để lọc lại state
    toast.success("Xóa thành công!");
  } catch (error) {
    console.error("Lỗi xóa:", error);
    toast.error("Server từ chối lệnh xóa!");
  }
  

  // --- PHẦN 2: XỬ LÝ FRONTEND (Để test giao diện ngay bây giờ) ---
  // Giữ nguyên logic ban đầu của Bằng để cập nhật bảng ngay lập tức
  // setProducts(products.filter(p => p._id !== id));
  // toast.success("Xóa thành công (Chế độ Preview)!");
};
  

  const handleViewDetail = (openProduct: Product) => {
    setSelectedProduct(openProduct);
    setIsDetailOpen(true);
  };

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
    const data = new FormData();
    data.append("product", new Blob([JSON.stringify(updatedProduct)], { type: "application/json" }));
    const response = await axios.put(
      `http://localhost:9001/api/products/update/${updatedProduct.id}`, 
      data, 
      { headers: { 'Content-Type': 'multipart/form-data' } } 
    );

    if (response.status === 200) {
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? response.data : p));
      toast.success("Cập nhật nệm Artisano thành công rực rỡ!");
      setIsEditOpen(false);
    }
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    toast.error("Server vẫn từ chối, Bằng kiểm tra lại tab Network nhé!");
  }
  };

  
// const handleSaveProduct = async (id: string, formData: FormData) => {
//   // --- PHẦN 1: KẾT NỐI BACKEND (Cmt lại để dành cho sau này) ---
//   /*
//   try {
//     // URL này đã khớp với cổng 9001 của Product Service
//     const response = await axios.put(`http://localhost:9001/api/products/update/${id}`, formData);

//     if (response.status === 200) {
//       toast.success("Cập nhật dữ liệu vào Database thành công!");
//       // Sau khi kết nối thật, dùng hàm này để đồng bộ dữ liệu chuẩn từ MongoDB
//       // fetchProducts(); 
//       setIsEditOpen(false);
//     }
//     return; 
//   } catch (error: any) {
//     console.error("Lỗi Backend Update:", error);
//     toast.error("Lỗi: Không thể cập nhật sản phẩm trên Server!");
//     return;
//   }
//   */

//   // --- PHẦN 2: XỬ LÝ FRONTEND (Cập nhật giao diện ngay lập tức để test) ---
//   try {
//     // 1. Trích xuất chuỗi JSON từ formData
//     const productDataRaw = formData.get('product');
//     if (!productDataRaw) {
//       console.error("Không tìm thấy key 'product' trong FormData");
//       return;
//     }

//     // Chuyển từ chuỗi sang Object để lấy name, price, brand... mới
//     const updatedData = JSON.parse(productDataRaw as string);
    
//     // 2. Lấy danh sách File ảnh mới (nếu Admin có chọn thay đổi ảnh)
//     const imageFiles = formData.getAll('imageFiles') as File[];

//     // 3. Cập nhật State để "file mẹ" đổi dữ liệu trên bảng
//     setProducts((prev) =>
//       prev.map((p) => {
//         // Kiểm tra khớp ID (Sử dụng cả p._id và p.id để tránh lỗi Interface)
//         if (p._id === id || p.id === id) {
          
//           // Logic xử lý ảnh: Có ảnh mới thì tạo link preview, không thì giữ ảnh cũ từ Cloudinary
//           const newImages = imageFiles.length > 0 
//             ? imageFiles.map((file, index) => ({
//                 url: URL.createObjectURL(file), // Link ảo để hiện ảnh ngay lập tức
//                 is_primary: index === 0
//               }))
//             : p.images;

//           // Trả về Object đã được cập nhật thông tin mới
//           return {
//             ...p,            // Giữ lại các trường không sửa (như productCode)
//             ...updatedData,  // Ghi đè thông tin mới từ Modal vào (name: "aaaaa", ...)
//             images: newImages,
//             updated_at: new Date().toISOString()
//           };
//         }
//         return p; // Những sản phẩm khác giữ nguyên
//       })
//     );

//     toast.success("Cập nhật thành công (Chế độ Preview)!");
//     setIsEditOpen(false); // Đóng Modal sửa sau khi lưu
//   } catch (error) {
//     console.error("Lỗi xử lý Frontend Preview:", error);
//     toast.error("Có lỗi xảy ra khi cập nhật hiển thị!");
//   }
// };

  // const handleAddProduct = (newProduct: Product) => {
  //   setProducts(prev => [newProduct, ...prev]);
  // };
const handleAddProduct = async (formData: FormData) => {
  // --- PHẦN 1: KẾT NỐI BACKEND (Đã comment lại để dành cho sau này) ---
 try {
    // 1. Gửi dữ liệu đi (Key đã là imageFiles như mình sửa ở Modal)
    const response = await axios.post("http://localhost:9001/api/products/add", formData);

    // 2. Chấp nhận mọi mã thành công từ 200-299
    if (response.status >= 200 && response.status < 300) {
      toast.success("Thêm nệm Artisano thành công rực rỡ!");
      
      // 3. QUAN TRỌNG: Gọi lại API lấy danh sách để đồng bộ ảnh từ Cloudinary về bảng
      const refresh = await axios.get("http://localhost:9001/api/products/all");
      setProducts(refresh.data); 
      
      setIsAddOpen(false);
    }
  } catch (error: any) {
    console.error("Lỗi thực sự:", error.response?.data || error.message);
    toast.error("Server đã lưu nhưng có lỗi hiển thị, Bằng hãy F5 thử xem!");
  }
  

  // --- PHẦN 2: XỬ LÝ FRONTEND (Để test giao diện mượt mà ngay bây giờ) ---
  // try {
  //   // 1. Trích xuất lại Object thông tin từ FormData
  //   const productBlob = formData.get('product') as Blob;
  //   const reader = new FileReader();

  //   reader.onload = () => {
  //     const productJson = JSON.parse(reader.result as string);
      
  //     // 2. Tạo URL preview cho các file ảnh để hiển thị lên bảng
  //     const imageFiles = formData.getAll('files') as File[];
  //     const previewImages = imageFiles.map((file, index) => ({
  //       url: URL.createObjectURL(file), // Link tạm để hiện ảnh ngay lập tức
  //       is_primary: index === 0
  //     }));

  //     // 3. Đóng gói thành Object Product hoàn chỉnh giống hệt cấu hình MongoDB
  //     const newProduct: Product = {
  //       ...productJson,
  //       _id: `temp-${Date.now()}`, // ID giả lập cho Frontend
  //       images: previewImages,
  //       created_at: new Date().toISOString(),
  //       updated_at: new Date().toISOString()
  //     };

  //     // 4. Cập nhật State để tấm nệm mới hiện lên đầu danh sách
  //     setProducts(prev => [newProduct, ...prev]);
      
  //     toast.success("Thêm thành công (Chế độ Xem trước)!");
  //     setIsAddOpen(false);
  //   };

  //   reader.readAsText(productBlob);
  // } catch (error) {
  //   console.error("Lỗi Preview:", error);
  //   toast.error("Lỗi hiển thị dữ liệu tạm thời!");
  // }
};

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Package className="text-emerald-600" /> Quản lý sản phẩm
            </h1>
           
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md active:scale-95"
          >
            <PlusCircle size={20} /> Thêm sản phẩm mới
          </button>
        </div>

        {/* BỘ LỌC (MỚI THÊM) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm hoặc mã SKU..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
              }}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm appearance-none cursor-pointer"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1); // Reset về trang 1 khi lọc
              }}
            >
              <option value="all">Tất cả danh mục</option>
              
              {categories.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-400 text-[12px] font-black tracking-[3px]">Đang tải dữ liệu...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* HIỂN THỊ KHI KHÔNG TÌM THẤY KẾT QUẢ */
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-20 text-center">
            <p className="text-gray-400 font-medium">Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
            <button 
              onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
              className="text-emerald-600 font-bold mt-2 hover:underline"
            >
              Xóa tất cả bộ lọc
            </button>
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
                      <td className="px-4 py-4 text-center text-sm font-bold text-gray-400">
                        {indexOfFirstProduct + index + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <img src={product.images?.[0]?.url} className="w-12 h-12 rounded-lg object-cover border" alt="" />
                          <div className="max-w-[250px]">
                            <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-medium text-emerald-700">
                        <span className="bg-emerald-50 px-2 py-1 rounded-md">{product.category?.name}</span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm font-black text-gray-900">
                        {product.price.toLocaleString("vi-VN")}₫
                        <p className={`text-[11px] mt-1 font-bold ${product.stockQuantity > 10 ? 'text-blue-500' : 'text-red-500'}`}>
                          Kho: {product.stockQuantity}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleViewDetail(product)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Eye size={16} /></button>
                          <button onClick={() => { setSelectedProduct(product); setIsEditOpen(true); }} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"><Edit size={16} /></button>
                          <button onClick={() => 
                          {
                            console.log("ID nhấn vào là:", product.id);
                            handleDelete(product.id);
                          }
                            } className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
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
            )}
          </>
        )}

        {/* MODALS */}
        <ProductDetailModal 
          isOpen={isDetailOpen} 
          onClose={() => setIsDetailOpen(false)} 
          product={selectedProduct} 
          onEdit={() => { setIsDetailOpen(false); setIsEditOpen(true); }}
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
    </>
  );
};

export default AdminProductPage;