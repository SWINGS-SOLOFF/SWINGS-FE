import { getToken } from "firebase/messaging";
import axiosInstance from "../../1_user/api/axiosInstance.js";
import {messaging} from "../../utils/firebase.js";

export const registerPushToken = async (username) => {
    console.log("🔥 registerPushToken 호출됨 - 사용자:", username);
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

    try {
        const token = await getToken(messaging, {
            vapidKey,
            serviceWorkerRegistration: await navigator.serviceWorker.register("/sw.js"),
        });

        console.log("✅ getToken 결과:", token);

        if (token) {
            await axiosInstance.post(
                `/fcm/register-token?username=${username}`,
                token,
                { headers: { "Content-Type": "text/plain" } }
            );
            console.log("✅ FCM 푸시 토큰 서버 전송 완료");
        } else {
            console.warn("⚠️ 푸시 토큰 없음 (권한 거부)");
        }
    } catch (err) {
        console.error("❌ FCM 토큰 전송 실패:", err);
    }
};