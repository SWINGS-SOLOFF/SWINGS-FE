import axios from "../../1_user/api/axiosInstance";

const BASE_URL = "";

const socialApi = {
  // 공통 요청 함수
  request: async (
    method,
    url,
    data = null,
    params = null,
    contentType = "application/json"
  ) => {
    return axios({
      method,
      url: `${BASE_URL}${url}`,
      data,
      params,
      headers: { "Content-Type": contentType },
    });
  },

  // 자기소개 조회
  getIntroduce: async (userId) => {
    const res = await socialApi.request("get", `/social/introduce/${userId}`);
    return res.data;
  },

  // 자기소개 등록/수정
  updateIntroduce: async (userId, introduce) => {
    const res = await socialApi.request(
      "post",
      `/social/update-introduce?userId=${userId}`,
      introduce,
      null,
      "text/plain"
    );
    return res.data;
  },

  // 팔로워 목록 조회 (나를 팔로우한 사람들)
  getFollowers: async (userId) => {
    const res = await socialApi.request("get", `/social/followers/${userId}`);
    return res.data;
  },

  // 팔로잉 목록 조회 (내가 팔로우한 사람들)
  getFollowings: async (userId) => {
    const res = await socialApi.request("get", `/social/followings/${userId}`);
    return res.data;
  },

  // 피드 개수 조회
  getFeedCount: async (userId) => {
    const res = await socialApi.request("get", `/social/feeds/count/${userId}`);
    return res.data;
  },

  // 팔로우 여부 확인
  isFollowing: async (followerId, followeeId) => {
    const res = await socialApi.request("get", `/social/isFollowing`, null, {
      followerId,
      followeeId,
    });
    return res.data;
  },

  // 팔로우 하기
  followUser: async (followerId, followeeId) => {
    const res = await socialApi.request("post", `/social/follow`, {
      followerId,
      followeeId,
    });
    return res.data;
  },

  // 언팔로우 하기
  unfollowUser: async (followerId, followeeId) => {
    const res = await socialApi.request("post", `/social/unfollow`, {
      followerId,
      followeeId,
    });
    return res.data;
  },

  // 유저 프로필 조회 (상세 정보)
  getProfile: async (userId) => {
    const res = await socialApi.request("get", `/social/user/${userId}`);
    return res.data;
  },

  // 현재 로그인 유저 정보 조회
  getCurrentUser: async () => {
    const res = await socialApi.request("get", `/users/me`);
    return res.data;
  },

  // 특정 유저의 피드 목록 조회
  getUserFeeds: async (userId, page = 0, size = 10) => {
    const res = await socialApi.request(
      "get",
      `/social/feeds/user/${userId}`,
      null,
      { page, size }
    );
    return res.data;
  },
};

export default socialApi;
