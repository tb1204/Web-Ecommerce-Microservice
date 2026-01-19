import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import Banner from "../components/common/Banner";

function Home() {
  return (
    <>
      <Banner></Banner>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Home Page</h1>

        <p className="text-gray-700 dark:text-gray-300">
          Đây là trang Home. Dark mode sẽ áp dụng cho toàn bộ trang web.
        </p>

        <div className="p-4 rounded bg-gray-100 dark:bg-gray-800">
          <p>Card content</p>
        </div>
        <Link
          to="/login"
          className="inline-block px-4 py-2 rounded bg-rabbit-red text-white 
             hover:opacity-90 transition dark:bg-gray-300"
        >
          Đi đến Login
        </Link>
        <UserButton showName afterSignOutUrl="/login" />
      </div>
    </>
  );
}

export default Home;
