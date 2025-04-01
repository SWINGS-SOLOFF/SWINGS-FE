// chatRoomApi.js - 채팅방 관련 API 모듈

import axios from "axios";

const BASE_URL = "/api/chatroom"; // 백엔드 채팅방 관련 Prefix

/**
 * 특정 유저 쌍에 대한 채팅방 조회 또는 생성
 * @param {string} userA - 현재 유저 ID
 * @param {string} userB - 상대 유저 ID
 * @returns Promise<{ roomId: string }>
 */
export const createOrGetChatRoom = (userA, userB) => {
    return axios.post(`${BASE_URL}/create-or-get`, { userA, userB });
};

/**
 * 채팅방 상세 정보 조회
 * @param {string} roomId - 채팅방 ID
 * @returns Promise<ChatRoomEntity>
 */
export const fetchChatRoomDetail = (roomId) => {
    return axios.get(`${BASE_URL}/${roomId}`);
};

/**
 * 채팅방의 과거 메시지 목록 조회
 * @param {string} roomId - 채팅방 ID
 * @returns Promise<ChatMessage[]>
 */
export const fetchChatMessages = (roomId) => {
    return axios.get(`${BASE_URL}/${roomId}/messages`);
};
