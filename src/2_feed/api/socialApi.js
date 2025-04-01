// src/api/socialApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8090/swings/social';

// 자기소개 불러오기
export const getIntroduce = async (userId) => {
    const response = await axios.get(`${BASE_URL}/introduce/${userId}`);
    return response.data;
};

// 자기소개 수정하기
export const updateIntroduce = async (userId, introduce) => {
    const response = await axios.post(`${BASE_URL}/update-introduce?userId=${userId}`, introduce, {
        headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
};

// 팔로워 불러오기
export const getFollowers = async (userId) => {
    const response = await axios.get(`${BASE_URL}/followers/${userId}`);
    return response.data;
};

// 팔로잉 불러오기
export const getFollowings = async (userId) => {
    const response = await axios.get(`${BASE_URL}/followings/${userId}`);
    return response.data;
};

// 피드 개수 불러오기
export const getFeedCount = async (userId) => {
    const response = await axios.get(`${BASE_URL}/feeds/count/${userId}`);
    return response.data;
};

// 팔로우, 언팔로우 불러오기
export const isFollowing = async (followerId, followeeId) => {
    const response = await axios.get(`${BASE_URL}/isFollowing`, {
        params: { followerId, followeeId }
    });
    return response.data;
};

// 팔로우하기
export const followUser = async (followerId, followeeId) => {
    const response = await axios.post(`${BASE_URL}/follow`, {
        followerId,
        followeeId
    });
    return response.data;
};

// 언팔로우 하기
export const unfollowUser = async (followerId, followeeId) => {
    const response = await axios.post(`${BASE_URL}/unfollow`, {
        followerId,
        followeeId
    });
    return response.data;
};

// 프로필 데이터 가져오기
export const getProfile = async (userId) => {
    if (!userId) {
        throw new Error('유효한 사용자 ID가 필요합니다.');
    }

    try {
        const response = await axios.get(`http://localhost:8090/swings/social/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('프로필 데이터 로딩 오류:', error);
        throw error;
    }
};

