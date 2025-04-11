import React, { useState, useEffect, useRef } from "react";
import {
  FaTrash,
  FaUser,
  FaComment,
  FaPaperPlane,
  FaTimes,
  FaEllipsisV,
  FaEdit,
} from "react-icons/fa";
import { normalizeImageUrl } from "../utils/imageUtils";
import { useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";
import DeleteConfirmModal from "./DeleteConfirmModal";
import feedApi from "../api/feedApi";

const FeedPost = ({
  post,
  onLike,
  onUnlike,
  currentUser,
  onDelete,
  onEdit,
  onToggleComments,
  onCommentDelete,
  onCommentSubmit,
  onImageClick,
  onShowLikedBy,
  likeLoading = {},
  updatePostInState,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCommentIds, setExpandedCommentIds] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLikesList, setShowLikesList] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption || "");
  const [editedFile, setEditedFile] = useState(null);

  const navigate = useNavigate();
  const contentRef = useRef(null);
  const commentRefs = useRef({});

  const [isContentTruncated, setIsContentTruncated] = useState(false);
  const [commentTruncatedState, setCommentTruncatedState] = useState({});

  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 메뉴 표시 여부

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleEditClick = () => {
    setShowDropdown(false);
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setShowDropdown(false);
    setShowDeleteConfirm(true);
  };

  useEffect(() => {
    if (contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > 80;
      setIsContentTruncated(isOverflowing);
    }

    const newTruncatedState = {};
    Object.keys(commentRefs.current).forEach((commentId) => {
      if (commentRefs.current[commentId]) {
        newTruncatedState[commentId] =
          commentRefs.current[commentId].scrollHeight > 80;
      }
    });
    setCommentTruncatedState(newTruncatedState);
  }, [post.caption, post.comments]);

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
    if (post.userId) navigate(`/swings/profile/${post.userId}`);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await onCommentSubmit(post.feedId, newComment);
      setNewComment("");
    } catch (err) {
      console.error("❌ 댓글 추가 실패:", err);
    }
  };

  const toggleCommentExpand = (commentId) => {
    setExpandedCommentIds((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const confirmDelete = () => {
    onDelete(post.feedId);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleLikesClick = () => {
    onShowLikedBy && onShowLikedBy(post.feedId);
  };

  const handleCommentsClick = () => {
    onToggleComments(post.feedId);
    setShowLikesList(false); // 댓글 클릭 시 좋아요 목록 버튼 숨김
  };

  const sortedComments = [...(post.comments || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // 이미지가 있는지 확인
  const hasImage = post.image || post.imageUrl;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out hover:shadow-xl relative">
      <div className="flex items-center justify-between px-4 py-2 text-sm bg-white border-b border-gray-100">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleProfileClick}
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {post.userProfilePic ? (
              <img
                src={normalizeImageUrl(post.userProfilePic)}
                alt="프로필"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-gray-600 text-lg" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-700 text-sm font-medium">
              {post.username || "사용자"}
            </span>
            <span className="text-xs text-gray-400">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>
        </div>

        {currentUser?.userId?.toString() === post?.userId?.toString() && (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-gray-400 hover:text-gray-600 ml-2 transition w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
              aria-label="게시물 설정"
            >
              <FaEllipsisV className="text-lg" />
            </button>

            {/* 드롭다운 메뉴 */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={handleEditClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <FaEdit className="mr-2" /> 게시물 수정
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <FaTrash className="mr-2" /> 게시물 삭제
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        visible={showDeleteConfirm}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

      {isEditing ? (
        <div className="p-6 bg-gray-50">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.append("caption", editedCaption);
              if (editedFile) formData.append("file", editedFile);

              try {
                const updated = await feedApi.updateFeed(post.feedId, {
                  caption: editedCaption,
                  file: editedFile,
                });

                updatePostInState(updated);
                setIsEditing(false);
              } catch (err) {
                console.error("게시물 수정 실패:", err);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-gray-800 transition-all duration-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditedFile(e.target.files[0])}
                  className="hidden"
                />
                이미지 선택
              </label>
              {(editedFile || post.image || post.imageUrl) && (
                <div className="mt-4 border rounded-lg overflow-hidden">
                  <img
                    src={
                      editedFile
                        ? URL.createObjectURL(editedFile)
                        : normalizeImageUrl(post.image || post.imageUrl)
                    }
                    alt="미리보기"
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}
            </div>

            <textarea
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              placeholder="게시물 내용을 입력하세요..."
              className="w-full border border-gray-300 rounded-lg p-4 text-sm text-black"
              rows={4}
              maxLength={500}
            ></textarea>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {(post.image || post.imageUrl) && (
            <>
              <div
                className="w-full overflow-hidden cursor-pointer relative group"
                onClick={() =>
                  onImageClick(normalizeImageUrl(post.image || post.imageUrl))
                }
              >
                <img
                  src={normalizeImageUrl(post.image || post.imageUrl)}
                  alt="게시물 이미지"
                  className="w-full object-cover max-h-96 transition transform group-hover:scale-105 duration-300"
                />
              </div>
              <div className="p-4">
                <div
                  ref={contentRef}
                  className={`text-base font-medium text-gray-800 break-words whitespace-pre-wrap font-serif ${
                    !isExpanded
                      ? "line-clamp-1 relative cursor-pointer"
                      : "cursor-pointer"
                  }`}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {post.caption || "게시물 내용이 없습니다."}
                  {!isExpanded && isContentTruncated && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  )}
                </div>
              </div>
            </>
          )}

          {!post.image && !post.imageUrl && (
            <div className="px-4 py-8 bg-white">
              <div className="w-full">
                <div
                  ref={contentRef}
                  className={`w-full min-h-40 max-w-lg mx-auto p-8 rounded-lg bg-gray-50 border border-gray-100 text-center shadow-sm ${
                    !isExpanded
                      ? "max-h-48 overflow-hidden relative cursor-pointer"
                      : "cursor-pointer"
                  }`}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <div className="text-base font-medium text-gray-800 break-words whitespace-pre-wrap font-serif">
                    {post.caption || "게시물 내용이 없습니다."}
                  </div>
                  {!isExpanded && isContentTruncated && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="px-4 py-2 border-t border-gray-100 bg-white">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <LikeButton
                liked={post.liked}
                likeCount={post.likes}
                onLike={async () => {
                  const updated = await onLike(post.feedId);
                  if (updated && updatePostInState) updatePostInState(updated);
                }}
                onUnlike={async () => {
                  const updated = await onUnlike(post.feedId);
                  if (updated && updatePostInState) updatePostInState(updated);
                }}
                isLoading={likeLoading[post.feedId]}
                showCount={false}
              />
              <button
                onClick={handleLikesClick}
                className="ml-2 text-sm font-medium text-red-600 hover:text-red-800 transition cursor-pointer" /* 빨간색으로 변경 */
              >
                {post.likes || 0}
              </button>
            </div>

            <div
              className="flex items-center cursor-pointer"
              onClick={handleCommentsClick}
            >
              <FaComment className="text-gray-600 mr-1" />
              <span className="text-sm">{post.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {post.showComments && (
        <div className="bg-white border-t border-gray-100">
          <div className="p-4 max-h-64 overflow-y-auto">
            {sortedComments.length > 0 ? (
              sortedComments.map((comment) => {
                const isExpanded = expandedCommentIds.includes(
                  comment.commentId
                );
                return (
                  <div
                    key={comment.commentId}
                    className="flex items-start mb-4 pb-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 rounded-lg p-2 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                      {comment.userProfilePic ? (
                        <img
                          src={normalizeImageUrl(comment.userProfilePic)}
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
                      <p
                        ref={(el) =>
                          (commentRefs.current[comment.commentId] = el)
                        }
                        className={`text-sm text-black font-medium leading-relaxed bg-white p-2 rounded-lg ${
                          isExpanded ? "" : "line-clamp-3 relative"
                        } cursor-pointer border border-transparent hover:border-gray-200`}
                        onClick={() => toggleCommentExpand(comment.commentId)}
                      >
                        {comment.content}
                        {!isExpanded &&
                          commentTruncatedState[comment.commentId] && (
                            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                          )}
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
                        <FaTrash className="text-sm text-red-600" />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-6 bg-gray-50/50 rounded-lg">
                <FaComment className="mx-auto mb-3 text-gray-500 text-3xl" />
                <p className="text-sm">
                  아직 댓글이 없습니다. 첫 댓글의 주인공이 되어보세요!
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-white">
            <form onSubmit={handleCommentSubmit} className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mr-3 shadow-sm">
                <FaUser className="text-gray-700 text-xl" />
              </div>
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  className="w-full p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black text-sm transition text-black"
                  maxLength={300}
                />
                <div className="absolute right-3 bottom-1 text-xs text-gray-500">
                  {newComment.length}/300
                </div>
              </div>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className={`ml-3 ${
                  !newComment.trim()
                    ? "bg-gray-400"
                    : "bg-black hover:bg-gray-800"
                } text-white p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group`}
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedPost;
