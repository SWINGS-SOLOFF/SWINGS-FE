// ✅ 1. React 관련
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ 2. 외부 라이브러리
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsUpIcon } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import axios from "../../1_user/api/axiosInstance";

// ✅ 3. 내부 API, 컴포넌트
import {
    getSentAndReceivedLikes,
    sendLikeToUser,
    createChatRoom,
} from "../api/matchApi";
import ConfirmModal from "../components/ConfirmModal";
import { fetchUserData } from "../../1_user/api/userApi";

// ✅ 4. 이미지 등 asset
import defaultImg from "../../assets/default-profile.png";

export default function LikeListPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [tab, setTab] = useState("sent");
    const [sentLikes, setSentLikes] = useState([]);
    const [receivedLikes, setReceivedLikes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showChargeModal, setShowChargeModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await fetchUserData();
                setCurrentUser(user);
            } catch (err) {
                console.error("❌ 유저 정보 불러오기 실패:", err);
            }
        };
        loadUser();
    }, []);

    useEffect(() => {
        if (currentUser?.username) {
            fetchData(currentUser.username);
        }
    }, [currentUser]);

    const fetchData = async (username) => {
        try {
            const res = await getSentAndReceivedLikes(username);
            setSentLikes(res.sentLikes || []);
            setReceivedLikes(res.receivedLikes || []);
        } catch (err) {
            console.error("❌ 좋아요 정보 가져오기 실패", err);
        }
    };

    const handleSendLike = async (targetUsername) => {
        setSelectedUser(targetUsername);
        try {
            const res = await axios.get(`/api/likes/count/${currentUser.username}`);
            const remaining = res.data;

            if (remaining <= 0) {
                setShowConfirmModal(true);
            } else {
                await sendLikeToUser(currentUser.username, targetUsername, false);
                await createChatRoom(currentUser.username, targetUsername, false);
                toast.success("💓 호감 표시 완료 💓");
                toast.success("💬 채팅방이 생성되었습니다");
                fetchData(currentUser.username);
            }
        } catch (err) {
            console.error("❌ 좋아요 보내기 또는 채팅방 생성 실패", err);
        }
    };

    const confirmPaidLike = async () => {
        try {
            const data = new URLSearchParams();
            data.append("amount", 1);
            data.append("description", "좋아요 유료 사용");

            await axios.post(`/users/me/points/use`, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            await sendLikeToUser(currentUser.username, selectedUser, true);
            await createChatRoom(currentUser.username, selectedUser, false);
            toast.success("💓 유료 좋아요 완료!");
            fetchData(currentUser.username);
        } catch (err) {
            if (err.response?.status === 400) {
                setShowChargeModal(true);
            } else {
                toast.error("유료 좋아요 실패");
                console.error(err);
            }
        } finally {
            setShowConfirmModal(false);
        }
    };

    const activeList = tab === "sent" ? sentLikes : receivedLikes;

    if (!currentUser) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">유저 정보 불러오는 중...</div>;
    }

    return (
        <div className="flex flex-col h-full min-h-screen bg-white text-gray-900 px-4 py-6">
            <Toaster />

            {showConfirmModal && (
                <ConfirmModal
                    message={`무료 좋아요가 모두 소진되었습니다.\n1코인을 사용해 좋아요를 보내시겠어요?`}
                    confirmLabel="보내기"
                    cancelLabel="아니요"
                    onConfirm={confirmPaidLike}
                    onCancel={() => setShowConfirmModal(false)}
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

            <h1 className="text-2xl font-bold text-center mb-6">좋아요 목록</h1>

            <div className="flex justify-center gap-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                        tab === "sent" ? "bg-pink-500 text-white border-2 border-blue-400" : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setTab("sent")}
                >
                    보낸 좋아요
                </button>
                <button
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                        tab === "received" ? "bg-yellow-400 text-white border-2 border-blue-400" : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setTab("received")}
                >
                    받은 좋아요
                </button>
            </div>

            <div className="space-y-3 pb-20">
                {activeList.length === 0 ? (
                    <p className="text-center text-gray-400 py-10 animate-pulse">
                        아직 데이터가 없어요.
                    </p>
                ) : (
                    activeList.map((user, index) => {
                        const isMutual = String(user.mutual) === "true";

                        return (
                            <motion.div
                                key={`${user.username}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                                className="py-3 px-4 bg-white rounded-xl shadow flex justify-between items-center hover:bg-gray-50"
                            >
                                <div
                                    className="flex items-center gap-4 cursor-pointer"
                                    onClick={() => navigate(`/swings/profile/${user.username}`)}
                                >
                                    <img
                                        src={user.userImg && user.userImg !== "" ? user.userImg : defaultImg}
                                        alt="프로필"
                                        className="w-12 h-12 rounded-full object-cover border"
                                    />
                                    <div>
                                        <p className="font-semibold text-base text-gray-800">
                                            {user.name || user.username || "이름없음"}
                                        </p>
                                        <p className="text-sm text-gray-500">@{user.username || "unknown"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {tab === "received" && !isMutual && (
                                        <button
                                            disabled={!currentUser || loading}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSendLike(user.username);
                                            }}
                                            className="text-sm bg-pink-500 text-white px-3 py-1 rounded-full hover:bg-pink-600"
                                        >
                                            좋아요 보내기
                                        </button>
                                    )}
                                    {isMutual ? (
                                        <ThumbsUp className="text-pink-500 fill-pink-500 w-5 h-5" />
                                    ) : (
                                        <ThumbsUpIcon className="text-gray-300 w-5 h-5" />
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
