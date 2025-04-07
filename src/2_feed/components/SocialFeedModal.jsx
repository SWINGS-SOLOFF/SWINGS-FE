import React from "react";
import { FaComment, FaHeart, FaSpinner } from "react-icons/fa";
import { normalizeImageUrl } from "../utils/imageUtils";

const SocialFeedModal = ({
  feed,
  currentUser,
  likeLoading,
  onClose,
  onLike,
  onUnlike,
  onDelete,
  onToggleComments,
  onShowLikedBy,
  onCommentSubmit,
  onCommentDelete,
}) => {
  if (!feed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row">
        {/* 이미지 또는 텍스트 */}
        {feed.imageUrl ? (
          <div className="w-full md:w-1/2 bg-black flex items-center justify-center max-h-[50vh] md:max-h-[90vh]">
            <img
              src={feed.imageUrl}
              alt={feed.caption}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 max-h-[90vh] overflow-y-auto">
            <p className="text-xl font-medium text-center text-gray-800 whitespace-pre-wrap leading-relaxed break-words">
              {feed.caption || "내용 없음"}
            </p>
          </div>
        )}

        {/* 내용 영역 */}
        <div className="w-full md:w-1/2 flex flex-col h-full max-h-[40vh] md:max-h-[90vh]">
          {/* 헤더 */}
          <div className="p-4 border-b flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <img
                src={
                  feed.userProfilePic ||
                  normalizeImageUrl("/images/default-profile.jpg")
                }
                alt={feed.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{feed.username || "익명"}</p>
              {feed.location && (
                <p className="text-xs text-gray-500">{feed.location}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>

          {/* 댓글 */}
          <div className="flex-1 overflow-y-auto p-4 border-b">
            <h3 className="font-semibold text-gray-700 mb-3">댓글</h3>
            {feed.comments?.length > 0 ? (
              feed.comments.map((comment) => (
                <div key={comment.commentId} className="mb-3 flex">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                    <img
                      src={
                        comment.userProfilePic ||
                        normalizeImageUrl("/images/default-profile.jpg")
                      }
                      alt={comment.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-black">
                      <span className="font-semibold mr-2">
                        {comment.username}
                      </span>
                      {comment.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {currentUser &&
                    (currentUser.userId === comment.userId ||
                      currentUser.userId === feed.userId) && (
                      <button
                        onClick={() =>
                          onCommentDelete(comment.commentId, feed.feedId)
                        }
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        삭제
                      </button>
                    )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                아직 댓글이 없습니다.
              </p>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() =>
                  feed.isLiked ? onUnlike(feed.feedId) : onLike(feed.feedId)
                }
                className="flex items-center space-x-1 group"
                disabled={likeLoading[feed.feedId]}
              >
                {likeLoading[feed.feedId] ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaHeart
                    className={`text-xl transition-colors duration-200 ${
                      feed.isLiked
                        ? "text-red-500"
                        : "text-gray-400 group-hover:text-red-300"
                    }`}
                  />
                )}
                <span className="font-medium">
                  {feed.likeCount || feed.likes || 0}
                </span>
              </button>

              <button
                onClick={() => onShowLikedBy(feed.feedId)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                좋아요 목록
              </button>

              <button
                onClick={() => onToggleComments(feed.feedId)}
                className="flex items-center space-x-1"
              >
                <FaComment className="text-gray-500" />
                <span className="font-medium">{feed.commentCount || 0}</span>
              </button>
            </div>

            {currentUser?.userId === feed.userId && (
              <button
                onClick={() => {
                  onDelete(feed.feedId);
                  onClose();
                }}
                className="text-xs text-red-500 hover:text-red-700 border border-red-300 px-3 py-1 rounded-full transition"
              >
                게시물 삭제
              </button>
            )}
          </div>

          {/* 댓글 입력 */}
          {currentUser && (
            <div className="p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const comment = e.target.comment.value;
                  if (comment.trim()) {
                    onCommentSubmit(feed.feedId, comment);
                    e.target.comment.value = "";
                  }
                }}
                className="flex"
              >
                <input
                  type="text"
                  name="comment"
                  placeholder="댓글 추가..."
                  className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-black"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-r-lg px-4 hover:bg-blue-600 transition-colors"
                >
                  게시
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialFeedModal;
