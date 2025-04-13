// matchApi.js - 추천/좋아요/싫어요/채팅방 관련 API 모듈

import axios from "axios";

// ✅ 백엔드 주소 전체 포함한 baseURL로 설정 (포트/컨텍스트 포함)
const BASE_URL = "http://localhost:8090/swings";

/**
 * 추천 유저 목록 요청
 * GET /swings/api/users/{username}/recommend
 */
export const fetchRecommendedProfiles = (username) => {
    return axios.get(`${BASE_URL}/api/users/${username}/recommend`);
};

/**
 * 좋아요 요청
 * POST /swings/api/likes/{fromUserId}/{toUserId}
 */
export const sendLike = (fromUserId, toUserId, paid = false) => {
    return axios.post(`${BASE_URL}/api/likes/likes/${fromUserId}/${toUserId}?paid=${paid}`);
};

// ✅ LikeListPage용 이름으로도 export
export const sendLikeToUser = sendLike;

/**
 * 싫어요 요청
 * POST /swings/api/dislikes/{fromUserId}/{toUserId}
 */
export const sendDislike = (fromUserId, toUserId) => {
    return axios.post(`${BASE_URL}/api/dislikes/${fromUserId}/${toUserId}`);
};

/**
 * ✅ 보낸 좋아요 + 받은 좋아요 함께 조회
 * GET /swings/api/likes/all/{userId}
 */
export async function getSentAndReceivedLikes(userId) {
    const res = await fetch(`${BASE_URL}/api/likes/all/${userId}`);
    if (!res.ok) throw new Error("좋아요 정보 조회 실패");
    return res.json();
}

/**
 * ✅ 채팅방 생성 (슈퍼챗 포함 일반 좋아요도 사용)
 * POST /swings/api/chat/room?user1={user1}&user2={user2}
 */
// 일반 좋아요 → 슈퍼챗 여부를 false로 기본 처리
export const createChatRoom = async (user1, user2, isSuperChat = false) => {
    return axios.post(`${BASE_URL}/api/chat/room`, null, {
        params: {
            user1,
            user2,
            isSuperChat, // 이거 중요함!! → boolean 값 전달
        },
    });
};

