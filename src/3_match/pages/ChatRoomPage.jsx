import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { fetchChatMessages } from "../api/chatRoomApi";

/**
 * ChatRoomPage.jsx
 * 채팅방 입장 후 실시간 메시지를 주고받는 컴포넌트입니다.
 */
const ChatRoomPage = () => {
    const { roomId } = useParams(); // /chat/:roomId 라우팅에서 roomId 추출
    const [messages, setMessages] = useState([]); // 채팅 메시지 목록
    const [input, setInput] = useState(""); // 입력창 텍스트
    const clientRef = useRef(null);

    // 메시지 초기 불러오기 + WebSocket 연결
    useEffect(() => {
        // 과거 메시지 불러오기
        fetchChatMessages(roomId)
            .then((res) => {
                setMessages(res.data);
            })
            .catch((err) => console.error("채팅 메시지 불러오기 실패", err));

        // WebSocket 연결
        const client = new Client({
            brokerURL: "ws://localhost:8080/ws", // 백엔드 WebSocket 엔드포인트
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("WebSocket 연결 성공");
            client.subscribe(`/topic/chat/${roomId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                setMessages((prev) => [...prev, newMessage]);
            });
        };

        client.activate();
        clientRef.current = client;

        return () => {
            if (client) client.deactivate();
        };
    }, [roomId]);

    // 메시지 전송 함수
    const sendMessage = () => {
        if (input.trim() === "" || !clientRef.current?.connected) return;
        const messageObj = {
            roomId,
            sender: "현재유저ID", // 실제 로그인된 유저 ID로 대체
            content: input,
        };

        clientRef.current.publish({
            destination: "/app/chat/message", // 백엔드 메시지 수신 endpoint
            body: JSON.stringify(messageObj),
        });

        setInput("");
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow p-4 overflow-y-scroll bg-gray-100">
                {messages.map((msg, idx) => (
                    <div key={idx} className="mb-2">
                        <strong>{msg.sender}</strong>: {msg.content}
                    </div>
                ))}
            </div>
            <div className="p-4 flex border-t bg-white">
                <input
                    className="flex-grow border border-gray-300 rounded px-3 py-2 mr-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    전송
                </button>
            </div>
        </div>
    );
};

export default ChatRoomPage;
