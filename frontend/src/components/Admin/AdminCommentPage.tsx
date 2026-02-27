import { useState, useMemo, useEffect } from "react";
import {
  Star,
  Search,
  Trash2,
  MessageSquare,
  ChevronDown,
  Send,
  Eye,
  EyeOff,
  Edit2,
  X,
} from "lucide-react";

// --- INTERFACE ---
interface Comment {
  _id: string;
  product: { id: string; name: string; category: string };
  user: { id: string; username: string };
  rating: number;
  comment: string;
  images?: string[];
  adminReply?: { content: string; repliedAt: string };
  status: "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
}

// --- FAKE DATA (thêm 6 comment để test lọc) ---
const fakeComments: Comment[] = [
  {
    _id: "689a3687e0e543e98b5ba85d",
    product: {
      id: "prod_001",
      name: "Nệm Cao Su Thiên Nhiên",
      category: "Nệm",
    },
    user: {
      id: "user_001",
      username: "Duong Luu Thanh",
    },
    rating: 5,
    comment: "sp tốt, ngủ ngon cả đêm!",
    images: ["https://picsum.photos/200", "https://picsum.photos/200"],
    adminReply: {
      content: "Cảm ơn bạn! Chúc ngủ ngon!",
      repliedAt: "2025-08-12T14:15:38Z",
    },
    status: "rejected",
    createdAt: "2025-08-12T14:15:27Z",
  },
  {
    _id: "689a3687e0e543e98b5ba871",
    product: {
      id: "prod_nem_001", // cùng id sản phẩm
      name: "Nệm Cao Su Thiên Nhiên",
      category: "Nệm",
    },
    user: {
      id: "user_102",
      username: "Trần Thị B",
    },
    rating: 4,
    comment: "Nệm tốt, thoáng khí, không bị nóng. Chỉ hơi cao so với mong đợi.",
    images: ["https://picsum.photos/seed/nem3/200"],
    status: "approved",
    createdAt: "2025-08-26T10:15:00Z",
  },
  {
    _id: "689a3687e0e543e98b5ba872",
    product: {
      id: "prod_nem_001", // cùng id sản phẩm
      name: "Nệm Cao Su Thiên Nhiên",
      category: "Nệm",
    },
    user: {
      id: "user_103",
      username: "Lê Văn C",
    },
    rating: 3,
    comment:
      "Nệm hơi cứng hơn mình tưởng, nằm lâu bị mỏi. Có thể đổi size mềm hơn không shop?",
    adminReply: {
      content:
        "Chào anh C, cảm ơn phản hồi. Shop sẽ liên hệ để hỗ trợ đổi size phù hợp nhé!",
      repliedAt: "2025-08-27T11:45:00Z",
    },
    status: "rejected",
    createdAt: "2025-08-27T08:50:00Z",
  },
  {
    _id: "689a3687e0e543e98b5ba85e",
    product: {
      id: "prod_002",
      name: "Gối Ôm Cao Su",
      category: "Gối",
    },
    user: {
      id: "user_001",
      username: "Duong Luu Thanh",
    },
    rating: 5,
    comment: "Đẹp quá đi mất!! Đánh giá 5 sao luôn!!!",
    images: ["https://picsum.photos/201"],
    status: "approved",
    createdAt: "2025-08-16T15:03:01Z",
  },
  {
    _id: "689a3687e0e543e98b5ba85f",
    product: {
      id: "prod_003",
      name: "Bộ Chăn Ga Cotton 4 Mùa",
      category: "Chăn ga",
    },
    user: {
      id: "user_002",
      username: "Lan Anh",
    },
    rating: 4,
    comment: "Vải mát, màu sắc đẹp, rất đáng tiền.",
    status: "approved",
    createdAt: "2025-08-17T10:20:00Z",
  },
  {
    _id: "689a3687e0e543e98b5ba860",
    product: {
      id: "prod_004",
      name: "Nệm Lò Xo Liên Kết",
      category: "Nệm",
    },
    user: {
      id: "user_003",
      username: "Minh Tuấn",
    },
    rating: 2,
    comment: "Nệm hơi cứng, nằm lâu bị đau lưng.",
    adminReply: {
      content: "Cảm ơn phản hồi, shop sẽ kiểm tra lại.",
      repliedAt: "2025-08-18T09:00:00Z",
    },
    status: "approved",
    createdAt: "2025-08-18T08:45:00Z",
  },
  {
    _id: "689a3687e0e543e98b5ba861",
    product: {
      id: "prod_005",
      name: "Gối Chống Ngáy",
      category: "Gối",
    },
    user: {
      id: "user_004",
      username: "Thu Hà",
    },
    rating: 5,
    comment: "Gối chống ngáy hiệu quả, chồng ngủ ngon hơn.",
    images: ["https://picsum.photos/203"],
    status: "rejected",
    createdAt: "2025-08-19T13:30:00Z",
  },
  {
    _id: "689a3687e0e543e98b5ba862",
    product: {
      id: "prod_006",
      name: "Phụ Kiện Đệm Lót Sàn",
      category: "Phụ kiện",
    },
    user: {
      id: "user_005",
      username: "Văn Hải",
    },
    rating: 4,
    comment: "Đệm lót sàn dùng tốt cho trẻ nhỏ.",
    status: "approved",
    createdAt: "2025-08-20T11:15:00Z",
  },
  {
    _id: "689a3687e0e543e98b5ba863",
    product: {
      id: "prod_007",
      name: "Chăn Ga Cotton Silk",
      category: "Chăn ga",
    },
    user: {
      id: "user_006",
      username: "Thị Hương",
    },
    rating: 5,
    comment: "Chất liệu cao cấp, mát mẻ, rất đáng tiền.",
    status: "approved",
    createdAt: "2025-08-21T09:40:00Z",
  },
  {
    _id: "689a3687e0e543e98b5ba864",
    product: {
      id: "prod_008",
      name: "Gối Ôm Chữ U",
      category: "Gối",
    },
    user: {
      id: "user_007",
      username: "Bảo Ngọc",
    },
    rating: 1,
    comment: "Gối ôm bị xẹp sau 1 tuần sử dụng.",
    status: "rejected",
    createdAt: "2025-08-22T07:55:00Z",
  },
];

