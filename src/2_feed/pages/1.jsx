import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSpinner, FaTrash, FaUserFriends, FaTimes } from 'react-icons/fa';
import SocialProfile from '../components/SocialProfile';
import ImageModal from '../components/ImageModal';
import {
    getIntroduce, getFollowers, getFollowings, getFeedCount,
    isFollowing, followUser, unfollowUser, updateIntroduce, getProfile,
} from '../api/socialApi.js';
import feedApi from "../api/feedApi.js";
import socialApi from '../../2_feed/api/socialApi';
import { normalizeImageUrl } from '../utils/imageUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SocialPage = () => {
    // URL Parameter
    const { userId } = useParams();
    const viewedUserId = userId ? Number(userId) : null;

    // 현재 로그인한 사용자 상태
    const [currentUser, setCurrentUser] = useState(null);

    // State management
    const [state, setState] = useState({
        loading: true,
        error: null,
        userProfile: null,
        feeds: [],
        userIntroduce: '',
        userStats: { posts: 0, followers: 0, following: 0 },
        editingIntroduce: false,
        introduceInput: '',
        isFollowingState: false,
        selectedImage: null,
        showFollowersList: false,
        showFollowingList: false,
        followers: [],
        followings: [],
    });

    // Destructure state for readability
    const {
        loading, error, userProfile, feeds, userIntroduce, userStats,
        editingIntroduce, introduceInput, isFollowingState, selectedImage,
        showFollowersList, showFollowingList, followers, followings
    } = state;

    // 현재 사용자 정보 가져오기
    const fetchCurrentUser = async () => {
        try {
            const userData = await feedApi.getCurrentUser();
            setCurrentUser(userData);
        } catch (error) {
            console.error("❌ 사용자 정보를 가져오는 데 실패했습니다.", error);
            toast.error("사용자 정보를 가져오는 데 실패했습니다.");
        }
    };

    // 컴포넌트 마운트 시 사용자 정보 불러오기
    useEffect(() => {
        fetchCurrentUser();
    }, []);

    // Helper to update state
    const updateState = (updates) => {
        setState(prevState => ({ ...prevState, ...updates }));
    };

    // 사용자 정보 변경 또는 viewedUserId 변경시 프로필 데이터 가져오기
    useEffect(() => {
        if (currentUser && viewedUserId) {
            fetchProfileData();
        }
    }, [viewedUserId, currentUser]);

    // Main data fetching function
    const fetchProfileData = async () => {
        if (!currentUser || !viewedUserId) return;

        try {
            updateState({ loading: true });

            // Fetch all data in parallel
            const [
                profileData,
                introduce,
                followersData,
                followingsData,
                feedCount,
                followStatus,
                feedsData,
            ] = await Promise.all([
                getProfile(viewedUserId),
                getIntroduce(viewedUserId),
                getFollowers(viewedUserId),
                getFollowings(viewedUserId),
                getFeedCount(viewedUserId),
                isFollowing(currentUser.userId, viewedUserId),
                feedApi.getUserFeeds(viewedUserId),
            ]);

            const feedsWithComments = await fetchFeedsWithComments(feedsData);

            // Process feeds for UI display
            const processedFeeds = feedsWithComments.map(feed => ({
                ...feed,
                isLongCaption: feed.caption && feed.caption.length > 100,
                showFullCaption: false
            }));

            // Update state with all fetched data
            updateState({
                userProfile: profileData,
                userIntroduce: introduce || '',
                introduceInput: introduce || '',
                followers: followersData || [],
                followings: followingsData || [],
                userStats: {
                    posts: feedCount || 0,
                    followers: followersData?.length || 0,
                    following: followingsData?.length || 0,
                },
                isFollowingState: followStatus === '팔로우 중입니다.',
                feeds: processedFeeds,
                loading: false
            });
        } catch (err) {
            console.error('프로필 데이터 로딩 오류:', err);
            updateState({
                error: '데이터를 불러오는 데 실패했습니다.',
                loading: false
            });
            toast.error('프로필 데이터를 불러오는 데 실패했습니다.');
        }
    };

    // Fetch comments for feeds
    const fetchFeedsWithComments = async (feedsData) => {
        if (!feedsData || feedsData.length === 0) return [];

        try {
            return await Promise.all(
                feedsData.map(async (feed) => {
                    try {
                        const comments = await feedApi.getCommentsByFeedId(feed.feedId);
                        return {
                            ...feed,
                            comments,
                            commentCount: comments.length,
                            likes: feed.likes || feed.likeCount || 0,
                            showComments: false,
                            newComment: '',
                            isLiked: feed.isLiked || false,
                        };
                    } catch (err) {
                        console.error(`댓글 로딩 실패 (feedId: ${feed.feedId}):`, err);
                        return {
                            ...feed,
                            comments: [],
                            commentCount: 0,
                            likes: feed.likes || feed.likeCount || 0,
                            showComments: false,
                            newComment: '',
                            isLiked: feed.isLiked || false,
                        };
                    }
                })
            );
        } catch (error) {
            console.error('전체 댓글 로딩 중 오류 발생:', error);
            return feedsData.map(feed => ({
                ...feed,
                comments: [],
                commentCount: 0,
                likes: feed.likes || feed.likeCount || 0,
                showComments: false,
                newComment: '',
                isLiked: feed.isLiked || false,
            }));
        }
    };

    // User List Modal Component
    const UserListModal = ({ users, onClose, title }) => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white w-96 max-h-[500px] rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="bg-black text-white p-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center">
                        <FaUserFriends className="mr-2" />
                        {title} ({users.length})
                    </h3>
                    <button
                        onClick={onClose}
                        className="hover:bg-gray-800 p-2 rounded-full transition"
                    >
                        <FaTimes className="text-white" />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[400px]">
                    {users.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <FaUserFriends className="mx-auto text-4xl mb-4 text-gray-300" />
                            <p>{title === '팔로워' ? '아직 팔로워가 없습니다.' : '아직 팔로잉하는 사용자가 없습니다.'}</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {users.map((user) => (
                                <li
                                    key={user.userId}
                                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <img
                                        src={user.profilePic || normalizeImageUrl('/swings/images/default-profile.jpg')}
                                        alt="프로필"
                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">{user.username}</p>
                                        <p className="text-xs text-gray-500">{user.description || 'SWINGS'}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );

    // EVENT HANDLERS

    // Image click handler
    const handleImageClick = (imageUrl) => {
        updateState({ selectedImage: imageUrl });
    };

    // Follow toggle handler
    const handleFollowToggle = async () => {
        if (!currentUser) return;

        try {
            if (isFollowingState) {
                await unfollowUser(currentUser.userId, viewedUserId);
                updateState({
                    isFollowingState: false,
                    userStats: {
                        ...userStats,
                        followers: Math.max(0, userStats.followers - 1)
                    }
                });
                toast.success('팔로우가 취소되었습니다.');
            } else {
                await followUser(currentUser.userId, viewedUserId);
                updateState({
                    isFollowingState: true,
                    userStats: {
                        ...userStats,
                        followers: userStats.followers + 1
                    }
                });
                toast.success('팔로우 했습니다.');
            }
        } catch (err) {
            console.error('팔로우/언팔로우 중 오류:', err);
            toast.error('팔로우/언팔로우에 실패했습니다.');
        }
    };

    // Like handler
    const handleLike = async (feedId) => {
        try {
            await feedApi.likeFeed(feedId, currentUser?.userId);
            updateState({
                feeds: feeds.map(feed =>
                    feed.feedId === feedId
                        ? { ...feed, likes: feed.likes + 1, isLiked: true }
                        : feed
                )
            });
        } catch (error) {
            console.error('좋아요 중 오류 발생:', error);
            toast.error('좋아요 처리에 실패했습니다.');
        }
    };

    // Unlike handler
    const handleUnlike = async (feedId) => {
        try {
            await feedApi.unlikeFeed(feedId, currentUser?.userId);
            updateState({
                feeds: feeds.map(feed =>
                    feed.feedId === feedId
                        ? { ...feed, likes: feed.likes - 1, isLiked: false }
                        : feed
                )
            });
        } catch (error) {
            console.error('좋아요 취소 중 오류 발생:', error);
            toast.error('좋아요 취소에 실패했습니다.');
        }
    };

    // Feed delete handler
    const handleDeleteFeed = async (feedId) => {
        const confirmDelete = window.confirm('정말로 이 피드를 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await feedApi.deleteFeed(feedId);
                updateState({
                    feeds: feeds.filter(feed => feed.feedId !== feedId),
                    userStats: {
                        ...userStats,
                        posts: Math.max(0, userStats.posts - 1)
                    }
                });
                toast.success('피드가 삭제되었습니다.');
            } catch (error) {
                console.error('피드 삭제 중 오류 발생:', error);
                toast.error('피드 삭제에 실패했습니다.');
            }
        }
    };

    // Comments toggle handler
    const handleToggleComments = (feedId) => {
        updateState({
            feeds: feeds.map(feed =>
                feed.feedId === feedId
                    ? { ...feed, showComments: !feed.showComments }
                    : feed
            )
        });
    };

    // Comment submit handler
    const handleCommentSubmit = async (feedId, comment) => {
        if (!comment.trim()) return;
        try {
            const commentData = await feedApi.addComment(feedId, currentUser.userId, comment);
            updateState({
                feeds: feeds.map(feed =>
                    feed.feedId === feedId
                        ? {
                            ...feed,
                            comments: [...feed.comments, commentData],
                            commentCount: feed.commentCount + 1,
                            newComment: ''
                        }
                        : feed
                )
            });
            toast.success('댓글이 추가되었습니다.');
        } catch (error) {
            console.error('댓글 추가 중 오류 발생:', error);
            toast.error('댓글 추가에 실패했습니다.');
        }
    };

    // Comment delete handler
    const handleCommentDelete = async (commentId, feedId) => {
        try {
            await feedApi.deleteComment(feedId, commentId);
            updateState({
                feeds: feeds.map(feed =>
                    feed.feedId === feedId
                        ? {
                            ...feed,
                            comments: feed.comments.filter(comment => comment.commentId !== commentId),
                            commentCount: feed.commentCount - 1
                        }
                        : feed
                )
            });
            toast.success('댓글이 삭제되었습니다.');
        } catch (error) {
            console.error('댓글 삭제 중 오류 발생:', error);
            toast.error('댓글 삭제에 실패했습니다.');
        }
    };

    // Caption toggle handler
    const handleToggleCaption = (feedId) => {
        updateState({
            feeds: feeds.map(feed =>
                feed.feedId === feedId
                    ? { ...feed, showFullCaption: !feed.showFullCaption }
                    : feed
            )
        });
    };

    // Introduce save handler
    const handleIntroduceSave = async () => {
        try {
            await updateIntroduce(viewedUserId, introduceInput);
            updateState({
                userIntroduce: introduceInput,
                editingIntroduce: false
            });
            toast.success('자기소개가 업데이트되었습니다.');
        } catch (err) {
            console.error('Introduce update error:', err);
            toast.error('자기소개 업데이트 중 오류 발생');
        }
    };

    // Comment input change handler
    const handleCommentInputChange = (feedId, value) => {
        updateState({
            feeds: feeds.map(feed =>
                feed.feedId === feedId
                    ? { ...feed, newComment: value }
                    : feed
            )
        });
    };

    // Profile props for SocialProfile component
    const profileProps = {
        user: userProfile,
        userStats,
        userIntroduce: editingIntroduce ? introduceInput : userIntroduce,
        editing: editingIntroduce,
        onIntroduceChange: (value) => updateState({ introduceInput: value }),
        onEditingToggle: () => updateState({ editingIntroduce: !editingIntroduce }),
        onIntroduceSave: handleIntroduceSave,
        isCurrentUser: currentUser?.userId === viewedUserId,
        isFollowing: isFollowingState,
        onFollowToggle: handleFollowToggle,
        onShowFollowers: () => updateState({ showFollowersList: true }),
        onShowFollowing: () => updateState({ showFollowingList: true }),
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="text-gray-800 flex flex-col items-center">
                    <FaSpinner className="animate-spin text-5xl mb-3" />
                    <p className="text-lg font-light">프로필을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="text-red-600 bg-white p-8 rounded-xl shadow-lg max-w-md">
                    <p className="text-xl mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    // Render feed item
    const renderFeedItem = (feed) => (
        <motion.div
            key={feed.feedId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="transform transition-all duration-300 hover:translate-y-[-2px]"
        >
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                {/* Feed image */}
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
                    {/* Profile info */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <img
                                src={userProfile?.profilePic || normalizeImageUrl('/swings/images/default-profile.jpg')}
                                alt="프로필"
                                className="w-12 h-12 rounded-full mr-4 object-cover border border-gray-200 shadow-sm"
                            />
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">
                                    {userProfile?.username}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {new Date(feed.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        
                        {/* Delete button */}
                        {currentUser?.userId === viewedUserId && (
                            <button
                                onClick={() => handleDeleteFeed(feed.feedId)}
                                className="text-red-500 p-2 rounded-full hover:bg-red-50 transition group"
                            >
                                <FaTrash className="group-hover:scale-110 transition" />
                            </button>
                        )}
                    </div>

                    {/* Feed content */}
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

                    {/* Like and comment section */}
                    <div className="flex items-center justify-between text-gray-600 border-t border-b py-3 mb-4">
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => feed.isLiked ? handleUnlike(feed.feedId) : handleLike(feed.feedId)}
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

                    {/* Comments section */}
                    {feed.showComments && (
                        <div className="border-t pt-4 mt-4">
                            {/* Comments list */}
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
                                                    src={comment.userAvatarUrl || normalizeImageUrl('/swings/images/default-profile.jpg')}
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

                            {/* Comment input */}
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

    // Main render
    return (
        <div className="bg-gray-50 min-h-screen flex flex-col items-center pt-16">
            <ToastContainer position="bottom-right" />
            <div
                className="w-full max-w-xl mx-auto h-full overflow-y-auto bg-gray-50 flex-1"
                style={{ 
                    height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 64px)', 
                    padding: '0 1rem'
                }}
            >
                {/* Profile component */}
                <SocialProfile {...profileProps} />

                {/* Feeds section */}
                <div className="mt-8 space-y-6 pb-16">
                    {feeds.length === 0 ? (
                        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
                            <FaSpinner className="mx-auto text-4xl text-gray-500 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">피드가 없습니다</h3>
                            <p className="text-gray-500">아직 게시된 콘텐츠가 없습니다.</p>
                        </div>
                    ) : (
                        feeds.map(renderFeedItem)
                    )}
                </div>

                {/* Modals */}
                {showFollowersList && (
                    <UserListModal
                        users={followers}
                        onClose={() => updateState({ showFollowersList: false })}
                        title="팔로워"
                    />
                )}

                {showFollowingList && (
                    <UserListModal
                        users={followings}
                        onClose={() => updateState({ showFollowingList: false })}
                        title="팔로잉"
                    />
                )}

                {selectedImage && (
                    <ImageModal
                        imageUrl={selectedImage}
                        onClose={() => updateState({ selectedImage: null })}
                    />
                )}
            </div>
        </div>
    );
};

export default SocialPage;