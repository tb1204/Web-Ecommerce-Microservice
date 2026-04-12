import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  CheckCircle,
  ChevronDown,
  Users,
  UserCircle,
  UserPlus,
  Contact,
  Key,
  // XCircle,
} from "lucide-react";
import {
  X,
  Mail,
  Phone,
  User,
  Calendar,
  Shield,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Award,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

interface Membership {
  tierName: string;
  discountRate?: number;
}
interface Address {
  _id?: string;
  receiverName: string;
  phone: string;
  street: string;
  ward?: string;
  district?: string;
  province?: string;
  defaultAddress: boolean;
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
  // const BASE_URL = "http://localhost:8081";
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [currentPage, setCurrentPage] = useState(0); // backend dùng 0-based
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 10;

  // Fetch theo page
  const fetchUsers = async (page = 0) => {
    setLoading(true);
    try {
      const headers = await getAuthHeader(); //Test xong nhớ bật lên
      const res = await axios.get(
        `${BASE_URL}/api/admin/users?page=${page}&size=${PAGE_SIZE}`,
        { headers }, //Test xong nhớ bật lên
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
      membership: user.membership ? { tierName: normalizeTierName(user.membership) } : undefined,
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

  // const handleMembershipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = e.target.value;
  //   setFormData((prev) => ({
  //     ...prev,
  //     membership: value ? { tierName: value } : undefined,
  //   }));
  // };
  const handleMembershipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value; // ví dụ: "silver"

    setFormData((prev) => ({
      ...prev,
      membership: value
        ? {
            tierName:
              value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
          }
        : undefined,
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
          `${BASE_URL}/api/admin/users/create-clerk-user`,
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
        //   " Payload gửi lên /api/admin/users:",
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
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md active:scale-95"
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
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="font-bold tracking-widest uppercase text-xs">
            Đang tải dữ liệu...
          </p>
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
                    <div className="relative w-30">
                      <select
                        value={user.roles.includes("ADMIN") ? "ADMIN" : "USER"}
                        onChange={(e) =>
                          handleRoleChange(
                            user,
                            e.target.value as "USER" | "ADMIN",
                          )
                        }
                        className={`w-full px-3 py-2 pr-10 text-sm font-medium rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-2 transition ${
                          user.roles.includes("ADMIN")
                            ? "bg-red-50 border-red-300 text-red-800 focus:ring-red-500"
                            : "bg-blue-50 border-blue-300 text-blue-800 focus:ring-blue-500"
                        }`}
                      >
                        <option value="USER">Khách hàng </option>
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
      {/* Modal tạo mới */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4 transition-all animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-hidden flex flex-col border border-slate-200">
            {/* Header với Icon và Background nhẹ */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${modalMode === "create" ? "bg-indigo-100 text-indigo-600" : "bg-amber-100 text-amber-600"}`}
                >
                  {modalMode === "create" ? (
                    <UserPlus size={22} />
                  ) : (
                    <UserCircle size={22} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 leading-tight">
                    {modalMode === "create"
                      ? "Tạo người dùng mới"
                      : "Chỉnh sửa người dùng"}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Vui lòng điền đầy đủ các thông tin bắt buộc (*)
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Section */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <Mail size={14} className="text-slate-400" /> Email{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    disabled={modalMode === "edit"}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:bg-slate-100 disabled:text-slate-500 placeholder:text-slate-400 text-sm font-medium"
                    placeholder="example@gmail.com"
                  />
                </div>

                {/* Username Section */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <Contact size={14} className="text-slate-400" /> Tên người
                    dùng (Username)
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                    placeholder="VD: vana_dev"
                  />
                </div>

                {/* Họ và Tên */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      Họ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      Tên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Password Section (Chỉ hiện khi Create) */}
                {modalMode === "create" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        <Key size={14} /> Mật khẩu *
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                        <Key size={14} /> Xác nhận *
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                )}

                {/* Giới tính, Vai trò, Hạng */}
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Giới tính
                    </label>
                    <div className="relative group">
                      <select
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 pointer-events-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <Shield size={14} className="text-slate-400" /> Vai trò
                      </label>
                      <div className="relative">
                        <select
                          value={
                            formData.roles?.includes("ADMIN") ? "ADMIN" : "USER"
                          }
                          onChange={handleRolesChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                        >
                          <option value="USER">Khách hàng</option>
                          <option value="ADMIN">Quản trị viên</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <Award size={14} className="text-slate-400" /> Hạng
                      </label>
                      <div className="relative">
                        <select
                          value={normalizeTierName(formData.membership)}
                          onChange={handleMembershipChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-indigo-600"
                        >
                          <option value="member">Thành viên</option>
                          <option value="silver">Bạc</option>
                          <option value="gold">Vàng</option>
                          <option value="diamond">Kim cương</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                      </div>
                    </div> */}
                    {/* Hạng thành viên */}
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <Award size={14} className="text-slate-400" /> Hạng
                        thành viên
                      </label>
                      <div className="relative">
                        <select
                          value={
                            formData.membership?.tierName?.toLowerCase() || ""
                          }
                          onChange={handleMembershipChange}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                        >
                          <option value="member">Thành viên</option>
                          <option value="silver">Bạc</option>
                          <option value="gold">Vàng</option>
                          <option value="diamond">Kim cương</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200/50 transition-all"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className={`px-8 py-2.5 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95 ${modalMode === "create" ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200" : "bg-amber-600 hover:bg-amber-700 shadow-amber-200"}`}
              >
                {modalMode === "create" ? "Tạo người dùng" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* chi tiết người dùng */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
            {/* Header with Gradient Background */}
            <div className="relative h-32 flex-shrink-0 bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-900 p-6 overflow-hidden">
              <button
                onClick={handleCloseDetailModal}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors z-50"
              >
                <X size={20} />
              </button>

              <div className="absolute inset-0 flex items-center px-8">
                <div className="flex items-center gap-5 w-full">
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        selectedUser.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedUser.firstName + " " + selectedUser.lastName,
                        )}&size=128&background=random&color=fff`
                      }
                      alt="Avatar"
                      className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm ${selectedUser.isActive ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                  </div>

                  {/* Phần chữ */}
                  <div>
                    <h2 className="text-2xl font-bold text-white drop-shadow-md">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h2>
                    <p className="flex items-center gap-1 text-white/95 text-sm font-medium drop-shadow-sm mt-0.5">
                      @{selectedUser.username || "user"}
                      <span className="text-white/70">•</span>
                      <span className="font-semibold">
                        {selectedUser.roles.includes("ADMIN")
                          ? "Quản trị viên"
                          : "Khách hàng"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pt-16 pb-8 px-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Info Card 1: Contact */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                      <Mail size={19} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
                      <Phone size={19} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                        Số điện thoại
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedUser.phone || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Card 2: Personal */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                      <User size={19} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                        Giới tính
                      </p>
                      <p className="text-sm font-semibold text-slate-800">
                        {selectedUser.gender === "male"
                          ? "Nam"
                          : selectedUser.gender === "female"
                            ? "Nữ"
                            : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                      <Award size={19} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                        Hạng thành viên
                      </p>
                      <p className="text-sm font-semibold text-slate-800 uppercase tracking-tight">
                        {TIER_LABEL[
                          normalizeTierName(selectedUser.membership)
                        ] || "Thành viên"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata Cards */}
                <div className="col-span-full grid grid-cols-3 gap-3">
                  <div className="p-4 text-center rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <Shield
                      size={17}
                      className="mx-auto mb-1.5 text-slate-400"
                    />
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Trạng thái
                    </p>
                    <div className="flex justify-center items-center gap-1">
                      {selectedUser.isActive ? (
                        <span className="flex items-center text-sm font-semibold text-green-700">
                          <CheckCircle2 size={15} className="mr-1" /> Hoạt động
                        </span>
                      ) : (
                        <span className="flex items-center text-sm font-semibold text-red-700">
                          <AlertCircle size={15} className="mr-1" /> Bị chặn
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 text-center rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <Calendar
                      size={17}
                      className="mx-auto mb-1.5 text-slate-400"
                    />
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Ngày tạo
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {formatOnlyDate(selectedUser.createdAt)}
                    </p>
                  </div>

                  <div className="p-4 text-center rounded-2xl bg-white border border-slate-100 shadow-sm">
                    <Calendar
                      size={17}
                      className="mx-auto mb-1.5 text-slate-400"
                    />
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Cập nhật
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {formatOnlyDate(selectedUser.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={19} className="text-rose-500" />
                    <h3 className="text-lg font-bold text-slate-800">
                      Sổ địa chỉ
                    </h3>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                      {selectedUser.addresses.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {selectedUser.addresses.map((addr, index) => (
                      <div
                        key={addr._id ?? index}
                        className={`p-5 rounded-2xl border transition-all hover:shadow-md ${
                          addr.defaultAddress
                            ? "bg-indigo-50 border-indigo-200"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-bold text-slate-800 flex items-center gap-2">
                            {addr.receiverName || "—"}
                            {addr.defaultAddress && (
                              <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-medium">
                                Mặc định
                              </span>
                            )}
                          </p>
                          <span className="text-sm text-slate-500 font-medium">
                            {addr.phone}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-sm">
                          {[addr.street, addr.ward, addr.district, addr.province]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleCloseDetailModal}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-all shadow-sm"
              >
                Đóng chi tiết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
