// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import {
//   Edit,
//   Trash2,
//   PlusCircle,
//   Eye,
//   CheckCircle2,
//   XCircle,
// } from "lucide-react";

// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import { toast } from "sonner";
// // import { Edit, Trash2, PlusCircle, CheckCircle2, XCircle } from "lucide-react";

// // interface Membership {
// //   tier_name: string;
// //   discount_rate?: number;
// // }

// interface User {
//   id: string;
//   clerkId: string;
//   email: string;
//   username?: string;
//   firstName: string;
//   lastName: string;
//   phone?: string;
//   gender?: "male" | "female" | "other";
//   roles: string[];
//   isActive: boolean;
//   membership?: Membership;
//   createdAt?: string;
//   updatedAt?: string;
//   // Nếu có thêm trường địa chỉ hoặc các trường khác trong DB, thêm vào đây
// }

// // interface User {
// //   id: string;
// //   clerkId: string;
// //   email: string;
// //   username?: string;
// //   firstName: string;
// //   lastName: string;
// //   phone?: string;
// //   gender?: "male" | "female" | "other";
// //   roles: string[];
// //   isActive: boolean;
// //   membership?: Membership;
// //   createdAt?: string;
// //   updatedAt?: string;
// // }

// // const AdminUsersPage = () => {
// //   const [users, setUsers] = useState<User[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
// //   const [editingUser, setEditingUser] = useState<User | null>(null);
// //   const [modalMode, setModalMode] = useState<"create" | "edit">("edit");

