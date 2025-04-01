import React, { useState, useEffect } from 'react';
import SocialProfile from '../components/SocialProfile';
import { motion } from 'framer-motion';
import {
    getIntroduce,
    getFollowers,
    getFollowings,
    getFeedCount,
    isFollowing,
    followUser,
    unfollowUser,
    updateIntroduce,
    getProfile,
} from '../api/socialApi.js';
import { FaGolfBall, FaTrash, FaUserFriends, FaTimes } from 'react-icons/fa';
import { normalizeImageUrl } from '../utils/imageUtils';
import feedApi from "../api/feedApi.js";
import ImageModal from '../components/ImageModal';
import { useParams } from 'react-router-dom';

const SocialPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [feeds, setFeeds] = useState([]);
    const [userIntroduce, setUserIntroduce] = useState('');
    const [userStats, setUserStats] = useState({ posts: 0, followers: 0, following: 0 });
    const [editingIntroduce, setEditingIntroduce] = useState(false);
    const [introduceInput, setIntroduceInput] = useState('');
    const [isFollowingState, setIsFollowingState] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showFollowersList, setShowFollowersList] = useState(false);
    const [showFollowingList, setShowFollowingList] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    const { userId } = useParams();

    const viewedUserId = userId ? Number(userId) : 2;

    // 임시 로그인 사용자 정보 - 테스트용으로 수정
    const currentUser = {
        userId: 1,
        username: '테스트 사용자',
        profilePic: normalizeImageUrl('/swings/images/default-profile.jpg'),
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);

                // 로그인한 사용자와 프로필을 보고 있는 사용자 정보 모두 불러오기
                const [
                    profileData,
                    introduce,
                    followersData,
                    followingsData,
                    feedCount,
                    followStatus,
                    feedsData,
                ] = await Promise.all([
                    getProfile(viewedUserId), // 프로필 보고 있는 사용자 정보
                    getIntroduce(viewedUserId),
                    getFollowers(viewedUserId),
                    getFollowings(viewedUserId),
                    getFeedCount(viewedUserId),
                    isFollowing(currentUser.userId, viewedUserId), // 현재 로그인한 사용자 기준으로 팔로우 상태 확인
                    feedApi.getUserFeeds(viewedUserId),
                ]);

                const feedsWithComments = await fetchFeedsWithComments(feedsData);

                // 더보기 버튼 상태 초기화를 위해 캡션 길이 확인
                const processedFeeds = feedsWithComments.map(feed => ({
                    ...feed,
                    isLongCaption: feed.caption && feed.caption.length > 100,
                    showFullCaption: false
                }));

                setUserProfile(profileData);
                setUserIntroduce(introduce || '');
                setIntroduceInput(introduce || '');
                setFollowers(followersData || []);
                setFollowings(followingsData || []);
                setUserStats({
                    posts: feedCount || 0,
                    followers: followersData?.length || 0,
                    following: followingsData?.length || 0,
                });
                setIsFollowingState(followStatus === '팔로우 중입니다.');
                setFeeds(processedFeeds);

                setLoading(false);
            } catch (err) {
                console.error('프로필 데이터 로딩 오류:', err);
                setError('데이터를 불러오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [viewedUserId, currentUser.userId]);

    // feedsData에 대해 댓글도 함께 가져오는 함수
    const fetchFeedsWithComments = async (feedsData) => {
        try {
            if (!feedsData || feedsData.length === 0) return [];

            const feedsWithComments = await Promise.all(
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
            return feedsWithComments;
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

    const UserListModal = ({ users, onClose, title }) => {
        return (
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
                    <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center">
                            <FaUserFriends className="mr-2" />
                            {title} ({users.length})
                        </h3>
                        <button
                            onClick={onClose}
                            className="hover:bg-green-700 p-2 rounded-full transition"
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
                                            className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
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
    };

    // 이미지 클릭 시 모달 열기
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    // 팔로우 토글 함수
    const handleFollowToggle = async () => {
        if (!currentUser) return; // 로그인 상태 확인

        try {
            if (isFollowingState) {
                await unfollowUser(currentUser.userId, viewedUserId);
                setIsFollowingState(false);
                setUserStats(prev => ({
                    ...prev,
                    followers: Math.max(0, prev.followers - 1)
                }));
            } else {
                await followUser(currentUser.userId, viewedUserId);
                setIsFollowingState(true);
                setUserStats(prev => ({
                    ...prev,
                    followers: prev.followers + 1
                }));
            }
        } catch (err) {
            console.error('팔로우/언팔로우 중 오류:', err);
            alert('팔로우/언팔로우에 실패했습니다.');
        }
    };

    // 좋아요 핸들러
    const handleLike = async (feedId) => {
        try {
            const updatedData = await feedApi.likeFeed(feedId);
            setFeeds(feeds.map(feed =>
                feed.feedId === feedId
                    ? { ...feed, likes: updatedData.likes, isLiked: true }
                    : feed
            ));
        } catch (error) {
            console.error('좋아요 중 오류 발생:', error);
        }
    };

    // 좋아요 취소 핸들러
    const handleUnlike = async (feedId) => {
        try {
            const updatedData = await feedApi.unlikeFeed(feedId);
            setFeeds(feeds.map(feed =>
                feed.feedId === feedId
                    ? { ...feed, likes: updatedData.likes, isLiked: false }
                    : feed
            ));
        } catch (error) {
            console.error('좋아요 취소 중 오류 발생:', error);
        }
    };

    // 피드 삭제 핸들러
    const handleDeleteFeed = async (feedId) => {
        const confirmDelete = window.confirm('정말로 이 피드를 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await feedApi.deleteFeed(feedId);
                setFeeds(feeds.filter(feed => feed.feedId !== feedId));
                // 피드 수 업데이트
                setUserStats(prev => ({
                    ...prev,
                    posts: Math.max(0, prev.posts - 1)
                }));
            } catch (error) {
                console.error('피드 삭제 중 오류 발생:', error);
                alert('피드 삭제에 실패했습니다.');
            }
        }
    };

    // 댓글 토글 핸들러
    const handleToggleComments = (feedId) => {
        setFeeds(feeds.map(feed =>
            feed.feedId === feedId
                ? { ...feed, showComments: !feed.showComments }
                : feed
        ));
    };

    // 댓글 제출 핸들러
    const handleCommentSubmit = async (feedId, comment) => {
        if (!comment.trim()) return;
        try {
            const commentData = await feedApi.addComment(feedId, currentUser.userId, comment);
            setFeeds(feeds.map(feed =>
                feed.feedId === feedId
                    ? {
                        ...feed,
                        comments: [...feed.comments, commentData],
                        commentCount: feed.commentCount + 1,
                        newComment: ''
                    }
                    : feed
            ));
        } catch (error) {
            console.error('댓글 추가 중 오류 발생:', error);
        }
    };

    // 댓글 삭제 핸들러
    const handleCommentDelete = async (commentId, feedId) => {
        try {
            await feedApi.deleteComment(feedId, commentId);
            setFeeds(feeds.map(feed =>
                feed.feedId === feedId
                    ? {
                        ...feed,
                        comments: feed.comments.filter(comment => comment.commentId !== commentId),
                        commentCount: feed.commentCount - 1
                    }
                    : feed
            ));
        } catch (error) {
            console.error('댓글 삭제 중 오류 발생:', error);
        }
    };

    // 더보기 토글 핸들러
    const handleToggleCaption = (feedId) => {
        setFeeds(feeds.map(feed =>
            feed.feedId === feedId
                ? { ...feed, showFullCaption: !feed.showFullCaption }
                : feed
        ));
    };

    // 자기소개 저장 핸들러
    const handleIntroduceSave = async () => {
        try {
            await updateIntroduce(viewedUserId, introduceInput);
            setUserIntroduce(introduceInput);
            setEditingIntroduce(false);
        } catch (err) {
            console.error('Introduce update error:', err);
            alert('자기소개 업데이트 중 오류 발생');
        }
    };

    // SocialProfile 컴포넌트에 전달할 props
    const profileProps = {
        user: userProfile || currentUser,
        userStats: userStats,
        userIntroduce: editingIntroduce ? introduceInput : userIntroduce,
        editing: editingIntroduce,
        onIntroduceSave: handleIntroduceSave,
        isCurrentUser: currentUser.userId === viewedUserId,
        isFollowing: isFollowingState,
        onFollowToggle: handleFollowToggle,
        onFetchFollowers: getFollowers,
        onFetchFollowing: getFollowings,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white">
                <div className="text-green-600 flex flex-col items-center">
                    <FaGolfBall className="animate-spin text-5xl mb-3" />
                    <p className="text-lg font-light">프로필을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white">
                <div className="text-red-600 bg-white p-8 rounded-xl shadow-lg max-w-md">
                    <p className="text-xl mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
            {/* SocialProfile 컴포넌트에 모든 필요한 props 전달 */}
            <SocialProfile {...profileProps} />

            <div className="max-w-3xl mx-auto mt-8 px-4 space-y-6">
                {feeds.length === 0 ? (
                    <div className="bg-white shadow-lg rounded-xl p-8 text-center">
                        <FaGolfBall className="mx-auto text-4xl text-green-500 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">피드가 없습니다</h3>
                        <p className="text-gray-500">아직 게시된 콘텐츠가 없습니다.</p>
                    </div>
                ) : (
                    feeds.map((feed) => (
                        <div
                            key={feed.feedId}
                            className="bg-white shadow-2xl rounded-2xl overflow-hidden border-2 border-gray-100 transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-1"
                        >
                            {/* 이미지 섹션 */}
                            {feed.imageUrl && (
                                <div
                                    className="relative w-full h-80 overflow-hidden cursor-pointer group"
                                    onClick={() => handleImageClick(normalizeImageUrl(feed.imageUrl))}
                                >
                                    <img
                                        src={normalizeImageUrl(feed.imageUrl)}
                                        alt="Feed content"
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
                                            src={userProfile?.profilePic || currentUser.profilePic}
                                            alt="Profile"
                                            className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-green-100 shadow-md"
                                        />
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">
                                                {userProfile?.username || currentUser.username}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(feed.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    {/* 삭제 버튼 (자신의 게시물인 경우) */}
                                    {currentUser.userId === viewedUserId && (
                                        <div className="relative group">
                                            <button
                                                onClick={() => handleDeleteFeed(feed.feedId)}
                                                className="text-red-500 p-2 rounded-full hover:bg-red-50 transition group"
                                            >
                                                <FaTrash className="group-hover:scale-110 transition" />
                                            </button>
                                        </div>
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
                                            className="text-green-600 text-sm font-medium mt-2 hover:text-green-700 transition"
                                        >
                                            {feed.showFullCaption ? '내용접기' : '내용더보기'}
                                        </button>
                                    )}
                                </div>

                                {/* 좋아요 및 댓글 섹션 */}
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
                                                                src={comment.userAvatarUrl || normalizeImageUrl('/swings/images/default-profile.jpg')}
                                                                alt="댓글 작성자"
                                                                className="w-9 h-9 rounded-full object-cover border"
                                                            />
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-700">{comment.username}</p>
                                                                <p className="text-gray-600">{comment.content}</p>
                                                            </div>
                                                        </div>
                                                        {currentUser.userId === comment.userId && (
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

                                        {/* 댓글 입력 섹션 */}
                                        <div className="mt-4 flex space-x-2">
                                            <input
                                                type="text"
                                                placeholder="댓글을 입력하세요..."
                                                className="flex-grow border-2 border-gray-200 rounded-lg p-2 focus:border-green-500 transition"
                                                value={feed.newComment || ''}
                                                onChange={(e) => {
                                                    setFeeds(feeds.map(f =>
                                                        f.feedId === feed.feedId
                                                            ? { ...f, newComment: e.target.value }
                                                            : f
                                                    ));
                                                }}
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
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                            >
                                                등록
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 팔로워 목록 모달 */}
            {showFollowersList && (
                <UserListModal
                    users={followers}
                    onClose={() => setShowFollowersList(false)}
                    title="팔로워"
                />
            )}

            {/* 팔로잉 목록 모달 */}
            {showFollowingList && (
                <UserListModal
                    users={followings}
                    onClose={() => setShowFollowingList(false)}
                    title="팔로잉"
                />
            )}

            {/* 이미지 모달 */}
            {selectedImage && (
                <ImageModal
                    imageUrl={selectedImage}
                    onClose={() => setSelectedImage(null)}
                />
            )}
        </div>
    );
};

export default SocialPage;