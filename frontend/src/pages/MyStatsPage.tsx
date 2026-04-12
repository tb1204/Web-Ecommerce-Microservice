import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  TrendingUp,
  Award,
  ChevronRight,
  ArrowLeft,
  Star,
  Zap,
  Crown,
  Diamond,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ──────────────── helpers ──────────────── */
const TIERS = [
  {
    key: "MEMBER",
    label: "Member",
    minSpent: 0,
    minOrders: 0,
    discount: 0,
    color: "from-slate-400 to-slate-500",
    bg: "bg-slate-50 dark:bg-slate-900/40",
    border: "border-slate-200 dark:border-slate-700",
    text: "text-slate-700 dark:text-slate-300",
    badge:
      "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    Icon: Star,
  },
  {
    key: "SILVER",
    label: "Silver",
    minSpent: 3_000_000,
    minOrders: 3,
    discount: 3,
    color: "from-gray-400 to-gray-500",
    bg: "bg-gray-50 dark:bg-gray-900/40",
    border: "border-gray-300 dark:border-gray-600",
    text: "text-gray-700 dark:text-gray-200",
    badge:
      "bg-gray-200 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600",
    Icon: Zap,
  },
  {
    key: "GOLD",
    label: "Gold",
    minSpent: 5_000_000,
    minOrders: 20,
    discount: 7,
    color: "from-yellow-400 to-amber-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-300 dark:border-yellow-700/50",
    text: "text-yellow-800 dark:text-yellow-400",
    badge:
      "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-300 dark:from-yellow-900/40 dark:to-amber-900/40 dark:text-yellow-400 dark:border-yellow-700/50",
    Icon: Crown,
  },
  {
    key: "DIAMOND",
    label: "Diamond",
    minSpent: 15_000_000,
    minOrders: 75,
    discount: 12,
    color: "from-cyan-400 to-blue-500",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    border: "border-blue-300 dark:border-cyan-700/50",
    text: "text-blue-800 dark:text-cyan-300",
    badge:
      "bg-gradient-to-r from-cyan-100 to-blue-100 text-blue-800 border border-blue-300 dark:from-cyan-900/40 dark:to-blue-900/40 dark:text-cyan-300 dark:border-cyan-700/50",
    Icon: Diamond,
  },
];

function getTierInfo(membershipKey: string) {
  return (
    TIERS.find(
      (t) => t.key === membershipKey || t.label === membershipKey,
    ) ?? TIERS[0]
  );
}

function getNextTier(membershipKey: string) {
  const idx = TIERS.findIndex(
    (t) => t.key === membershipKey || t.label === membershipKey,
  );
  if (idx === -1 || idx >= TIERS.length - 1) return null;
  return TIERS[idx + 1];
}

function fmtVND(n: number) {
  return n.toLocaleString("vi-VN") + "₫";
}

