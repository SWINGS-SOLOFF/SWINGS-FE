import axiosInstance from "../../1_user/api/axiosInstance.js";

// 그룹 생성
export const createMatchGroup = async (groupData) => {
    try {
        const response = await axiosInstance.post("/matchgroup/create", groupData);
        return response.data;
    } catch (error) {
        console.error("그룹 생성 중 오류 발생:", error);
        throw error;
    }
};

// 전체 그룹 조회 (카테고리 필터 optional)
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

// 방장 그룹 조회
export const getGroupsByHostId = async (hostId) => {
    try {
        const response = await axiosInstance.get(`/matchgroup/host/${hostId}`);
        return response.data;
    } catch (error) {
        console.error("방장이 만든 그룹 조회 중 오류 발생:", error);
        return [];
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

// 현재 로그인한 사용자 정보
export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get("/users/me");
        return response.data;
    } catch (error) {
        console.error("사용자 정보 가져오기 오류:", error);
        throw error;
    }
};

// 모집 상태 변경 (모집 종료 / 재개)
export const updateGroupStatus = async (matchGroupId, closed) => {
    try {
        const response = await axiosInstance.patch(
            `/matchgroup/${matchGroupId}/status`,
            null,
            { params: { closed } }
        );
        return response.data;
    } catch (error) {
        console.error("모집 상태 변경 중 오류:", error);
        throw error;
    }
};

// 그룹 삭제 (방장 전용)
export const deleteMatchGroup = async (matchGroupId, userId) => {
    try {
        const response = await axiosInstance.delete(`/matchgroup/${matchGroupId}`, {
            params: { userId },
        });
        return response.data;
    } catch (error) {
        console.error("그룹 삭제 중 오류 발생:", error);
        throw error;
    }
};