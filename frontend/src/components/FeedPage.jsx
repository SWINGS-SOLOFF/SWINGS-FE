import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaShare, FaBookmark, FaPlusCircle } from 'react-icons/fa';

const FeedPage = () => {
    // State for posts and new post form
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showNewPostForm, setShowNewPostForm] = useState(false);

    // Mock data for initial posts
    useEffect(() => {
        setPosts([
            {
                id: 1,
                username: 'golfer123',
                avatarUrl: 'https://placehold.co/40x40',
                imageUrl: 'https://placehold.co/600x400',
                caption: '오늘 멋진 골프 라운딩을 즐겼습니다! 좋은 사람들과 함께해서 더 좋았어요. 다음 매칭도 기대합니다.',
                likes: 42,
                comments: 8,
                timestamp: '2시간 전'
            },
            {
                id: 2,
                username: 'golf_pro',
                avatarUrl: 'https://placehold.co/40x40',
                imageUrl: 'https://placehold.co/600x400',
                caption: '골프 모임에서 새로운 친구들을 만났습니다. 다음 주 토요일에 또 만나기로 했어요!',
                likes: 28,
                comments: 5,
                timestamp: '4시간 전'
            },
            {
                id: 3,
                username: 'tee_time',
                avatarUrl: 'https://placehold.co/40x40',
                imageUrl: 'https://placehold.co/600x400',
                caption: '새 클럽으로 첫 라운딩. 스코어가 많이 좋아졌네요. 모임에서 만난 분의 조언이 큰 도움이 되었습니다.',
                likes: 56,
                comments: 12,
                timestamp: '어제'
            }
        ]);
    }, []);

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewPostImage(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Create new post
        const newPost = {
            id: posts.length + 1,
            username: 'current_user', // This would come from auth in a real app
            avatarUrl: 'https://placehold.co/40x40',
            imageUrl: imagePreview || 'https://placehold.co/600x400',
            caption: newPostContent,
            likes: 0,
            comments: 0,
            timestamp: '방금 전'
        };

        // Update posts state
        setPosts([newPost, ...posts]);

        // Reset form
        setNewPostContent('');
        setNewPostImage(null);
        setImagePreview(null);
        setShowNewPostForm(false);
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

            {/* Feed Posts */}
            <div className="space-y-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-green-100">
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
                        <img src={post.imageUrl} alt="Post content" className="w-full object-cover max-h-96" />

                        {/* Post Actions */}
                        <div className="flex justify-between p-4 border-b border-green-100">
                            <div className="flex space-x-4">
                                <button className="text-xl text-green-700 hover:text-green-900">
                                    <FaHeart />
                                </button>
                                <button className="text-xl text-green-700 hover:text-green-900">
                                    <FaComment />
                                </button>
                                <button className="text-xl text-green-700 hover:text-green-900">
                                    <FaShare />
                                </button>
                            </div>
                            <button className="text-xl text-green-700 hover:text-green-900">
                                <FaBookmark />
                            </button>
                        </div>

                        {/* Post Content */}
                        <div className="p-4">
                            <p className="font-semibold text-green-800 mb-1">{post.likes}명이 좋아합니다</p>
                            <p className="mb-2">
                                <span className="font-semibold text-green-800 mr-2">{post.username}</span>
                                {post.caption}
                            </p>
                            <p className="text-gray-500 text-sm mb-2">댓글 {post.comments}개 모두 보기</p>
                            <div className="flex items-center mt-2">
                                <input
                                    type="text"
                                    placeholder="댓글 추가..."
                                    className="flex-grow text-sm p-1 focus:outline-none"
                                />
                                <button className="text-green-600 font-semibold text-sm ml-2">게시</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedPage;