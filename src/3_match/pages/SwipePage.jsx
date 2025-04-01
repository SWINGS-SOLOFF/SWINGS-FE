import React, { useEffect, useState } from "react";
import axios from "axios";
import SwipeCard from "../components/SwipeCard";
import { FaThumbsUp } from "react-icons/fa";
import { MessageCircleHeart } from "lucide-react"; // 💎 슈퍼챗 아이콘 교체!
import { fetchRecommendedProfiles, sendLike } from "../api/matchApi";

const BASE_URL = "http://localhost:8090/swings";
const username = "user001";
const token = localStorage.getItem("accessToken");

function SwipePage() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchRecommendedUser();
    }, []);

    const fetchRecommendedUser = () => {
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
        if (!profile) return;
        if (direction === "left" || direction === "right") {
            fetchRecommendedUser();
        }
    };

    const handleLike = () => {
        if (!profile) return;

        sendLike(username, profile.username)
            .then(() => {
                alert("💘 호감 표시 완료!");
                fetchRecommendedUser();
            })
            .catch((err) => {
                console.error("❌ 좋아요 요청 실패", err);
            });
    };

    const handleSuperChat = () => {
        if (!profile) return;
        alert("🚀 슈퍼챗 기능은 유료입니다! (추후 연결 예정)");
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-pink-200 via-blue-200 to-green-100 px-4 pt-10">
            <h2 className="text-2xl font-bold text-gray-800 animate-bounce mb-4">
                🎯 오늘의 골프 파트너 추천
            </h2>

            <div className="relative w-[320px] h-[480px] mb-6">
                {profile && (
                    <SwipeCard
                        profile={profile}
                        onSwipe={handleSwipe}
                    />
                )}
            </div>

            {/* ✅ 하단 버튼들 (상세보기 제거됨) */}
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
