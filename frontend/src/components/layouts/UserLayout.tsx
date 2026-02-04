import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

function UserLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;
