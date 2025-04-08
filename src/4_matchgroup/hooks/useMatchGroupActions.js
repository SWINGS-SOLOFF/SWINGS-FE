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
    group,
    currentUser,
    reload,
    participants,
    setParticipants
) => {
    const navigate = useNavigate();

    // 1. 참가 신청
    const handleJoin = async () => {
        console.log("✅ matchGroupId:", group?.matchGroupId);
        console.log("✅ username:", currentUser?.username);

        try {
                await joinMatch(group.matchGroupId, currentUser.username);
            alert("✅ 참가 신청이 완료되었습니다.");
            reload();
        } catch (error) {
            console.error("참가 신청 실패:", error);
            alert("❌ 참가 신청 중 오류가 발생했습니다.");
        }
    };

    // 2. 참가 취소
    const handleLeave = async () => {
        try {
            await leaveMatch(group.id, currentUser.username);
            alert("❎ 참가를 취소하였습니다.");
            reload();
        } catch (error) {
            console.error("참가 취소 실패:", error);
            alert("❌ 참가 취소 중 오류가 발생했습니다.");
        }
    };

    // 3. 참가 승인
    const handleApprove = async (username) => {
        try {
            await approveParticipant(group.id, username);
            alert(`✅ ${username} 님을 승인하였습니다.`);
            reload();
        } catch (error) {
            console.error("승인 실패:", error);
            alert("❌ 승인 중 오류가 발생했습니다.");
        }
    };

    // 4. 참가 거절
    const handleReject = async (username) => {
        try {
            await rejectParticipant(group.id, username);
            alert(`❌ ${username} 님을 거절하였습니다.`);
            reload();
        } catch (error) {
            console.error("거절 실패:", error);
            alert("❌ 거절 중 오류가 발생했습니다.");
        }
    };

    // 5. 참가자 강퇴
    const handleRemoveParticipant = async (username) => {
        try {
            await removeParticipant(group.id, username);
            alert(`🚫 ${username} 님을 강퇴하였습니다.`);
            setParticipants(participants.filter((p) => p.username !== username));
        } catch (error) {
            console.error("강퇴 실패:", error);
            alert("❌ 강퇴 중 오류가 발생했습니다.");
        }
    };

    // 6. 모집 종료
    const handleCloseGroup = async () => {
        try {
            await closeMatchGroup(group.id);
            alert("📌 모집을 종료했습니다.");
            reload();
        } catch (error) {
            console.error("모집 종료 실패:", error);
            alert("❌ 모집 종료 중 오류가 발생했습니다.");
        }
    };

    // 7. 그룹 삭제
    const handleDeleteGroup = async () => {
        if (!window.confirm("정말로 그룹을 삭제하시겠습니까?")) return;
        try {
            await deleteMatchGroup(group.id);
            alert("🗑️ 그룹이 삭제되었습니다.");
            navigate("/matchgroup");
        } catch (error) {
            console.error("삭제 실패:", error);
            alert("❌ 그룹 삭제 중 오류가 발생했습니다.");
        }
    };

    return {
        handleJoin,
        handleLeave,
        handleApprove,
        handleReject,
        handleRemoveParticipant,
        handleCloseGroup,
        handleDeleteGroup,
    };
};

export default useMatchGroupActions;
