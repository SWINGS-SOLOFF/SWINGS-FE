import { useNotification } from "../context/NotificationContext";
import { useEffect } from "react";
import {deleteNotification, getAllNotifications, markAsRead} from "../api/NotificationApi";

const NotificationPage = () => {
    const {
        notifications,
        setNotifications,
        setInitialNotifications,
        addNotification,
    } = useNotification();

    // 전체 알림 조회
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const username = localStorage.getItem("username");
                if (!username) {
                    console.warn("username이 없어 알림 불러오기 생략");
                    return;
                }

                const data = await getAllNotifications(username);
                setInitialNotifications(data); // 전체 알림 초기화
            } catch (error) {
                console.error("알림 불러오기 실패", error);
            }
        };

        fetchNotifications();
    }, []);

    // 알림 읽음 처리
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

    // 알림 삭제
    const handleDelete = async (id) => {
        try {
            await deleteNotification(id);
            setInitialNotifications(
                notifications.filter((n) => n.notificationId !== id)
            );
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">전체 알림</h2>
            {notifications.length === 0 ? (
                <p className="text-gray-500">아직 알림이 없습니다.</p>
            ) : (
                <ul className="space-y-2">
                    {notifications.map((n, index) => (
                        <li key={index} className="bg-white p-4 shadow rounded border-l-4 border-blue-500">
                            <p className="text-sm text-gray-700">{n.message}</p>
                            <p className="text-xs text-gray-400">유형: {n.type}</p>

                            <div className="flex justify-end space-x-2 mt-2 text-xs">
                                {!n.read && (
                                    <button
                                        className="text-blue-600"
                                        onClick={() => handleMarkAsRead(n.notificationId)}
                                    >
                                        읽음 처리
                                    </button>
                                )}
                                <button
                                    className="text-red-500"
                                    onClick={() => handleDelete(n.notificationId)}
                                >
                                    삭제
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NotificationPage;