/* ──────────────── component ──────────────── */
export default function MyStatsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // User stats from user-service
  const [membership, setMembership] = useState("MEMBER");
  const [totalSpent, setTotalSpent] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);

  // Orders from order-service
  const [deliveredOrders, setDeliveredOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    const load = async () => {
      setLoading(true);
      try {
        const token = await getToken({ template: "my-backend" });
        const headers = { Authorization: `Bearer ${token}` };

        // 1. User profile (membership, totalSpent, purchaseCount)
        const profileRes = await axios.get(`${BASE_URL}/api/users/me`, {
          headers,
        });
        const profile = profileRes.data;
        const rawMembership =
          profile.membership?.name ?? profile.membership ?? "MEMBER";
        setMembership(rawMembership);
        setTotalSpent(
          typeof profile.totalSpent === "number"
            ? profile.totalSpent
            : parseFloat(profile.totalSpent ?? "0"),
        );
        setPurchaseCount(profile.purchaseCount ?? 0);

        // 2. User orders — filter DELIVERED on client side
        const ordersRes = await axios.get(
          `${BASE_URL}/api/orders/user/${user.id}`,
          { headers },
        );
        const allOrders: any[] = Array.isArray(ordersRes.data)
          ? ordersRes.data
          : [];
        setDeliveredOrders(
          allOrders.filter((o) => o.orderStatus === "DELIVERED"),
        );
      } catch (err) {
        console.error("MyStatsPage load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FBFBFB] dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-4 border-emerald-500/30 border-t-emerald-600 animate-spin" />
          <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
            Đang tải thống kê...
          </p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    navigate("/login");
    return null;
  }

  const tier = getTierInfo(membership);
  const nextTier = getNextTier(membership);
  const TierIcon = tier.Icon;

  // Progress to next tier (based on totalSpent)
  const progressPct = nextTier
    ? Math.min(
        100,
        Math.round((totalSpent / nextTier.minSpent) * 100),
      )
    : 100;

  const spentToNextTier = nextTier
    ? Math.max(0, nextTier.minSpent - totalSpent)
    : 0;

  // Calculate actual total spent from delivered orders (may differ from DB due to edge cases)
  const computedSpent = deliveredOrders.reduce(
    (sum, o) => sum + (o.summary?.totalAmount ?? 0),
    0,
  );

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-[#0a0a0a] py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-20 -left-48 w-96 h-96 bg-emerald-400/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 -right-48 w-96 h-96 bg-blue-400/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        {/* ── Back button ── */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Quay lại hồ sơ
        </button>

        {/* ── Page title ── */}
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Thống kê mua hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Xin chào,{" "}
            <span className="font-bold text-gray-700 dark:text-gray-200">
              {user?.firstName} {user?.lastName}
            </span>{" "}
            👋
          </p>
        </div>

        {/* ── Membership card ── */}
        <div
          className={`relative rounded-3xl overflow-hidden border-2 ${tier.border} shadow-xl`}
        >
          {/* Gradient header */}
          <div
            className={`bg-gradient-to-r ${tier.color} px-8 py-7 flex items-center justify-between`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
                <TierIcon size={28} className="text-white" />
              </div>
              <div>
                <p className="text-white/80 text-xs font-bold uppercase tracking-widest">
                  Hạng thành viên
                </p>
                <p className="text-white text-2xl font-black tracking-tight mt-0.5">
                  {tier.label}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
                Ưu đãi hiện tại
              </p>
              <p className="text-white text-3xl font-black mt-0.5">
                {tier.discount > 0 ? `-${tier.discount}%` : "—"}
              </p>
              {tier.discount > 0 && (
                <p className="text-white/70 text-xs mt-0.5">
                  giảm mỗi đơn hàng
                </p>
              )}
            </div>
          </div>

          {/* Progress to next tier */}
          <div className={`${tier.bg} px-8 py-6`}>
            {nextTier ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-sm font-bold ${tier.text}`}>
                    Tiến trình lên <span className="font-black">{nextTier.label}</span>
                  </p>
                  <p className={`text-sm font-black ${tier.text}`}>
                    {progressPct}%
                  </p>
                </div>
                <div className="w-full h-3 bg-white/60 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${tier.color} rounded-full transition-all duration-700`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className={`text-xs mt-2.5 ${tier.text} opacity-80`}>
                  Còn cần{" "}
                  <span className="font-black">{fmtVND(spentToNextTier)}</span>{" "}
                  để lên hạng{" "}
                  <span className="font-black">{nextTier.label}</span> (giảm{" "}
                  {nextTier.discount}%)
                </p>
              </>
            ) : (
              <div className="text-center py-2">
                <p className={`font-black text-sm ${tier.text}`}>
                  🎉 Bạn đã đạt hạng cao nhất — Diamond!
                </p>
                <p className={`text-xs mt-1 ${tier.text} opacity-70`}>
                  Giảm 12% mỗi đơn hàng
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Delivered orders */}
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShoppingBag size={22} />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {deliveredOrders.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                Đơn hàng thành công
              </p>
            </div>
          </div>

          {/* Total spent (from DB) */}
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                {fmtVND(totalSpent)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                Tổng chi tiêu (hệ thống)
              </p>
            </div>
          </div>

          {/* Purchase count */}
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm flex flex-col gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Award size={22} />
            </div>
            <div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {purchaseCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                Tổng lượt mua (tích lũy)
              </p>
            </div>
          </div>
        </div>

        {/* ── Tier roadmap ── */}
        <div className="bg-white dark:bg-gray-800/80 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Lộ trình hạng thành viên
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
              Điều kiện đạt hạng (thoả 1 trong 2 điều kiện)
            </p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {TIERS.map((t) => {
              const isCurrent =
                t.key === membership || t.label === membership;
              const TIcon = t.Icon;
              return (
                <div
                  key={t.key}
                  className={`flex items-center gap-5 px-8 py-5 transition-colors ${
                    isCurrent
                      ? "bg-emerald-50/70 dark:bg-emerald-900/10"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br ${t.color} shadow-sm shrink-0`}
                  >
                    <TIcon size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-gray-900 dark:text-white">
                        {t.label}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                          Hiện tại
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {t.minSpent > 0
                        ? `Chi tiêu ${fmtVND(t.minSpent)} hoặc ${t.minOrders} đơn hàng`
                        : "Mặc định khi đăng ký"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-gray-900 dark:text-white">
                      {t.discount > 0 ? `-${t.discount}%` : "—"}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium">
                      {t.discount > 0 ? "mỗi đơn" : "không giảm"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Recent delivered orders ── */}
        <div className="bg-white dark:bg-gray-800/80 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Đơn hàng đã nhận gần đây
            </h2>
          </div>
          {deliveredOrders.length === 0 ? (
            <div className="px-8 py-12 text-center">
              <ShoppingBag size={36} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Chưa có đơn hàng nào được giao thành công
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {deliveredOrders
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .slice(0, 10)
                .map((order) => (
                  <button
                    key={order.id}
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="w-full flex items-center justify-between px-8 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group text-left"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {order.items?.length ?? 0} sản phẩm ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                        {fmtVND(order.summary?.totalAmount ?? 0)}
                      </p>
                      <ChevronRight
                        size={16}
                        className="text-gray-300 group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-400 transition-colors"
                      />
                    </div>
                  </button>
                ))}
            </div>
          )}
          {deliveredOrders.length > 10 && (
            <div className="px-8 py-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => navigate("/my-orders")}
                className="text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                Xem tất cả {deliveredOrders.length} đơn hàng 
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
