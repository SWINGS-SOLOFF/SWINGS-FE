// src/components/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { FaCoins } from "react-icons/fa";

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

      {/* 오른쪽 아이콘들 */}
      <div className="flex items-center gap-4">
        {/* ✅ 포인트 아이콘 */}
        <button
          onClick={() => navigate("/swings/mypage/points")}
          className="text-yellow-400 hover:opacity-80 transition-colors duration-200"
          aria-label="포인트"
        >
          <FaCoins className="w-6 h-6" />
        </button>

        {/* 메시지 아이콘 */}
        <button
          onClick={() => navigate("/swings/messages")}
          className="text-[#2E384D] hover:opacity-80"
          aria-label="메시지"
        >
          <MessageCircle size={24} />
        </button>
      </div>
    </header>
  );
}
