// src/components/BottomNavBar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  UserPlus,
  Users,
  Newspaper,
  User,
} from "lucide-react"; // lucide 아이콘

const navItems = [
  { to: "/swings/home", label: "홈", icon: <Home size={20} /> },
  { to: "/swings/matchgroup", label: "조인", icon: <UserPlus size={20} /> },
  { to: "/swings/match", label: "메이트", icon: <Users size={20} /> },
  { to: "/swings/feed", label: "피드", icon: <Newspaper size={20} /> },
  { to: "/swings/mypage", label: "마이페이지", icon: <User size={20} /> },
];

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
      <div className="flex justify-around items-center h-16 text-xs text-gray-500">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center space-y-1 ${
                isActive ? "text-[#2E384D] font-semibold" : "text-gray-400"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