//   // Modal chi tiết user
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   const [formData, setFormData] = useState<Partial<User>>({
//     email: "",
//     firstName: "",
//     lastName: "",
//     phone: "",
//     gender: undefined,
//     roles: [],
//     membership: undefined,
//     isActive: true,
//   });

// //   const [formData, setFormData] = useState<Partial<User>>({
// //     email: "",
// //     firstName: "",
// //     lastName: "",
// //     phone: "",
// //     gender: undefined,
// //     roles: [],
// //     membership: undefined,
// //     isActive: true,
// //   });

// //   const getAuthHeader = () => {
// //     const token = localStorage.getItem("adminToken") || "";
// //     return token ? { Authorization: `Bearer ${token}` } : {};
// //   };

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await axios.get("http://localhost:8080/api/admin/users", {
//           headers: getAuthHeader(),
//         });
//         const data = Array.isArray(res.data) ? res.data : [];
//         setUsers(data);
//       } catch (err: unknown) {
//         const msg = axios.isAxiosError(err)
//           ? err.response?.data?.message || "Không tải được danh sách người dùng"
//           : "Lỗi kết nối đến server";
//         setError(msg);
//         toast.error(msg);
//       } finally {
//         setLoading(false);
//       }
//     };

// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       setLoading(true);
// //       setError(null);
// //       try {
// //         const res = await axios.get("http://localhost:8080/api/admin/users", {
// //           headers: getAuthHeader(),
// //         });
// //         setUsers(res.data as User[]);
// //       } catch (err: unknown) {
// //         const msg = axios.isAxiosError(err)
// //           ? err.response?.data?.message || "Không tải được danh sách"
// //           : "Lỗi hệ thống";
// //         setError(msg);
// //         toast.error(msg);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchUsers();
// //   }, []);

//   const refreshUsers = async () => {
//     try {
//       const res = await axios.get("http://localhost:8080/api/admin/users", {
//         headers: getAuthHeader(),
//       });
//       const data = Array.isArray(res.data) ? res.data : [];
//       setUsers(data);
//     } catch (err) {
//       console.error("Refresh failed", err);
//     }
//   };
// //   const refreshUsers = async () => {
// //     const fetchUsers = async () => {
// //       try {
// //         const res = await axios.get("/api/admin/users", {
// //           headers: getAuthHeader(),
// //         });
// //         setUsers(res.data as User[]);
// //       } catch (err) {
// //         console.error("Refresh failed", err);
// //       }
// //     };
// //     fetchUsers();
// //   };

// //   const handleEdit = (user: User) => {
// //     setEditingUser(user);
// //     setModalMode("edit");
// //     setFormData({
// //       email: user.email,
// //       firstName: user.firstName,
// //       lastName: user.lastName,
// //       phone: user.phone,
// //       gender: user.gender,
// //       roles: [...user.roles],
// //       membership: user.membership,
// //       isActive: user.isActive,
// //     });
// //     setIsModalOpen(true);
// //   };

//   const handleViewDetail = (user: User) => {
//     setSelectedUser(user);
//     setIsDetailModalOpen(true);
//   };

//   const handleCreate = () => {
//     setEditingUser(null);
//     setModalMode("create");
//     setFormData({
//       email: "",
//       firstName: "",
//       lastName: "",
//       phone: "",
//       gender: undefined,
//       roles: [],
//       membership: undefined,
//       isActive: true,
//     });
//     setIsModalOpen(true);
//   };

// //   const handleCloseModal = () => {
// //     setIsModalOpen(false);
// //   };

//   const handleCloseDetailModal = () => {
//     setIsDetailModalOpen(false);
//     setSelectedUser(null);
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

// //   const handleRolesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const selected = Array.from(
// //       e.target.selectedOptions,
// //       (option) => option.value,
// //     );
// //     setFormData((prev) => ({ ...prev, roles: selected }));
// //   };

// //   const handleMembershipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     const value = e.target.value;
// //     setFormData((prev) => ({
// //       ...prev,
// //       membership: value ? { tier_name: value } : undefined,
// //     }));
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (!formData.email || !formData.firstName || !formData.lastName) {
// //       toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
// //       return;
// //     }

//     try {
//       if (modalMode === "edit" && editingUser) {
//         await axios.patch(
//           `http://localhost:8080/api/admin/users/${editingUser.clerkId}`,
//           formData,
//           { headers: getAuthHeader() },
//         );
//         toast.success("Cập nhật thành công");
//       } else {
//         await axios.post("http://localhost:8080/api/admin/users", formData, {
//           headers: getAuthHeader(),
//         });
//         toast.success("Tạo thành công");
//       }
//       setIsModalOpen(false);
//       refreshUsers();
//     } catch (err: unknown) {
//       const msg = axios.isAxiosError(err)
//         ? err.response?.data?.message || "Thao tác thất bại"
//         : "Lỗi hệ thống";
//       toast.error(msg);
//     }
//   };

//   const handleToggleActive = async (user: User, checked: boolean) => {
//     try {
//       await axios.patch(
//         `http://localhost:8080/api/admin/users/${user.clerkId}`,
//         { isActive: checked },
//         { headers: getAuthHeader() },
//       );
//       toast.success("Cập nhật trạng thái thành công");
//       refreshUsers();
//     } catch (err: unknown) {
//       const msg = axios.isAxiosError(err)
//         ? err.response?.data?.message || "Cập nhật thất bại"
//         : "Lỗi hệ thống";
//       toast.error(msg);
//     }
//   };

//   const handleDelete = async (user: User) => {
//     if (!window.confirm(`Xác nhận xóa ${user.email}?`)) return;
//     try {
//       await axios.delete(
//         `http://localhost:8080/api/admin/users/${user.clerkId}`,
//         { headers: getAuthHeader() },
//       );
//       toast.success("Xóa thành công");
//       refreshUsers();
//     } catch (err: unknown) {
//       const msg = axios.isAxiosError(err)
//         ? err.response?.data?.message || "Xóa thất bại"
//         : "Lỗi hệ thống";
//       toast.error(msg);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Quản lý Người dùng</h1>
//         <button
//           onClick={handleCreate}
//           className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//         >
//           <PlusCircle size={20} />
//           Thêm người dùng
//         </button>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//           <p className="mt-4 text-gray-600">Đang tải danh sách người dùng...</p>
//         </div>
//       ) : !users || users.length === 0 ? (
//         <div className="text-center py-20 text-gray-500">
//           Chưa có người dùng nào trong hệ thống
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Hạng thành viên
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Username
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Roles
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Trạng thái
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Hành động
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {users.map((user) => (
//                 <tr
//                   key={user.clerkId}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {user.email}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                     {user.membership?.tier_name || "Không có"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                     {user.username || "—"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex flex-wrap gap-1.5">
//                       {user.roles.map((role) => (
//                         <span
//                           key={role}
//                           className={`px-2.5 py-1 text-xs font-medium rounded-full ${
//                             role === "ADMIN"
//                               ? "bg-red-100 text-red-800"
//                               : "bg-blue-100 text-blue-800"
//                           }`}
//                         >
//                           {role}
//                         </span>
//                       ))}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <select
//                       value={user.isActive ? "active" : "locked"}
//                       onChange={(e) => {
//                         const newStatus = e.target.value === "active";
//                         if (newStatus !== user.isActive) {
//                           handleToggleActive(user, newStatus);
//                         }
//                       }}
//                       className={`w-32 px-3 py-1.5 text-sm font-medium rounded-md border focus:outline-none focus:ring-2 transition ${
//                         user.isActive
//                           ? "bg-green-50 border-green-300 text-green-800 focus:ring-green-500"
//                           : "bg-red-50 border-red-300 text-red-800 focus:ring-red-500"
//                       }`}
//                     >
//                       <option value="active">Hoạt động</option>
//                       <option value="locked">Khóa</option>
//                     </select>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <div className="flex items-center gap-4">
//                       {/* Icon Xem chi tiết */}
//                       <button
//                         onClick={() => handleViewDetail(user)}
//                         className="text-blue-600 hover:text-blue-800 transition"
//                         title="Xem chi tiết"
//                       >
//                         <Eye size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleEdit(user)}
//                         className="text-indigo-600 hover:text-indigo-800 transition"
//                         title="Sửa"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(user)}
//                         className="text-red-600 hover:text-red-800 transition"
//                         title="Xóa"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal chỉnh sửa / tạo mới */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">
//                 {modalMode === "create"
//                   ? "Tạo người dùng mới"
//                   : "Chỉnh sửa người dùng"}
//               </h2>

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email *
//                   </label>

//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email || ""}
//                     onChange={handleInputChange}
//                     disabled={modalMode === "edit"}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     placeholder="example@gmail.com"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Họ *
//                     </label>
//                     <input
//                       type="text"
//                       name="firstName"
//                       value={formData.firstName || ""}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Tên *
//                     </label>
//                     <input
//                       type="text"
//                       name="lastName"
//                       value={formData.lastName || ""}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Giới tính
//                   </label>
//                   <select
//                     name="gender"
//                     value={formData.gender || ""}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="">Chọn giới tính</option>
//                     <option value="male">Nam</option>
//                     <option value="female">Nữ</option>
//                     <option value="other">Khác</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Vai trò
//                   </label>
//                   <select
//                     multiple
//                     name="roles"
//                     value={formData.roles || []}
//                     onChange={handleRolesChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
//                   >
//                     <option value="USER">Khách hàng</option>
//                     <option value="ADMIN">Quản trị viên</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Cấp bậc thành viên
//                   </label>
//                   <select
//                     name="membership.tier_name"
//                     value={formData.membership?.tier_name || ""}
//                     onChange={handleMembershipChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
//                   >
//                     <option value="">Không có</option>
//                     <option value="Gold">Gold</option>
//                     <option value="Silver">Silver</option>
//                   </select>
//                 </div>
//                 <div className="mt-8 flex justify-end gap-4">
//                   <button
//                     type="button"
//                     onClick={handleCloseModal}
//                     className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//                   >
//                     Hủy
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                   >
//                     {modalMode === "create" ? "Tạo mới" : "Lưu thay đổi"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal xem chi tiết user */}
//       {isDetailModalOpen && selectedUser && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   Chi tiết người dùng: {selectedUser.email}
//                 </h2>
//                 <button
//                   onClick={handleCloseDetailModal}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <XCircle size={24} />
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Clerk ID</p>
//                   <p className="text-gray-900">{selectedUser.clerkId}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Email</p>
//                   <p className="text-gray-900">{selectedUser.email}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Họ</p>
//                   <p className="text-gray-900">{selectedUser.firstName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Tên</p>
//                   <p className="text-gray-900">{selectedUser.lastName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Username</p>
//                   <p className="text-gray-900">
//                     {selectedUser.username || "—"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Số điện thoại
//                   </p>
//                   <p className="text-gray-900">{selectedUser.phone || "—"}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Giới tính</p>
//                   <p className="text-gray-900">
//                     {selectedUser.gender
//                       ? selectedUser.gender === "male"
//                         ? "Nam"
//                         : selectedUser.gender === "female"
//                           ? "Nữ"
//                           : "Khác"
//                       : "—"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Hạng thành viên
//                   </p>
//                   <p className="text-gray-900">
//                     {selectedUser.membership?.tier_name || "Không có"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Vai trò</p>
//                   <p className="text-gray-900">
//                     {selectedUser.roles.join(", ")}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Trạng thái
//                   </p>
//                   <p className="text-gray-900">
//                     {selectedUser.isActive ? "Hoạt động" : "Khóa"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Ngày tạo</p>
//                   <p className="text-gray-900">
//                     {selectedUser.createdAt || "—"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">
//                     Ngày cập nhật
//                   </p>
//                   <p className="text-gray-900">
//                     {selectedUser.updatedAt || "—"}
//                   </p>
//                 </div>
//                 {/* Nếu sau này có trường địa chỉ hoặc các trường khác, thêm vào đây */}
//               </div>

//               <div className="mt-8 flex justify-end">
//                 <button
//                   onClick={handleCloseDetailModal}
//                   className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
//                 >
//                   Đóng
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// //     try {
// //       if (modalMode === "edit" && editingUser) {
// //         await axios.patch(`/api/admin/users/${editingUser.clerkId}`, formData, {
// //           headers: getAuthHeader(),
// //         });
// //         toast.success("Cập nhật thành công");
// //       } else {
// //         await axios.post("/api/admin/users", formData, {
// //           headers: getAuthHeader(),
// //         });
// //         toast.success("Tạo thành công");
// //       }
// //       setIsModalOpen(false);
// //       refreshUsers();
// //     } catch (err: unknown) {
// //       const msg = axios.isAxiosError(err)
// //         ? err.response?.data?.message || "Thao tác thất bại"
// //         : "Lỗi hệ thống";
// //       toast.error(msg);
// //     }
// //   };

// //   const handleToggleActive = async (user: User, checked: boolean) => {
// //     try {
// //       await axios.patch(
// //         `/api/admin/users/${user.clerkId}`,
// //         { isActive: checked },
// //         {
// //           headers: getAuthHeader(),
// //         },
// //       );
// //       toast.success("Cập nhật trạng thái thành công");
// //       refreshUsers();
// //     } catch (err: unknown) {
// //       const msg = axios.isAxiosError(err)
// //         ? err.response?.data?.message || "Cập nhật thất bại"
// //         : "Lỗi hệ thống";
// //       toast.error(msg);
// //     }
// //   };

// //   const handleDelete = async (user: User) => {
// //     if (!window.confirm(`Xác nhận xóa ${user.email}?`)) return;
// //     try {
// //       await axios.delete(`/api/admin/users/${user.clerkId}`, {
// //         headers: getAuthHeader(),
// //       });
// //       toast.success("Xóa thành công");
// //       refreshUsers();
// //     } catch (err: unknown) {
// //       const msg = axios.isAxiosError(err)
// //         ? err.response?.data?.message || "Xóa thất bại"
// //         : "Lỗi hệ thống";
// //       toast.error(msg);
// //     }
// //   };

// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-3xl font-bold text-gray-800">Quản lý Người dùng</h1>
// //         <button
// //           onClick={handleCreate}
// //           className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
// //         >
// //           <PlusCircle size={20} />
// //           Thêm người dùng
// //         </button>
// //       </div>

// //       {error && (
// //         <div className="mb-6 p-4 bg-red-50 text-red-700 rounded">{error}</div>
// //       )}

// //       {loading ? (
// //         <div className="text-center py-20">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Đang tải...</p>
// //         </div>
// //       ) : users.length === 0 ? (
// //         <div className="text-center py-20 text-gray-500">
// //           Chưa có người dùng nào
// //         </div>
// //       ) : (
// //         <div className="overflow-x-auto bg-white rounded-lg shadow">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                   Email
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                   Họ & Tên
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                   Username
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                   Roles
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                   Trạng thái
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                   Hành động
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-200">
// //               {users.map((user) => (
// //                 <tr key={user.clerkId}>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                     {user.email}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                     {user.firstName} {user.lastName}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                     {user.username || "-"}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                     {user.roles.map((role: string) => (
// //                       <span
// //                         key={role}
// //                         className={`px-2 py-1 rounded-full mr-2 ${
// //                           role === "ADMIN"
// //                             ? "bg-red-100 text-red-800"
// //                             : "bg-blue-100 text-blue-800"
// //                         }`}
// //                       >
// //                         {role}
// //                       </span>
// //                     ))}
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <button
// //                       onClick={() => handleToggleActive(user, !user.isActive)}
// //                       className="flex items-center gap-2"
// //                     >
// //                       {user.isActive ? (
// //                         <>
// //                           <CheckCircle2 size={18} className="text-green-600" />
// //                           <span className="text-green-600">Hoạt động</span>
// //                         </>
// //                       ) : (
// //                         <>
// //                           <XCircle size={18} className="text-red-600" />
// //                           <span className="text-red-600">Khóa</span>
// //                         </>
// //                       )}
// //                     </button>
// //                   </td>
// //                   <td className="px-6 py-4 whitespace-nowrap">
// //                     <div className="flex gap-4">
// //                       <button
// //                         onClick={() => handleEdit(user)}
// //                         className="text-blue-600"
// //                       >
// //                         <Edit size={18} />
// //                       </button>
// //                       <button
// //                         onClick={() => handleDelete(user)}
// //                         className="text-red-600"
// //                       >
// //                         <Trash2 size={18} />
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {isModalOpen && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //           <div className="bg-white p-6 rounded-lg max-w-lg w-full">
// //             <h2 className="text-2xl font-bold mb-4">
// //               {modalMode === "create" ? "Tạo mới" : "Chỉnh sửa"}
// //             </h2>
// //             <form onSubmit={handleSubmit}>
// //               {/* Full form fields */}
// //               <div className="space-y-4">
// //                 <input
// //                   name="email"
// //                   value={formData.email || ""}
// //                   onChange={handleInputChange}
// //                   disabled={modalMode === "edit"}
// //                   placeholder="Email"
// //                   className="w-full border p-2 rounded"
// //                 />
// //                 <input
// //                   name="firstName"
// //                   value={formData.firstName || ""}
// //                   onChange={handleInputChange}
// //                   placeholder="Họ"
// //                   className="w-full border p-2 rounded"
// //                 />
// //                 <input
// //                   name="lastName"
// //                   value={formData.lastName || ""}
// //                   onChange={handleInputChange}
// //                   placeholder="Tên"
// //                   className="w-full border p-2 rounded"
// //                 />
// //                 <input
// //                   name="phone"
// //                   value={formData.phone || ""}
// //                   onChange={handleInputChange}
// //                   placeholder="Số điện thoại"
// //                   className="w-full border p-2 rounded"
// //                 />
// //                 <select
// //                   name="gender"
// //                   value={formData.gender || ""}
// //                   onChange={handleInputChange}
// //                   className="w-full border p-2 rounded"
// //                 >
// //                   <option value="">Giới tính</option>
// //                   <option value="male">Nam</option>
// //                   <option value="female">Nữ</option>
// //                   <option value="other">Khác</option>
// //                 </select>
// //                 <select
// //                   multiple
// //                   name="roles"
// //                   value={formData.roles || []}
// //                   onChange={handleRolesChange}
// //                   className="w-full border p-2 rounded h-24"
// //                 >
// //                   <option value="CUSTOMER">Customer</option>
// //                   <option value="ADMIN">Admin</option>
// //                   <option value="MODERATOR">Moderator</option>
// //                 </select>
// //                 <select
// //                   name="membership.tier_name"
// //                   value={formData.membership?.tier_name || ""}
// //                   onChange={handleMembershipChange}
// //                   className="w-full border p-2 rounded"
// //                 >
// //                   <option value="">Membership</option>
// //                   <option value="Gold">Gold</option>
// //                   <option value="Silver">Silver</option>
// //                 </select>
// //                 <label>
// //                   Active:
// //                   <input
// //                     type="checkbox"
// //                     checked={formData.isActive}
// //                     onChange={(e) =>
// //                       setFormData((prev) => ({
// //                         ...prev,
// //                         isActive: e.target.checked,
// //                       }))
// //                     }
// //                   />
// //                 </label>
// //               </div>
// //               <div className="mt-6 flex justify-end gap-4">
// //                 <button
// //                   type="button"
// //                   onClick={handleCloseModal}
// //                   className="px-4 py-2 border rounded"
// //                 >
// //                   Hủy
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="px-4 py-2 bg-green-600 text-white rounded"
// //                 >
// //                   Lưu
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AdminUsersPage;

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Membership {
  tier_name: string;
  discount_rate?: number;
}

interface Address {
  address_name: string;
  fullAddress: string;
  phone: string;
  is_default: boolean;
  is_active: boolean;
}

interface User {
  id: string;
  clerkId: string;
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  avatarUrl?: string; // Thêm avatarUrl từ Clerk hoặc DB
  roles: string[];
  isActive: boolean;
  membership?: Membership;
  addresses?: Address[]; // Thêm địa chỉ nếu có trong DB
  createdAt?: string;
  updatedAt?: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("edit");

  // Modal chi tiết user
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<Partial<User>>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    gender: undefined,
    roles: [],
    membership: undefined,
    isActive: true,
  });

  // Thêm state cho password (chỉ dùng khi tạo mới)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getAuthHeader = () => {
    const token = localStorage.getItem("adminToken") || "";
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://localhost:8080/api/admin/users", {
          headers: getAuthHeader(),
        });
        const data = Array.isArray(res.data) ? res.data : [];
        setUsers(data);
      } catch (err: unknown) {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.message || "Không tải được danh sách người dùng"
          : "Lỗi kết nối đến server";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const refreshUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/users", {
        headers: getAuthHeader(),
      });
      const data = Array.isArray(res.data) ? res.data : [];
      setUsers(data);
    } catch (err) {
      console.error("Refresh failed", err);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalMode("edit");
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      gender: user.gender,
      roles: [...user.roles],
      membership: user.membership,
      isActive: user.isActive,
    });
    setPassword(""); // Không hiển thị password khi edit
    setConfirmPassword("");
    setIsModalOpen(true);
  };

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setModalMode("create");
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      gender: undefined,
      roles: [],
      membership: undefined,
      isActive: true,
    });
    setPassword("");
    setConfirmPassword("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRolesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setFormData((prev) => ({ ...prev, roles: selected }));
  };

  const handleMembershipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      membership: value ? { tier_name: value } : undefined,
    }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.email || !formData.firstName || !formData.lastName) {
  //     toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
  //     return;
  //   }

  //   try {
  //     if (modalMode === "edit" && editingUser) {
  //       // Chỉ cập nhật thông tin, không gửi password
  //       await axios.patch(
  //         `http://localhost:8080/api/admin/users/${editingUser.clerkId}`,
  //         formData,
  //         { headers: getAuthHeader() },
  //       );
  //       toast.success("Cập nhật thành công");
  //     } else {
  //       // Tạo mới: Gửi lên Clerk trước
  //       if (!password || !confirmPassword) {
  //         toast.error("Vui lòng nhập mật khẩu và xác nhận");
  //         return;
  //       }
  //       if (password !== confirmPassword) {
  //         toast.error("Mật khẩu xác nhận không khớp");
  //         return;
  //       }

  //       // Gọi Clerk API tạo user
  //       const clerkRes = await axios.post(
  //         "https://api.clerk.com/v1/users",
  //         {
  //           email_address: [formData.email],
  //           password,
  //           first_name: formData.firstName,
  //           last_name: formData.lastName,
  //           username: formData.username || undefined,
  //           public_metadata: {
  //             phone: formData.phone,
  //             gender: formData.gender,
  //             roles: formData.roles || ["USER"],
  //             membership: formData.membership,
  //           },
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${import.meta.env.VITE_CLERK_SECRET_KEY}`,
  //             "Content-Type": "application/json",
  //           },
  //         },
  //       );

  //       const newClerkId = clerkRes.data.id;

  //       // Gửi về backend với clerkId
  //       await axios.post(
  //         "http://localhost:8080/api/admin/users",
  //         {
  //           ...formData,
  //           clerkId: newClerkId,
  //           isActive: true,
  //         },
  //         { headers: getAuthHeader() },
  //       );

  //       toast.success("Tạo người dùng thành công");
  //     }

  //     setIsModalOpen(false);
  //     refreshUsers();
  //   } catch (err: unknown) {
  //     let msg = "Thao tác thất bại";
  //     if (axios.isAxiosError(err)) {
  //       const response = err.response;
  //       if (response?.data?.errors) {
  //         // Lỗi từ Clerk thường nằm ở errors array
  //         msg =
  //           response.data.errors[0]?.message ||
  //           response.data.errors[0]?.longMessage ||
  //           msg;
  //       } else {
  //         msg =
  //           response?.data?.error?.message || response?.data?.message || msg;
  //       }
  //       console.error("Clerk/Backend error:", response?.data); // Log để debug
  //     }
  //     toast.error(msg);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      if (modalMode === "edit" && editingUser) {
        // Chỉ cập nhật thông tin, không gửi password
        await axios.patch(
          `http://localhost:8080/api/admin/users/${editingUser.clerkId}`,
          formData,
          { headers: getAuthHeader() },
        );
        toast.success("Cập nhật thành công");
      } else {
        // Tạo mới: Gửi lên backend để backend gọi Clerk
        if (!password || !confirmPassword) {
          toast.error("Vui lòng nhập mật khẩu và xác nhận");
          return;
        }
        if (password !== confirmPassword) {
          toast.error("Mật khẩu xác nhận không khớp");
          return;
        }

        // Bước 1: Gọi backend tạo user ở Clerk
        const clerkRes = await axios.post(
          "http://localhost:8080/api/admin/users/create-clerk-user",
          {
            email: formData.email,
            password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username || undefined,
            phone: formData.phone,
            gender: formData.gender,
            roles: formData.roles || ["USER"],
            membership: formData.membership,
          },
          { headers: getAuthHeader() },
        );

        // Lấy clerkId từ backend trả về
        const newClerkId = clerkRes.data.clerkId;

        // Bước 2: Gửi clerkId + thông tin khác về backend để lưu DB
        await axios.post(
          "http://localhost:8080/api/admin/users",
          {
            ...formData,
            clerkId: newClerkId,
            isActive: true,
          },
          { headers: getAuthHeader() },
        );

        toast.success("Tạo người dùng thành công");
      }

      setIsModalOpen(false);
      refreshUsers();
    } catch (err: unknown) {
      let msg = "Thao tác thất bại";
      if (axios.isAxiosError(err)) {
        const response = err.response;
        if (response?.data?.errors) {
          // Lỗi từ Clerk (nếu backend forward lỗi)
          msg =
            response.data.errors[0]?.message ||
            response.data.errors[0]?.longMessage ||
            msg;
        } else {
          msg =
            response?.data?.message || response?.data?.error?.message || msg;
        }
        console.error("Lỗi từ backend:", response?.data);
      } else {
        console.error("Lỗi không xác định:", err);
      }
      toast.error(msg);
    }
  };
  const handleToggleActive = async (user: User, checked: boolean) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/admin/users/${user.clerkId}`,
        { isActive: checked },
        { headers: getAuthHeader() },
      );
      toast.success("Cập nhật trạng thái thành công");
      refreshUsers();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Cập nhật thất bại"
        : "Lỗi hệ thống";
      toast.error(msg);
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Xác nhận xóa ${user.email}?`)) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/admin/users/${user.clerkId}`,
        { headers: getAuthHeader() },
      );
      toast.success("Xóa thành công");
      refreshUsers();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Xóa thất bại"
        : "Lỗi hệ thống";
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Người dùng</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <PlusCircle size={20} />
          Thêm người dùng
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách người dùng...</p>
        </div>
      ) : !users || users.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Chưa có người dùng nào trong hệ thống
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hạng thành viên
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr
                  key={user.clerkId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-3">
                    <img
                      src={
                        user.avatarUrl ||
                        "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(
                            user.firstName + " " + user.lastName,
                          )
                      }
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                    />
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.membership?.tier_name || "Không có"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.username || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            role === "ADMIN"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.isActive ? "active" : "locked"}
                      onChange={(e) => {
                        const newStatus = e.target.value === "active";
                        if (newStatus !== user.isActive) {
                          handleToggleActive(user, newStatus);
                        }
                      }}
                      className={`w-32 px-3 py-1.5 text-sm font-medium rounded-md border focus:outline-none focus:ring-2 transition ${
                        user.isActive
                          ? "bg-green-50 border-green-300 text-green-800 focus:ring-green-500"
                          : "bg-red-50 border-red-300 text-red-800 focus:ring-red-500"
                      }`}
                    >
                      <option value="active">Hoạt động</option>
                      <option value="locked">Khóa</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleViewDetail(user)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-indigo-800 transition"
                        title="Sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal tạo mới / chỉnh sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {modalMode === "create"
                  ? "Tạo người dùng mới"
                  : "Chỉnh sửa người dùng"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    disabled={modalMode === "edit"}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="example@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Name
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Password chỉ hiển thị khi tạo mới */}
                {modalMode === "create" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu *
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nhập mật khẩu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu *
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nhập lại mật khẩu"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <select
                    multiple
                    name="roles"
                    value={formData.roles || []}
                    onChange={handleRolesChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
                  >
                    <option value="USER">Khách hàng</option>
                    <option value="ADMIN">Quản trị viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cấp bậc thành viên
                  </label>
                  <select
                    name="membership.tier_name"
                    value={formData.membership?.tier_name || ""}
                    onChange={handleMembershipChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Không có</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                  </select>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    {modalMode === "create" ? "Tạo mới" : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết user */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Chi tiết người dùng: {selectedUser.email}
                </h2>
                <button
                  onClick={handleCloseDetailModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <img
                  src={
                    selectedUser.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.firstName + " " + selectedUser.lastName)}&size=128`
                  }
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <p className="text-sm text-gray-500">
                    Username: {selectedUser.username || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clerk ID</p>
                  <p className="text-gray-900 break-all">
                    {selectedUser.clerkId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Số điện thoại
                  </p>
                  <p className="text-gray-900">{selectedUser.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Giới tính</p>
                  <p className="text-gray-900">
                    {selectedUser.gender
                      ? selectedUser.gender === "male"
                        ? "Nam"
                        : selectedUser.gender === "female"
                          ? "Nữ"
                          : "Khác"
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Hạng thành viên
                  </p>
                  <p className="text-gray-900">
                    {selectedUser.membership?.tier_name || "Không có"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Vai trò</p>
                  <p className="text-gray-900">
                    {selectedUser.roles.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Trạng thái
                  </p>
                  <p className="text-gray-900">
                    {selectedUser.isActive ? (
                      <span className="text-green-600 font-medium">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">Khóa</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Ngày tạo</p>
                  <p className="text-gray-900">
                    {selectedUser.createdAt || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Ngày cập nhật
                  </p>
                  <p className="text-gray-900">
                    {selectedUser.updatedAt || "—"}
                  </p>
                </div>
              </div>

              {/* Địa chỉ nếu có */}
              {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3">Địa chỉ</h3>
                  <div className="space-y-4">
                    {selectedUser.addresses.map((addr, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg border"
                      >
                        <p className="font-medium">
                          {addr.address_name} {addr.is_default && "(Mặc định)"}
                        </p>
                        <p>{addr.fullAddress}</p>
                        <p className="text-sm text-gray-600">
                          SĐT: {addr.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleCloseDetailModal}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
