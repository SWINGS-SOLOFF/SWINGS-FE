import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCurrentUser, getMatchGroupById } from "../api/matchGroupApi";
import { getParticipantsByGroupId } from "../api/matchParticipantApi";
import PendingParticipantModal from "../components/PendingParticipantModal";
import useMatchGroupActions from "../hooks/useMatchGroupActions";
import useMatchStatus from "../hooks/useMatchStatus";
import JoinConfirmModal from "../components/JoinConfirmModal.jsx";

const MatchGroupDetail = () => {
    const { matchGroupId } = useParams();

    const [group, setGroup] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [pendingParticipants, setPendingParticipants] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    const { isHost, isParticipant, isFull } = useMatchStatus(
        group,
        currentUser,
        participants,
        pendingParticipants
    );

    const fetchGroupData = async () => {
        try {
            const user = await getCurrentUser();
            const groupData = await getMatchGroupById(matchGroupId);
            const allParticipants = await getParticipantsByGroupId(matchGroupId);

            setCurrentUser(user);
            setGroup(groupData);
            setParticipants(allParticipants.filter(p => p.participantStatus === "ACCEPTED"));
            setPendingParticipants(allParticipants.filter(p => p.participantStatus === "PENDING"));
        } catch (error) {
            console.error("데이터 로딩 오류:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupData();
        const interval = setInterval(fetchGroupData, 5000);
        return () => clearInterval(interval);
    }, [matchGroupId]);

    const {
        handleJoin,
        handleLeave,
        handleApprove,
        handleReject,
        handleRemoveParticipant,
        handleCloseGroup,
        handleDeleteGroup,
    } = useMatchGroupActions(group, currentUser, fetchGroupData, participants, setParticipants);

    const handleConfirmJoin = async () => {
        await handleJoin();
        setShowJoinModal(false);
    };

    if (loading) return <p className="text-center">⏳ 로딩 중...</p>;
    if (!group) return <p className="text-center text-red-500">❌ 그룹 정보를 불러올 수 없습니다.</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">{group.groupName}</h1>
            <p className="text-gray-600 mb-2">{group.description}</p>
            <p className="text-gray-500">📍 장소: {group.location}</p>
            <p className="text-gray-500">
                ⏰ 일정: {new Date(group.schedule).toLocaleString()}
            </p>
            <p className="text-gray-500">
                👥 모집 현황: {participants.length}/{group.maxParticipants}명
            </p>
            <p className="text-sm font-bold text-blue-500">⭐ 방장: {group.hostUsername}</p>

            {!isParticipant ? (
                <button
                    onClick={() => setShowJoinModal(true)}
                    className={`mt-4 w-full px-4 py-2 text-white rounded-lg shadow-md transition ${
                        isFull ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={isFull}
                >
                    {isFull ? "모집 완료됨" : "참가 신청"}
                </button>
            ) : (
                <button
                    onClick={handleLeave}
                    className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
                >
                    참가 취소
                </button>
            )}

            {isHost && (
                <div className="mt-6 space-y-2">
                    <button
                        onClick={handleCloseGroup}
                        className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
                    >
                        모집 종료
                    </button>
                    <button
                        onClick={handleDeleteGroup}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition"
                    >
                        그룹 삭제
                    </button>
                    {pendingParticipants.length > 0 && (
                        <button
                            onClick={() => setShowPendingModal(true)}
                            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
                        >
                            대기자 목록 보기
                        </button>
                    )}
                </div>
            )}

            <div className="mt-6">
                <h2 className="text-lg font-semibold">👥 참가자 목록</h2>
                {participants.length === 0 ? (
                    <p className="text-gray-500">아직 참가자가 없습니다.</p>
                ) : (
                    <ul className="mt-2 space-y-2">
                        {participants.map((participant) => (
                            <li
                                key={participant.userId}
                                className="flex justify-between items-center bg-gray-100 p-2 rounded"
                            >
                                <span>{participant.username}</span>
                                {isHost && participant.userId !== currentUser?.userId && (
                                    <button
                                        onClick={() => handleRemoveParticipant(participant.userId)}
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        강퇴
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <PendingParticipantModal
                isOpen={showPendingModal}
                onClose={() => setShowPendingModal(false)}
                pendingParticipants={pendingParticipants}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            <JoinConfirmModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                group={group}
                participants={participants}
                onConfirm={handleConfirmJoin}
            />
        </div>
    );
};

export default MatchGroupDetail;
