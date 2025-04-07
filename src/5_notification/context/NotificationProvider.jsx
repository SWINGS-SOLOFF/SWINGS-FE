import React, { useEffect, useState } from "react";
import { NotificationContext } from "./NotificationContext";
import { connectSocket, disconnectSocket } from "../utils/socket";
import NotificationToast from "../components/NotificationToast";

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);

    const addNotification = (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setToastMessage(newNotification.message);
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token"); // ✅ sessionStorage에서 가져옴

        if (!token) {
            console.warn("⚠️ 세션스토리지에 토큰이 없어 알림 연결 생략됩니다.");
            return;
        }

        // JWT에서 username 파싱
        try {
            const base64Payload = token.split(".")[1];
            const decodedPayload = atob(base64Payload);
            const payload = JSON.parse(decodedPayload);
            const username = payload.username || payload.sub;

            if (username) {
                localStorage.setItem("username", username); // 🔐 WebSocket 구독을 위해 저장
            }
        } catch (error) {
            console.error("❌ JWT 파싱 오류:", error);
            return;
        }

        const handleNewNotification = (notification) => {
            console.log("📨 새 알림 도착:", notification);
            addNotification(notification);
        };

        connectSocket(handleNewNotification);

        return () => {
            disconnectSocket();
        };
    }, []);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "username" && e.newValue === null) {
                console.log("🔌 로그아웃 감지 → WebSocket 연결 해제");
                disconnectSocket();
            }
        };
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}
            {toastMessage && (
                <NotificationToast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}
        </NotificationContext.Provider>
    );
};
