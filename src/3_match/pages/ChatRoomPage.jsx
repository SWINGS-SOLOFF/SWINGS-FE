import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { fetchChatMessages } from "../api/chatRoomApi";
import SockJS from "sockjs-client";

// 현재 하드코딩된 유저 (로그인 붙이면 여기만 바꾸면 됨)
const currentUser = "user002";

const ChatRoomPage = () => {
    const { roomId } = useParams(); // URL에서 roomId 추출
    const [messages, setMessages] = useState([]); // 메시지 목록
    const [input, setInput] = useState(""); // 입력 필드
    const clientRef = useRef(null); // WebSocket 클라이언트

    // 🚀 채팅방 입장 시 과거 메시지 불러오기 + WebSocket 연결
    useEffect(() => {
        // 과거 채팅 불러오기
        fetchChatMessages(roomId)
            .then((res) => setMessages(Array.isArray(res.data) ? res.data : []))
            .catch((err) => console.error("❌ 채팅 메시지 불러오기 실패:", err));

        // WebSocket 연결 설정
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8090/swings/ws"), // ✅ SockJS 클라이언트로 변경
            reconnectDelay: 5000,
        });

        // 연결되었을 때 실행되는 함수
        client.onConnect = () => {
            console.log("✅ WebSocket 연결 성공");

            client.subscribe(`/topic/chat/${roomId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, newMessage]);
            });
        };

        client.activate(); // 연결 시작
        clientRef.current = client; // 참조 저장

        // 페이지 나갈 때 연결 종료
        return () => {
            if (client) client.deactivate();
        };
    }, [roomId]);

    // ✉️ 메시지 전송 함수
    const sendMessage = () => {
        if (input.trim() === "" || !clientRef.current?.connected) return;

        const messageObj = {
            roomId: roomId,
            sender: currentUser,
            content: input,
        };

        clientRef.current.publish({
            destination: "/app/chat/message",
            body: JSON.stringify(messageObj),
        });

        setInput(""); // 입력창 초기화
    };


    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* 채팅 메시지 출력 영역 */}
            <div className="flex-grow p-4 overflow-y-scroll">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`mb-3 flex ${msg.sender === currentUser ? "justify-end" : "justify-start"}`}
                    >
                        <div>
                            <p className="text-xs text-gray-500 mb-1">{msg.sender}</p>
                            <div
                                className={`inline-block px-4 py-2 rounded-lg text-sm ${
                                    msg.sender === currentUser
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-800"
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 입력창 + 전송 버튼 */}
            <div className="p-4 border-t bg-white flex">
                <input
                    className="flex-grow border border-gray-300 rounded px-3 py-2 mr-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    전송
                </button>
            </div>
        </div>
    );
};

export default ChatRoomPage;
