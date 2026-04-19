import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiCamera,
  FiMail,
  FiLock,
  FiMapPin,
  FiTrash2,
  FiSave,
  FiUser,
} from "react-icons/fi";

import { toast } from "sonner";
import { ChevronRight } from "lucide-react";

const CustomProfile = () => {
  // const BASE_URL = "http://localhost:8081";
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [membership, setMembership] = useState("Member");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailAddressInstance, setEmailAddressInstance] = useState<any>(null);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // ── LẤY DỮ LIỆU TỪ DATABASE khi vào trang ──────────────────────────
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const token = await getToken({ template: "my-backend" });
        console.log("JWT TOKEN:", token);
        const res = await axios.get(`${BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        // Tất cả lấy từ DB — DB là source of truth
        setUsername(data.username || "");
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPhone(data.phone || "");
        setGender(data.gender || "");
        setMembership(data.membership?.tierName || data.membership || "Member");
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error("Lỗi load profile từ DB:", err);
        // Fallback về Clerk nếu DB lỗi
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setUsername(user.username || "");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [isLoaded]);
  // [isLoaded, user]); ghi đè uername

  if (!isLoaded || loadingProfile)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14532d]" />
      </div>
    );
  if (!isSignedIn) return null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // 1. Upload lên Clerk
      await user?.setProfileImage({ file });

      // 2. Reload user để lấy imageUrl mới
      await user?.reload();

      // 3. Đồng bộ về DB
      const token = await getToken({ template: "my-backend" });
      await axios.put(
        `${BASE_URL}/api/users/me`,
        { avatarUrl: user?.imageUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Ảnh đại diện đã cập nhật!");
    } catch (err) {
      toast.error("Có lỗi khi upload ảnh.");
    }
  };

  const handleSaveAll = async () => {
    // --- Bắt đầu kiểm tra tính hợp lệ (Validation) ---
    if (username.length < 3 || username.length > 20) {
      return toast.error("Username phải từ 3 đến 20 ký tự.");
    }
    if (firstName.length < 3 || firstName.length > 20) {
      return toast.error("Họ phải từ 3 đến 20 ký tự.");
    }
    if (lastName.length < 3 || lastName.length > 20) {
      return toast.error("Tên phải từ 3 đến 20 ký tự.");
    }
    
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      return toast.error("Số điện thoại không hợp lệ (cần đúng 10 hoặc 11 chữ số).");
    }
    // --- Kết thúc kiểm tra ---

    try {
      const token = await getToken({ template: "my-backend" });
      console.log("USERNAME TRƯỚC KHI SAVE:", username);
      // Chỉ cập nhật DB — đủ rồi
      await axios.put(
        `${BASE_URL}/api/users/me`,
        {
          firstName,
          lastName,
          phone,
          gender,
          avatarUrl: user?.imageUrl,
          username,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Đã lưu thông tin thành công!");
    } catch (err: any) {
      console.error("Lỗi:", err);
      toast.error(err.response?.data?.message || "Lỗi khi lưu");
    }
  };
  const handleChangePassword = async () => {
    setPasswordError("");
    if (newPassword !== confirmPassword)
      return setPasswordError("Mật khẩu không khớp.");
    try {
      await user?.updatePassword({
        currentPassword,
        newPassword,
        signOutOfOtherSessions: true,
      });
      toast.success("Đổi mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.errors?.[0]?.message || "Lỗi hệ thống.");
    }
  };

  const handleChangeEmail = async () => {
    setIsChangingEmail(true);
    try {
      const emailRes = await user?.createEmailAddress({ email: newEmail });
      await emailRes?.prepareVerification({ strategy: "email_code" });
      setEmailAddressInstance(emailRes);
      setVerificationStep(true);
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Lỗi!");
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    try {
      await emailAddressInstance.attemptVerification({
        code: verificationCode,
      });
      await user?.update({ primaryEmailAddressId: emailAddressInstance.id });

      // Đồng bộ email mới về DB
      const token = await getToken({ template: "my-backend" });
      await axios.put(
        `${BASE_URL}/api/users/me`,
        { email: newEmail },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Thay đổi email thành công!");
      setVerificationStep(false);
      setNewEmail("");
    } catch (err: any) {
      toast.error("Mã OTP sai hoặc lỗi hệ thống!");
    } finally {
      setIsVerifying(false);
    }
  };

  const getTierBadgeClass = (tierName?: string) => {
    switch (tierName) {
      case "Member":
        return "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      case "Silver":
        return "bg-gray-200 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";
      case "Gold":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-300 dark:from-yellow-900/40 dark:to-amber-900/40 dark:text-yellow-400 dark:border-yellow-700/50";
      case "Diamond":
        return "bg-gradient-to-r from-cyan-100 to-blue-100 text-blue-800 border border-blue-300 dark:from-cyan-900/40 dark:to-blue-900/40 dark:text-cyan-300 dark:border-cyan-700/50";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  const handleSetDefault = async (addrId: string) => {
    try {
      const token = await getToken({ template: "my-backend" });
      const res = await axios.put(
        `${BASE_URL}/api/users/me/addresses/${addrId}/default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAddresses(res.data);
      toast.success("Đã đặt địa chỉ mặc định!");
    } catch {
      toast.error("Không thể thay đổi địa chỉ mặc định.");
    }
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!window.confirm("Đồng ý xóa địa chỉ này?")) return;
    try {
      const token = await getToken({ template: "my-backend" });
      const res = await axios.delete(
        `${BASE_URL}/api/users/me/addresses/${addrId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAddresses(res.data);
      toast.success("Đã xóa địa chỉ!");
    } catch {
      toast.error("Không thể xóa địa chỉ.");
    }
  };


  const handleDeleteAccount = async () => {
    if (!window.confirm("Xác nhận xóa tài khoản VĨNH VIỄN?")) return;

    try {
      const token = await getToken({ template: "my-backend" });

      await axios.delete(`${BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await signOut();
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xóa tài khoản.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-900/5 to-transparent dark:from-blue-900/10 pointer-events-none" />
      <div className="absolute top-20 -left-64 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 -right-64 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto space-y-8 relative z-10">
        {/* Header Cover + Avatar */}
        <div className="relative rounded-[32px] md:rounded-[40px] bg-white dark:bg-gray-800/90 shadow-xl shadow-gray-200/40 dark:shadow-black/40 border border-gray-100 dark:border-gray-700/50 backdrop-blur-xl overflow-hidden mb-10 transition-all">
          <div className="h-48 md:h-56 bg-slate-900 dark:bg-[#050505] overflow-hidden relative">
            {/* Premium Mesh Gradient Blurs */}
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/40 dark:bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen" />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/40 dark:bg-purple-900/30 blur-[100px] rounded-full mix-blend-screen" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-500/20 dark:bg-emerald-900/10 blur-[120px] rounded-full" />
            {/* Futuristic Dot Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>

          <div className="px-6 md:px-12 pb-10 pt-0 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 relative">
            {/* Avatar overlapping */}
            <div className="relative -mt-20 md:-mt-24 group z-10 w-36 h-36 md:w-44 md:h-44">
              <img
                src={user?.imageUrl}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover ring-8 ring-white dark:ring-gray-800 shadow-2xl bg-white transition-transform duration-500 group-hover:scale-105"
              />
              <label className="absolute bottom-2 right-2 bg-white dark:bg-gray-700 p-3 rounded-full text-[#14532d] dark:text-emerald-400 cursor-pointer hover:bg-emerald-50 dark:hover:bg-gray-600 shadow-xl border-2 border-white dark:border-gray-800 transition-all hover:scale-110 active:scale-95">
                <FiCamera size={20} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>

            {/* Info */}
            <div className="text-center md:text-left md:mb-3 flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                {firstName} {lastName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center md:justify-start gap-2 mt-2 text-sm md:text-base">
                <FiMail /> {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>

            <div className="mt-2 md:mt-0 md:mb-5">
              <button
                onClick={() => navigate("/my-stats")}
                title="Xem thống kê mua hàng"
                className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 ${getTierBadgeClass(membership)}`}
              >
                Hạng: {membership}
       <ChevronRight
  size={12}
  className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
/>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Col: Info + Address */}
          <div className="xl:col-span-7 space-y-8">
            {/* Basic Info */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-sm border border-white/20 dark:border-gray-700/50 shadow-gray-200/50 dark:shadow-black/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-colors duration-700 pointer-events-none" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-[#14532d] dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-800/30">
                  <FiUser size={22} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Thông tin cá nhân
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                {[
                  { label: "Username", value: username, set: setUsername },
                  { label: "Số điện thoại", value: phone, set: setPhone },
                  { label: "Họ", value: firstName, set: setFirstName },
                  { label: "Tên", value: lastName, set: setLastName },
                ].map(({ label, value, set }) => (
                  <div key={label} className="space-y-2">
                    <label className="text-[11px] font-black tracking-widest text-gray-400 dark:text-gray-500 uppercase ml-1">
                      {label}
                    </label>
                    <input
                      value={value}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (label === "Số điện thoại") {
                          val = val.replace(/[^0-9]/g, ""); // Ngăn nhập chữ, chỉ lấy số
                        }
                        set(val);
                      }}
                      className="w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:border-[#14532d] dark:focus:border-emerald-500 focus:ring-4 focus:ring-[#14532d]/10 dark:focus:ring-emerald-500/10 outline-none transition-all text-sm font-semibold text-gray-800 dark:text-gray-200 shadow-sm shadow-gray-100/50 dark:shadow-none"
                    />
                  </div>
                ))}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[11px] font-black tracking-widest text-gray-400 dark:text-gray-500 uppercase ml-1">
                    Giới tính
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:border-[#14532d] dark:focus:border-emerald-500 focus:ring-4 focus:ring-[#14532d]/10 dark:focus:ring-emerald-500/10 outline-none transition-all text-sm font-semibold text-gray-800 dark:text-gray-200 appearance-none shadow-sm shadow-gray-100/50 dark:shadow-none"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              {/* Action Save Profile */}
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700/50 flex flex-col sm:flex-row justify-between gap-4 relative z-10 w-full">
                <button
                  onClick={handleSaveAll}
                  className="w-full sm:w-auto px-10 flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-emerald-700 to-[#14532d] hover:from-emerald-800 hover:to-green-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#14532d]/20 transition-all active:scale-95"
                >
                  <FiSave size={18} /> Lưu tất cả thay đổi
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full sm:w-auto px-8 flex items-center justify-center gap-3 py-4 bg-white dark:bg-gray-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 border-2 border-red-100 dark:border-red-900/50 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95"
                >
                  <FiTrash2 size={18} /> Xóa tài khoản
                </button>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-sm border border-white/20 dark:border-gray-700/50 shadow-gray-200/50 dark:shadow-black/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors duration-700 pointer-events-none" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/30">
                  <FiMapPin size={22} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Sổ địa chỉ
                </h2>
              </div>
              <div className="space-y-4 relative z-10">
                {addresses.length === 0 && (
                  <div className="py-8 text-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                    <p>Chưa có địa chỉ nào được lưu</p>
                    <p className="text-xs mt-1 text-gray-300 dark:text-gray-600">
                      Địa chỉ sẽ tự động lưu khi bạn đặt hàng
                    </p>
                  </div>
                )}
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="group/addr flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gray-50/80 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all gap-4 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 text-gray-400 group-hover/addr:text-blue-500 transition-colors">
                        <FiMapPin size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                          {addr.street}
                          {addr.ward ? `, ${addr.ward}` : ""}
                          {addr.province ? `, ${addr.province}` : ""}
                        </p>
                        {/* {(addr.receiverName || addr.phone) && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {addr.receiverName}
                            {addr.receiverName && addr.phone ? " — " : ""}
                            {addr.phone}
                          </p>
                        )} */}
                        {(addr.isDefault || addr.defaultAddress) && (
                          <span className="inline-block mt-2.5 bg-blue-100/80 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                            Mặc định
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-center opacity-100 sm:opacity-0 sm:group-hover/addr:opacity-100 transition-opacity">
                      {!(addr.isDefault || addr.defaultAddress) && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          Làm mặc định
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Security */}
          <div className="xl:col-span-5 space-y-8">
            {/* Email */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-sm border border-white/20 dark:border-gray-700/50 shadow-gray-200/50 dark:shadow-black/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 blur-3xl rounded-full group-hover:bg-orange-500/10 transition-colors duration-700 pointer-events-none" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm border border-orange-100 dark:border-orange-800/30">
                  <FiMail size={22} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Đổi Email
                </h2>
              </div>
              <div className="space-y-4 relative z-10">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Email mới của bạn..."
                  className="w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-sm font-semibold shadow-sm"
                />
                <button
                  onClick={handleChangeEmail}
                  disabled={isChangingEmail}
                  className="w-full py-4 bg-gradient-to-r from-emerald-700 to-[#14532d] hover:from-emerald-800 hover:to-green-950 text-white rounded-2xl font-bold transition-all shadow-lg shadow-[#14532d]/20 active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  Gửi mã OTP xác thực
                </button>

                {verificationStep && (
                  <div className="mt-6 p-5 sm:p-6 bg-orange-50/80 dark:bg-orange-900/10 rounded-[24px] border border-orange-200 dark:border-orange-900/50">
                    <p className="text-[11px] uppercase tracking-widest text-orange-700 dark:text-orange-400 mb-4 font-black">
                      Nhập mã 6 số từ Email mới
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        placeholder="••••••"
                        className="flex-1 text-center text-lg tracking-[0.5em] font-mono px-4 py-3 bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-800/50 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all shadow-inner"
                      />
                      <button
                        onClick={handleVerifyCode}
                        disabled={isVerifying}
                        className="bg-gradient-to-r from-emerald-700 to-[#14532d] hover:from-emerald-800 hover:to-green-950 text-white py-3 px-6 rounded-xl transition-all font-bold text-sm shadow-md active:scale-95 disabled:opacity-50 disabled:scale-100"
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-sm border border-white/20 dark:border-gray-700/50 shadow-gray-200/50 dark:shadow-black/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-3xl rounded-full group-hover:bg-purple-500/10 transition-colors duration-700 pointer-events-none" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm border border-purple-100 dark:border-purple-800/30">
                  <FiLock size={22} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Đổi mật khẩu
                </h2>
              </div>
              <div className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Mật khẩu hiện tại"
                    className="w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-sm font-semibold shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mật khẩu mới"
                    className="w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-sm font-semibold shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu mới"
                    className="w-full px-5 py-4 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-sm font-semibold shadow-sm"
                  />
                </div>
                {passwordError && (
                  <p className="text-red-500 bg-red-50 dark:bg-red-900/10 py-3 rounded-xl border border-red-100 dark:border-red-900/30 text-xs font-bold text-center uppercase tracking-widest mt-2">
                    {passwordError}
                  </p>
                )}
                <button
                  onClick={handleChangePassword}
                  className="w-full py-4 mt-2 bg-gradient-to-r from-emerald-700 to-[#14532d] hover:from-emerald-800 hover:to-green-950 text-white rounded-2xl font-bold transition-all shadow-xl shadow-[#14532d]/20 active:scale-95"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-12"></div>
      </div>
    </div>
  );
};

export default CustomProfile;
