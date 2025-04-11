import { useState, useEffect } from "react";
import feedApi from "../api/feedApi";
import { processFeed } from "../utils/feedUtils";

const useFeedData = (userId, currentUser, setSelectedFeed = null) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshFeeds = async () => {
    if (!userId || !currentUser) return setLoading(false);
    try {
      setLoading(true);
      const fetchedFeeds = await feedApi.getUserFeeds(userId);
      const processed = fetchedFeeds.map((feed) => processFeed(feed));
      setPosts(processed);
    } catch (err) {
      console.error("❌ 피드 로딩 오류:", err);
      setError("피드를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && currentUser) refreshFeeds();
  }, [userId, currentUser]);

  const updateFeedLocally = (feedId, updateFn) => {
    setPosts((prev) =>
      prev.map((f) => (f.feedId === feedId ? updateFn(f) : f))
    );
    if (setSelectedFeed) {
      setSelectedFeed((prev) =>
        prev && prev.feedId === feedId ? updateFn(prev) : prev
      );
    }
  };

  const handleLikeToggle = async (feedId, isLiked) => {
    const prev = posts.find((p) => p.feedId === feedId);
    if (!prev) return;

    const updatedPost = {
      ...prev,
      liked: !isLiked,
      likes: isLiked ? prev.likes - 1 : prev.likes + 1,
    };
    updateFeedLocally(feedId, () => updatedPost);

    try {
      if (isLiked) {
        await feedApi.unlikeFeed(feedId, currentUser.userId);
      } else {
        await feedApi.likeFeed(feedId, currentUser.userId);
      }
      return updatedPost;
    } catch (err) {
      console.error("❌ 좋아요 상태 변경 실패:", err);
      updateFeedLocally(feedId, () => prev);
      return null;
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
      updateFeedLocally(feedId, (f) => {
        const exists = f.comments.some(
          (c) => c.commentId === newComment.commentId
        );
        return {
          ...f,
          comments: exists ? f.comments : [...f.comments, newComment],
        };
      });
      return newComment;
    } catch (err) {
      console.error("❌ 댓글 추가 실패:", err);
    }
  };

  const handleCommentDelete = async (feedId, commentId) => {
    try {
      await feedApi.deleteComment(feedId, commentId);
      updateFeedLocally(feedId, (f) => ({
        ...f,
        comments: f.comments.filter((c) => c.commentId !== commentId),
      }));
      return true;
    } catch (err) {
      console.error("❌ 댓글 삭제 실패:", err);
    }
  };

  const handleDelete = async (feedId) => {
    try {
      await feedApi.deleteFeed(feedId);
      setPosts((prev) => prev.filter((f) => f.feedId !== feedId));
      if (setSelectedFeed) {
        setSelectedFeed((prev) =>
          prev && prev.feedId === feedId ? null : prev
        );
      }
    } catch (err) {
      console.error("❌ 피드 삭제 실패:", err);
    }
  };

  return {
    posts,
    setPosts,
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
