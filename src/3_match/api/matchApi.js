//  matchApi.js (최종 수정본)
import axios from "../../1_user/api/axiosInstance";

/**
 * 추천 유저 목록 요청
 * GET /swings/api/users/{username}/recommend
 */
export const fetchRecommendedProfiles = (username) => {
    return axios.get(`/api/users/${username}/recommend`);
};

/**
 * 좋아요 요청
 * POST /swings/api/likes/{fromUserId}/{toUserId}
 */
export const sendLike = (fromUserId, toUserId, paid = false) => {
    return axios.post(`/api/likes/${fromUserId}/${toUserId}`, null, {
        params: { paid }
    });
};

//  LikeListPage용 이름으로도 export
export const sendLikeToUser = (fromUsername, toUsername, paid = false) => {
    return axios.post(`/api/likes/${fromUsername}/${toUsername}`, null, {
        params: { paid }
    });
};

/**
 * 싫어요 요청
 * POST /swings/api/dislikes/{fromUserId}/{toUserId}
 */
export const sendDislike = (fromUserId, toUserId) => {
    return axios.post(`/api/dislikes/${fromUserId}/${toUserId}`);
};

/**
 *  보낸 좋아요 + 받은 좋아요 함께 조회
 * GET /swings/api/likes/all/{userId}
 */
export async function getSentAndReceivedLikes(userId) {
    const res = await axios.get(`/api/likes/all/${userId}`);
    return res.data;
}

/**
 *  채팅방 생성 (슈퍼챗 포함 일반 좋아요도 사용)
 * POST /swings/api/chat/room?user1={user1}&user2={user2}
 */
export const createChatRoom = async (user1, user2, isSuperChat = false) => {
    return axios.post(`/api/chat/room`, null, {
        params: {
            user1,
            user2,
            isSuperChat,
        }
    });
};
