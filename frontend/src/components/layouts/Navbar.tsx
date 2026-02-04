import { useNavigate } from "react-router-dom";
import logo1 from "../../assets/logo2.jpg";

import {
  FaRegHeart,
  FaRegBell,
  FaCommentDots,
  FaClipboardList,
  FaBoxOpen,
} from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FiUser, FiUserPlus, FiLogIn } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import { useState, type FormEvent } from "react";
import CartDrawer from "./CartDrawer";
import { UserButton, useUser } from "@clerk/clerk-react";

// 1. Sau này bạn sẽ import các selectors từ Redux Slice
// import { useSelector } from "react-redux";
// import { selectCartCount } from "../../redux/cartSlice";
// import { selectWishlistCount } from "../../redux/wishlistSlice";
// import { selectNotifications } from "../../redux/notificationSlice";

interface Notification {
  id: number;
  type: "comment" | "order";
  content: string;
  time: string;
  unread: boolean;
}

import { useWishlist } from "../common/WishlistContent";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: "comment",
      content:
        "Admin đã phản hồi bình luận của bạn trong sản phẩm 'Áo thun Polo'.",
      time: "2 phút trước",
      unread: true,
    },
    {
      id: 2,
      type: "order",
      content: "Đơn hàng #SHP123 đã chuyển sang trạng thái 'Đang giao'.",
      time: "1 giờ trước",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const wishlistCount = 3; // Thay bằng useSelector(selectWishlistCount)
  const cartCount = 5; // Thay bằng useSelector(selectCartCount)

  // ==========================================================

  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);
  const handleWishlistClick = () => navigate("/wishlist");
  const displayName = user?.username || user?.fullName || user?.firstName || "";

<<<<<<< HEAD
=======
  
  const cartCount = 5;

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

>>>>>>> 8e5b1ef645bf8cc428bce629e756afbce38991c6
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    navigate(`/collections/all?search=${encodeURIComponent(query)}`);
  };

<<<<<<< HEAD
=======
  const { wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems?.length || 0;

>>>>>>> 8e5b1ef645bf8cc428bce629e756afbce38991c6
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

          {/* 2. Search Box */}
          <div className="order-3 lg:order-none col-span-2 lg:col-span-1">
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

            {/* --- NOTIFICATION DROPDOWN (REDUX READY) --- */}
            <div className="relative group">
              <button className="relative p-2 hover:bg-[#3cb371]/10 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none">
                <FaRegBell size={26} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 left-5 p-2  bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[110] overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                  <h3 className="font-bold text-sm">
                    Thông báo ({unreadCount})
                  </h3>
                  <span className="text-[11px] text-[#3cb371] cursor-pointer hover:underline">
                    Xem tất cả
                  </span>
                </div>

                <div className="flex flex-col max-h-[350px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((noti) => (
                      <div
                        key={noti.id}
                        className={`flex gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer border-b border-gray-50 dark:border-gray-700 last:border-0 ${
                          noti.unread
                            ? "bg-[#3cb371]/5 dark:bg-[#3cb371]/10"
                            : ""
                        }`}
                      >
                        <div className="mt-1 shrink-0">
                          {noti.type === "comment" ? (
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
                          <p className="text-sm leading-[1.4] text-gray-800 dark:text-gray-200 font-medium">
                            {noti.content}
                          </p>
                          <span className="text-[11px] text-gray-400 font-normal">
                            {noti.time}
                          </span>
                        </div>
                        {noti.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
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

            {/* User Dropdown */}
            <div className="relative group cursor-pointer hover:rounded-lg hover:bg-[#3cb371]/10">
              <div className="flex flex-col items-center md:flex-row md:items-center md:gap-1.5 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                {isLoaded && isSignedIn ? (
                  <UserButton>
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

            {/* --- WISHLIST (REDUX READY) --- */}
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

            {/* --- CART (REDUX READY) --- */}
            <button
              type="button"
              onClick={toggleCartDrawer}
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

        <CartDrawer
          drawerOpen={drawerOpen}
          toggleCartDrawer={toggleCartDrawer}
        />
      </div>
    </header>
  );
};

export default Navbar;
