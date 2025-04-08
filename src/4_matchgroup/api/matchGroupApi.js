import axiosInstance from "../../1_user/api/axiosInstance.js";

const BASE_URL = "http://localhost:8090/swings/matchgroup";
const USERS_API_URL = "http://localhost:8090/swings/users";

// 그룹 생성 API
export const createMatchGroup = async (groupData) => {
    console.log("axiosInstance 확인:", typeof axiosInstance, Object.keys(axiosInstance));

    try {
        const response = await axiosInstance.post("/matchgroup/create", groupData);
        return response.data;
    } catch (error) {
        console.error("그룹 생성 중 오류 발생:", error);
        throw error;
    }
};

// 모든 그룹 조회
export const getAllMatchGroups = async (category = "") => {
    try {
        const url = category
            ? `${BASE_URL}/list?matchType=${category}`
            : `${BASE_URL}/list`;

        const response = await axiosInstance.get(url); // 👈 여기서도 axiosInstance 사용 추천
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("그룹 목록 불러오기 오류:", error);
        return [];
    }
};

// 특정 그룹 조회
export const getMatchGroupById = async (matchGroupId) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/${matchGroupId}`);
        return response.data;
    } catch (error) {
        console.error(`그룹(${matchGroupId}) 조회 중 오류 발생:`, error);
        throw error;
    }
};

// 현재 로그인한 사용자 정보 가져오기
export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get(`${USERS_API_URL}/me`);
        return response.data;
    } catch (error) {
        console.error("사용자 정보 가져오기 오류:", error);
        throw error;
    }
};