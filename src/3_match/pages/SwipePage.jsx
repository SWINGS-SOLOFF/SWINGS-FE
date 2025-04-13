
import React, { useEffect, useState } from "react";
import axios from "axios";
import SwipeCard from "../components/SwipeCard";
import { FaThumbsUp } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { fetchUserData } from "../../1_user/api/userApi";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmModal from "../components/ConfirmModal";

const BASE_URL = "http://localhost:8090/swings";
const token = sessionStorage.getItem("token");

function SwipePage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [remainingLikes, setRemainingLikes] = useState(3);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showChargeModal, setShowChargeModal] = useState(false);
    const [showSuperChatModal, setShowSuperChatModal] = useState(false); // 슈퍼챗 전용 모달
    const [remainingTime, setRemainingTime] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserAndProfile = async () => {
            try {
                const userData = await fetchUserData();
                setCurrentUser(userData);
                fetchRecommendedUser(userData.username);
                fetchRemainingLikes(userData.username);
            } catch (err) {
                console.error("❌ 유저 정보 또는 추천 유저 로드 실패:", err);
            }
        };
        loadUserAndProfile();
    }, []);

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight - now;

            const hours = Math.floor(diff / 1000 / 60 / 60);
            const minutes = Math.floor((diff / 1000 / 60) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setRemainingTime(
                `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
                    .toString()
                    .padStart(2, "0")}`
            );
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchRecommendedUser = (username) => {
        axios
            .get(`${BASE_URL}/api/users/${username}/recommend`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setProfile(res.data))
            .catch((err) => {
                console.error("❌ 추천 유저 실패:", err);
                setProfile(null);
            });
    };

    const fetchRemainingLikes = (username) => {
        axios
            .get(`${BASE_URL}/api/likes/count/${username}`)
            .then((res) => setRemainingLikes(res.data))
            .catch((err) => {
                console.error("❌ 잔여 좋아요 로드 실패:", err);
                setRemainingLikes(0);
            });
    };

    const handleSwipe = async (direction, swipedProfile) => {
        if (!currentUser || !swipedProfile) return;

        try {
            await axios.post(`${BASE_URL}/api/dislikes/${currentUser.username}/${swipedProfile.username}`);
            fetchRecommendedUser(currentUser.username);
        } catch (error) {
            console.error("❌ 싫어요 실패", error);
            toast.error("문제가 발생했어요");
        }
    };

    const handleLike = async () => {
        if (!profile || !currentUser) return;

        const isPaid = remainingLikes <= 0;

        if (isPaid) {
            setShowConfirmModal(true);
            return;
        }

        sendLikeRequest(false);
    };

    const sendLikeRequest = async (isPaid) => {
        try {
            await axios.post(
                `${BASE_URL}/api/likes/${currentUser.username}/${profile.username}`,
                null,
                { params: { paid: isPaid } }
            );

            toast.success("💓 호감 표시 완료 💓");
            fetchRemainingLikes(currentUser.username);
            fetchRecommendedUser(currentUser.username);
        } catch (error) {
            if (error.response?.status === 400) {
                setShowChargeModal(true);
            } else {
                toast.error("좋아요 도중 오류 발생");
                console.error("❌ 좋아요 오류:", error);
            }
        }
    };

    const handleSuperChat = () => {
        setShowSuperChatModal(true); // 확인 모달부터 띄움
    };

    const confirmSuperChat = async () => {
        try {
            const data = new URLSearchParams();
            data.append("amount", 3);
            data.append("description", "슈퍼챗 사용");

            await axios.post(`${BASE_URL}/users/me/points/use`, data, {
                params: {
                    amount: 3,
                    description: "슈퍼챗 사용",
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            toast.success("🪙 코인 3개 사용 완료!");

            await axios.post(`${BASE_URL}/api/chat/room`, null, {
                params: {
                    user1: currentUser.username,
                    user2: profile.username,
                    isSuperChat: true,
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("💎 슈퍼챗으로 바로 채팅방이 생성되었습니다!");
            fetchRecommendedUser(currentUser.username);
        } catch (error) {
            if (error.response?.status === 400) {
                setShowChargeModal(true); // 포인트 부족 시 충전 모달
            } else {
                toast.error("슈퍼챗 도중 오류 발생");
                console.error("❌ 슈퍼챗 오류:", error);
            }
        } finally {
            setShowSuperChatModal(false);
        }
    };

    if (!currentUser) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">로그인된 유저 정보를 불러오는 중...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-pink-200 via-blue-200 to-green-100 pt-28 pb-20">
            <Toaster />

            {showConfirmModal && (
                <ConfirmModal
                    message={`무료 좋아요를 모두 사용했어요.\n1코인을 사용해 좋아요를 보내시겠어요?`}
                    confirmLabel="보내기"
                    cancelLabel="아니요"
                    onConfirm={() => {
                        setShowConfirmModal(false);
                        sendLikeRequest(true);
                    }}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}

            {showSuperChatModal && (
                <ConfirmModal
                    message={`슈퍼챗은 3코인을 사용합니다.\n사용하시겠어요?`}
                    confirmLabel="사용하기"
                    cancelLabel="돌아가기"
                    onConfirm={confirmSuperChat}
                    onCancel={() => setShowSuperChatModal(false)}
                />
            )}

            {showChargeModal && (
                <ConfirmModal
                    message={`포인트가 부족합니다.\n충전하러 가시겠어요?`}
                    confirmLabel="충전하러 가기"
                    cancelLabel="돌아가기"
                    onConfirm={() => {
                        setShowChargeModal(false);
                        navigate("/swings/points");
                    }}
                    onCancel={() => setShowChargeModal(false)}
                />
            )}

            <div className="absolute top-4 left-4">
                <button
                    onClick={() => navigate("/swings/feed")}
                    className="absolute top-4 left-1 text-gray-700 hover:text-blue-600 transition-all"
                >
                    <ArrowLeft size={25} />
                </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 animate-bounce mb-2">💘 오늘의 골프 메이트 추천!</h2>
            <p className="text-sm text-gray-700 mb-1">남은 무료 좋아요: {remainingLikes}회</p>
            {remainingLikes === 0 && (
                <p className="text-xs text-red-600 font-medium animate-pulse mb-4">
                    ⏳ 좋아요 기회 충전까지 {remainingTime}
                </p>
            )}

            <div className="relative w-[320px] h-[480px] mb-8">
                <AnimatePresence mode="wait">
                    {profile && (
                        <motion.div
                            key={profile.username}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
                            className="absolute inset-0"
                        >
                            <SwipeCard profile={profile} onSwipe={handleSwipe} />
                        </motion.div>
                    )}
                </AnimatePresence>
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