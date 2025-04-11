import React, { useRef, useEffect, useState } from "react";
import {
  FaTimes,
  FaTrash,
  FaPaperPlane,
  FaUser,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import LikedUsersModal from "./LikedUsersModal";
import feedApi from "../api/feedApi";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { normalizeImageUrl } from "../utils/imageUtils";
import socialApi from "../api/socialApi";
import { processFeed } from "../utils/feedUtils";

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
}) => {
  const [newComment, setNewComment] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLikedByModal, setShowLikedByModal] = useState(false);
  const [likedByUsers, setLikedByUsers] = useState([]);
  const [authorProfile, setAuthorProfile] = useState(null);

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

      processed.comments = processed.comments.map((c) => ({
        ...c,
        userProfilePic: c.userProfilePic ?? null,
      }));

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

  const handleShowLikedBy = async (feedId) => {
    try {
      const users = await feedApi.getLikedUsers(feedId);
      setLikedByUsers(users);
      setShowLikedByModal(true);
    } catch (err) {
      console.error("❌ 좋아요 목록 불러오기 실패:", err);
    }
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
    try {
      await onDelete(feed.feedId);
      onClose();
    } catch (err) {
      console.error("❌ 게시물 삭제 실패:", err);
      setShowConfirm(false);
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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <DeleteConfirmModal
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDeleteConfirm}
      />

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
        className={`relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col ${
          hasImage ? "md:flex-row" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feed-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 bg-white/90 hover:bg-white rounded-full p-2 text-gray-700 hover:text-black transition-colors duration-200 shadow-md"
          aria-label="닫기"
        >
          <FaTimes size={20} />
        </button>

        {hasImage && (
          <div className="w-full md:w-3/5 bg-gray-900 flex items-center justify-center relative h-80 sm:h-96 md:h-auto overflow-hidden">
            <img
              src={feed.imageUrl}
              alt="게시물 이미지"
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        )}

        <div
          className={`w-full ${
            hasImage ? "md:w-2/5" : ""
          } flex flex-col bg-white max-h-[85vh] relative`}
        >
          <div className="flex items-center space-x-2 w-full">
            <img
              src={normalizeImageUrl(
                authorProfile?.userImg || "/default-profile.jpg"
              )}
              alt={authorProfile?.username || "익명"}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />

            <div className="flex-1">
              <p className="font-bold text-black text-sm">
                {authorProfile?.username || "익명"}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimeAgo(feed.createdAt)}
              </p>

              {currentUser?.userId === feed.userId && (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="mt-1 text-xs text-red-500 hover:underline hover:text-red-700 transition"
                >
                  삭제
                </button>
              )}
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto flex flex-col"
            style={{ height: "calc(85vh - 130px)" }}
          >
            {/* 게시글 내용 - 접기/펼치기 기능 추가 */}
            {feed.caption && (
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div
                  ref={captionRef}
                  className={`text-black whitespace-pre-wrap leading-relaxed font-medium ${
                    isCaptionLong && !isExpanded
                      ? "max-h-[10em] overflow-hidden relative"
                      : ""
                  }`}
                >
                  {feed.caption}
                  {isCaptionLong && !isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
                  )}
                </div>

                {isCaptionLong && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition font-medium"
                  >
                    {isExpanded ? (
                      <>
                        <FaChevronUp size={14} />
                        <span>접기</span>
                      </>
                    ) : (
                      <>
                        <FaChevronDown size={14} />
                        <span>더 보기</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            <div className="px-4 py-2 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between">
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
                <button
                  onClick={() => onShowLikedBy?.(localFeed.feedId)}
                  className="text-sm text-blue-600 font-medium hover:underline hover:text-blue-800 transition"
                >
                  {localFeed.likes || 0}명이 좋아합니다
                </button>
              </div>
            </div>

            {/* 댓글 영역 */}
            <div
              className="overflow-y-auto px-3 space-y-2"
              ref={commentsContainerRef}
              style={{
                flex: 1,
                maxHeight: "calc(100vh - 400px)",
                overflowY: "auto",
              }}
            >
              {localFeed.comments?.length > 0 ? (
                localFeed.comments.map((comment) => (
                  <div
                    key={comment.commentId}
                    className="flex items-start gap-2 py-1.5 border-b border-gray-100 last:border-0"
                  >
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap">
                        <p className="text-xs font-bold text-black">
                          {comment.username}
                        </p>
                        <p className="text-xs text-gray-500 ml-auto">
                          {formatTimeAgo(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-sm text-black break-words">
                        {comment.content}
                      </p>
                    </div>
                    {currentUser?.userId === comment.userId && (
                      <button
                        onClick={() => handleDeleteComment(comment.commentId)}
                        className="text-red-500 text-sm hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition"
                        aria-label="댓글 삭제"
                      >
                        <FaTrash size={10} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <FaComment className="text-gray-300 text-3xl mb-2" />
                  <p className="text-gray-500 text-sm">첫 댓글을 남겨보세요!</p>
                </div>
              )}
            </div>

            {/* 댓글 입력 영역 - 하단 고정 */}
            <div className="px-3 py-2 border-t sticky bottom-0 bg-white shadow-md mt-auto">
              <form onSubmit={handleSubmit} className="flex items-center">
                <div className="flex-grow relative">
                  <input
                    ref={commentInputRef}
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="w-full py-1.5 px-3 border border-gray-300 rounded-full text-sm text-black focus:ring-2 focus:ring-black focus:border-transparent transition"
                    aria-label="댓글 입력"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className={`ml-2 p-2 rounded-full ${
                    newComment.trim() && !isSubmitting
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  } transition flex items-center justify-center`}
                  aria-label="댓글 전송"
                >
                  <FaPaperPlane size={12} />
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
