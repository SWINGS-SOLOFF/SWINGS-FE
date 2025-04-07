import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useProfileData from "../hooks/useProfileData";
import { useFeedData } from "../hooks/useFeedData";
import SocialProfile from "../components/SocialProfile";
import ImageModal from "../components/ImageModal";
import { FollowListModal } from "../components/SocialProfile";
import { normalizeImageUrl } from "../utils/imageUtils";
import { FaSpinner, FaComment, FaHeart } from "react-icons/fa";
import socialApi from "../api/socialApi";

const SocialPage = () => {
  const { userId: paramUserId } = useParams();
  const [viewedUserId, setViewedUserId] = useState(
    paramUserId ? Number(paramUserId) : null
  );

  // 현재 로그인한 사용자 가져오기
  const [currentUser, setCurrentUser] = useState(null);
  const [profileError, setProfileError] = useState(null);

  // 모달 상태
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);
  const [likedByUsers, setLikedByUsers] = useState([]);
  const [showLikedByModal, setShowLikedByModal] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState(null);
  const [likeLoading, setLikeLoading] = useState({});

  // 선택된 피드를 위한 상태 추가
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [showFeedModal, setShowFeedModal] = useState(false);

  // 자기소개 편집 상태
  const [editingIntroduce, setEditingIntroduce] = useState(false);
  const [introduceInput, setIntroduceInput] = useState("");

  // 피드 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 12; // 그리드 레이아웃에 맞게 12개씩 로드 (4x3 또는 3x4)

  // useProfileData 훅 사용
  const {
    loading: profileLoading,
    error: profileDataError,
    profile,
    introduce,
    isFollowing,
    stats,
    followers,
    followings,
    refreshProfileData,
  } = useProfileData(viewedUserId, currentUser);

  // useFeedData 훅 사용
  const {
    loading: feedsLoading,
    error: feedsError,
    feeds,
    handleLike,
    handleUnlike,
    handleDelete,
    handleCommentInputChange,
    handleCommentSubmit,
    handleCommentDelete,
    refreshFeeds,
    loadMoreFeeds,
  } = useFeedData(viewedUserId, currentUser, page, ITEMS_PER_PAGE);

  const navigate = useNavigate();

  // 현재 로그인 사용자 정보 로드
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await socialApi.getCurrentUser();
        setCurrentUser(user);

        // paramUserId가 없으면 본인 프로필 조회로 판단
        if (!paramUserId) {
          setViewedUserId(user.userId);
        }
      } catch (err) {
        console.error("현재 사용자 정보 불러오기 실패:", err);
        setProfileError("사용자 정보를 불러오지 못했습니다.");
      }
    };

    fetchCurrentUser();
  }, [paramUserId]);

  // currentUser가 설정된 후에만 데이터 로드하도록 수정
  useEffect(() => {
    if (currentUser) {
      refreshProfileData();
      refreshFeeds();
      setPage(1); // 사용자가 변경될 때 페이지 초기화
      setHasMore(true);
    }
  }, [currentUser, viewedUserId]);

  // 자기소개 입력 값 설정
  useEffect(() => {
    if (introduce) {
      setIntroduceInput(introduce);
    }
  }, [introduce]);

  // 스크롤 이벤트 처리
  const handleScroll = async (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    // 스크롤이 하단에 도달했는지 확인 (여유분 50px)
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      !feedsLoading &&
      hasMore
    ) {
      const moreFeeds = await loadMoreFeeds(page + 1, ITEMS_PER_PAGE);
      if (moreFeeds && moreFeeds.length > 0) {
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    }
  };

  // 피드 클릭 핸들러 - 모달에 표시할 피드 설정
  const handleFeedClick = (feed) => {
    setSelectedFeed(feed);
    setShowFeedModal(true);
  };

  // 피드 모달 닫기
  const handleCloseFeedModal = () => {
    setSelectedFeed(null);
    setShowFeedModal(false);
  };

  // 이미지 클릭 핸들러
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // 이미지 모달 닫기
  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  // 댓글 토글 핸들러
  const handleToggleComments = (feedId) => {
    const updatedFeeds = feeds.map((feed) => {
      if (feed.feedId === feedId) {
        return { ...feed, showComments: !feed.showComments };
      }
      return feed;
    });
    // 선택된 피드가 있고 해당 피드의 ID가 일치하면 선택된 피드도 업데이트
    if (selectedFeed && selectedFeed.feedId === feedId) {
      setSelectedFeed({
        ...selectedFeed,
        showComments: !selectedFeed.showComments,
      });
    }
  };

  // 좋아요 사용자 목록 보기 핸들러
  const handleShowLikedBy = async (feedId) => {
    try {
      setSelectedFeedId(feedId);
      // API에서 좋아요 사용자 목록 가져오기
      const users = await socialApi.getLikedByUsers(feedId);
      setLikedByUsers(users);
      setShowLikedByModal(true);
    } catch (err) {
      console.error("좋아요 사용자 목록 가져오기 실패:", err);
      toast.error("좋아요 사용자 목록을 불러오는 데 실패했습니다.");
    }
  };

  // 좋아요 처리 함수 - 로딩 상태 추가
  const handleLikeWithLoading = async (feedId) => {
    setLikeLoading((prev) => ({ ...prev, [feedId]: true }));
    try {
      await handleLike(feedId);
      // 선택된 피드가 있고 해당 피드의 ID가 일치하면 선택된 피드도 업데이트
      if (selectedFeed && selectedFeed.feedId === feedId) {
        setSelectedFeed({
          ...selectedFeed,
          isLiked: true,
          likeCount: selectedFeed.likeCount + 1,
        });
      }
    } finally {
      setLikeLoading((prev) => ({ ...prev, [feedId]: false }));
    }
  };

  // 좋아요 취소 처리 함수 - 로딩 상태 추가
  const handleUnlikeWithLoading = async (feedId) => {
    setLikeLoading((prev) => ({ ...prev, [feedId]: true }));
    try {
      await handleUnlike(feedId);
      // 선택된 피드가 있고 해당 피드의 ID가 일치하면 선택된 피드도 업데이트
      if (selectedFeed && selectedFeed.feedId === feedId) {
        setSelectedFeed({
          ...selectedFeed,
          isLiked: false,
          likeCount: selectedFeed.likeCount - 1,
        });
      }
    } finally {
      setLikeLoading((prev) => ({ ...prev, [feedId]: false }));
    }
  };

  // 댓글 제출 핸들러 - 선택된 피드 상태 업데이트 추가
  const handleCommentSubmitWithUpdate = async (feedId, comment) => {
    const newComment = await handleCommentSubmit(feedId, comment);

    // 선택된 피드가 있고 해당 피드의 ID가 일치하면 선택된 피드도 업데이트
    if (selectedFeed && selectedFeed.feedId === feedId && newComment) {
      setSelectedFeed({
        ...selectedFeed,
        comments: [...(selectedFeed.comments || []), newComment],
        commentCount: selectedFeed.commentCount + 1,
      });
    }

    return newComment;
  };

  // 댓글 삭제 핸들러 - 선택된 피드 상태 업데이트 추가
  const handleCommentDeleteWithUpdate = async (commentId, feedId) => {
    await handleCommentDelete(commentId, feedId);

    // 선택된 피드가 있고 해당 피드의 ID가 일치하면 선택된 피드도 업데이트
    if (selectedFeed && selectedFeed.feedId === feedId) {
      setSelectedFeed({
        ...selectedFeed,
        comments: (selectedFeed.comments || []).filter(
          (comment) => comment.commentId !== commentId
        ),
        commentCount: selectedFeed.commentCount - 1,
      });
    }
  };

  // 자기소개 저장 핸들러
  const handleIntroduceSave = async () => {
    try {
      await socialApi.updateIntroduce(viewedUserId, introduceInput);
      setEditingIntroduce(false);
      refreshProfileData(); // 프로필 데이터 새로고침
      toast.success("자기소개가 업데이트되었습니다.");
    } catch (err) {
      console.error("Introduce update error:", err);
      toast.error("자기소개 업데이트 중 오류 발생");
    }
  };

  // 팔로우 토글 핸들러
  const handleFollowToggle = async () => {
    if (!currentUser) return;

    try {
      if (isFollowing) {
        await socialApi.unfollowUser(currentUser.userId, viewedUserId);
        toast.success("팔로우가 취소되었습니다.");
      } else {
        await socialApi.followUser(currentUser.userId, viewedUserId);
        toast.success("팔로우 했습니다.");
      }
      // 상태 새로고침
      refreshProfileData();
    } catch (err) {
      console.error("팔로우/언팔로우 중 오류:", err);
      toast.error("팔로우/언팔로우에 실패했습니다.");
    }
  };

  // 로딩 중
  if (profileLoading || (feedsLoading && page === 1)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="text-gray-800 flex flex-col items-center">
          <FaSpinner className="animate-spin text-5xl mb-3" />
          <p className="text-lg font-light">프로필 및 피드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 처리
  if (profileError || feedsError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="text-black bg-white p-8 rounded-xl shadow-lg max-w-md">
          <p className="text-xl mb-4">{profileError || feedsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 좋아요 사용자 목록 모달 컴포넌트
  const LikedByModal = ({ users, onClose }) => {
    if (!users || users.length === 0) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-white rounded-xl overflow-hidden max-w-md w-full max-h-[80vh]">
          <div className="p-4 border-b flex items-center">
            <h3 className="font-bold text-lg">좋아요 한 사용자</h3>
            <button
              onClick={onClose}
              className="ml-auto text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto max-h-[60vh]">
            {users.map((user) => (
              <div
                key={user.userId}
                className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  navigate(`/swings/profile/${user.userId}`);
                  onClose();
                }}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={
                      user.profilePic ||
                      normalizeImageUrl("/images/default-profile.jpg")
                    }
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold">{user.username}</p>
                  {user.name && (
                    <p className="text-sm text-gray-500">{user.name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 피드 모달 컴포넌트 - 피드를 클릭했을 때 표시할 상세 내용 모달
  const FeedModal = ({ feed, onClose }) => {
    if (!feed) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="bg-white rounded-lg overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row">
          {/* 이미지 영역 또는 텍스트 영역 */}
          {feed.imageUrl ? (
            <div className="w-full md:w-1/2 bg-black flex items-center justify-center max-h-[50vh] md:max-h-[90vh]">
              <img
                src={feed.imageUrl}
                alt={feed.caption}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 max-h-[90vh] overflow-y-auto">
              <p className="text-xl font-medium text-center text-gray-800 whitespace-pre-wrap leading-relaxed break-words">
                {feed.caption || "내용 없음"}
              </p>
            </div>
          )}

          {/* 내용 영역 */}
          <div className="w-full md:w-1/2 flex flex-col h-full max-h-[40vh] md:max-h-[90vh]">
            {/* 헤더 영역 */}
            <div className="p-4 border-b flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img
                  src={
                    feed.userProfilePic ||
                    normalizeImageUrl("/images/default-profile.jpg")
                  }
                  alt={feed.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold">
                  {feed.username ||
                    feed.user?.username ||
                    feed.user?.name ||
                    "익명"}
                </p>
                {feed.location && (
                  <p className="text-xs text-gray-500">{feed.location}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* 댓글 영역 */}
            <div className="flex-1 overflow-y-auto p-4 border-b">
              <h3 className="font-semibold text-gray-700 mb-3">댓글</h3>
              {feed.comments && feed.comments.length > 0 ? (
                feed.comments.map((comment) => (
                  <div key={comment.commentId} className="mb-3 flex">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img
                        src={
                          comment.userProfilePic ||
                          normalizeImageUrl("/images/default-profile.jpg")
                        }
                        alt={comment.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-black">
                        <span className="font-semibold mr-2">
                          {comment.username}
                        </span>
                        {comment.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {currentUser &&
                      (currentUser.userId === comment.userId ||
                        currentUser.userId === feed.userId) && (
                        <button
                          onClick={() =>
                            handleCommentDeleteWithUpdate(
                              comment.commentId,
                              feed.feedId
                            )
                          }
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  아직 댓글이 없습니다.
                </p>
              )}
            </div>

            {/* 액션 영역 - 좋아요 개선 */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() =>
                    feed.isLiked
                      ? handleUnlikeWithLoading(feed.feedId)
                      : handleLikeWithLoading(feed.feedId)
                  }
                  className="flex items-center space-x-1 group"
                  disabled={likeLoading[feed.feedId]}
                >
                  {likeLoading[feed.feedId] ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaHeart
                      className={`text-xl transition-colors duration-200 ${
                        feed.isLiked
                          ? "text-red-500"
                          : "text-gray-400 group-hover:text-red-300"
                      }`}
                    />
                  )}
                  <span className="font-medium">
                    {feed.likeCount || feed.likes || 0}
                  </span>
                </button>

                <button
                  onClick={() => handleShowLikedBy(feed.feedId)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                >
                  <span>좋아요 목록</span>
                </button>

                <button
                  className="flex items-center space-x-1"
                  onClick={() => handleToggleComments(feed.feedId)}
                >
                  <FaComment className="text-gray-500" />
                  <span className="font-medium">{feed.commentCount || 0}</span>
                </button>
              </div>

              {currentUser && currentUser.userId === feed.userId && (
                <button
                  onClick={() => {
                    handleDelete(feed.feedId);
                    onClose();
                  }}
                  className="text-xs text-red-500 hover:text-red-700 border border-red-300 px-3 py-1 rounded-full transition"
                >
                  게시물 삭제
                </button>
              )}
            </div>

            {/* 댓글 입력 영역 */}
            {currentUser && (
              <div className="p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const comment = e.target.comment.value;
                    if (comment.trim()) {
                      handleCommentSubmitWithUpdate(feed.feedId, comment);
                      e.target.comment.value = "";
                    }
                  }}
                  className="flex"
                >
                  <input
                    type="text"
                    name="comment"
                    placeholder="댓글 추가..."
                    autoComplete="off"
                    className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-black"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-r-lg px-4 hover:bg-blue-600 transition-colors"
                  >
                    게시
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center pt-16">
      <ToastContainer position="bottom-right" />
      <div
        className="w-full max-w-4xl mx-auto h-full overflow-y-auto bg-gray-50 flex-1"
        style={{
          height:
            "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 64px)",
          padding: "0 1rem",
        }}
        onScroll={handleScroll}
      >
        {/* 프로필 영역 */}
        <SocialProfile
          user={{
            ...profile,
            location: profile?.location,
            joinDate: profile?.joinDate,
            website: profile?.website,
            occupation: profile?.occupation,
          }}
          userStats={stats}
          userIntroduce={editingIntroduce ? introduceInput : introduce}
          onIntroduceChange={setIntroduceInput}
          onEditingToggle={() => setEditingIntroduce(!editingIntroduce)}
          onIntroduceSave={handleIntroduceSave}
          isCurrentUser={currentUser?.userId === viewedUserId}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
          onShowFollowers={() => setShowFollowersList(true)}
          onShowFollowing={() => setShowFollowingList(true)}
          onGoToSettings={() => navigate("/swings/mypage")}
          feeds={feeds}
          onFeedClick={handleFeedClick}
        />

        {/* 모달 */}
        {showFollowersList && (
          <FollowListModal
            users={followers}
            onClose={() => setShowFollowersList(false)}
            title="팔로워"
          />
        )}

        {showFollowingList && (
          <FollowListModal
            users={followings}
            onClose={() => setShowFollowingList(false)}
            title="팔로잉"
          />
        )}

        {selectedImage && (
          <ImageModal
            imageUrl={selectedImage}
            onClose={handleCloseImageModal}
          />
        )}

        {/* 좋아요 사용자 목록 모달 */}
        {showLikedByModal && (
          <LikedByModal
            users={likedByUsers}
            onClose={() => setShowLikedByModal(false)}
          />
        )}

        {/* 피드 상세 모달 */}
        {showFeedModal && (
          <FeedModal feed={selectedFeed} onClose={handleCloseFeedModal} />
        )}
      </div>
    </div>
  );
};

export default SocialPage;
