import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarIcon, MapPinIcon, UsersIcon, Venus, Mars } from "lucide-react";
import { getCurrentUser, getMatchGroupById } from "../api/matchGroupApi";
import { getParticipantsByGroupId } from "../api/matchParticipantApi";
import PendingParticipantModal from "../components/PendingParticipantModal";
import useMatchGroupActions from "../hooks/useMatchGroupActions";
import useMatchStatus from "../hooks/useMatchStatus";
import JoinConfirmModal from "../components/JoinConfirmModal.jsx";

const MatchGroupDetail = () => {
    const { matchGroupId } = useParams();
    const navigate = useNavigate();

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
            setParticipants(allParticipants.filter((p) => p.participantStatus === "ACCEPTED"));
            setPendingParticipants(allParticipants.filter((p) => p.participantStatus === "PENDING"));
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

    const femaleCount = participants.filter((p) => p.gender === "female").length;
    const maleCount = participants.filter((p) => p.gender === "").length;

    const genderLimitReached =
        currentUser?.gender === "male" && maleCount >= group?.maleLimit ||
        currentUser?.gender === "female" && femaleCount >= group?.femaleLimit;

    if (loading) return <p className="text-center">⏳ 로딩 중...</p>;
    if (!group) return <p className="text-center text-red-500">❌ 그룹 정보를 불러올 수 없습니다.</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-2">{group.groupName}</h1>
            <p className="text-gray-600 mb-2">{group.description}</p>
            <p className="text-gray-500"> 장소: {group.location}</p>
            <p className="text-gray-500">
                일정: {new Date(group.schedule).toLocaleString()}
            </p>
            <p className="text-gray-500">
                모집 현황: {participants.length}/{group.maxParticipants}명
            </p>
            <p className="text-gray-500 flex items-center gap-4">
                <span className="flex items-center gap-1">
                    <Venus className="w-4 h-4 text-pink-500" />
                    여자 {femaleCount}/{group.femaleLimit}
                </span>
                <span className="flex items-center gap-1">
                    <Mars className="w-4 h-4 text-blue-500" />
                    남자 {maleCount}/{group.maleLimit}
                </span>
            </p>
            <p className="text-sm font-semibold text-gray-500">
                상태:{" "}
                <span
                    className={`inline-block px-2 py-0.5 rounded-full text-white text-xs ${
                        group.status === "모집중" ? "bg-green-500" : "bg-gray-500"
                    }`}
                >
                    {group.status}
                </span>
            </p>

            {!isParticipant ? (
                <button
                    onClick={() => setShowJoinModal(true)}
                    className={`mt-4 w-full px-4 py-2 text-white rounded-lg shadow-md transition ${
                        isFull || genderLimitReached
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={isFull || genderLimitReached}
                >
                    {isFull
                        ? "모집 완료됨"
                        : genderLimitReached
                            ? "성비 제한으로 신청 불가"
                            : "참가 신청"}
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
                            대기자 목록 보기 ({pendingParticipants.length})
                        </button>
                    )}
                </div>
            )}

            <div className="mt-6">
                <h2 className="text-lg font-semibold">참가자 목록</h2>
                {participants.length === 0 ? (
                    <p className="text-gray-500">아직 참가자가 없습니다.</p>
                ) : (
                    <ul className="mt-2 space-y-2">
                        {participants.map((participant) => (
                            <li
                                key={participant.userId}
                                className="flex justify-between items-center bg-gray-100 p-2 rounded"
                            >
                                <span>
                                    {participant.username}
                                    {participant.userId === group.hostId && (
                                        <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-400 text-white rounded-full">
                                            ⭐ 방장
                                        </span>
                                    )}
                                </span>
                                {isHost && participant.userId !== currentUser?.userId && (
                                    <button
                                        onClick={() =>
                                            handleRemoveParticipant(
                                                group.matchGroupId,
                                                participant.userId,
                                                currentUser.userId
                                            )
                                        }
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
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
                onApprove={(matchParticipantId) =>
                    handleApprove(group.matchGroupId, matchParticipantId, currentUser.userId)
                }
                onReject={(matchParticipantId) =>
                    handleReject(group.matchGroupId, matchParticipantId, currentUser.userId)
                }
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