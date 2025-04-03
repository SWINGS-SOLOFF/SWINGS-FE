// src/components/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex justify-between items-center fixed top-0 z-50">
      {/* 로고 */}
      <Link
        to="/swings/home"
        className="text-xl font-bold text-[#2E384D] hover:opacity-80"
      >
        SWINGS
      </Link>

      {/* 메시지 아이콘 */}
      <button
        onClick={() => navigate("/swings/chat")} // 나중에 메시지 페이지 생기면
        className="text-[#2E384D] hover:opacity-80"
        aria-label="메시지"
      >
        <MessageCircle size={24} />
      </button>
    </header>
  );
}
