// React Hook 및 라우터 관련 기능 임포트
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// API 함수 및 커스텀 훅
import { getCurrentUser, getMatchGroupById } from "../api/matchGroupApi";
import { getParticipantsByGroupId } from "../api/matchParticipantApi";

// 컴포넌트 & 커스텀 훅
import PendingParticipantModal from "../components/PendingParticipantModal";
import useMatchGroupActions from "../hooks/useMatchGroupActions";
import useMatchStatus from "../hooks/useMatchStatus";
import JoinConfirmModal from "../components/JoinConfirmModal.jsx";


const MatchGroupDetail = () => {
    const { groupId: matchGroupId } = useParams(); // URL에서 그룹 ID 추출

    // 상태 변수
    const [group, setGroup] = useState(null); // 매치 그룹 정보
    const [participants, setParticipants] = useState([]); // 승인된 참가자 목록
    const [pendingParticipants, setPendingParticipants] = useState([]); // 대기 중인 참가자 목록
    const [currentUser, setCurrentUser] = useState(null); // 현재 로그인한 유저 정보
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [showPendingModal, setShowPendingModal] = useState(false); // 대기자 모달 표시 여부
    const [showJoinModal, setShowJoinModal] = useState(false); // 참가 신청 모달 상태 추가

    // 현재 사용자 기준 상태 판단 (방장/참가자/대기자/모집마감 여부 등)
    const { isHost, isParticipant, isFull } = useMatchStatus(
        group,
        currentUser,
        participants,
        pendingParticipants
    );

    // 서버에서 그룹 및 참가자 데이터 불러오는 함수
    const fetchGroupData = async () => {
        try {
            const user = await getCurrentUser(); // 현재 로그인한 사용자
            const groupData = await getMatchGroupById(matchGroupId); // 그룹 정보
            const allParticipants = await getParticipantsByGroupId(matchGroupId); // 전체 참가자 목록

            setCurrentUser(user);
            setGroup(groupData);
            setParticipants(allParticipants.filter((p) => p.status === "approved"));
            setPendingParticipants(allParticipants.filter((p) => p.status === "pending"));
        } catch (error) {
            console.error("데이터 로딩 오류:", error);
        } finally {
            setLoading(false);
        }
    };

    // 초기 로딩 및 5초마다 데이터 자동 갱신
    useEffect(() => {
        fetchGroupData(); // 최초 데이터 호출
        const interval = setInterval(fetchGroupData, 5000); // 실시간 업데이트
        return () => clearInterval(interval); // 언마운트 시 인터벌 제거
    }, [groupId]);

    // 참가 관련 핸들러 함수 모음
    const {
        handleJoin,
        handleLeave,
        handleApprove,
        handleReject,
        handleRemoveParticipant,
        handleCloseGroup,
        handleDeleteGroup,
    } = useMatchGroupActions(group, currentUser, fetchGroupData, participants, setParticipants);

    // 모달 내 실제 참가 신청 처리
    const handleConfirmJoin = async () => {
        await handleJoin();
        setShowJoinModal(false);
    };

    // 로딩/에러 상태 처리
    if (loading) return <p className="text-center">⏳ 로딩 중...</p>;
    if (!group) return <p className="text-center text-red-500">❌ 그룹 정보를 불러올 수 없습니다.</p>;

    // 메인 화면 랜더링
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            {/* 🧾 그룹 정보 출력 */}
            <h1 className="text-2xl font-bold mb-4">{group.name}</h1>
            <p className="text-gray-600 mb-2">{group.description}</p>
            <p className="text-gray-500">📍 장소: {group.location}</p>
            <p className="text-gray-500">
                ⏰ 일정: {new Date(group.dateTime).toLocaleDateString()} {new Date(group.dateTime).toLocaleTimeString()}
            </p>
            <p className="text-gray-500">
                👥 모집 현황: {group.currentParticipants}/{group.maxParticipants}명
            </p>
            <p className="text-sm font-bold text-blue-500">⭐ 방장: {group.hostUsername}</p>

            {/* 참가자 상태에 따른 버튼 표시 */}
            {!isParticipant ? (
                <button
                    onClick={() => setShowJoinModal(true)} // 모달 띄우기
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

            {/* 방장 전용 기능 버튼 (모집 종료/삭제/대기자 모달) */}
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

            {/* 승인된 참가자 목록 */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold">👥 참가자 목록</h2>
                {participants.length === 0 ? (
                    <p className="text-gray-500">아직 참가자가 없습니다.</p>
                ) : (
                    <ul className="mt-2 space-y-2">
                        {participants.map((participant) => (
                            <li
                                key={participant.username}
                                className="flex justify-between items-center bg-gray-100 p-2 rounded"
                            >
                                <span>{participant.username}</span>
                                {isHost && participant.username !== currentUser?.username && (
                                    <button
                                        onClick={() => handleRemoveParticipant(participant.username)}
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

            {/* 참가 신청 대기자 모달 */}
            <PendingParticipantModal
                isOpen={showPendingModal}
                onClose={() => setShowPendingModal(false)}
                pendingParticipants={pendingParticipants}
                onApprove={handleApprove}
                onReject={handleReject}
            />

            {/* 참가 신청 확인 모달 */}
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