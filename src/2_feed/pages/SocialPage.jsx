import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useProfileData from "../hooks/useProfileData";
import { useFeedData } from "../hooks/useFeedData";
import SocialProfile from "../components/SocialProfile";
import ImageModal from "../components/ImageModal";
import { FollowListModal } from "../components/SocialProfile";
import LikedByModal from "../components/LikedByModal";
import SocialFeedModal from "../components/SocialFeedModal";
import socialApi from "../api/socialApi";

const SocialPage = () => {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [viewedUserId, setViewedUserId] = useState(
    paramUserId ? Number(paramUserId) : null
  );
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [showFeedModal, setShowFeedModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);
  const [likedByUsers, setLikedByUsers] = useState([]);
  const [showLikedByModal, setShowLikedByModal] = useState(false);
  const [likeLoading, setLikeLoading] = useState({});

  const {
    loading: profileLoading,
    error: profileError,
    profile,
    introduce,
    isFollowing,
    stats,
    followers,
    followings,
    refreshProfileData,
  } = useProfileData(viewedUserId, currentUser);

  const {
    loading: feedsLoading,
    error: feedsError,
    feeds,
    handleLike,
    handleUnlike,
    handleDelete,
    handleCommentSubmit,
    handleCommentDelete,
    refreshFeeds,
  } = useFeedData(viewedUserId, currentUser);

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
      const users = await socialApi.getLikedByUsers(feedId);
      setLikedByUsers(users);
      setShowLikedByModal(true);
    } catch {
      toast.error("좋아요 목록 불러오기 실패");
    }
  };

  const handleFeedClick = (feed) => {
    setSelectedFeed(feed);
    setShowFeedModal(true);
  };

  if (profileLoading || (feedsLoading && !feeds.length)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (profileError || feedsError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{profileError || feedsError}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <ToastContainer position="bottom-right" />

      <SocialProfile
        user={profile}
        userStats={stats}
        userIntroduce={introduce}
        isCurrentUser={currentUser?.userId === viewedUserId}
        isFollowing={isFollowing}
        onFollowToggle={() => {}}
        onShowFollowers={() => setShowFollowersList(true)}
        onShowFollowing={() => setShowFollowingList(true)}
        onGoToSettings={() => navigate("/swings/mypage")}
        feeds={feeds}
        onFeedClick={handleFeedClick}
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
        <LikedByModal
          users={likedByUsers}
          onClose={() => setShowLikedByModal(false)}
        />
      )}

      {selectedFeed && (
        <SocialFeedModal
          feed={selectedFeed}
          currentUser={currentUser}
          likeLoading={likeLoading}
          onClose={() => setShowFeedModal(false)}
          onLike={(id) => handleLike(id)}
          onUnlike={(id) => handleUnlike(id)}
          onDelete={handleDelete}
          onToggleComments={() => {}}
          onShowLikedBy={handleShowLikedBy}
          onCommentSubmit={handleCommentSubmit}
          onCommentDelete={handleCommentDelete}
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
