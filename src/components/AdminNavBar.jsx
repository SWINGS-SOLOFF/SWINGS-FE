// src/components/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, LogOut } from "lucide-react";
import { removeToken } from "../1_user/utils/userUtils";

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/swings");
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex justify-between items-center fixed top-0 z-50">
      {/* 로고 */}
      <Link
        to="/swings/admin"
        className="text-xl font-bold text-[#2E384D] hover:opacity-80"
      >
        SWINGS 관리자 페이지
      </Link>

      {/* 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="text-sm text-gray-600 hover:text-red-500 flex items-center gap-1"
      >
        <LogOut size={16} />
        로그아웃
      </button>
    </header>
  );
}
