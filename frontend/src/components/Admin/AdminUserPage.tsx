import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  XCircle,
  CheckCircle,
  ChevronDown,
  Users,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

interface Membership {
  tierName: string;
  discountRate?: number;
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
  avatarUrl?: string;
  roles: string[];
  isActive: boolean;
  membership?: Membership;
  addresses?: Address[];
  createdAt?: string;
  updatedAt?: string;
  isBlocked?: boolean;
  // isLocked?: boolean;
}

const AdminUsersPage = () => {
  const BASE_URL = "http://localhost:8081";

  const [currentPage, setCurrentPage] = useState(0); // backend dùng 0-based
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 10;

  // Fetch theo page
  const fetchUsers = async (page = 0) => {
    setLoading(true);
    try {
      const headers = await getAuthHeader();
      const res = await axios.get(
        `${BASE_URL}/api/admin/users?page=${page}&size=${PAGE_SIZE}`,
        { headers },
      );
      setUsers(res.data.content); // chỉ 10 user
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
      setCurrentPage(page);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, []);

  const formatOnlyDate = (iso?: string) => {
    if (!iso) return "—";
    const date = new Date(iso);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const TIER_LABEL: Record<string, string> = {
    Member: "Thành viên",
    Silver: "Bạc",
    Gold: "Vàng",
    Diamond: "Kim cương",
  };

  const { getToken } = useAuth();

  const getAuthHeader = async () => {
    // const token = await getToken();

    const token = await getToken({ template: "my-backend" });
    console.log("TOKEN:", token);
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("edit");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const getTierBadgeClass = (tierName?: string) => {
    switch (tierName) {
      case "Member":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Silver":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Gold":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Diamond":
        return "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-400/30";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

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

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const refreshUsers = () => {
    fetchUsers(currentPage);
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
      roles: user.roles.length > 0 ? user.roles : ["USER"],
      membership: user.membership,
      isActive: user.isActive,
      username: user.username || "",
    });
    setPassword("");
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
      roles: ["USER"],
      membership: undefined,
      isActive: true,
    });
    setPassword("");
    setConfirmPassword("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

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

  // const handleRolesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selected = Array.from(
  //     e.target.selectedOptions,
  //     (option) => option.value,
  //   );
  //   setFormData((prev) => ({ ...prev, roles: selected }));
  // };
  const handleRolesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, roles: [value] }));
  };

  const handleMembershipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      membership: value ? { tierName: value } : undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      const headers = await getAuthHeader();

      if (modalMode === "edit" && editingUser) {
        const payload = {
          ...formData,
          membership: formData.membership?.tierName ?? undefined,
        };

        await axios.patch(
          `${BASE_URL}/api/admin/users/${editingUser.clerkId}`,
          payload,
          { headers },
        );
        toast.success("Cập nhật thành công");
      } else {
        if (!password || !confirmPassword) {
          toast.error("Vui lòng nhập mật khẩu và xác nhận");
          return;
        }
        if (password !== confirmPassword) {
          toast.error("Mật khẩu xác nhận không khớp");
          return;
        }
        // console.log(formData);
        const clerkRes = await axios.post(
          "${BASE_URL}/api/admin/users/create-clerk-user",
          {
            email: formData.email,
            password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username || undefined,
            phone: formData.phone,
            gender: formData.gender,
            roles: formData.roles?.length ? formData.roles : ["USER"],
            membership: formData.membership?.tierName ?? undefined, // ← gửi string "Member"
            // membership: formData.membership,
          },
          { headers },
        );

        const newClerkId = clerkRes.data.clerkId;
        // console.log(
        //   "📦 Payload gửi lên /api/admin/users:",
        //   JSON.stringify(
        //     {
        //       ...formData,
        //       clerkId: newClerkId,
        //       membership: formData.membership?.tierName ?? undefined,
        //       isActive: true,
        //     },
        //     null,
        //     2,
        //   ),
        // );

        await axios.post(
          `${BASE_URL}/api/admin/users`,
          {
            ...formData,
            clerkId: newClerkId,
            isActive: true,
            membership: formData.membership?.tierName ?? undefined,
          },
          { headers },
        );

        toast.success("Tạo người dùng thành công");
      }

      setIsModalOpen(false);
      refreshUsers();
    } catch (err: unknown) {
      let msg = "Thao tác thất bại";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || "Lỗi không xác định";
      }
      toast.error(msg);
      console.error(err);
    }
  };

  // Chặn / Bỏ chặn (đồng bộ Clerk + DB)
  const handleBanChange = async (user: User, shouldBan: boolean) => {
    // 1. Update UI trước
    setUsers((prev) =>
      prev.map((u) =>
        u.clerkId === user.clerkId ? { ...u, isActive: !shouldBan } : u,
      ),
    );

    try {
      const headers = await getAuthHeader();
      const endpoint = shouldBan ? "ban" : "unban";
      await axios.patch(
        `${BASE_URL}/api/admin/users/${user.clerkId}/${endpoint}`,
        {},
        { headers },
      );
      toast.success(shouldBan ? "Đã chặn tài khoản" : "Đã bỏ chặn tài khoản");
    } catch (err) {
      toast.error("Cập nhật thất bại");
      // rollback
      setUsers((prev) =>
        prev.map((u) =>
          u.clerkId === user.clerkId ? { ...u, isActive: shouldBan } : u,
        ),
      );
    }
  };

  // Khóa / Mở khóa (chỉ Clerk, không lưu DB)
  const handleLockChange = async (user: User, shouldLock: boolean) => {
    // update UI trước
    // setUsers((prev) =>
    //   prev.map((u) =>
    //     u.clerkId === user.clerkId ? { ...u, isLocked: shouldLock } : u,
    //   ),
    // );
    setUsers((prev) =>
      prev.map((u) =>
        u.clerkId === user.clerkId ? { ...u, isBlocked: shouldLock } : u,
      ),
    );

    try {
      const headers = await getAuthHeader();
      const endpoint = shouldLock ? "lock" : "unlock";

      await axios.patch(
        `${BASE_URL}/api/admin/users/${user.clerkId}/${endpoint}`,
        {},
        { headers },
      );

      toast.success(shouldLock ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản");
    } catch (err) {
      toast.error("Cập nhật trạng thái khóa thất bại");

      // rollback
      // setUsers((prev) =>
      //   prev.map((u) =>
      //     u.clerkId === user.clerkId ? { ...u, isLocked: !shouldLock } : u,
      //   ),
      // );
      setUsers((prev) =>
        prev.map((u) =>
          u.clerkId === user.clerkId ? { ...u, isBlocked: !shouldLock } : u,
        ),
      );
    }
  };

  const normalizeTierName = (raw: any): string => {
    if (!raw) return "";
    const str = typeof raw === "string" ? raw : raw.tierName || "";
    // "DIAMOND" → "Diamond", "Diamond" → "Diamond"
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Cập nhật role trực tiếp từ bảng
  const handleRoleChange = async (user: User, newRole: "USER" | "ADMIN") => {
    // update UI trước
    setUsers((prev) =>
      prev.map((u) =>
        u.clerkId === user.clerkId ? { ...u, roles: [newRole] } : u,
      ),
    );

    try {
      const headers = await getAuthHeader();
      await axios.patch(
        `${BASE_URL}/api/admin/users/${user.clerkId}`,
        { roles: [newRole] },
        { headers },
      );
      toast.success(`Đã cập nhật role thành ${newRole}`);
    } catch (err) {
      toast.error("Cập nhật role thất bại");
      refreshUsers(); // rollback
    }
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Xác nhận xóa ${user.email}?`)) return;
    try {
      const headers = await getAuthHeader();
      await axios.delete(`${BASE_URL}/api/admin/users/${user.clerkId}`, {
        headers,
      });
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
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Users className="text-emerald-600" />
          Quản lý Người dùng
        </h1>
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
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Chưa có người dùng nào trong hệ thống
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hạng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vai trò
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
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[220px]">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          user.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.firstName + " " + user.lastName,
                          )}`
                        }
                        alt="Avatar"
                        className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover flex-shrink-0"
                      />
                      <span className="truncate block" title={user.email}>
                        {user.email}
                      </span>
                    </div>
                  </td>

                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-3">
                    <img
                      src={
                        user.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.firstName + " " + user.lastName,
                        )}`
                      }
                      alt="Avatar"
                      className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                    />
                    {user.email}
                  </td> */}

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getTierBadgeClass(normalizeTierName(user.membership))}`}
                    >
                      {TIER_LABEL[normalizeTierName(user.membership)] ||
                        "Thành viên"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.username || "—"}
                  </td>

                  {/* Role - Select option */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-40">
                      <select
                        value={user.roles.includes("ADMIN") ? "ADMIN" : "USER"}
                        onChange={(e) =>
                          handleRoleChange(
                            user,
                            e.target.value as "USER" | "ADMIN",
                          )
                        }
                        className={`w-full px-3 py-1.5 pr-8 text-sm font-medium rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-2 transition ${
                          user.roles.includes("ADMIN")
                            ? "bg-red-50 border-red-300 text-red-800 focus:ring-red-500"
                            : "bg-blue-50 border-blue-300 text-blue-800 focus:ring-blue-500"
                        }`}
                      >
                        <option value="USER">Khách hàng</option>
                        <option value="ADMIN">Quản trị viên</option>
                      </select>

                      {/* Icon mũi tên Lucide */}
                      <div
                        className={`absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none ${
                          user.roles.includes("ADMIN")
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      >
                        <ChevronDown size={16} strokeWidth={2.5} />
                      </div>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      {/* Select: Hoạt động / Chặn */}
                      <div className="relative inline-block w-30">
                        <select
                          value={user.isActive ? "active" : "banned"}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "active") {
                              handleBanChange(user, false);
                            } else if (value === "banned") {
                              handleBanChange(user, true);
                            }
                          }}
                          className={`w-full px-3 py-2 text-sm font-medium rounded-lg border appearance-none pr-10 focus:outline-none focus:ring-2 transition ${
                            user.isActive
                              ? "bg-green-50 border-green-300 text-green-800 focus:ring-green-500"
                              : "bg-red-50 border-red-300 text-red-800 focus:ring-red-500"
                          }`}
                        >
                          <option value="active">Hoạt động</option>
                          <option value="banned">Chặn</option>
                        </select>

                        {/* Icon khi bị chặn */}
                        {!user.isActive && (
                          <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                            <CheckCircle className="w-5 h-5 text-red-600" />
                          </div>
                        )}

                        {/* Mũi tên dropdown */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                          <ChevronDown size={18} strokeWidth={2.5} />
                        </div>
                      </div>

                      {/* Checkbox Khóa */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!user.isBlocked}
                          onChange={(e) =>
                            handleLockChange(user, e.target.checked)
                          }
                          className="h-5 w-5 text-orange-600 border-gray-300 rounded"
                        />

                        <span className="text-sm font-medium flex items-center gap-1">
                          Khóa
                        </span>
                      </label>
                    </div>
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
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-600">
              Tổng {totalElements} người dùng
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchUsers(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40"
              >
                ← Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchUsers(page)}
                  className={`px-3 py-1.5 text-sm border rounded-lg ${
                    currentPage === page
                      ? "bg-green-600 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
              <button
                onClick={() => fetchUsers(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40"
              >
                Sau →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal tạo mới / chỉnh sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4">
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
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleInputChange}
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

                {/* <div>
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

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <select
                    multiple
                    value={formData.roles || []}
                    onChange={handleRolesChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 h-24"
                  >
                    <option value="USER">Khách hàng</option>
                    <option value="ADMIN">Quản trị viên</option>
                  </select>
                </div> */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vai trò
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: "USER", label: "Khách hàng" },
                      { value: "ADMIN", label: "Quản trị viên" },
                    ].map((role) => {
                      const checked = (formData.roles || []).includes(
                        role.value,
                      );
                      return (
                        <label
                          key={role.value}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer text-sm font-medium transition ${
                            checked
                              ? role.value === "ADMIN"
                                ? "bg-red-50 border-red-300 text-red-700"
                                : "bg-blue-50 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 text-gray-500"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={role.value}
                            checked={checked}
                            onChange={handleRolesChange}
                            className="hidden"
                          />
                          <span
                            className={`w-2 h-2 rounded-full ${
                              checked
                                ? role.value === "ADMIN"
                                  ? "bg-red-400"
                                  : "bg-blue-400"
                                : "bg-gray-300"
                            }`}
                          />
                          {role.label}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cấp bậc thành viên
                  </label>
                  <select
                    value={formData.membership?.tierName || ""}
                    onChange={handleMembershipChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Member">Thành viên</option>
                    <option value="Silver">Bạc</option>
                    <option value="Gold">Vàng</option>
                    <option value="Diamond">Kim cương</option>
                  </select>
                </div>  */}

                {/* Giới tính */}
                {/* Giới tính */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giới tính
                  </label>
                  <div className="relative">
                    <select
                      name="gender"
                      value={formData.gender || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Vai trò */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <div className="relative">
                    <select
                      value={
                        formData.roles?.includes("ADMIN") ? "ADMIN" : "USER"
                      }
                      onChange={handleRolesChange}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="USER">Khách hàng</option>
                      <option value="ADMIN">Quản trị viên</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Cấp bậc thành viên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cấp bậc thành viên
                  </label>
                  <div className="relative">
                    <select
                      value={normalizeTierName(formData.membership)}
                      onChange={handleMembershipChange}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                    >
                      <option value="Member">Thành viên</option>
                      <option value="Silver">Bạc</option>
                      <option value="Gold">Vàng</option>
                      <option value="Diamond">Kim cương</option>
                    </select>
                    <ChevronDown
                      size={15}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
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

      {/* Modal chi tiết */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4">
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
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedUser.firstName + " " + selectedUser.lastName,
                    )}&size=128`
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
                    {TIER_LABEL[normalizeTierName(selectedUser.membership)] ||
                      "Thành viên"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Vai trò</p>
                  <p className="text-gray-900">
                    {selectedUser.roles.includes("ADMIN")
                      ? "Quản trị viên"
                      : "Khách hàng"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Ngày tạo</p>
                  <p className="text-gray-900">
                    {formatOnlyDate(selectedUser.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Ngày cập nhật
                  </p>
                  <p className="text-gray-900">
                    {formatOnlyDate(selectedUser.updatedAt)}
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
                      <span className="text-red-600 font-medium">Bị chặn</span>
                    )}
                  </p>
                </div>
              </div>

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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
