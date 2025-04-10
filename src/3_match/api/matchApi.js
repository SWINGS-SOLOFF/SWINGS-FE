// matchApi.js - 추천/좋아요/싫어요 관련 API 모듈

import axios from "axios";

// 하드코딩된 username (로그인 붙이면 여기만 바꾸면 됨)
const username = "user001"; // 추후 로그인 기능 붙이면 동적으로 변경 예정

// ✅ 백엔드 주소 전체 포함한 baseURL로 설정 (포트/컨텍스트 포함)
const BASE_URL = "http://localhost:8090/swings";

/**
 * 추천 유저 목록 요청
 * GET /swings/api/users/{username}/recommend
 */
export const fetchRecommendedProfiles = () => {
    return axios.get(`${BASE_URL}/api/users/${username}/recommend`);
};

/**
 * 좋아요 요청
 * POST /swings/api/likes/{fromUserId}/{toUserId}
 */
export const sendLike = (fromUserId, toUserId) => {
    return axios.post(`${BASE_URL}/api/likes/${fromUserId}/${toUserId}`);
};

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
