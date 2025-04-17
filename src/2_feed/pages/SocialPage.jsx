import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";
import NewPostForm from "../components/NewPostForm";

import useProfileData from "../hooks/useProfileData";
import useFeedData from "../hooks/useFeedData";
import { processFeed } from "../utils/feedUtils";

import SocialProfile from "../components/SocialProfile";
import ImageModal from "../components/ImageModal";
import FollowListModal from "../components/FollowListModal";
import LikedUsersModal from "../components/LikedUsersModal";
import FeedDetailModal from "../components/FeedDetailModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import CreatePostButton from "../components/CreatePostButton";
import useNewPostForm from "../hooks/useNewPostForm";

import socialApi from "../api/socialApi";
import feedApi from "../api/feedApi";

const SocialPage = () => {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const [showChargeModal, setShowChargeModal] = useState(false);

  const [showSuperChatModal, setShowSuperChatModal] = useState(false);

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
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetFeedId, setDeleteTargetFeedId] = useState(null);

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

  const {
    newPostContent,
    setNewPostContent,
    imagePreview,
    handleImageChange,
    reset,
  } = useNewPostForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser?.userId) return;

    const formData = new FormData();
    formData.append("userId", currentUser.userId);
    formData.append("content", newPostContent);
    if (selectedImage) formData.append("file", selectedImage);

    try {
      const newPost = await feedApi.uploadFeed(formData);
      setFeeds((prev) => [newPost, ...prev]);
      reset();
      setSelectedImage(null);
      setShowNewPostForm(false);
    } catch {
      console.error("게시물 업로드 실패");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await socialApi.getCurrentUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (paramUserId || currentUser) {
      const idToView = paramUserId ? Number(paramUserId) : currentUser?.userId;
      setViewedUserId(idToView);
    }
  }, [paramUserId, currentUser]);

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
      console.error("좋아요 목록 불러오기 실패");
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
      setFeeds((prev) => prev.filter((f) => f.feedId !== feedId));
      console.log("게시물이 삭제되었습니다.");
    } catch {
      console.error("게시물 삭제에 실패했습니다.");
    }
  };

  const confirmSuperChat = async () => {
    try {
      const data = new URLSearchParams();
      data.append("amount", 3);
      data.append("description", "슈퍼챗 사용");

      await axios.post("/users/me/points/use", data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      await axios.post("/api/chat/room", null, {
        params: {
          user1: currentUser.username,
          user2: profile.username,
          isSuperChat: true,
        },
      });

      toast.success("💎 슈퍼챗으로 채팅방이 생성되었습니다!");
      fetchRecommendedUser(currentUser.username);
    } catch (error) {
      const message = error?.response?.data?.message;
      if (
        error.response?.status === 400 ||
        error.response?.status === 500 ||
        message?.includes("포인트가 부족")
      ) {
        setShowChargeModal(true); // ✅ 충전 모달
      } else {
        toast.error("슈퍼챗 도중 오류 발생");
      }
    } finally {
      setShowSuperChatModal(false);
    }
  };

  return (
    <div className="min-h-screen">
      {" "}
      <ToastContainer position="bottom-right" />
      <SocialProfile
        user={profile}
        userStats={stats}
        userIntroduce={introduce}
        setIntroduce={setIntroduce}
        isCurrentUser={currentUser?.userId === viewedUserId}
        currentUser={currentUser}
        onSuperChatClick={() => setShowSuperChatModal(true)}
        onRequestCharge={() => navigate("/swings/points")}
        isFollowing={isFollowing}
        onFollowToggle={async () => {
          if (
            !currentUser ||
            !profile ||
            !currentUser.userId ||
            !profile.userId
          ) {
            console.warn("❌ 필수 정보 없음");
            return;
          }

          console.log(
            "👉 follow/unfollow:",
            currentUser.userId,
            profile.userId
          );

          try {
            if (isFollowing) {
              await socialApi.unfollowUser(currentUser.userId, profile.userId);
              console.log("언팔로우 완료");
            } else {
              await socialApi.followUser(currentUser.userId, profile.userId);
              console.log("팔로우 완료");
            }

            await refreshProfileData();
          } catch (error) {
            const msg = error?.response?.data?.message;
            console.error("팔로우 처리에 실패했습니다:", msg);
            console.error(msg || "팔로우 처리에 실패했습니다.");
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
      {showSuperChatModal && (
        <ConfirmModal
          message={`슈퍼챗은 3코인을 사용합니다.\n사용하시겠어요?`}
          confirmLabel="사용하기"
          cancelLabel="취소"
          onConfirm={handleSuperChatConfirm}
          onCancel={() => setShowSuperChatModal(false)}
        />
      )}
      {showChargeModal && (
        <ConfirmModal
          message={`포인트가 부족합니다.\n충전하러 가시겠어요?`}
          confirmLabel="충전소로 가기"
          cancelLabel="닫기"
          onConfirm={onRequestCharge}
          onCancel={() => setShowChargeModal(false)}
        />
      )}
      {selectedFeed && (
        <FeedDetailModal
          feed={selectedFeed}
          currentUser={currentUser}
          onClose={() => setSelectedFeed(null)}
          onLikeToggle={handleLikeToggle}
          onRequestDelete={(feedId) => {
            setDeleteTargetFeedId(feedId);
            setShowDeleteModal(true);
          }}
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
      {showDeleteModal && (
        <DeleteConfirmModal
          visible={true}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeleteTargetFeedId(null);
          }}
          onConfirm={async () => {
            try {
              if (!deleteTargetFeedId) return;
              await handleFeedDelete(deleteTargetFeedId);
              setDeleteTargetFeedId(null);
              setShowDeleteModal(false);
            } catch (err) {
              console.error("게시물 삭제에 실패했습니다.", err);
            }
          }}
        />
      )}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      <CreatePostButton
        onClick={() => setShowNewPostForm(true)}
        customPosition="bottom-24 right-6"
      />
      <AnimatePresence>
        {showNewPostForm && (
          <motion.div
            key="new-post-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-transparent flex items-center justify-center"
          >
            <div className="w-[90vw] max-w-md px-4">
              <NewPostForm
                newPostContent={newPostContent}
                setNewPostContent={setNewPostContent}
                handleImageChange={handleImageChange}
                imagePreview={imagePreview}
                handleSubmit={handleSubmit}
                setShowNewPostForm={() => {
                  setShowNewPostForm(false);
                  reset();
                }}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialPage;
