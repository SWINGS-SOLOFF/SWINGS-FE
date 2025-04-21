import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaThumbsUp } from "react-icons/fa";
import axios from "../../1_user/api/axiosInstance";
import SwipeCard from "../components/SwipeCard";
import ConfirmModal from "../components/ConfirmModal";
import SwipeModals from "../components/SwipeModals";
import { useSwipeData } from "../hooks/useSwipeData";
import { IoIosArrowBack } from "react-icons/io";

function SwipePage() {
    const {
        currentUser,
        profile,
        setProfile,
        remainingLikes,
        setRemainingLikes,
        fetchRecommendedUser,
        fetchRemainingLikes
    } = useSwipeData();

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showChargeModal, setShowChargeModal] = useState(false);
    const [showSuperChatModal, setShowSuperChatModal] = useState(false);
    const [remainingTime, setRemainingTime] = useState("");
    const navigate = useNavigate();

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
                `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            );
        };

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSwipe = async (direction, swipedProfile) => {
        if (!currentUser || !swipedProfile) return;
        try {
            await axios.post(`/api/dislikes/${currentUser.username}/${swipedProfile.username}`);
            fetchRecommendedUser(currentUser.username);
        } catch (error) {
            console.error("❌ 싫어요 실패", error);
            toast.error("문제가 발생했어요");
        }
    };

    const handleLike = () => {
        if (!profile || !currentUser) return;
        if (remainingLikes <= 0) setShowConfirmModal(true);
        else sendLikeRequest(false);
    };

    const sendLikeRequest = async (isPaid) => {
        try {
            await axios.post(`/api/likes/${currentUser.username}/${profile.username}`, null, {
                params: { paid: isPaid },
            });
            toast.success("💓 호감 표시 완료 💓");
            fetchRemainingLikes(currentUser.username);
            fetchRecommendedUser(currentUser.username);
        } catch (error) {
            if (error.response?.status === 400) setShowChargeModal(true);
            else toast.error("좋아요 도중 오류 발생");
        }
    };

    const confirmSuperChat = async () => {
        try {
            const data = new URLSearchParams();
            data.append("amount", 3);
            data.append("description", "슈퍼챗 사용");

            //  포인트 차감 시도
            await axios.post("/users/me/points/use", data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            //  채팅방 생성 (슈퍼챗으로)
            await axios.post("/api/chat/room", null, {
                params: {
                    user1: currentUser.username,
                    user2: profile.username,
                    isSuperChat: true,
                },
            });

            toast.success("💎 슈퍼챗으로 바로 채팅방이 생성되었습니다!");
            fetchRecommendedUser(currentUser.username);

        } catch (error) {
            const msg = error.response?.data?.message || "";
            const status = error.response?.status;

            //  메시지 기준으로 포인트 부족 판단
            if (status === 400 || msg.includes("하트가 부족")) {
                setShowChargeModal(true);
            } else {
                toast.error("슈퍼챗 도중 오류 발생");
                console.error("🔥 슈퍼챗 오류:", error);
            }
        } finally {
            setShowSuperChatModal(false);
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
        <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-gradient-to-b from-pink-200 via-blue-200 to-green-100">
            <Toaster />

            <div className="w-full max-w-md flex flex-col items-center">
                <div className="fixed top-6 left-4 sm:top-8 sm:left-6 z-10">
                    <button
                        onClick={() => navigate("/swings/feed")}
                        className="text-gray-700 hover:text-blue-600 p-2"
                        aria-label="뒤로가기"
                    >
                        <IoIosArrowBack size={28} />
                    </button>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 animate-bounce mb-2 text-center">💘 나랑 골프 치러 갈래?</h2>

                <p className="text-sm font-bold text-gray-700 mb-4">남은 무료 좋아요: {remainingLikes}회</p>
                {remainingLikes === 0 && (
                    <p className="text-xs text-red-600 font-medium animate-pulse mb-3">
                        ⏳ 좋아요 기회 충전까지 {remainingTime}
                    </p>
                )}

                <div className="w-full flex justify-center mt-2 mb-10">
                    <AnimatePresence mode="wait">
                        {profile ? (
                            <motion.div
                                key={profile.username}
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                            >
                                <SwipeCard profile={profile} onSwipe={handleSwipe} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="no-user"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-center"
                            >
                                <div className="bg-white text-gray-700 px-6 py-5 rounded-2xl shadow-md text-center leading-relaxed">
                                    <p className="text-lg font-semibold mb-1">📭 더 이상 추천할 유저가 없어요</p>
                                    <p className="text-sm text-gray-500">내일 다시 시도해보세요!</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <br/>

                <div className="flex flex-row gap-x-6 justify-center items-center mt-4">
                    <button
                        onClick={handleLike}
                        disabled={!profile}
                        className={`${profile ? "bg-custom-pink" : "bg-gray-300 cursor-not-allowed"} text-white px-6 py-3 font-bold rounded-2xl outline-none focus:outline-none shadow-lg flex items-center gap-2`}
                    >
                        <FaThumbsUp />
                        매력있어요!
                    </button>

                    <button
                        onClick={() => setShowSuperChatModal(true)}
                        disabled={!profile}
                        className={`${profile ? "bg-custom-purple" : "bg-gray-300 cursor-not-allowed"} text-white px-6 py-3 rounded-2xl shadow-lg outline-none focus:outline-none flex items-center gap-2 font-bold`}
                    >
                        슈퍼챗 💎
                    </button>
                </div>
            </div>

            <SwipeModals
                showConfirmModal={showConfirmModal}
                setShowConfirmModal={setShowConfirmModal}
                showChargeModal={showChargeModal}
                setShowChargeModal={setShowChargeModal}
                showSuperChatModal={showSuperChatModal}
                setShowSuperChatModal={setShowSuperChatModal}
                sendLikeRequest={sendLikeRequest}
                confirmSuperChat={confirmSuperChat}
                navigate={navigate}
            />
        </div>
    );
}

export default SwipePage;
