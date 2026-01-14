// import React, { FC, useEffect, useState } from "react";
// import logo1 from "../../assets/logo2.jpg";

// import { FaHeadset, FaRegHeart } from "react-icons/fa";
// import { FaCartShopping } from "react-icons/fa6";
// import { FiUser, FiUserPlus, FiLogIn } from "react-icons/fi";
// import { IoIosSearch } from "react-icons/io";
// import { MdLightMode, MdDarkMode } from "react-icons/md";

// const Navbar: FC = () => {
//   const [darkMode, setDarkMode] = useState<boolean>(false);

//   const wishlistCount = 3;
//   const cartCount = 5;
//   const userName = "Dương";

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [darkMode]);

//   return (
//     <header className="w-full bg-white dark:bg-gray-900 text-black dark:text-white shadow-md px-6 py-3">
//       <div className="flex items-center justify-evenly">
//         {/* Logo */}
//         <img src={logo1} alt="logo" className="w-[15%] cursor-pointer" />

//         {/* Search */}
//         <div className=" hover:bg-[#3cb371] p-2 flex items-center w-1/3 border dark:border-gray-700 rounded-full px-3 py-2 bg-white dark:bg-gray-800">
//           <IoIosSearch className="text-xl text-gray-500" />
//           <input
//             type="text"
//             placeholder="Tìm kiếm sản phẩm..."
//             className="ml-2 w-full outline-none bg-transparent text-sm"
//           />
//         </div>

//         {/* Right */}
//         <div className="p-2 flex items-center gap-6">
//           {/* Support + Theme */}
//           <div className="flex items-center gap-2 ">
//             <FaHeadset className="text-2xl cursor-pointer hover:bg-[#3cb371]" />

//             {/* Toggle theme */}
//             <button onClick={() => setDarkMode(!darkMode)}>
//               {darkMode ? (
//                 <MdDarkMode className="text-2xl" />
//               ) : (
//                 <MdLightMode className="text-2xl" />
//               )}
//             </button>
//           </div>

//           {/* User dropdown */}
//           <div className=" p-2 relative group cursor-pointer hover:bg-[#3cb371]">
//             <div className="flex items-center gap-1">
//               <FiUser className="text-2xl" />
//               <span className="text-sm">{userName}</span>
//             </div>

//             <div className="hover:bg-[#3cb371] p-2 absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
//               <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
//                 <FiLogIn />
//                 <span>Đăng nhập</span>
//               </div>
//               <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
//                 <FiUserPlus />
//                 <span>Đăng ký</span>
//               </div>
//             </div>
//           </div>

//           {/* Wishlist */}
//           <div
//             className="relative cursor-pointer hover:bg-[#3cb371] p-2
// "
//           >
//             <FaRegHeart className="text-2xl" />
//             {wishlistCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-[#198754]  text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                 {wishlistCount}
//               </span>
//             )}
//           </div>

//           {/* Cart */}
//           <div className="relative cursor-pointer p-2 hover:bg-[#3cb371]">
//             <FaCartShopping className="text-2xl" />
//             {cartCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-[#ffc107] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                 {cartCount}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };
// export default Navbar;

// import React, { FC, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo1 from "../../assets/logo2.jpg";

// import { FaHeadset, FaRegHeart } from "react-icons/fa";
// import { FaCartShopping } from "react-icons/fa6";
// import { FiUser, FiUserPlus, FiLogIn } from "react-icons/fi";
// import { IoIosSearch } from "react-icons/io";
// import { MdLightMode, MdDarkMode } from "react-icons/md";

// const Navbar: FC = () => {
//   const [darkMode, setDarkMode] = useState<boolean>(false); // false = light mode mặc định
//   const navigate = useNavigate();

//   const wishlistCount = 3;
//   const cartCount = 5;
//   const userName = "Dương"; // Để "" nếu chưa đăng nhập

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//   }, [darkMode]);

//   return (
//     <header className="w-full bg-white dark:bg-gray-900 text-black dark:text-white shadow-md">
//       <div className="px-4 py-3 md:px-6 max-w-7xl mx-auto">
//         <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
//           {/* Logo - trái */}
//           <div className="flex-shrink-0 w-full lg:w-auto flex justify-start lg:justify-start">
//             <img
//               src={logo1}
//               alt="logo"
//               className="h-9 sm:h-10 md:h-12 w-auto cursor-pointer rounded-md object-contain"
//               onClick={() => navigate("/")}
//             />
//           </div>

//           {/* Search - chính giữa trên desktop, xuống dưới trên mobile */}
//           <div className="w-full lg:flex-1 lg:max-w-2xl order-last lg:order-none flex justify-center">
//             <div className="flex items-center w-full max-w-md lg:max-w-3xl border dark:border-gray-700 rounded-full px-4 py-2.5 bg-white dark:bg-gray-800 transition">
//               <IoIosSearch className="text-xl text-gray-500 flex-shrink-0" />
//               <input
//                 type="text"
//                 placeholder="Tìm kiếm sản phẩm..."
//                 className="ml-3 w-full outline-none bg-transparent text-sm placeholder-gray-500 dark:placeholder-gray-400"
//               />
//             </div>
//           </div>

//           {/* Icons group - phải */}
//           <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full lg:w-auto justify-end order-2 lg:order-none">
//             {/* Theme toggle */}
//             <button
//               onClick={() => setDarkMode(!darkMode)}
//               className="focus:outline-none hover:text-[#3cb371] transition-colors p-1.5 rounded hover:bg-[#3cb371]/10"
//             >
//               {darkMode ? (
//                 <MdDarkMode className="text-xl md:text-2xl" />
//               ) : (
//                 <MdLightMode className="text-xl md:text-2xl" />
//               )}
//             </button>

