import axios from "axios";

// 백앤드 API 경로
const BASE_URL = "http://localhost:8090/swings/matchgroup"
const API_URL = "http://localhost:8090/swings/user";


    // 그룹 생성 API
    export const createMatchGroup = async (groupData) => {
        try {
            const response = await axios.post(`${BASE_URL}/create`, groupData);
            return response.data;
        } catch (error) {
            console.error("그룹 생성 중 오류 발생:", error);
            throw error;
        }
    };

    // 모든 그룹 조회 API
    export const getAllMatchGroups = async (category = "") => {
        try {
            const url = category
                ? `${BASE_URL}/list?matchType=${category}`
                : `${BASE_URL}/list`;
            const response = await axios.get(url);

            console.log("✅ 그룹 목록 API 응답:", response.data);

            if (!Array.isArray(response.data)) {
                console.error("❌ 배열 형식이 아닙니다:", response.data);
                return [];
            }

            return response.data;
        } catch (error) {
            console.error("❌ 그룹 목록 불러오기 오류:", error);
            return [];
        }
    };

    // 특정 그룹 조회 API
    export const getMatchGroupById = async (matchGroupId) => {
        try {
            const response = await axios.get(`${BASE_URL}/${matchGroupId}`);
            return response.data;
        } catch (error) {
            console.error(`❌ 그룹(${matchGroupId}) 조회 중 오류 발생:`, error);
            throw error;
        }
    };

    // 현재 로그인한 사용자 정보 가져오기
    export const getCurrentUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error("❌ 사용자 정보 가져오기 오류:", error);
            throw error;
        }
    };