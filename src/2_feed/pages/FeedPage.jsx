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
import feedApi from '../api/feedApi.js';
import ImageModal from '../components/ImageModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeedPage = () => {
    const [posts, setPosts] = useState([]); // 피드에 표시될 게시물 목록
    const [newPostContent, setNewPostContent] = useState(''); // 게시물 내용
    const [newPostImage, setNewPostImage] = useState(null); // 게시물 이미지
    const [imagePreview, setImagePreview] = useState(null); // 업로드 이미지 미리보기 URL
    const [showNewPostForm, setShowNewPostForm] = useState(false); // 새 게시물 작성 폼 노출 여부
    const [loading, setLoading] = useState(true); // 데이터 로딩 여부
    const [selectedImage, setSelectedImage] = useState(null); // 이미지 모달용 상태
    const [likedUsers, setLikedUsers] = useState([]); // 좋아요한 사용자 목록
    const [isLikedModalOpen, setIsLikedModalOpen] = useState(false); // 좋아요 모달 열림 상태
    const [likeLoading, setLikeLoading] = useState({}); // 각 피드별 좋아요 요청 로딩 상태

    // 무한 스크롤을 위한 상태 추가
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);

    // 풀-투-리프레시를 위한 상태 추가
    const [isPulling, setIsPulling] = useState(false);
    const [pullY, setPullY] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const containerRef = useRef(null);
    const touchStartY = useRef(0);

    // 임시 로그인 사용자 ID
    const userId = 1;

    // 한 번에 불러올 게시물 개수 (줄임)
    const ITEMS_PER_PAGE = 5; // 기존 10에서 5로 변경

    // 무한 스크롤 구현을 위한 Intersection Observer
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

    // 무한 스크롤을 위한 ref
    const observer = useRef();

    // 페이지 로드시 서버에서 최신 피드 데이터를 부를때 userId 전달
    useEffect(() => {
        fetchInitialPosts();
    }, [userId]);

    // 풀-투-리프레시 이벤트 리스너 설정
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e) => {
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            const currentY = e.touches[0].clientY;
            const deltaY = currentY - touchStartY.current;

            // 스크롤이 맨 위에 있고, 아래로 당기는 중일 때만 풀-투-리프레시 활성화
            if (container.scrollTop === 0 && deltaY > 0) {
                e.preventDefault(); // 기본 스크롤 방지
                setIsPulling(true);
                setPullY(Math.min(deltaY, 100)); // 최대 100px까지만 당길 수 있도록 제한
            }
        };

        const handleTouchEnd = () => {
            if (isPulling && pullY > 50) { // 50px 이상 당겼을 때만 새로고침 실행
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

    // 초기 게시물 로드
    const fetchInitialPosts = async () => {
        try {
            setLoading(true);
            const data = await feedApi.getFeeds(userId, 0, ITEMS_PER_PAGE);

            if (data.length === 0) {
                setHasMore(false);
                setLoading(false);
                return;
            }

            // 각 피드에 대해 댓글도 함께 불러오기
            const postsWithDetails = await Promise.all(
                data.map(async (post) => {
                    const comments = await feedApi.getCommentsByFeedId(post.feedId);
                    return {
                        ...post,
                        comments,
                        showComments: false
                    };
                })
            );

            setPosts(postsWithDetails);
            setPage(1); // 다음 페이지를 위해 페이지 증가
            setLoading(false);
        } catch (error) {
            console.error('게시물 로딩 중 오류:', error);
            toast.error('게시물을 불러오지 못했습니다.');
            setLoading(false);
        }
    };

    // 추가 게시물 로딩
    const loadMorePosts = async () => {
        if (fetchingMore || !hasMore) return;

        try {
            setFetchingMore(true);
            const data = await feedApi.getFeeds(userId, page, ITEMS_PER_PAGE);

            if (data.length === 0) {
                setHasMore(false);
                setFetchingMore(false);
                return;
            }

            // 각 피드에 대해 댓글도 함께 불러오기
            const postsWithDetails = await Promise.all(
                data.map(async (post) => {
                    const comments = await feedApi.getCommentsByFeedId(post.feedId);
                    return {
                        ...post,
                        comments,
                        showComments: false
                    };
                })
            );

            setPosts(prev => [...prev, ...postsWithDetails]);
            setPage(prev => prev + 1);
            setFetchingMore(false);
        } catch (error) {
            console.error('추가 게시물 로딩 중 오류:', error);
            toast.error('추가 게시물을 불러오지 못했습니다.');
            setFetchingMore(false);
        }
    };

    // 새로고침 - 피드를 처음부터 다시 로드
    const refreshFeed = async () => {
        try {
            setRefreshing(true);
            setPosts([]); // 기존 피드 초기화
            setPage(0); // 페이지 초기화
            setHasMore(true); // 더 로드 가능함을 설정

            // 새로운 피드 로드
            const data = await feedApi.getFeeds(userId, 0, ITEMS_PER_PAGE);

            if (data.length === 0) {
                setHasMore(false);
                setRefreshing(false);
                return;
            }

            // 각 피드에 대해 댓글도 함께 불러오기
            const postsWithDetails = await Promise.all(
                data.map(async (post) => {
                    const comments = await feedApi.getCommentsByFeedId(post.feedId);
                    return {
                        ...post,
                        comments,
                        showComments: false
                    };
                })
            );

            setPosts(postsWithDetails);
            setPage(1); // 다음 페이지를 위해 페이지 증가

            toast.success('피드가 새로고침되었습니다.');
        } catch (error) {
            console.error('피드 새로고침 중 오류:', error);
            toast.error('피드를 새로고침하지 못했습니다.');
        } finally {
            setRefreshing(false);
        }
    };

    // 좋아요한 유저 보기
    const LikedUsersModal = ({ users, onClose }) => {
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
    };

    // 이미지 클릭 시 모달 열기
    const handleImageClick = (imageUrl) => {
        console.log("이미지 클릭됨:", imageUrl);
        setSelectedImage(imageUrl);
    };

    // 좋아요한 사용자 목록 가져오기
    const handleShowLikedBy = async (feedId) => {
        try {
            const users = await feedApi.getLikedUsers(feedId);
            if (users.length === 0) {
                toast.info('아직 좋아요한 사용자가 없습니다.');
                return;
            }
            setLikedUsers(users);
            setIsLikedModalOpen(true);
        } catch (error) {
            console.error("좋아요 사용자 로딩 오류:", error);
            toast.error('좋아요 사용자를 불러오지 못했습니다.');
        }
    };

    // 이미지 미리보기 및 모달창
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

    const LikeButton = ({
                            liked,
                            likeCount,
                            onLike,
                            onUnlike,
                            isLoading
                        }) => {
        const handleClick = () => {
            if (isLoading) return;

            // 좋아요 상태에 따라 다른 액션 수행
            liked ? onUnlike() : onLike();
        };

        return (
            <motion.div
                className="flex items-center space-x-2"
                whileTap={{ scale: 0.95 }}
            >
                <button
                    onClick={handleClick}
                    disabled={isLoading}
                    className={`
                    transition-all duration-200 ease-in-out
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                `}
                >
                    {liked ? (
                        <FaHeart
                            className="text-red-500 text-2xl"
                            style={{ animation: liked ? 'pulse 0.5s' : 'none' }}
                        />
                    ) : (
                        <FaRegHeart
                            className="text-gray-500 hover:text-red-300 text-2xl"
                        />
                    )}
                </button>
                <span className="text-sm text-gray-600">
                {likeCount || 0}
            </span>
            </motion.div>
        );
    };

    const handleLike = async (feedId) => {
        if (likeLoading[feedId]) return;

        // UI에서 먼저 반영 (Optimistic UI)
        setPosts(posts.map(post =>
            post.feedId === feedId
                ? { ...post, liked: true, likes: post.likes + 1 }
                : post
        ));
        setLikeLoading(prev => ({ ...prev, [feedId]: true }));

        try {
            await feedApi.likeFeed(feedId, userId);
        } catch (error) {
            console.error('좋아요 오류:', error);
            // 실패 시 이전 상태로 롤백
            setPosts(posts.map(post =>
                post.feedId === feedId
                    ? { ...post, liked: false, likes: post.likes - 1 }
                    : post
            ));
        } finally {
            setLikeLoading(prev => ({ ...prev, [feedId]: false }));
        }
    };

    const handleUnlike = async (feedId) => {
        if (likeLoading[feedId]) return;

        // UI에서 먼저 반영 (Optimistic UI)
        setPosts(posts.map(post =>
            post.feedId === feedId
                ? { ...post, liked: false, likes: post.likes - 1 }
                : post
        ));
        setLikeLoading(prev => ({ ...prev, [feedId]: true }));

        try {
            await feedApi.unlikeFeed(feedId, userId);
        } catch (error) {
            console.error('좋아요 취소 실패:', error);
            toast.error('좋아요 취소에 실패했습니다.');
            // 실패 시 이전 상태로 롤백
            setPosts(posts.map(post =>
                post.feedId === feedId
                    ? { ...post, liked: true, likes: post.likes + 1 }
                    : post
            ));
        } finally {
            setLikeLoading(prev => ({ ...prev, [feedId]: false }));
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

            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-4 z-10">
                <h1 className="text-3xl font-bold text-green-800">골프 피드</h1>
                <button
                    onClick={() => setShowNewPostForm(!showNewPostForm)}
                    className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition shadow-md w-12 h-12 flex items-center justify-center"
                >
                    <FaPlusCircle className="text-2xl" />
                </button>
            </div>

            <AnimatePresence>
                {isLikedModalOpen && (
                    <LikedUsersModal
                        users={likedUsers}
                        onClose={() => setIsLikedModalOpen(false)}
                    />
                )}
            </AnimatePresence>

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
                {posts.map((post, index) => {
                    // 마지막 게시물에 ref 설정
                    if (posts.length === index + 1) {
                        return (
                            <div key={post.feedId} ref={lastPostRef}>
                                <FeedPost
                                    post={post}
                                    currentUser={{ userId }}
                                    onLike={handleLike}
                                    onUnlike={handleUnlike}
                                    onDelete={handleDelete}
                                    onToggleComments={handleToggleComments}
                                    onCommentSubmit={handleCommentSubmit}
                                    onCommentDelete={handleCommentDelete}
                                    onImageClick={handleImageClick}
                                    onShowLikedBy={handleShowLikedBy}
                                />
                            </div>
                        );
                    } else {
                        return (
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
                                onImageClick={handleImageClick}
                                onShowLikedBy={handleShowLikedBy}
                            />
                        );
                    }
                })}

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