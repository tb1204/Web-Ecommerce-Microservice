import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/layouts/UserLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
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
import WishlistPage from "./components/common/WishlistPage";

function App() {
  return (
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
              <Route path="awards" element={<AwardsAndCertificationsPage />} />
              <Route path="brandstory" element={<BrandStoryPage />} />
              <Route path="flashsale" element={<FlashSalePage />} />
              <Route path="products" element={<ProductCard />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="collections/:collection" element={<CollectionPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="my-orders" element={<MyOrdersPage />} />
              <Route path="order/:id" element={<OrderDetailsPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
<<<<<<< HEAD

              {/* test */}
              <Route path="admin/user" element={<AdminUserPage />} />
              <Route path="admin" element={<AdminHomePage />} />

=======
              
              {/* Trang 404 cho User */}
>>>>>>> 5631dcd9d0638e15d4d8e9abd56d7f3cf18cd2ba
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* GROUP 2: CÁC TRANG DÀNH CHO ADMIN (QUẢN TRỊ) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminHomePage />} />
              <Route path="user" element={<AdminUserPage />} />
            </Route>

          </Routes>
        </CompareProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;
