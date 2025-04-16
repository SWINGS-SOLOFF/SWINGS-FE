import axiosInstance from "../../1_user/api/axiosInstance.js";

// 그룹 생성 API
export const createMatchGroup = async (groupData) => {
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
            ? `/matchgroup/list?matchType=${category}`
            : `/matchgroup/list`;

        const response = await axiosInstance.get(url);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("그룹 목록 불러오기 오류:", error);
        return [];
    }
};

// 특정 그룹 조회
export const getMatchGroupById = async (matchGroupId) => {
    try {
        const response = await axiosInstance.get(`/matchgroup/${matchGroupId}`);
        return response.data;
    } catch (error) {
        console.error(`그룹(${matchGroupId}) 조회 중 오류 발생:`, error);
        throw error;
    }
};

// 근처 그룹 조회
export const fetchNearbyGroups = async (latitude, longitude, radiusInKm = 5) => {
    try {
        const response = await axiosInstance.get("/matchgroup/nearby", {
            params: { latitude, longitude, radiusInKm },
        });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("근처 그룹 조회 중 오류 발생:", error);
        return [];
    }
};

// 현재 로그인한 사용자 정보 가져오기
export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get("/users/me");
        return response.data;
    } catch (error) {
        console.error("사용자 정보 가져오기 오류:", error);
        throw error;
    }
};