const AdminCommentPage = () => {
  const [comments, setComments] = useState<Comment[]>(fakeComments);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "approved" | "approved" | "rejected"
  >("all");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "Nệm" | "Chăn ga" | "Phụ kiện" | "Gối"
  >("all");
  const [filterProduct, setFilterProduct] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [tempReply, setTempReply] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Reset page khi lọc thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterCategory, filterProduct]);

  // Lấy danh sách sản phẩm theo danh mục đã chọn
  const productOptions = useMemo(() => {
    let filtered = comments;
    if (filterCategory !== "all") {
      filtered = filtered.filter((c) => c.product.category === filterCategory);
    }
    const productMap = new Map<string, number>();
    filtered.forEach((c) => {
      productMap.set(c.product.name, (productMap.get(c.product.name) || 0) + 1);
    });
    const options = Array.from(productMap.entries()).map(([name, count]) => ({
      value: name,
      label: `${name} (${count})`,
    }));
    return [
      { value: "all", label: `Tất cả sản phẩm (${filtered.length})` },
      ...options,
    ];
  }, [comments, filterCategory]);

  // Toggle hiển thị/ẩn bình luận (approved ↔ rejected)
  const handleToggleVisibility = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === id
          ? { ...c, status: c.status === "approved" ? "rejected" : "approved" }
          : c,
      ),
    );
  };
  // Lọc bình luận
  const filteredComments = useMemo(() => {
    return comments.filter((c) => {
      const matchSearch =
        c.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.comment.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      const matchCategory =
        filterCategory === "all" || c.product.category === filterCategory;
      const matchProduct =
        filterProduct === "all" || c.product.name === filterProduct;

      return matchSearch && matchStatus && matchCategory && matchProduct;
    });
  }, [comments, searchTerm, filterStatus, filterCategory, filterProduct]);

  // Phân trang
  const paginatedComments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredComments.slice(start, start + itemsPerPage);
  }, [filteredComments, currentPage]);

  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);

  // Cập nhật trạng thái (duyệt, từ chối, ẩn/hiện)
  const handleStatusUpdate = (id: string, status: "approved" | "rejected") => {
    setComments((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status } : c)),
    );
  };

  const handleSendReply = (id: string) => {
    if (!tempReply.trim()) return;
    setComments((prev) =>
      prev.map((c) =>
        c._id === id
          ? {
              ...c,
              adminReply: {
                content: tempReply,
                repliedAt: new Date().toISOString(),
              },
              status: "approved",
            }
          : c,
      ),
    );
    setReplyingId(null);
    setTempReply("");
  };

  return (
    <div className="p-6 bg-[#f8f9fa] min-h-screen font-sans text-[#333]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-4">
            Quản lý Bình luận & Đánh giá
          </h1>

          {/* Bộ lọc - giữ nguyên grid 4 cột */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-lg border border-gray-200">
            {/* Select trạng thái - ĐÃ SỬA CSS GIỐNG 2 SELECT KIA */}
            <div className="relative">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-xl bg-white font-medium text-gray-700 outline-none shadow-sm cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="approved">✅ Hoạt động</option>
                <option value="rejected">🚫 Đã ẩn</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>

            {/* Lọc danh mục - giữ nguyên */}
            <div className="relative">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-xl bg-white font-medium text-gray-700 outline-none shadow-sm cursor-pointer"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
              >
                <option value="Nệm">🛏️ Nệm</option>
                <option value="Chăn ga">🛌 Chăn ga</option>
                <option value="Phụ kiện">✨ Phụ kiện </option>
                <option value="Gối">☁️ Gối</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>

            {/* Lọc sản phẩm cụ thể - giữ nguyên */}
            <div className="relative">
              <select
                className="w-full appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-xl bg-white font-medium text-gray-700 outline-none shadow-sm cursor-pointer"
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
              >
                {productOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={16}
              />
            </div>

            {/* Search (nếu bạn muốn thêm vào grid) */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl bg-white text-sm outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Danh sách bình luận */}
        <div className="space-y-4">
          {paginatedComments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white rounded-lg border border-gray-200 p-5 relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Header: User & Rating */}
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-800">
                      {comment.user.username}
                    </span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < comment.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        comment.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {comment.status === "approved" ? "Hoạt động" : "Đã ẩn"}
                    </span>
                  </div>

                  {/* Comment Content */}
                  <p className="text-sm text-gray-700 mb-3">
                    {comment.comment}
                  </p>

                  {/* Images */}
                  {comment.images && (
                    <div className="flex gap-2 mb-4">
                      {comment.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                          alt="review"
                        />
                      ))}
                    </div>
                  )}

                  {/* Admin Reply Box */}
                  {comment.adminReply && (
                    <div className="bg-[#f0f7ff] p-3 rounded border-l-2 border-blue-400 mb-4 relative group">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-blue-600">
                          Trả lời từ Admin
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Nút chỉnh sửa reply */}
                          <button
                            onClick={() => {
                              setReplyingId(comment._id);
                              setTempReply(comment.adminReply?.content || "");
                            }}
                            className="text-gray-400 hover:text-blue-600 transition"
                            title="Chỉnh sửa trả lời"
                          >
                            <Edit2 size={16} />
                          </button>

                          {/* Nút xóa reply - ĐÃ SỬA SIZE & MÀU */}
                          <button
                            onClick={() => {
                              if (window.confirm("Xóa trả lời này?")) {
                                setComments((prev) =>
                                  prev.map((c) =>
                                    c._id === comment._id
                                      ? { ...c, adminReply: undefined }
                                      : c,
                                  ),
                                );
                              }
                            }}
                            className="text-gray-400 hover:text-red-600 transition"
                            title="Xóa trả lời"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-blue-800">
                        {comment.adminReply.content}
                      </p>
                      <span className="text-[10px] text-blue-400">
                        {new Date(comment.adminReply.repliedAt).toLocaleString(
                          "vi-VN",
                        )}
                      </span>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-[11px] text-gray-400 space-y-0.5 mt-2">
                    <p>
                      Sản phẩm: {comment.product.name} (
                      {comment.product.category})
                    </p>
                    <p>Người dùng: {comment.user.username}</p>
                    <p>
                      Ngày tạo:{" "}
                      {new Date(comment.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>

                {/* Nút thao tác */}
                <div className="flex gap-2 ml-4">
                  {/* Nút mắt - toggle hiển thị/ẩn */}
                  <button
                    onClick={() => handleToggleVisibility(comment._id)}
                    className="p-2 border rounded hover:bg-gray-50 text-gray-500 transition"
                    title={
                      comment.status === "approved"
                        ? "Ẩn bình luận"
                        : "Hiện lại bình luận"
                    }
                  >
                    {comment.status === "approved" ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>

                  {/* Nút Hiện lại / Ẩn (text button, giữ nguyên) */}
                  {comment.status === "rejected" ? (
                    <button
                      onClick={() =>
                        handleStatusUpdate(comment._id, "approved")
                      }
                      className="px-3 py-1 bg-[#00c853] text-white text-sm rounded hover:bg-green-600 transition"
                    >
                      Hiện lại
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleStatusUpdate(comment._id, "rejected")
                      }
                      className="px-4 py-1 border rounded text-sm hover:bg-gray-50"
                    >
                      Ẩn
                    </button>
                  )}

                  {/* Nút xóa bình luận */}
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Bạn có chắc chắn muốn xóa bình luận này của người dùng không?",
                        )
                      ) {
                        setComments((prev) =>
                          prev.filter((c) => c._id !== comment._id),
                        );
                      }
                    }}
                    className="p-2 bg-[#ff5252] text-white rounded hover:bg-red-600 transition"
                    title="Xóa bình luận"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Trả lời */}
              {!comment.adminReply && replyingId !== comment._id && (
                <button
                  onClick={() => setReplyingId(comment._id)}
                  className="mt-4 flex items-center gap-1 text-xs border rounded px-3 py-1.5 text-gray-600 hover:bg-gray-50"
                >
                  <MessageSquare size={14} /> Trả lời
                </button>
              )}

              {replyingId === comment._id && (
                <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                  <textarea
                    className="w-full p-2 text-sm border rounded outline-none focus:ring-1 focus:ring-blue-400"
                    rows={3}
                    placeholder="Viết phản hồi..."
                    value={tempReply}
                    onChange={(e) => setTempReply(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setReplyingId(null)}
                      className="text-xs text-gray-500 px-3"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => handleSendReply(comment._id)}
                      className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Send size={12} /> Gửi trả lời
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Trước
            </button>
            <span className="px-3 py-1 text-sm font-medium">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCommentPage;
