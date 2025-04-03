import React, {createContext, useContext, useEffect, useState} from "react";
import {connectSocket, disconnectSocket} from "../utils/socket.js";
import NotificationToast from "../components/NotificationToast.jsx";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [toastMessage, setToastMessage] = useState(null); // 토스트 상태 추가


    const addNotification = (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setToastMessage(newNotification.message); // 알림이 오면 토스트 메시지도 설정
    };

    useEffect(() => {
        const handleNewNotification = (notification) => {
            console.log("📨 새 알림 도착:", notification);
            addNotification(notification);
        };

        connectSocket(handleNewNotification);
        return () => {
            disconnectSocket();
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}

            {/* ✅ 토스트 알림 출력 */}
            {toastMessage && (
                <NotificationToast
                    message={toastMessage}
                    onClose={() => setToastMessage(null)}
                />
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
