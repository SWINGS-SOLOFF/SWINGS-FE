import axios from "axios";

const BASE_URL = "http://localhost:8090/swings/matchgroup";

// 특정 그룹의 참가자 목록 가져오기
export const getParticipantsByGroupId = async (groupId) => {
  try {
      const response = await axios.get(`${BASE_URL}/${groupId}/participants`);
      return response.data;
  } catch (error) {
      console.error("참가자 목록을 불러오는 중 오류 발생:", error);
      return [];
  }
};

// 특정 그룹에 참가 신청하기
export  const joinMatch = async (groupId, username) => {
    try {
        const response = await axios.post(`${BASE_URL}/${groupId}/join`, { username });
        return response.data;
    } catch (error) {
        console.error("참가 신청 중 오류 발생:", error);ㅇ
        throw error;
    }
};