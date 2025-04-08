import axios from "../../1_user/api/axiosInstance";

const BASE_URL = "";

const socialApi = {
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

  getIntroduce: async (userId) => {
    const res = await socialApi.request("get", `/social/introduce/${userId}`);
    return res.data;
  },

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

  getFollowers: async (userId) => {
    const res = await socialApi.request("get", `/social/followers/${userId}`);
    return res.data;
  },

  getFollowings: async (userId) => {
    const res = await socialApi.request("get", `/social/followings/${userId}`);
    return res.data;
  },

  getFeedCount: async (userId) => {
    const res = await socialApi.request("get", `/social/feeds/count/${userId}`);
    return res.data;
  },

  isFollowing: async (followerId, followeeId) => {
    const res = await socialApi.request("get", `/social/isFollowing`, null, {
      followerId,
      followeeId,
    });
    return res.data;
  },

  followUser: async (followerId, followeeId) => {
    const res = await socialApi.request("post", `/social/follow`, {
      followerId,
      followeeId,
    });
    return res.data;
  },

  unfollowUser: async (followerId, followeeId) => {
    const res = await socialApi.request("post", `/social/unfollow`, {
      followerId,
      followeeId,
    });
    return res.data;
  },

  getProfile: async (userId) => {
    const res = await socialApi.request("get", `/social/user/${userId}`);
    return res.data;
  },

  getCurrentUser: async () => {
    const res = await socialApi.request("get", `/users/me`);
    return res.data;
  },

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
