import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/layouts/UserLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import About from "./pages/About";
import CollectionPage from "./pages/CollectionPage";
import ContactPage from "./pages/ContactPage";
import ScrollToTop from "./components/common/ScrollToTop";
import AwardsAndCertifications from "./pages/AwardsAndCertifications";
import BrandStory from "./pages/BrandStory";
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

// 1. IMPORT CONTEXT VÀ COMPONENT SO SÁNH
import { CompareProvider } from "../src/components/common/Compare/CompareContext";
import ComparisonBar from "../src/components/common/Compare/ComparisonBar";

// function App() {
//   return (

//     <BrowserRouter>
//       <ScrollToTop />
//       <Toaster position="top-right" />
//       <Routes>
//         <Route path="/" element={<UserLayout />}>
//           <Route index element={<Home />} />
//           <Route path="login" element={<Login />} />
//           <Route path="register" element={<Register />} />
//           <Route path="about" element={<About />} />
//           <Route path="contact" element={<ContactPage />} />
//           <Route path="awards" element={<AwardsAndCertifications />} />
//           <Route path="brandstory" element={<BrandStory />} />
//           <Route path="flashsale" element={<FlashSalePage />} />
//           <Route path="products" element={<ProductCard />} />
//           <Route path="productdetails" element={<ProductDetails />} />
//           <Route path="product/:id" element={<ProductDetails />} />
//           <Route path="collections/:collection" element={<CollectionPage />} />
//           <Route path="cart" element={<CartPage />} />
//           <Route path="checkout" element={<CheckoutPage />} />
//           <Route path="my-orders" element={<MyOrdersPage />} />
//           <Route path="order/:id" element={<OrderDetailsPage />}></Route>
//           {/* test  */}
//           <Route path="user" element={<AdminUserPage />} />

//     <CompareProvider>
//       <BrowserRouter>
//         <ScrollToTop />
//         <Toaster position="top-right" />
//         <ComparisonBar />

//         <Routes>
//           <Route path="/" element={<UserLayout />}>
//             <Route index element={<Home />} />
//             <Route path="login" element={<Login />} />
//             <Route path="register" element={<Register />} />
//             <Route path="about" element={<About />} />
//             <Route path="contact" element={<ContactPage />} />
//             <Route path="awards" element={<AwardsAndCertifications />} />
//             <Route path="brandstory" element={<BrandStory />} />
//             <Route path="flashsale" element={<FlashSalePage />} />
//             <Route path="products" element={<ProductCard />} />
//             <Route path="productdetails" element={<ProductDetails />} />
//             <Route path="product/:id" element={<ProductDetails />} />
//             <Route path="collections/:collection" element={<CollectionPage />} />

//             {/* test  */}
//             <Route path="user" element={<AdminUserPage />} />
//             <Route path="test" element={<TestUserListPage />} />

//             <Route path="*" element={<NotFound />} />
//           </Route>

//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute role="admin">
//                 <AdminLayout />
//               </ProtectedRoute>
//             }
//           >
//             <Route index element={<AdminHomePage />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </CompareProvider>
//   );
// }
function App() {
  return (
    <BrowserRouter>
      <CompareProvider>
        <ScrollToTop />
        <Toaster position="top-right" />
        <ComparisonBar />

        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="awards" element={<AwardsAndCertifications />} />
            <Route path="brandstory" element={<BrandStory />} />
            <Route path="flashsale" element={<FlashSalePage />} />
            <Route path="products" element={<ProductCard />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
            <Route path="order/:id" element={<OrderDetailsPage />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
          </Route>
        </Routes>
      </CompareProvider>
    </BrowserRouter>
  );
}

export default App;
