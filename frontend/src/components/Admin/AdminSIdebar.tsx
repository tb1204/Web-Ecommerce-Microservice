// // import { useDispatch } from "react-redux";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// // import { clearCart } from "../../redux/slices/CartSlice";
// // import { logout } from "../../redux/slices/authSlice";
import {
  FaBoxOpen,
  FaClipboardList,
  FaCommentDots,
  FaHome,
  FaImages,
  FaPercentage,
  FaStar,
  FaUser,
  FaChartBar,
  FaEnvelope,
  FaSignInAlt,
} from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

type NavLinkClassProps = {
  isActive: boolean;
};

const AdminSidebar = () => {
  //   const navigate = useNavigate();
  //   // const dispatch = useDispatch();

  //   // const handleLogout = () => {
  //   //   dispatch(logout());
  //   //   dispatch(clearCart());
  //   //   navigate("/");
  //   // };

  //   const goToHome = () => {
  //     navigate("/");
  //   };
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      {/* Logo */}
      <div className="mb-8">
        <Link to="/admin" className="text-3xl font-bold text-emerald-400">
          ARTISANO
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-8 text-center text-gray-300">
        Admin Dashboard
      </h2>

      {/* Navigation */}
      <nav className="flex flex-col space-y-1.5">
        {/* Users */}
        <NavLink
          to="/admin/users"
          className={({ isActive }: NavLinkClassProps) =>
            isActive
              ? "bg-emerald-700 text-white py-3 px-4 rounded-lg flex items-center space-x-3 font-medium"
              : "text-gray-300 hover:bg-emerald-800 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors"
          }
        >
          <FaUser className="text-lg" />
          <span>Người dùng</span>
        </NavLink>

        {/* Products */}
        <NavLink
          to="/admin/product"
          className={({ isActive }: NavLinkClassProps) =>
            isActive
              ? "bg-emerald-700 text-white py-3 px-4 rounded-lg flex items-center space-x-3 font-medium"
              : "text-gray-300 hover:bg-emerald-800 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors"
          }
        >
          <FaBoxOpen className="text-lg" />
          <span>Sản phẩm</span>
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/admin/orders"
          className={({ isActive }: NavLinkClassProps) =>
            isActive
              ? "bg-emerald-700 text-white py-3 px-4 rounded-lg flex items-center space-x-3 font-medium"
              : "text-gray-300 hover:bg-emerald-800 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors"
          }
        >
          <FaClipboardList className="text-lg" />
          <span>Đơn hàng</span>
        </NavLink>

        {/* Reviews */}
        <NavLink
          to="/admin/reviews"
          className={({ isActive }: NavLinkClassProps) =>
            isActive
              ? "bg-emerald-700 text-white py-3 px-4 rounded-lg flex items-center space-x-3 font-medium"
              : "text-gray-300 hover:bg-emerald-800 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors"
          }
        >
          <FaStar className="text-lg" />
          <span>Đánh giá</span>
        </NavLink>

        {/* Messages */}
        <NavLink
          to="/admin/messages"
          className={({ isActive }: NavLinkClassProps) =>
            isActive
              ? "bg-emerald-700 text-white py-3 px-4 rounded-lg flex items-center space-x-3 font-medium"
              : "text-gray-300 hover:bg-emerald-800 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors"
          }
        >
          <FaEnvelope className="text-lg" />
          <span>Tin nhắn</span>
        </NavLink>

        {/* Sidebar Images / Banners */}
        <NavLink
          to="/admin/sidebar-images"
          className={({ isActive }: NavLinkClassProps) =>
            isActive
              ? "bg-emerald-700 text-white py-3 px-4 rounded-lg flex items-center space-x-3 font-medium"
              : "text-gray-300 hover:bg-emerald-800 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors"
          }
        >
          <FaImages className="text-lg" />
          <span>Sidebar Images</span>
        </NavLink>

        {/* Vouchers */}
        <NavLink
          to="/admin/vouchers"
          className={({ isActive }: NavLinkClassProps) =>
            isActive
              ? "bg-emerald-700 text-white py-3 px-4 rounded-lg flex items-center space-x-3 font-medium"
              : "text-gray-300 hover:bg-emerald-800 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors"
          }
        >
          <FaPercentage className="text-lg" />
          <span>Vouchers</span>
        </NavLink>

        {/* Statistics */}
        <NavLink
          to="/admin/statistics"
          className={({ isActive }: NavLinkClassProps) =>
            isActive
              ? "bg-emerald-700 text-white py-3 px-4 rounded-lg flex items-center space-x-3 font-medium"
              : "text-gray-300 hover:bg-emerald-800 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors"
          }
        >
          <FaChartBar className="text-lg" />
          <span>Thống kê</span>
        </NavLink>

        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }: NavLinkClassProps) =>
            isActive
              ? "bg-emerald-700 text-white py-3 px-4 rounded-lg flex items-center space-x-3 font-medium"
              : "text-gray-300 hover:bg-emerald-800 hover:text-white py-3 px-4 rounded-lg flex items-center space-x-3 transition-colors"
          }
        >
          <FaHome className="text-lg" />
          <span>Trang chủ</span>
        </NavLink>
      </nav>

      {/* Logout button */}
      <div className="mt-10">
        <button
          // onClick={handleLogout}  // bạn có thể bỏ comment khi đã thêm lại redux
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-3 font-medium transition-colors"
        >
          <FaSignInAlt className="text-lg" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
