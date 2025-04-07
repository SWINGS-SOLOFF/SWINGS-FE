// src/components/BottomNavBar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  Handshake,
  HeartHandshake,
  LayoutGrid,
  MessageCircle,
  CircleUser,
} from "lucide-react";

const navItems = [
  { to: "/swings/matchgroup", label: "조인", icon: <Handshake size={20} /> },
  { to: "/swings/match", label: "소개팅", icon: <HeartHandshake size={20} /> },
  { to: "/swings/feed", label: "피드", icon: <LayoutGrid size={20} /> },
  { to: "/swings/chat", label: "채팅", icon: <MessageCircle size={20} /> },
  { to: "/swings/social", label: "마이페이지", icon: <CircleUser size={20} /> },
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
