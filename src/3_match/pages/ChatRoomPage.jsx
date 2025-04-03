import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import { fetchChatMessages } from "../api/chatRoomApi";
import { fetchUserData } from "../../1_user/api/userApi"; // ✅ 로그인 유저 정보 가져오기
import SockJS from "sockjs-client";

const ChatRoomPage = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [currentUser, setCurrentUser] = useState(null); // ✅ 로그인 유저
    const clientRef = useRef(null);

    useEffect(() => {
        const loadMessagesAndUser = async () => {
            try {
                const user = await fetchUserData(); // 로그인 유저 정보 가져오기
                setCurrentUser(user);

                const res = await fetchChatMessages(roomId);
                const raw = res.data;
                const data = Array.isArray(raw) ? raw : raw?.data;

                if (!Array.isArray(data)) {
                    console.error("❌ 메시지 배열이 아님:", data);
                    return;
                }

                const processed = data.map((msg) => ({
                    ...msg,
                    createdAt: msg.sentAt,
                }));

                setMessages(processed);
            } catch (err) {
                console.error("❌ 유저 또는 메시지 불러오기 실패:", err);
            }
        };

        loadMessagesAndUser();

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8090/swings/ws"),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("✅ WebSocket 연결됨");
            client.subscribe(`/topic/chat/${roomId}`, (message) => {
                const newMessage = JSON.parse(message.body);
                newMessage.createdAt = newMessage.sentAt || new Date().toISOString();
                setMessages((prev) => [...prev, newMessage]);
            });
        };

        client.activate();
        clientRef.current = client;

        return () => {
            if (client) client.deactivate();
        };
    }, [roomId]);

    const sendMessage = () => {
        if (input.trim() === "" || !clientRef.current?.connected || !currentUser) return;

        const messageObj = {
            roomId: roomId,
            sender: currentUser.username, // ✅ 로그인된 유저 이름
            content: input,
        };

        clientRef.current.publish({
            destination: "/app/chat/message",
            body: JSON.stringify(messageObj),
        });

        setInput("");
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                로그인된 유저 정보를 불러오는 중...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="flex-grow p-4 overflow-y-scroll">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`mb-3 flex ${msg.sender === currentUser.username ? "justify-end" : "justify-start"}`}
                    >
                        <div className="max-w-xs">
                            <p className="text-xs text-gray-500 mb-1">{msg.sender}</p>
                            <div
                                className={`inline-block px-4 py-2 rounded-lg text-sm break-words ${
                                    msg.sender === currentUser.username
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-800"
                                }`}
                            >
                                {msg.content}
                            </div>
                            {msg.createdAt && (
                                <p className="text-[10px] text-black mt-1 text-right">
                                    {new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t bg-white flex">
                <input
                    className="flex-grow border border-gray-300 rounded px-3 py-2 mr-2 text-gray-900 placeholder-gray-500"
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
