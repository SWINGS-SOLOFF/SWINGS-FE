import { Link, useNavigate } from "react-router-dom";
import { BellIcon } from "lucide-react";
import { useState } from "react";
import { useNotification } from "../5_notification/context/NotificationContext";
import NotificationDropdown from "../5_notification/components/NotificationDropdown";


export default function NavBar() {
  const navigate = useNavigate();
  const { unreadCount  } = useNotification();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm px-4 py-4 flex justify-between items-center fixed top-0 z-50">
      <Link
        to="/swings/feed"
        className="text-xl font-bold text-[#2E384D] hover:opacity-80"
      >
        SWINGS
      </Link>

      <div className="flex items-center space-x-4 relative">
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
            {unreadCount > 0 && ( // ✅ 안 읽은 알림이 있을 때만 뱃지 표시
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            )}
          </button>

          {showDropdown && <NotificationDropdown />}
        </div>
      </div>
    </header>
  );
}
