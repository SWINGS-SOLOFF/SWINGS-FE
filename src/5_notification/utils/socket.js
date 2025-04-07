import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "http://localhost:8090/swings/ws";

let stompClient = null;

export const connectSocket = (onMessage) => {
    const token = sessionStorage.getItem("token");

    if (!token) {
        console.warn("토큰이 없어서 WebSocket 연결이 생략됩니다.");
        return;
    }

    // JWT 토큰에서 username 추출
    let username = null;
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        const payload = JSON.parse(decodedPayload);
        username = payload.username || payload.sub;

        if (!username) {
            console.warn("토큰에서 username을 찾을 수 없습니다.");
            return;
        }
    } catch (e) {
        console.error("JWT 파싱 오류:", e);
        return;
    }

    // WebSocket 연결 시작
    stompClient = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL),
        reconnectDelay: 5000,
        onConnect: () => {
            console.log("🔗 WebSocket 연결 성공");
            console.log(`🔔 [구독 시작] /topic/notification/${username}`);

            stompClient.subscribe(`/topic/notification/${username}`, (message) => {
                const payload = JSON.parse(message.body);
                onMessage(payload);
            });
        },
        onStompError: (frame) => {
            console.error("STOMP 오류 발생", frame);
        },
    });

    stompClient.activate();
};

export const disconnectSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        console.log("🔌 WebSocket 연결 해제됨");
    }
};
