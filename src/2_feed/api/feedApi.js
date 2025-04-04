import axios from "../../1_user/api/axiosInstance";

const API_BASE = 'http://localhost:8090/swings';
const USER_API_BASE = 'http://localhost:8090/swings/users';

const feedApi = {

    // 필터 및 정렬 적용된 피드 가져오기
    getFeeds: async (userId, page, size = 10, options = { sort: 'latest', filter: 'all' }) => {
        const params = {
            page,
            size,
            sort: options.sort,
            filter: options.filter
        };
        if (userId !== null && userId !== undefined) {
            params.userId = userId;
        }
        const response = await axios.get(`${API_BASE}/feeds/filtered`, { params });
        return response.data;
    },

    // 특정 사용자 피드
    getUserFeeds: async (userId) => {
        const response = await axios.get(`${API_BASE}/feeds/user/${userId}`, {
            params: { sort: 'createdAt,desc' }
        });
        return response.data;
    },

    // 댓글 목록
    getCommentsByFeedId: async (feedId) => {
        const response = await axios.get(`${API_BASE}/feeds/${feedId}/comments`, {
            params: { sort: 'createdAt,desc' } 
        });
        return response.data;
    },

    // 피드 업로드
    uploadFeed: async (formData) => {
        const response = await axios.post(`${API_BASE}/feeds/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // 피드 삭제
    deleteFeed: async (feedId) => {
        await axios.delete(`${API_BASE}/feeds/${feedId}`);
    },

    // 좋아요 - 로그인 사용자만 허용
    likeFeed: async (feedId, userId) => {
        if (!userId) throw new Error("로그인이 필요합니다.");
        const response = await axios.put(`${API_BASE}/feeds/${feedId}/like`, null, {
            params: { userId }
        });
        return response.data;
    },

    // 좋아요 취소
    unlikeFeed: async (feedId, userId) => {
        if (!userId) throw new Error("로그인이 필요합니다.");
        const response = await axios.put(`${API_BASE}/feeds/${feedId}/unlike`, null, {
            params: { userId }
        });
        return response.data;
    },

    // 댓글 작성
    addComment: async (feedId, userId, content) => {
        if (!userId) throw new Error("로그인이 필요합니다.");
        const response = await axios.post(`${API_BASE}/feeds/${feedId}/comments`, null, {
            params: { userId, content }
        });
        return response.data;
    },

    // 댓글 삭제
    deleteComment: async (feedId, commentId) => {
        await axios.delete(`${API_BASE}/feeds/${feedId}/comments/${commentId}`);
    },

    // 좋아요한 사용자 목록
    getLikedUsers: async (feedId) => {
        const response = await axios.get(`${API_BASE}/feeds/${feedId}/liked-users`);
        return response.data;
    },

    // 로그인 사용자 정보 조회
    getCurrentUser: async () => {
        const response = await axios.get(`${USER_API_BASE}/me`);
        return response.data;
    }
};

export default feedApi;
