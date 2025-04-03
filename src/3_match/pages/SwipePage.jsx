import React, { useEffect, useState } from "react";
import axios from "axios";
import SwipeCard from "../components/SwipeCard";
import { FaThumbsUp } from "react-icons/fa";
import { MessageCircleHeart } from "lucide-react"; // 슈퍼챗 아이콘
import { fetchRecommendedProfiles, sendLike } from "../api/matchApi";
import { fetchUserData } from "../../1_user/api/userApi";
import { ArrowLeft } from "lucide-react"; // 아이콘
import { useNavigate } from "react-router-dom"; // 페이지 이동용
const BASE_URL = "http://localhost:8090/swings";
const token = localStorage.getItem("accessToken");


function SwipePage() {
    const [currentUser, setCurrentUser] = useState(null); // 현재 로그인된 유저 정보
    const [profile, setProfile] = useState(null); // 추천 프로필
    const navigate = useNavigate();


    // ✅ 컴포넌트 마운트 시 유저 정보 & 추천 프로필 불러오기
    useEffect(() => {
        const loadUserAndProfile = async () => {
            try {
                const userData = await fetchUserData(); // 로그인 유저 정보 불러오기
                setCurrentUser(userData);

                // 유저 정보 불러온 후 추천 유저 불러오기
                fetchRecommendedUser(userData.username);
            } catch (err) {
                console.error("❌ 유저 정보 또는 추천 유저 로드 실패:", err);
            }
        };

        loadUserAndProfile();
    }, []);

    // ✅ 추천 유저 불러오기 함수
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

    // ✅ 스와이프 후 다음 추천
    const handleSwipe = (direction) => {
        if (!profile || !currentUser) return;
        if (direction === "left" || direction === "right") {
            fetchRecommendedUser(currentUser.username);
        }
    };

    // ✅ 좋아요 버튼 클릭
    const handleLike = () => {
        if (!profile || !currentUser) return;

        sendLike(currentUser.username, profile.username)
            .then(() => {
                alert("💘 호감 표시 완료!");
                fetchRecommendedUser(currentUser.username);
            })
            .catch((err) => {
                console.error("❌ 좋아요 요청 실패", err);
            });
    };

    // ✅ 슈퍼챗 클릭
    const handleSuperChat = () => {
        if (!profile) return;
        alert("🚀 슈퍼챗 기능은 유료입니다! (추후 연결 예정)");
    };

    // ✅ 로딩 처리
    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                로그인된 유저 정보를 불러오는 중...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-pink-200 via-blue-200 to-green-100 px-4 pt-10">
            <div className="absolute top-4 left-4">
                <button
                    onClick={() => navigate("/swings/home")}
                    className="absolute top-4 left-1 text-gray-700 hover:text-blue-600 transition-all"
                >
                    <ArrowLeft size={25} />
                </button>
            </div>

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

            {/* 하단 버튼들 */}
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
