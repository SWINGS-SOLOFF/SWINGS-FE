import axios from "axios";

const API_URL = "http://localhost:8090/swings/auth"; // 백엔드 API URL 확인 필요

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

// 로그인 요청
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("로그인 오류:", error);
        throw error;
    }
};

// 로그아웃 요청
export const logout = async () => {
    try {
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (error) {
        console.error("로그아웃 오류:", error);
        throw error;
    }
};