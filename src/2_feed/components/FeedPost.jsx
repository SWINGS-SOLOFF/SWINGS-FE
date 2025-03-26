import React, { useState } from 'react';
import {
    FaHeart, FaRegHeart, FaTrash, FaUser, FaComment,
    FaPaperPlane, FaTimesCircle
} from 'react-icons/fa';
import { normalizeImageUrl } from '../utils/imageUtils';

const FeedPost = ({
                      post,
                      currentUser,
                      onLike,
                      onUnlike,
                      onDelete,
                      onToggleComments,
                      onCommentDelete,
                      onCommentSubmit
                  }) => {
    const [newComment, setNewComment] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onCommentSubmit(post.feedId, newComment);
            setNewComment('');
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffMinutes < 1) return '방금 전';
        if (diffMinutes < 60) return `${diffMinutes}분 전`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}시간 전`;
        return `${Math.floor(diffMinutes / 1440)}일 전`;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-100 transition-all duration-300 ease-in-out hover:shadow-xl">
            {/* 포스트 헤더 - 더 세련된 디자인 */}
            <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-white">
                <div className="w-14 h-14 rounded-full bg-green-100 border-3 border-green-300 overflow-hidden flex items-center justify-center mr-4 shadow-md">
                    {post.avatarUrl ? (
                        <img
                            src={post.avatarUrl}
                            alt={post.username || "사용자"}
                            className="w-full h-full object-cover transition transform hover:scale-110"
                        />
                    ) : (
                        <FaUser className="text-3xl text-green-700 opacity-70" />
                    )}
                </div>
                <div className="flex-grow">
                    <p className="font-bold text-green-900 text-xl tracking-tight">
                        {post.username || "사용자"}
                    </p>
                    <p className="text-sm text-gray-500 font-light">
                        {post.createdAt ? formatTimeAgo(post.createdAt) : ""}
                    </p>
                </div>
                <button
                    onClick={() => onDelete(post.feedId)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"
                    aria-label="게시물 삭제"
                >
                    <FaTimesCircle className="text-xl" />
                </button>
            </div>

            {/* 이미지 섹션 - 더 부드러운 전환 효과 */}
            {post.imageUrl && (
                <div className="w-full overflow-hidden">
                    <img
                        src={normalizeImageUrl(post.imageUrl)}
                        alt="피드 내용"
                        className="w-full object-cover max-h-96 transition transform hover:scale-105 duration-300"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-image.jpg";
                        }}
                    />
                </div>
            )}

            {/* 포스트 콘텐츠 - 타이포그래피 개선 */}
            <div className="p-5 bg-green-50/50">
                <div className="mb-4">
                    <p className="text-gray-800 leading-relaxed">
                        <span className="font-semibold text-green-900 mr-3"></span>
                        {post.caption}
                    </p>
                </div>
                <p className="font-medium text-green-800 text-sm">
                    <FaHeart className="inline-block mr-2 text-red-400" />
                    {post.likes || 0}명이 이 게시물을 좋아합니다
                </p>
            </div>

            {/* 좋아요 버튼 - 더 인터랙티브한 디자인 */}
            <div className="flex p-3 bg-green-100/30">
                <button
                    onClick={() => (post.liked ? onUnlike(post.feedId) : onLike(post.feedId))}
                    className="flex-1 flex justify-center items-center text-3xl hover:bg-green-200 transition-all duration-200 py-3 rounded-lg mx-1 group"
                >
                    {post.liked ? (
                        <FaHeart className="text-red-500 group-hover:scale-110 transition" />
                    ) : (
                        <FaRegHeart className="text-green-700 group-hover:text-green-900 transition" />
                    )}
                </button>
            </div>

            {/* 댓글 섹션 */}
            <div className="bg-green-50/30 border-t border-green-200">
                <div className="p-4">
                    <button
                        onClick={() => {
                            onToggleComments(post.feedId);
                            setIsExpanded(!isExpanded);
                        }}
                        className="w-full text-center text-green-700 font-semibold hover:text-green-900 transition flex items-center justify-center"
                    >
                        <FaComment className="mr-2" />
                        {post.showComments ? '댓글 숨기기' : `댓글 ${post.comments?.length || 0}개 보기`}
                    </button>
                </div>

                {post.showComments && (
                    <>
                        <div className="p-4 max-h-64 overflow-y-auto">
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map(comment => (
                                    <div
                                        key={comment.commentId}
                                        className="flex items-start mb-4 pb-4 border-b border-green-200 last:border-b-0 hover:bg-green-100/50 rounded-lg p-2 transition"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center mr-3 flex-shrink-0">
                                            {comment.userAvatarUrl ? (
                                                <img
                                                    src={comment.userAvatarUrl}
                                                    alt={comment.username}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <FaUser className="text-green-700" />
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center mb-1">
                                                <p className="font-semibold text-green-900 text-sm mr-2">
                                                    {comment.username || '사용자'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatTimeAgo(comment.createdAt)}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-800 leading-relaxed">
                                                {comment.content}
                                            </p>
                                        </div>
                                        {currentUser.userId === comment.userId && (
                                            <button
                                                onClick={() => onCommentDelete(comment.commentId, post.feedId)}
                                                className="text-red-400 hover:text-red-600 ml-2 transition"
                                                aria-label="댓글 삭제"
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-6 bg-green-100/30 rounded-lg">
                                    <FaComment className="mx-auto mb-3 text-green-500 text-3xl" />
                                    <p className="text-sm">아직 댓글이 없습니다. 첫 댓글의 주인공이 되어보세요!</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-green-200 bg-white">
                            <form onSubmit={handleCommentSubmit} className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3 shadow-sm">
                                    <FaUser className="text-green-700 text-xl" />
                                </div>
                                <div className="flex-grow relative">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="댓글을 입력하세요..."
                                        className="w-full p-3 pl-4 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition"
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
                                    className="ml-3 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 disabled:bg-green-300 transition flex items-center justify-center"
                                >
                                    <FaPaperPlane />
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FeedPost;