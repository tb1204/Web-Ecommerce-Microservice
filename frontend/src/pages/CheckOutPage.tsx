import React, { useState, useRef, useEffect } from "react";
import { Wallet, ChevronDown } from "lucide-react";
import locationDataRaw from "../data/danhmucxaphuong.json";

import goi from "../assets/goi/goi-bong.webp";
import { Link } from "react-router-dom";

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

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CheckoutPage = () => {
  const locationData = locationDataRaw as unknown as Province[];

  const [formData, setFormData] = useState({
    addressId: "default",
    email: "hi@gmail.com",
    fullName: "",
    phone: "",
    addressDetail: "",
    province: "",
    ward: "",
    note: "",
    paymentMethod: "", // "", "vnpay", "cod"
  });

  const [showProvDropdown, setShowProvDropdown] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  const [availableWards, setAvailableWards] = useState<Ward[]>([]);

  const provRef = useRef<HTMLDivElement>(null);
  const wardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (provRef.current && !provRef.current.contains(event.target as Node))
        setShowProvDropdown(false);
      if (wardRef.current && !wardRef.current.contains(event.target as Node))
        setShowWardDropdown(false);
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

  const mockCart: CartItem[] = [
    {
      id: "1",
      name: "Bảo vệ nệm Doona Bamboo chống bụi bẩn, thoáng khí",
      price: 800000,
      quantity: 1,
      image: goi,
    },
    {
      id: "2",
      name: "Topper memory foam nâng đỡ êm ái Comfy Noah",
      price: 2160000,
      quantity: 1,
      image: goi,
    },
  ];

  const subtotal = mockCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // Giả lập phí vận chuyển và giảm giá
  const shippingFee = 0; // 0đ nếu miễn phí
  const shippingDiscount = 0; // giảm phí vận chuyển
  const voucherDiscount = 0; // voucher giảm giá
  const memberDiscount = 10000; // hội viên giảm % (hiện tại 0đ)

  const totalPayment =
    subtotal +
    shippingFee -
    shippingDiscount -
    voucherDiscount -
    memberDiscount;

  return (
    <div
      className="min-h-screen bg-[#f8f8f8] text-[#333] 
                  dark:bg-slate-900 dark:text-gray-100 
                  font-sans transition-colors duration-300"
    >
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div
            className="bg-black dark:bg-white 
                        text-white dark:text-black 
                        px-4 py-1 flex items-center 
                        font-bold text-4xl lg:text-5xl 
                        tracking-tighter italic"
          >
            ARTISANO<span className="text-red-600">DELIVERY</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-[2] space-y-10">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wide">
                  Thông tin nhận hàng
                </h2>

                <Link
                  to="/cart"
                  className="inline-flex items-center gap-1 
                           text-blue-600 dark:text-blue-400
                           hover:text-blue-800 dark:hover:text-blue-300
                           transition"
                >
                  Quay lại giỏ hàng
                </Link>
              </div>

              <div className="space-y-3">
                <select
                  name="addressId"
                  className="w-full p-2.5 border rounded text-sm
                           bg-white dark:bg-slate-800
                           border-gray-300 dark:border-slate-600
                           focus:border-blue-500 dark:focus:border-blue-400
                           outline-none transition"
                >
                  <option value="default">Địa chỉ khác...</option>
                </select>

                <input
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full p-2.5 border rounded text-sm
                           bg-gray-100 dark:bg-slate-700
                           border-gray-300 dark:border-slate-600
                           text-gray-500 dark:text-gray-400"
                />

                <input
                  name="fullName"
                  onChange={handleInputChange}
                  placeholder="Họ và tên"
                  className="w-full p-2.5 border rounded text-sm
                           bg-white dark:bg-slate-800
                           border-gray-300 dark:border-slate-600
                           focus:border-blue-500 dark:focus:border-blue-400
                           outline-none transition"
                />

                <input
                  name="phone"
                  onChange={handleInputChange}
                  placeholder="Số điện thoại"
                  className="w-full p-2.5 border rounded text-sm
                           bg-white dark:bg-slate-800
                           border-gray-300 dark:border-slate-600
                           focus:border-blue-500 dark:focus:border-blue-400
                           outline-none transition"
                />

                <input
                  name="addressDetail"
                  onChange={handleInputChange}
                  placeholder="Địa chỉ chi tiết (Số nhà, tên đường...)"
                  className="w-full p-2.5 border rounded text-sm
                           bg-white dark:bg-slate-800
                           border-gray-300 dark:border-slate-600
                           focus:border-blue-500 dark:focus:border-blue-400
                           outline-none transition"
                />

                {/* Province */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative" ref={provRef}>
                    <div className="relative">
                      <input
                        className="w-full p-2.5 border rounded text-sm pr-8
                                 bg-white dark:bg-slate-800
                                 border-gray-300 dark:border-slate-600
                                 focus:border-blue-500 dark:focus:border-blue-400
                                 outline-none transition"
                        placeholder="Tỉnh thành"
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 
                                 text-gray-400 dark:text-gray-500 pointer-events-none"
                      />
                    </div>

                    {showProvDropdown && (
                      <ul
                        className="absolute z-50 w-full mt-1 
                                   bg-white dark:bg-slate-800
                                   border border-gray-200 dark:border-slate-600
                                   rounded shadow-xl max-h-60 overflow-y-auto"
                      >
                        {filteredProvinces.length > 0 ? (
                          filteredProvinces.map((p, i) => (
                            <li
                              key={i}
                              className="p-2.5 text-sm border-b last:border-none
                                       border-gray-100 dark:border-slate-700
                                       hover:bg-blue-50 dark:hover:bg-slate-700
                                       cursor-pointer transition"
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

                  {/* Ward */}
                  <div
                    className={`relative ${!formData.province ? "opacity-60" : ""}`}
                    ref={wardRef}
                  >
                    <div className="relative">
                      <input
                        className="w-full p-2.5 border rounded text-sm pr-8
                                 bg-white dark:bg-slate-800
                                 border-gray-300 dark:border-slate-600
                                 focus:border-blue-500 dark:focus:border-blue-400
                                 disabled:bg-gray-50 dark:disabled:bg-slate-700
                                 outline-none transition"
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 
                                 text-gray-400 dark:text-gray-500 pointer-events-none"
                      />
                    </div>

                    {showWardDropdown && (
                      <ul
                        className="absolute z-50 w-full mt-1 
                                   bg-white dark:bg-slate-800
                                   border border-gray-200 dark:border-slate-600
                                   rounded shadow-xl max-h-60 overflow-y-auto"
                      >
                        {filteredWards.length > 0 ? (
                          filteredWards.map((w, i) => (
                            <li
                              key={i}
                              className="p-2.5 text-sm border-b last:border-none
                                       border-gray-100 dark:border-slate-700
                                       hover:bg-blue-50 dark:hover:bg-slate-700
                                       cursor-pointer transition"
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
                  onChange={handleInputChange}
                  placeholder="Ghi chú (tùy chọn)"
                  className="w-full p-2.5 border rounded text-sm min-h-[80px]
                           bg-white dark:bg-slate-800
                           border-gray-300 dark:border-slate-600
                           focus:border-blue-500 dark:focus:border-blue-400
                           outline-none transition"
                />
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wide">
                Phương thức thanh toán
              </h2>

              <div
                className="border rounded overflow-hidden shadow-sm
                            border-gray-300 dark:border-slate-600
                            bg-white dark:bg-slate-800"
              >
                <label
                  className={`flex items-center justify-between p-4 border-b
                            border-gray-200 dark:border-slate-600
                            cursor-pointer transition-colors
                            ${
                              formData.paymentMethod === "vnpay"
                                ? "bg-blue-50 dark:bg-slate-700"
                                : "hover:bg-gray-50 dark:hover:bg-slate-700"
                            }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vnpay"
                      checked={formData.paymentMethod === "vnpay"}
                      onChange={handleInputChange}
                    />
                    <span className="text-sm font-medium">
                      VNPAY (Thẻ ngân hàng, QR Code)
                    </span>
                  </div>
                  <Wallet
                    className="text-blue-600 dark:text-blue-400"
                    size={18}
                  />
                </label>

                <label
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors
                            ${
                              formData.paymentMethod === "cod"
                                ? "bg-blue-50 dark:bg-slate-700"
                                : "hover:bg-gray-50 dark:hover:bg-slate-700"
                            }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                    />
                    <span className="text-sm font-medium">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                  </div>
                  <Wallet
                    className="text-green-600 dark:text-green-400"
                    size={18}
                  />
                </label>
              </div>
            </section>
          </div>
          {/* Phần đơn hàng */}
          <div className="flex-1 lg:max-w-[420px]">
            <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-lg sticky top-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 border-b pb-4 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700">
                Đơn hàng ({mockCart.length} sản phẩm)
              </h2>

              {/* Danh sách sản phẩm */}
              <div className="space-y-6 mb-6 max-h-[400px] overflow-y-auto pr-2 pt-2">
                {mockCart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        className="w-16 h-16 rounded-md object-cover border border-gray-100 dark:border-gray-700"
                        alt={item.name}
                      />
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white dark:border-gray-800">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-[13px] font-medium text-gray-800 dark:text-gray-200 leading-snug line-clamp-2">
                        {item.name}
                      </h4>
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400 italic whitespace-nowrap">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                ))}
              </div>

              {/* Mã giảm giá */}
              <div className="flex gap-2 mb-6 border-t pt-6 border-gray-200 dark:border-gray-700">
                <input
                  placeholder="Mã giảm giá"
                  className="flex-1 p-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded text-sm outline-none focus:border-blue-500"
                />
                <button className="bg-[#6687cc] text-white px-5 py-2.5 rounded font-bold text-sm hover:bg-blue-700 transition">
                  Sử dụng
                </button>
              </div>

              {/* Chi tiết thanh toán */}
              <div className="space-y-2 border-t pt-6 text-sm text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                  Chi tiết thanh toán
                </h3>

                <div className="flex justify-between">
                  <span>Tổng tiền hàng</span>
                  <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                </div>

                <div className="flex justify-between">
                  <span>Tổng chi phí vận chuyển</span>
                  <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
                </div>

                <div className="flex justify-between">
                  <span>Giảm chi phí vận chuyển</span>
                  <span className="text-red-600 dark:text-red-400">
                    -{shippingDiscount.toLocaleString("vi-VN")}₫
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tổng cộng voucher giảm giá</span>
                  <span className="text-red-600 dark:text-red-400">
                    -{voucherDiscount.toLocaleString("vi-VN")}₫
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Hội viên giảm giá</span>
                  <span className="text-red-600 dark:text-red-400">
                    -{memberDiscount.toLocaleString("vi-VN")}₫
                  </span>
                </div>

                <div className="flex justify-between font-bold text-lg border-t pt-3 border-gray-200 dark:border-gray-700 text-blue-800 dark:text-blue-400">
                  <span>Tổng thanh toán</span>
                  <span className="text-2xl">
                    {totalPayment.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              {/* Nút hoàn tất */}
              <button className="w-full mt-8 bg-[#1947af] text-white py-4 rounded font-bold uppercase tracking-widest shadow-md hover:bg-blue-800 dark:hover:bg-blue-600 transition-all active:scale-[0.99]">
                HOÀN TẤT ĐẶT HÀNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

//ban dau

// return (
//     <div className="min-h-screen bg-[#f8f8f8] text-[#333] dark:bg-gray-900 font-sans">
//       <div className="max-w-[1200px] mx-auto px-4 py-6">
//         <div className="flex justify-center mb-8">
//           <div className="bg-black text-white px-4 py-1 flex items-center font-bold text-4xl lg:text-5xl tracking-tighter italic">
//             ARTISANO<span className="text-red-600">DELIVERY</span>
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-12">
//           <div className="flex-[2] space-y-10">
//             <section>
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-bold uppercase tracking-wide dark:text-slate-200">
//                   Thông tin nhận hàng
//                 </h2>
//                 <Link
//                   to="/cart"
//                   className="inline-flex items-center gap-1 text-blue-600 font-medium    transition-all duration-300 ease-out hover:text-blue-800 hover:decoration-2 hover:decoration-blue-700"
//                 >
//                   Quay lại giỏ hàng
//                 </Link>
//               </div>

//               <div className="space-y-3">
//                 <select
//                   name="addressId"
//                   className="w-full p-2.5 border border-gray-300 rounded text-sm bg-white outline-none focus:border-blue-500"
//                 >
//                   <option value="default">Địa chỉ khác...</option>
//                 </select>
//                 <input
//                   name="email"
//                   value={formData.email}
//                   readOnly
//                   className="w-full p-2.5 border border-gray-300 rounded text-sm bg-[#e9e9e9] outline-none"
//                 />
//                 <input
//                   name="fullName"
//                   onChange={handleInputChange}
//                   placeholder="Họ và tên"
//                   className="w-full p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
//                 />
//                 <input
//                   name="phone"
//                   onChange={handleInputChange}
//                   placeholder="Số điện thoại"
//                   className="w-full p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
//                 />
//                 <input
//                   name="addressDetail"
//                   onChange={handleInputChange}
//                   placeholder="Địa chỉ chi tiết (Số nhà, tên đường...)"
//                   className="w-full p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
//                 />

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {/* Tỉnh thành */}
//                   <div className="relative" ref={provRef}>
//                     <div className="relative">
//                       <input
//                         className="w-full p-2.5 border border-gray-300 rounded text-sm bg-white outline-none focus:border-blue-500 pr-8"
//                         placeholder="Tỉnh thành"
//                         value={formData.province}
//                         onChange={(e) => {
//                           setFormData({
//                             ...formData,
//                             province: e.target.value,
//                             ward: "",
//                           });
//                           setShowProvDropdown(true);
//                         }}
//                         onFocus={() => setShowProvDropdown(true)}
//                       />
//                       <ChevronDown
//                         size={14}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                       />
//                     </div>
//                     {showProvDropdown && (
//                       <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-xl max-h-60 overflow-y-auto">
//                         {filteredProvinces.length > 0 ? (
//                           filteredProvinces.map((p, i) => (
//                             <li
//                               key={i}
//                               className="p-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-none"
//                               onClick={() => handleSelectProvince(p)}
//                             >
//                               {p.provinceName}
//                             </li>
//                           ))
//                         ) : (
//                           <li className="p-2.5 text-gray-400 italic text-sm">
//                             Không tìm thấy
//                           </li>
//                         )}
//                       </ul>
//                     )}
//                   </div>

//                   {/* Phường xã */}
//                   <div
//                     className={`relative ${!formData.province ? "opacity-60" : ""}`}
//                     ref={wardRef}
//                   >
//                     <div className="relative">
//                       <input
//                         className="w-full p-2.5 border border-gray-300 rounded text-sm bg-white outline-none focus:border-blue-500 pr-8 disabled:bg-gray-50"
//                         placeholder="Phường xã"
//                         disabled={!formData.province}
//                         value={formData.ward}
//                         onChange={(e) => {
//                           setFormData({ ...formData, ward: e.target.value });
//                           setShowWardDropdown(true);
//                         }}
//                         onFocus={() => setShowWardDropdown(true)}
//                       />
//                       <ChevronDown
//                         size={14}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                       />
//                     </div>
//                     {showWardDropdown && (
//                       <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-xl max-h-60 overflow-y-auto">
//                         {filteredWards.length > 0 ? (
//                           filteredWards.map((w, i) => (
//                             <li
//                               key={i}
//                               className="p-2.5 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-none"
//                               onClick={() => handleSelectWard(w)}
//                             >
//                               {w.wardName}
//                             </li>
//                           ))
//                         ) : (
//                           <li className="p-2.5 text-gray-400 italic text-sm">
//                             Không tìm thấy
//                           </li>
//                         )}
//                       </ul>
//                     )}
//                   </div>
//                 </div>

//                 <textarea
//                   name="note"
//                   onChange={handleInputChange}
//                   placeholder="Ghi chú (tùy chọn)"
//                   className="w-full p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 min-h-[80px]"
//                 />
//               </div>
//             </section>

//             {/* Phương thức thanh toán */}
//             <section>
//               <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-gray-800">
//                 Phương thức thanh toán
//               </h2>
//               <div className="border border-gray-300 rounded overflow-hidden shadow-sm">
//                 <label
//                   className={`flex items-center justify-between p-4 border-b cursor-pointer transition-colors ${
//                     formData.paymentMethod === "vnpay"
//                       ? "bg-blue-50"
//                       : "hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="vnpay"
//                       checked={formData.paymentMethod === "vnpay"}
//                       onChange={handleInputChange}
//                     />
//                     <span className="text-sm font-medium">
//                       VNPAY (Thẻ ngân hàng, QR Code)
//                     </span>
//                   </div>
//                   <Wallet className="text-blue-600" size={18} />
//                 </label>

//                 <label
//                   className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
//                     formData.paymentMethod === "cod"
//                       ? "bg-blue-50"
//                       : "hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="cod"
//                       checked={formData.paymentMethod === "cod"}
//                       onChange={handleInputChange}
//                     />
//                     <span className="text-sm font-medium">
//                       Thanh toán khi nhận hàng (COD)
//                     </span>
//                   </div>
//                   <Wallet className="text-green-600" size={18} />
//                 </label>
//               </div>
//             </section>
//           </div>

//           {/* Phần đơn hàng */}
//           <div className="flex-1  lg:max-w-[420px]">
//             <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 rounded-lg sticky top-6 shadow-sm">
//               <h2 className="text-xl font-bold mb-6 border-b pb-4">
//                 Đơn hàng ({mockCart.length} sản phẩm)
//               </h2>

//               {/* Danh sách sản phẩm - fix khoảng cách */}
//               <div className="space-y-6 mb-6 max-h-[400px] overflow-y-auto pr-2 pt-2">
//                 {mockCart.map((item) => (
//                   <div key={item.id} className="flex gap-4 items-start">
//                     <div className="relative shrink-0">
//                       <img
//                         src={item.image}
//                         className="w-16 h-16 rounded-md object-cover border border-gray-100"
//                         alt={item.name}
//                       />
//                       <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">
//                         {item.quantity}
//                       </span>
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2">
//                         {item.name}
//                       </h4>
//                     </div>
//                     <div className="text-sm text-gray-500 italic whitespace-nowrap">
//                       {(item.price * item.quantity).toLocaleString("vi-VN")}₫
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Mã giảm giá */}
//               <div className="flex gap-2 mb-6 border-t pt-6">
//                 <input
//                   placeholder="Mã giảm giá"
//                   className="flex-1 p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
//                 />
//                 <button className="bg-[#6687cc] text-white px-5 py-2.5 rounded font-bold text-sm hover:bg-blue-700 transition">
//                   Sử dụng
//                 </button>
//               </div>

//               {/* Chi tiết thanh toán */}
//               <div className="space-y-2 border-t pt-6 text-sm text-gray-600">
//                 <h3 className="font-bold text-gray-800 mb-2">
//                   Chi tiết thanh toán
//                 </h3>

//                 <div className="flex justify-between">
//                   <span>Tổng tiền hàng</span>
//                   <span>{subtotal.toLocaleString("vi-VN")}₫</span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span>Tổng chi phí vận chuyển</span>
//                   <span>{shippingFee.toLocaleString("vi-VN")}₫</span>
//                 </div>

//                 <div className="flex justify-between ">
//                   <span>Giảm chi phí vận chuyển</span>
//                   <span className="text-red-600">
//                     -{shippingDiscount.toLocaleString("vi-VN")}₫
//                   </span>
//                 </div>

//                 <div className="flex justify-between ">
//                   <span>Tổng cộng voucher giảm giá</span>
//                   <span className="text-red-600">
//                     -{voucherDiscount.toLocaleString("vi-VN")}₫
//                   </span>
//                 </div>

//                 <div className="flex justify-between ">
//                   <span>Hội viên giảm giá</span>
//                   <span className="text-red-600">
//                     -{memberDiscount.toLocaleString("vi-VN")}₫
//                   </span>
//                 </div>

//                 <div className="flex justify-between font-bold text-lg border-t pt-3 text-blue-800">
//                   <span>Tổng thanh toán</span>
//                   <span className="text-2xl">
//                     {totalPayment.toLocaleString("vi-VN")}₫
//                   </span>
//                 </div>
//               </div>

//               {/* Nút hoàn tất */}
//               <button className="w-full mt-8 bg-[#1947af] text-white py-4 rounded font-bold uppercase tracking-widest shadow-md hover:bg-blue-800 transition-all active:scale-[0.99]">
//                 HOÀN TẤT ĐẶT HÀNG
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