//             {/* Headset */}
//             <div className="flex items-center gap-2 cursor-pointer group">
//               <div className="p-1.5 rounded-full transition-colors group-hover:bg-[#3cb371]/10">
//                 <FaHeadset
//                   size={20} // nhỏ hơn tí trên mobile
//                   className="text-gray-700 dark:text-gray-300 group-hover:text-[#3cb371] transition-colors"
//                 />
//               </div>
//               <div className="flex flex-col hidden sm:flex">
//                 {/* Ẩn text trên mobile rất nhỏ, hiện từ sm */}
//                 <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
//                   Hỗ trợ 24/7
//                 </p>
//                 <p className="text-base text-[#05472a] font-bold dark:text-gray-400">
//                   1900 9011
//                 </p>
//               </div>
//             </div>

//             {/* User */}
//             <div className="relative group cursor-pointer hover:bg-[#3cb371]/10 p-1.5 rounded transition-colors">
//               <div className="flex items-center gap-1.5">
//                 <FiUser className="text-xl sm:text-2xl" />
//                 {userName && (
//                   <span className="text-sm hidden md:inline font-medium">
//                     {userName}
//                   </span>
//                 )}
//               </div>

//               <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                 <div
//                   onClick={() => navigate("/login")}
//                   className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
//                 >
//                   <FiLogIn className="text-lg" />
//                   <span>Đăng nhập</span>
//                 </div>
//                 <div
//                   onClick={() => navigate("/register")}
//                   className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
//                 >
//                   <FiUserPlus className="text-lg" />
//                   <span>Đăng ký</span>
//                 </div>
//               </div>
//             </div>

//             {/* Wishlist */}
//             <div className="relative cursor-pointer hover:bg-[#3cb371]/10 p-1.5 rounded transition-colors">
//               <FaRegHeart className="text-xl sm:text-2xl" />
//               {wishlistCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-[#198754] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
//                   {wishlistCount}
//                 </span>
//               )}
//             </div>

//             {/* Cart */}
//             <div className="relative cursor-pointer hover:bg-[#3cb371]/10 p-1.5 rounded transition-colors">
//               <FaCartShopping className="text-xl sm:text-2xl" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-[#ffc107] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
//                   {cartCount}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

///localstore
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import logo1 from "../../assets/logo2.jpg";

import { FaHeadset, FaRegHeart } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FiUser, FiUserPlus, FiLogIn } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { MdLightMode, MdDarkMode } from "react-icons/md";

// Import hook từ context (điều chỉnh path nếu thư mục khác)
import { useTheme } from "../../context/ThemeContext"; // ← sửa path cho đúng

const Navbar: FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const navigate = useNavigate();

  const wishlistCount = 3;
  const cartCount = 5;
  const userName = "Dương";

  return (
    <header className="w-full bg-white dark:bg-gray-900 text-black dark:text-white shadow-md">
      <div className="px-4 py-3 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
          {/* Logo */}
          <div className="flex-shrink-0 w-full lg:w-auto flex justify-start lg:justify-start">
            <img
              src={logo1}
              alt="logo"
              className="h-9 sm:h-10 md:h-12 w-auto cursor-pointer rounded-md object-contain"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Search */}
          <div className="w-full lg:flex-1 lg:max-w-2xl order-last lg:order-none flex justify-center">
            <div className="flex items-center w-full max-w-md lg:max-w-3xl border dark:border-gray-700 rounded-full px-4 py-2.5 bg-white dark:bg-gray-800 transition">
              <IoIosSearch className="text-xl text-gray-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="ml-3 w-full outline-none bg-transparent text-sm placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Icons group */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full lg:w-auto justify-end order-2 lg:order-none">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="focus:outline-none hover:text-[#3cb371] transition-colors p-1.5 rounded hover:bg-[#3cb371]/10"
            >
              {isDark ? (
                <MdDarkMode className="text-xl md:text-2xl" />
              ) : (
                <MdLightMode className="text-xl md:text-2xl" />
              )}
            </button>

            {/* Headset */}
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="p-1.5 rounded-full transition-colors group-hover:bg-[#3cb371]/10">
                <FaHeadset
                  size={20}
                  className="text-gray-700 dark:text-gray-300 group-hover:text-[#3cb371] transition-colors"
                />
              </div>
              <div className="flex flex-col hidden sm:flex">
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                  Hỗ trợ 24/7
                </p>
                <p className="text-base text-[#05472a] font-bold dark:text-gray-400">
                  1900 9011
                </p>
              </div>
            </div>

            {/* User, Wishlist, Cart giữ nguyên */}
            <div className="relative group cursor-pointer hover:bg-[#3cb371]/10 p-1.5 rounded transition-colors">
              <div className="flex items-center gap-1.5">
                <FiUser className="text-xl sm:text-2xl" />
                {userName && (
                  <span className="text-sm hidden md:inline font-medium">
                    {userName}
                  </span>
                )}
              </div>
              {/* Dropdown user giữ nguyên */}
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                >
                  <FiLogIn className="text-lg" />
                  <span>Đăng nhập</span>
                </div>
                <div
                  onClick={() => navigate("/register")}
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                >
                  <FiUserPlus className="text-lg" />
                  <span>Đăng ký</span>
                </div>
              </div>
            </div>

            <div className="relative cursor-pointer hover:bg-[#3cb371]/10 p-1.5 rounded transition-colors">
              <FaRegHeart className="text-xl sm:text-2xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#198754] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </div>

            <div className="relative cursor-pointer hover:bg-[#3cb371]/10 p-1.5 rounded transition-colors">
              <FaCartShopping className="text-xl sm:text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ffc107] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
