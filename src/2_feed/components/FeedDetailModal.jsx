import React, { useRef, useEffect, useState } from "react";
import {
  FaTimes,
  FaTrash,
  FaPaperPlane,
  FaUser,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaPen,
  FaEllipsisV,
  FaEdit,
} from "react-icons/fa";
import LikedUsersModal from "./LikedUsersModal";
import feedApi from "../api/feedApi";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { normalizeImageUrl } from "../utils/imageUtils";
import socialApi from "../api/socialApi";
import { processFeed } from "../utils/feedUtils";
import ImageModal from "./ImageModal";

const FeedDetailModal = ({
  feed,
  currentUser,
  onClose,
  onLikeToggle,
  onDelete,
  onShowLikedBy,
  onCommentSubmit,
  onCommentDelete,
  setSelectedFeed,
  updateFeedInState,
}) => {
  const [newComment, setNewComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLikedByModal, setShowLikedByModal] = useState(false);
  const [likedByUsers, setLikedByUsers] = useState([]);
  const [authorProfile, setAuthorProfile] = useState(null);
  const [expandedCommentIds, setExpandedCommentIds] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedCaption, setEditedCaption] = useState(feed.caption || "");
  const [editedFile, setEditedFile] = useState(null);
  const [showPostDropdown, setShowPostDropdown] = useState(false);

  const modalRef = useRef(null);
  const commentInputRef = useRef(null);
  const commentsContainerRef = useRef(null);
  const captionRef = useRef(null);
  const [isCaptionLong, setIsCaptionLong] = useState(false);
  const [localFeed, setLocalFeed] = useState(processFeed(feed));

  useEffect(() => {
    const fetchAuthor = async () => {
      if (feed?.userId) {
        try {
          const profile = await socialApi.getProfile(feed.userId);
          setAuthorProfile(profile);
        } catch (err) {
          console.error("작성자 프로필 로딩 실패", err);
        }
      }
    };
    fetchAuthor();
  }, [feed?.userId]);

  useEffect(() => {
    if (captionRef.current) {
      const lineHeight = parseInt(
        getComputedStyle(captionRef.current).lineHeight
      );
      const captionHeight = captionRef.current.scrollHeight;
      const lines = captionHeight / lineHeight;
      setIsCaptionLong(lines > 10);
    }
  }, [feed?.caption]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideModal =
        modalRef.current && !modalRef.current.contains(event.target);
      const isOutsideLikedUsersModal =
        !event.target.closest(".liked-users-modal");

      if (isOutsideModal && isOutsideLikedUsersModal) {
        onClose();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (showLikedByModal) setShowLikedByModal(false);
        else onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose, showLikedByModal]);

  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop =
        commentsContainerRef.current.scrollHeight;
    }
  }, [feed?.comments?.length]);

  useEffect(() => {
    if (feed) {
      const processed = processFeed(feed);

      processed.comments = processed.comments
        .map((c) => ({
          ...c,
          userProfilePic: c.userProfilePic ?? null,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setLocalFeed(processed);
    }
  }, [feed]);

  const handleLikeToggle = async () => {
    if (!currentUser || !localFeed) return;
    const nextLiked = !localFeed.liked;
    const updatedFeed = {
      ...localFeed,
      liked: nextLiked,
      likes: nextLiked ? localFeed.likes + 1 : localFeed.likes - 1,
    };
    setLocalFeed(updatedFeed);
    try {
      const result = await onLikeToggle?.(localFeed.feedId, localFeed.liked);
      if (result) {
        setLocalFeed((prev) => ({ ...prev, ...result }));
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      setLocalFeed(feed);
    }
  };

  const handlePostEditSubmit = async () => {
    const formData = new FormData();
    formData.append("caption", editedCaption);
    if (editedFile) formData.append("file", editedFile);

    try {
      const updated = await feedApi.updateFeed(feed.feedId, {
        caption: editedCaption,
        file: editedFile,
      });

      setLocalFeed((prev) => ({ ...prev, ...updated }));

      updateFeedInState?.(updated);
      setSelectedFeed(processFeed(updated));
      setIsEditingPost(false);
      setShowPostDropdown(false);
    } catch (err) {
      console.error("게시물 수정 실패:", err);
    }
  };

  const handleShowLikedBy = async (feedId) => {
    try {
      const users = await feedApi.getLikedUsers(feedId);
      setLikedByUsers(users);
      setShowLikedByModal(true);
    } catch (err) {
      console.error("❌ 좋아요 목록 불러오기 실패:", err);
    }
  };

  const toggleCommentExpand = (commentId) => {
    setExpandedCommentIds((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting || !feed) return;
    setIsSubmitting(true);
    try {
      const newCommentRes = await onCommentSubmit?.(feed.feedId, newComment);
      setNewComment("");

      setLocalFeed((prev) => ({
        ...prev,
        comments: [
          ...prev.comments,
          {
            ...newCommentRes,
            username: newCommentRes.username ?? currentUser?.username ?? "익명",
            userProfilePic:
              newCommentRes.userProfilePic ?? currentUser?.userImg ?? null,
          },
        ],
      }));
    } catch (err) {
      console.error("❌ 댓글 추가 실패:", err);
    } finally {
      setIsSubmitting(false);
      commentInputRef.current?.focus();
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!feed) return;
    try {
      await onCommentDelete?.(feed.feedId, commentId);
    } catch (err) {
      console.error("❌ 댓글 삭제 실패:", err);
    }
  };

  const handleDeleteConfirm = async () => {
    console.log("🚀 handleDeleteConfirm 실행됨");
    if (!feed?.feedId) {
      console.warn("❗ feedId 없음:", feed);
      return;
    }

    try {
      await onDelete(feed.feedId);
      setShowConfirm(false);
      onClose();
    } catch (err) {
      console.error("❌ 게시물 삭제 실패", err);
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
  const hasImage = !!feed.imageUrl;

  return (
    <div className="relative z-60">
      {" "}
      {/* 삭제 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
          <DeleteConfirmModal
            visible={true}
            onCancel={() => setShowConfirm(false)}
            onConfirm={handleDeleteConfirm}
          />
        </div>
      )}
      <div className="fixed inset-0 z-[9980] bg-black bg-opacity-80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
        {showLikedByModal && (
          <div className="liked-users-modal z-60">
            <LikedUsersModal
              users={likedByUsers}
              onClose={() => setShowLikedByModal(false)}
            />
          </div>
        )}
        <div
          ref={modalRef}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col md:flex-row"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 bg-white/90 hover:bg-white rounded-full p-2 text-gray-700 hover:text-black transition-colors duration-200 shadow-md"
            aria-label="닫기"
          >
            <FaTimes size={20} />
          </button>

          {hasImage && (
            <div
              className="w-full md:w-1/2 bg-black max-h-[80vh] overflow-hidden flex justify-center items-center"
              onClick={() => setSelectedImage(feed.imageUrl)}
              style={{ height: "300px", flexShrink: 0 }}
            >
              <img
                src={feed.imageUrl}
                alt="게시물 이미지"
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div
            className="flex flex-col flex-1 overflow-hidden"
            style={{
              height: hasImage
                ? "calc(85vh - 50vh - 130px)"
                : "calc(85vh - 130px)",
            }}
          >
            <div className="flex items-center w-full px-4 py-3 border-b border-gray-100">
              <img
                src={normalizeImageUrl(
                  authorProfile?.userImg || "/default-profile.jpg"
                )}
                alt={authorProfile?.username || "익명"}
                className="w-9 h-9 rounded-full object-cover border border-gray-200"
              />

              <div className="ml-3 flex-1 min-w-0">
                <p className="font-bold text-black text-sm truncate">
                  {authorProfile?.username || "익명"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {formatTimeAgo(feed.createdAt)}
                </p>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                {currentUser?.userId === feed.userId && (
                  <div className="relative">
                    <button
                      onClick={() => setShowPostDropdown(!showPostDropdown)}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
                    >
                      <FaEllipsisV size={14} />
                    </button>
                    {showPostDropdown && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-10">
                        <button
                          onClick={() => {
                            setIsEditingPost(true);
                            setShowPostDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          <FaEdit className="inline mr-2" /> 수정
                        </button>
                        <button
                          onClick={() => {
                            console.log("🧪 삭제 버튼 클릭됨");
                            setShowConfirm(true);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <FaTrash className="inline mr-2" /> 삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="bg-white/90 hover:bg-white rounded-full p-2 text-gray-700 hover:text-black transition-colors duration-200 shadow-md"
                  aria-label="닫기"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            <div
              className="flex flex-col flex-1 overflow-hidden"
              style={{ height: "calc(85vh - 130px)" }}
            >
              {isEditingPost ? (
                <div className="px-4 py-3 space-y-4 bg-gray-50 border-b border-gray-200">
                  <label className="block">
                    <span className="text-sm text-gray-700 font-semibold">
                      이미지 변경
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditedFile(e.target.files[0])}
                      className="mt-1 block w-full text-sm border p-2 rounded"
                    />
                  </label>

                  <textarea
                    value={editedCaption}
                    onChange={(e) => setEditedCaption(e.target.value)}
                    placeholder="내용을 입력하세요..."
                    className="w-full p-3 border rounded resize-none text-sm"
                    rows={4}
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setIsEditingPost(false);
                        setEditedFile(null);
                        setEditedCaption(feed.caption || "");
                      }}
                      className="px-4 py-2 bg-gray-200 rounded text-sm"
                    >
                      취소
                    </button>
                    <button
                      onClick={handlePostEditSubmit}
                      className="px-4 py-2 bg-black text-white rounded text-sm"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                feed.caption && (
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <div
                      ref={captionRef}
                      className={`text-black whitespace-pre-wrap leading-relaxed font-medium break-words cursor-pointer relative transition-all duration-300 ${
                        isExpanded ? "" : "line-clamp-[5]"
                      }`}
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {feed.caption}
                      {!isExpanded && isCaptionLong && (
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                      )}
                    </div>
                  </div>
                )
              )}

              <div className="px-4 py-2 border-b border-gray-100 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLikeToggle}
                      className={`flex items-center gap-2 p-1.5 rounded-full transition ${
                        localFeed.liked
                          ? "text-red-500 hover:bg-red-50"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      aria-label={localFeed.liked ? "좋아요 취소" : "좋아요"}
                    >
                      {localFeed.liked ? (
                        <FaHeart size={18} className="fill-current" />
                      ) : (
                        <FaRegHeart size={18} />
                      )}
                    </button>

                    {/* ❤️ 하트 옆 숫자 (빨간색) */}
                    <button
                      onClick={() => onShowLikedBy?.(localFeed.feedId)}
                      className="text-sm font-semibold text-red-500 hover:text-red-700 transition"
                    >
                      {localFeed.likes || 0}
                    </button>

                    {/* 🗨️ 댓글 아이콘과 숫자 */}
                    <div className="flex items-center ml-4 text-gray-600 text-sm">
                      <FaComment className="mr-1" />
                      <span>{localFeed.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 댓글 전체 영역 */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* 댓글 목록 (스크롤 가능 영역) */}
                <div
                  ref={commentsContainerRef}
                  className="flex-1 overflow-y-auto px-3 space-y-2"
                >
                  {localFeed.comments?.length > 0 ? (
                    localFeed.comments.map((comment) => {
                      const isExpanded = expandedCommentIds.includes(
                        comment.commentId
                      );
                      const isEditing = editingCommentId === comment.commentId;

                      return (
                        <div
                          key={comment.commentId}
                          className="flex items-start gap-2 py-1.5 border-b border-gray-100 last:border-0"
                        >
                          {/* 프로필 */}
                          <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                            {comment.userProfilePic ? (
                              <img
                                src={normalizeImageUrl(comment.userProfilePic)}
                                alt={comment.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaUser className="text-gray-600" size={12} />
                            )}
                          </div>

                          {/* 닉네임 + 시간 + 수정삭제 + 내용 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-black">
                                  {comment.username}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatTimeAgo(comment.createdAt)}
                                </p>
                              </div>

                              {currentUser?.userId === comment.userId && (
                                <div className="relative ml-2">
                                  <button
                                    onClick={() =>
                                      setExpandedCommentIds((prev) =>
                                        prev.includes(comment.commentId)
                                          ? prev.filter(
                                              (id) => id !== comment.commentId
                                            )
                                          : [...prev, comment.commentId]
                                      )
                                    }
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                  >
                                    <FaEllipsisV size={12} />
                                  </button>

                                  {expandedCommentIds.includes(
                                    comment.commentId
                                  ) && (
                                    <div className="absolute right-0 mt-1 w-28 bg-white border rounded shadow-lg z-10">
                                      <button
                                        onClick={() => {
                                          setEditingCommentId(
                                            comment.commentId
                                          );
                                          setEditedComment(comment.content);
                                          setExpandedCommentIds([]);
                                        }}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                      >
                                        수정
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleDeleteComment(
                                            comment.commentId
                                          );
                                          setExpandedCommentIds([]);
                                        }}
                                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                                      >
                                        삭제
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {isEditing ? (
                              <div className="flex gap-2 mt-1">
                                <input
                                  value={editedComment}
                                  onChange={(e) =>
                                    setEditedComment(e.target.value)
                                  }
                                  className="flex-1 border px-2 py-1 text-sm rounded"
                                />
                                <button
                                  onClick={async () => {
                                    try {
                                      const updated =
                                        await feedApi.updateComment(
                                          feed.feedId,
                                          comment.commentId,
                                          editedComment
                                        );
                                      setLocalFeed((prev) => ({
                                        ...prev,
                                        comments: prev.comments.map((c) =>
                                          c.commentId === comment.commentId
                                            ? updated
                                            : c
                                        ),
                                      }));
                                      setEditingCommentId(null);
                                      setEditedComment("");
                                    } catch (err) {
                                      console.error("댓글 수정 실패", err);
                                    }
                                  }}
                                  className="text-white bg-indigo-600 hover:bg-indigo-700 rounded px-2 py-1 text-xs"
                                >
                                  저장
                                </button>
                              </div>
                            ) : (
                              <p
                                className={`text-sm text-black break-words whitespace-pre-wrap leading-relaxed cursor-pointer relative transition-all duration-300 ${
                                  isExpanded ? "" : "line-clamp-3"
                                }`}
                                onClick={() =>
                                  toggleCommentExpand(comment.commentId)
                                }
                              >
                                {comment.content}
                                {!isExpanded &&
                                  comment.content.split("\n").length > 3 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                                  )}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <FaComment className="text-gray-300 text-3xl mb-2" />
                      <p className="text-gray-500 text-sm">
                        첫 댓글을 남겨보세요!
                      </p>
                    </div>
                  )}
                </div>

                {/* 댓글 입력창 - 항상 하단 고정 */}
                <div
                  className="px-3 py-2 border-t bg-white shadow-md shrink-0"
                  style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
                >
                  <form onSubmit={handleSubmit} className="flex items-center">
                    <input
                      ref={commentInputRef}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="댓글을 입력하세요..."
                      className="w-full py-1.5 px-3 border border-gray-300 rounded-full text-sm text-black focus:ring-2 focus:ring-black focus:border-transparent transition"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmitting}
                      className={`ml-2 p-2 rounded-full ${
                        newComment.trim() && !isSubmitting
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      } transition flex items-center justify-center`}
                    >
                      <FaPaperPlane size={12} />
                    </button>
                  </form>
                  {selectedImage && (
                    <div className="fixed inset-0 z-[9999]">
                      <ImageModal
                        imageUrl={selectedImage}
                        onClose={() => setSelectedImage(null)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedDetailModal;
