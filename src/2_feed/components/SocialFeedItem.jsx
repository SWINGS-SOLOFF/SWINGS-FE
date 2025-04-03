import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';

const SocialFeedItem = ({ 
  feed, 
  currentUser, 
  viewedUserId,
  userProfileData,
  onLike, 
  onUnlike, 
  onDelete, 
  onToggleComments, 
  onToggleCaption,
  onCommentChange,
  onCommentSubmit,
  onCommentDelete,
  onImageClick
}) => {
  
  // 이미지 URL 정규화 함수
  const normalizeImageUrl = (url) => {
    if (!url) return '/default-image.jpg';
    // 이미 절대 URL인 경우 그대로 반환
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // 상대 경로인 경우 기본 URL 추가
    return url.startsWith('/') ? url : `/${url}`;
  };

  // 댓글 입력 변경 처리
  const handleCommentInputChange = (feedId, value) => {
    if (onCommentChange) {
      onCommentChange(feedId, value);
    }
  };

  // 댓글 제출 처리
  const handleCommentSubmit = (feedId, comment) => {
    if (onCommentSubmit) {
      onCommentSubmit(feedId, comment);
    }
  };

  // 댓글 삭제 처리
  const handleCommentDelete = (commentId, feedId) => {
    if (onCommentDelete) {
      onCommentDelete(commentId, feedId);
    }
  };

  // 피드 삭제 처리
  const handleDeleteFeed = (feedId) => {
    if (onDelete) {
      onDelete(feedId);
    }
  };

  // 캡션 토글 처리
  const handleToggleCaption = (feedId) => {
    if (onToggleCaption) {
      onToggleCaption(feedId);
    }
  };

  // 좋아요/좋아요 취소 처리
  const handleLike = (feedId) => {
    if (feed.isLiked) {
      onUnlike(feedId);
    } else {
      onLike(feedId);
    }
  };

  // 댓글 토글 처리
  const handleToggleComments = (feedId) => {
    if (onToggleComments) {
      onToggleComments(feedId);
    }
  };

  // 이미지 클릭 처리
  const handleImageClick = (imageUrl) => {
    if (onImageClick) {
      onImageClick(imageUrl);
    }
  };

  return (
    <motion.div
      key={feed.feedId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="transform transition-all duration-300 hover:translate-y-[-2px]"
    >
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        {/* 피드 이미지 */}
        {feed.imageUrl && (
          <div
            className="relative w-full h-80 overflow-hidden cursor-pointer group"
            onClick={() => handleImageClick(normalizeImageUrl(feed.imageUrl))}
          >
            <img
              src={normalizeImageUrl(feed.imageUrl)}
              alt="피드 이미지"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>
        )}

        <div className="p-6">
          {/* 프로필 정보 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img
                src={userProfileData?.profilePic || normalizeImageUrl('/images/default-profile.jpg')}
                alt="프로필"
                className="w-12 h-12 rounded-full mr-4 object-cover border border-gray-200 shadow-sm"
              />
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {userProfileData?.username || userProfileData?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(feed.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* 삭제 버튼 */}
            {currentUser?.userId === viewedUserId && (
              <button
                onClick={() => handleDeleteFeed(feed.feedId)}
                className="text-red-500 p-2 rounded-full hover:bg-red-50 transition group"
              >
                <FaTrash className="group-hover:scale-110 transition" />
              </button>
            )}
          </div>

          {/* 피드 내용 */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed text-base font-light tracking-wide">
              {feed.isLongCaption && !feed.showFullCaption
                ? `${feed.caption.substring(0, 100)}...`
                : feed.caption}
            </p>
            {feed.isLongCaption && (
              <button
                onClick={() => handleToggleCaption(feed.feedId)}
                className="text-gray-600 text-sm font-medium mt-2 hover:text-black transition"
              >
                {feed.showFullCaption ? '내용접기' : '내용더보기'}
              </button>
            )}
          </div>

          {/* 좋아요 및 댓글 섹션 */}
          <div className="flex items-center justify-between text-gray-600 border-t border-b py-3 mb-4">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleLike(feed.feedId)}
                className="flex items-center space-x-2 hover:text-red-500 transition group"
              >
                <span className="text-xl group-hover:scale-110 transition">
                  {feed.isLiked ? '❤️' : '🤍'}
                </span>
                <span className="text-sm">{feed.likes}</span>
              </button>
              <button
                onClick={() => handleToggleComments(feed.feedId)}
                className="flex items-center space-x-2 hover:text-blue-500 transition group"
              >
                <span className="text-xl group-hover:scale-110 transition">💬</span>
                <span className="text-sm">{feed.commentCount}</span>
              </button>
            </div>
          </div>

          {/* 댓글 섹션 */}
          {feed.showComments && (
            <div className="border-t pt-4 mt-4">
              {/* 댓글 목록 */}
              <div className="max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {feed.comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">아직 댓글이 없습니다.</p>
                ) : (
                  feed.comments.map(comment => (
                    <div
                      key={comment.commentId}
                      className="flex items-center justify-between mb-3 pb-3 border-b last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={comment.userAvatarUrl || normalizeImageUrl('/images/default-profile.jpg')}
                          alt="댓글 작성자"
                          className="w-9 h-9 rounded-full object-cover border"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-700">{comment.username}</p>
                          <p className="text-gray-600">{comment.content}</p>
                        </div>
                      </div>
                      {currentUser?.userId === comment.userId && (
                        <button
                          onClick={() => handleCommentDelete(comment.commentId, feed.feedId)}
                          className="text-red-400 hover:text-red-600 transition"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* 댓글 입력 */}
              <div className="mt-4 flex space-x-2">
                <input
                  type="text"
                  placeholder="댓글을 입력하세요..."
                  className="flex-grow border border-gray-200 rounded-lg p-2 focus:border-gray-500 transition"
                  value={feed.newComment || ''}
                  onChange={(e) => handleCommentInputChange(feed.feedId, e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && feed.newComment) {
                      handleCommentSubmit(feed.feedId, feed.newComment);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (feed.newComment) {
                      handleCommentSubmit(feed.feedId, feed.newComment);
                    }
                  }}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  등록
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SocialFeedItem;