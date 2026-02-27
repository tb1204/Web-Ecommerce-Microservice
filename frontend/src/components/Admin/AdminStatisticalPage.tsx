import React, { useState, useEffect, useRef } from "react";
import {
  DollarSign, ShoppingBag, Users, TrendingUp,
  AlertTriangle, XCircle, Printer, Clock, PackageCheck, PackageOpen, ArrowUpRight
} from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
import { useReactToPrint } from "react-to-print";

// --- INTERFACES ---
interface ProductStat {
  name: string;
  sub: string;
  value: string;
  isAlert?: boolean;
}

interface ChartData {
  name: string;
  doanhThu: number | null;
  rawDate: Date;
}

const AdminStatisticalPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [timeFilter, setTimeFilter] = useState<"day" | "week" | "month">("day");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Bao_cao_Artisano_${new Date().toLocaleDateString()}`,
  });

  // --- DỮ LIỆU MẪU ---
  const revenueDataMap: Record<string, ChartData[]> = {
    day: [
      { name: "T2", doanhThu: 15000000, rawDate: new Date("2026-02-23") },
      { name: "T3", doanhThu: 20000000, rawDate: new Date("2026-02-24") },
      { name: "T4", doanhThu: 12000000, rawDate: new Date("2026-02-25") },
      { name: "T5", doanhThu: 45000000, rawDate: new Date("2026-02-26") },
      { name: "T6", doanhThu: 32000000, rawDate: new Date("2026-02-27") },
      { name: "T7", doanhThu: 85000000, rawDate: new Date("2026-02-28") },
      { name: "CN", doanhThu: 98000000, rawDate: new Date("2026-03-01") },
    ],
    week: [
      { name: "Tuần 1", doanhThu: 450000000, rawDate: new Date("2026-02-01") },
      { name: "Tuần 2", doanhThu: 380000000, rawDate: new Date("2026-02-08") },
      { name: "Tuần 3", doanhThu: 520000000, rawDate: new Date("2026-02-15") },
      { name: "Tuần 4", doanhThu: 610000000, rawDate: new Date("2026-02-22") },
    ],
    month: [
      { name: "Tháng 1", doanhThu: 120000000, rawDate: new Date("2026-01-01") },
      { name: "Tháng 2", doanhThu: 210000000, rawDate: new Date("2026-02-01") },
      { name: "Tháng 12", doanhThu: 850000000, rawDate: new Date("2026-12-01") },
    ],
  };

  const filteredData = revenueDataMap[timeFilter].map(item => {
    if (!startDate || !endDate) return item;
    const d = item.rawDate;
    const s = new Date(startDate); s.setHours(0,0,0,0);
    const e = new Date(endDate); e.setHours(23,59,59,999);
    return (d >= s && d <= e) ? item : { ...item, doanhThu: null };
  });

  const statusData = [
    { name: "Chờ xác nhận", value: 12, color: "#f59e0b" },
    { name: "Đang đóng gói", value: 8, color: "#3b82f6" },
    { name: "Đang giao hàng", value: 15, color: "#8b5cf6" },
    { name: "Đã giao hàng", value: 60, color: "#10b981" },
    { name: "Đã hủy", value: 5, color: "#ef4444" },
  ];

  const categoryData = [
    { name: "Nệm cao su", giaTri: 150000000, color: "#059669" },
    { name: "Chiếu điều hòa", giaTri: 85000000, color: "#10b981" },
    { name: "Gối & Ga", giaTri: 45000000, color: "#34d399" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-gray-50 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-gray-400 text-[14px] font-black tracking-[3px]">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-900" ref={reportRef}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 no-print">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <TrendingUp className="text-emerald-600" /> Quản lý thống kê
          </h1>
        </div>
        <button onClick={() => handlePrint()} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md active:scale-95">
          <Printer size={18}/> In báo cáo
        </button>
      </div>

      {/* CHỈ SỐ TỔNG QUAN - GIỮ NGUYÊN KÍCH THƯỚC CARD, CHỈ TĂNG CHỮ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Tổng doanh thu" value="4.246.300.000 VNĐ" icon={<DollarSign size={18}/>} color="emerald" />
        <StatCard title="Tổng đơn hàng" value="1.452" icon={<ShoppingBag size={18}/>} color="blue" />
        <StatCard title="Đang xử lý" value="20" icon={<Clock size={18}/>} color="amber" />
        <StatCard title="Đơn đã hủy" value="12" icon={<XCircle size={18}/>} color="red" />
        <StatCard title="Khách hàng" value="3,842" icon={<Users size={18}/>} color="indigo" />
        <StatCard title="Khách mới" value="+145" icon={<ArrowUpRight size={18}/>} color="emerald" />
      </div>

      {/* BIỂU ĐỒ DOANH THU & TRẠNG THÁI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            {/* Tăng từ text-sm lên text-base */}
            <h3 className="text-base font-black text-gray-800 uppercase tracking-widest italic leading-none">Tăng trưởng doanh thu</h3>
            
            <div className="flex items-center gap-3 no-print">
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                {/* Tăng từ text-[10px] lên text-[12px] */}
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-[12px] font-bold text-gray-600 outline-none cursor-pointer" />
                <span className="text-gray-300">→</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-[12px] font-bold text-gray-600 outline-none cursor-pointer" />
              </div>

              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                {(["day", "week", "month"] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setTimeFilter(type)}
                    // Tăng từ text-[10px] lên text-[12px]
                    className={`px-4 py-1.5 text-[12px] font-black uppercase rounded-lg transition-all ${timeFilter === type ? "bg-white text-emerald-600 shadow-sm border border-emerald-100" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {type === "day" ? "Thứ" : type === "week" ? "Tuần" : "Tháng"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                {/* Tăng fontSize từ 10 lên 12 */}
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 900}} />
                <YAxis 
                  axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 900}} 
                  tickFormatter={(v) => v.toLocaleString('vi-VN')}
                  width={90} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '14px' }} 
                  labelStyle={{ fontWeight: 'bold', color: '#10b981' }}
                />
                <Area type="monotone" dataKey="doanhThu" stroke="#10b981" strokeWidth={5} fill="url(#colorRev)" connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center">
          {/* Tăng từ text-sm lên text-base */}
          <h3 className="text-base font-black text-gray-800 uppercase tracking-widest mb-8 italic">Trạng thái đơn hàng</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                {/* Tăng fontSize từ 9 lên 11 */}
                <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DOANH THU THEO DANH MỤC & TOP SẢN PHẨM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
           {/* Tăng từ text-sm lên text-base */}
           <h3 className="text-base font-black text-gray-800 uppercase tracking-widest mb-8 italic">Doanh thu theo danh mục</h3>
           <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" hide />
                  {/* Tăng fontSize từ 10 lên 12 */}
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 900}} width={120} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="giaTri" radius={[0, 10, 10, 0]} barSize={24}>
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProductListCard 
              title="Bán chạy nhất" 
              icon={<PackageCheck className="text-emerald-500" size={18}/>}
              items={[
                { name: "Nệm WolfBed Luxury", sub: "15 đơn đã giao", value: "225.0M VNĐ" },
                { name: "Chiếu Doona Aqua", sub: "45 sản phẩm", value: "32.8M VNĐ" },
              ]}
            />
            <ProductListCard 
              title="Bị hủy nhiều" 
              icon={<XCircle className="text-red-400" size={18}/>}
              items={[
                { name: "Nệm cũ thanh lý", sub: "Hủy 8 lần", value: "Kiểm tra" },
                { name: "Gối gòn thấp cấp", sub: "Hủy 5 lần", value: "Kiểm tra" },
              ]}
            />
        </div>
      </div>

      {/* TỒN KHO & CẢNH BÁO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductListCard 
          title="Tồn kho nhiều" 
          icon={<PackageOpen className="text-blue-500" size={18}/>}
          items={[
            { name: "Drap Cotton 1m6", sub: "", value: "200 bộ" },
            { name: "Vỏ gối nằm", sub: "", value: "150 cái" },
          ]}
        />
        <ProductListCard 
          title="Sắp hết hàng" 
          icon={<AlertTriangle className="text-red-500" size={18}/>}
          items={[
            { name: "Nệm WolfBed 1m8", sub: "Cần nhập gấp", value: "Còn 2", isAlert: true },
            { name: "Gối Doona làm mát", sub: "Cần nhập gấp", value: "Còn 5", isAlert: true },
          ]}
        />
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS CẬP NHẬT CHỮ (+2PX) ---

// THẺ CHỈ SỐ - Tăng 2px chữ cho Title và Value
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-all">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 bg-${color}-50 text-${color}-600`}>
      {icon}
    </div>
    {/* Tăng từ text-[9px] lên text-[11px] */}
    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{title}</p>
    {/* Tăng từ text-md (16px) lên text-lg (18px) */}
    <h3 className="text-lg font-black text-gray-800 leading-none truncate italic tracking-tighter">{value}</h3>
  </div>
);

// DANH SÁCH SẢN PHẨM - Tăng 2px chữ cho tất cả các nhãn
const ProductListCard: React.FC<{ title: string; icon: React.ReactNode; items: ProductStat[] }> = ({ title, icon, items }) => (
  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-md transition-all h-full">
    <div className="flex items-center gap-2 mb-6">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      {/* Tăng từ text-[11px] lên text-[13px] */}
      <h3 className="text-[13px] font-black text-gray-800 uppercase tracking-widest italic leading-none">{title}</h3>
    </div>
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center">
          <div className="max-w-[70%]">
            {/* Tăng từ text-[11px] lên text-[13px] */}
            <p className="text-[13px] font-black text-gray-700 leading-none truncate italic">{item.name}</p>
            {/* Tăng từ text-[9px] lên text-[11px] */}
            <p className="text-[11px] text-gray-400 font-bold mt-1.5 uppercase italic tracking-tighter leading-none">{item.sub}</p>
          </div>
          {/* Tăng từ text-[9px] lên text-[11px] */}
          <span className={`text-[11px] font-black px-2.5 py-1 rounded-md ${item.isAlert ? "bg-red-50 text-red-600 animate-pulse" : "bg-emerald-50 text-emerald-600"}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default AdminStatisticalPage;