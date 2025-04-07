import React from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaComment, FaTrash } from "react-icons/fa";

const SocialFeedItem = ({
  feed,
  currentUser,
  viewedUserId,
  onLike,
  onUnlike,
  onDelete,
  onImageClick,
}) => {
  // 이미지 URL 정규화 함수
  const normalizeImageUrl = (url) => {
    if (!url) return "/default-image.jpg";
    // 이미 절대 URL인 경우 그대로 반환
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // 상대 경로인 경우 기본 URL 추가
    return url.startsWith("/") ? url : `/${url}`;
  };

  // 피드 삭제 처리
  const handleDeleteFeed = (e, feedId) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (onDelete) {
      onDelete(feedId);
    }
  };

  // 좋아요/좋아요 취소 처리
  const handleLike = (e, feedId) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    if (feed.isLiked) {
      onUnlike(feedId);
    } else {
      onLike(feedId);
    }
  };

  // 이미지 클릭 처리
  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(feed);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="aspect-square relative overflow-hidden cursor-pointer group"
      onClick={handleImageClick}
    >
      {/* 피드 이미지 */}
      <img
        src={normalizeImageUrl(feed.imageUrl || "/default-image.jpg")}
        alt="피드 이미지"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex items-center space-x-6 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* 좋아요 카운트 */}
          <div className="flex items-center text-white">
            <span className="text-xl mr-2">❤️</span>
            <span className="font-medium">{feed.likes}</span>
          </div>

          {/* 댓글 카운트 */}
          <div className="flex items-center text-white">
            <span className="text-xl mr-2">💬</span>
            <span className="font-medium">{feed.commentCount}</span>
          </div>
        </div>
      </div>

      {/* 만약 현재 사용자가 피드 작성자라면 삭제 버튼 표시 */}
      {currentUser?.userId === viewedUserId && (
        <button
          onClick={(e) => handleDeleteFeed(e, feed.feedId)}
          className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
        >
          <FaTrash className="text-sm" />
        </button>
      )}

      {/* 좋아요 버튼 (선택적으로 표시) */}
      <button
        onClick={(e) => handleLike(e, feed.feedId)}
        className="absolute bottom-2 left-2 p-2 bg-black bg-opacity-50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
      >
        {feed.isLiked ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-white" />
        )}
      </button>
    </motion.div>
  );
};

export default SocialFeedItem;
