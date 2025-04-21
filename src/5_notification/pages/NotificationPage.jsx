import { useNotification } from "../context/NotificationContext";
import {deleteNotification, markAsRead} from "../api/NotificationApi.js";

const NotificationPage = () => {
    const {
        notifications,
        setNotifications,
        unreadCount,
    } = useNotification();

    // 읽음 처리
    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notificationId === id ? { ...n, read: true } : n
                )
            );
        } catch (error) {
            console.error("읽음 처리 실패:", error);
        }
    };

    // 삭제 처리
    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            setNotifications((prev) =>
                prev.filter((n) => n.notificationId !== id)
            );
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    return (
        <main className="pt-16 pb-24 px-4 max-w-xl mx-auto">
            <h1 className="text-xl font-bold text-[#2E384D] mb-4">
                📢 전체 알림 <span className="text-base text-blue-600">({unreadCount}개 안 읽음)</span>
            </h1>

            {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">아직 알림이 없습니다.</p>
            ) : (
                <ul className="space-y-3">
                    {notifications.map((n) => (
                        <li
                            key={n.notificationId}
                            className={`p-4 rounded-xl border shadow-sm ${
                                !n.read ? "bg-blue-50" : "bg-white"
                            }`}
                        >
                            <div className="text-sm text-gray-800 mb-1">{n.message}</div>
                            <div className="text-xs text-gray-500">유형: {n.type}</div>

                            <div className="flex justify-end gap-4 mt-2 text-xs">
                                {!n.read && (
                                    <button
                                        className="text-blue-600 font-medium"
                                        onClick={() => handleMarkAsRead(n.notificationId)}
                                    >
                                        읽음 처리
                                    </button>
                                )}
                                <button
                                    className="text-red-500 font-medium"
                                    onClick={() => handleDelete(n.notificationId)}
                                >
                                    삭제
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default NotificationPage;
