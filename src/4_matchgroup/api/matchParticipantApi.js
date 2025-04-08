import axios from "axios";

const BASE_URL = "http://localhost:8090/swings/matchParticipant";

// 참가자 목록
export const getParticipantsByGroupId = async (matchGroupId) => {
  try {
      const response = await axios.get(`${BASE_URL}/list/${matchGroupId}`);
      return response.data;
  } catch (error) {
      console.error("참가자 목록을 불러오는 중 오류 발생:", error);
      return [];
  }
};

// 참가 신청
export const joinMatch = async (matchGroupId, userId) => {
    try {
        const response = await axios.post(`${BASE_URL}/join`, {
            matchGroupId,
            userId,
        });
        return response.data;
    } catch (error) {
        console.error("참가 신청 중 오류 발생:", error);
        throw error;
    }
};


// 참가 취소
export const leaveMatch = async (matchGroupId, userId) => {
    try {
        const response = await axios.post(`${BASE_URL}/leave`, {
            matchGroupId,
            userId,
        });
        return response.data;
    } catch (error) {
        console.error("참가 취소 중 오류 발생:", error);
        throw error;
    }
};

// 참가자 강퇴
export const removeParticipant = async (matchGroupId, userId, hostId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/remove`, {
            data: {
                matchGroupId,
                userId,
                hostId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("강퇴 중 오류 발생:", error);
        throw error;
    }
};

// 참가자 승인(대기 목록 -> 승인)
export const approveParticipant = async (matchGroupId, matchParticipantId, hostId) => {
    try {
        const response = await axios.post(`${BASE_URL}/approve`, {
            matchGroupId,
            matchParticipantId,
            userId: hostId,
        });
        return response.data;
    } catch (error) {
        console.error("승인 중 오류:", error);
        throw error;
    }
};

// 참가자 거절(대기 목록 -> 거절)
export const rejectParticipant = async (matchGroupId, matchParticipantId, hostId) => {
    try {
        const response = await axios.post(`${BASE_URL}/reject`, {
            matchGroupId,
            matchParticipantId,
            userId: hostId,
        });
        return response.data;
    } catch (error) {
        console.error("거절 중 오류 발생:", error);
        throw error;
    }
};

// 모집 종료
export const closeMatchGroup = async (matchGroupId) => {
    try {
        const response = await axios.post(`${BASE_URL}/${matchGroupId}/close`);
        return response.data;
    } catch (error) {
        console.error("모집 종료 중 오류 발생:", error);
        throw error;
    }
};

// 그룹 삭제
export const deleteMatchGroup = async (matchGroupId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${matchGroupId}`);
        return response.data;
    } catch (error) {
        console.error("그룹 삭제 중 오류 발생:", error);
        throw error;
    }
};