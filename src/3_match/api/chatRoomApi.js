//  chatRoomApi.js - 채팅방 관련 API 모듈 (수정완료)
import axios from "../../1_user/api/axiosInstance";

/**
 * 특정 유저 쌍에 대한 채팅방 조회 또는 생성
 * POST /swings/api/chat/create-or-get
 */
export const createOrGetChatRoom = (userA, userB) => {
    return axios.post(`/api/chat/create-or-get`, { userA, userB });
};

/**
 * 채팅방 상세 정보 조회
 * GET /swings/api/chat/{roomId}
 */
export const fetchChatRoomDetail = (roomId) => {
    return axios.get(`/api/chat/${roomId}`);
};

/**
 * 채팅방의 과거 메시지 목록 조회
 * GET /swings/api/chat/messages/{roomId}
 */
export const fetchChatMessages = (roomId) => {
    return axios.get(`/api/chat/messages/${roomId}`);
};
