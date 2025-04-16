import React, { useEffect, useState } from "react";
import axios from "../../1_user/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { fetchUserData } from "../../1_user/api/userApi";
import { motion } from "framer-motion";
import { getProfileImageUrl } from "../../1_user/api/userApi";


const ChatListPage = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadChatRooms = async () => {
            try {
                const userData = await fetchUserData();
                setCurrentUser(userData);

                const res = await axios.get(`/api/chat/rooms?userId=${userData.username}`);
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
        <div className="relative flex flex-col h-full min-h-screen bg-gradient-to-b from-white via-slate-100 to-white text-gray-900">
            <div className="flex-1 overflow-y-auto divide-y divide-gray-200 px-4 pb-20">
                {chatRooms.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 animate-pulse">채팅방이 없습니다</p>
                ) : (
                    chatRooms.map((room, idx) => {
                        const targetUsername = room.user1 === currentUser.username ? room.user2 : room.user1;
                        const lastMessageTime = room.lastMessageTime
                            ? dayjs(room.lastMessageTime).format("HH:mm")
                            : "";
                        const unread = room.unreadCount || 0;
                        const profileImgUrl = `/images/${targetUsername}.png`; // 기본 구조 (추후 S3 연동 가능)

                        return (
                            <motion.div
                                key={room.roomId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="py-4 hover:bg-gray-50 cursor-pointer"
                                onClick={() => navigate(`/swings/chat/${room.roomId}`)}
                            >
                                <div className="flex items-center gap-4">
                                    {/* ✅ 프로필 이미지 */}
                                    <img
                                        src={profileImgUrl}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/images/default-profile.png";
                                        }}
                                        alt="profile"
                                        className="w-12 h-12 rounded-full object-cover shadow-sm"
                                    />

                                    <div className="flex-1">
                                        {/* ✅ 이름 + 아이디 + 시간 */}
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-gray-800">
                                                {room.targetName || "알 수 없음"}{" "}
                                                <span className="text-xs text-gray-500 ml-1">@{targetUsername}</span>
                                            </p>
                                            <span className="text-xs text-gray-400">{lastMessageTime}</span>
                                        </div>

                                        {/* ✅ 메시지 + 안읽은 메시지 뱃지 */}
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-600 truncate max-w-[200px]">
                                                {room.lastMessage || "아직 메시지가 없습니다."}
                                            </p>
                                            {unread > 0 && (
                                                <span className="bg-red-500 text-white text-[11px] font-bold rounded-full px-2 ml-2">
                                                    {unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* ✅ 좋아요 전체 보기 버튼 */}
            <button
                onClick={() => navigate(`/swings/chat/likes/${currentUser?.username}`)}
                className="fixed bottom-24 right-6 px-5 py-3 rounded-full bg-pink-500 text-white text-sm font-bold shadow-xl hover:bg-pink-600 transition-all z-50"
            >
                💖 좋아요 보기
            </button>
        </div>
    );
};

export default ChatListPage;
