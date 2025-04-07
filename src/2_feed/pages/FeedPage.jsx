import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner, FaArrowDown } from "react-icons/fa";
import NewPostForm from "../components/NewPostForm";
import FeedPost from "../components/FeedPost";
import ImageModal from "../components/ImageModal";
import LikedUsersModal from "../components/LikedUsersModal";
import FeedHeader from "../components/FeedHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUser from "../hooks/useUser";
import useFeed from "../hooks/useFeed";
import usePullToRefresh from "../hooks/usePullToRefresh";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import useNewPostForm from "../hooks/useNewPostForm";
import feedApi from "../api/feedApi";

const FeedPage = () => {
  const { userId } = useUser();
  const [sortMethod, setSortMethod] = useState("latest");
  const [filterOption, setFilterOption] = useState("all");

  const {
    posts,
    setPosts,
    loadMorePosts,
    hasMore,
    loading,
    fetchingMore,
    page,
    setPage,
  } = useFeed(userId, sortMethod, filterOption);

  const {
    newPostContent,
    setNewPostContent,
    newPostImage,
    imagePreview,
    handleImageChange,
    reset,
  } = useNewPostForm();

  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLikedModalOpen, setIsLikedModalOpen] = useState(false);
  const [likeLoading, setLikeLoading] = useState({});
  const [isPulling, setIsPulling] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const containerRef = useRef(null);
  const lastPostRef = useRef(null);

  usePullToRefresh({
    containerRef,
    onRefresh: () => {
      setRefreshing(true);
      setPosts([]);
      setPage(0);
      setRefreshing(false);
    },
    setIsPulling,
    setPullY,
  });

  useIntersectionObserver({
    targetRef: lastPostRef,
    onIntersect: loadMorePosts,
    enabled: hasMore && !loading && !fetchingMore,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("로그인 후 작성해주세요");
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("content", newPostContent);
    if (newPostImage) formData.append("file", newPostImage);

    try {
      const newPostData = await feedApi.uploadFeed(formData);
      const newPost = {
        ...newPostData,
        liked: false,
        comments: [],
        showComments: false,
      };
      setPosts((prev) => [newPost, ...prev]);
      reset();
      setShowNewPostForm(false);
      toast.success("게시물이 업로드되었습니다.");
    } catch {
      toast.error("업로드 실패");
    }
  };

  const handleLike = async (feedId) => {
    if (!userId || likeLoading[feedId]) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.feedId === feedId ? { ...p, liked: true, likes: p.likes + 1 } : p
      )
    );
    setLikeLoading((prev) => ({ ...prev, [feedId]: true }));
    try {
      await feedApi.likeFeed(feedId, userId);
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.feedId === feedId ? { ...p, liked: false, likes: p.likes - 1 } : p
        )
      );
      toast.error("좋아요 실패");
    } finally {
      setLikeLoading((prev) => ({ ...prev, [feedId]: false }));
    }
  };

  const handleUnlike = async (feedId) => {
    if (!userId || likeLoading[feedId]) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.feedId === feedId ? { ...p, liked: false, likes: p.likes - 1 } : p
      )
    );
    setLikeLoading((prev) => ({ ...prev, [feedId]: true }));
    try {
      await feedApi.unlikeFeed(feedId, userId);
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.feedId === feedId ? { ...p, liked: true, likes: p.likes + 1 } : p
        )
      );
      toast.error("좋아요 취소 실패");
    } finally {
      setLikeLoading((prev) => ({ ...prev, [feedId]: false }));
    }
  };

  const handleCommentSubmit = async (feedId, comment) => {
    if (!userId || !comment.trim()) return;
    try {
      const data = await feedApi.addComment(feedId, userId, comment);
      setPosts((prev) =>
        prev.map((p) =>
          p.feedId === feedId ? { ...p, comments: [...p.comments, data] } : p
        )
      );
    } catch {
      toast.error("댓글 추가 실패");
    }
  };

  const handleCommentDelete = async (commentId, feedId) => {
    try {
      await feedApi.deleteComment(feedId, commentId);
      setPosts((prev) =>
        prev.map((p) =>
          p.feedId === feedId
            ? {
                ...p,
                comments: p.comments.filter((c) => c.commentId !== commentId),
              }
            : p
        )
      );
    } catch {
      toast.error("댓글 삭제 실패");
    }
  };

  const handleToggleComments = (feedId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.feedId === feedId ? { ...p, showComments: !p.showComments } : p
      )
    );
  };

  const handleDelete = async (feedId) => {
    try {
      await feedApi.deleteFeed(feedId);
      setPosts((prev) => prev.filter((p) => p.feedId !== feedId));
    } catch {
      toast.error("게시물 삭제 실패");
    }
  };

  const handleShowLikedBy = async (feedId) => {
    try {
      const users = await feedApi.getLikedUsers(feedId);
      setLikedUsers(users);
      setIsLikedModalOpen(true);
      if (users.length === 0) toast.info("아직 좋아요한 사용자가 없습니다.");
    } catch {
      toast.error("좋아요 유저 정보 불러오기 실패");
    }
  };

  if (loading && page === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl" />
        <span className="ml-4">피드 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center pt-16">
      <div
        ref={containerRef}
        className="w-full max-w-xl mx-auto h-full overflow-y-auto"
        style={{ height: "calc(100vh - 64px)", padding: "0 1rem" }}
      >
        <ToastContainer position="bottom-right" />

        {isPulling && (
          <div
            className="flex justify-center py-4"
            style={{ height: `${pullY}px` }}
          >
            <FaArrowDown className="text-2xl" />
            <span className="ml-2">당겨서 새로고침</span>
          </div>
        )}

        {refreshing && (
          <div className="flex justify-center py-4">
            <FaSpinner className="animate-spin text-2xl" />
            <span className="ml-2">새로고침 중...</span>
          </div>
        )}

        <FeedHeader
          sortMethod={sortMethod}
          toggleSortMethod={() =>
            setSortMethod((s) => (s === "latest" ? "random" : "latest"))
          }
          filterOption={filterOption}
          toggleFilterOption={() =>
            setFilterOption((f) => (f === "all" ? "followings" : "all"))
          }
          showNewPostForm={showNewPostForm}
          setShowNewPostForm={setShowNewPostForm}
        />

        <AnimatePresence>
          {isLikedModalOpen && (
            <LikedUsersModal
              users={likedUsers}
              onClose={() => setIsLikedModalOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNewPostForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <NewPostForm
                newPostContent={newPostContent}
                setNewPostContent={setNewPostContent}
                handleImageChange={handleImageChange}
                imagePreview={imagePreview}
                handleSubmit={handleSubmit}
                setShowNewPostForm={setShowNewPostForm}
                showNewPostForm={showNewPostForm}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6 mt-4 pb-16">
          {posts.map((post, index) => (
            <motion.div
              key={post.feedId}
              ref={index === posts.length - 1 ? lastPostRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <FeedPost
                post={post}
                currentUser={{ userId }}
                onLike={handleLike}
                onUnlike={handleUnlike}
                onDelete={handleDelete}
                onToggleComments={handleToggleComments}
                onCommentSubmit={handleCommentSubmit}
                onCommentDelete={handleCommentDelete}
                onImageClick={setSelectedImage}
                onShowLikedBy={handleShowLikedBy}
                likeLoading={likeLoading}
              />
            </motion.div>
          ))}

          {fetchingMore && (
            <div className="flex justify-center py-4">
              <FaSpinner className="animate-spin text-2xl" />
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center text-gray-500 py-6">
              더 이상 불러올 게시물이 없습니다.
            </div>
          )}
        </div>

        {selectedImage && (
          <ImageModal
            imageUrl={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </div>
  );
};

export default FeedPage;
