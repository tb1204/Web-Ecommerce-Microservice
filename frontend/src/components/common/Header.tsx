import Topbar from "../layouts/Topbar";
import Navbar from "../layouts/Navbar";
// import MegaMenu from "../layouts/MegaMenu";
function Header() {
  return (
    <header className=" dark:bg-black ">
      <Topbar />
      <Navbar />
      {/* <MegaMenu /> */}
    </header>
  );
}

export default Header;
