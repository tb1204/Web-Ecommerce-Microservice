// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import { Edit, Trash2, PlusCircle, CheckCircle2, XCircle } from "lucide-react";

// interface Membership {
//   tier_name: string;
//   discount_rate?: number;
// }

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
// }

// const AdminUsersPage = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [modalMode, setModalMode] = useState<"create" | "edit">("edit");

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

//   const getAuthHeader = () => {
//     const token = localStorage.getItem("adminToken") || "";
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await axios.get("http://localhost:8080/api/admin/users", {
//           headers: getAuthHeader(),
//         });
//         setUsers(res.data as User[]);
//       } catch (err: unknown) {
//         const msg = axios.isAxiosError(err)
//           ? err.response?.data?.message || "Không tải được danh sách"
//           : "Lỗi hệ thống";
//         setError(msg);
//         toast.error(msg);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const refreshUsers = async () => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get("/api/admin/users", {
//           headers: getAuthHeader(),
//         });
//         setUsers(res.data as User[]);
//       } catch (err) {
//         console.error("Refresh failed", err);
//       }
//     };
//     fetchUsers();
//   };

//   const handleEdit = (user: User) => {
//     setEditingUser(user);
//     setModalMode("edit");
//     setFormData({
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       phone: user.phone,
//       gender: user.gender,
//       roles: [...user.roles],
//       membership: user.membership,
//       isActive: user.isActive,
//     });
//     setIsModalOpen(true);
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

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleRolesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selected = Array.from(
//       e.target.selectedOptions,
//       (option) => option.value,
//     );
//     setFormData((prev) => ({ ...prev, roles: selected }));
//   };

//   const handleMembershipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setFormData((prev) => ({
//       ...prev,
//       membership: value ? { tier_name: value } : undefined,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.email || !formData.firstName || !formData.lastName) {
//       toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
//       return;
//     }

//     try {
//       if (modalMode === "edit" && editingUser) {
//         await axios.patch(`/api/admin/users/${editingUser.clerkId}`, formData, {
//           headers: getAuthHeader(),
//         });
//         toast.success("Cập nhật thành công");
//       } else {
//         await axios.post("/api/admin/users", formData, {
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
//         `/api/admin/users/${user.clerkId}`,
//         { isActive: checked },
//         {
//           headers: getAuthHeader(),
//         },
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
//       await axios.delete(`/api/admin/users/${user.clerkId}`, {
//         headers: getAuthHeader(),
//       });
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
//           className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
//         >
//           <PlusCircle size={20} />
//           Thêm người dùng
//         </button>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 text-red-700 rounded">{error}</div>
//       )}

//       {loading ? (
//         <div className="text-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Đang tải...</p>
//         </div>
//       ) : users.length === 0 ? (
//         <div className="text-center py-20 text-gray-500">
//           Chưa có người dùng nào
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-lg shadow">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Email
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Họ & Tên
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Username
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Roles
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Trạng thái
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                   Hành động
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {users.map((user) => (
//                 <tr key={user.clerkId}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {user.email}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {user.firstName} {user.lastName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {user.username || "-"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {user.roles.map((role: string) => (
//                       <span
//                         key={role}
//                         className={`px-2 py-1 rounded-full mr-2 ${
//                           role === "ADMIN"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-blue-100 text-blue-800"
//                         }`}
//                       >
//                         {role}
//                       </span>
//                     ))}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => handleToggleActive(user, !user.isActive)}
//                       className="flex items-center gap-2"
//                     >
//                       {user.isActive ? (
//                         <>
//                           <CheckCircle2 size={18} className="text-green-600" />
//                           <span className="text-green-600">Hoạt động</span>
//                         </>
//                       ) : (
//                         <>
//                           <XCircle size={18} className="text-red-600" />
//                           <span className="text-red-600">Khóa</span>
//                         </>
//                       )}
//                     </button>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex gap-4">
//                       <button
//                         onClick={() => handleEdit(user)}
//                         className="text-blue-600"
//                       >
//                         <Edit size={18} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(user)}
//                         className="text-red-600"
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

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg max-w-lg w-full">
//             <h2 className="text-2xl font-bold mb-4">
//               {modalMode === "create" ? "Tạo mới" : "Chỉnh sửa"}
//             </h2>
//             <form onSubmit={handleSubmit}>
//               {/* Full form fields */}
//               <div className="space-y-4">
//                 <input
//                   name="email"
//                   value={formData.email || ""}
//                   onChange={handleInputChange}
//                   disabled={modalMode === "edit"}
//                   placeholder="Email"
//                   className="w-full border p-2 rounded"
//                 />
//                 <input
//                   name="firstName"
//                   value={formData.firstName || ""}
//                   onChange={handleInputChange}
//                   placeholder="Họ"
//                   className="w-full border p-2 rounded"
//                 />
//                 <input
//                   name="lastName"
//                   value={formData.lastName || ""}
//                   onChange={handleInputChange}
//                   placeholder="Tên"
//                   className="w-full border p-2 rounded"
//                 />
//                 <input
//                   name="phone"
//                   value={formData.phone || ""}
//                   onChange={handleInputChange}
//                   placeholder="Số điện thoại"
//                   className="w-full border p-2 rounded"
//                 />
//                 <select
//                   name="gender"
//                   value={formData.gender || ""}
//                   onChange={handleInputChange}
//                   className="w-full border p-2 rounded"
//                 >
//                   <option value="">Giới tính</option>
//                   <option value="male">Nam</option>
//                   <option value="female">Nữ</option>
//                   <option value="other">Khác</option>
//                 </select>
//                 <select
//                   multiple
//                   name="roles"
//                   value={formData.roles || []}
//                   onChange={handleRolesChange}
//                   className="w-full border p-2 rounded h-24"
//                 >
//                   <option value="CUSTOMER">Customer</option>
//                   <option value="ADMIN">Admin</option>
//                   <option value="MODERATOR">Moderator</option>
//                 </select>
//                 <select
//                   name="membership.tier_name"
//                   value={formData.membership?.tier_name || ""}
//                   onChange={handleMembershipChange}
//                   className="w-full border p-2 rounded"
//                 >
//                   <option value="">Membership</option>
//                   <option value="Gold">Gold</option>
//                   <option value="Silver">Silver</option>
//                 </select>
//                 <label>
//                   Active:
//                   <input
//                     type="checkbox"
//                     checked={formData.isActive}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         isActive: e.target.checked,
//                       }))
//                     }
//                   />
//                 </label>
//               </div>
//               <div className="mt-6 flex justify-end gap-4">
//                 <button
//                   type="button"
//                   onClick={handleCloseModal}
//                   className="px-4 py-2 border rounded"
//                 >
//                   Hủy
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-green-600 text-white rounded"
//                 >
//                   Lưu
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminUsersPage;

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Edit, Trash2, PlusCircle, CheckCircle2, XCircle } from "lucide-react";

interface Membership {
  tier_name: string;
  discount_rate?: number;
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
  roles: string[];
  isActive: boolean;
  membership?: Membership;
  createdAt?: string;
  updatedAt?: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]); // Luôn mảng rỗng
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("edit");

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
        // Đảm bảo luôn là mảng
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
    setIsModalOpen(true);
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      if (modalMode === "edit" && editingUser) {
        await axios.patch(
          `http://localhost:8080/api/admin/users/${editingUser.clerkId}`,
          formData,
          { headers: getAuthHeader() },
        );
        toast.success("Cập nhật thành công");
      } else {
        await axios.post("http://localhost:8080/api/admin/users", formData, {
          headers: getAuthHeader(),
        });
        toast.success("Tạo thành công");
      }
      setIsModalOpen(false);
      refreshUsers();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Thao tác thất bại"
        : "Lỗi hệ thống";
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
        {
          headers: getAuthHeader(),
        },
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
                  Họ & Tên
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.firstName} {user.lastName}
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
                    <button
                      onClick={() => handleToggleActive(user, !user.isActive)}
                      className="flex items-center gap-2 text-sm"
                    >
                      {user.isActive ? (
                        <>
                          <CheckCircle2 className="text-green-600" size={18} />
                          <span className="text-green-700">Hoạt động</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-red-600" size={18} />
                          <span className="text-red-700">Khóa</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="090xxxxxxx"
                  />
                </div>

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
                    <option value="CUSTOMER">Khách hàng</option>
                    <option value="ADMIN">Quản trị viên</option>
                    <option value="MODERATOR">Điều hành viên</option>
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

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive ?? true}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-5 w-5 text-green-600 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tài khoản hoạt động
                  </label>
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
    </div>
  );
};

export default AdminUsersPage;
