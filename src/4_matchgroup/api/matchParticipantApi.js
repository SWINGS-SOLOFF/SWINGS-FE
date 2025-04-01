import axios from "axios";

const BASE_URL = "http://localhost:8090/swings/matchgroup";

// 특정 그룹의 참가자 목록 가져오기
export const getParticipantsByGroupId = async (matchGroupId) => {
  try {
      const response = await axios.get(`${BASE_URL}/${matchGroupId}/participants`);
      return response.data;
  } catch (error) {
      console.error("참가자 목록을 불러오는 중 오류 발생:", error);
      return [];
  }
};

// 특정 그룹에 참가 신청하기
export const joinMatch = async (matchGroupId, username) => {
    try {
        const response = await axios.post(`${BASE_URL}/${matchGroupId}/join`, { username });
        return response.data;
    } catch (error) {
        console.error("참가 신청 중 오류 발생:", error);
        throw error;
    }
};

// 특정 그룹에서 참가 취소하기
export const leaveMatch = async (matchGroupId, username) => {
    try {
        const response = await axios.post(`${BASE_URL}/${matchGroupId}/leave`, { username });
        return response.data;
    } catch (error) {
        console.error("참가 취소 중 오류 발생:", error);
        throw error;
    }
};

// 특정 그룹에서 참가자 강제퇴장
export const removeParticipant = async (matchGroupId, username) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${matchGroupId}/remove`, { data: { username } });
        return response.data;
    } catch (error) {
        console.error("참가자 강제 제거 중 오류 발생:", error);
        throw error;
    }
};

// 참가자 승인(대기 목록 -> 승인)
export const approveParticipant = async (matchGroupId, username) => {
    try {
        const response = await axios.post(`${BASE_URL}/${matchGroupId}/approve`, { username });
        return response.data;
    } catch (error) {
        console.error("참가자 승인 중 오류 발생:", error);
        throw error;
    }
};

// 참가자 거절(대기 목록 -> 거절)
export const rejectParticipant = async (matchGroupId, username) => {
    try {
        const response = await axios.post(`${BASE_URL}/${matchGroupId}/reject`, { username });
        return response.data;
    } catch (error) {
        console.error("참가자 거절 중 오류 발생:", error);
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