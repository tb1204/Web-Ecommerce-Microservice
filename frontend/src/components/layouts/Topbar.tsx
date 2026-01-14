import top from "../../assets/top.webp";
import topmobile from "../../assets/top-banner-mobile.webp";

const Topbar = () => {
  return (
    <div className="w-full">
      <img
        src={topmobile}
        alt="Top banner mobile"
        className="block md:hidden w-full h-auto object-cover"
      />
      {/*Desktop */}
      <img
        src={top}
        alt="Top banner desktop"
        className="hidden md:block w-full h-auto object-cover"
      />
    </div>
  );
};

export default Topbar;
