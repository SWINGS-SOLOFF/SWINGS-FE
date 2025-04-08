import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useUser from "../hooks/useUser";
import useFeed from "../hooks/useFeed";
import useNewPostForm from "../hooks/useNewPostForm";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import CreatePostButton from "../components/CreatePostButton";

import FeedPost from "../components/FeedPost";
import NewPostForm from "../components/NewPostForm";
import ImageModal from "../components/ImageModal";
import LikedUsersModal from "../components/LikedUsersModal";
import feedApi from "../api/feedApi";

const FeedPage = () => {
  const { userId } = useUser();
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLikedModalOpen, setIsLikedModalOpen] = useState(false);

  const {
    posts,
    setPosts,
    fetchInitialPosts,
    loadMorePosts,
    hasMore,
    loading,
    fetchingMore,
    page,
    setPage,
  } = useFeed(userId);

  const {
    newPostContent,
    setNewPostContent,
    newPostImage,
    imagePreview,
    handleImageChange,
    reset,
  } = useNewPostForm();

  const containerRef = useRef(null);
  const lastPostRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchInitialPosts();
    }
  }, [userId]);

  useIntersectionObserver({
    targetRef: lastPostRef,
    onIntersect: () => {
      if (!fetchingMore && hasMore) {
        loadMorePosts();
      }
    },
    enabled: hasMore && !loading,
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
      setPosts((prev) => [newPostData, ...prev]);
      reset();
      setShowNewPostForm(false);
      toast.success("게시물이 업로드되었습니다.");
    } catch {
      toast.error("업로드 실패");
    }
  };

  const handleLike = async (feedId) => {
    try {
      await feedApi.likeFeed(feedId, userId);
      setPosts((prev) =>
        prev.map((post) =>
          post.feedId === feedId
            ? { ...post, liked: true, likes: post.likes + 1 }
            : post
        )
      );
    } catch {
      toast.error("좋아요 실패");
    }
  };

  const handleUnlike = async (feedId) => {
    try {
      await feedApi.unlikeFeed(feedId, userId);
      setPosts((prev) =>
        prev.map((post) =>
          post.feedId === feedId
            ? { ...post, liked: false, likes: post.likes - 1 }
            : post
        )
      );
    } catch {
      toast.error("좋아요 취소 실패");
    }
  };

  const handleToggleComments = (feedId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.feedId === feedId
          ? { ...post, showComments: !post.showComments }
          : post
      )
    );
  };

  const handleCommentSubmit = async (feedId, content) => {
    try {
      const newComment = await feedApi.addComment(feedId, userId, content);
      setPosts((prev) =>
        prev.map((post) =>
          post.feedId === feedId
            ? {
                ...post,
                comments: [...(post.comments || []), newComment],
              }
            : post
        )
      );
    } catch {
      toast.error("댓글 작성 실패");
    }
  };

  const handleCommentDelete = async (commentId, feedId) => {
    try {
      await feedApi.deleteComment(feedId, commentId);
      setPosts((prev) =>
        prev.map((post) =>
          post.feedId === feedId
            ? {
                ...post,
                comments: post.comments.filter(
                  (c) => c.commentId !== commentId
                ),
              }
            : post
        )
      );
    } catch {
      toast.error("댓글 삭제 실패");
    }
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

  const handleDeletePost = async (feedId) => {
    try {
      await feedApi.deleteFeed(feedId);
      setPosts((prev) => prev.filter((post) => post.feedId !== feedId));
      toast.success("게시물이 삭제되었습니다");
    } catch {
      toast.error("게시물 삭제 실패");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <ToastContainer position="bottom-right" />

      <CreatePostButton
        onClick={() => setShowNewPostForm((prev) => !prev)}
        customPosition="right-20"
      />

      {showNewPostForm && (
        <div className="fixed bottom-36 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] max-w-md px-2">
          <NewPostForm
            newPostContent={newPostContent}
            setNewPostContent={setNewPostContent}
            handleImageChange={handleImageChange}
            imagePreview={imagePreview}
            handleSubmit={handleSubmit}
            setShowNewPostForm={setShowNewPostForm}
          />
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full max-w-xl mx-auto px-4 h-full overflow-y-auto"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="space-y-6 mt-4 pb-24">
          {posts.map((post, index) => (
            <div
              key={post.feedId}
              ref={index === posts.length - 1 ? lastPostRef : null}
            >
              <FeedPost
                post={post}
                currentUser={{ userId }}
                onImageClick={setSelectedImage}
                onLike={handleLike}
                onUnlike={handleUnlike}
                onToggleComments={handleToggleComments}
                onCommentSubmit={handleCommentSubmit}
                onCommentDelete={handleCommentDelete}
                onDelete={handleDeletePost}
                onShowLikedBy={handleShowLikedBy}
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
