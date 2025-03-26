// src/api/socialApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8090/swings/social';

// 자기소개 불러오기
export const getIntroduce = async (userId) => {
    const response = await axios.get(`${BASE_URL}/introduce/${userId}`);
    return response.data;
};

export const updateIntroduce = async (userId, introduce) => {
    const response = await axios.post(`${BASE_URL}/update-introduce?userId=${userId}`, introduce, {
        headers: { 'Content-Type': 'text/plain' }
    });
    return response.data;
};

export const getFollowers = async (userId) => {
    const response = await axios.get(`${BASE_URL}/followers/${userId}`);
    return response.data;
};

export const getFollowings = async (userId) => {
    const response = await axios.get(`${BASE_URL}/followings/${userId}`);
    return response.data;
};

export const getFeedCount = async (userId) => {
    const response = await axios.get(`${BASE_URL}/feeds/count/${userId}`);
    return response.data;
};

export const isFollowing = async (followerId, followeeId) => {
    const response = await axios.get(`${BASE_URL}/isFollowing`, {
        params: { followerId, followeeId }
    });
    return response.data;
};

export const followUser = async (followerId, followeeId) => {
    const response = await axios.post(`${BASE_URL}/follow`, {
        followerId,
        followeeId
    });
    return response.data;
};

export const unfollowUser = async (followerId, followeeId) => {
    const response = await axios.post(`${BASE_URL}/unfollow`, {
        followerId,
        followeeId
    });
    return response.data;
};

export const getProfile = async (userId) => {
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return response.data;
};

