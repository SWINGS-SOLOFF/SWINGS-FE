import axiosInstance from "../../1_user/api/axiosInstance.js";

export const getChatMessagesByGroupId = async (matchGroupId) => {
    try {
        const response = await axiosInstance.get(`/matchgroupchat/${matchGroupId}`);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("채팅 메시지 불러오기 오류:", error);
        return [];
    }
};