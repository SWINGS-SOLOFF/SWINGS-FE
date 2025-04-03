import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPlusCircle,
    FaSpinner,
    FaArrowDown,
    FaRandom
} from 'react-icons/fa';
import NewPostForm from '../components/NewPostForm';
import FeedPost from '../components/FeedPost';
import feedApi from '../api/feedApi';
import ImageModal from '../components/ImageModal';
import LikedUsersModal from '../components/LikedUsersModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeedPage = () => {
    const [user, setUser] = useState(null);
    const userId = user?.userId;

    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
        try {
            const userData = await feedApi.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error("❌ 사용자 정보를 가져오는 데 실패했습니다.", error);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const [posts, setPosts] = useState([]);
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [likedUsers, setLikedUsers] = useState([]);
    const [isLikedModalOpen, setIsLikedModalOpen] = useState(false);
    const [likeLoading, setLikeLoading] = useState({});
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [isPulling, setIsPulling] = useState(false);
    const [pullY, setPullY] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [sortMethod, setSortMethod] = useState('latest'); // 'latest', 'random'

    const containerRef = useRef(null);
    const touchStartY = useRef(0);
    const observer = useRef();
    const ITEMS_PER_PAGE = 5;

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

    useEffect(() => {
        fetchInitialPosts();
    }, [sortMethod]); // sortMethod가 변경될 때마다 피드를 다시 불러옴

    const fetchInitialPosts = async () => {
        try {
            setLoading(true);
            
            // 최신순 또는 랜덤 정렬 옵션 추가
            const options = {
                sort: sortMethod
            };
            
            // userId 파라미터를 null로 전달하여 모든 사용자의 피드를 가져옴
            const data = await feedApi.getFeeds(null, 0, ITEMS_PER_PAGE, options);
            if (data.length === 0) {
                setHasMore(false);
                setLoading(false);
                return;
            }
            
            // 랜덤 정렬인 경우 프론트엔드에서 한 번 더 무작위로 섞기
            const sortedData = sortMethod === 'random' 
                ? shuffleArray([...data]) 
                : data;
                
            const postsWithComments = await addCommentsToFeed(sortedData);
            setPosts(postsWithComments);
            setPage(1);
        } catch (error) {
            console.error('게시물 로딩 중 오류:', error);
            toast.error('게시물을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 배열을 무작위로 섞는 함수
    const shuffleArray = (array) => {
        let currentIndex = array.length, randomIndex;
        
        // 요소가 남아있는 동안
        while (currentIndex !== 0) {
            // 남은 요소 중에서 무작위 인덱스를 선택
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            
            // 현재 요소와 선택된 요소를 교환
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        
        return array;
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
            
            // 정렬 옵션 추가
            const options = {
                sort: sortMethod
            };
            
            // userId 파라미터를 null로 전달하여 모든 사용자의 피드를 가져옴
            const data = await feedApi.getFeeds(null, page, ITEMS_PER_PAGE, options);
            if (data.length === 0) {
                setHasMore(false);
                return;
            }
            
            // 랜덤 정렬인 경우 프론트엔드에서 한 번 더 무작위로 섞기
            const sortedData = sortMethod === 'random' 
                ? shuffleArray([...data]) 
                : data;
                
            const postsWithComments = await addCommentsToFeed(sortedData);
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
            
            // 정렬 옵션 추가
            const options = {
                sort: sortMethod
            };
            
            // userId 파라미터를 null로 전달하여 모든 사용자의 피드를 가져옴
            const data = await feedApi.getFeeds(null, 0, ITEMS_PER_PAGE, options);
            if (data.length === 0) {
                setHasMore(false);
                return;
            }
            
            // 랜덤 정렬인 경우 프론트엔드에서 한 번 더 무작위로 섞기
            const sortedData = sortMethod === 'random' 
                ? shuffleArray([...data]) 
                : data;
                
            const postsWithComments = await addCommentsToFeed(sortedData);
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

    // 정렬 방식 변경 함수
    const toggleSortMethod = () => {
        const newSortMethod = sortMethod === 'latest' ? 'random' : 'latest';
        setSortMethod(newSortMethod);
        toast.info(`${newSortMethod === 'latest' ? '최신순' : '랜덤'} 정렬로 변경되었습니다.`);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e) => {
            if (container.scrollTop <= 0) {
                touchStartY.current = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e) => {
            if (container.scrollTop <= 0) {
                const currentY = e.touches[0].clientY;
                const deltaY = currentY - touchStartY.current;
                
                if (deltaY > 0) {
                    e.preventDefault(); // Important to prevent scrolling
                    setIsPulling(true);
                    setPullY(Math.min(deltaY, 100));
                }
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
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewPostImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            toast.error('로그인 후 게시물을 작성할 수 있습니다.');
            return;
        }
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

    const handleLike = async (feedId) => {
        if (!userId) {
            toast.warn('로그인 후 좋아요를 누를 수 있습니다.');
            return;
        }
        if (likeLoading[feedId]) return;
        setPosts(posts.map(post => post.feedId === feedId ? { ...post, liked: true, likes: post.likes + 1 } : post));
        setLikeLoading(prev => ({ ...prev, [feedId]: true }));
        try {
            await feedApi.likeFeed(feedId, userId);
        } catch (error) {
            console.error('좋아요 오류:', error);
            setPosts(posts.map(post => post.feedId === feedId ? { ...post, liked: false, likes: post.likes - 1 } : post));
            toast.error('좋아요 처리에 실패했습니다.');
        } finally {
            setLikeLoading(prev => ({ ...prev, [feedId]: false }));
        }
    };

    const handleUnlike = async (feedId) => {
        if (!userId) {
            toast.warn('로그인 후 좋아요를 취소할 수 있습니다.');
            return;
        }
        if (likeLoading[feedId]) return;
        setPosts(posts.map(post => post.feedId === feedId ? { ...post, liked: false, likes: post.likes - 1 } : post));
        setLikeLoading(prev => ({ ...prev, [feedId]: true }));
        try {
            await feedApi.unlikeFeed(feedId, userId);
        } catch (error) {
            console.error('좋아요 취소 실패:', error);
            setPosts(posts.map(post => post.feedId === feedId ? { ...post, liked: true, likes: post.likes + 1 } : post));
            toast.error('좋아요 취소에 실패했습니다.');
        } finally {
            setLikeLoading(prev => ({ ...prev, [feedId]: false }));
        }
    };

    const handleCommentSubmit = async (feedId, comment) => {
        if (!userId) {
            toast.warn('로그인 후 댓글을 작성할 수 있습니다.');
            return;
        }
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
                post.feedId === feedId ? { ...post, comments: post.comments.filter(c => c.commentId !== commentId) } : post
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

    const handleDelete = async (feedId) => {
        try {
            await feedApi.deleteFeed(feedId);
            setPosts((prevPosts) =>
                prevPosts.filter((post) => post.feedId !== feedId)
            );
            toast.success("게시물이 삭제되었습니다.");
        } catch (error) {
            console.error("게시물 삭제 오류:", error);
            toast.error("게시물 삭제에 실패했습니다.");
        }
    };

    if (loading && page === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
                <div className="text-gray-800 flex flex-col items-center">
                    <FaSpinner className="animate-spin text-5xl mb-3" />
                    <p className="text-lg font-light">게시물을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col items-center pt-16"> 
            <div
                ref={containerRef}
                className="w-full max-w-xl mx-auto h-full overflow-y-auto bg-gray-50 flex-1"
                style={{ 
                    height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 64px)', 
                    padding: '0 1rem'
                }}
            >
                <ToastContainer position="bottom-right" />

                {/* 풀-투-리프레시 인디케이터 */}
                {isPulling && (
                    <div
                        className="flex justify-center items-center py-4 text-gray-700"
                        style={{ height: `${pullY}px`, transition: 'height 0.2s ease-out' }}
                    >
                        <div className="flex flex-col items-center">
                            <FaArrowDown
                                className={`text-2xl ${pullY > 50 ? 'text-black' : 'text-gray-400'}`}
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
                        <FaSpinner className="animate-spin text-2xl text-gray-800" />
                        <span className="ml-2 text-gray-800">새로고침 중...</span>
                    </div>
                )}

                {/* 새 게시물 버튼과 정렬 방식 토글 버튼 */}
                <div className="sticky top-0 bg-gradient-to-b from-gray-50 via-gray-50 to-transparent py-4 z-20">
                    <div className="bg-white rounded-full shadow-md p-3 flex justify-between items-center">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900 ml-3">Feed</h1>
                            <button 
                                onClick={toggleSortMethod}
                                className="ml-3 text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700 hover:bg-gray-200 flex items-center"
                            >
                                <FaRandom className="mr-1" />
                                {sortMethod === 'latest' ? '최신순' : '랜덤'}
                            </button>
                        </div>
                        <button
                            onClick={() => setShowNewPostForm(!showNewPostForm)}
                            className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition shadow-md flex items-center justify-center"
                        >
                            <FaPlusCircle className="text-xl" />
                            <span className="ml-2 mr-1 font-medium hidden sm:inline">새 게시물</span>
                        </button>
                    </div>
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

                {/* 새 게시물 폼 - AnimatePresence로 애니메이션 효과 추가 */}
                <AnimatePresence>
                    {showNewPostForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10"
                        >
                            <NewPostForm
                                newPostContent={newPostContent}
                                setNewPostContent={setNewPostContent}
                                handleImageChange={handleImageChange}
                                imagePreview={imagePreview}
                                handleSubmit={handleSubmit}
                                setShowNewPostForm={setShowNewPostForm}
                                showNewPostForm={showNewPostForm}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 피드 목록 */}
                <div className="space-y-6 mt-4 pb-16"> 
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <motion.div 
                                key={post.feedId} 
                                ref={index === posts.length - 1 ? lastPostRef : null}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="transform transition-all duration-300 hover:translate-y-[-2px]" 
                            >
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
                                    likeLoading={likeLoading}
                                />
                            </motion.div>
                        ))
                    ) : !loading && (
                        <div className="text-center py-8 bg-white rounded-lg shadow-md">
                            <p className="text-black">아직 게시물이 없습니다.</p>
                            <p className="text-gray-500 mt-2">첫 번째 게시물을 작성해보세요!</p>
                        </div>
                    )}

                    {fetchingMore && (
                        <div className="flex justify-center py-4">
                            <FaSpinner className="animate-spin text-3xl text-gray-800" />
                        </div>
                    )}

                    {!hasMore && posts.length > 0 && (
                        <div className="text-center py-6 text-gray-500 bg-white rounded-lg shadow-md">
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
        </div>
    );
};

export default FeedPage;