import React, { useState, useEffect, useRef } from "react";
import {
  FaHeart,
  FaTrash,
  FaUser,
  FaComment,
  FaPaperPlane,
  FaTimesCircle,
  FaEye,
} from "react-icons/fa";
import { normalizeImageUrl } from "../utils/imageUtils";
import { useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton.jsx";

const FeedPost = ({
  post,
  onLike,
  onUnlike,
  currentUser,
  onDelete,
  onToggleComments,
  onCommentDelete,
  onCommentSubmit,
  onImageClick,
  onShowLikedBy,
  likeLoading = {},
}) => {
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [isContentTruncated, setIsContentTruncated] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > 80;
      setIsContentTruncated(isOverflowing);
    }
  }, [post.caption]);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffMinutes < 1) return "방금 전";
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}시간 전`;
    return `${Math.floor(diffMinutes / 1440)}일 전`;
  };

  const handleProfileClick = () => {
    if (post.userId) {
      navigate(`/swings/profile/${post.userId}`);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onCommentSubmit(post.feedId, newComment);
      setNewComment("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-xl relative">
      {/* 이미지 */}
      {(post.image || post.imageUrl) && (
        <div
          className="w-full overflow-hidden cursor-pointer relative group"
          onClick={() => onImageClick(post)}
        >
          <img
            src={post.image || normalizeImageUrl(post.imageUrl)}
            alt="게시물 이미지"
            className="w-full object-cover max-h-96 transition transform group-hover:scale-105 duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.jpg";
            }}
          />
        </div>
      )}

      {/* 프로필 + 게시글 */}
      <div className="p-4 flex items-start">
        <div className="mr-4 flex flex-col items-center">
          <div
            className="w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-300 overflow-hidden flex items-center justify-center cursor-pointer"
            onClick={handleProfileClick}
          >
            {post.userProfilePic || post.avatarUrl ? (
              <img
                src={post.userProfilePic || post.avatarUrl}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-2xl text-gray-700" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {post.username || "사용자"}
          </p>
        </div>

        <div
          className="flex-1 relative cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <p
            ref={contentRef}
            className={`text-sm text-gray-800 break-words whitespace-pre-wrap ${
              !isExpanded ? "line-clamp-3" : ""
            }`}
          >
            {post.caption || "게시물 내용이 없습니다."}
          </p>
          {!isExpanded && isContentTruncated && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* 좋아요 정보 및 액션 버튼 */}
      <div className="bg-white px-4 py-2 flex items-center justify-between border-t border-gray-100">
        <p className="font-medium text-gray-800 text-sm flex items-center">
          <FaHeart className="inline-block mr-2 text-red-400" />
          {post.likes || 0}명이 좋아합니다
        </p>
        {post.likes > 0 && (
          <button
            onClick={() => onShowLikedBy && onShowLikedBy(post.feedId)}
            className="text-gray-700 hover:text-black text-lg"
          >
            <FaEye />
          </button>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center space-x-2 px-4 pb-4 bg-white">
        <LikeButton
          liked={post.liked}
          likeCount={post.likes}
          onLike={() => onLike(post.feedId)}
          onUnlike={() => onUnlike(post.feedId)}
          isLoading={likeLoading[post.feedId]}
        />
        <button
          onClick={() => onToggleComments(post.feedId)}
          className="flex-1 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors duration-300 flex items-center justify-center"
        >
          <FaComment className="mr-2" /> 댓글 {post.comments?.length || 0}개
        </button>
      </div>

      {/* 댓글 영역 */}
      {post.showComments && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="p-4 max-h-64 overflow-y-auto">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div
                  key={comment.commentId}
                  className="flex items-start mb-4 pb-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-100/50 rounded-lg p-2 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                    {comment.userAvatarUrl ? (
                      <img
                        src={comment.userAvatarUrl}
                        alt={comment.username}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FaUser className="text-gray-700" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center mb-1">
                      <p className="font-semibold text-gray-900 text-sm mr-2">
                        {comment.username || "사용자"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(comment.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm text-black font-medium leading-relaxed bg-gray-50 p-2 rounded-lg border-l-2 border-black">
                      {comment.content}
                    </p>
                  </div>
                  {currentUser.userId === comment.userId && (
                    <button
                      onClick={() =>
                        onCommentDelete(comment.commentId, post.feedId)
                      }
                      className="text-gray-400 hover:text-red-600 ml-2 transition"
                      aria-label="댓글 삭제"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-6 bg-gray-100/50 rounded-lg">
                <FaComment className="mx-auto mb-3 text-gray-500 text-3xl" />
                <p className="text-sm">
                  아직 댓글이 없습니다. 첫 댓글의 주인공이 되어보세요!
                </p>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleCommentSubmit} className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3 shadow-sm">
                <FaUser className="text-gray-700 text-xl" />
              </div>
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="w-full p-3 pl-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black text-sm transition text-black"
                  maxLength={300}
                />
                {newComment.length > 0 && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                    {newComment.length}/300
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="ml-3 bg-black hover:bg-gray-800 text-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group"
              >
                <FaPaperPlane className="group-hover:animate-[send_0.5s_ease-in-out]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedPost;
