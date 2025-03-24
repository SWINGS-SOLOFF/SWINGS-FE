import React, { useState, useEffect } from 'react';
import { FaHeart, FaTrash, FaPlusCircle, FaTimes, FaUser } from 'react-icons/fa';
import axios from 'axios';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [newCommentContent, setNewCommentContent] = useState({});
    const userId = 1;  // 임시로 userId 1 사용

    // 사용자 프로필 정보 (예시)
    const userProfile = {
        username: "골프마스터",
        avatarUrl: null // 기본 아이콘 사용
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8090/swings/feeds');
            const data = Array.isArray(response.data) ? response.data : [];

            // 각 포스트에 대해 댓글 정보 가져오기
            const postsWithComments = await Promise.all(
                data.map(async (post) => {
                    try {
                        const commentsResponse = await axios.get(`http://localhost:8090/swings/feeds/${post.feedId}/comments`);
                        return {
                            ...post,
                            comments: Array.isArray(commentsResponse.data) ? commentsResponse.data : [],
                            liked: false, // 초기 상태 설정
                            showComments: false // 초기 상태 설정
                        };
                    } catch (error) {
                        console.error(`Error fetching comments for post ${post.feedId}:`, error);
                        return {
                            ...post,
                            comments: [],
                            liked: false,
                            showComments: false
                        };
                    }
                })
            );

            setPosts(postsWithComments);
        } catch (error) {
            console.error('Error fetching feeds:', error);
        }
    };

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

            // 새 게시물을 posts 배열의 시작에 추가
            const newPost = {
                ...response.data,
                liked: false,
                comments: [],
                showComments: false,
                // username이 응답에 없는 경우 기본값 설정
                username: response.data.username || userProfile.username
            };

            setPosts([ newPost, ...posts ]);

            // 폼 초기화
            setNewPostContent('');
            setNewPostImage(null);
            setImagePreview(null);
            setShowNewPostForm(false);
        } catch (error) {
            console.error('There was an error uploading the feed!', error);
        }
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
            const response = await axios.put(`http://localhost:8090/swings/feeds/${feedId}/like`);
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
            const response = await axios.put(`http://localhost:8090/swings/feeds/${feedId}/unlike`);
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
                    userId,
                    content: newCommentContent[feedId]
                }
            });

            setPosts(posts.map(post =>
                post.feedId === feedId
                    ? {
                        ...post,
                        comments: Array.isArray(post.comments)
                            ? [...post.comments, response.data]
                            : [response.data]
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

    // 댓글 보기/숨기기 토글
    const handleToggleComments = (feedId) => {
        setPosts(posts.map(post =>
            post.feedId === feedId
                ? { ...post, showComments: !post.showComments }
                : post
        ));
    };

    // 이미지 URL 정상화 함수
    const normalizeImageUrl = (url) => {
        if (!url) return '';

        // 이미 완전한 URL인 경우
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        // Backend에서 받은 URL이 상대경로인 경우
        if (url.startsWith('/')) {
            return `http://localhost:8090${url}`;
        }

        // Backend에서 파일명만 받은 경우
        return `http://localhost:8090/swings/uploads/${url}`;
    };

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

            {/* 상단 프로필 영역 */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-green-200 flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4 border-2 border-green-500">
                    {userProfile.avatarUrl ? (
                        <img src={userProfile.avatarUrl} alt="프로필" className="w-full h-full rounded-full" />
                    ) : (
                        <FaUser className="text-2xl text-green-700" />
                    )}
                </div>
                <div>
                    <p className="font-semibold text-green-800">{userProfile.username}</p>
                    <p className="text-sm text-gray-500">골프 피드에 새 소식을 공유해보세요!</p>
                </div>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
                <div className="bg-white p-5 rounded-lg shadow-md mb-6 border border-green-200">
                    <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 border border-green-500">
                            <FaUser className="text-xl text-green-700" />
                        </div>
                        <h2 className="text-xl font-semibold text-green-800">새 게시물 작성</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-green-700 mb-2 font-medium">사진 업로드</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                            />
                            {imagePreview && (
                                <div className="mt-3 rounded-lg overflow-hidden border border-green-300">
                                    <img src={imagePreview} alt="미리보기" className="w-full max-h-80 object-cover" />
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="block text-green-700 mb-2 font-medium">내용</label>
                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                className="w-full p-3 border border-green-300 rounded-lg h-28 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50"
                                placeholder="골프 모임에 대한 이야기를 공유해보세요..."
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowNewPostForm(false)}
                                className="px-5 py-3 mr-3 text-green-800 border-2 border-green-500 rounded-lg hover:bg-green-50 font-medium"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md"
                                disabled={!newPostContent.trim() && !newPostImage}
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
                        {/* Post Header - 프로필 더 강조 */}
                        <div className="flex items-center p-4 border-b border-green-100">
                            <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-green-400 overflow-hidden flex items-center justify-center mr-3">
                                {post.avatarUrl ? (
                                    <img
                                        src={post.avatarUrl}
                                        alt={post.username || "사용자"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUser className="text-2xl text-green-700" />
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-green-800 text-lg">{post.username || "사용자"}</p>
                                <p className="text-xs text-gray-500">
                                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                                </p>
                            </div>
                        </div>

                        {/* Post Image */}
                        {post.imageUrl && (
                            <div className="w-full">
                                <img
                                    src={normalizeImageUrl(post.imageUrl)}
                                    alt="피드 내용"
                                    className="w-full object-cover max-h-96"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/placeholder-image.jpg";
                                    }}
                                />
                            </div>
                        )}

                        {/* Post Content - 이미지 바로 아래로 이동 */}
                        <div className="p-4 border-b border-green-100">
                            <div className="mb-3">
                                <p className="mb-2">
                                    <span className="font-semibold text-green-800 mr-2">
                                        {post.username || "사용자"}
                                    </span>
                                    {post.caption}
                                </p>
                            </div>

                            {/* 좋아요 정보 */}
                            <p className="font-semibold text-green-800 mb-1">
                                {post.likes || 0}명이 좋아합니다
                            </p>
                        </div>

                        {/* Post Actions - 버튼 크기 조정 */}
                        <div className="flex p-2">
                            <button
                                onClick={() => post.liked ? handleUnlike(post.feedId) : handleLike(post.feedId)}
                                className="flex-1 flex justify-center items-center text-3xl hover:bg-green-50 transition duration-200 py-3 rounded-lg mx-1"
                            >
                                <FaHeart className={post.liked ? "text-red-600" : "text-green-700"} />
                            </button>
                            <button
                                onClick={() => handleDelete(post.feedId)}
                                className="flex-1 flex justify-center items-center text-3xl text-red-600 hover:bg-red-50 transition duration-200 py-3 rounded-lg mx-1"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div className="p-4 bg-green-50">
                            <p className="text-gray-700 text-sm mb-2">
                                댓글 {post.comments ? (Array.isArray(post.comments) ? post.comments.length : 0) : 0}개
                            </p>

                            {/* 댓글 토글 버튼 */}
                            <button
                                onClick={() => handleToggleComments(post.feedId)}
                                className="text-green-700 font-medium hover:text-green-900 transition mb-4"
                            >
                                {post.showComments ? '댓글 숨기기' : '댓글 보기'}
                            </button>

                            {/* 댓글 목록 */}
                            {post.showComments && post.comments && Array.isArray(post.comments) && (
                                <div className="space-y-3 mb-4">
                                    {post.comments.map(comment => (
                                        <div key={comment.commentId} className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg">
                                            <div>
                                                <p className="font-semibold text-green-800">{comment.username || '사용자'}</p>
                                                <p className="text-sm text-gray-700">{comment.content}</p>
                                            </div>
                                            <button
                                                onClick={() => handleCommentDelete(comment.commentId, post.feedId)}
                                                className="text-red-600 hover:text-red-800 transition p-2"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* 댓글 입력란 */}
                            <div className="flex items-center mt-2">
                                <textarea
                                    value={newCommentContent[post.feedId] || ''}
                                    onChange={(e) => setNewCommentContent({ ...newCommentContent, [post.feedId]: e.target.value })}
                                    className="flex-grow text-sm p-3 border border-green-300 rounded-lg bg-white"
                                    placeholder="댓글을 남겨보세요..."
                                    rows="2"
                                />
                                <button
                                    onClick={() => handleCommentSubmit(post.feedId)}
                                    className="text-white font-semibold text-sm ml-2 bg-green-600 px-4 py-3 rounded-lg hover:bg-green-700 transition h-12"
                                    disabled={!newCommentContent[post.feedId]?.trim()}
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