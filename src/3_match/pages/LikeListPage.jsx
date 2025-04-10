import { useEffect, useState } from "react";
import { getSentAndReceivedLikes } from "../api/matchApi";
import { useParams, useNavigate } from "react-router-dom"; // ✅ navigate 추가
import { ThumbsUp, ThumbsUpIcon } from "lucide-react";
import { motion } from "framer-motion";
import defaultImg from "../../assets/default-profile.png";

export default function LikeListPage() {
    const { userId } = useParams();
    const [tab, setTab] = useState("sent");
    const [sentLikes, setSentLikes] = useState([]);
    const [receivedLikes, setReceivedLikes] = useState([]);
    const navigate = useNavigate(); // ✅ 네비게이션 훅

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getSentAndReceivedLikes(userId);
                setSentLikes(res.sentLikes || []);
                setReceivedLikes(res.receivedLikes || []);
            } catch (err) {
                console.error("좋아요 정보 가져오기 실패", err);
            }
        };
        fetchData();
    }, [userId]);

    const activeList = tab === "sent" ? sentLikes : receivedLikes;

    return (
        <div className="flex flex-col h-full min-h-screen bg-white text-gray-900 px-4 py-6">
            <h1 className="text-2xl font-bold text-center mb-6">좋아요 목록</h1>

            <div className="flex justify-center gap-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                        tab === "sent"
                            ? "bg-pink-500 text-white border-2 border-blue-400"
                            : "bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setTab("sent")}
                >
                    보낸 좋아요
                </button>
                <button
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                        tab === "received"
                            ? "bg-yellow-400 text-white border-2 border-blue-400"
                            : "bg-gray-200 text-gray-700"
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
                    activeList.map((user, index) => (
                        <motion.div
                            key={`${user.username}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className="py-3 px-4 bg-white rounded-xl shadow flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/swings/profile/${user.username}`)} // ✅ 클릭 이동
                        >
                            <div className="flex items-center gap-4">
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

                            <div className="pr-1">
                                {!!user.mutual ? (
                                    <ThumbsUp className="text-pink-500 fill-pink-500 w-5 h-5" />
                                ) : (
                                    <ThumbsUpIcon className="text-gray-300 w-5 h-5" />
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
