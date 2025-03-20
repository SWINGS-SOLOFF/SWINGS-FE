import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaComment, FaTrash, FaGolfBall,
    FaUserFriends, FaUser, FaFilter, FaMapMarkerAlt,
    FaTrophy, FaCalendarAlt } from 'react-icons/fa';

const SocialPage = () => {
    // State management
    const [feeds, setFeeds] = useState([]);
    const [comments, setComments] = useState({});
    const [newComments, setNewComments] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userBio, setUserBio] = useState('골프를 사랑하는 아마추어 골퍼입니다. 함께 골프 이야기 나눠요!');
    const [showMyPostsOnly, setShowMyPostsOnly] = useState(false);
    const [userStats, setUserStats] = useState({ posts: 0, followers: 125, following: 89 });

    // Current user information - would come from auth context in real app
    const currentUser = {
        userId: 1,
        username: '골프매니아',
        profilePic: 'https://via.placeholder.com/100',
        handicap: 15,
        location: '서울시 강남구',
        joinDate: '2023년 5월',
        bestScore: 82
    };

    // Load feed data on component mount
    useEffect(() => {
        fetchFeeds();
    }, [showMyPostsOnly]);

    // Fetch feed data from backend
    const fetchFeeds = async () => {
        try {
            setLoading(true);
            // Get all feeds or just my feeds based on filter state
            const endpoint = showMyPostsOnly
                ? `http://localhost:8090/swings/feeds/user/${currentUser.userId}`
                : 'http://localhost:8090/swings/feeds';

            const response = await axios.get(endpoint);
            const feedData = response.data;
            setFeeds(feedData);

            // Update user statistics (my post count)
            if (!showMyPostsOnly) {
                const myPosts = feedData.filter(feed => feed.userId === currentUser.userId);
                setUserStats(prev => ({...prev, posts: myPosts.length}));
            } else {
                setUserStats(prev => ({...prev, posts: feedData.length}));
            }

            // Get comments for each feed
            const commentsObj = {};
            for (const feed of feedData) {
                const commentResponse = await axios.get(`http://localhost:8090/swings/feeds/${feed.feedId}/comments`);
                commentsObj[feed.feedId] = commentResponse.data;
            }

            setComments(commentsObj);
            setNewComments({});
            setLoading(false);
        } catch (err) {
            console.error('Error loading feeds:', err);
            setError('Failed to load feeds. Please try again later.');
            setLoading(false);
        }
    };

    // Handle like functionality
    const handleLike = async (feedId, isLiked) => {
        try {
            const endpoint = isLiked ?
                `http://localhost:8090/swings/feeds/${feedId}/unlike` :
                `http://localhost:8090/swings/feeds/${feedId}/like`;

            await axios.put(endpoint);
            fetchFeeds();
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

    // Handle comment input change
    const handleCommentChange = (feedId, value) => {
        setNewComments(prev => ({
            ...prev,
            [feedId]: value
        }));
    };

    // Handle comment deletion
    const handleDeleteComment = async (feedId, commentId) => {
        try {
            await axios.delete(`http://localhost:8090/swings/feeds/${feedId}/comments/${commentId}`);
            // Update comments
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
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`http://localhost:8090/swings/feeds/${feedId}`);
                fetchFeeds();
            } catch (err) {
                console.error('Error deleting feed:', err);
            }
        }
    };

    // Handle bio update
    const handleBioUpdate = async (newBio) => {
        try {
            // API call (would be needed in actual implementation)
            // await axios.put(`http://localhost:8090/swings/users/${currentUser.userId}/bio`, { bio: newBio });
            setUserBio(newBio);
        } catch (err) {
            console.error('Error updating bio:', err);
        }
    };

    // Loading indicator
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white">
                <div className="text-green-600 flex flex-col items-center">
                    <FaGolfBall className="animate-spin text-5xl mb-3" />
                    <p className="text-lg font-light">Loading your golf community posts...</p>
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
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        onClick={fetchFeeds}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
            {/* User Profile Section */}
            <div className="bg-white shadow-lg rounded-xl max-w-4xl mx-auto mt-8 overflow-hidden">
                <div className="md:flex">
                    {/* Profile Image Column */}
                    <div className="md:w-1/3 p-8 flex justify-center bg-gradient-to-br from-green-500 to-green-700">
                        <div className="text-center">
                            <img
                                src={currentUser.profilePic}
                                alt="Profile"
                                className="w-36 h-36 rounded-full mx-auto border-4 border-white shadow-lg"
                            />
                            <h2 className="text-2xl font-bold mt-4 text-white">{currentUser.username}</h2>
                            <div className="flex items-center justify-center mt-2 text-green-100">
                                <FaMapMarkerAlt className="mr-1" />
                                <p>{currentUser.location}</p>
                            </div>
                            <div className="mt-6 bg-white bg-opacity-20 rounded-lg py-2 px-4 text-white">
                                <p className="font-semibold">Handicap</p>
                                <p className="text-2xl">{currentUser.handicap}</p>
                            </div>
                        </div>
                    </div>

                    {/* User Info and Stats */}
                    <div className="md:w-2/3 p-8">
                        {/* Stats */}
                        <div className="flex justify-around mb-8">
                            <div className="text-center group">
                                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-100 transition-colors">
                                    <p className="text-2xl font-bold text-green-700">{userStats.posts}</p>
                                </div>
                                <p className="text-gray-600">Posts</p>
                            </div>
                            <div className="text-center group">
                                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-100 transition-colors">
                                    <p className="text-2xl font-bold text-green-700">{userStats.followers}</p>
                                </div>
                                <p className="text-gray-600">Followers</p>
                            </div>
                            <div className="text-center group">
                                <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-100 transition-colors">
                                    <p className="text-2xl font-bold text-green-700">{userStats.following}</p>
                                </div>
                                <p className="text-gray-600">Following</p>
                            </div>
                        </div>

                        {/* Additional User Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center text-gray-700 mb-1">
                                    <FaTrophy className="mr-2 text-yellow-500" />
                                    <span className="font-semibold">Best Score</span>
                                </div>
                                <p className="text-gray-800 pl-6">{currentUser.bestScore}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center text-gray-700 mb-1">
                                    <FaCalendarAlt className="mr-2 text-green-500" />
                                    <span className="font-semibold">Member Since</span>
                                </div>
                                <p className="text-gray-800 pl-6">{currentUser.joinDate}</p>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-700">About Me</h3>
                                <button
                                    className="text-green-600 text-sm hover:text-green-800 transition-colors"
                                    onClick={() => {
                                        const newBio = prompt("Edit your bio:", userBio);
                                        if (newBio) handleBioUpdate(newBio);
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{userBio}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto py-8 px-4 md:px-0 max-w-4xl">
                {/* Filter Button */}
                <div className="mb-6 flex justify-end">
                    <button
                        className={`flex items-center space-x-2 px-5 py-2.5 rounded-full transition-all shadow-sm ${
                            showMyPostsOnly
                                ? 'bg-green-600 text-white'
                                : 'bg-white text-green-600 border border-green-500'
                        }`}
                        onClick={() => setShowMyPostsOnly(!showMyPostsOnly)}
                    >
                        <FaFilter size={14} />
                        <span>{showMyPostsOnly ? 'View All Posts' : 'View My Posts Only'}</span>
                    </button>
                </div>

                {/* Feed List */}
                {feeds.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-md">
                        <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaGolfBall className="text-4xl text-green-500" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No Posts Yet</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {showMyPostsOnly
                                ? 'You haven\'t created any posts yet. Start sharing your golf experiences!'
                                : 'There are no posts to display yet. Be the first to share your golf journey!'}
                        </p>
                    </div>
                ) : (
                    feeds.map((feed) => (
                        <div key={feed.feedId} className="bg-white rounded-xl shadow-md mb-8 overflow-hidden transition-shadow hover:shadow-lg">
                            {/* Post Header */}
                            <div className="flex justify-between items-center p-5 border-b">
                                <div className="flex items-center">
                                    <img
                                        src="https://via.placeholder.com/50"
                                        alt="User"
                                        className="w-12 h-12 rounded-full mr-4 border-2 border-green-100"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">{feed.userName || "Golf Enthusiast"}</p>
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

                                {feed.userId === currentUser.userId && (
                                    <button
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                        onClick={() => handleDeleteFeed(feed.feedId)}
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>

                            {/* Post Content */}
                            <div className="p-5">
                                <p className="mb-5 text-gray-800 leading-relaxed">{feed.caption}</p>
                                {feed.imageUrl && (
                                    <img
                                        src={`/swings${feed.imageUrl}`}
                                        alt="Post"
                                        className="w-full rounded-lg shadow-sm"
                                    />
                                )}
                            </div>

                            {/* Post Actions */}
                            <div className="flex justify-between items-center px-5 py-4 border-t border-b bg-gray-50">
                                <button
                                    className="flex items-center space-x-2 transition-colors"
                                    onClick={() => handleLike(feed.feedId, feed.isLiked)}
                                >
                                    {feed.isLiked ? (
                                        <FaHeart className="text-red-500" />
                                    ) : (
                                        <FaRegHeart className="text-gray-500 hover:text-red-500" />
                                    )}
                                    <span className="text-gray-700">{feed.likes || 0}</span>
                                </button>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FaComment />
                                    <span>{comments[feed.feedId]?.length || 0}</span>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="p-5">
                                {comments[feed.feedId]?.length > 0 && (
                                    <div className="mb-5 max-h-48 overflow-y-auto pr-2 space-y-3">
                                        {comments[feed.feedId].map((comment) => (
                                            <div key={comment.commentId} className="flex items-start">
                                                <img
                                                    src="https://via.placeholder.com/40"
                                                    alt="User"
                                                    className="w-8 h-8 rounded-full mr-3 mt-1"
                                                />
                                                <div className="bg-gray-50 rounded-lg px-4 py-3 flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="font-semibold text-sm text-gray-800">{comment.username}</p>
                                                        {comment.userId === currentUser.userId && (
                                                            <button
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                                onClick={() => handleDeleteComment(feed.feedId, comment.commentId)}
                                                            >
                                                                <FaTrash size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-700">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add Comment */}
                                <div className="flex items-center bg-gray-50 rounded-full overflow-hidden pl-3 pr-1 py-1">
                                    <img
                                        src={currentUser.profilePic}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500"
                                        placeholder="Add a comment..."
                                        value={newComments[feed.feedId] || ''}
                                        onChange={(e) => handleCommentChange(feed.feedId, e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddComment(feed.feedId);
                                            }
                                        }}
                                    />
                                    <button
                                        className="ml-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                        onClick={() => handleAddComment(feed.feedId)}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

export default SocialPage;