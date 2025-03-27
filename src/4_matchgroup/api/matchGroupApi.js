import axios from "axios";

const BASE_URL = "http://localhost:8090/swings/matchgroup"
const API_URL = "http://localhost:8090/swings/user";

    // 그룹 생성 API
    export const createMatchGroup = async (groupData) => {
            const response = await axios.post(`${BASE_URL}/create`, groupData);
            return response.data;
    };

    // 모든 그룹 조회 API
    export const getAllMatchGroups = async () => {
        const response = await axios.get(`${BASE_URL}/list`);
        console.log("API 응답:", response)
        return response.data;
    };

    // 특정 그룹 조회 API
    export const getMatchGroupById = async (groupId) => {
        const response = await axios.get(`${BASE_URL}/${groupId}`);
        return response.data;
    };

    // 현재 로그인한 사용자 정보 가져오기
    export const getCurrentUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error("사용자 정보를 가져오는 중 오류 발생:", error);
            throw error;
        }
    };