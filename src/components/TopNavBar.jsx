import { Link, useNavigate, useLocation } from "react-router-dom";
import { BellIcon } from "lucide-react";
import { useState } from "react";
import { useNotification } from "../5_notification/context/NotificationContext";
import NotificationDropdown from "../5_notification/components/NotificationDropdown";
import coin from "../assets/coin.png"; // ✅ 하트코인 이미지 import

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { unreadCount } = useNotification();
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ 경로에 따라 라벨 설정
  let pageLabel = "";
  if (pathname.startsWith("/swings/feed")) {
    pageLabel = "\u00A0FEED";
  } else if (pathname.startsWith("/swings/matchgroup")) {
    pageLabel = "\u00A0JOIN";
  } else if (pathname.startsWith("/swings/chat")) {
    pageLabel = "\u00A0CHAT";
  } else if (pathname.startsWith("/swings/social")) {
    pageLabel = "\u00A0MYPAGE";
  }

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm px-4 py-4 flex justify-between items-center fixed top-0 z-50">
      {/* 로고 + 동적 페이지 라벨 */}
      <Link
        to="/swings/feed"
        className="text-xl font-bold text-[#2E384D] hover:opacity-80 flex items-center"
      >
        SWINGS
        {pageLabel && (
          <span className="ml-1 text-sm font-bold text-gray-500">
            {pageLabel}
          </span>
        )}
      </Link>

      {/* ✅ 오른쪽 아이콘 영역 */}
      <div className="flex items-center space-x-4 relative">
        {/* 하트코인 버튼 */}
        <button
          onClick={() => navigate("/swings/mypage/points")}
          className="w-6 h-6 hover:scale-110 transition"
          aria-label="포인트 페이지 이동"
        >
          <img src={coin} alt="코인" className="w-full h-full object-contain" />
        </button>

        {/* 알림 아이콘 + 드롭다운 */}
        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <button
            className="relative text-[#2E384D] hover:opacity-80"
            aria-label="알림"
          >
            <BellIcon size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            )}
          </button>

          {showDropdown && <NotificationDropdown />}
        </div>
      </div>
    </header>
  );
}
