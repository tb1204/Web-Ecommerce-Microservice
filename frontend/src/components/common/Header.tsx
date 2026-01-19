import Topbar from "../layouts/Topbar";
import Navbar from "../layouts/Navbar";
// import MegaMenu from "../layouts/MegaMenu";
import Menu from "../common/Menu"
function Header() {
  return (
    <header className=" dark:bg-black ">
      <Topbar />
      <Navbar />
      <Menu></Menu>
      {/* <MegaMenu /> */}
    </header>
  );
}

export default Header;
