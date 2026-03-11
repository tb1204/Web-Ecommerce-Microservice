// // import { useUser, useClerk } from "@clerk/clerk-react";
// // import { useState, useEffect } from "react";
// // import {
// //   FiCamera,
// //   FiMail,
// //   FiLock,
// //   FiMapPin,
// //   FiTrash2,
// //   FiSave,
// //   FiUser,
// // } from "react-icons/fi";

// // const CustomProfile = () => {
// //   const { isLoaded, isSignedIn, user } = useUser();
// //   const { signOut } = useClerk();

// //   // Clerk fields
// //   const [username, setUsername] = useState(user?.username || "");
// //   const [firstName, setFirstName] = useState(user?.firstName || "");
// //   const [lastName, setLastName] = useState(user?.lastName || "");

// //   // Custom fields
// //   const [phone, setPhone] = useState("");
// //   const [gender, setGender] = useState("");
// //   const [membership] = useState("Đồng");
// //   const [addresses, setAddresses] = useState<
// //     { id: string; value: string; isDefault: boolean }[]
// //   >([]);
// //   const [newAddress, setNewAddress] = useState("");

// //   // States for Password & Email (giữ nguyên logic của bạn)
// //   const [currentPassword, setCurrentPassword] = useState("");
// //   const [newPassword, setNewPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [passwordError, setPasswordError] = useState("");
// //   const [newEmail, setNewEmail] = useState("");
// //   const [verificationStep, setVerificationStep] = useState(false);
// //   const [verificationCode, setVerificationCode] = useState("");
// //   const [emailAddressInstance, setEmailAddressInstance] = useState<any>(null);
// //   const [isChangingEmail, setIsChangingEmail] = useState(false);
// //   const [isVerifying, setIsVerifying] = useState(false);

// //   useEffect(() => {
// //     if (isLoaded && user) {
// //       setUsername(user.username || "");
// //       setFirstName(user.firstName || "");
// //       setLastName(user.lastName || "");
// //       // Đổi publicMetadata thành unsafeMetadata
// //       const meta = user.unsafeMetadata || {};
// //       setPhone((meta.phone as string) || "");
// //       setGender((meta.gender as string) || "");
// //       const savedAddresses = (meta.addresses as any[]) || [];
// //       setAddresses(savedAddresses.length > 0 ? savedAddresses : []);
// //     }
// //   }, [isLoaded, user]);

// //   if (!isLoaded)
// //     return (
// //       <div className="flex justify-center items-center min-h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14532d]"></div>
// //       </div>
// //     );
// //   if (!isSignedIn) return null;

// //   const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;
// //     try {
// //       await user?.setProfileImage({ file });
// //       alert("Ảnh đại diện đã cập nhật!");
// //     } catch (err) {
// //       alert("Có lỗi khi upload ảnh.");
// //     }
// //   };

// //   const handleSaveAll = async () => {
// //     try {
// //       await user?.update({
// //         username: username || undefined,
// //         firstName: firstName || undefined,
// //         lastName: lastName || undefined,
// //         unsafeMetadata: { phone, gender, membership, addresses },
// //       });
// //       alert("Đã lưu thông tin thành công!");
// //     } catch (err: any) {
// //       alert(err.errors?.[0]?.message || "Lỗi khi lưu");
// //     }
// //   };
// //   const handleChangePassword = async () => {
// //     setPasswordError("");
// //     if (newPassword !== confirmPassword)
// //       return setPasswordError("Mật khẩu không khớp.");
// //     try {
// //       await user?.updatePassword({
// //         currentPassword,
// //         newPassword,
// //         signOutOfOtherSessions: true,
// //       });
// //       alert("Đổi mật khẩu thành công!");
// //       setCurrentPassword("");
// //       setNewPassword("");
// //       setConfirmPassword("");
// //     } catch (err: any) {
// //       setPasswordError(err.errors?.[0]?.message || "Lỗi hệ thống.");
// //     }
// //   };

