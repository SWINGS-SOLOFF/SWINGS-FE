import axiosInstance from "../../1_user/api/axiosInstance.js";

const BASE_URL = "http://localhost:8090/swings/notification";

// 전체 알림 조회
export const getAllNotifications = async (receiver) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/list`, {
            params: { receiver }
        });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("❌ 알림 목록 불러오기 실패:", error);
        return [];
    }
};

// 알림 읽음 처리
export const markAsRead = async (notificationId) => {
    try {
        await axiosInstance.put(`${BASE_URL}/read/${notificationId}`);
    } catch (error) {
        console.error("읽음 처리 실패:", error);
    }
};

// 알림 삭제
export const deleteNotification = async (notificationId) => {
    try {
        await axiosInstance.delete(`${BASE_URL}/delete/${notificationId}`);
    } catch (error) {
        console.error("알림 삭제 실패:", error);
    }
};