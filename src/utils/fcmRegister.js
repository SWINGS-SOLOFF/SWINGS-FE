import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export const registerFCM = async (username) => {
    console.log("registerFCM 실행됨 - 사용자:", username);

    if (!("serviceWorker" in navigator)) {
        console.warn("이 브라우저는 serviceWorker를 지원하지 않습니다.");
        return;
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

    try {
        // 1. 알림 권한 요청
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.warn("알림 권한이 거부되었습니다.");
            return;
        }

        // 2. Service Worker 등록
        const registration = await navigator.serviceWorker.register("/sw.js");

        // 3. FCM 토큰 발급
        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: registration,
        });

        if (!token) {
            console.warn("FCM 토큰이 null입니다.");
            return;
        }

        console.log("FCM Token 발급 성공:", token);

        // 4. 서버로 토큰 전송
        const response = await fetch("http://localhost:8090/swings/fcm/register-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ token, username }),
        });

        const result = await response.text();
    } catch (err) {
        console.error("FCM 등록 실패:", err.message);
        console.error(err);
    }
};