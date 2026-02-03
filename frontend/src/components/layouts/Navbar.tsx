import { useNavigate } from "react-router-dom";
import logo1 from "../../assets/logo2.jpg";

import { FaHeadset, FaRegHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FiUser, FiUserPlus, FiLogIn } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { useTheme } from "../../context/ThemeContext";
import { useState, type FormEvent } from "react";
import CartDrawer from "./CartDrawer";
import { UserButton, useUser } from "@clerk/clerk-react";
import { FaBoxOpen } from "react-icons/fa";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const displayName = user?.username || user?.fullName || user?.firstName || "";

  const wishlistCount = 3;
  const cartCount = 5;

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    // 1. Kiểm tra xem người dùng có nhập gì không (tránh search rỗng)
    const query = searchTerm.trim();
    if (!query) return;
    navigate(`/collections/all?search=${encodeURIComponent(query)}`);
  };
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

            {/* Hotline - Hiện đầy đủ từ md, chỉ icon trên mobile */}
            <div className="hidden md:flex items-center gap-2 group cursor-pointer hover:bg-[#3cb371]/10 rounded-full p-2">
              <FaHeadset
                size={26}
                className="text-gray-700 dark:text-gray-300 "
              />
              <div className="flex flex-col leading-tight  lg:flex">
                <span className="text-[10px] uppercase font-semibold opacity-60">
                  Hỗ trợ 24/7
                </span>
                <span className="text-sm font-bold text-[#05472a] dark:text-[#3cb371]">
                  1900 9011
                </span>
              </div>
            </div>

            {/* User - Tên user ở dưới icon trên mobile, bên cạnh trên desktop */}
            <div className="relative group cursor-pointer hover:rounded-lg hover:bg-[#3cb371]/10">
              <div className="flex flex-col items-center md:flex-row md:items-center md:gap-1.5 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                {/* Khi đã đăng nhập, icon FiUser sẽ được thay thế bởi UserButton hoặc hiển thị cạnh nhau */}
                {isLoaded && isSignedIn ? (
                  // <UserButton afterSignOutUrl="/" />
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
                  <span className="text-xs md:text-sm font-medium text-center md:text-left">
                    {displayName}
                  </span>
                )}
              </div>

              {/* Dropdown - Chỉ hiện khi CHƯA đăng nhập */}
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
              className="relative p-2 hover:bg-[#3cb371]/10 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors  focus:outline-none "
            >
              <FaRegHeart size={26} />

              {wishlistCount > 0 && (
                <span className="absolute -top-[5px] -right-[2px] bg-[#198754] text-white text-xs p2 font-bold w-5 h-5 rounded-full flex items-center justify-center  border-white dark:border-gray-900 shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={toggleCartDrawer}
              className="relative p-2  hover:bg-[#3cb371]/10 dark:hover:bg-gray-800 rounded-full cursor-pointer transition-colors focus:outline-none "
            >
              <FaCartShopping size={26} />
              {cartCount > 0 && (
                <span className="absolute -top-[5px] -right-[2px] bg-[#ffc107] text-black  font-bold text-xs p2 w-5 h-5 rounded-full flex items-center justify-center  border-white shadow-sm dark:border-gray-900">
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
