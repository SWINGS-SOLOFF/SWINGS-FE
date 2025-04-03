import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import dayjs from "dayjs";
import { fetchUserData } from "../../1_user/api/userApi"; // ✅ 로그인 유저 정보 불러오기

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
        <div className="min-h-screen bg-gray-100 text-gray-900">
            {/* ✅ 상단 헤더 */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-700">
                <h1 className="text-xl font-bold">SWINGS</h1>
                <MessageCircle size={24} />
            </div>

            {/* ✅ 채팅방 목록 */}
            <div className="divide-y divide-gray-300">
                {chatRooms.length === 0 ? (
                    <p className="text-center py-10 text-gray-400">채팅방이 없습니다</p>
                ) : (
                    chatRooms.map((room) => (
                        <div
                            key={room.roomId}
                            className="px-4 py-3 hover:bg-zinc-800 cursor-pointer"
                            onClick={() => navigate(`/swings/chat/${room.roomId}`)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">
                                        {/* 내 아이디가 user1이면 상대방은 user2 */}
                                        {room.user1 === currentUser.username ? room.user2 : room.user1}
                                    </p>
                                    <p className="text-sm text-gray-400">마지막 메시지 미지원</p>
                                </div>
                                <span className="text-xs text-gray-500">
                                    {dayjs(room.createdAt).format("HH:mm")}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatListPage;
