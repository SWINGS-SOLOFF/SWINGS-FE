import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/matchGroupApi";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../1_user/api/axiosInstance.js";
import BaseModal from "./ui/BaseModal";
import useMatchGroupActions from "../hooks/useMatchGroupActions";
import GroupManageModal from "./GroupManageModal.jsx";

// 참가 상태 탭 정의
const TABS = ["ACCEPTED", "PENDING", "REJECTED"];
const TAB_LABELS = {
    ACCEPTED: "참가 그룹",
    PENDING: "신청 그룹",
    REJECTED: "나의 그룹",
};

export default function MyParticipationModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [tab, setTab] = useState("ACCEPTED");
    const [currentUser, setCurrentUser] = useState(null);
    const [groups, setGroups] = useState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [showManageModal, setShowManageModal] = useState(false);

    // 공통 참가 취소 기능 (사용자 기준)
    const { handleLeave } = useMatchGroupActions(null, currentUser);

    useEffect(() => {
        if (!isOpen) return;

        const fetchGroups = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);

                const response = await axiosInstance.post("/matchParticipant/my", {
                    userId: user.userId,
                    participantStatus: tab,
                });

                setGroups(response.data);
            } catch (error) {
                console.error("내 참가 목록 조회 실패:", error);
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
        <BaseModal onClose={onClose} title=" 그룹 관리 " maxWidth="max-w-2xl">
            {/* 탭 선택 */}
            <div className="flex justify-center border-b mb-4">
                {TABS.map((key) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`relative px-4 py-2 text-sm font-medium text-gray-600 transition ${
                            tab === key
                                ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-600"
                                : "hover:text-gray-800"
                        }`}
                    >
                        {TAB_LABELS[key]}
                    </button>
                ))}
            </div>

            {/* 참가 리스트 */}
            {groups.length === 0 ? (
                <p className="text-gray-500 text-center">표시할 그룹이 없습니다.</p>
            ) : (
                <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                    {groups.map((g) => (
                        <li
                            key={g.matchParticipantId}
                            className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border"
                        >
                            <div className="text-sm text-gray-800">
                                <p className="font-semibold mb-1">그룹 ID: {g.matchGroupId}</p>
                                <p className="text-gray-500">참여일: {new Date(g.joinAt).toLocaleString()}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {tab === "PENDING" && (
                                    <button
                                        onClick={() => handleCancel(g.matchGroupId)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                                    >
                                        참가 취소
                                    </button>
                                )}

                                {tab === "ACCEPTED" && (
                                    <>
                                        <button
                                            onClick={() => navigate(`/matchgroup/${g.matchGroupId}`)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
                                        >
                                            상세 보기
                                        </button>

                                        {Number(g.hostId) === Number(currentUser?.userId) && (
                                            <button
                                                onClick={() => {
                                                    setSelectedGroupId(g.matchGroupId);
                                                    setShowManageModal(true);
                                                }}
                                                className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition"
                                            >
                                                참가자 관리
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-6 text-center">
                <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition"
                >
                    닫기
                </button>
            </div>

            {/* 다음 단계: 관리 모달 표시 자리 */}
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