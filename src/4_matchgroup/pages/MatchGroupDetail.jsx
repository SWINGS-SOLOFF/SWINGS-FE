import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    MapPinIcon,
    CalendarIcon,
    UsersIcon,
    Venus,
    Mars,
} from "lucide-react";
import { getCurrentUser, getMatchGroupById } from "../api/matchGroupApi";
import {
    getAcceptedParticipants,
    getPendingParticipants,
} from "../api/matchParticipantApi";
import PendingParticipantModal from "../components/PendingParticipantModal";
import useMatchGroupActions from "../hooks/useMatchGroupActions";
import useMatchStatus from "../hooks/useMatchStatus";
import JoinConfirmModal from "../components/JoinConfirmModal";

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
            const accepted = await getAcceptedParticipants(matchGroupId);
            const pending = await getPendingParticipants(matchGroupId);

            setCurrentUser(user);
            setGroup(groupData);
            setParticipants(accepted);
            setPendingParticipants(pending);
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
    const maleCount = participants.filter((p) => p.gender === "male").length;

    const genderLimitReached =
        (currentUser?.gender === "female" && femaleCount >= group?.femaleLimit) ||
        (currentUser?.gender === "male" && maleCount >= group?.maleLimit);

    if (loading) return <p className="text-center">⏳ 그룹 정보를 불러오는 중...</p>;
    if (!group) return <p className="text-center text-red-500">❌ 그룹 정보를 불러올 수 없습니다.</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-2">{group.groupName}</h1>
            <p className="text-gray-600 mb-3">{group.description}</p>

            <div className="space-y-1 mb-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-pink-500" />
                    <span>{group.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-orange-500" />
                    <span>{new Date(group.schedule).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-purple-500" />
                    <span>{participants.length}/{group.maxParticipants}명 모집 중</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Venus className="w-4 h-4 text-pink-500" />
                        <span>여자 {femaleCount}/{group.femaleLimit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Mars className="w-4 h-4 text-blue-500" />
                        <span>남자 {maleCount}/{group.maleLimit}</span>
                    </div>
                </div>
                <div>
                    <span className="font-semibold">상태:</span>{" "}
                    <span className={`inline-block px-2 py-0.5 rounded-full text-white text-xs ${
                        group.status === "모집중" ? "bg-green-500" : "bg-gray-500"
                    }`}>
            {group.status}
          </span>
                </div>
            </div>

            {!isParticipant ? (
                <button
                    onClick={() => setShowJoinModal(true)}
                    className={`mt-4 w-full px-4 py-2 font-bold text-white rounded-xl shadow-md transition ${
                        isFull || genderLimitReached
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-custom-pink hover:bg-pink-400"
                    }`}
                    disabled={isFull || genderLimitReached}
                >

                {isFull ? "모집 완료됨" : genderLimitReached ? "성비 제한으로 신청 불가" : "참가 신청"}
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
                <h2 className="text-lg font-semibold mb-1">참가자 목록</h2>
                {participants.length === 0 ? (
                    <p className="text-gray-500">아직 참가자가 없습니다.</p>
                ) : (
                    <ul className="space-y-2 mt-2">
                        {participants.map((participant) => (
                            <li key={participant.userId} className="flex justify-between items-center bg-gray-100 p-2 rounded">
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