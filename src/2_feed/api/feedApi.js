import axios from "../../1_user/api/axiosInstance";

const API_BASE = "http://localhost:8090/swings";
const USER_API_BASE = "http://localhost:8090/swings/users";

const feedApi = {
  getFeeds: async (
    userId,
    page,
    size = 10,
    options = { sort: "latest", filter: "all" }
  ) => {
    const params = {
      page,
      size,
      sort: options.sort,
      filter: options.filter,
      userId,
    };
    const response = await axios.get(`${API_BASE}/feeds/filtered`, { params });
    return response.data;
  },

  getUserFeeds: async (userId) => {
    const response = await axios.get(`${API_BASE}/feeds/user/${userId}`);
    return response.data;
  },

  uploadFeed: async (formData) => {
    const response = await axios.post(`${API_BASE}/feeds/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateFeed: async (feedId, { caption, file }) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (file) {
      formData.append("file", file);
    }

    const response = await axios.put(`${API_BASE}/feeds/${feedId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  getMainFeeds: async (userId) => {
    const response = await axios.get(`${API_BASE}/feeds/main`, {
      params: { userId },
    });
    return response.data;
  },

  // 피드 삭제
  deleteFeed: async (feedId) => {
    try {
      const response = await axios.delete(`${API_BASE}/feeds/${feedId}`);
      if (![200, 204].includes(response.status)) {
        console.warn("❌ 예상치 못한 응답 상태 코드:", response.status);
        throw new Error("삭제 실패: 서버 응답 이상");
      }
      console.log("✅ 삭제 성공:", feedId);
      return response;
    } catch (err) {
      console.error("❌ 삭제 중 에러 발생:", err.response?.data || err.message);
      throw err;
    }
  },

  // 좋아요 - 로그인 사용자만 허용
  likeFeed: async (feedId, userId) => {
    if (!userId) throw new Error("로그인이 필요합니다.");
    const response = await axios.put(`${API_BASE}/feeds/${feedId}/like`, null, {
      params: { userId },
    });
    return response.data;
  },

  // 좋아요 취소
  unlikeFeed: async (feedId, userId) => {
    if (!userId) throw new Error("로그인이 필요합니다.");
    const response = await axios.put(
      `${API_BASE}/feeds/${feedId}/unlike`,
      null,
      {
        params: { userId },
      }
    );
    return response.data;
  },

  // 댓글 작성
  addComment: async (feedId, userId, content) => {
    if (!userId) throw new Error("로그인이 필요합니다.");
    try {
      const response = await axios.post(
        `${API_BASE}/feeds/${feedId}/comments`,
        null,
        {
          params: { userId, content },
        }
      );
      return response.data;
    } catch (error) {
      console.error("댓글 추가 실패:", error);
      throw error;
    }
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
  },
};

export default feedApi;
