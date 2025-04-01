import React, { useState } from 'react';
import {
    FaHeart, FaRegHeart, FaTrash, FaUser, FaComment,
    FaPaperPlane, FaTimesCircle, FaEye
} from 'react-icons/fa';
import { normalizeImageUrl } from '../utils/imageUtils';
import { useNavigate } from 'react-router-dom';

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
                      likeLoading = {}
                  }) => {
    const [newComment, setNewComment] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    // ... (previous methods remain the same)

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 transition-all duration-300 ease-in-out hover:shadow-xl">
            {/* Delete Button - More Refined */}
            {currentUser.userId === post.userId && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(post.feedId);
                    }}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-red-500 p-2 rounded-full bg-white/70 hover:bg-red-50 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out group"
                    aria-label="게시물 삭제"
                >
                    <FaTimesCircle className="text-xl group-hover:rotate-180 transition-transform duration-300" />
                </button>
            )}

            {/* Like Button - Enhanced Interaction */}
            <div className="flex items-center space-x-3 px-4 py-3">
                <button
                    onClick={() => (post.liked ? onUnlike(post.feedId) : onLike(post.feedId))}
                    disabled={likeLoading[post.feedId]}
                    className={`relative group transition-all duration-300 ease-in-out transform ${
                        likeLoading[post.feedId]
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:scale-110 active:scale-95'
                    }`}
                >
                    {post.liked ? (
                        <FaHeart
                            className="text-red-500 text-2xl drop-shadow-md group-hover:drop-shadow-xl group-active:text-red-600 transition-all"
                            style={{
                                filter: 'brightness(1.1) saturate(1.2)',
                                animation: 'pulse 0.5s'
                            }}
                        />
                    ) : (
                        <FaRegHeart
                            className="text-gray-400 text-2xl group-hover:text-gray-600 group-hover:scale-110 transition-all drop-shadow-sm"
                        />
                    )}
                    {/* Subtle pulse effect for liked state */}
                    {post.liked && (
                        <span
                            className="absolute -inset-2 bg-red-200/30 rounded-full animate-ping"
                            style={{ animationDuration: '1.5s' }}
                        />
                    )}
                </button>
                <span
                    className={`text-sm transition-colors ${
                        post.liked ? 'text-red-600 font-semibold' : 'text-gray-600'
                    }`}
                >
                    {post.likes || 0}
                </span>
            </div>

            {/* View Likes Button - More Interactive */}
            {post.likes > 0 && (
                <button
                    onClick={() => onShowLikedBy && onShowLikedBy(post.feedId)}
                    className="ml-4 mb-4 flex items-center text-sm text-green-700 hover:text-green-900 bg-green-50 px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-all group"
                >
                    <FaEye className="mr-2 group-hover:animate-pulse" />
                    좋아요 보기
                </button>
            )}

            {/* Comment Toggle Button - More Engaging */}
            <div className="bg-green-50/30 border-t border-green-200">
                <button
                    onClick={() => {
                        onToggleComments(post.feedId);
                        setIsExpanded(!isExpanded);
                    }}
                    className={`w-full text-center py-3 transition-all duration-300 ease-in-out 
                        ${post.showComments
                        ? 'bg-green-100 text-green-900 hover:bg-green-200'
                        : 'text-green-700 hover:bg-green-100 hover:text-green-900'
                    }`}
                >
                    <div className="flex items-center justify-center">
                        <FaComment className="mr-2 transition-transform group-hover:scale-110" />
                        {post.showComments
                            ? '댓글 숨기기'
                            : `댓글 ${post.comments?.length || 0}개 보기`
                        }
                    </div>
                </button>
            </div>

            {/* Comment Submit Button - More Sophisticated */}
            <button
                type="submit"
                disabled={!newComment.trim()}
                className={`ml-3 bg-gradient-to-r 
                    ${newComment.trim()
                    ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                    : 'from-gray-200 to-gray-300 text-gray-500'
                } 
                    p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group`}
            >
                <FaPaperPlane className="group-hover:animate-[send_0.5s_ease-in-out]" />
            </button>

            {/* Add custom animations in a style tag */}
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                @keyframes send {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(5px); }
                    100% { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default FeedPost;