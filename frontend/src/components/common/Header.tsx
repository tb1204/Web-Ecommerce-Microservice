import { useTheme } from "../../context/ThemeContext";
import Topbar from "../layouts/Topbar";

import Navbar from "../layouts/Navbar";
function Header() {
  return (
    <header className=" dark:bg-black ">
      <Topbar />
      <Navbar />
    </header>
  );
}

export default Header;
