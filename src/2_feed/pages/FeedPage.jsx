import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPlusCircle,
    FaTimes,
    FaHeart,
    FaRegHeart,
    FaSpinner,
    FaArrowDown
} from 'react-icons/fa';
import NewPostForm from '../components/NewPostForm';
import FeedPost from '../components/FeedPost';
import feedApi from '../api/feedApi';
import ImageModal from '../components/ImageModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 좋아요한 유저 목록 모달 컴포넌트 분리
const LikedUsersModal = ({ users, onClose }) => (
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
                    <FaHeart className="mr-2 text-red-300" />
                    좋아요 ({users.length})
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
                        <FaRegHeart className="mx-auto text-4xl mb-4 text-gray-300" />
                        <p>아직 좋아요를 누른 사용자가 없습니다.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {users.map((user) => (
                            <li
                                key={user.userId}
                                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <img
                                    src={user.avatarUrl || '/default-profile.jpg'}
                                    alt="프로필"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{user.username}</p>
                                    <p className="text-xs text-gray-500">{user.description || '골퍼'}</p>
                                </div>
                                <FaHeart className="ml-auto text-red-500" />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </motion.div>
    </motion.div>
);

const FeedPage = () => {
    // 상태 관리
    const [posts, setPosts] = useState([]);
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [likedUsers, setLikedUsers] = useState([]);
    const [isLikedModalOpen, setIsLikedModalOpen] = useState(false);
    const [likeLoading, setLikeLoading] = useState({});
    
    // 무한 스크롤 상태
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    
    // 풀-투-리프레시 상태
    const [isPulling, setIsPulling] = useState(false);
    const [pullY, setPullY] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    
    // 새 게시물 상태
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    // 참조
    const containerRef = useRef(null);
    const touchStartY = useRef(0);
    const observer = useRef();
    
    // 설정값
    const ITEMS_PER_PAGE = 5;
    const userId = 1; // 임시 사용자 ID

    // 무한 스크롤 감지를 위한 ref 콜백
    const lastPostRef = useCallback(node => {
        if (loading || fetchingMore) return;
        
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMorePosts();
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, fetchingMore, hasMore]);

    // 초기 데이터 로드
    useEffect(() => {
        fetchInitialPosts();
    }, []);

    // 풀-투-리프레시 설정
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e) => {
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - touchStartY.current;

            if (container.scrollTop === 0 && deltaY > 0) {
                e.preventDefault();
                setIsPulling(true);
                setPullY(Math.min(deltaY, 100));
            }
        };

        const handleTouchEnd = () => {
            if (isPulling && pullY > 50) {
                refreshFeed();
            }
            setIsPulling(false);
            setPullY(0);
        };

        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isPulling, pullY]);

    // API 요청 함수들
    const fetchInitialPosts = async () => {
        try {
            setLoading(true);
            const data = await feedApi.getFeeds(userId, 0, ITEMS_PER_PAGE);
            
            if (data.length === 0) {
                setHasMore(false);
                setLoading(false);
                return;
            }
            
            const postsWithComments = await addCommentsToFeed(data);
            setPosts(postsWithComments);
            setPage(1);
        } catch (error) {
            console.error('게시물 로딩 중 오류:', error);
            toast.error('게시물을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const addCommentsToFeed = async (feedData) => {
        return Promise.all(
            feedData.map(async (post) => {
                const comments = await feedApi.getCommentsByFeedId(post.feedId);
                return {
                    ...post,
                    comments,
                    showComments: false
                };
            })
        );
    };

    const loadMorePosts = async () => {
        if (fetchingMore || !hasMore) return;
        
        try {
            setFetchingMore(true);
            const data = await feedApi.getFeeds(userId, page, ITEMS_PER_PAGE);
            
            if (data.length === 0) {
                setHasMore(false);
                return;
            }
            
            const postsWithComments = await addCommentsToFeed(data);
            setPosts(prev => [...prev, ...postsWithComments]);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error('추가 게시물 로딩 중 오류:', error);
            toast.error('추가 게시물을 불러오지 못했습니다.');
        } finally {
            setFetchingMore(false);
        }
    };

    const refreshFeed = async () => {
        try {
            setRefreshing(true);
            setPosts([]);
            setPage(0);
            setHasMore(true);
            
            const data = await feedApi.getFeeds(userId, 0, ITEMS_PER_PAGE);
            
            if (data.length === 0) {
                setHasMore(false);
                return;
            }
            
            const postsWithComments = await addCommentsToFeed(data);
            setPosts(postsWithComments);
            setPage(1);
            
            toast.success('피드가 새로고침되었습니다.');
        } catch (error) {
            console.error('피드 새로고침 중 오류:', error);
            toast.error('피드를 새로고침하지 못했습니다.');
        } finally {
            setRefreshing(false);
        }
    };

    // 이벤트 핸들러 함수들
    const handleShowLikedBy = async (feedId) => {
        try {
            const users = await feedApi.getLikedUsers(feedId);
            setLikedUsers(users);
            setIsLikedModalOpen(true);
            
            if (users.length === 0) {
                toast.info('아직 좋아요한 사용자가 없습니다.');
            }
        } catch (error) {
            console.error("좋아요 사용자 로딩 오류:", error);
            toast.error('좋아요 사용자를 불러오지 못했습니다.');
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
            
            toast.success('게시물이 업로드되었습니다.');
        } catch (error) {
            console.error('게시물 업로드 오류:', error);
            toast.error('게시물을 업로드하지 못했습니다.');
        }
    };

    const handleDelete = async (feedId) => {
        try {
            await feedApi.deleteFeed(feedId);
            setPosts(posts.filter(post => post.feedId !== feedId));
            toast.success('게시물이 삭제되었습니다.');
        } catch (error) {
            console.error('게시물 삭제 오류:', error);
            toast.error('게시물 삭제에 실패했습니다.');
        }
    };

    const handleLike = async (feedId) => {
        if (likeLoading[feedId]) return;
        
        // Optimistic UI 업데이트
        setPosts(posts.map(post =>
            post.feedId === feedId ? { ...post, liked: true, likes: post.likes + 1 } : post
        ));
        setLikeLoading(prev => ({ ...prev, [feedId]: true }));
        
        try {
            await feedApi.likeFeed(feedId, userId);
        } catch (error) {
            console.error('좋아요 오류:', error);
            // 롤백
            setPosts(posts.map(post =>
                post.feedId === feedId ? { ...post, liked: false, likes: post.likes - 1 } : post
            ));
            toast.error('좋아요 처리에 실패했습니다.');
        } finally {
            setLikeLoading(prev => ({ ...prev, [feedId]: false }));
        }
    };

    const handleUnlike = async (feedId) => {
        if (likeLoading[feedId]) return;
        
        // Optimistic UI 업데이트
        setPosts(posts.map(post =>
            post.feedId === feedId ? { ...post, liked: false, likes: post.likes - 1 } : post
        ));
        setLikeLoading(prev => ({ ...prev, [feedId]: true }));
        
        try {
            await feedApi.unlikeFeed(feedId, userId);
        } catch (error) {
            console.error('좋아요 취소 실패:', error);
            // 롤백
            setPosts(posts.map(post =>
                post.feedId === feedId ? { ...post, liked: true, likes: post.likes + 1 } : post
            ));
            toast.error('좋아요 취소에 실패했습니다.');
        } finally {
            setLikeLoading(prev => ({ ...prev, [feedId]: false }));
        }
    };

    const handleCommentSubmit = async (feedId, comment) => {
        if (!comment.trim()) return;
        
        try {
            const commentData = await feedApi.addComment(feedId, userId, comment);
            setPosts(posts.map(post =>
                post.feedId === feedId ? { ...post, comments: [...post.comments, commentData] } : post
            ));
            toast.success('댓글이 추가되었습니다.');
        } catch (error) {
            console.error('댓글 추가 중 오류 발생:', error);
            toast.error('댓글을 추가하지 못했습니다.');
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
            toast.success('댓글이 삭제되었습니다.');
        } catch (error) {
            console.error('댓글 삭제 중 오류 발생:', error);
            toast.error('댓글 삭제에 실패했습니다.');
        }
    };

    const handleToggleComments = (feedId) => {
        setPosts(posts.map(post =>
            post.feedId === feedId ? { ...post, showComments: !post.showComments } : post
        ));
    };

    if (loading && page === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white">
                <div className="text-green-600 flex flex-col items-center">
                    <FaSpinner className="animate-spin text-5xl mb-3" />
                    <p className="text-lg font-light">게시물을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="max-w-2xl mx-auto my-8 px-4 h-full overflow-y-auto"
            style={{ height: 'calc(100vh - 2rem)' }}
        >
            <ToastContainer position="bottom-right" />

            {/* 풀-투-리프레시 인디케이터 */}
            {isPulling && (
                <div
                    className="flex justify-center items-center py-4 text-green-600"
                    style={{ height: `${pullY}px`, transition: 'height 0.2s ease-out' }}
                >
                    <div className="flex flex-col items-center">
                        <FaArrowDown
                            className={`text-2xl ${pullY > 50 ? 'text-green-600' : 'text-gray-400'}`}
                            style={{ transform: `rotate(${Math.min(pullY * 3.6, 180)}deg)` }}
                        />
                        <p className="text-sm mt-2">
                            {pullY > 50 ? '놓아서 새로고침' : '당겨서 새로고침'}
                        </p>
                    </div>
                </div>
            )}

            {/* 새로고침 중 표시기 */}
            {refreshing && (
                <div className="flex justify-center items-center py-4">
                    <FaSpinner className="animate-spin text-2xl text-green-600" />
                    <span className="ml-2 text-green-600">새로고침 중...</span>
                </div>
            )}

            {/* 헤더 */}
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-4 z-10">
                <h1 className="text-3xl font-bold text-green-800">골프 피드</h1>
                <button
                    onClick={() => setShowNewPostForm(!showNewPostForm)}
                    className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition shadow-md w-12 h-12 flex items-center justify-center"
                >
                    <FaPlusCircle className="text-2xl" />
                </button>
            </div>

            {/* 모달 */}
            <AnimatePresence>
                {isLikedModalOpen && (
                    <LikedUsersModal
                        users={likedUsers}
                        onClose={() => setIsLikedModalOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* 새 게시물 폼 */}
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

            {/* 피드 목록 */}
            <div className="space-y-6">
                {posts.map((post, index) => (
                    <div key={post.feedId} ref={index === posts.length - 1 ? lastPostRef : null}>
                        <FeedPost
                            post={post}
                            currentUser={{ userId }}
                            onLike={handleLike}
                            onUnlike={handleUnlike}
                            onDelete={handleDelete}
                            onToggleComments={handleToggleComments}
                            onCommentSubmit={handleCommentSubmit}
                            onCommentDelete={handleCommentDelete}
                            onImageClick={setSelectedImage}
                            onShowLikedBy={handleShowLikedBy}
                        />
                    </div>
                ))}

                {fetchingMore && (
                    <div className="flex justify-center py-4">
                        <FaSpinner className="animate-spin text-3xl text-green-600" />
                    </div>
                )}

                {!hasMore && posts.length > 0 && (
                    <div className="text-center py-6 text-gray-500">
                        더 이상 불러올 게시물이 없습니다.
                    </div>
                )}
            </div>

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

export default FeedPage;