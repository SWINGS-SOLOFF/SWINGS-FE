import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { fetchChatMessages } from "../api/chatRoomApi";
import { fetchUserData } from "../../1_user/api/userApi";

const ChatRoomPage = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const clientRef = useRef(null);
    const messagesEndRef = useRef(null);

    // ✅ 안 읽은 메시지 읽음 처리
    const markMessagesAsRead = async (roomId, username) => {
        try {
            await axios.post("http://localhost:8090/swings/api/chat/messages/read", null, {
                params: { roomId, username },
            });
            console.log("✅ 읽음 처리 완료");
        } catch (err) {
            console.error("❌ 읽음 처리 실패:", err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const user = await fetchUserData();
                setCurrentUser(user);

                const res = await fetchChatMessages(roomId);
                const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

                const formatted = data.map((msg) => ({
                    ...msg,
                    createdAt: msg.sentAt,
                }));

                setMessages(formatted);

                await markMessagesAsRead(roomId, user.username);
            } catch (err) {
                console.error("❌ 유저 또는 메시지 로딩 실패:", err);
            }
        };

        loadData();

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8090/swings/ws"),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            console.log("✅ WebSocket 연결됨");

            client.subscribe(`/topic/chat/${roomId}`, (message) => {
                const newMsg = JSON.parse(message.body);
                newMsg.createdAt = newMsg.sentAt || new Date().toISOString();

                setMessages((prev) => [...prev, newMsg]);
            });
        };

        client.activate();
        clientRef.current = client;

        return () => {
            if (client) client.deactivate();
        };
    }, [roomId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !clientRef.current?.connected || !currentUser) return;

        const msg = {
            roomId: roomId,
            sender: currentUser.username,
            content: input,
        };

        clientRef.current.publish({
            destination: "/app/chat/message",
            body: JSON.stringify(msg),
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
            {/* ✅ 메시지 목록 */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, idx) => {
                    const isMe = msg.sender === currentUser.username;
                    return (
                        <div key={idx} className={`mb-5 flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-xs ${isMe ? "text-right" : "text-left"}`}>
                                {/* ✅ 아이디 강조 */}
                                <p className={`mb-2 text-sm font-semibold ${isMe ? "text-blue-600" : "text-gray-700"}`}>
                                    {msg.sender}
                                </p>
                                {/* ✅ 메시지 말풍선 */}
                                <div
                                    className={`inline-block px-4 py-2 rounded-xl text-sm break-words ${
                                        isMe
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                                {/* ✅ 전송 시간 */}
                                {msg.createdAt && (
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        {new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} /> {/* 👈 자동 스크롤 */}
            </div>

            {/* ✅ 하단 입력창 */}
            <div className="p-4 bg-white border-t flex items-center">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="메시지를 입력하세요..."
                    className="flex-grow border border-gray-300 rounded px-3 py-2 mr-2 text-gray-900 placeholder-gray-500"
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
