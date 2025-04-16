import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/matchGroupApi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../1_user/api/axiosInstance.js";
import BaseModal from "./ui/BaseModal";
import useMatchGroupActions from "../hooks/useMatchGroupActions";
import GroupManageModal from "./GroupManageModal.jsx";

const TABS = ["JOINED", "APPLIED", "HOSTED"];
const TAB_LABELS = {
    JOINED: "참여 그룹",
    APPLIED: "신청 그룹",
    HOSTED: "내가 만든 그룹",
};

export default function MyParticipationModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [tab, setTab] = useState("JOINED");
    const [currentUser, setCurrentUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [showManageModal, setShowManageModal] = useState(false);

    const { handleLeave } = useMatchGroupActions(null, currentUser);

    useEffect(() => {
        if (!isOpen) return;

        const fetchGroups = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);

                if (!user || !user.userId) {
                    console.warn("❗ 사용자 정보가 유효하지 않습니다.");
                    return;
                }

                let response;
                if (tab === "JOINED") {
                    response = await axiosInstance.post("/matchParticipant/my", {
                        userId: user.userId,
                        participantStatus: "ACCEPTED",
                    });
                } else if (tab === "APPLIED") {
                    response = await axiosInstance.post("/matchParticipant/my", {
                        userId: user.userId,
                        participantStatus: "PENDING",
                    });
                } else if (tab === "HOSTED") {
                    // ✅ 경로 수정: matchGroup → matchgroup (소문자)
                    response = await axiosInstance.get(`/matchgroup/host/${user.userId}`);
                }

                setGroups(response.data);
            } catch (error) {
                console.error("⚠️ 참가 그룹 조회 실패:", error);
            }
        };

        fetchGroups();
    }, [isOpen, tab]);

    const handleCancel = async (matchGroupId) => {
        try {
            await handleLeave(matchGroupId, currentUser.userId);
            setGroups((prev) => prev.filter((g) => g.matchGroupId !== matchGroupId));
        } catch (error) {
            alert("취소 실패");
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <BaseModal onClose={onClose} title="그룹 관리" maxWidth="max-w-2xl">
            <div className="grid grid-cols-3 bg-gray-100 rounded-full p-1 mb-4">
                {TABS.map((key) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`text-sm font-medium py-2 rounded-full transition-all ${
                            tab === key ? "bg-white shadow text-black" : "text-gray-500"
                        }`}
                    >
                        {TAB_LABELS[key]}
                    </button>
                ))}
            </div>

            {groups.length === 0 ? (
                <p className="text-gray-400 text-sm text-center mt-10">
                    표시할 그룹이 없습니다.
                </p>
            ) : (
                <ul className="space-y-3 max-h-[350px] overflow-y-auto px-1 pb-1 scrollbar-thin">
                    {groups.map((g) => (
                        <li
                            key={g.matchParticipantId || g.matchGroupId}
                            className="bg-white rounded-2xl shadow-md p-4 space-y-2 border border-gray-100"
                        >
                            <div className="text-sm text-gray-800">
                                <p className="font-semibold">🏌️ {g.groupName || `그룹 ID: ${g.matchGroupId}`}</p>
                            </div>

                            <div className="flex gap-2">
                                {tab === "APPLIED" && (
                                    <button
                                        onClick={() => handleCancel(g.matchGroupId)}
                                        className="flex-1 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition"
                                    >
                                        참가 취소
                                    </button>
                                )}

                                {tab === "JOINED" && (
                                    <button
                                        onClick={() => navigate(`/matchgroup/${g.matchGroupId}`)}
                                        className="flex-1 py-1 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 transition"
                                    >
                                        상세 보기
                                    </button>
                                )}

                                {tab === "HOSTED" && (
                                    <button
                                        onClick={() => {
                                            setSelectedGroupId(g.matchGroupId);
                                            setShowManageModal(true);
                                        }}
                                        className="flex-1 py-1 rounded-md bg-yellow-400 text-white text-sm hover:bg-yellow-500 transition"
                                    >
                                        참가자 관리
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {showManageModal && selectedGroupId && (
                <GroupManageModal
                    matchGroupId={selectedGroupId}
                    onClose={() => {
                        setShowManageModal(false);
                        setSelectedGroupId(null);
                    }}
                />
            )}
        </BaseModal>
    );
}