import { Link, useLocation } from "react-router-dom";
import { Handshake, CircleUser } from "lucide-react";
import { motion } from "framer-motion";
import { FaHeartCircleCheck } from "react-icons/fa6";
import { AiOutlineInstagram } from "react-icons/ai";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const navItems = [
  { to: "/swings/matchgroup", label: "조인", icon: Handshake },
  { to: "/swings/match", label: "소개팅", icon: FaHeartCircleCheck },
  { to: "/swings/feed", label: "피드", icon: AiOutlineInstagram },
  { to: "/swings/chat", label: "채팅", icon: HiOutlineChatBubbleLeftRight },
  { to: "/swings/social", label: "마이페이지", icon: CircleUser },
];

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-md z-50">
      <div className="flex justify-between items-center h-16 text-xs text-gray-500">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative w-[20%] flex flex-col items-center justify-center gap-[4px] transition-colors duration-200 ${
                isActive ? "text-[#2E384D] font-semibold" : "text-gray-400"
              }`}
            >
              <motion.div
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Icon className="w-7 h-7 text-current" />
              </motion.div>

              <span className="text-[12px] leading-tight text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
