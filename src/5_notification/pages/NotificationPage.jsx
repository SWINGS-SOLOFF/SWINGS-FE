import { useNotification } from "../context/NotificationContext";
import { useEffect } from "react";

const NotificationPage = () => {
  const { notifications, addNotification } = useNotification();

  // 컴포넌트 마운트 시 테스트 알림 추가
  useEffect(() => {
    const testNotification = {
      type: "JOIN_REQUEST",
      message: "홍길동 님이 [부산 스크린 골프]에 참가 신청했습니다.",
    };

    addNotification(testNotification);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🔔 실시간 알림</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">아직 알림이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n, index) => (
            <li
              key={index}
              className="bg-white p-4 shadow rounded border-l-4 border-blue-500"
            >
              <p className="text-sm text-gray-700">{n.message}</p>
              <p className="text-xs text-gray-400">유형: {n.type}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
