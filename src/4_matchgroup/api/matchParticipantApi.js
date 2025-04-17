import axiosInstance from "../../1_user/api/axiosInstance.js";

// 확정 참가자 목록 조회
export const getAcceptedParticipants = async (matchGroupId) => {
    try {
        const response = await axiosInstance.get(`/matchParticipant/accepted/${matchGroupId}`);
        return response.data;
    } catch (error) {
        console.error("확정 참가자 목록 불러오기 실패:", error);
        return [];
    }
};

// 대기자(PENDING) 목록 조회
export const getPendingParticipants = async (matchGroupId) => {
    try {
        const response = await axiosInstance.get(`/matchParticipant/pending/${matchGroupId}`);
        return response.data;
    } catch (error) {
        console.error("대기자 목록 불러오기 실패:", error);
        return [];
    }
};

// 참가 신청
export const joinMatch = async (matchGroupId, userId) => {
    try {
        const response = await axiosInstance.post(`/matchParticipant/join`, {
            matchGroupId,
            userId,
        });
        return response.data;
    } catch (error) {
        console.error("참가 신청 중 오류 발생:", error);
        throw error;
    }
};

// 참가 신청 취소 (PENDING 상태만)
export const leaveMatch = async (matchGroupId, userId) => {
    try {
        const response = await axiosInstance.post(`/matchParticipant/leave`, {
            matchGroupId,
            userId,
        });
        return response.data;
    } catch (error) {
        console.error("참가 취소 중 오류 발생:", error);
        throw error;
    }
};

// 확정 참가자 나가기 (방장일 경우 그룹 삭제 처리됨)
export const leaveAcceptedGroup = async (matchGroupId, userId) => {
    try {
        const response = await axiosInstance.post(`/matchParticipant/leave/accepted`, {
            matchGroupId,
            userId,
        });
        return response.data;
    } catch (error) {
        console.error("확정 참가자 나가기 중 오류:", error);
        throw error;
    }
};

// 참가자 강퇴 (방장만 가능)
export const removeParticipant = async (matchGroupId, userId, hostId) => {
    try {
        const response = await axiosInstance.delete(`/matchParticipant/remove`, {
            data: { matchGroupId, userId, hostId },
        });
        return response.data;
    } catch (error) {
        console.error("강퇴 중 오류 발생:", error);
        throw error;
    }
};

// 참가 승인
export const approveParticipant = async (matchGroupId, matchParticipantId, hostId) => {
    try {
        const response = await axiosInstance.post(`/matchParticipant/approve`, {
            matchGroupId,
            matchParticipantId,
            userId: hostId,
        });
        return response.data;
    } catch (error) {
        console.error("참가 승인 중 오류:", error);
        throw error;
    }
};

// 참가 거절
export const rejectParticipant = async (matchGroupId, matchParticipantId, hostId) => {
    try {
        const response = await axiosInstance.post(`/matchParticipant/reject`, {
            matchGroupId,
            matchParticipantId,
            userId: hostId,
        });
        return response.data;
    } catch (error) {
        console.error("참가 거절 중 오류 발생:", error);
        throw error;
    }
};

// 확정된 인원 수 조회 (UI 성비 제한 판단용)
export const getAcceptedCount = async (matchGroupId) => {
    try {
        const response = await axiosInstance.get(`/matchParticipant/accepted/count/${matchGroupId}`);
        return response.data;
    } catch (error) {
        console.error("확정 인원 수 조회 실패:", error);
        return 0;
    }
};

// 참가 가능 여부 확인 (정원 초과/성비 제한/모집 종료 포함)
export const canUserJoinGroup = async (matchGroupId, userId) => {
    try {
        const response = await axiosInstance.get(`/matchParticipant/check/${matchGroupId}/${userId}`);
        return response.data; // true | false
    } catch (error) {
        console.error("참가 가능 여부 확인 중 오류 발생:", error);
        return false;
    }
};