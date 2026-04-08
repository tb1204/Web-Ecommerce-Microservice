// // import React, { useState, useRef, useEffect } from "react";
// // import { Wallet, ChevronDown } from "lucide-react";
// // import locationDataRaw from "../data/danhmucxaphuong.json";

// // import goi from "../assets/goi/goi-bong.webp";
// // import { Link } from "react-router-dom";

// // interface Ward {
// //   wardCode: number;
// //   wardName: string;
// // }

// // interface Province {
// //   ministryProvinceCode: number;
// //   statisticsProvinceCode: string;
// //   provinceName: string;
// //   wards: Ward[];
// // }

// // interface CartItem {
// //   id: string;
// //   name: string;
// //   price: number;
// //   quantity: number;
// //   image: string;
// // }

// // const CheckoutPage = () => {
// //   const locationData = locationDataRaw as unknown as Province[];

// //   const [formData, setFormData] = useState({
// //     addressId: "default",
// //     email: "hi@gmail.com",
// //     fullName: "",
// //     phone: "",
// //     addressDetail: "",
// //     province: "",
// //     ward: "",
// //     note: "",
// //     paymentMethod: "", // "", "vnpay", "cod"
// //   });

// //   const [showProvDropdown, setShowProvDropdown] = useState(false);
// //   const [showWardDropdown, setShowWardDropdown] = useState(false);
// //   const [availableWards, setAvailableWards] = useState<Ward[]>([]);

// //   const provRef = useRef<HTMLDivElement>(null);
// //   const wardRef = useRef<HTMLDivElement>(null);

// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (provRef.current && !provRef.current.contains(event.target as Node))
// //         setShowProvDropdown(false);
// //       if (wardRef.current && !wardRef.current.contains(event.target as Node))
// //         setShowWardDropdown(false);
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   const handleInputChange = (
// //     e: React.ChangeEvent<
// //       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
// //     >,
// //   ) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const filteredProvinces = locationData.filter((p) =>
// //     p.provinceName.toLowerCase().includes(formData.province.toLowerCase()),
// //   );

// //   const filteredWards = availableWards.filter((w) =>
// //     w.wardName.toLowerCase().includes(formData.ward.toLowerCase()),
// //   );

// //   const handleSelectProvince = (p: Province) => {
// //     setFormData((prev) => ({ ...prev, province: p.provinceName, ward: "" }));
// //     setAvailableWards(p.wards);
// //     setShowProvDropdown(false);
// //   };

// //   const handleSelectWard = (w: Ward) => {
// //     setFormData((prev) => ({ ...prev, ward: w.wardName }));
// //     setShowWardDropdown(false);
// //   };

// //   const mockCart: CartItem[] = [
// //     {
// //       id: "1",
// //       name: "Bảo vệ nệm Doona Bamboo chống bụi bẩn, thoáng khí",
// //       price: 800000,
// //       quantity: 1,
// //       image: goi,
// //     },
// //     {
// //       id: "2",
// //       name: "Topper memory foam nâng đỡ êm ái Comfy Noah",
// //       price: 2160000,
// //       quantity: 1,
// //       image: goi,
// //     },
// //   ];

// //   const subtotal = mockCart.reduce(
// //     (acc, item) => acc + item.price * item.quantity,
// //     0,
// //   );

// //   // Giả lập phí vận chuyển và giảm giá
// //   const shippingFee = 0; // 0đ nếu miễn phí
// //   const shippingDiscount = 0; // giảm phí vận chuyển
// //   const voucherDiscount = 0; // voucher giảm giá
// //   const memberDiscount = 10000; // hội viên giảm % (hiện tại 0đ)

// //   const totalPayment =
// //     subtotal +
// //     shippingFee -
// //     shippingDiscount -
// //     voucherDiscount -
// //     memberDiscount;

// //   return (
// //     <div
// //       className="min-h-screen bg-[#f8f8f8] text-[#333]
// //                   dark:bg-slate-900 dark:text-gray-100
// //                   font-sans transition-colors duration-300"
// //     >
// //       <div className="max-w-[1200px] mx-auto px-4 py-6">
// //         <div className="flex justify-center mb-8">
// //           <div
// //             className="bg-black dark:bg-white
// //                         text-white dark:text-black
// //                         px-4 py-1 flex items-center
// //                         font-bold text-4xl lg:text-5xl
// //                         tracking-tighter italic"
// //           >
// //             ARTISANO<span className="text-red-600">DELIVERY</span>
// //           </div>
// //         </div>

// //         <div className="flex flex-col lg:flex-row gap-12">
// //           <div className="flex-[2] space-y-10">
// //             <section>
// //               <div className="flex items-center justify-between mb-4">
// //                 <h2 className="text-lg font-bold uppercase tracking-wide">
// //                   Thông tin nhận hàng
// //                 </h2>

// //                 <Link
// //                   to="/cart"
// //                   className="inline-flex items-center gap-1
// //                            text-blue-600 dark:text-blue-400
// //                            hover:text-blue-800 dark:hover:text-blue-300
// //                            transition"
// //                 >
// //                   Quay lại giỏ hàng
// //                 </Link>
// //               </div>

// //               <div className="space-y-3">
// //                 <select
// //                   name="addressId"
// //                   className="w-full p-2.5 border rounded text-sm
// //                            bg-white dark:bg-slate-800
// //                            border-gray-300 dark:border-slate-600
// //                            focus:border-blue-500 dark:focus:border-blue-400
// //                            outline-none transition"
// //                 >
// //                   <option value="default">Địa chỉ khác...</option>
// //                 </select>

// //                 <input
// //                   name="email"
// //                   value={formData.email}
// //                   readOnly
// //                   className="w-full p-2.5 border rounded text-sm
// //                            bg-gray-100 dark:bg-slate-700
// //                            border-gray-300 dark:border-slate-600
// //                            text-gray-500 dark:text-gray-400"
// //                 />

// //                 <input
// //                   name="fullName"
// //                   onChange={handleInputChange}
// //                   placeholder="Họ và tên"
// //                   className="w-full p-2.5 border rounded text-sm
// //                            bg-white dark:bg-slate-800
// //                            border-gray-300 dark:border-slate-600
// //                            focus:border-blue-500 dark:focus:border-blue-400
// //                            outline-none transition"
// //                 />

// //                 <input
// //                   name="phone"
// //                   onChange={handleInputChange}
// //                   placeholder="Số điện thoại"
// //                   className="w-full p-2.5 border rounded text-sm
// //                            bg-white dark:bg-slate-800
// //                            border-gray-300 dark:border-slate-600
// //                            focus:border-blue-500 dark:focus:border-blue-400
// //                            outline-none transition"
// //                 />

// //                 <input
// //                   name="addressDetail"
// //                   onChange={handleInputChange}
// //                   placeholder="Địa chỉ chi tiết (Số nhà, tên đường...)"
// //                   className="w-full p-2.5 border rounded text-sm
// //                            bg-white dark:bg-slate-800
// //                            border-gray-300 dark:border-slate-600
// //                            focus:border-blue-500 dark:focus:border-blue-400
// //                            outline-none transition"
// //                 />

// //                 {/* Province */}
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                   <div className="relative" ref={provRef}>
// //                     <div className="relative">
// //                       <input
// //                         className="w-full p-2.5 border rounded text-sm pr-8
// //                                  bg-white dark:bg-slate-800
// //                                  border-gray-300 dark:border-slate-600
// //                                  focus:border-blue-500 dark:focus:border-blue-400
// //                                  outline-none transition"
// //                         placeholder="Tỉnh thành"
// //                         value={formData.province}
// //                         onChange={(e) => {
// //                           setFormData({
// //                             ...formData,
// //                             province: e.target.value,
// //                             ward: "",
// //                           });
// //                           setShowProvDropdown(true);
// //                         }}
// //                         onFocus={() => setShowProvDropdown(true)}
// //                       />
// //                       <ChevronDown
// //                         size={14}
// //                         className="absolute right-3 top-1/2 -translate-y-1/2
// //                                  text-gray-400 dark:text-gray-500 pointer-events-none"
// //                       />
// //                     </div>

// //                     {showProvDropdown && (
// //                       <ul
// //                         className="absolute z-50 w-full mt-1
// //                                    bg-white dark:bg-slate-800
// //                                    border border-gray-200 dark:border-slate-600
// //                                    rounded shadow-xl max-h-60 overflow-y-auto"
// //                       >
// //                         {filteredProvinces.length > 0 ? (
// //                           filteredProvinces.map((p, i) => (
// //                             <li
// //                               key={i}
// //                               className="p-2.5 text-sm border-b last:border-none
// //                                        border-gray-100 dark:border-slate-700
// //                                        hover:bg-blue-50 dark:hover:bg-slate-700
// //                                        cursor-pointer transition"
// //                               onClick={() => handleSelectProvince(p)}
// //                             >
// //                               {p.provinceName}
// //                             </li>
// //                           ))
// //                         ) : (
// //                           <li className="p-2.5 text-gray-400 italic text-sm">
// //                             Không tìm thấy
// //                           </li>
// //                         )}
// //                       </ul>
// //                     )}
// //                   </div>

// //                   {/* Ward */}
// //                   <div
// //                     className={`relative ${!formData.province ? "opacity-60" : ""}`}
// //                     ref={wardRef}
// //                   >
// //                     <div className="relative">
// //                       <input
// //                         className="w-full p-2.5 border rounded text-sm pr-8
// //                                  bg-white dark:bg-slate-800
// //                                  border-gray-300 dark:border-slate-600
// //                                  focus:border-blue-500 dark:focus:border-blue-400
// //                                  disabled:bg-gray-50 dark:disabled:bg-slate-700
// //                                  outline-none transition"
// //                         placeholder="Phường xã"
// //                         disabled={!formData.province}
// //                         value={formData.ward}
// //                         onChange={(e) => {
// //                           setFormData({ ...formData, ward: e.target.value });
// //                           setShowWardDropdown(true);
// //                         }}
// //                         onFocus={() => setShowWardDropdown(true)}
// //                       />
// //                       <ChevronDown
// //                         size={14}
// //                         className="absolute right-3 top-1/2 -translate-y-1/2
// //                                  text-gray-400 dark:text-gray-500 pointer-events-none"
// //                       />
// //                     </div>

// //                     {showWardDropdown && (
// //                       <ul
// //                         className="absolute z-50 w-full mt-1
// //                                    bg-white dark:bg-slate-800
// //                                    border border-gray-200 dark:border-slate-600
// //                                    rounded shadow-xl max-h-60 overflow-y-auto"
// //                       >
// //                         {filteredWards.length > 0 ? (
// //                           filteredWards.map((w, i) => (
// //                             <li
// //                               key={i}
// //                               className="p-2.5 text-sm border-b last:border-none
// //                                        border-gray-100 dark:border-slate-700
// //                                        hover:bg-blue-50 dark:hover:bg-slate-700
// //                                        cursor-pointer transition"
// //                               onClick={() => handleSelectWard(w)}
// //                             >
// //                               {w.wardName}
// //                             </li>
// //                           ))
// //                         ) : (
// //                           <li className="p-2.5 text-gray-400 italic text-sm">
// //                             Không tìm thấy
// //                           </li>
// //                         )}
// //                       </ul>
// //                     )}
// //                   </div>
// //                 </div>

// //                 <textarea
// //                   name="note"
// //                   onChange={handleInputChange}
// //                   placeholder="Ghi chú (tùy chọn)"
// //                   className="w-full p-2.5 border rounded text-sm min-h-[80px]
// //                            bg-white dark:bg-slate-800
// //                            border-gray-300 dark:border-slate-600
// //                            focus:border-blue-500 dark:focus:border-blue-400
// //                            outline-none transition"
// //                 />
// //               </div>
// //             </section>

// //             {/* Payment */}
// //             <section>
// //               <h2 className="text-lg font-bold mb-4 uppercase tracking-wide">
// //                 Phương thức thanh toán
// //               </h2>

// //               <div
// //                 className="border rounded overflow-hidden shadow-sm
// //                             border-gray-300 dark:border-slate-600
// //                             bg-white dark:bg-slate-800"
// //               >
// //                 <label
// //                   className={`flex items-center justify-between p-4 border-b
// //                             border-gray-200 dark:border-slate-600
// //                             cursor-pointer transition-colors
// //                             ${
// //                               formData.paymentMethod === "vnpay"
// //                                 ? "bg-blue-50 dark:bg-slate-700"
// //                                 : "hover:bg-gray-50 dark:hover:bg-slate-700"
// //                             }`}
// //                 >
// //                   <div className="flex items-center gap-3">
// //                     <input
// //                       type="radio"
// //                       name="paymentMethod"
// //                       value="vnpay"
// //                       checked={formData.paymentMethod === "vnpay"}
// //                       onChange={handleInputChange}
// //                     />
// //                     <span className="text-sm font-medium">
// //                       VNPAY (Thẻ ngân hàng, QR Code)
// //                     </span>
// //                   </div>
// //                   <Wallet
// //                     className="text-blue-600 dark:text-blue-400"
// //                     size={18}
// //                   />
// //                 </label>

// //                 <label
// //                   className={`flex items-center justify-between p-4 cursor-pointer transition-colors
// //                             ${
// //                               formData.paymentMethod === "cod"
// //                                 ? "bg-blue-50 dark:bg-slate-700"
// //                                 : "hover:bg-gray-50 dark:hover:bg-slate-700"
// //                             }`}
// //                 >
// //                   <div className="flex items-center gap-3">
// //                     <input
// //                       type="radio"
// //                       name="paymentMethod"
// //                       value="cod"
// //                       checked={formData.paymentMethod === "cod"}
// //                       onChange={handleInputChange}
// //                     />
// //                     <span className="text-sm font-medium">
// //                       Thanh toán khi nhận hàng (COD)
// //                     </span>
// //                   </div>
// //                   <Wallet
// //                     className="text-green-600 dark:text-green-400"
// //                     size={18}
// //                   />
// //                 </label>
// //               </div>
// //             </section>
// //           </div>
// //           {/* Phần đơn hàng */}
// //           <div className="flex-1 lg:max-w-[420px]">
// //             <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-lg sticky top-6 shadow-sm">
// //               <h2 className="text-xl font-bold mb-6 border-b pb-4 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
// //                 Đơn hàng ({mockCart.length} sản phẩm)
// //               </h2>

// //               {/* Danh sách sản phẩm */}
// //               <div className="space-y-6 mb-6 max-h-[400px] overflow-y-auto pr-2 pt-2">
// //                 {mockCart.map((item) => (
// //                   <div key={item.id} className="flex gap-4 items-start">
// //                     <div className="relative shrink-0">
// //                       <img
// //                         src={item.image}
// //                         className="w-16 h-16 rounded-md object-cover border border-gray-100 dark:border-gray-700"
// //                         alt={item.name}
// //                       />
// //                       <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white dark:border-gray-800">
// //                         {item.quantity}
// //                       </span>
// //                     </div>

// //                     <div className="flex-1">
// //                       <h4 className="text-[13px] font-medium text-gray-800 dark:text-gray-200 leading-snug line-clamp-2">
// //                         {item.name}
// //                       </h4>
// //                     </div>

// //                     <div className="text-sm text-gray-500 dark:text-gray-400 italic whitespace-nowrap">
// //                       {(item.price * item.quantity).toLocaleString("vi-VN")}₫
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Mã giảm giá */}
// //               <div className="flex gap-2 mb-6 border-t pt-6 border-gray-200 dark:border-gray-700">
// //                 <input
// //                   placeholder="Mã giảm giá"
// //                   className="flex-1 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded text-sm outline-none focus:border-blue-500"
// //                 />
// //                 <button className="bg-[#6687cc] text-white px-5 py-2.5 rounded font-bold text-sm hover:bg-blue-700 transition">
// //                   Sử dụng
// //                 </button>
// //               </div>

