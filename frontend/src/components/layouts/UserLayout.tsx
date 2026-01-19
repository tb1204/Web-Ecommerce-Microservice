import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Menu from "../common/Menu";

function UserLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <Menu />
      <main className="p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default UserLayout;
