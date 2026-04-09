import React, { useState, useEffect, useRef } from "react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  XCircle,
  Printer,
  Clock,
  PackageCheck,
  PackageOpen,
  ArrowUpRight,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useReactToPrint } from "react-to-print";
import axios from "axios";

// --- INTERFACES ---
interface ProductStat {
  name: string;
  sub: string;
  value: string;
  isAlert?: boolean;
}
interface CategoryStat {
  name: string;
  giaTri: number;
  color: string;
}

interface ProductRanking {
  name: string;
  sub: string;
  value: string;
}

interface InventoryStat {
  name: string;
  sub: string;
  value: string;
  isAlert?: boolean;
}

interface RevenueGrowthStat {
  name: string;
  doanhThu: number;
}
// interface ChartData {
//   name: string;
//   doanhThu: number | null;
//   rawDate: Date;
// }

const AdminStatisticalPage: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState<boolean>(true);
  // const [timeFilter, setTimeFilter] = useState<"day" | "week" | "month">("day");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const reportRef = useRef<HTMLDivElement>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
    processing: 0,
  });
  const [categoryData, setCategoryData] = useState<CategoryStat[]>([]);
  const [userStats, setUserStats] = useState({ totalUsers: 0, newUsers: 0 });
  const [topSelling, setTopSelling] = useState<ProductRanking[]>([]);
  const [mostCancelled, setMostCancelled] = useState<ProductRanking[]>([]);
  const [highStock, setHighStock] = useState<InventoryStat[]>([]);
  const [lowStock, setLowStock] = useState<InventoryStat[]>([]);
  const [revenueGrowth, setRevenueGrowth] = useState<RevenueGrowthStat[]>([]);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const getStartOfThisMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const getStartOfLastMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1, 1);
  };

  const getEndOfLastMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 0);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Bao_cao_Artisano_${new Date().toLocaleDateString()}`,
  });

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/orders/statistics/total-revenue`,
        );
        setTotalRevenue(response.data);
      } catch (error) {
        console.error("Lỗi lấy doanh thu:", error);
      }
    };
    fetchRevenue();
  }, []);

  useEffect(() => {
    const fetchOrderCounts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/orders/statistics/order-counts`,
        );
        setOrderStats(response.data);
      } catch (error) {
        console.error("Lỗi lấy số lượng đơn hàng:", error);
      }
    };
    fetchOrderCounts();
  }, []);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/users/statistics/user-counts`,
        );
        setUserStats(response.data);
      } catch (error) {
        console.error("Lỗi lấy thống kê người dùng:", error);
      }
    };
    fetchUserStats();
  }, []);

  useEffect(() => {
    const fetchCategoryRevenue = async () => {
      try {
        // Gọi API từ Order Service (Port 8084)
        const response = await axios.get(
          `${BASE_URL}/api/orders/statistics/revenue-by-category`,
        );
        const colors = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];

        const formattedData = response.data.map((item: any, index: number) => ({
          name: item.name,
          giaTri: item.giaTri,
          color: colors[index % colors.length],
        }));

        setCategoryData(formattedData);
      } catch (error) {
        console.error("Lỗi lấy doanh thu theo danh mục:", error);
      }
    };
    fetchCategoryRevenue();
  }, []);

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const [sellRes, cancelRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/orders/statistics/top-selling`),
          axios.get(`${BASE_URL}/api/orders/statistics/most-cancelled`),
        ]);
        setTopSelling(sellRes.data);
        setMostCancelled(cancelRes.data);
      } catch (error) {
        console.error("Lỗi lấy thống kê sản phẩm:", error);
      }
    };
    fetchProductStats();
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // Port 8082 là của Product Service của Bằng đúng không?
        const [highRes, lowRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/products/statistics/high-stock`),
          axios.get(`${BASE_URL}/api/products/statistics/low-stock`),
        ]);
        setHighStock(highRes.data);
        setLowStock(lowRes.data);
      } catch (error) {
        console.error("Lỗi lấy tồn kho:", error);
      }
    };
    fetchInventory();
  }, []);

  useEffect(() => {
    const fetchGrowth = async () => {
      // Chỉ gọi khi có đủ cả 2 ngày
      if (!startDate || !endDate) return;

      try {
        const response = await axios.get(
          `${BASE_URL}/api/orders/statistics/revenue-growth?start=${startDate}&end=${endDate}`,
        );
        setRevenueGrowth(response.data);
      } catch (error) {
        console.error("Lỗi lấy tăng trưởng doanh thu:", error);
      }
    };
    fetchGrowth();
  }, [startDate, endDate]);
  // --- DỮ LIỆU MẪU ---
  // const revenueDataMap: Record<string, ChartData[]> = {
  //   day: [
  //     { name: "T2", doanhThu: 15000000, rawDate: new Date("2026-02-23") },
  //     { name: "T3", doanhThu: 20000000, rawDate: new Date("2026-02-24") },
  //     { name: "T4", doanhThu: 12000000, rawDate: new Date("2026-02-25") },
  //     { name: "T5", doanhThu: 45000000, rawDate: new Date("2026-02-26") },
  //     { name: "T6", doanhThu: 32000000, rawDate: new Date("2026-02-27") },
  //     { name: "T7", doanhThu: 85000000, rawDate: new Date("2026-02-28") },
  //     { name: "CN", doanhThu: 98000000, rawDate: new Date("2026-03-01") },
  //   ],
  //   week: [
  //     { name: "Tuần 1", doanhThu: 450000000, rawDate: new Date("2026-02-01") },
  //     { name: "Tuần 2", doanhThu: 380000000, rawDate: new Date("2026-02-08") },
  //     { name: "Tuần 3", doanhThu: 520000000, rawDate: new Date("2026-02-15") },
  //     { name: "Tuần 4", doanhThu: 610000000, rawDate: new Date("2026-02-22") },
  //   ],
  //   month: [
  //     { name: "Tháng 1", doanhThu: 120000000, rawDate: new Date("2026-01-01") },
  //     { name: "Tháng 2", doanhThu: 210000000, rawDate: new Date("2026-02-01") },
  //     { name: "Tháng 12", doanhThu: 850000000, rawDate: new Date("2026-12-01") },
  //   ],
  // };

  // const filteredData = revenueDataMap[timeFilter].map(item => {
  //   if (!startDate || !endDate) return item;
  //   const d = item.rawDate;
  //   const s = new Date(startDate); s.setHours(0,0,0,0);
  //   const e = new Date(endDate); e.setHours(23,59,59,999);
  //   return (d >= s && d <= e) ? item : { ...item, doanhThu: null };
  // });
  // Hàm tính toán ngày để gửi lên API

  const statusData = [
    { name: "Chờ xác nhận", value: orderStats.pending, color: "#f59e0b" },
    { name: "Đang đóng gói", value: orderStats.processing, color: "#3b82f6" },
    { name: "Đang giao hàng", value: orderStats.shipping, color: "#8b5cf6" },
    { name: "Đã giao hàng", value: orderStats.delivered, color: "#10b981" },
    { name: "Đã hủy", value: orderStats.cancelled, color: "#ef4444" },
  ];

  // const handleQuickSelect = (type: "7days" | "thisMonth" | "lastMonth") => {
  //   const end = new Date();
  //   let start = new Date();

  //   switch (type) {
  //     case "7days":
  //       start.setDate(end.getDate() - 7);
  //       break;
  //     case "thisMonth":
  //       start = getStartOfThisMonth();
  //       break;
  //     case "lastMonth":
  //       start = getStartOfLastMonth();
  //       const lastMonthEnd = getEndOfLastMonth();
  //       setStartDate(formatDate(start));
  //       setEndDate(formatDate(lastMonthEnd));
  //       return;
  //   }

  //   setStartDate(formatDate(start));
  //   setEndDate(formatDate(end));
  // };
  const handleQuickSelect = (type: "7days" | "thisMonth" | "lastMonth") => {
    const end = new Date();
    let start = new Date();

    switch (type) {
      case "7days": {
        start.setDate(end.getDate() - 7);
        break;
      }
      case "thisMonth": {
        start = getStartOfThisMonth();
        break;
      }
      case "lastMonth": {
        start = getStartOfLastMonth();
        const lastMonthEnd = getEndOfLastMonth();
        setStartDate(formatDate(start));
        setEndDate(formatDate(lastMonthEnd));
        return;
      }
    }
    setStartDate(formatDate(start));
    setEndDate(formatDate(end));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 bg-gray-50 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-gray-400 text-[14px] font-black tracking-[3px]">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-6 bg-gray-50 min-h-screen font-sans text-gray-900"
      ref={reportRef}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 no-print">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <TrendingUp className="text-emerald-600" /> Quản lý thống kê
          </h1>
        </div>
        <button
          onClick={() => handlePrint()}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md active:scale-95"
        >
          <Printer size={18} /> In báo cáo
        </button>
      </div>

      {/* CHỈ SỐ TỔNG QUAN */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          title="Tổng doanh thu"
          value={`${totalRevenue.toLocaleString("vi-VN")} VNĐ`}
          icon={<DollarSign size={18} />}
          color="emerald"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={orderStats.total.toLocaleString()}
          icon={<ShoppingBag size={18} />}
          color="blue"
        />
        <StatCard
          title="Đang xử lý"
          value={orderStats.pending.toLocaleString()}
          icon={<Clock size={18} />}
          color="amber"
        />
        <StatCard
          title="Đơn đã hủy"
          value={orderStats.cancelled.toLocaleString()}
          icon={<XCircle size={18} />}
          color="red"
        />
        <StatCard
          title="Khách hàng"
          value={userStats.totalUsers.toLocaleString()}
          icon={<Users size={18} />}
          color="indigo"
        />
        <StatCard
          title="Khách mới"
          value={`+${userStats.newUsers.toLocaleString()}`}
          icon={<ArrowUpRight size={18} />}
          color="emerald"
        />
      </div>

      {/* BIỂU ĐỒ DOANH THU & TRẠNG THÁI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <h3 className="text-base font-black text-gray-800 uppercase tracking-widest italic leading-none">
              Tăng trưởng doanh thu
            </h3>

            <div className="flex items-center gap-3 no-print">
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-[12px] font-bold text-gray-600 outline-none cursor-pointer"
                />
                <span className="text-gray-300">→</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-[12px] font-bold text-gray-600 outline-none cursor-pointer"
                />
              </div>

              {/* <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                {(["day", "week", "month"] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setTimeFilter(type)}
                    className={`px-4 py-1.5 text-[12px] font-black uppercase rounded-lg transition-all ${timeFilter === type ? "bg-white text-emerald-600 shadow-sm border border-emerald-100" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {type === "day" ? "Thứ" : type === "week" ? "Tuần" : "Tháng"}
                  </button>
                ))}
              </div> */}
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button
                  onClick={() => handleQuickSelect("7days")}
                  className="px-3 py-1.5 text-[10px] font-black uppercase rounded-lg hover:bg-white hover:text-emerald-600 transition-all"
                >
                  7 Ngày qua
                </button>
                <button
                  onClick={() => handleQuickSelect("thisMonth")}
                  className="px-3 py-1.5 text-[10px] font-black uppercase rounded-lg hover:bg-white hover:text-emerald-600 transition-all"
                >
                  Tháng này
                </button>
                <button
                  onClick={() => handleQuickSelect("lastMonth")}
                  className="px-3 py-1.5 text-[10px] font-black uppercase rounded-lg hover:bg-white hover:text-emerald-600 transition-all"
                >
                  Tháng trước
                </button>
              </div>
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueGrowth}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 900 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 900 }}
                  tickFormatter={(v) => v.toLocaleString("vi-VN")}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    fontSize: "14px",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#10b981" }}
                />
                <Area
                  type="monotone"
                  dataKey="doanhThu"
                  stroke="#10b981"
                  strokeWidth={5}
                  fill="url(#colorRev)"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-base font-black text-gray-800 uppercase tracking-widest mb-8 italic">
            Trạng thái đơn hàng
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{
                    fontSize: "11px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    paddingTop: "20px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DOANH THU THEO DANH MỤC & TOP SẢN PHẨM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h3 className="text-base font-black text-gray-800 uppercase tracking-widest mb-8 italic">
            Doanh thu theo danh mục
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 900 }}
                  width={120}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  // formatter={(value: number) => value.toLocaleString('vi-VN') + " VNĐ"}
                  formatter={(value: number | undefined) =>
                    (value ?? 0).toLocaleString("vi-VN") + " VNĐ"
                  }
                />
                <Bar dataKey="giaTri" radius={[0, 10, 10, 0]} barSize={24}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProductListCard
            title="Bán chạy nhất"
            icon={<PackageCheck className="text-emerald-500" size={18} />}
            items={topSelling}
          />
          <ProductListCard
            title="Bị hủy nhiều"
            icon={<XCircle className="text-red-400" size={18} />}
            items={mostCancelled}
          />
        </div>
      </div>

      {/* TỒN KHO & CẢNH BÁO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductListCard
          title="Tồn kho nhiều"
          icon={<PackageOpen className="text-blue-500" size={18} />}
          items={highStock}
        />
        <ProductListCard
          title="Sắp hết hàng"
          icon={<AlertTriangle className="text-red-500" size={18} />}
          items={lowStock}
        />
      </div>
    </div>
  );
};

// THẺ CHỈ SỐ
const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-all">
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 bg-${color}-50 text-${color}-600`}
    >
      {icon}
    </div>
    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
      {title}
    </p>
    <h3 className="text-lg font-black text-gray-800 leading-none truncate italic tracking-tighter">
      {value}
    </h3>
  </div>
);

// DANH SÁCH SẢN PHẨM
const ProductListCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  items: ProductStat[];
}> = ({ title, icon, items }) => (
  <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-md transition-all h-full">
    <div className="flex items-center gap-2 mb-6">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      <h3 className="text-[13px] font-black text-gray-800 uppercase tracking-widest italic leading-none">
        {title}
      </h3>
    </div>
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center">
          <div className="max-w-[70%]">
            <p className="text-[13px] font-black text-gray-700 leading-none truncate italic">
              {item.name}
            </p>
            <p className="text-[11px] text-gray-400 font-bold mt-1.5 uppercase italic tracking-tighter leading-none">
              {item.sub}
            </p>
          </div>
          <span
            className={`text-[11px] font-black px-2.5 py-1 rounded-md ${item.isAlert ? "bg-red-50 text-red-600 animate-pulse" : "bg-emerald-50 text-emerald-600"}`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default AdminStatisticalPage;