// //   const handleChangeEmail = async () => {
// //     setIsChangingEmail(true);
// //     try {
// //       const emailRes = await user?.createEmailAddress({
// //         email: newEmail, // Đổi emailAddress thành email
// //       });
// //       await emailRes?.prepareVerification({ strategy: "email_code" });
// //       setEmailAddressInstance(emailRes);
// //       setVerificationStep(true);
// //     } catch (err: any) {
// //       alert(err.errors?.[0]?.message || "Lỗi!");
// //     } finally {
// //       setIsChangingEmail(false);
// //     }
// //   };

// //   const getTierBadgeClass = (tierName?: string) => {
// //     switch (tierName) {
// //       case "Member":
// //         return `
// //         bg-orange-100 text-orange-700 border border-orange-200
// //         dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800
// //       `;

// //       case "Silver":
// //         return `
// //         bg-gray-100 text-gray-700 border border-gray-300
// //         dark:bg-gray-700/40 dark:text-gray-200 dark:border-gray-600
// //       `;

// //       case "Gold":
// //         return `
// //         bg-yellow-100 text-yellow-800 border border-yellow-300
// //         dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800
// //       `;

// //       case "Diamond":
// //         return `
// //         bg-blue-50 text-blue-700 border border-blue-200
// //         dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800
// //       `;

// //       default:
// //         return `
// //         bg-gray-100 text-gray-600 border border-gray-200
// //         dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600
// //       `;
// //     }
// //   };

// //   const handleVerifyCode = async () => {
// //     setIsVerifying(true);
// //     try {
// //       await emailAddressInstance.attemptVerification({
// //         code: verificationCode,
// //       });

// //       // Sửa setPrimaryEmailAddress thành user.update
// //       await user?.update({
// //         primaryEmailAddressId: emailAddressInstance.id,
// //       });

// //       alert("Thay đổi email thành công!");
// //       setVerificationStep(false);
// //       setNewEmail("");
// //     } catch (err: any) {
// //       alert("Mã OTP sai hoặc lỗi hệ thống!");
// //     } finally {
// //       setIsVerifying(false);
// //     }
// //   };

// //   const addAddress = () => {
// //     if (!newAddress.trim()) return;
// //     setAddresses([
// //       ...addresses,
// //       {
// //         id: Date.now().toString(),
// //         value: newAddress,
// //         isDefault: addresses.length === 0,
// //       },
// //     ]);
// //     setNewAddress("");
// //   };