// //               {/* Chi tiết thanh toán */}
// //               <div className="space-y-2 border-t pt-6 text-sm text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700">
// //                 <h3 className="font-bold text-gray-800 dark:text-white mb-2">
// //                   Chi tiết thanh toán
// //                 </h3>

// //                 <div className="flex justify-between">
// //                   <span>Tổng tiền hàng</span>
// //                   <span>{subtotal.toLocaleString("vi-VN")}₫</span>
// //                 </div>

// //                 <div className="flex justify-between">
// //                   <span>Tổng chi phí vận chuyển</span>
// //                   <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
// //                 </div>

// //                 <div className="flex justify-between">
// //                   <span>Giảm chi phí vận chuyển</span>
// //                   <span className="text-red-600 dark:text-red-400">
// //                     -{shippingDiscount.toLocaleString("vi-VN")}₫
// //                   </span>
// //                 </div>

// //                 <div className="flex justify-between">
// //                   <span>Tổng cộng voucher giảm giá</span>
// //                   <span className="text-red-600 dark:text-red-400">
// //                     -{voucherDiscount.toLocaleString("vi-VN")}₫
// //                   </span>
// //                 </div>

// //                 <div className="flex justify-between">
// //                   <span>Hội viên giảm giá</span>
// //                   <span className="text-red-600 dark:text-red-400">
// //                     -{memberDiscount.toLocaleString("vi-VN")}₫
// //                   </span>
// //                 </div>

// //                 <div className="flex justify-between font-bold text-lg border-t pt-3 border-gray-200 dark:border-gray-700 text-blue-800 dark:text-blue-400">
// //                   <span>Tổng thanh toán</span>
// //                   <span className="text-2xl">
// //                     {totalPayment.toLocaleString("vi-VN")}₫
// //                   </span>
// //                 </div>
// //               </div>

// //               {/* Nút hoàn tất */}
// //               <button className="w-full mt-8 bg-[#1947af] text-white py-4 rounded font-bold uppercase tracking-widest shadow-md hover:bg-blue-800 dark:hover:bg-blue-600 transition-all active:scale-[0.99]">
// //                 HOÀN TẤT ĐẶT HÀNG
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CheckoutPage;

///test
import React, { useState, useRef, useEffect } from "react";
import { Wallet, ChevronDown, Loader2 } from "lucide-react";
import locationDataRaw from "../data/danhmucxaphuong.json";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectCheckoutItems,
  selectIsBuyNow,
  selectAppliedProductVoucher,
  selectAppliedShippingVoucher,
  selectProductDiscountAmount,
  selectShippingDiscountAmount,
  selectApplyLoading,
  selectApplyError,
} from "../store/selectors";
// Thêm import:
import { fetchCart } from "../store/slices/cartSlice";
import { clearCheckoutItems } from "../store/slices/cartSlice";
import {
  removeAppliedProductVoucher,
  removeAppliedShippingVoucher,
  applyVoucherByCode,
} from "../store/slices/voucherSlice";
import { Tag, X, Ticket, Info } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const ORDER_URL = "http://localhost:8084";
const USER_URL = "http://localhost:8081";
const PAYMENT_URL = "http://localhost:8085";
const CART_URL = "http://localhost:8083";
const VOUCHER_URL = "http://localhost:8089";

