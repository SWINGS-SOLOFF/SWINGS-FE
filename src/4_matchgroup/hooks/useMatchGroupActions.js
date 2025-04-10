import {
    joinMatch,
    leaveMatch,
    approveParticipant,
    rejectParticipant,
    removeParticipant,
    closeMatchGroup,
    deleteMatchGroup,
} from "../api/matchParticipantApi";
import { useNavigate } from "react-router-dom";

const useMatchGroupActions = (
    group = null,
    currentUser = null,
    reload,
    participants = [],
    setParticipants
) => {
    const navigate = useNavigate();

    // 1. 참가 신청
    const handleJoin = async (matchGroupId = group?.matchGroupId, userId = currentUser?.userId) => {
        try {
            await joinMatch(matchGroupId, userId);
            alert("✅ 참가 신청이 완료되었습니다.");
            reload?.();
        } catch (error) {
            console.error("참가 신청 실패:", error);
            alert("❌ 참가 신청 중 오류가 발생했습니다.");
        }
    };

    // 2. 참가 취소
    const handleLeave = async (matchGroupId = group?.matchGroupId, userId = currentUser?.userId) => {
        try {
            await leaveMatch(matchGroupId, userId);
            alert("❎ 참가를 취소하였습니다.");
            reload?.();
        } catch (error) {
            console.error("참가 취소 실패:", error);
            alert("❌ 참가 취소 중 오류가 발생했습니다.");
        }
    };

    // 3. 승인
    const handleApprove = async (matchGroupId = group?.matchGroupId, matchParticipantId, hostId = currentUser?.userId) => {
        try {
            await approveParticipant(matchGroupId, matchParticipantId, hostId);
            alert("✅ 참가자를 승인하였습니다.");
            reload?.();
        } catch (error) {
            console.error("승인 실패:", error);
            alert("❌ 승인 중 오류가 발생했습니다.");
        }
    };

    // 4. 거절
    const handleReject = async (matchGroupId = group?.matchGroupId, matchParticipantId, hostId = currentUser?.userId) => {
        try {
            await rejectParticipant(matchGroupId, matchParticipantId, hostId);
            alert("❌ 참가자를 거절하였습니다.");
            reload?.();
        } catch (error) {
            console.error("거절 실패:", error);
            alert("❌ 거절 중 오류가 발생했습니다.");
        }
    };

    // 5. 강퇴
    const handleRemoveParticipant = async (matchGroupId = group?.matchGroupId, targetUserId, hostId = currentUser?.userId) => {
        try {
            await removeParticipant(matchGroupId, targetUserId, hostId);
            alert("🚫 사용자를 강퇴하였습니다.");
            setParticipants?.(participants.filter((p) => p.userId !== targetUserId));
        } catch (error) {
            console.error("강퇴 실패:", error);
            alert("❌ 강퇴 중 오류가 발생했습니다.");
        }
    };

    return {
        handleJoin,
        handleLeave,
        handleApprove,
        handleReject,
        handleRemoveParticipant,
    };
};

export default useMatchGroupActions;
