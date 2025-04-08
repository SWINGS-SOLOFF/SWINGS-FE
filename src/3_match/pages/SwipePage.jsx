import React, { useEffect, useState } from "react";
import axios from "axios";
import SwipeCard from "../components/SwipeCard";
import { FaThumbsUp } from "react-icons/fa";
import { MessageCircleHeart, ArrowLeft } from "lucide-react";
import { fetchRecommendedProfiles, sendLike } from "../api/matchApi";
import { fetchUserData } from "../../1_user/api/userApi";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const BASE_URL = "http://localhost:8090/swings";
const token = sessionStorage.getItem("token"); // ✅ localStorage → sessionStorage로 변경

function SwipePage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserAndProfile = async () => {
            try {
                const userData = await fetchUserData();
                setCurrentUser(userData);
                fetchRecommendedUser(userData.username);
            } catch (err) {
                console.error("❌ 유저 정보 또는 추천 유저 로드 실패:", err);
            }
        };

        loadUserAndProfile();
    }, []);

    const fetchRecommendedUser = (username) => {
        axios
            .get(`${BASE_URL}/api/users/${username}/recommend`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                console.log("✅ 추천 유저 불러오기:", res.data);
                setProfile(res.data);
            })
            .catch((err) => {
                console.error("❌ 추천 유저 실패:", err);
                setProfile(null);
            });
    };

    const handleSwipe = (direction) => {
        if (!profile || !currentUser) return;
        if (direction === "left" || direction === "right") {
            fetchRecommendedUser(currentUser.username);
        }
    };

    const handleLike = () => {
        if (!profile || !currentUser) return;

        sendLike(currentUser.username, profile.username)
            .then(() => {
                toast.success("💓 호감 표시 완료 💓", {
                    icon: null,
                    duration: 2000,
                    position: "top-center",
                    style: {
                        background: "#fef2f2",
                        color: "#d6336c",
                        fontWeight: "bold",
                        borderRadius: "9999px",
                        padding: "10px 20px",
                        fontSize: "16px",
                    },
                });
                fetchRecommendedUser(currentUser.username);
            })
            .catch((err) => {
                console.error("❌ 좋아요 요청 실패", err);
            });
    };

    const handleSuperChat = async () => {
        if (!profile || !currentUser) return;

        try {
            const fromUsername = currentUser.username;
            const toUsername = profile.username;

            // ✅ 1. 포인트 차감
            await axios.post(`${BASE_URL}/users/me/points/use`, null, {
                params: {
                    amount: 3,
                    description: "슈퍼챗 사용"
                },
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("3코인을 사용하였습니다 🎉");

            // ✅ 2. 채팅방 생성
            await axios.post(`${BASE_URL}/api/chat/room`, null, {
                params: {
                    user1: fromUsername,
                    user2: toUsername
                },
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("채팅방이 생성되었습니다 💬");
            fetchRecommendedUser(currentUser.username);

        } catch (error) {
            if (error.response?.status === 400) {
                toast.error("코인이 부족합니다 🥲");
            } else if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("로그인이 필요합니다");
                navigate("/swings/login");
            } else {
                toast.error("슈퍼챗 도중 오류가 발생했습니다");
                console.error("❌ 슈퍼챗 오류:", error);
            }
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                로그인된 유저 정보를 불러오는 중...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-pink-200 via-blue-200 to-green-100 pt-[64px] pb-20">
            <Toaster />

            <div className="absolute top-4 left-4">
                <button
                    onClick={() => navigate("/swings/feed")}
                    className="absolute top-4 left-1 text-gray-700 hover:text-blue-600 transition-all"
                >
                    <ArrowLeft size={25} />
                </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 animate-bounce mb-4">
                💘 오늘의 골프 메이트 추천!
            </h2>

            <div className="relative w-[320px] h-[480px] mb-6">
                {profile && (
                    <SwipeCard
                        profile={profile}
                        onSwipe={handleSwipe}
                    />
                )}
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
                <button
                    onClick={handleLike}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
                >
                    <FaThumbsUp />
                    매력있어요!
                </button>

                <button
                    onClick={handleSuperChat}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold"
                >
                    슈퍼챗 💎
                </button>
            </div>
        </div>
    );
}

export default SwipePage;
