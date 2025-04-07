import { useState, useEffect } from "react";
import socialApi from "../api/socialApi";

export const useProfileData = (userId, currentUser) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [introduce, setIntroduce] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);

  // 데이터를 가져오는 함수를 별도 함수로 분리
  const fetchProfileData = async () => {
    if (!userId || !currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 병렬로 데이터 로드
      const [
        profileData,
        introduceData,
        followersData,
        followingsData,
        feedCount,
        followStatus,
      ] = await Promise.all([
        socialApi.getProfile(userId),
        socialApi.getIntroduce(userId),
        socialApi.getFollowers(userId),
        socialApi.getFollowings(userId),
        socialApi.getFeedCount(userId),
        socialApi.isFollowing(currentUser.userId, userId),
      ]);

      // 상태 업데이트
      setProfile(profileData);
      setIntroduce(introduceData || "");
      setFollowers(followersData || []);
      setFollowings(followingsData || []);
      setStats({
        posts: feedCount || 0,
        followers: followersData?.length || 0,
        following: followingsData?.length || 0,
      });
      setIsFollowing(followStatus === "팔로우 중입니다.");
    } catch (err) {
      console.error("프로필 데이터 로딩 오류:", err);
      setError("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 처음 컴포넌트 렌더링시 데이터 로드
  useEffect(() => {
    fetchProfileData();
  }, [userId, currentUser]);

  // 데이터 새로고침 함수 - SocialPage에서 호출할 수 있도록 제공
  const refreshProfileData = () => {
    fetchProfileData();
  };

  return {
    loading,
    error,
    profile,
    introduce,
    isFollowing,
    stats,
    followers,
    followings,
    setIntroduce,
    refreshProfileData,
  };
};

export default useProfileData;
