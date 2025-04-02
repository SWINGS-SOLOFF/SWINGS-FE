import axios from 'axios';

const API_BASE = 'http://localhost:8090/swings';

const feedApi = {
    // 피드 가져오기 (전체 피드) - 페이지네이션 파라미터 추가
    getFeeds: async (userId, page, size = 10) => {
        const response = await axios.get(`${API_BASE}/feeds`, {
            params: { userId, page, size }
        });
        return response.data;
    },

    // 사용자 피드 가져오기
    getUserFeeds: async (userId) => {
        const response = await axios.get(`${API_BASE}/feeds/user/${userId}`);
        return response.data;
    },

    // 댓글 가져오기
    getCommentsByFeedId: async (feedId) => {
        const response = await axios.get(`${API_BASE}/feeds/${feedId}/comments`);
        return response.data;
    },

    // 피드 올리기
    uploadFeed: async (formData) => {
        const response = await axios.post(`${API_BASE}/feeds/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // 피드 삭제하기
    deleteFeed: async (feedId) => {
        await axios.delete(`${API_BASE}/feeds/${feedId}`);
    },

    // 피드 좋아요 누르기 - 수정: params를 body에서 URL 파라미터로 변경
    likeFeed: async (feedId, userId) => {
        const response = await axios.put(`${API_BASE}/feeds/${feedId}/like?userId=${userId}`);
        return response.data;
    },

    // 피드 좋아요 취소 - 수정: params를 URL 파라미터로 변경
    unlikeFeed: async (feedId, userId) => {
        const response = await axios.put(`${API_BASE}/feeds/${feedId}/unlike?userId=${userId}`);
        return response.data;
    },

    // 댓글 남기기
    addComment: async (feedId, userId, content) => {
        const response = await axios.post(`${API_BASE}/feeds/${feedId}/comments?userId=${userId}&content=${encodeURIComponent(content)}`);
        return response.data;
    },

    // 댓글 지우기
    deleteComment: async (feedId, commentId) => {
        await axios.delete(`${API_BASE}/feeds/${feedId}/comments/${commentId}`);
    },

    // 좋아요한 사용자 목록 가져오기
    getLikedUsers: async (feedId) => {
        const response = await axios.get(`${API_BASE}/feeds/${feedId}/liked-users`);
        return response.data;
    }
};

export default feedApi;