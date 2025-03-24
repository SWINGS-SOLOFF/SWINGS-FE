import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaComment, FaTrash, FaGolfBall,
    FaMapMarkerAlt, FaTrophy, FaCalendarAlt, FaEdit } from 'react-icons/fa';

const SocialPage = () => {
    // Core state management
    const [feeds, setFeeds] = useState([]);
    const [comments, setComments] = useState({});
    const [newComments, setNewComments] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userintroduce, setUserintroduce] = useState('');
    const [userStats, setUserStats] = useState({ posts: 0, followers: 0, following: 0 });
    const [editingintroduce, setEditingintroduce] = useState(false);
    const [introduceInput, setintroduceInput] = useState('');

    // 임시로 사용하는 현재 사용자 정보rrr
    const currentUser = {
        userId: 1,
        username: '골프매니아',
        profilePic: 'https://via.placeholder.com/100',
        handicap: 15,
        location: '서울시 강남구',
        joinDate: '2023년 5월',
        bestScore: 82
    };

    // Fetch all required data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await Promise.all([fetchUserData(), fetchFeeds()]);
                setLoading(false);
            } catch (err) {
                console.error('Error loading data:', err);
                setError('데이터를 불러오는 데 실패했습니다. 나중에 다시 시도해주세요.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fetch user profile data
    const fetchUserData = async () => {
        try {
            // Using Promise.all for parallel API calls
            const [introduceResponse, followersResponse, followingsResponse, feedCountResponse] =
                await Promise.all([
                    axios.get(`http://localhost:8090/swings/social/introduce/${currentUser.userId}`),
                    axios.get(`http://localhost:8090/swings/social/followers/${currentUser.userId}`),
                    axios.get(`http://localhost:8090/swings/social/followings/${currentUser.userId}`),
                    axios.get(`http://localhost:8090/swings/social/feeds/count/${currentUser.userId}`)
                ]);

            setUserintroduce(introduceResponse.data);
            setintroduceInput(introduceResponse.data);

            setUserStats({
                posts: feedCountResponse.data,
                followers: followersResponse.data.length,
                following: followingsResponse.data.length
            });
        } catch (err) {
            console.error('Error loading user data:', err);
            throw err;
        }
    };

    // Fetch user's feeds with comments
    const fetchFeeds = async () => {
        try {
            const endpoint = `http://localhost:8090/swings/feeds/user/${currentUser.userId}`;
            const response = await axios.get(endpoint);
            const feedData = response.data;
            setFeeds(feedData);

            // Get comments for each feed
            const commentsPromises = feedData.map(feed =>
                axios.get(`http://localhost:8090/swings/feeds/${feed.feedId}/comments`)
            );

            const commentsResponses = await Promise.all(commentsPromises);

            const commentsObj = {};
            feedData.forEach((feed, index) => {
                commentsObj[feed.feedId] = commentsResponses[index].data;
            });

            setComments(commentsObj);
            setNewComments({});
        } catch (err) {
            console.error('Error loading feeds:', err);
            throw err;
        }
    };

    // Handle like functionality
    const handleLike = async (feedId, isLiked) => {
        try {
            const endpoint = isLiked
                ? `http://localhost:8090/swings/feeds/${feedId}/unlike`
                : `http://localhost:8090/swings/feeds/${feedId}/like`;

            await axios.put(endpoint);

            // Update only the modified feed instead of refetching all feeds
            setFeeds(prevFeeds =>
                prevFeeds.map(feed =>
                    feed.feedId === feedId
                        ? { ...feed, isLiked: !isLiked, likes: isLiked ? feed.likes - 1 : feed.likes + 1 }
                        : feed
                )
            );
        } catch (err) {
            console.error('Error updating like:', err);
        }
    };

    // Handle adding comment
    const handleAddComment = async (feedId) => {
        const commentContent = newComments[feedId];
        if (!commentContent || !commentContent.trim()) return;

        try {
            await axios.post(`http://localhost:8090/swings/feeds/${feedId}/comments`, null, {
                params: {
                    userId: currentUser.userId,
                    content: commentContent
                }
            });

            // Update comments for this feed
            const response = await axios.get(`http://localhost:8090/swings/feeds/${feedId}/comments`);
            setComments(prev => ({
                ...prev,
                [feedId]: response.data
            }));

            // Reset comment input
            setNewComments(prev => ({
                ...prev,
                [feedId]: ''
            }));
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    // Handle comment deletion
    const handleDeleteComment = async (feedId, commentId) => {
        try {
            await axios.delete(`http://localhost:8090/swings/feeds/${feedId}/comments/${commentId}`);

            // Update comments for this feed only
            const response = await axios.get(`http://localhost:8090/swings/feeds/${feedId}/comments`);
            setComments(prev => ({
                ...prev,
                [feedId]: response.data
            }));
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    // Handle feed deletion
    const handleDeleteFeed = async (feedId) => {
        if (window.confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
            try {
                await axios.delete(`http://localhost:8090/swings/feeds/${feedId}`);

                // Remove the deleted feed from state
                setFeeds(prevFeeds => prevFeeds.filter(feed => feed.feedId !== feedId));

                // Update user stats
                setUserStats(prev => ({...prev, posts: prev.posts - 1}));
            } catch (err) {
                console.error('Error deleting feed:', err);
            }
        }
    };

    // Handle introduce update
    const handleintroduceUpdate = async () => {
        if (introduceInput === userintroduce) {
            setEditingintroduce(false);
            return;
        }

        try {
            await axios.post(`http://localhost:8090/social/update-introduce`, introduceInput, {
                params: {
                    userId: currentUser.userId
                },
                headers: {
                    'Content-Type': 'text/plain'
                }
            });

            setUserintroduce(introduceInput);
            setEditingintroduce(false);
        } catch (err) {
            console.error('Error updating introduce:', err);
        }
    };

    // Loading indicator
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white">
                <div className="text-green-600 flex flex-col items-center">
                    <FaGolfBall className="animate-spin text-5xl mb-3" />
                    <p className="text-lg font-light">골프 프로필을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // Error display
    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white">
                <div className="text-red-600 bg-white p-8 rounded-xl shadow-lg max-w-md">
                    <p className="text-xl mb-4">{error}</p>
                    <button
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        onClick={() => window.location.reload()}
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
            {/* Profile Card */}
            <div className="max-w-4xl mx-auto pt-8 px-4">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-800 h-32 relative">
                        <div className="absolute -bottom-16 left-8">
                            <img
                                src={currentUser.profilePic}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                            />
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="pt-20 pb-6 px-8">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            {/* User Info */}
                            <div className="mb-6 md:mb-0">
                                <h1 className="text-2xl font-bold text-gray-800">{currentUser.username}</h1>
                                <div className="flex items-center mt-1 text-gray-600">
                                    <FaMapMarkerAlt className="mr-1" />
                                    <p>{currentUser.location}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <div className="flex items-center text-gray-700 mb-1">
                                            <FaTrophy className="mr-2 text-yellow-500" />
                                            <span className="font-medium">베스트 스코어</span>
                                        </div>
                                        <p className="text-gray-800 pl-6 font-semibold">{currentUser.bestScore}</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <div className="flex items-center text-gray-700 mb-1">
                                            <FaGolfBall className="mr-2 text-green-600" />
                                            <span className="font-medium">핸디캡</span>
                                        </div>
                                        <p className="text-gray-800 pl-6 font-semibold">{currentUser.handicap}</p>
                                    </div>
                                </div>
                            </div>

                            {/* User Stats */}
                            <div className="flex space-x-6">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-800">{userStats.posts}</p>
                                    <p className="text-gray-600">게시물</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-800">{userStats.followers}</p>
                                    <p className="text-gray-600">팔로워</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-800">{userStats.following}</p>
                                    <p className="text-gray-600">팔로잉</p>
                                </div>
                            </div>
                        </div>

                        {/* introduce Section */}
                        <div className="mt-8 border-t pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium text-gray-700">소개</h3>
                                {!editingintroduce ? (
                                    <button
                                        className="text-green-600 hover:text-green-800 flex items-center"
                                        onClick={() => setEditingintroduce(true)}
                                    >
                                        <FaEdit className="mr-1" /> 수정
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            className="text-gray-500 hover:text-gray-700"
                                            onClick={() => {
                                                setEditingintroduce(false);
                                                setintroduceInput(userintroduce);
                                            }}
                                        >
                                            취소
                                        </button>
                                        <button
                                            className="text-green-600 hover:text-green-800"
                                            onClick={handleintroduceUpdate}
                                        >
                                            저장
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!editingintroduce ? (
                                <p className="text-gray-700 leading-relaxed">
                                    {userintroduce || "자기소개가 없습니다. '수정' 버튼을 클릭하여 자기소개를 추가해보세요."}
                                </p>
                            ) : (
                                <textarea
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    rows="3"
                                    value={introduceInput}
                                    onChange={(e) => setintroduceInput(e.target.value)}
                                    placeholder="자기소개를 입력하세요"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts Section */}
            <div className="max-w-4xl mx-auto py-8 px-4">
                <h2 className="text-xl font-bold text-gray-800 mb-6">내 골프 게시물</h2>

                {feeds.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-md">
                        <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaGolfBall className="text-4xl text-green-500" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">아직 게시물이 없습니다</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            아직 생성된 게시물이 없습니다. 골프 경험을 공유해보세요!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {feeds.map((feed) => (
                            <div key={feed.feedId} className="bg-white rounded-xl shadow-md overflow-hidden">
                                {/* Post Header */}
                                <div className="flex justify-between items-center p-4 border-b">
                                    <div className="flex items-center">
                                        <img
                                            src={currentUser.profilePic}
                                            alt="User"
                                            className="w-10 h-10 rounded-full mr-3 border border-green-100"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{currentUser.username}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(feed.createdAt).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        className="text-gray-400 hover:text-red-500 p-2"
                                        onClick={() => handleDeleteFeed(feed.feedId)}
                                        aria-label="Delete post"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                                {/* Post Content */}
                                <div className="p-4">
                                    <p className="text-gray-800 leading-relaxed mb-4">{feed.caption}</p>
                                    {feed.imageUrl && (
                                        <img
                                            src={feed.imageUrl}
                                            alt="Post"
                                            className="w-full rounded-lg"
                                        />
                                    )}
                                </div>

                                {/* Post Actions */}
                                <div className="flex justify-between items-center px-4 py-3 border-t border-b bg-gray-50">
                                    <button
                                        className="flex items-center space-x-1"
                                        onClick={() => handleLike(feed.feedId, feed.isLiked)}
                                        aria-label={feed.isLiked ? "Unlike" : "Like"}
                                    >
                                        {feed.isLiked ? (
                                            <FaHeart className="text-red-500" />
                                        ) : (
                                            <FaRegHeart className="text-gray-500 hover:text-red-500" />
                                        )}
                                        <span className="text-gray-700">{feed.likes || 0}</span>
                                    </button>
                                    <div className="flex items-center space-x-1 text-gray-600">
                                        <FaComment />
                                        <span>{comments[feed.feedId]?.length || 0}</span>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <div className="p-4">
                                    {comments[feed.feedId]?.length > 0 && (
                                        <div className="mb-4 max-h-40 overflow-y-auto space-y-3">
                                            {comments[feed.feedId].map((comment) => (
                                                <div key={comment.commentId} className="flex items-start">
                                                    <img
                                                        src="https://via.placeholder.com/40"
                                                        alt="User"
                                                        className="w-8 h-8 rounded-full mr-2 mt-1"
                                                    />
                                                    <div className="bg-gray-50 rounded-lg px-3 py-2 flex-1">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <p className="font-medium text-sm text-gray-800">{comment.username}</p>
                                                            {comment.userId === currentUser.userId && (
                                                                <button
                                                                    className="text-gray-400 hover:text-red-500"
                                                                    onClick={() => handleDeleteComment(feed.feedId, comment.commentId)}
                                                                    aria-label="Delete comment"
                                                                >
                                                                    <FaTrash size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-700 text-sm">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Add Comment */}
                                    <div className="flex items-center mt-2">
                                        <img
                                            src={currentUser.profilePic}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full mr-2"
                                        />
                                        <input
                                            type="text"
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="댓글을 남겨보세요..."
                                            value={newComments[feed.feedId] || ''}
                                            onChange={(e) => setNewComments({
                                                ...newComments,
                                                [feed.feedId]: e.target.value
                                            })}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddComment(feed.feedId);
                                                }
                                            }}
                                        />
                                        <button
                                            className="ml-2 px-4 py-2 bg-green-600 text-white text-sm rounded-full hover:bg-green-700"
                                            onClick={() => handleAddComment(feed.feedId)}
                                        >
                                            게시
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SocialPage;