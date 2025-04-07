import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThumbsUp, ThumbsUpIcon } from "lucide-react";
import { fetchUserData } from "../../1_user/api/userApi";
import { motion } from "framer-motion";
import defaultImg from "../../assets/default-profile.png";

const BASE_URL = "http://localhost:8090/swings";

const SentLikeListPage = () => {
    const [likeList, setLikeList] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadLikes = async () => {
            try {
                const userData = await fetchUserData();
                setCurrentUser(userData);

                const token = sessionStorage.getItem("token");

                const res = await axios.get(`${BASE_URL}/api/likes/sent`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setLikeList(res.data);
            } catch (err) {
                console.error("❌ 좋아요 리스트 불러오기 실패", err);
            }
        };

        loadLikes();
    }, []);

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                로그인된 유저 정보를 불러오는 중...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-100 to-white text-gray-800 pb-20">
            {/* ✅ 상단 헤더 */}
            <div className="pt-16 px-4 pb-3 sticky top-0 bg-white z-10 border-b border-gray-200 shadow-sm flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">보낸 좋아요</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-blue-500 hover:underline"
                >
                    ← 뒤로가기
                </button>
            </div>

            {/* ✅ 좋아요 리스트 */}
            <div className="divide-y divide-gray-200">
                {likeList.length === 0 ? (
                    <p className="text-center py-10 text-gray-400 animate-pulse">
                        보낸 좋아요가 없습니다.
                    </p>
                ) : (
                    likeList.map((item, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={idx}
                            className="px-4 py-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/swings/profile/${item.toUsername}`)}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={defaultImg}
                                    alt="프로필"
                                    className="w-12 h-12 rounded-full object-cover shadow"
                                />
                                <div>
                                    <p className="font-semibold text-base text-gray-800">{item.name || "이름없음"}</p>
                                    <p className="text-sm text-gray-500">@{item.toUsername || item.username || "unknown"}</p>
                                </div>
                            </div>

                            <div className="pr-2">
                                {item.mutual ? (
                                    <ThumbsUp className="text-pink-500 fill-pink-500" />
                                ) : (
                                    <ThumbsUpIcon className="text-gray-300" />
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SentLikeListPage;
