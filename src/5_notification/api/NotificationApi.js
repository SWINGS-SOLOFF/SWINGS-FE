import axiosInstance from "../../1_user/api/axiosInstance.js";

// 전체 알림 조회
export const getAllNotifications = async (receiver) => {
    try {
        const response = await axiosInstance.get(`/notification/list`, {
            params: { receiver },
        });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("알림 목록 불러오기 실패:", error);
        return [];
    }
};

// 알림 읽음 처리
export const markAsRead = async (notificationId) => {
    try {
        await axiosInstance.put(`/notification/read/${notificationId}`);
    } catch (error) {
        console.error("읽음 처리 실패:", error);
    }
};

// 알림 삭제
export const deleteNotification = async (notificationId) => {
    try {
        await axiosInstance.delete(`/notification/delete/${notificationId}`);
    } catch (error) {
        console.error("알림 삭제 실패:", error);
    }
};