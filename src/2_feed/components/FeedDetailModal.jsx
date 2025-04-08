import React from "react";
import { FaTimes, FaTrash, FaPaperPlane, FaUser, FaEye } from "react-icons/fa";
import LikeButton from "./LikeButton";

const FeedDetailModal = ({
  feed,
  currentUser,
  onClose,
  onLikeToggle,
  onDelete,
  onShowLikedBy,
  onCommentSubmit,
  onCommentDelete,
}) => {
  const [newComment, setNewComment] = React.useState("");

  const handleLikeToggle = () => {
    if (!currentUser) return;
    onLikeToggle?.(feed.feedId, feed.isLiked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onCommentSubmit(feed.feedId, newComment);
      setNewComment("");
    }
  };

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 1) return "방금 전";
    if (diff < 60) return `${diff}분 전`;
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
    return `${Math.floor(diff / 1440)}일 전`;
  };

  if (!feed) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
        {/* 이미지 or 텍스트 */}
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center">
          {feed.imageUrl ? (
            <img
              src={feed.imageUrl}
              alt="피드 이미지"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-black text-sm p-6 text-center whitespace-pre-wrap">
              {feed.caption || "내용 없음"}
            </div>
          )}
        </div>

        {/* 상세 내용 */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
          {/* 상단 헤더 */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <img
                src={feed.userProfilePic || "/default-profile.jpg"}
                alt="프로필"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-bold text-black">{feed.username}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* 게시글 본문 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {feed.imageUrl && (
              <p className="text-black text-sm whitespace-pre-wrap">
                {feed.caption}
              </p>
            )}

            {/* 댓글 */}
            <div className="space-y-3">
              {feed.comments?.length > 0 ? (
                feed.comments.map((comment) => (
                  <div
                    key={comment.commentId}
                    className="flex items-start gap-3"
                  >
                    <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaUser className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-black font-bold">
                          {comment.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-sm text-black mt-1 bg-gray-50 p-2 rounded-lg border-l-2 border-black">
                        {comment.content}
                      </p>
                    </div>
                    {currentUser?.userId === comment.userId && (
                      <button
                        onClick={() =>
                          onCommentDelete(feed.feedId, comment.commentId)
                        }
                        className="text-red-500 text-sm"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">댓글이 없습니다.</p>
              )}
            </div>
          </div>

          {/* 좋아요 / 삭제 / 댓글입력 */}
          <div className="p-4 border-t space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <LikeButton
                  liked={feed.isLiked}
                  likeCount={feed.likes ?? 0}
                  onLike={handleLikeToggle}
                  onUnlike={handleLikeToggle}
                />
                <button
                  onClick={() => {
                    onClose();
                    onShowLikedBy(feed.feedId);
                  }}
                  className="text-gray-700 hover:text-black text-sm flex items-center space-x-1"
                >
                  <FaEye />
                  <span>목록</span>
                </button>
              </div>
              {currentUser?.userId === feed.userId && (
                <button
                  onClick={() => {
                    onDelete(feed.feedId);
                    onClose();
                  }}
                  className="text-xs text-red-500"
                >
                  삭제
                </button>
              )}
            </div>

            {/* 댓글 입력 */}
            <form onSubmit={handleSubmit} className="flex items-center">
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="w-full p-3 border border-gray-300 rounded-full text-sm text-black"
                />
              </div>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="ml-2 bg-black text-white p-3 rounded-full shadow hover:opacity-90"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedDetailModal;
