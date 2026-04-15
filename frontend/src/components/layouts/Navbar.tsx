

import { useState, useEffect } from "react";
// import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
// import { useTheme } from "../common/ThemeProvider";
import { useTheme } from "../../context/ThemeContext";
// import { IoIosSearch } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import {
  FaRegBell,
  FaRegHeart,
  FaCartShopping,
  FaCommentDots,
  FaClipboardList,
  FaBoxOpen,
} from "react-icons/fa6";
import { FiUser, FiLogIn, FiUserPlus } from "react-icons/fi";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
// import logo1 from "../../assets/logo/logo1.webp";
import logo1 from "../../assets/logo2.jpg";
import CartDrawer from "../layouts/CartDrawer";
import { useWishlist } from "../common/WishlistContent";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleCartDrawer } from "../../store/slices/uiSlice";
import { selectCartItemCount } from "../../store/selectors";

//fix lỗi hiện số lượng san phẩm trong giỏ hàng khi reload trang
import { fetchCart } from "../../store/slices/cartSlice";
// import { fetchWishlist } from "../../store/slices/userSlice"; // nếu chưa có
import { useAuth } from "@clerk/clerk-react";

//import search
import Search from "../layouts/Search";

const Navbar = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // const [searchTerm, setSearchTerm] = useState<string>("");
  const { theme, toggleTheme } = useTheme();
  const { isLoaded, isSignedIn, user } = useUser();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  // ── Redux cart ──────────────────────────────────────────────────────────────
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartItemCount);
  const handleToggleCart = () => dispatch(toggleCartDrawer());
  // ────────────────────────────────────────────────────────────────────────────

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  //fix
  const { getToken } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      getToken({ template: "my-backend" }).then((token) => {
        dispatch(fetchCart(token));
      });
    }
  }, [isSignedIn]);
  useEffect(() => {
    if (isSignedIn && user?.id) {
      axios
        .get(`${BASE_URL}/api/notifications/user/${user.id}`)
        .then((res) => {
          setNotifications(res.data);
          setUnreadCount(
            res.data.filter((n: any) => n.status === "UNREAD").length,
          );
        })
        .catch((err) => console.error("Lỗi lấy thông báo:", err));
    }
  }, [isSignedIn, user?.id]);

  useEffect(() => {
    if (!isSignedIn || !user?.id) return;
    const socket = new SockJS(`${BASE_URL}/ws-notifications`);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {};
    stompClient.connect(
      {},
      () => {
        stompClient.subscribe(`/topic/notifications/${user.id}`, (message) => {
          const newNoti = JSON.parse(message.body);
          setNotifications((prev) => [newNoti, ...prev]);
          setUnreadCount((prev) => prev + 1);
        });
      },
      (err: any) => console.log("Lỗi kết nối WebSocket:", err),
    );
    return () => {
      if (stompClient) stompClient.disconnect(() => {});
    };
  }, [isSignedIn, user?.id]);

  const handleMarkAsRead = async (noti: any) => {
    try {
      if (noti.status === "UNREAD") {
        await axios.put(`${BASE_URL}/api/notifications/${noti.id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n.id === noti.id ? { ...n, status: "READ" } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      if (noti.type === "COMMENT" && noti.productId) {
        navigate(`/product/${noti.productId}`);
      } else if (noti.orderId) {
        if (noti.newStatus === "DELIVERED" && noti.productId) {
          navigate(`/product/${noti.productId}`);
        } else {
          navigate(`/order/${noti.orderId}`);
        }
      } else {
        navigate("/my-orders");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Lỗi xử lý thông báo:", error.message);
      } else {
        console.error("Lỗi xử lý thông báo:", error);
      }
    }
  };

  const displayName = user?.username || user?.fullName || user?.firstName || "";

  const handleWishlistClick = () => navigate("/wishlist");

  // const handleSearch = (e: FormEvent) => {
  //   e.preventDefault();
  //   const query = searchTerm.trim();
  //   if (!query) return;
  //   navigate(`/collections/all?search=${encodeURIComponent(query)}`);
  // };
  // const handleSearch = (e: FormEvent) => {
  //   e.preventDefault();
  //   if (!searchTerm.trim()) return;
  //   navigate(`/collections/all?q=${encodeURIComponent(searchTerm.trim())}`);

  //   setSearchTerm("");
  // };

  const { wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems?.length || 0;

  return (
    <header className="w-full bg-white dark:bg-gray-900 text-black dark:text-white shadow-md sticky top-0 z-[100]">
      <div className="px-4 py-3 md:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-3 items-center gap-y-4 gap-x-2">
          {/* 1. Logo */}
          <div className="flex justify-start items-center">
            <img
              src={logo1}
              alt="logo"
              className="h-9 sm:h-11 md:h-12 w-auto cursor-pointer rounded-md object-contain"
              onClick={() => navigate("/")}
            />
          </div>

          {/* 2. Search */}
          {/* <div className="order-3 lg:order-none col-span-2 lg:col-span-1">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full border border-gray-200 dark:border-gray-700 rounded-full pl-5 pr-1.5 py-1 bg-gray-50 dark:bg-gray-800 focus-within:border-[#3cb371] focus-within:bg-white dark:focus-within:bg-gray-900 transition-all shadow-sm"
            >
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full outline-none bg-transparent text-sm placeholder-gray-500 dark:placeholder-gray-400 py-1"
              />
              <button
                type="submit"
                className="p-2 hover:bg-[#3cb371]/10 rounded-full transition-colors text-gray-500 hover:text-[#3cb371]"
              >
                <IoIosSearch size={24} className="shrink-0" />
              </button>
            </form>
          </div> */}
          <div className="order-3 lg:order-none col-span-2 lg:col-span-1">
            <Search />
          </div>

          {/* 3. Action Icons */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 md:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            >
              {isDark ? <MdDarkMode size={26} /> : <MdLightMode size={26} />}
            </button>

            {/* Notification */}
            <div className="relative group">
              <button className="relative p-2 hover:bg-[#3cb371]/10 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none">
                <FaRegBell size={26} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 left-5 p-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[110] overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                  <h3 className="font-bold text-sm">
                    Thông báo ({unreadCount})
                  </h3>
                  <span
                    onClick={() => navigate("/my-orders")}
                    className="text-[11px] text-[#3cb371] cursor-pointer hover:underline"
                  >
                    Xem tất cả
                  </span>
                </div>

                <div className="flex flex-col max-h-[350px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((noti) => (
                      <div
                        key={noti.id}
                        onClick={() => handleMarkAsRead(noti)}
                        className={`flex gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer border-b border-gray-50 dark:border-gray-700 last:border-0 ${
                          noti.status === "UNREAD"
                            ? "bg-[#3cb371]/5 dark:bg-[#3cb371]/10"
                            : ""
                        }`}
                      >
                        <div className="mt-1 shrink-0">
                          {noti.type?.toUpperCase() === "COMMENT" ? (
                            <FaCommentDots
                              className="text-blue-500"
                              size={18}
                            />
                          ) : (
                            <FaClipboardList
                              className="text-[#3cb371]"
                              size={18}
                            />
                          )}
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <p
                            className={`text-sm leading-[1.4] ${
                              noti.status === "UNREAD"
                                ? "font-bold text-black dark:text-white"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {noti.message}
                          </p>
                          <span className="text-[11px] text-gray-400 font-normal">
                            {new Date(noti.createdAt).toLocaleString("vi-VN")}
                          </span>
                        </div>
                        {noti.status === "UNREAD" && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-sm text-gray-500">
                      Không có thông báo nào
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* User */}
            <div className="relative group cursor-pointer hover:rounded-lg hover:bg-[#3cb371]/10">
              <div className="flex flex-col items-center md:flex-row md:items-center md:gap-1.5 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                {isLoaded && isSignedIn ? (
                  <UserButton
                    userProfileMode="navigation"
                    userProfileUrl="/profile"
                    afterSignOutUrl="/"
                  >
                    <UserButton.MenuItems>
                      <UserButton.Action
                        label="Đơn hàng của bạn"
                        labelIcon={<FaBoxOpen size={16} />}
                        onClick={() => navigate("/my-orders")}
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                ) : (
                  <FiUser
                    size={26}
                    className="text-gray-700 dark:text-gray-300"
                  />
                )}
                {isLoaded && isSignedIn && displayName && (
                  <span className="text-xs md:text-sm font-medium text-center md:text-left hidden sm:block">
                    {displayName}
                  </span>
                )}
              </div>

              {!isSignedIn && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition rounded-t-xl"
                  >
                    <FiLogIn size={22} />
                    <span className="text-sm">Đăng nhập</span>
                  </div>
                  <div
                    onClick={() => navigate("/register")}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition rounded-b-xl"
                  >
                    <FiUserPlus size={22} />
                    <span className="text-sm">Đăng ký</span>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlistClick}
              className="relative p-2 hover:bg-[#3cb371]/10 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors focus:outline-none"
            >
              <FaRegHeart size={26} />
              {wishlistCount > 0 && (
                <span className="absolute -top-[5px] -right-[2px] bg-[#198754] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart — dùng Redux dispatch */}
            <button
              type="button"
              onClick={handleToggleCart}
              className="relative p-2 hover:bg-[#3cb371]/10 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors focus:outline-none"
            >
              <FaCartShopping size={26} />
              {cartCount > 0 && (
                <span className="absolute -top-[5px] -right-[2px] bg-[#ffc107] text-black font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm dark:border-gray-900">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* CartDrawer không cần props vì dùng Redux nội bộ */}
        <CartDrawer />
      </div>
    </header>
  );
};

export default Navbar;