// //   const handleDeleteAccount = async () => {
// //     if (!window.confirm("Xác nhận xóa tài khoản VĨNH VIỄN?")) return;
// //     try {
// //       await user?.delete();
// //       await signOut();
// //       window.location.href = "/";
// //     } catch (err) {
// //       alert("Lỗi khi xóa.");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 py-12 px-4 sm:px-6">
// //       <div className="max-w-4xl mx-auto space-y-8">
// //         {/* Header Profile */}
// //         <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-8">
// //           <div className="relative group">
// //             <img
// //               src={user?.imageUrl}
// //               alt="Avatar"
// //               className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-50 dark:ring-gray-800 shadow-md"
// //             />
// //             <label className="absolute -bottom-2 -right-2 bg-[#14532d] p-2 rounded-xl text-white cursor-pointer hover:scale-110 transition shadow-lg">
// //               <FiCamera size={18} />
// //               <input
// //                 type="file"
// //                 className="hidden"
// //                 accept="image/*"
// //                 onChange={handleAvatarUpload}
// //               />
// //             </label>
// //           </div>
// //           <div className="text-center md:text-left space-y-1">
// //             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
// //               {user?.fullName || "Người dùng"}
// //             </h1>
// //             <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2">
// //               <FiMail className="inline" />{" "}
// //               {user?.primaryEmailAddress?.emailAddress}
// //             </p>
// //             <span
// //               className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2 ${getTierBadgeClass(membership)}`}
// //             >
// //               Hạng: {membership}
// //             </span>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* Left Column: Information */}
// //           <div className="lg:col-span-2 space-y-8">
// //             {/* Basic Info Card */}
// //             <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
// //               <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
// //                 <FiUser className="text-[#14532d]" size={20} />
// //                 <h2 className="text-lg font-bold">Thông tin cá nhân</h2>
// //               </div>
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
// //                 <div className="space-y-2">
// //                   <label className="text-xs font-bold text-gray-400 uppercase ml-1">
// //                     Username
// //                   </label>
// //                   <input
// //                     value={username}
// //                     onChange={(e) => setUsername(e.target.value)}
// //                     className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <label className="text-xs font-bold text-gray-400 uppercase ml-1">
// //                     Số điện thoại
// //                   </label>
// //                   <input
// //                     value={phone}
// //                     onChange={(e) => setPhone(e.target.value)}
// //                     className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <label className="text-xs font-bold text-gray-400 uppercase ml-1">
// //                     Họ
// //                   </label>
// //                   <input
// //                     value={firstName}
// //                     onChange={(e) => setFirstName(e.target.value)}
// //                     className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
// //                   />
// //                 </div>
// //                 <div className="space-y-2">
// //                   <label className="text-xs font-bold text-gray-400 uppercase ml-1">
// //                     Tên
// //                   </label>
// //                   <input
// //                     value={lastName}
// //                     onChange={(e) => setLastName(e.target.value)}
// //                     className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
// //                   />
// //                 </div>
// //                 <div className="space-y-2 md:col-span-2">
// //                   <label className="text-xs font-bold text-gray-400 uppercase ml-1">
// //                     Giới tính
// //                   </label>
// //                   <select
// //                     value={gender}
// //                     onChange={(e) => setGender(e.target.value)}
// //                     className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
// //                   >
// //                     <option value="">Chọn giới tính</option>
// //                     <option value="male">Nam</option>
// //                     <option value="female">Nữ</option>
// //                     <option value="other">Khác</option>
// //                   </select>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Address Card */}
// //             <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
// //               <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
// //                 <FiMapPin className="text-[#14532d]" size={20} />
// //                 <h2 className="text-lg font-bold">Địa chỉ nhận hàng</h2>
// //               </div>
// //               <div className="flex gap-2 mb-6">
// //                 <input
// //                   value={newAddress}
// //                   onChange={(e) => setNewAddress(e.target.value)}
// //                   placeholder="Thêm địa chỉ mới..."
// //                   className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
// //                 />
// //                 <button
// //                   onClick={addAddress}
// //                   className="bg-[#14532d] hover:bg-[#0f3d21] text-white px-6 rounded-xl font-bold transition"
// //                 >
// //                   Thêm
// //                 </button>
// //               </div>
// //               <div className="space-y-3">
// //                 {addresses.map((addr) => (
// //                   <div
// //                     key={addr.id}
// //                     className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition"
// //                   >
// //                     <div className="flex items-center gap-3 text-sm">
// //                       <span className="font-medium text-gray-700 dark:text-gray-300">
// //                         {addr.value}
// //                       </span>
// //                       {addr.isDefault && (
// //                         <span className="bg-[#14532d]/10 text-[#14532d] text-[10px] font-bold px-2 py-0.5 rounded-full">
// //                           Mặc định
// //                         </span>
// //                       )}
// //                     </div>
// //                     <div className="flex gap-4">
// //                       {!addr.isDefault && (
// //                         <button
// //                           onClick={() =>
// //                             setAddresses(
// //                               addresses.map((a) => ({
// //                                 ...a,
// //                                 isDefault: a.id === addr.id,
// //                               })),
// //                             )
// //                           }
// //                           className="text-gray-400 hover:text-[#14532d] text-xs font-bold uppercase transition"
// //                         >
// //                           Đặt mặc định
// //                         </button>
// //                       )}
// //                       <button
// //                         onClick={() =>
// //                           setAddresses(
// //                             addresses.filter((a) => a.id !== addr.id),
// //                           )
// //                         }
// //                         className="text-gray-400 hover:text-red-500 transition"
// //                       >
// //                         <FiTrash2 size={16} />
// //                       </button>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Right Column: Security */}
// //           <div className="space-y-8">
// //             {/* Email Change Card */}
// //             <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
// //               <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
// //                 <FiMail className="text-[#14532d]" /> Thay đổi Email
// //               </h2>
// //               <div className="space-y-4">
// //                 <input
// //                   type="email"
// //                   value={newEmail}
// //                   onChange={(e) => setNewEmail(e.target.value)}
// //                   placeholder="Email mới..."
// //                   className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
// //                 />
// //                 <button
// //                   onClick={handleChangeEmail}
// //                   disabled={isChangingEmail}
// //                   className="w-full py-3 bg-[#14532d] hover:bg-[#0f3d21] text-white rounded-xl font-bold transition disabled:opacity-50"
// //                 >
// //                   Gửi mã xác thực
// //                 </button>
// //                 {verificationStep && (
// //                   <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30">
// //                     <p className="text-xs text-orange-700 dark:text-orange-400 mb-3 font-medium text-center">
// //                       Nhập mã OTP từ email mới
// //                     </p>
// //                     <div className="flex gap-2">
// //                       <input
// //                         value={verificationCode}
// //                         onChange={(e) => setVerificationCode(e.target.value)}
// //                         maxLength={6}
// //                         className="w-full text-center tracking-widest px-4 py-2 bg-white dark:bg-gray-800 border border-orange-200 rounded-lg focus:ring-1 focus:ring-orange-500 outline-none transition"
// //                       />
// //                       <button
// //                         onClick={handleVerifyCode}
// //                         disabled={isVerifying}
// //                         className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-lg transition font-bold text-sm"
// //                       >
// //                         Xác nhận
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Password Change Card */}
// //             <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
// //               <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
// //                 <FiLock className="text-[#14532d]" /> Bảo mật
// //               </h2>
// //               <div className="space-y-4">
// //                 <input
// //                   type="password"
// //                   value={currentPassword}
// //                   onChange={(e) => setCurrentPassword(e.target.value)}
// //                   placeholder="Mật khẩu cũ"
// //                   className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
// //                 />
// //                 <input
// //                   type="password"
// //                   value={newPassword}
// //                   onChange={(e) => setNewPassword(e.target.value)}
// //                   placeholder="Mật khẩu mới"
// //                   className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
// //                 />
// //                 <input
// //                   type="password"
// //                   value={confirmPassword}
// //                   onChange={(e) => setConfirmPassword(e.target.value)}
// //                   placeholder="Xác nhận lại"
// //                   className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
// //                 />
// //                 {passwordError && (
// //                   <p className="text-red-500 text-[11px] font-bold text-center uppercase">
// //                     {passwordError}
// //                   </p>
// //                 )}
// //                 <button
// //                   onClick={handleChangePassword}
// //                   className="w-full py-3 bg-[#14532d] hover:bg-[#0f3d21] text-white rounded-xl font-bold transition"
// //                 >
// //                   Đổi mật khẩu
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Bottom Actions */}
// //         <div className="flex flex-col sm:flex-row gap-4 pt-4">
// //           <button
// //             onClick={handleSaveAll}
// //             className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#14532d] hover:bg-[#0f3d21] text-white rounded-2xl font-bold shadow-lg shadow-[#14532d]/20 transition transform active:scale-95"
// //           >
// //             <FiSave /> Lưu tất cả thay đổi
// //           </button>
// //           <button
// //             onClick={handleDeleteAccount}
// //             className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-600/20 transition transform active:scale-95"
// //           >
// //             <FiTrash2 /> Xóa tài khoản vĩnh viễn
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CustomProfile;

