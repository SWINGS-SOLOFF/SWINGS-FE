import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import dayjs from "dayjs";
import { fetchUserData } from "../../1_user/api/userApi";
import { motion } from "framer-motion";

const BASE_URL = "http://localhost:8090/swings";

const ChatListPage = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadChatRooms = async () => {
            try {
                const userData = await fetchUserData();
                setCurrentUser(userData);

                const res = await axios.get(`${BASE_URL}/api/chat/rooms?userId=${userData.username}`);
                const parsed = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
                setChatRooms(parsed);
            } catch (err) {
                console.error("❌ 채팅방 목록 조회 실패:", err);
                setChatRooms([]);
            }
        };

        loadChatRooms();
    }, []);

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                로그인된 유저 정보를 불러오는 중...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full min-h-screen bg-gradient-to-b from-white via-slate-100 to-white text-gray-900">

            {/* ✅ 내부 스크롤 가능한 리스트 영역 */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-200 px-4 pb-20">
                {chatRooms.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 animate-pulse">채팅방이 없습니다</p>
                ) : (
                    chatRooms.map((room, idx) => {
                        const targetUser = room.user1 === currentUser.username ? room.user2 : room.user1;
                        const lastMessageTime = room.lastMessageTime
                            ? dayjs(room.lastMessageTime).format("HH:mm")
                            : "";
                        const unread = room.unreadCount || 0;

                        return (
                            <motion.div
                                key={room.roomId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="py-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() => navigate(`/swings/chat/${room.roomId}`)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800">{targetUser}</p>
                                        <p className="text-sm text-gray-600 truncate max-w-[250px]">
                                            {room.lastMessage || "아직 메시지가 없습니다."}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs text-gray-500">{lastMessageTime}</span>
                                        {unread > 0 && (
                                            <span className="bg-red-500 text-white text-[11px] font-bold rounded-full px-2 mt-1">
                                                {unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* ✅ 플로팅 하트 버튼 */}
            <button
                onClick={() => navigate("/swings/chat/sent")}
                className="fixed bottom-24 right-6 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-all"
            >
                ❤️
            </button>
        </div>
    );
};

export default ChatListPage;
