import { Link, useNavigate, useLocation } from "react-router-dom";
import { BellIcon, Settings as SettingsIcon, Heart } from "lucide-react";
import { useState } from "react";
import { useNotification } from "../5_notification/context/NotificationContext";
import NotificationDropdown from "../5_notification/components/NotificationDropdown";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { unreadCount } = useNotification();
  const [showDropdown, setShowDropdown] = useState(false);

  const isMyPage = pathname.startsWith("/swings/social");

  return (
    <header className="w-full bg-white px-4 py-4 flex justify-between items-center fixed top-0 z-50">
      {/* ✅ 로고 */}
      <div className="flex items-center">
        <Link
          to="/swings/feed"
          className="text-xl font-bold text-[#2E384D] hover:opacity-80"
        >
          SWINGS
        </Link>
      </div>

      {/* ✅ 오른쪽 아이콘 영역 */}
      <div className="flex items-center space-x-4 relative">
        {isMyPage ? (
          // 마이페이지일 때: 설정 버튼만 표시
          <button
            onClick={() => navigate("/swings/mypage")}
            className="p-2 rounded-full  transition"
            aria-label="설정"
          >
            <SettingsIcon size={20} className="text-gray-700" />
          </button>
        ) : (
          <>
            {/* 하트 포인트 버튼 */}
            <button
              onClick={() => navigate("/swings/points")}
              className="p-1 rounded-full outline-none focus:outline-none bg-pink-100 hover:bg-pink-200 transition relative top-[2px]"
              aria-label="포인트"
            >
              <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            </button>

            {/* 알림 버튼 + 드롭다운 */}
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button
                className="relative text-2xl hover:opacity-80 outline-none focus:outline-none"
                aria-label="알림"
                onClick={() => navigate("/swings/notification")}
              >
                🔔
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
