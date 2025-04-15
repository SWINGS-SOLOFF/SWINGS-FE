import { useState, useEffect } from "react";
import feedApi from "../api/feedApi";

/**
 * 소셜 페이지이랑 피드 페이지에서 공통으로 사용할 수 있는 피드 관련 훅
 * - 좋아요 토글, 댓글 추가/삭제, 피드 삭제, 피드 불러오기 기능 포함
 */
const useFeedData = (viewedUserId, currentUser, setSelectedFeed) => {
  const [posts, setPosts] = useState([]);

  const refreshFeeds = async () => {
    if (!viewedUserId) return;
    try {
      const feeds = await feedApi.getUserFeeds(viewedUserId);
      setPosts(feeds);
    } catch {
      console.error("피드를 불러오지 못했습니다.");
    }
  };

  const handleLikeToggle = async (feedId, isLiked) => {
    try {
      const updated = isLiked
        ? await feedApi.unlikeFeed(feedId, currentUser?.userId)
        : await feedApi.likeFeed(feedId, currentUser?.userId);

      if (updated) {
        setPosts((prev) =>
          prev.map((f) => (f.feedId === feedId ? updated : f))
        );
        if (setSelectedFeed)
          setSelectedFeed((prev) =>
            prev && prev.feedId === feedId ? updated : prev
          );
      }
    } catch {
      console.error("좋아요 처리 실패");
    }
  };

  const handleDelete = async (feedId) => {
    try {
      console.log("🗑️ 삭제 요청 시작:", feedId);
      await feedApi.deleteFeed(feedId);
      console.log("✅ 삭제 성공");
      setPosts((prev) => prev.filter((post) => post.feedId !== feedId));
    } catch (err) {
      console.error("❌ 게시물 삭제 실패", err);
      console.error("게시물 삭제 실패");
    }
  };

  const handleCommentSubmit = async (feedId, content) => {
    try {
      const newComment = await feedApi.addComment(
        feedId,
        currentUser?.userId,
        content
      );
      setPosts((prev) =>
        prev.map((p) =>
          p.feedId === feedId
            ? { ...p, comments: [...p.comments, newComment] }
            : p
        )
      );
      if (setSelectedFeed)
        setSelectedFeed((prev) =>
          prev && prev.feedId === feedId
            ? { ...prev, comments: [...prev.comments, newComment] }
            : prev
        );
      return newComment;
    } catch {
      console.error("댓글 추가 실패");
    }
  };

  const handleCommentDelete = async (feedId, commentId) => {
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
      if (setSelectedFeed)
        setSelectedFeed((prev) =>
          prev && prev.feedId === feedId
            ? {
                ...prev,
                comments: prev.comments.filter(
                  (c) => c.commentId !== commentId
                ),
              }
            : prev
        );
    } catch {
      console.error("댓글 삭제 실패");
    }
  };

  return {
    posts,
    setPosts,
    refreshFeeds,
    handleLikeToggle,
    handleDelete,
    handleCommentSubmit,
    handleCommentDelete,
  };
};

export default useFeedData;
