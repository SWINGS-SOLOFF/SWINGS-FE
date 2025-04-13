// src/components/NavBar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BellIcon, Settings as SettingsIcon } from "lucide-react";
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
    pageLabel = "FEED";
  } else if (pathname.startsWith("/swings/matchgroup")) {
    pageLabel = "JOIN";
  } else if (pathname.startsWith("/swings/chat")) {
    pageLabel = "CHAT";
  } else if (pathname.startsWith("/swings/social")) {
    pageLabel = "MYPAGE";
  } else if (pathname.startsWith("/swings/mypage")) {
    pageLabel = "SETTING";
  } else if (pathname.startsWith("/swings/points")) {
    pageLabel = "POINTS";
  } else if (pathname.startsWith("/swings/shop")) {
    pageLabel = "SHOP";
  }

  const isMyPage = pathname.startsWith("/swings/social");

  return (
    <header className="w-full bg-white px-4 py-4 flex justify-between items-center fixed top-0 z-50">
      {/* ✅ 로고 + 라벨 분리 */}
      <div className="flex items-center">
        <Link
          to="/swings/feed"
          className="text-xl font-bold text-[#2E384D] hover:opacity-80"
        >
          SWINGS
        </Link>
        {pageLabel && (
          <span className="ml-1 text-sm font-bold text-gray-500">
            {pageLabel}
          </span>
        )}
      </div>

      {/* ✅ 오른쪽 아이콘 영역 */}
      <div className="flex items-center space-x-4 relative">
        {isMyPage ? (
          // 마이페이지일 때: 설정 버튼만 표시
          <button
            onClick={() => navigate("/swings/mypage")}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="설정"
          >
            <SettingsIcon size={20} className="text-gray-700" />
          </button>
        ) : (
          // 마이페이지 아닐 때: 코인 + 알림 표시
          <>
            {/* 코인 버튼 */}
            <button
              onClick={() => navigate("/swings/points")}
              className="w-6 h-6 hover:scale-110 transition"
              aria-label="포인트 페이지 이동"
            >
              <img
                src={coin}
                alt="코인"
                className="w-full h-full object-contain"
              />
            </button>

            {/* 알림 버튼 + 드롭다운 */}
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button
                className="relative text-[#2E384D] hover:opacity-80"
                aria-label="알림"
              >
                {/* ✅ 아이콘 위치 아래로 조정 */}
                <BellIcon size={24} className="relative top-[4px]" />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                )}
              </button>

              {showDropdown && <NotificationDropdown />}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
