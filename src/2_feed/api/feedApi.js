// src/api/feedApi.js
import axios from 'axios';

const API_BASE = 'http://localhost:8090/swings';

const feedApi = {
    // 피드 가져오기 (전체 피드)
    getFeeds: async () => {
        const response = await axios.get(`${API_BASE}/feeds`);
        return response.data;
    },

    // **사용자 피드 가져오기**
    getUserFeeds: async (userId) => {
        const response = await axios.get(`${API_BASE}/social/feeds/user/${userId}`);
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

    // 피드 좋아요 누르기
    likeFeed: async (feedId) => {
        const response = await axios.put(`${API_BASE}/feeds/${feedId}/like`);
        return response.data;
    },

    // 피드 좋아요 취소
    unlikeFeed: async (feedId) => {
        const response = await axios.put(`${API_BASE}/feeds/${feedId}/unlike`);
        return response.data;
    },

    // 댓글 남기기
    addComment: async (feedId, userId, content) => {
        const response = await axios.post(`${API_BASE}/feeds/${feedId}/comments`, null, {
            params: { userId, content }
        });
        return response.data;
    },

    // 댓글 지우기
    deleteComment: async (feedId, commentId) => {
        await axios.delete(`${API_BASE}/feeds/${feedId}/comments/${commentId}`);
    }
};

// feedApi 객체를 default로 export
export default feedApi;
