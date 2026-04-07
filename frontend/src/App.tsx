import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/layouts/UserLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import AdminProductPage from "../src/components/Admin/AdminProductPage";
import AdminOrderPage from "../src/components/Admin/AdminOrderPage";
import AdminStatisticalPage from "../src/components/Admin/AdminStatisticalPage";
import AdminVoucherPage from "../src/components/Admin/AdminVoucherPage";
import AboutPage from "./pages/AboutPage";
import CollectionPage from "./pages/CollectionPage";
import ContactPage from "./pages/ContactPage";
import ScrollToTop from "./components/common/ScrollToTop";
import AwardsAndCertificationsPage from "./pages/AwardsAndCertificationsPage";
import BrandStoryPage from "./pages/BrandStoryPage";
import ProductCard from "./components/Products/ProductGrid";
import ProductDetails from "./components/Products/ProductDetails";
import NotFound from "./pages/NotFound";
import FlashSalePage from "./pages/FlashSalePage";
import AdminUserPage from "./components/Admin/AdminUserPage";
import { Toaster } from "sonner";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckOutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";

import { CompareProvider } from "../src/components/common/Compare/CompareContext";
import ComparisonBar from "../src/components/common/Compare/ComparisonBar";

import { WishlistProvider } from "./components/common/WishlistContent";
import WishlistPage from "./pages/WishlistPage";
import CustomProfile from "./components/layouts/CustomProfile";
import AdminSliderUpload from "./components/Admin/AdminSliderUpload";
import AdminChatPage from "./components/Admin/AdminChatPage";
import AdminCommentPage from "./components/Admin/AdminCommentPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthRedirect from "./pages/AuthRedirect";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

import store from "./store";
import { Provider } from "react-redux";

//import AdminSliderUpload from "./components/Admin/AdminSliderUpload";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <WishlistProvider>
          <CompareProvider>
            <ScrollToTop />
            <Toaster position="top-right" />
            <ComparisonBar />

            <Routes>
              <Route path="/" element={<UserLayout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route
                  path="awards"
                  element={<AwardsAndCertificationsPage />}
                />
                <Route path="brandstory" element={<BrandStoryPage />} />
                <Route path="flashsale" element={<FlashSalePage />} />
                <Route path="products" element={<ProductCard />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="payment-success" element={<PaymentSuccess />} />
                <Route path="payment-failed" element={<PaymentFailed />} />
                <Route
                  path="collections/:collection"
                  element={<CollectionPage />}
                />

                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="my-orders" element={<MyOrdersPage />} />
                <Route path="order/:id" element={<OrderDetailsPage />} />
                <Route path="wishlist" element={<WishlistPage />} />
                <Route path="profile" element={<CustomProfile />} />
                <Route path="/auth-redirect" element={<AuthRedirect />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* GROUP 2: CÁC TRANG DÀNH CHO ADMIN (QUẢN TRỊ) */}

              <Route
                path="/admin"
                element={
                  // <ProtectedRoute role="admin">
                    <AdminLayout />
                  // </ProtectedRoute>
                }
              >
                <Route index element={<AdminHomePage />} />
                <Route path="users" element={<AdminUserPage />} />
                <Route path="chat" element={<AdminChatPage />} />
                <Route path="slider" element={<AdminSliderUpload />} />
                <Route path="product" element={<AdminProductPage />} />
                <Route path="orders" element={<AdminOrderPage />} />
                <Route path="reviews" element={<AdminCommentPage />} />
                <Route path="statistics" element={<AdminStatisticalPage />} />
                <Route path="vouchers" element={<AdminVoucherPage />} />
              </Route>
            </Routes>
          </CompareProvider>
        </WishlistProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
