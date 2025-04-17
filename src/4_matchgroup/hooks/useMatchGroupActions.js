import {
    joinMatch,
    leaveMatch,
    leaveAcceptedGroup,
    approveParticipant,
    rejectParticipant,
    removeParticipant,
    canUserJoinGroup,
} from "../api/matchParticipantApi";
import { deleteMatchGroup, updateGroupStatus } from "../api/matchGroupApi";
import { useNavigate } from "react-router-dom";

const useMatchGroupActions = (matchGroupId, currentUser) => {
    const navigate = useNavigate();

    // 참가 신청
    const handleJoin = async (groupId = matchGroupId, userId = currentUser?.userId) => {
        const canJoin = await canUserJoinGroup(groupId, userId);
        if (!canJoin) {
            alert("참가할 수 없는 그룹입니다. 정원이 가득 찼거나 성비 제한 또는 모집 종료 상태입니다.");
            throw new Error("참가 불가");
        }

        return await joinMatch(groupId, userId);
    };

    // 참가 신청 취소
    const handleLeave = async (groupId = matchGroupId, userId = currentUser?.userId) => {
        return await leaveMatch(groupId, userId);
    };

    // 확정 참가자가 방 나가기 (방장이라면 그룹 삭제 포함)
    const handleLeaveAccepted = async (groupId = matchGroupId, userId = currentUser?.userId) => {
        return await leaveAcceptedGroup(groupId, userId);
    };

    // 참가 승인
    const handleApprove = async (groupId, participantId, hostId = currentUser?.userId) => {
        return await approveParticipant(groupId, participantId, hostId);
    };

    // 참가 거절
    const handleReject = async (groupId, participantId, hostId = currentUser?.userId) => {
        return await rejectParticipant(groupId, participantId, hostId);
    };

    // 강퇴
    const handleKick = async (groupId, userId, hostId = currentUser?.userId) => {
        return await removeParticipant(groupId, userId, hostId);
    };

    // 모집 종료 or 재개
    const handleCloseRecruitment = async (groupId, closed = true) => {
        return await updateGroupStatus(groupId, closed);
    };

    // 그룹 삭제
    const handleDeleteGroup = async (groupId, userId = currentUser?.userId) => {
        return await deleteMatchGroup(groupId, userId);
    };

    return {
        handleJoin,
        handleLeave,
        handleLeaveAccepted,
        handleApprove,
        handleReject,
        handleKick,
        handleCloseRecruitment,
        handleDeleteGroup,
    };
};

export default useMatchGroupActions;