import React, { useEffect, useState } from "react";
import { NotificationContext } from "./NotificationContext";
import { connectSocket, disconnectSocket } from "../utils/socket";
import NotificationToast from "../components/NotificationToast";
import { getAllNotifications } from "../api/NotificationApi.js";
import { useAuth } from "../../1_user/context/AuthContext";

export const NotificationProvider = ({ children }) => {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);

    const addNotification = (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setToastMessage(newNotification.message);
    };

    const setInitialNotifications = (initialData) => {
        setNotifications(initialData);
    };

    const unreadCount = notifications.filter((n) => n.read === false).length;

    useEffect(() => {
        if (!token) {
            console.log("⛔ 토큰 없음 - 알림 연결 생략");
            return;
        }

        try {
            const base64Payload = token.split(".")[1];
            const decodedPayload = atob(base64Payload);
            const payload = JSON.parse(decodedPayload);
            const username = payload.username || payload.sub;

            if (!username) {
                console.warn("❌ username 파싱 실패 - 알림 연결 생략");
                return;
            }

            localStorage.setItem("username", username);

            const fetchInitialNotifications = async () => {
                try {
                    const data = await getAllNotifications(username);
                    setInitialNotifications(data);
                } catch (e) {
                    console.error("📭 초기 알림 불러오기 실패:", e);
                }
            };

            fetchInitialNotifications();

            connectSocket((notification) => {
                console.log("📨 실시간 알림 수신:", notification);
                addNotification(notification);
            });
        } catch (error) {
            console.error("❌ JWT 파싱 오류:", error);
        }

        return () => {
            disconnectSocket();
        };
    }, [token]); // ✅ 토큰 생겼을 때만 실행

    // 로그아웃 감지용
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "username" && e.newValue === null) {
                console.log("🔌 로그아웃 감지 → WebSocket 연결 해제");
                disconnectSocket();
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                setInitialNotifications,
                setNotifications,
                unreadCount,
            }}
        >
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