import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
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

const CustomProfile = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [membership, setMembership] = useState("Member");
  const [addresses, setAddresses] = useState<
    { id: string; value: string; isDefault: boolean }[]
  >([]);
  const [newAddress, setNewAddress] = useState("");
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
        const res = await axios.get("http://localhost:8080/api/users/me", {
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
  }, [isLoaded, user]);

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
        "http://localhost:8080/api/users/me",
        { avatarUrl: user?.imageUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Ảnh đại diện đã cập nhật!");
    } catch (err) {
      alert("Có lỗi khi upload ảnh.");
    }
  };

  // ── SAVE ALL: cập nhật DB trước, rồi đồng bộ lên Clerk ──────────────
  // const handleSaveAll = async () => {
  //   try {
  //     const token = await getToken({ template: "my-backend" });

  //     // 1. Cập nhật DB trước — DB là nguồn chính
  //     await axios.put(
  //       "http://localhost:8080/api/users/me",
  //       { firstName, lastName, phone, gender, avatarUrl: user?.imageUrl },
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );

  //     // 2. Đồng bộ lên Clerk (để JWT claims khớp)
  //     await user?.update({
  //       username: username || undefined,
  //       firstName: firstName || undefined,
  //       lastName: lastName || undefined,
  //     });

  //     alert("Đã lưu thông tin thành công!");
  //   } catch (err: any) {
  //     alert(
  //       err.response?.data?.message ||
  //         err.errors?.[0]?.message ||
  //         "Lỗi khi lưu",
  //     );
  //   }
  // };

  // `  const handleSaveAll = async () => {
  //     try {
  //       const token = await getToken({ template: "my-backend" });
  //       console.log("Payload gửi lên:", {
  //         firstName,
  //         lastName,
  //         phone,
  //         gender,
  //         avatarUrl: user?.imageUrl,
  //       });

  //       // 1. Cập nhật DB TRƯỚC — phone, gender lưu ở đây
  //       await axios.put(
  //         "http://localhost:8080/api/users/me",
  //         { firstName, lastName, phone, gender, avatarUrl: user?.imageUrl },
  //         { headers: { Authorization: `Bearer ${token}` } },
  //       );

  //       // 2. Sync Clerk SAU — CHỈ các field Clerk hỗ trợ
  //       // KHÔNG truyền phone, gender vào đây
  //       await user?.update({
  //         username: username || undefined,
  //         firstName: firstName || undefined,
  //         lastName: lastName || undefined,
  //       });

  //       alert("Đã lưu thông tin thành công!");
  //     } catch (err: any) {
  //       alert(
  //         err.response?.data?.message ||
  //           err.errors?.[0]?.message ||
  //           "Lỗi khi lưu",
  //       );
  //     }
  //   };`

  const handleSaveAll = async () => {
    try {
      const token = await getToken({ template: "my-backend" });

      // Chỉ cập nhật DB — đủ rồi
      await axios.put(
        "http://localhost:8080/api/users/me",
        { firstName, lastName, phone, gender, avatarUrl: user?.imageUrl },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Đã lưu thông tin thành công!");
    } catch (err: any) {
      console.error("Lỗi:", err);
      alert(err.response?.data?.message || "Lỗi khi lưu");
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
      alert("Đổi mật khẩu thành công!");
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
      alert(err.errors?.[0]?.message || "Lỗi!");
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
        "http://localhost:8080/api/users/me",
        { email: newEmail },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Thay đổi email thành công!");
      setVerificationStep(false);
      setNewEmail("");
    } catch (err: any) {
      alert("Mã OTP sai hoặc lỗi hệ thống!");
    } finally {
      setIsVerifying(false);
    }
  };

  const getTierBadgeClass = (tierName?: string) => {
    switch (tierName) {
      case "Member":
        return "bg-orange-100 text-orange-700 border border-orange-200";
      case "Silver":
        return "bg-gray-100 text-gray-700 border border-gray-300";
      case "Gold":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Diamond":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const addAddress = () => {
    if (!newAddress.trim()) return;
    setAddresses([
      ...addresses,
      {
        id: Date.now().toString(),
        value: newAddress,
        isDefault: addresses.length === 0,
      },
    ]);
    setNewAddress("");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Xác nhận xóa tài khoản VĨNH VIỄN?")) return;
    try {
      await user?.delete();
      await signOut();
      window.location.href = "/";
    } catch (err) {
      alert("Lỗi khi xóa.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <img
              src={user?.imageUrl}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-50 dark:ring-gray-800 shadow-md"
            />
            <label className="absolute -bottom-2 -right-2 bg-[#14532d] p-2 rounded-xl text-white cursor-pointer hover:scale-110 transition shadow-lg">
              <FiCamera size={18} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </label>
          </div>
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {firstName} {lastName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2">
              <FiMail className="inline" />{" "}
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2 ${getTierBadgeClass(membership)}`}
            >
              Hạng: {membership}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
                <FiUser className="text-[#14532d]" size={20} />
                <h2 className="text-lg font-bold">Thông tin cá nhân</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: "Username", value: username, set: setUsername },
                  { label: "Số điện thoại", value: phone, set: setPhone },
                  { label: "Họ", value: firstName, set: setFirstName },
                  { label: "Tên", value: lastName, set: setLastName },
                ].map(({ label, value, set }) => (
                  <div key={label} className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                      {label}
                    </label>
                    <input
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
                    />
                  </div>
                ))}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Giới tính
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
                <FiMapPin className="text-[#14532d]" size={20} />
                <h2 className="text-lg font-bold">Địa chỉ nhận hàng</h2>
              </div>
              <div className="flex gap-2 mb-6">
                <input
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Thêm địa chỉ mới..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
                />
                <button
                  onClick={addAddress}
                  className="bg-[#14532d] hover:bg-[#0f3d21] text-white px-6 rounded-xl font-bold transition"
                >
                  Thêm
                </button>
              </div>
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition"
                  >
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {addr.value}
                      </span>
                      {addr.isDefault && (
                        <span className="bg-[#14532d]/10 text-[#14532d] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4">
                      {!addr.isDefault && (
                        <button
                          onClick={() =>
                            setAddresses(
                              addresses.map((a) => ({
                                ...a,
                                isDefault: a.id === addr.id,
                              })),
                            )
                          }
                          className="text-gray-400 hover:text-[#14532d] text-xs font-bold uppercase transition"
                        >
                          Đặt mặc định
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setAddresses(
                            addresses.filter((a) => a.id !== addr.id),
                          )
                        }
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Security */}
          <div className="space-y-8">
            {/* Email */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FiMail className="text-[#14532d]" /> Thay đổi Email
              </h2>
              <div className="space-y-4">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Email mới..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
                />
                <button
                  onClick={handleChangeEmail}
                  disabled={isChangingEmail}
                  className="w-full py-3 bg-[#14532d] hover:bg-[#0f3d21] text-white rounded-xl font-bold transition disabled:opacity-50"
                >
                  Gửi mã xác thực
                </button>
                {verificationStep && (
                  <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                    <p className="text-xs text-orange-700 dark:text-orange-400 mb-3 font-medium text-center">
                      Nhập mã OTP từ email mới
                    </p>
                    <div className="flex gap-2">
                      <input
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        className="w-full text-center tracking-widest px-4 py-2 bg-white dark:bg-gray-800 border border-orange-200 rounded-lg focus:ring-1 focus:ring-orange-500 outline-none transition"
                      />
                      <button
                        onClick={handleVerifyCode}
                        disabled={isVerifying}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-lg transition font-bold text-sm"
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FiLock className="text-[#14532d]" /> Bảo mật
              </h2>
              <div className="space-y-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Mật khẩu cũ"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mật khẩu mới"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Xác nhận lại"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 rounded-xl focus:outline-none focus:border-gray-600 dark:focus:border-white transition"
                />
                {passwordError && (
                  <p className="text-red-500 text-[11px] font-bold text-center uppercase">
                    {passwordError}
                  </p>
                )}
                <button
                  onClick={handleChangePassword}
                  className="w-full py-3 bg-[#14532d] hover:bg-[#0f3d21] text-white rounded-xl font-bold transition"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={handleSaveAll}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#14532d] hover:bg-[#0f3d21] text-white rounded-2xl font-bold shadow-lg shadow-[#14532d]/20 transition transform active:scale-95"
          >
            <FiSave /> Lưu tất cả thay đổi
          </button>
          <button
            onClick={handleDeleteAccount}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-600/20 transition transform active:scale-95"
          >
            <FiTrash2 /> Xóa tài khoản vĩnh viễn
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomProfile;
