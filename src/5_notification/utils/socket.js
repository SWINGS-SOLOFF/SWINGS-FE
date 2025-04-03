import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "http://localhost:8090/swings/ws";

let stompClient = null;

export const connectSocket = (onMessage) => {
    stompClient = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL),
        reconnectDelay: 5000,
        onConnect: () => {
            console.log("🔗 WebSocket 연결 성공");

            // 로그인한 유저의 알림 채널을 구독
            const username = localStorage.getItem("username");
            if (username) {
                stompClient.subscribe(`/topic/notification/${username}`, (message) => {
                    const payload = JSON.parse(message.body);
                    onMessage(payload); // 메시지 처리 콜백 호출
                });
            }
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