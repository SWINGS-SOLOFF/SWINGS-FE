import React, { useRef, useEffect } from "react";
import {
  FaTimes,
  FaTrash,
  FaPaperPlane,
  FaUser,
  FaHeart,
  FaRegComment,
} from "react-icons/fa";

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
  const modalRef = useRef(null);

  // 모달 외부 클릭시 닫기 기능 구현
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

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

  // 게시글만 있는 경우와 이미지가 포함된 경우의 레이아웃 구분
  const hasImage = !!feed.imageUrl;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={`relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col ${
          hasImage ? "md:flex-row" : ""
        }`}
      >
        {/* 닫기 버튼 - 항상 오른쪽 상단에 고정 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 text-gray-700 hover:text-black transition-colors duration-200 shadow-md"
        >
          <FaTimes size={20} />
        </button>

        {/* 이미지 영역 (이미지가 있을 경우) */}
        {hasImage && (
          <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative h-64 md:h-auto">
            <img
              src={feed.imageUrl}
              alt="피드 이미지"
              className="w-full h-full object-cover md:object-contain"
            />
          </div>
        )}

        {/* 상세 내용 */}
        <div
          className={`w-full ${
            hasImage ? "md:w-1/2" : ""
          } flex flex-col bg-white`}
        >
          {/* 상단 헤더 - 닫기 버튼 제거하고 프로필 정보만 표시 */}
          <div className="flex items-center p-4 border-b">
            <div className="flex items-center space-x-3">
              <img
                src={feed.userProfilePic || "/default-profile.jpg"}
                alt="프로필"
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <div>
                <p className="font-bold text-black">{feed.username}</p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(feed.createdAt)}
                </p>
                {currentUser?.userId === feed.userId && (
                  <button
                    onClick={() => {
                      onDelete(feed.feedId);
                      onClose();
                    }}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors duration-200 mt-1"
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 게시글 본문 */}
          <div className="flex-1 overflow-y-auto">
            {/* 텍스트만 있는 경우 더 큰 폰트와 여백으로 보여줌 */}
            {!hasImage && (
              <div className="p-6 border-b">
                <p className="text-black text-lg font-medium whitespace-pre-wrap leading-relaxed">
                  {feed.caption || "내용 없음"}
                </p>
              </div>
            )}

            {/* 이미지가 있는 경우 캡션 */}
            {hasImage && feed.caption && (
              <div className="p-4 border-b">
                <p className="text-black text-sm whitespace-pre-wrap">
                  {feed.caption}
                </p>
              </div>
            )}

            {/* 좋아요 정보 */}
            <div className="px-4 py-2 border-t border-gray-100 bg-white">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <button
                  onClick={handleLikeToggle}
                  className="flex items-center gap-1 text-red-500"
                >
                  <FaHeart
                    className={`text-sm ${
                      feed.isLiked ? "fill-current" : "opacity-50"
                    }`}
                  />
                </button>
                <button
                  onClick={() => onShowLikedBy && onShowLikedBy(feed.feedId)}
                  className="text-sm text-blue-600 font-medium hover:underline hover:text-blue-800 transition cursor-pointer"
                >
                  {feed.likes || 0}명이 좋아합니다
                </button>
              </div>
            </div>

            {/* 댓글 영역 */}
            <div className="overflow-y-auto p-4 space-y-3 max-h-64">
              <h3 className="font-medium text-gray-900 mb-2">댓글</h3>
              {feed.comments?.length > 0 ? (
                feed.comments.map((comment) => (
                  <div
                    key={comment.commentId}
                    className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {comment.userProfilePic ? (
                        <img
                          src={comment.userProfilePic}
                          alt={comment.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-gray-600" />
                      )}
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
                      <p className="text-sm text-black mt-1">
                        {comment.content}
                      </p>
                    </div>
                    {currentUser?.userId === comment.userId && (
                      <button
                        onClick={() =>
                          onCommentDelete(feed.feedId, comment.commentId)
                        }
                        className="text-red-500 text-sm hover:text-red-700 transition-colors duration-200"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 py-2">
                  첫 댓글을 남겨보세요!
                </p>
              )}
            </div>

            {/* 댓글 입력 */}
            <div className="p-4 border-t sticky bottom-0 bg-white">
              <form onSubmit={handleSubmit} className="flex items-center">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="w-full p-3 border border-gray-300 rounded-full text-sm text-black focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className={`ml-2 p-3 rounded-full shadow ${
                    newComment.trim()
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  } transition-colors duration-200`}
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedDetailModal;
