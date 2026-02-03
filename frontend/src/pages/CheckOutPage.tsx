import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Wallet, UserCircle } from "lucide-react";

import locationDataRaw from "../data/dataLocation.json";
import goi from "../assets/goi/goi-bong.webp";

interface Ward {
  name: string;
  code: number;
}

interface District {
  name: string;
  code: number;
  wards: Ward[];
}

interface Province {
  name: string;
  code: number;
  districts: District[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(true);

  // Ép kiểu dữ liệu JSON
  const locationData = locationDataRaw as Province[];

  const [formData, setFormData] = useState({
    addressId: "default",
    email: "hi@gmail.com",
    fullName: "",
    phone: "",
    addressDetail: "",
    province: "",
    district: "",
    ward: "",
    note: "",
    paymentMethod: "bank",
  });

  // State hỗ trợ hiển thị danh sách dropdown
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // --- MOCK DATA ---
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

  // --- HANDLERS ---
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn Tỉnh
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceName = e.target.value;
    const selectedProv = locationData.find((p) => p.name === provinceName);

    setFormData((prev) => ({
      ...prev,
      province: provinceName,
      district: "",
      ward: "",
    }));

    setDistricts(selectedProv ? selectedProv.districts : []);
    setWards([]);
  };

  // Xử lý chọn Huyện
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtName = e.target.value;
    const selectedDist = districts.find((d) => d.name === districtName);

    setFormData((prev) => ({
      ...prev,
      district: districtName,
      ward: "",
    }));

    setWards(selectedDist ? selectedDist.wards : []);
  };

  const subtotal = mockCart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#333] font-sans">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-black text-white px-4 py-1 flex items-center font-bold text-4xl lg:text-5xl tracking-tighter italic">
            ARTISANO<span className="text-red-600">DELIVERY</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* CỘT TRÁI: THÔNG TIN VÀ THANH TOÁN */}
          <div className="flex-[2] space-y-10">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wide">
                  Thông tin nhận hàng
                </h2>
                {isLoggedIn && (
                  <button className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
                    <UserCircle size={16} /> Đăng xuất
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <select
                  name="addressId"
                  className="w-full p-2.5 border border-gray-300 rounded text-sm bg-white outline-none focus:border-blue-500"
                >
                  <option value="default">Địa chỉ khác...</option>
                </select>

                <input
                  name="email"
                  value={formData.email}
                  readOnly={isLoggedIn}
                  placeholder="Email"
                  className="w-full p-2.5 border border-gray-300 rounded text-sm bg-[#e9e9e9] outline-none"
                />

                <input
                  name="fullName"
                  onChange={handleInputChange}
                  placeholder="Họ và tên"
                  className="w-full p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
                />

                <div className="relative">
                  <input
                    name="phone"
                    onChange={handleInputChange}
                    placeholder="Số điện thoại"
                    className="w-full p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <input
                  name="addressDetail"
                  onChange={handleInputChange}
                  placeholder="Địa chỉ chi tiết (Số nhà, tên đường...)"
                  className="w-full p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
                />

                {/* Dropdown 3 cấp */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleProvinceChange}
                    className="p-2.5 border border-gray-300 rounded text-sm bg-white outline-none focus:border-blue-500"
                  >
                    <option value="">Tỉnh thành</option>
                    {locationData.map((p) => (
                      <option key={p.code} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    disabled={!formData.province}
                    className="p-2.5 border border-gray-300 rounded text-sm bg-white outline-none focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="">Quận huyện</option>
                    {districts.map((d) => (
                      <option key={d.code} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    disabled={!formData.district}
                    className="p-2.5 border border-gray-300 rounded text-sm bg-white outline-none focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="">Phường xã</option>
                    {wards.map((w) => (
                      <option key={w.code} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  name="note"
                  onChange={handleInputChange}
                  placeholder="Ghi chú (tùy chọn)"
                  className="w-full p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 min-h-[80px]"
                />
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wide">
                Vận chuyển
              </h2>
              <div className="bg-[#d9edf7] text-[#31708f] p-4 rounded border border-[#bce8f1] text-sm italic">
                {formData.ward
                  ? "Phí vận chuyển sẽ được tính dựa trên địa chỉ của bạn"
                  : "Vui lòng nhập đầy đủ thông tin địa chỉ để thấy phí vận chuyển"}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wide text-gray-800">
                Thanh toán
              </h2>
              <div className="border border-gray-300 rounded overflow-hidden shadow-sm">
                <label
                  className={`flex items-center justify-between p-4 border-b cursor-pointer transition-colors ${formData.paymentMethod === "bank" ? "bg-blue-50" : "hover:bg-gray-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === "bank"}
                      onChange={handleInputChange}
                    />
                    <span className="text-sm font-medium">
                      Chuyển khoản qua ngân hàng
                    </span>
                  </div>
                  <Wallet className="text-blue-600" size={18} />
                </label>
                <label
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${formData.paymentMethod === "cod" ? "bg-blue-50" : "hover:bg-gray-50"}`}
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
                      Thanh toán khi giao hàng (COD)
                    </span>
                  </div>
                  <Wallet className="text-blue-600" size={18} />
                </label>
              </div>
            </section>

            {/* Mobile Footer Button */}
            <div className="lg:hidden pt-4 space-y-4">
              <button className="w-full bg-[#1947af] text-white py-4 rounded font-bold uppercase tracking-wider active:scale-[0.98] transition-transform">
                Đặt hàng ngay
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="w-full text-blue-600 text-sm flex justify-center items-center gap-1 italic"
              >
                <ChevronLeft size={16} /> Quay về giỏ hàng
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="flex-1 lg:max-w-[420px]">
            <div className="bg-white p-6 border border-gray-200 rounded-lg sticky top-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">
                Đơn hàng ({mockCart.length} sản phẩm)
              </h2>

              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {mockCart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        className="w-16 h-16 rounded-md object-cover border border-gray-100"
                        alt={item.name}
                      />
                      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[11px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[13px] font-medium text-gray-800 leading-snug line-clamp-2">
                        {item.name}
                      </h4>
                    </div>
                    <div className="text-sm text-gray-500 italic whitespace-nowrap">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-6 border-t pt-6">
                <input
                  placeholder="Mã giảm giá"
                  className="flex-1 p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500"
                />
                <button className="bg-[#6687cc] text-white px-5 py-2.5 rounded font-bold text-sm hover:bg-blue-700 transition">
                  Sử dụng
                </button>
              </div>

              <div className="space-y-3 border-t pt-6 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-gray-800">
                    {subtotal.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="italic">Miễn phí</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-4 text-blue-800">
                  <span>Tổng cộng</span>
                  <span className="text-2xl">
                    {subtotal.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              {/* Desktop Footer Button */}
              <div className="hidden lg:block mt-8 space-y-4">
                <button className="w-full bg-[#1947af] text-white py-4 rounded font-bold uppercase tracking-widest shadow-md hover:bg-blue-800 transition-all active:scale-[0.99]">
                  HOÀN TẤT ĐẶT HÀNG
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="w-full text-blue-600 text-sm flex justify-center items-center gap-1 hover:underline italic"
                >
                  <ChevronLeft size={16} /> Quay về giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