interface Ward {
  wardCode: number;
  wardName: string;
}
interface Province {
  ministryProvinceCode: number;
  statisticsProvinceCode: string;
  provinceName: string;
  wards: Ward[];
}

const CheckoutPage = () => {
  const locationData = locationDataRaw as unknown as Province[];
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const { isSignedIn, user } = useUser();

  // ✅ Lấy items từ Redux thay vì API/localStorage
  const checkoutItems = useAppSelector(selectCheckoutItems);
  const isBuyNow = useAppSelector(selectIsBuyNow);

  // Voucher
  const appliedProductVoucher = useAppSelector(selectAppliedProductVoucher);
  const appliedShippingVoucher = useAppSelector(selectAppliedShippingVoucher);
  const productDiscountAmount = useAppSelector(selectProductDiscountAmount);
  const shippingDiscountAmount = useAppSelector(selectShippingDiscountAmount);
  const applyLoading = useAppSelector(selectApplyLoading);
  const applyError = useAppSelector(selectApplyError);
  const [voucherCode, setVoucherCode] = useState("");

  // Voucher picker dropdown
  const [showVoucherPicker, setShowVoucherPicker] = useState(false);
  const [activeVouchers, setActiveVouchers] = useState<any[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [voucherTab, setVoucherTab] = useState<"PRODUCT_DISCOUNT" | "SHIPPING_DISCOUNT">("PRODUCT_DISCOUNT");
  // Modal điều kiện: lưu voucher đang xem
  const [conditionModal, setConditionModal] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    addressDetail: "",
    province: "",
    ward: "",
    note: "",
    paymentMethod: "" as "" | "VNPAY" | "COD",
  });

  const [submitting, setSubmitting] = useState(false);
  const [showProvDropdown, setShowProvDropdown] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  const [availableWards, setAvailableWards] = useState<Ward[]>([]);

  const provRef = useRef<HTMLDivElement>(null);
  const wardRef = useRef<HTMLDivElement>(null);
  const voucherPickerRef = useRef<HTMLDivElement>(null);

  // ✅ Auto-fill thông tin user nếu đã đăng nhập
  useEffect(() => {
    if (!isSignedIn || !user) return;
    const fetchUserInfo = async () => {
      try {
        const token = await getToken({ template: "my-backend" });
        const res = await axios.get(`${USER_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data;
        setFormData((prev) => ({
          ...prev,
          fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
          phone: u.phone ?? "",
          email: u.email ?? user.emailAddresses?.[0]?.emailAddress ?? "",
        }));
      } catch {
        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName ?? "",
          email: user.emailAddresses?.[0]?.emailAddress ?? "",
        }));
      }
    };
    fetchUserInfo();
  }, [isSignedIn, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (provRef.current && !provRef.current.contains(event.target as Node))
        setShowProvDropdown(false);
      if (wardRef.current && !wardRef.current.contains(event.target as Node))
        setShowWardDropdown(false);
      if (
        voucherPickerRef.current &&
        !voucherPickerRef.current.contains(event.target as Node)
      )
        setShowVoucherPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const filteredProvinces = locationData.filter((p) =>
    p.provinceName.toLowerCase().includes(formData.province.toLowerCase()),
  );
  const filteredWards = availableWards.filter((w) =>
    w.wardName.toLowerCase().includes(formData.ward.toLowerCase()),
  );

  const handleSelectProvince = (p: Province) => {
    setFormData((prev) => ({ ...prev, province: p.provinceName, ward: "" }));
    setAvailableWards(p.wards);
    setShowProvDropdown(false);
  };

  const handleSelectWard = (w: Ward) => {
    setFormData((prev) => ({ ...prev, ward: w.wardName }));
    setShowWardDropdown(false);
  };

  // ✅ Tính tiền từ Redux checkoutItems
  const subtotal = checkoutItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 1),
    0,
  );
  const baseShippingFee = subtotal >= 3_000_000 ? 0 : 30_000;
  const actualShippingDiscount = Math.min(shippingDiscountAmount, baseShippingFee);
  const actualProductDiscount = Math.min(productDiscountAmount, subtotal);
  const shippingFee = baseShippingFee - actualShippingDiscount;
  const totalPayment = Math.max(0, subtotal - actualProductDiscount + shippingFee);

  // ✅ Áp dụng voucher
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    const token = await getToken({ template: "my-backend" });
    dispatch(
      applyVoucherByCode({
        token,
        code: voucherCode.trim(),
        orderAmount: subtotal,
      }),
    );
  };

  const handleRemoveProductVoucher = () => {
    dispatch(removeAppliedProductVoucher());
  };

  const handleRemoveShippingVoucher = () => {
    dispatch(removeAppliedShippingVoucher());
  };

  // Fetch danh sach voucher active
  const fetchActiveVouchers = async () => {
    if (activeVouchers.length > 0) return;
    setLoadingVouchers(true);
    try {
      const res = await axios.get(`${VOUCHER_URL}/api/vouchers`);
      setActiveVouchers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setActiveVouchers([]);
    } finally {
      setLoadingVouchers(false);
    }
  };

  const handleOpenVoucherPicker = () => {
    const next = !showVoucherPicker;
    setShowVoucherPicker(next);
    if (next) fetchActiveVouchers();
  };

  const handleApplyVoucherFromPicker = async (code: string) => {
    setVoucherCode(code);
    setShowVoucherPicker(false);
    const token = await getToken({ template: "my-backend" });
    dispatch(applyVoucherByCode({ token, code, orderAmount: subtotal }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập họ tên!");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại!");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Vui lòng nhập email!");
      return false;
    }
    if (!formData.addressDetail.trim()) {
      toast.error("Vui lòng nhập địa chỉ!");
      return false;
    }
    if (!formData.province) {
      toast.error("Vui lòng chọn tỉnh/thành!");
      return false;
    }
    if (!formData.paymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán!");
      return false;
    }
    if (checkoutItems.length === 0) {
      toast.error("Không có sản phẩm nào để thanh toán!");
      return false;
    }
    return true;
  };

  // ✅ Xóa đúng items đã mua khỏi giỏ hàng (chỉ khi mua từ giỏ, không phải mua ngay)
  // const removeCheckedOutItemsFromCart = async (token: string) => {
  //   if (isBuyNow) return; // Mua ngay → không cần xóa giỏ

  //   const variantIds = checkoutItems
  //     .map((item) => item.variantId)
  //     .filter(Boolean) as string[];

  //   if (variantIds.length === 0) return;

  //   try {
  //     await axios.delete(`${CART_URL}/api/cart/checkout-items`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //       data: { variantIds },
  //     });
  //   } catch (err) {
  //     console.warn("Không xóa được cart items:", err);
  //   }
  // };
  // Sửa hàm:
  const removeCheckedOutItemsFromCart = async (token: string) => {
    if (isBuyNow) return;
    const variantIds = checkoutItems
      .map((item) => item.variantId)
      .filter(Boolean) as string[];
    if (variantIds.length === 0) return;
    try {
      await axios.delete(`${CART_URL}/api/cart/checkout-items`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { variantIds },
      });

      await dispatch(fetchCart(token));
    } catch (err) {
      console.warn("Không xóa được cart items:", err);
    }
  };
  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    // Nếu chưa đăng nhập, vẫn cho đặt hàng nhưng không có userId
    setSubmitting(true);
    try {
      const token = isSignedIn
        ? await getToken({ template: "my-backend" })
        : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const shippingAddress = `${formData.addressDetail}, ${formData.ward ? formData.ward + ", " : ""}${formData.province}`;

      // 1. Tạo đơn hàng
      const orderRes = await axios.post(
        `${ORDER_URL}/api/orders/add`,
        {
          userId: user?.id ?? null,
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          shippingAddress,
          note: formData.note,
          paymentMethod: formData.paymentMethod,
          items: checkoutItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        },
        { headers },
      );

      const createdOrder = orderRes.data;
      const orderId = createdOrder.id;

      // 2. Tạo payment
      const paymentRes = await axios.post(
        `${PAYMENT_URL}/api/payments`,
        {
          orderId,
          paymentMethod: formData.paymentMethod,
          amount: Math.round(totalPayment),
          voucherCode: [appliedProductVoucher?.code, appliedShippingVoucher?.code].filter(Boolean).join(",") || null,
          voucherDiscount: actualProductDiscount + actualShippingDiscount,
          clientIp: "127.0.0.1",
        },
        { headers },
      );

      const payment = paymentRes.data;

      // 3. Xử lý sau khi đặt hàng
      if (formData.paymentMethod === "COD") {
        // ✅ Xóa đúng items đã mua khỏi giỏ (không xóa toàn bộ)
        if (token) {
          await removeCheckedOutItemsFromCart(token);
        }
        dispatch(clearCheckoutItems());
        dispatch(removeAppliedProductVoucher());
        dispatch(removeAppliedShippingVoucher());
        toast.success("Đặt hàng thành công!");
        navigate(`/order/${orderId}`);
      } else if (formData.paymentMethod === "VNPAY" && payment.paymentUrl) {
        // ✅ Lưu variantIds vào sessionStorage để xóa sau khi VNPAY thành công
        if (!isBuyNow) {
          const variantIds = checkoutItems
            .map((item) => item.variantId)
            .filter(Boolean);
          sessionStorage.setItem(
            "pendingCheckoutVariantIds",
            JSON.stringify(variantIds),
          );
        }
        dispatch(clearCheckoutItems());
        dispatch(removeAppliedProductVoucher());
        dispatch(removeAppliedShippingVoucher());
        window.location.href = payment.paymentUrl;
      } else {
        toast.error("Không lấy được link thanh toán!");
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ?? err.message ?? "Đặt hàng thất bại!";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#333] dark:bg-slate-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="bg-black dark:bg-white text-white dark:text-black px-4 py-1 flex items-center font-bold text-4xl lg:text-5xl tracking-tighter italic">
            ARTISANO<span className="text-red-600">DELIVERY</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── LEFT: Form ── */}
          <div className="flex-[2] space-y-10">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wide">
                  Thông tin nhận hàng
                </h2>
                <Link
                  to="/cart"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  Quay lại giỏ hàng
                </Link>
              </div>

              {!isSignedIn && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg text-sm text-yellow-800 dark:text-yellow-300">
                  <span
                    className="underline cursor-pointer font-bold"
                    onClick={() => navigate("/register")}
                  >
                    Đăng ký
                  </span>{" "}
                  tài khoản với email bạn nhập để theo dõi đơn hàng dễ dàng hơn
                </div>
              )}

              <div className="space-y-3">
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Họ và tên *"
                  className="w-full p-2.5 border rounded text-sm bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:border-blue-500 outline-none transition"
                />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email *"
                  className="w-full p-2.5 border rounded text-sm bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:border-blue-500 outline-none transition"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Số điện thoại *"
                  className="w-full p-2.5 border rounded text-sm bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:border-blue-500 outline-none transition"
                />
                <input
                  name="addressDetail"
                  value={formData.addressDetail}
                  onChange={handleInputChange}
                  placeholder="Địa chỉ chi tiết (Số nhà, tên đường...) *"
                  className="w-full p-2.5 border rounded text-sm bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:border-blue-500 outline-none transition"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Tỉnh thành */}
                  <div className="relative" ref={provRef}>
                    <div className="relative">
                      <input
                        className="w-full p-2.5 border rounded text-sm pr-8 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:border-blue-500 outline-none transition"
                        placeholder="Tỉnh thành *"
                        value={formData.province}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            province: e.target.value,
                            ward: "",
                          });
                          setShowProvDropdown(true);
                        }}
                        onFocus={() => setShowProvDropdown(true)}
                      />
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                    {showProvDropdown && (
                      <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded shadow-xl max-h-60 overflow-y-auto">
                        {filteredProvinces.length > 0 ? (
                          filteredProvinces.map((p, i) => (
                            <li
                              key={i}
                              className="p-2.5 text-sm border-b last:border-none border-gray-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer"
                              onClick={() => handleSelectProvince(p)}
                            >
                              {p.provinceName}
                            </li>
                          ))
                        ) : (
                          <li className="p-2.5 text-gray-400 italic text-sm">
                            Không tìm thấy
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  {/* Phường/xã */}
                  <div
                    className={`relative ${!formData.province ? "opacity-60" : ""}`}
                    ref={wardRef}
                  >
                    <div className="relative">
                      <input
                        className="w-full p-2.5 border rounded text-sm pr-8 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:border-blue-500 outline-none transition disabled:bg-gray-50"
                        placeholder="Phường xã"
                        disabled={!formData.province}
                        value={formData.ward}
                        onChange={(e) => {
                          setFormData({ ...formData, ward: e.target.value });
                          setShowWardDropdown(true);
                        }}
                        onFocus={() => setShowWardDropdown(true)}
                      />
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                    {showWardDropdown && (
                      <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded shadow-xl max-h-60 overflow-y-auto">
                        {filteredWards.length > 0 ? (
                          filteredWards.map((w, i) => (
                            <li
                              key={i}
                              className="p-2.5 text-sm border-b last:border-none border-gray-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer"
                              onClick={() => handleSelectWard(w)}
                            >
                              {w.wardName}
                            </li>
                          ))
                        ) : (
                          <li className="p-2.5 text-gray-400 italic text-sm">
                            Không tìm thấy
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Ghi chú (tùy chọn)"
                  className="w-full p-2.5 border rounded text-sm min-h-[80px] bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 focus:border-blue-500 outline-none transition"
                />
              </div>
            </section>

            {/* Phương thức thanh toán */}
            <section>
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wide">
                Phương thức thanh toán
              </h2>
              <div className="border rounded overflow-hidden shadow-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800">
                <label
                  className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-600 cursor-pointer transition-colors ${formData.paymentMethod === "VNPAY" ? "bg-blue-50 dark:bg-slate-700" : "hover:bg-gray-50 dark:hover:bg-slate-700"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={formData.paymentMethod === "VNPAY"}
                      onChange={handleInputChange}
                    />
                    <div>
                      <span className="text-sm font-medium">
                        VNPAY (Thẻ ngân hàng, QR Code)
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Thanh toán an toàn qua cổng VNPAY
                      </p>
                    </div>
                  </div>
                  <Wallet
                    className="text-blue-600 dark:text-blue-400"
                    size={18}
                  />
                </label>
                <label
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${formData.paymentMethod === "COD" ? "bg-blue-50 dark:bg-slate-700" : "hover:bg-gray-50 dark:hover:bg-slate-700"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === "COD"}
                      onChange={handleInputChange}
                    />
                    <div>
                      <span className="text-sm font-medium">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Trả tiền mặt khi nhận hàng
                      </p>
                    </div>
                  </div>
                  <Wallet
                    className="text-green-600 dark:text-green-400"
                    size={18}
                  />
                </label>
              </div>

              {formData.paymentMethod === "VNPAY" && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Bạn sẽ được chuyển đến trang VNPAY sau khi xác nhận đơn.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* ── RIGHT: Tóm tắt ── */}
          <div className="flex-1 lg:max-w-[420px]">
            <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-lg sticky top-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 border-b pb-4 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
                Đơn hàng ({checkoutItems.length} sản phẩm)
              </h2>

              {/* Danh sách sản phẩm */}
              <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-1">
                {checkoutItems.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    Không có sản phẩm.{" "}
                    <Link to="/cart" className="text-blue-500 underline">
                      Quay lại giỏ hàng
                    </Link>
                  </p>
                ) : (
                  checkoutItems.map((item, idx) => (
                    <div
                      key={`${item.productId}-${item.variantId}-${idx}`}
                      className="flex gap-3 items-start"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={item.image || ""}
                          className="w-14 h-14 rounded-md object-cover border border-gray-100 dark:border-gray-700"
                          alt={item.name ?? item.productName}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.webp";
                          }}
                        />
                        <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">
                          {item.name ?? item.productName}
                        </p>
                        {item.size && (
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Size: {item.size}
                          </p>
                        )}
                        {item.color && (
                          <p className="text-[11px] text-gray-400">
                            Màu: {item.color}
                          </p>
                        )}
                        {item.thickness && (
                          <p className="text-[11px] text-gray-400">
                            Dày: {item.thickness}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {(
                          (item.price ?? 0) * (item.quantity ?? 1)
                        ).toLocaleString("vi-VN")}
                        ₫
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* ✅ Voucher Section */}
              <div className="border-t pt-4 mb-2 border-gray-200 dark:border-gray-700">
                {/* HIỂN THỊ VOUCHER SP ĐÃ CHỌN */}
                {appliedProductVoucher && (
                  <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 relative mb-3">
                    <div className="w-14 shrink-0 bg-yellow-500 flex flex-col items-center justify-center py-3.5 gap-1.5 relative">
                      <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 z-10" />
                      <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 z-10" />
                      <Ticket size={16} className="text-white" />
                    </div>
                    <div className="w-px self-stretch" style={{background: "repeating-linear-gradient(to bottom,transparent,transparent 4px,#d1d5db 4px,#d1d5db 8px)", }} />
                    <div className="flex-1 px-3 py-2.5">
                      <p className="text-xs font-black tracking-widest text-gray-900 dark:text-white font-mono">{appliedProductVoucher.code}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Giảm SP <span className="font-bold text-gray-800 dark:text-gray-200">{actualProductDiscount.toLocaleString("vi-VN")}đ</span></p>
                    </div>
                    <button onClick={handleRemoveProductVoucher} className="px-3 flex items-center text-gray-400 hover:text-black">
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* HIỂN THỊ VOUCHER SHIP ĐÃ CHỌN */}
                {appliedShippingVoucher && (
                  <div className="flex rounded-xl overflow-hidden border border-green-200 dark:border-green-800 relative mb-3">
                    <div className="w-14 shrink-0 bg-green-500 flex flex-col items-center justify-center py-3.5 gap-1.5 relative">
                      <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 z-10" />
                      <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 z-10" />
                      <Ticket size={16} className="text-white" />
                    </div>
                    <div className="w-px self-stretch" style={{background: "repeating-linear-gradient(to bottom,transparent,transparent 4px,#d1d5db 4px,#d1d5db 8px)", }} />
                    <div className="flex-1 px-3 py-2.5">
                      <p className="text-xs font-black tracking-widest text-green-700 dark:text-green-400 font-mono">{appliedShippingVoucher.code}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Freeship <span className="font-bold text-gray-800 dark:text-gray-200">{actualShippingDiscount.toLocaleString("vi-VN")}đ</span></p>
                    </div>
                    <button onClick={handleRemoveShippingVoucher} className="px-3 flex items-center text-gray-400 hover:text-black">
                      <X size={14} />
                    </button>
                  </div>
                )}
                 
                  <div className="relative" ref={voucherPickerRef}>
                    {/* ── Trigger row ── */}
                    <button
                      type="button"
                      onClick={handleOpenVoucherPicker}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-400 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center shrink-0">
                        <Ticket size={15} className="text-white" />
                      </div>
                      <span className="flex-1 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                        Mã giảm giá
                      </span>
                      {activeVouchers.length > 0 && (
                        <span className="text-[10px] font-black bg-black dark:bg-white text-white dark:text-black px-1.5 py-0.5 rounded-full">
                          {activeVouchers.length}
                        </span>
                      )}
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${showVoucherPicker ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* ── Input nhập thủ công ── */}
                    <div className="flex gap-2 mt-2">
                      <div className="relative flex-1">
                        <Tag
                          size={12}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          placeholder="Nhập mã (nếu có)"
                          value={voucherCode}
                          onChange={(e) =>
                            setVoucherCode(e.target.value.toUpperCase())
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleApplyVoucher()
                          }
                          className="w-full pl-8 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm rounded-xl outline-none focus:border-gray-900 dark:focus:border-gray-300 text-gray-800 dark:text-white placeholder:text-gray-400 transition-colors"
                        />
                      </div>
                      <button
                        onClick={handleApplyVoucher}
                        disabled={applyLoading || !voucherCode.trim()}
                        className="bg-blue-600 text-white px-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-40 shrink-0"
                      >
                        {applyLoading ? "..." : "Áp dụng"}
                      </button>
                    </div>

                    {/* ── Dropdown Vua Nem style ── */}
                    {showVoucherPicker && (
                      <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header \& Tabs */}
                        <div className="border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
                          <div className="px-4 py-3 flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              Mã giảm giá & Miễn phí vận chuyển
                            </p>
                            <button
                              type="button"
                              onClick={() => setShowVoucherPicker(false)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              <X size={13} />
                            </button>
                          </div>
                          
                          <div className="flex px-4 gap-4">
                            <button
                              onClick={() => setVoucherTab("PRODUCT_DISCOUNT")}
                              className={`pb-2 text-[12px] font-bold border-b-2 transition-colors ${
                                voucherTab === "PRODUCT_DISCOUNT" 
                                ? "border-blue-600 text-blue-600" 
                                : "border-transparent text-gray-400 hover:text-gray-600"
                              }`}
                            >
                              Sản Phẩm
                            </button>
                            <button
                              onClick={() => setVoucherTab("SHIPPING_DISCOUNT")}
                              className={`pb-2 text-[12px] font-bold border-b-2 transition-colors ${
                                voucherTab === "SHIPPING_DISCOUNT" 
                                ? "border-green-600 text-green-600" 
                                : "border-transparent text-gray-400 hover:text-gray-600"
                              }`}
                            >
                              Phí Vận Chuyển
                            </button>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="max-h-[300px] overflow-y-auto px-3 py-3 space-y-2.5">
                          {loadingVouchers ? (
                            <div className="py-10 text-center">
                              <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                              <p className="text-xs text-gray-400">
                                Đang tải...
                              </p>
                            </div>
                          ) : activeVouchers.filter(v => v.voucherType === voucherTab).length === 0 ? (
                            <div className="py-10 text-center">
                              <Ticket
                                size={26}
                                className="mx-auto mb-2 text-gray-300"
                              />
                              <p className="text-sm text-gray-400">
                                Không có mã nào đang hiệu lực
                              </p>
                            </div>
                          ) : (
                            activeVouchers.filter(v => v.voucherType === voucherTab).map((v) => {
                              const notEnoughOrder =
                                v.minOrderAmount && subtotal < v.minOrderAmount;
                              const isExpired = v.validity?.end
                                ? new Date(v.validity.end) < new Date()
                                : false;
                              const isDisabled = isExpired || !!notEnoughOrder;
                              const isSelected = voucherCode === v.code;

                              const discountText =
                                v.voucherType === "PERCENT" ||
                                v.discountType === "PERCENT"
                                  ? `Giảm ${v.discountValue}%${v.maxDiscountAmount ? ` tối đa ${Number(v.maxDiscountAmount).toLocaleString("vi-VN")}đ` : ""}`
                                  : `Giảm ${Number(v.discountValue).toLocaleString("vi-VN")}đ`;

                              const conditionLines = [
                                v.minOrderAmount
                                  ? `Đơn tối thiểu ${Number(v.minOrderAmount).toLocaleString("vi-VN")}đ`
                                  : null,
                                v.validity?.start || v.validity?.end
                                  ? `HSD: ${v.validity?.start ? new Date(v.validity.start).toLocaleDateString("vi-VN") : "..."} - ${v.validity?.end ? new Date(v.validity.end).toLocaleDateString("vi-VN") : "..."}`
                                  : null,
                                v.usageLimit?.total
                                  ? `Còn ${v.usageLimit.total - (v.usageLimit.used ?? 0)} lượt dùng`
                                  : null,
                                v.isStackable === false
                                  ? "Không kết hợp mã khác"
                                  : null,
                              ].filter(Boolean);

                              return (
                                <div
                                  key={v._id ?? v.code}
                                  onClick={() =>
                                    !isDisabled &&
                                    setVoucherCode(isSelected ? "" : v.code)
                                  }
                                  className={`flex rounded-xl overflow-hidden border transition-all ${
                                    isDisabled
                                      ? "opacity-45 cursor-not-allowed"
                                      : "cursor-pointer hover:shadow-md"
                                  } ${
                                    isSelected && !isDisabled
                                      ? "border-gray-900 dark:border-gray-200 shadow-sm"
                                      : "border-gray-200 dark:border-gray-700"
                                  }`}
                                >
                                  {/* Stub trái */}
                                  <div
                                    className={`w-[52px] shrink-0 flex flex-col items-center justify-center py-4 gap-1.5 relative ${
                                      isDisabled
                                        ? "bg-gray-400 dark:bg-gray-600"
                                        : "bg-yellow-500"
                                    }`}
                                  >
                                    <div className="absolute -top-[9px] -right-[9px] w-[18px] h-[18px] rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 z-10" />
                                    <div className="absolute -bottom-[9px] -right-[9px] w-[18px] h-[18px] rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 z-10" />
                                    <Ticket size={17} className="text-white" />
                                    <span className="text-[7px] font-black tracking-widest text-white">
                                      VOUCHER
                                    </span>
                                  </div>

                                  {/* Dashed divider */}
                                  <div
                                    className="w-px self-stretch shrink-0"
                                    style={{
                                      background:
                                        "repeating-linear-gradient(to bottom,transparent,transparent 4px,#e5e7eb 4px,#e5e7eb 8px)",
                                    }}
                                  />
                                  <div className="flex-1 px-3 py-3 min-w-0">
                                    <p className="text-[11px] font-black tracking-widest text-gray-900 dark:text-white font-mono">
                                      {v.code}
                                    </p>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-0.5 line-clamp-2 leading-snug">
                                      {v.name || discountText}
                                    </p>
                                    <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                                      {(v.validity?.start ||
                                        v.validity?.end) && (
                                        <div className="flex items-center gap-1 text-[9px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                          <span>
                                            {v.validity?.start
                                              ? new Date(
                                                  v.validity.start,
                                                ).toLocaleDateString("vi-VN")
                                              : "..."}
                                          </span>
                                          <span>-</span>
                                          <span>
                                            {v.validity?.end
                                              ? new Date(
                                                  v.validity.end,
                                                ).toLocaleDateString("vi-VN")
                                              : "..."}
                                          </span>
                                        </div>
                                      )}
                                      {conditionLines.length > 0 && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setConditionModal({
                                              v,
                                              conditionLines,
                                              notEnoughOrder,
                                            });
                                          }}
                                          className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 transition-colors"
                                        >
                                          Điều kiện
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  {/* Radio */}
                                  <div className="pr-3 flex items-center">
                                    <div
                                      className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all ${
                                        isSelected && !isDisabled
                                          ? "border-[#f6a733] bg-[#f6a733]"
                                          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                                      }`}
                                    >
                                      {isSelected && !isDisabled && (
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Footer sticky: Áp dụng voucher */}
                        {!loadingVouchers && activeVouchers.length > 0 && (
                          <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <button
                              type="button"
                              disabled={!voucherCode.trim()}
                              onClick={() => {
                                if (voucherCode.trim())
                                  handleApplyVoucherFromPicker(voucherCode);
                              }}
                              className="w-full py-3 rounded-xl font-bold text-sm tracking-wide bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-35 disabled:cursor-not-allowed"
                            >
                              Áp dụng voucher
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                
                {applyError && !appliedProductVoucher && !appliedShippingVoucher && (
                  <p className="text-red-500 text-xs mt-1">{applyError}</p>
                )}
              </div>

              {/* ── Modal Điều kiện Voucher (giữa màn hình) ── */}
              {conditionModal && (
                <div
                  className="fixed inset-0 z-[999] flex items-center justify-center p-4"
                  onClick={() => setConditionModal(null)}
                >
                  {/* Backdrop */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                  {/* Panel */}
                  <div
                    className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header modal */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-semibold">
                          Điều kiện sử dụng
                        </p>
                        <p className="text-base font-black text-gray-900 dark:text-white font-mono tracking-wider mt-0.5">
                          {conditionModal.v.code}
                        </p>
                      </div>
                      <button
                        onClick={() => setConditionModal(null)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {/* Coupon stub decoration */}
                    <div className="flex">
                      <div className="w-14 shrink-0 bg-yellow-500 flex flex-col items-center justify-center py-5 gap-1.5">
                        <Ticket size={20} className="text-white" />
                        <span className="text-[7px] font-black tracking-widest text-white">
                          VOUCHER
                        </span>
                      </div>
                      <div
                        className="w-px self-stretch"
                        style={{
                          background:
                            "repeating-linear-gradient(to bottom,transparent,transparent 4px,#e5e7eb 4px,#e5e7eb 8px)",
                        }}
                      />
                      <div className="flex-1 px-4 py-4">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug">
                          {conditionModal.v.name ||
                            (conditionModal.v.voucherType === "PERCENT" ||
                            conditionModal.v.discountType === "PERCENT"
                              ? `Giảm ${conditionModal.v.discountValue}%`
                              : `Giảm ${Number(conditionModal.v.discountValue).toLocaleString("vi-VN")}đ`)}
                        </p>
                      </div>
                    </div>

                    {/* Divider dash */}
                    <div className="mx-5 border-t border-dashed border-gray-200 dark:border-gray-700" />

                    {/* Conditions list */}
                    <div className="px-5 py-4 space-y-3">
                      {conditionModal.conditionLines.map(
                        (line: string, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[10px] font-black text-gray-600 dark:text-gray-300">
                                {i + 1}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {line}
                            </p>
                          </div>
                        ),
                      )}
                      {conditionModal.notEnoughOrder && (
                        <div className="flex items-start gap-3 mt-2 pt-2 border-t border-dashed border-red-200 dark:border-red-900">
                          <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-black text-red-500">
                              !
                            </span>
                          </div>
                          <p className="text-sm text-red-500 leading-relaxed">
                            Đơn hàng hiện tại chưa đủ điều kiện áp mã này
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 pb-5">
                      <button
                        type="button"
                        onClick={() => setConditionModal(null)}
                        className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2 border-t pt-4 text-sm text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng</span>
                  <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      `${shippingFee.toLocaleString("vi-VN")}₫`
                    )}
                  </span>
                </div>
                {actualProductDiscount > 0 && (
                  <div className="flex justify-between text-yellow-600 dark:text-yellow-500">
                    <span>Giảm voucher (Sản phẩm)</span>
                    <span>-{actualProductDiscount.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}
                {actualShippingDiscount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-500">
                    <span>Giảm phí vận chuyển</span>
                    <span>-{actualShippingDiscount.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}
                {subtotal >= 3_000_000 && (
                  <p className="text-xs text-green-600 italic">
                    🎉 Đơn hàng đủ điều kiện miễn phí vận chuyển!
                  </p>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-3 border-gray-200 dark:border-gray-700 text-blue-800 dark:text-blue-400">
                  <span>Tổng thanh toán</span>
                  <span className="text-2xl">
                    {totalPayment.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={submitting || checkoutItems.length === 0}
                className="w-full mt-6 bg-blue-700 text-white py-4 rounded font-bold uppercase tracking-widest shadow-md hover:bg-blue-800 transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Đang xử lý...
                  </>
                ) : formData.paymentMethod === "VNPAY" ? (
                  "THANH TOÁN VNPAY"
                ) : formData.paymentMethod === "COD" ? (
                  "ĐẶT HÀNG (COD)"
                ) : (
                  "HOÀN TẤT ĐẶT HÀNG"
                )}
              </button>

              {!isSignedIn && (
                <p className="text-center text-xs text-gray-400 mt-3">
                  Bạn cần{" "}
                  <span
                    className="text-blue-500 cursor-pointer underline"
                    onClick={() => navigate("/login")}
                  >
                    đăng nhập
                  </span>{" "}
                  để theo dõi đơn hàng
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
