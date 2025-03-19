import React, { useState, useEffect } from 'react';
import { FaHeart, FaTrash, FaPlusCircle } from 'react-icons/fa';
import axios from 'axios';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [newCommentContent, setNewCommentContent] = useState({});
    const userId = 1;  // 임시로 userId 1 사용

    useEffect(() => {
        axios.get('http://localhost:8090/swings/feeds')
            .then(response => {
                const data = Array.isArray(response.data) ? response.data : [];
                setPosts(data);
            })
            .catch(error => {
                console.error('Error fetching feeds:', error);
            });
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewPostImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('content', newPostContent);
        if (newPostImage) {
            formData.append('file', newPostImage);
        }

        try {
            const response = await axios.post('http://localhost:8090/swings/feeds/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setPosts([ { ...response.data, liked: false }, ...posts ]);
        } catch (error) {
            console.error('There was an error uploading the feed!', error);
        }

        setNewPostContent('');
        setNewPostImage(null);
        setImagePreview(null);
        setShowNewPostForm(false);
    };

    const handleDelete = async (feedId) => {
        try {
            await axios.delete(`http://localhost:8090/swings/feeds/${feedId}`);
            setPosts(posts.filter(post => post.feedId !== feedId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleLike = async (feedId) => {
        try {
            const response = await axios.put(`http://localhost:8090/swings/feeds/${feedId}/like`, { userId });
            setPosts(posts.map(post =>
                post.feedId === feedId
                    ? { ...post, likes: response.data.likes, liked: true }
                    : post
            ));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleUnlike = async (feedId) => {
        try {
            const response = await axios.put(`http://localhost:8090/swings/feeds/${feedId}/unlike`, { userId });
            setPosts(posts.map(post =>
                post.feedId === feedId
                    ? { ...post, likes: response.data.likes, liked: false }
                    : post
            ));
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    };

    const handleCommentSubmit = async (feedId) => {
        if (!newCommentContent[feedId]) return;

        try {
            const response = await axios.post(`http://localhost:8090/swings/feeds/${feedId}/comments`, null, {
                params: {
                    userId,  // 임시로 userId 1 사용
                    content: newCommentContent[feedId]
                }
            });

            setPosts(posts.map(post =>
                post.feedId === feedId
                    ? {
                        ...post,
                        comments: Array.isArray(post.comments) ? [...post.comments, response.data] : [response.data]
                    }
                    : post
            ));

            setNewCommentContent(prev => ({ ...prev, [feedId]: '' }));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleCommentDelete = async (commentId, feedId) => {
        try {
            await axios.delete(`http://localhost:8090/swings/feeds/${feedId}/comments/${commentId}`);

            setPosts(posts.map(post =>
                post.feedId === feedId
                    ? { ...post, comments: Array.isArray(post.comments) ? post.comments.filter(comment => comment.commentId !== commentId) : [] }
                    : post
            ));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleShowMoreComments = (feedId) => {
        setPosts(posts.map(post =>
            post.feedId === feedId
                ? { ...post, showAllComments: true }
                : post
        ));
    };

    return (
        <div className="max-w-2xl mx-auto my-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-green-800">골프 피드</h1>
                <button
                    onClick={() => setShowNewPostForm(!showNewPostForm)}
                    className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition"
                >
                    <FaPlusCircle className="text-xl" />
                </button>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-green-200">
                    <h2 className="text-xl font-semibold text-green-800 mb-4">새 게시물 작성</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-green-700 mb-2">사진 업로드</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img src={imagePreview} alt="Preview" className="max-h-60 rounded" />
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-green-700 mb-2">내용</label>
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                className="w-full p-2 border border-green-300 rounded h-24 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="골프 모임에 대한 이야기를 공유해보세요..."
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowNewPostForm(false)}
                                className="px-4 py-2 mr-2 text-green-800 border border-green-500 rounded hover:bg-green-50"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                게시하기
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Feed List */}
            <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.feedId} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100">
                        {/* Post Header */}
                        <div className="flex items-center p-4">
                            <img
                                src={post.avatarUrl}
                                alt={post.username}
                                className="w-10 h-10 rounded-full mr-3 border border-green-200"
                            />
                            <div>
                                <p className="font-semibold text-green-800">{post.username}</p>
                                <p className="text-xs text-gray-500">{post.timestamp}</p>
                            </div>
                        </div>

                        {/* Post Image */}
                        <img src={`http://localhost:8090/swings/uploads/${post.imageUrl}`} alt="Feed content" className="w-full object-cover max-h-96" />

                        {/* Post Actions */}
                        <div className="flex p-2 border-b border-green-100">
                            <button
                                onClick={() => post.liked ? handleUnlike(post.feedId) : handleLike(post.feedId)}
                                className="flex-1 flex justify-center items-center text-3xl hover:text-green-900 transition duration-200 py-4 border-r border-green-300"
                            >
                                <FaHeart className={post.liked ? "text-red-600" : "text-green-700"} />
                            </button>
                            <button
                                onClick={() => handleDelete(post.feedId)}
                                className="flex-1 flex justify-center items-center text-3xl text-red-600 hover:text-red-800 transition duration-200 py-4 border-l border-green-300"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        {/* Post Content */}
                        <div className="p-4">
                            <p className="font-semibold text-green-800 mb-1">{post.likes}명이 좋아합니다</p>
                            <p className="mb-2">
                                <span className="font-semibold text-green-800 mr-2">{post.username}</span>
                                {post.caption}
                            </p>

                            <p className="text-gray-500 text-sm mb-2">
                                댓글 {post.comments ? (Array.isArray(post.comments) ? post.comments.length : 0) : 0}개
                            </p>

                            {post.comments && Array.isArray(post.comments) && (
                                <div className="space-y-4">
                                    {post.comments.slice(0, post.showAllComments ? post.comments.length : 1).map(comment => (
                                        <div key={comment.commentId} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-green-800">{comment.user.username}</p>
                                                <p className="text-sm">{comment.content}</p>
                                            </div>
                                            <button
                                                onClick={() => handleCommentDelete(comment.commentId, post.feedId)}
                                                className="text-red-600 hover:text-red-800 transition"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Show More Comments */}
                            {post.comments && post.comments.length > 1 && !post.showAllComments && (
                                <button
                                    onClick={() => handleShowMoreComments(post.feedId)}
                                    className="text-green-600 mt-2"
                                >
                                    더보기
                                </button>
                            )}

                            <div className="flex items-center mt-2">
                                <input
                                    type="text"
                                    placeholder="댓글 추가..."
                                    value={newCommentContent[post.feedId] || ''}
                                    onChange={(e) => setNewCommentContent({ ...newCommentContent, [post.feedId]: e.target.value })}
                                    className="flex-grow text-sm p-1 focus:outline-none"
                                />
                                <button
                                    onClick={() => handleCommentSubmit(post.feedId)}
                                    className="text-green-600 font-semibold text-sm ml-2"
                                >
                                    게시
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedPage;
