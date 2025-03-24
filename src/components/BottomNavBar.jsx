import React from "react";
import { FaHome, FaUser, FaSearch, FaBell, FaCog } from "react-icons/fa";

const BottomNavBar = () => {
  const navItems = [
    { icon: <FaHome size={20} />, label: "홈", href: "/" },
    { icon: <FaSearch size={20} />, label: "검색", href: "/search" },
    { icon: <FaBell size={20} />, label: "알림", href: "/notifications" },
    { icon: <FaUser size={20} />, label: "마이페이지", href: "/mypage" },
    { icon: <FaCog size={20} />, label: "설정", href: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
      <ul className="flex justify-around items-center">
        {navItems.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition-colors duration-300"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNavBar;
