import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import useUser from "../hooks/useUser";
import useNewPostForm from "../hooks/useNewPostForm";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import usePullToRefresh from "../hooks/usePullToRefresh";
import useFeedData from "../hooks/useFeedData";

import CreatePostButton from "../components/CreatePostButton";
import FeedPost from "../components/FeedPost";
import NewPostForm from "../components/NewPostForm";
import ImageModal from "../components/ImageModal";
import LikedUsersModal from "../components/LikedUsersModal";
import feedApi from "../api/feedApi";
import socialApi from "../api/socialApi";

const FeedPage = () => {
  const { userId } = useUser();
  const [currentUser, setCurrentUser] = useState(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLikedModalOpen, setIsLikedModalOpen] = useState(false);
  const [feedOrder, setFeedOrder] = useState([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    posts,
    setPosts,
    refreshFeeds,
    handleLikeToggle,
    handleDelete,
    handleCommentSubmit,
    handleCommentDelete,
  } = useFeedData(userId, currentUser, null);

  const formRef = useRef(null);
  const containerRef = useRef(null);
  const lastPostRef = useRef(null);

  const {
    newPostContent,
    setNewPostContent,
    newPostImage,
    imagePreview,
    handleImageChange,
    reset,
  } = useNewPostForm();

  useEffect(() => {
    if (!userId) return;
    const init = async () => {
      try {
        const user = await feedApi.getCurrentUser();
        setCurrentUser(user);
        setPosts([]);
        const order = ["followings", "all", "mine"].sort(
          () => Math.random() - 0.5
        );
        setFeedOrder(order);
        setStep(0);
        await loadFeeds(order[0], user);
      } catch {
        console.error("사용자 정보를 불러오는 데 실패했습니다.");
      }
    };
    init();
  }, [userId]);

  const loadFeeds = async (type, user) => {
    setLoading(true);
    try {
      let newFeeds = [];

      if (type === "mine") {
        newFeeds = await feedApi.getUserFeeds(user.userId);
      } else {
        const followings = (await socialApi.getFollowings?.(user.userId)) || [];
        const filter =
          type === "followings" && followings.length > 0 ? "followings" : "all";

        const sort = type === "followings" ? "latest" : "random"; // 핵심 수정

        newFeeds = await feedApi.getFeeds(user.userId, 0, 10, {
          sort,
          filter,
        });
      }

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.feedId));
        const uniqueNewFeeds = newFeeds.filter(
          (f) => !existingIds.has(f.feedId)
        );
        return [...prev, ...uniqueNewFeeds];
      });
    } catch {
      console.error("피드를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreFeeds = async () => {
    if (loading || !currentUser || step >= feedOrder.length) return;

    setLoading(true);
    try {
      const prevPostsLength = posts.length;

      await loadFeeds(feedOrder[step], currentUser);

      // 🔧 현재 단계에서 불러온 피드가 없다면 다음 단계로 강제로 넘김
      const isSameLength = posts.length === prevPostsLength;
      if (isSameLength && step < feedOrder.length - 1) {
        setStep((prev) => prev + 1);
        await loadFeeds(feedOrder[step + 1], currentUser);
      }
    } catch (err) {
      console.error("피드 로딩 실패:", err);
    } finally {
      setStep((prev) => prev + 1); // 이건 무조건 마지막에 올려야 중복 로딩 방지됨
      setLoading(false);
    }
  };

  useIntersectionObserver({
    targetRef: lastPostRef,
    onIntersect: loadMoreFeeds,
    enabled: step < feedOrder.length,
  });

  const { isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      if (!currentUser) return;
      const order = ["followings", "all", "mine"];
      setFeedOrder(order);
      setStep(0);
      setPosts([]);
      await loadFeeds(order[0], currentUser);
    },
    targetRef: containerRef,
  });

  const togglePostForm = () => {
    setShowNewPostForm((prev) => !prev);
    if (showNewPostForm) reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return console.error("로그인 후 작성해주세요");

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("content", newPostContent);

    if (selectedImage) {
      formData.append("file", selectedImage); // 🔥 핵심 포인트
    }

    try {
      const newPost = await feedApi.uploadFeed(formData);
      setPosts((prev) => [newPost, ...prev]);
      reset();
      setSelectedImage(null);
      setShowNewPostForm(false);
    } catch {
      console.error("업로드 실패");
    }
  };

  const handleShowLikedBy = async (feedId) => {
    try {
      const users = await feedApi.getLikedUsers(feedId);
      setLikedUsers(users);
      setIsLikedModalOpen(true);
    } catch {
      console.error("좋아요 목록 불러오기 실패");
    }
  };

  return (
    <div className="bg-white min-h-screen pt-4 sm:pt-8 md:pt-12">
      <CreatePostButton
        onClick={togglePostForm}
        customPosition="bottom-24 right-6"
      />

      {isRefreshing && (
        <div className="text-center py-3 text-sm text-blue-500 animate-pulse">
          🔄 새로고침 중입니다...
        </div>
      )}

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
            <div ref={formRef} className="w-[90vw] max-w-md px-4">
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

      <div
        ref={containerRef}
        className="w-full px-4 md:px-12 h-full overflow-y-auto"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="space-y-4 pb-24">
          {loading && (
            <div className="text-center py-8 text-gray-500 text-sm">
              피드를 불러오는 중...
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              표시할 피드가 없습니다.
            </div>
          )}

          {posts.map((post, index) => (
            <motion.div
              key={post.feedId}
              ref={index === posts.length - 1 ? lastPostRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <FeedPost
                post={post}
                currentUser={currentUser}
                onImageClick={setSelectedImage}
                onLike={() => handleLikeToggle(post.feedId, false)}
                onUnlike={() => handleLikeToggle(post.feedId, true)}
                onToggleComments={(feedId) => {
                  setPosts((prev) =>
                    prev.map((p) =>
                      p.feedId === feedId
                        ? { ...p, showComments: !p.showComments }
                        : p
                    )
                  );
                }}
                onCommentSubmit={handleCommentSubmit}
                onCommentDelete={(commentId) =>
                  handleCommentDelete(post.feedId, commentId)
                }
                onDelete={() => handleDelete(post.feedId)}
                onShowLikedBy={handleShowLikedBy}
                updatePostInState={(updatedPost) =>
                  setPosts((prev) =>
                    prev.map((p) =>
                      p.feedId === updatedPost.feedId ? updatedPost : p
                    )
                  )
                }
              />
            </motion.div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {isLikedModalOpen && (
        <LikedUsersModal
          users={likedUsers}
          onClose={() => setIsLikedModalOpen(false)}
        />
      )}
    </div>
  );
};

export default FeedPage;
