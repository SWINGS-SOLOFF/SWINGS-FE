import { useNavigate } from "react-router-dom";
import {useNotification} from "../context/NotificationContext.jsx";

export default function NotificationDropdown() {
    const { notifications } = useNotification();
    const navigate = useNavigate();

    const latest = notifications.slice(0, 5); // 최근 5개만

    return (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-lg rounded border border-gray-200 z-50">
            <div className="p-3 border-b font-bold text-gray-800">🔔 최근 알림</div>

            {latest.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">알림이 없습니다.</div>
            ) : (
                <ul className="max-h-64 overflow-auto text-sm text-gray-700">
                    {latest.map((n, i) => (
                        <li key={i} className="px-4 py-2 border-b hover:bg-gray-50">
                            {n.message}
                        </li>
                    ))}
                </ul>
            )}

            <button
                onClick={() => navigate("/swings/notification")}
                className="w-full px-4 py-2 text-blue-600 text-sm font-semibold hover:bg-gray-100"
            >
                전체 알림 보기 →
            </button>
        </div>
    );
}
