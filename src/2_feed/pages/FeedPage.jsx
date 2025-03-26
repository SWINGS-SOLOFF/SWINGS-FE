// src/pages/FeedPage.js
import React, { useState, useEffect } from 'react';
import { FaGolfBall, FaPlusCircle, FaTimes } from 'react-icons/fa';
import NewPostForm from '../components/NewPostForm';
import FeedPost from '../components/FeedPost';
import feedApi from '../api/feedApi.js';

const FeedPage = () => {
    const [posts, setPosts] = useState([]); // 피드에 표시될 게시물 목록
    const [newPostContent, setNewPostContent] = useState(''); // 게시물 내용
    const [newPostImage, setNewPostImage] = useState(null); // 게시물 이미지
    const [imagePreview, setImagePreview] = useState(null); // 업로드 이미지 미리보기 URL
    const [showNewPostForm, setShowNewPostForm] = useState(false); // 새 게시물 작성 폼 노출 여부
    const [loading, setLoading] = useState(true); // 데이터 로딩 여부

    const userId = 1; // 임시 userId 나중에 로그인된 사용자 가져와야됨

    useEffect(() => {
        fetchAllPosts();
    }, []);

    const fetchAllPosts = async () => {
        try {
            const data = await feedApi.getFeeds();
            const postsWithComments = await Promise.all(
                data.map(async (post) => {
                    const comments = await feedApi.getCommentsByFeedId(post.feedId);
                    return { ...post, comments, liked: false, showComments: false };
                })
            );
            setPosts(postsWithComments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewPostImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('content', newPostContent);
        if (newPostImage) formData.append('file', newPostImage);

        try {
            const newPostData = await feedApi.uploadFeed(formData);
            const newPost = {
                ...newPostData,
                liked: false,
                comments: [],
                showComments: false
            };
            setPosts([newPost, ...posts]);
            setNewPostContent('');
            setNewPostImage(null);
            setImagePreview(null);
            setShowNewPostForm(false);
        } catch (error) {
            console.error('Error uploading post:', error);
        }
    };

    const handleDelete = async (feedId) => {
        try {
            await feedApi.deleteFeed(feedId);
            setPosts(posts.filter(post => post.feedId !== feedId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleLike = async (feedId) => {
        try {
            const updatedData = await feedApi.likeFeed(feedId);
            setPosts(posts.map(post =>
                post.feedId === feedId ? { ...post, likes: updatedData.likes, liked: true } : post
            ));
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleUnlike = async (feedId) => {
        try {
            const updatedData = await feedApi.unlikeFeed(feedId);
            setPosts(posts.map(post =>
                post.feedId === feedId ? { ...post, likes: updatedData.likes, liked: false } : post
            ));
        } catch (error) {
            console.error('Error unliking post:', error);
        }
    };

    const handleCommentSubmit = async (feedId, comment) => {
        if (!comment.trim()) return;
        try {
            const commentData = await feedApi.addComment(feedId, userId, comment);
            setPosts(posts.map(post =>
                post.feedId === feedId
                    ? { ...post, comments: [...post.comments, commentData] }
                    : post
            ));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleCommentDelete = async (commentId, feedId) => {
        try {
            await feedApi.deleteComment(feedId, commentId);
            setPosts(posts.map(post =>
                post.feedId === feedId
                    ? { ...post, comments: post.comments.filter(comment => comment.commentId !== commentId) }
                    : post
            ));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleToggleComments = (feedId) => {
        setPosts(posts.map(post =>
            post.feedId === feedId ? { ...post, showComments: !post.showComments } : post
        ));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white">
                <div className="text-green-600 flex flex-col items-center">
                    <FaGolfBall className="animate-spin text-5xl mb-3" />
                    <p className="text-lg font-light">피드를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto my-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-green-800">골프 피드</h1>
                <button
                    onClick={() => setShowNewPostForm(!showNewPostForm)}
                    className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition shadow-md w-12 h-12 flex items-center justify-center"
                >
                    <FaPlusCircle className="text-2xl" />
                </button>
            </div>

            {/* 새 게시물 작성 폼이 있으면 여기 표시 */}
            {showNewPostForm && (
                <NewPostForm
                    newPostContent={newPostContent}
                    setNewPostContent={setNewPostContent}
                    handleImageChange={handleImageChange}
                    imagePreview={imagePreview}
                    handleSubmit={handleSubmit}
                    setShowNewPostForm={setShowNewPostForm}
                    showNewPostForm={showNewPostForm}
                />
            )}

            <div className="space-y-6">
                {posts.map(post => (
                    <FeedPost
                        key={post.feedId}
                        post={post}
                        currentUser={{ userId }}
                        onLike={handleLike}
                        onUnlike={handleUnlike}
                        onDelete={handleDelete}
                        onToggleComments={handleToggleComments}
                        onCommentSubmit={handleCommentSubmit}
                        onCommentDelete={handleCommentDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeedPage;
