import { useState, useEffect } from 'react';
import socialApi from '../api/socialApi';

export const useFeedData = (userId, currentUser) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feeds, setFeeds] = useState([]);

  // 피드 데이터 새로고침 함수
  const refreshFeeds = async () => {
    if (!userId || !currentUser) {
      setLoading(false);
      return;
    }
  
    try {
      setLoading(true);
      const fetchedFeeds = await socialApi.getUserFeeds(userId);
  
      const processedFeeds = fetchedFeeds.map(feed => ({
        ...feed,
        showComments: false,
        isLongCaption: feed.caption?.length > 100,
        showFullCaption: false,
        newComment: '',
        isLiked: feed.likedByUser || false
      }));
  
      setFeeds(processedFeeds);
    } catch (err) {
      console.error('피드 데이터 로딩 오류:', err);
      setError('피드를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false); 
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (userId && currentUser) {
      refreshFeeds();
    }else {
        setLoading(false);
      }
  }, [userId, currentUser]);

  // 댓글 토글 함수
  const toggleComments = (feedId) => {
    setFeeds(feeds.map(feed => 
      feed.feedId === feedId 
        ? { ...feed, showComments: !feed.showComments } 
        : feed
    ));
  };

  // 캡션 토글 함수
  const toggleCaption = (feedId) => {
    setFeeds(feeds.map(feed => 
      feed.feedId === feedId 
        ? { ...feed, showFullCaption: !feed.showFullCaption } 
        : feed
    ));
  };

  // 좋아요 함수
  const handleLike = async (feedId) => {
    if (!currentUser) return;
    
    try {
      await socialApi.likeFeed(feedId, currentUser.userId);
      
      setFeeds(feeds.map(feed => 
        feed.feedId === feedId 
          ? { ...feed, isLiked: true, likes: feed.likes + 1 } 
          : feed
      ));
    } catch (err) {
      console.error('좋아요 오류:', err);
    }
  };

  // 좋아요 취소 함수
  const handleUnlike = async (feedId) => {
    if (!currentUser) return;
    
    try {
      await socialApi.unlikeFeed(feedId, currentUser.userId);
      
      setFeeds(feeds.map(feed => 
        feed.feedId === feedId 
          ? { ...feed, isLiked: false, likes: Math.max(0, feed.likes - 1) } 
          : feed
      ));
    } catch (err) {
      console.error('좋아요 취소 오류:', err);
    }
  };

  // 피드 삭제 함수
  const handleDelete = async (feedId) => {
    if (!currentUser) return;
    
    try {
      await socialApi.deleteFeed(feedId);
      
      // 피드 목록에서 삭제된 피드 제거
      setFeeds(feeds.filter(feed => feed.feedId !== feedId));
    } catch (err) {
      console.error('피드 삭제 오류:', err);
    }
  };

  // 댓글 입력 변경 처리
  const handleCommentInputChange = (feedId, commentText) => {
    setFeeds(feeds.map(feed => 
      feed.feedId === feedId 
        ? { ...feed, newComment: commentText } 
        : feed
    ));
  };

  // 댓글 제출 처리
  const handleCommentSubmit = async (feedId, commentText) => {
    if (!currentUser || !commentText.trim()) return;
    
    try {
      // API 호출로 댓글 추가
      const newComment = await socialApi.addComment(feedId, currentUser.userId, commentText);
      
      // 피드의 댓글 목록 업데이트
      setFeeds(feeds.map(feed => {
        if (feed.feedId === feedId) {
          const updatedComments = [...feed.comments, newComment];
          return {
            ...feed,
            comments: updatedComments,
            commentCount: updatedComments.length,
            newComment: '' // 입력 필드 초기화
          };
        }
        return feed;
      }));
    } catch (err) {
      console.error('댓글 추가 오류:', err);
    }
  };

  // 댓글 삭제 처리
  const handleCommentDelete = async (feedId, commentId) => {
    if (!currentUser) return;
    
    try {
      await socialApi.deleteComment(feedId, commentId);
      
      // 피드의 댓글 목록에서 삭제된 댓글 제거
      setFeeds(feeds.map(feed => {
        if (feed.feedId === feedId) {
          const updatedComments = feed.comments.filter(
            comment => comment.commentId !== commentId
          );
          return {
            ...feed,
            comments: updatedComments,
            commentCount: updatedComments.length
          };
        }
        return feed;
      }));
    } catch (err) {
      console.error('댓글 삭제 오류:', err);
    }
  };

  return {
    loading,
    error,
    feeds,
    toggleComments,
    toggleCaption,
    handleLike,
    handleUnlike,
    handleDelete,
    handleCommentInputChange,
    handleCommentSubmit,
    handleCommentDelete,
    refreshFeeds
  };
};

export default useFeedData;