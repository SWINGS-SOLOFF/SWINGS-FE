import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";

import useUser from "../hooks/useUser";
import useNewPostForm from "../hooks/useNewPostForm";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import usePullToRefresh from "../hooks/usePullToRefresh";

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
  const [posts, setPosts] = useState([]);
  const [feedOrder, setFeedOrder] = useState([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

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
        toast.error("사용자 정보를 불러오는 데 실패했습니다.");
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
        newFeeds = await feedApi.getFeeds(user.userId, 0, 10, {
          sort: "random",
          filter,
        });
      }
      setPosts((prev) => [...prev, ...newFeeds]);
    } catch {
      toast.error("피드를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreFeeds = async () => {
    if (loading || !currentUser || step >= feedOrder.length) return;
    await loadFeeds(feedOrder[step], currentUser);
    setStep((prev) => prev + 1);
  };

  useIntersectionObserver({
    targetRef: lastPostRef,
    onIntersect: loadMoreFeeds,
    enabled: step < feedOrder.length,
  });

  const { isRefreshing } = usePullToRefresh({
    onRefresh: async () => {
      if (!currentUser) return;
      const order = ["followings", "all", "mine"].sort(
        () => Math.random() - 0.5
      );
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
    if (!userId) return toast.error("로그인 후 작성해주세요");
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("content", newPostContent);
    if (newPostImage) formData.append("file", newPostImage);

    try {
      const newPost = await feedApi.uploadFeed(formData);
      setPosts((prev) => [newPost, ...prev]);
      reset();
      setShowNewPostForm(false);
      toast.success("게시물이 업로드되었습니다.");
    } catch {
      toast.error("업로드 실패");
    }
  };

  const updatePostInState = (updatedPost) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.feedId === updatedPost.feedId ? updatedPost : post
      )
    );
  };

  const handleLike = async (feedId) => {
    const updated = await feedApi.likeFeed(feedId, userId);
    if (updated) updatePostInState(updated);
  };

  const handleUnlike = async (feedId) => {
    const updated = await feedApi.unlikeFeed(feedId, userId);
    if (updated) updatePostInState(updated);
  };

  const handleShowLikedBy = async (feedId) => {
    try {
      const users = await feedApi.getLikedUsers(feedId);
      setLikedUsers(users);
      setIsLikedModalOpen(true);
    } catch {
      toast.error("좋아요 목록 불러오기 실패");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-4 sm:pt-8 md:pt-12">
      <ToastContainer position="bottom-right" />
      <CreatePostButton onClick={togglePostForm} customPosition="right-20" />

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
            className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
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
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        className="w-full px-2 sm:px-4 md:px-6 lg:px-12 xl:px-24 h-full overflow-y-auto"
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
            <div
              key={post.feedId}
              ref={index === posts.length - 1 ? lastPostRef : null}
            >
              <FeedPost
                post={post}
                currentUser={currentUser}
                onImageClick={setSelectedImage}
                onLike={handleLike}
                onUnlike={handleUnlike}
                onToggleComments={(feedId) => {
                  setPosts((prev) =>
                    prev.map((p) =>
                      p.feedId === feedId
                        ? { ...p, showComments: !p.showComments }
                        : p
                    )
                  );
                }}
                onCommentSubmit={async (feedId, content) => {
                  try {
                    const newComment = await feedApi.addComment(
                      feedId,
                      userId,
                      content
                    );
                    setPosts((prev) =>
                      prev.map((p) =>
                        p.feedId === feedId
                          ? { ...p, comments: [...p.comments, newComment] }
                          : p
                      )
                    );
                  } catch {
                    toast.error("댓글 추가 실패");
                  }
                }}
                onCommentDelete={async (commentId, feedId) => {
                  try {
                    await feedApi.deleteComment(feedId, commentId);
                    setPosts((prev) =>
                      prev.map((p) =>
                        p.feedId === feedId
                          ? {
                              ...p,
                              comments: p.comments.filter(
                                (c) => c.commentId !== commentId
                              ),
                            }
                          : p
                      )
                    );
                  } catch {
                    toast.error("댓글 삭제 실패");
                  }
                }}
                onDelete={async (feedId) => {
                  try {
                    await feedApi.deleteFeed(feedId);
                    setPosts((prev) => prev.filter((p) => p.feedId !== feedId));
                  } catch {
                    toast.error("게시물 삭제 실패");
                  }
                }}
                onShowLikedBy={handleShowLikedBy}
                updatePostInState={updatePostInState}
              />
            </div>
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
