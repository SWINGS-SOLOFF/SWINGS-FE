import React, { useState, useEffect } from 'react';
import SocialProfile from '../components/SocialProfile';
import {
    FaGolfBall,
    FaPaperPlane,
    FaTrash,
    FaHeart,
    FaRegHeart
} from 'react-icons/fa';
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
import { normalizeImageUrl } from '../utils/imageUtils';
import feedApi from '../api/feedApi.js';

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

    const currentUser = {
        userId: 1,
        username: '골프매니아',
        profilePic: normalizeImageUrl('/default-profile.png'),
        handicap: 15,
        location: '서울시 강남구',
        bestScore: 82,
    };

    const viewedUserId = 1;

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
                            showComments: true,
                            newComment: '',
                            isLiked: feed.isLiked || false
                        };
                    } catch (err) {
                        console.error(`댓글 로딩 실패 (feedId: ${feed.feedId}):`, err);
                        return {
                            ...feed,
                            comments: [],
                            commentCount: 0,
                            likes: feed.likes || feed.likeCount || 0,
                            showComments: true,
                            newComment: '',
                            isLiked: feed.isLiked || false
                        };
                    }
                })
            );
            return feedsWithComments;
        } catch (error) {
            console.error('피드 로딩 중 오류:', error);
            return feedsData.map(feed => ({
                ...feed,
                comments: [],
                commentCount: 0,
                likes: feed.likes || feed.likeCount || 0,
                showComments: true,
                newComment: '',
                isLiked: feed.isLiked || false
            }));
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const profileData = await getProfile(viewedUserId);
                setUserProfile(profileData);

                const [
                    introduce,
                    followers,
                    followings,
                    feedCount,
                    followStatus,
                    feedsData,
                ] = await Promise.all([
                    getIntroduce(viewedUserId),
                    getFollowers(viewedUserId),
                    getFollowings(viewedUserId),
                    getFeedCount(viewedUserId),
                    isFollowing(currentUser.userId, viewedUserId),
                    feedApi.getUserFeeds(viewedUserId),
                ]);

                const feedsWithComments = await fetchFeedsWithComments(feedsData);

                setUserIntroduce(introduce || '');
                setIntroduceInput(introduce || '');
                setUserStats({
                    posts: feedCount || 0,
                    followers: followers?.length || 0,
                    following: followings?.length || 0,
                });
                setIsFollowingState(followStatus === '팔로우 중입니다.');
                setFeeds(feedsWithComments);

                setLoading(false);
            } catch (err) {
                console.error('프로필 데이터 로딩 오류:', err);
                setError('데이터를 불러오는 데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [viewedUserId, currentUser.userId]);

    const handleAddComment = async (feedId, index) => {
        try {
            const updatedFeeds = [...feeds];
            const currentFeed = updatedFeeds[index];

            if (!currentFeed.newComment.trim()) return;

            const newComment = await feedApi.addComment(
                feedId,
                currentUser.userId,
                currentFeed.newComment
            );

            currentFeed.comments.push(newComment);
            currentFeed.commentCount += 1;
            currentFeed.newComment = '';

            setFeeds(updatedFeeds);
        } catch (err) {
            console.error('댓글 추가 오류:', err);
            alert('댓글 추가 중 오류가 발생했습니다.');
        }
    };

    const handleDeleteComment = async (feedId, commentId, feedIndex, commentIndex) => {
        try {
            await feedApi.deleteComment(feedId, commentId);

            const updatedFeeds = [...feeds];
            updatedFeeds[feedIndex].comments.splice(commentIndex, 1);
            updatedFeeds[feedIndex].commentCount -= 1;

            setFeeds(updatedFeeds);
        } catch (err) {
            console.error('댓글 삭제 오류:', err);
            alert('댓글 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleLikeToggle = async (feedId, index) => {
        try {
            const updatedFeeds = [...feeds];
            const currentFeed = updatedFeeds[index];

            if (currentFeed.isLiked) {
                await feedApi.unlikeFeed(feedId);
                currentFeed.likes -= 1;
                currentFeed.isLiked = false;
            } else {
                await feedApi.likeFeed(feedId);
                currentFeed.likes += 1;
                currentFeed.isLiked = true;
            }

            setFeeds(updatedFeeds);
        } catch (err) {
            console.error('좋아요 토글 오류:', err);
            alert('좋아요/좋아요 취소 중 오류가 발생했습니다.');
        }
    };

    const handleDeleteFeed = async (feedId, index) => {
        try {
            await feedApi.deleteFeed(feedId);

            const updatedFeeds = feeds.filter((_, idx) => idx !== index);
            setFeeds(updatedFeeds);
            setUserStats(prev => ({ ...prev, posts: prev.posts - 1 }));
        } catch (err) {
            console.error('게시물 삭제 오류:', err);
            alert('게시물 삭제 중 오류가 발생했습니다.');
        }
    };

    // 나머지 기존 메서드들 (handleFollowToggle, handleIntroduceSave 등) 그대로 유지

    return (
        <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
            {/* 기존 프로필, 팔로우 버튼 섹션 유지 */}

            <div className="max-w-3xl mx-auto mt-8 px-4 space-y-6">
                {feeds.length > 0 ? (
                    feeds.map((feed, feedIndex) => (
                        <div
                            key={feed.feedId}
                            className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 relative"
                        >
                            {/* 본인 게시물인 경우에만 삭제 버튼 표시 */}
                            {feed.userId === currentUser.userId && (
                                <button
                                    onClick={() => handleDeleteFeed(feed.feedId, feedIndex)}
                                    className="absolute top-2 right-2 z-10 text-red-500 hover:text-red-700"
                                >
                                    <FaTrash size={20} />
                                </button>
                            )}

                            {feed.imageUrl && (
                                <div className="w-full h-64 overflow-hidden">
                                    <img
                                        src={normalizeImageUrl(feed.imageUrl)}
                                        alt="Feed content"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}

                            <div className="p-5">
                                {/* 기존 프로필, 날짜, 본문 섹션 유지 */}

                                <div className="flex items-center text-gray-600 space-x-4 mb-4">
                                    <button
                                        onClick={() => handleLikeToggle(feed.feedId, feedIndex)}
                                        className="flex items-center"
                                    >
                                        {feed.isLiked ? (
                                            <FaHeart className="text-red-500 mr-1" />
                                        ) : (
                                            <FaRegHeart className="mr-1" />
                                        )}
                                        {feed.likes}
                                    </button>
                                    <span className="flex items-center">💬 {feed.commentCount}</span>
                                </div>

                                {/* 댓글 섹션 (스크롤 및 입력 기능 포함) */}
                                <div className="max-h-64 overflow-y-auto mb-4">
                                    {feed.comments.map((comment, commentIndex) => (
                                        <div
                                            key={comment.commentId}
                                            className="flex items-start mb-3 relative group"
                                        >
                                            <img
                                                src={normalizeImageUrl(comment.userProfilePic) || '/default-profile.png'}
                                                alt="User"
                                                className="w-8 h-8 rounded-full mr-3"
                                            />
                                            <div className="flex-grow">
                                                <div className="flex items-center">
                                                    <p className="text-sm font-semibold mr-2">{comment.username}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(comment.createdAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-700">{comment.content}</p>
                                            </div>
                                            {/* 본인 댓글인 경우에만 삭제 버튼 표시 */}
                                            {comment.userId === currentUser.userId && (
                                                <button
                                                    onClick={() => handleDeleteComment(feed.feedId, comment.commentId, feedIndex, commentIndex)}
                                                    className="absolute right-0 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* 댓글 입력 */}
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="댓글을 입력하세요..."
                                        value={feed.newComment}
                                        onChange={(e) => {
                                            const updatedFeeds = [...feeds];
                                            updatedFeeds[feedIndex].newComment = e.target.value;
                                            setFeeds(updatedFeeds);
                                        }}
                                        className="flex-grow mr-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        onClick={() => handleAddComment(feed.feedId, feedIndex)}
                                        className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-md">
                        <FaGolfBall className="mx-auto text-green-600 text-4xl mb-4" />
                        <p className="text-gray-600 text-lg">
                            아직 작성된 게시물이 없습니다. 첫 게시물을 작성해보세요!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialPage;