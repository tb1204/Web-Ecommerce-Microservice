import Topbar from "../layouts/Topbar";
import Navbar from "../layouts/Navbar";
import Menu from "../common/Menu";
// import MegaMenu from "../layouts/MegaMenu";
function Header() {
  return (
    <header className=" dark:bg-black ">
      <Topbar />
      <Navbar />
      <Menu />
      {/* <MegaMenu /> */}
    </header>
  );
}

export default Header;
