import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useProfileData from "../hooks/useProfileData";
import useFeedData from "../hooks/useFeedData";
import { processFeed } from "../utils/feedUtils";

import SocialProfile from "../components/SocialProfile";
import ImageModal from "../components/ImageModal";
import FollowListModal from "../components/FollowListModal";
import LikedUsersModal from "../components/LikedUsersModal";
import FeedDetailModal from "../components/FeedDetailModal";

import socialApi from "../api/socialApi";
import feedApi from "../api/feedApi";

const SocialPage = () => {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [viewedUserId, setViewedUserId] = useState(
    paramUserId ? Number(paramUserId) : null
  );

  const [selectedFeed, setSelectedFeed] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);
  const [likedByUsers, setLikedByUsers] = useState([]);
  const [showLikedByModal, setShowLikedByModal] = useState(false);

  const {
    profile,
    introduce,
    isFollowing,
    stats,
    followers,
    followings,
    refreshProfileData,
    setIntroduce,
  } = useProfileData(viewedUserId, currentUser);

  const {
    posts: feeds,
    setPosts: setFeeds,
    refreshFeeds,
    handleLikeToggle,
    handleDelete,
    handleCommentSubmit,
    handleCommentDelete,
  } = useFeedData(viewedUserId, currentUser, setSelectedFeed);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await socialApi.getCurrentUser();
        setCurrentUser(user);
        if (!paramUserId) setViewedUserId(user.userId);
      } catch {
        toast.error("사용자 정보를 불러오지 못했습니다.");
      }
    };
    fetchUser();
  }, [paramUserId]);

  useEffect(() => {
    if (currentUser) {
      refreshProfileData();
      refreshFeeds();
    }
  }, [currentUser, viewedUserId]);

  const handleShowLikedBy = async (feedId) => {
    try {
      const users = await feedApi.getLikedUsers(feedId);
      setLikedByUsers(users);
      setShowLikedByModal(true);
    } catch {
      toast.error("좋아요 목록 불러오기 실패");
    }
  };

  const handleFeedClick = (feed) => {
    const processed = processFeed(feed);
    setSelectedFeed(processed);
  };

  const handleFeedDelete = async (feedId) => {
    try {
      await handleDelete(feedId);
      setSelectedFeed(null);
      toast.success("게시물이 삭제되었습니다.");
    } catch {
      toast.error("게시물 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="bottom-right" />

      <SocialProfile
        user={profile}
        userStats={stats}
        userIntroduce={introduce}
        setIntroduce={setIntroduce}
        isCurrentUser={currentUser?.userId === viewedUserId}
        isFollowing={isFollowing}
        onFollowToggle={async () => {
          if (!currentUser) return;
          try {
            if (isFollowing) {
              await socialApi.unfollowUser(currentUser.userId, viewedUserId);
              toast.success("언팔로우 완료");
            } else {
              await socialApi.followUser(currentUser.userId, viewedUserId);
              toast.success("팔로우 완료");
            }
            refreshProfileData();
          } catch {
            toast.error("팔로우 처리에 실패했습니다.");
          }
        }}
        onShowFollowers={() => setShowFollowersList(true)}
        onShowFollowing={() => setShowFollowingList(true)}
        onGoToSettings={() => navigate("/swings/mypage")}
        feeds={feeds}
        onFeedClick={handleFeedClick}
        refreshProfileData={refreshProfileData}
      />

      {showFollowersList && (
        <FollowListModal
          users={followers}
          onClose={() => setShowFollowersList(false)}
          title="팔로워"
        />
      )}
      {showFollowingList && (
        <FollowListModal
          users={followings}
          onClose={() => setShowFollowingList(false)}
          title="팔로잉"
        />
      )}
      {showLikedByModal && (
        <LikedUsersModal
          users={likedByUsers}
          onClose={() => setShowLikedByModal(false)}
        />
      )}

      {selectedFeed && (
        <FeedDetailModal
          feed={selectedFeed}
          currentUser={currentUser}
          onClose={() => setSelectedFeed(null)}
          onLikeToggle={handleLikeToggle}
          onDelete={handleFeedDelete}
          onShowLikedBy={handleShowLikedBy}
          onCommentSubmit={handleCommentSubmit}
          onCommentDelete={handleCommentDelete}
          setSelectedFeed={setSelectedFeed}
          updateFeedInState={(updatedFeed) => {
            setFeeds((prev) =>
              prev.map((f) =>
                f.feedId === updatedFeed.feedId ? updatedFeed : f
              )
            );
          }}
        />
      )}

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default SocialPage;
