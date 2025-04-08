import { useState, useEffect } from "react";
import feedApi from "../api/feedApi";

export const useFeedData = (userId, currentUser) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feeds, setFeeds] = useState([]);

  const refreshFeeds = async () => {
    if (!userId || !currentUser) return setLoading(false);
    try {
      setLoading(true);
      const fetchedFeeds = await feedApi.getUserFeeds(userId);
      const processed = fetchedFeeds.map((feed) => ({
        ...feed,
        isLiked: feed.likedByUser || false,
        likes: feed.likes ?? feed.likeCount ?? 0,
        comments: feed.comments ?? [],
        showComments: false,
        newComment: "",
        username: feed.username ?? feed.user?.username ?? "익명",
        userProfilePic: feed.user?.userImg || null,
      }));
      setFeeds(processed);
    } catch (err) {
      console.error("피드 로딩 오류:", err);
      setError("피드를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && currentUser) refreshFeeds();
  }, [userId, currentUser]);

  const handleLikeToggle = async (feedId, isLiked) => {
    let updatedFeed = null;
    setFeeds((prev) =>
      prev.map((f) => {
        if (f.feedId === feedId) {
          const updated = {
            ...f,
            isLiked: !isLiked,
            likes: isLiked ? f.likes - 1 : f.likes + 1,
          };
          updatedFeed = updated;
          return updated;
        }
        return f;
      })
    );

    try {
      if (isLiked) {
        await feedApi.unlikeFeed(feedId, currentUser.userId);
      } else {
        await feedApi.likeFeed(feedId, currentUser.userId);
      }
    } catch (err) {
      console.error("좋아요 상태 변경 실패:", err);
    }

    return updatedFeed;
  };

  const handleDelete = async (feedId) => {
    try {
      await feedApi.deleteFeed(feedId);
      setFeeds((prev) => prev.filter((f) => f.feedId !== feedId));
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  const handleCommentSubmit = async (feedId, commentText) => {
    if (!commentText.trim()) return;
    try {
      const newComment = await feedApi.addComment(
        feedId,
        currentUser.userId,
        commentText
      );
      setFeeds((prev) =>
        prev.map((f) =>
          f.feedId === feedId
            ? {
                ...f,
                comments: [...f.comments, newComment],
                newComment: "",
              }
            : f
        )
      );
    } catch (err) {
      console.error("댓글 추가 실패:", err);
    }
  };

  const handleCommentDelete = async (feedId, commentId) => {
    try {
      await feedApi.deleteComment(feedId, commentId);
      setFeeds((prev) =>
        prev.map((f) =>
          f.feedId === feedId
            ? {
                ...f,
                comments: f.comments.filter((c) => c.commentId !== commentId),
              }
            : f
        )
      );
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  };

  return {
    feeds,
    loading,
    error,
    refreshFeeds,
    handleLikeToggle,
    handleDelete,
    handleCommentSubmit,
    handleCommentDelete,
  };
};

export default useFeedData;
