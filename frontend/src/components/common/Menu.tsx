// import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import MegaMenu from "../layouts/MegaMenu";

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

function Menu() {
  const menuItems: NavItem[] = [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/collections/all", hasDropdown: true },
    { label: "Giới thiệu", href: "/about" },
    { label: "Liên hệ", href: "contact" },
    { label: "Câu hỏi liên quan", href: "/" },
  ];

  return (
    <nav className="bg-[#05472a] text-white w-full font-sans shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-center px-4">
        {/* Danh mục sản phẩm */}
        <MegaMenu></MegaMenu>
        {/* <div className="flex items-center space-x-2 bg-[#09412e] px-6 py-4 cursor-pointer hover:bg-green-800 transition-all group relative">
                    <LayoutGrid size={12} className="text-white" />
                    <span className="font-bold tracking-wide text-lg">Danh mục sản phẩm</span>
                    <ChevronDown size={20} className="opacity-100 group-hover:rotate-180 transition-transform mt-1"/>

                    {/* Dropdown */}
        {/* <div className="absolute top-full -left-2 w-72 bg-white text-gray-800 shadow-xl opacity-0 invisible 
                    group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border-t-2">
                        <ul className="py-2">
                            <li className="px-4 py-2 hover:bg-gray-100 hover:text-green-800 cursor-pointer border-b border-gray-50">Nệm</li>
                        </ul>
                    </div>
                </div> */}

        {/* Danh sách menu chính*/}
        <div className="flex flex-wrap items-center justify-center ml-8">
          <ul className="flex items-center space-x-2">
            {menuItems.map((item, index) => (
              <li key={index} className="group relative py-4 px-2 sm:px-4">
                <Link
                  to={item.href}
                  className="flex items-center space-x-1 hover:text-green-300 transition-colors"
                >
                  <span className="font-bold text-lg">{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown
                      size={18}
                      className="opacity-80 group-hover:rotate-180 transition-transform mt-1"
                    />
                  )}
                </Link>

                {/* Thanh line dưới chân menu khi hover */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-300 transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
