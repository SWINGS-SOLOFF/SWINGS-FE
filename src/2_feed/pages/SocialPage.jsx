import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useProfileData from '../hooks/useProfileData';
import { useFeedData } from '../hooks/useFeedData';
import SocialProfile from '../components/SocialProfile';
import SocialFeedItem from '../components/SocialFeedItem';
import ImageModal from '../components/ImageModal';
import { FollowListModal } from '../components/SocialProfile';
import { FaSpinner, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
import socialApi from '../api/socialApi';

const SocialPage = () => {
  const { userId: paramUserId } = useParams();
  const [viewedUserId, setViewedUserId] = useState(paramUserId ? Number(paramUserId) : null);
  
  // 현재 로그인한 사용자 가져오기
  const [currentUser, setCurrentUser] = useState(null);
  const [profileError, setProfileError] = useState(null);

  // 모달 상태
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);
  
  // 자기소개 편집 상태
  const [editingIntroduce, setEditingIntroduce] = useState(false);
  const [introduceInput, setIntroduceInput] = useState('');
  
  // 피드 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 3;
  
  // useProfileData 훅 사용 (default import)
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
  
  // useFeedData 훅 사용 (더미 구현 혹은 실제 구현)
  const {
    loading: feedsLoading,
    error: feedsError,
    feeds,
    toggleComments,
    toggleCaption,
    handleLike,
    handleUnlike,
    handleDelete,
    handleCommentInputChange,
    handleCommentSubmit,
    handleCommentDelete,
    refreshFeeds,
    loadMoreFeeds,
  } = useFeedData(viewedUserId, currentUser, page, ITEMS_PER_PAGE);

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
    if (scrollHeight - scrollTop <= clientHeight + 50 && !feedsLoading && hasMore) {
      const moreFeeds = await loadMoreFeeds(page + 1, ITEMS_PER_PAGE);
      if (moreFeeds && moreFeeds.length > 0) {
        setPage(prevPage => prevPage + 1);
      } else {
        setHasMore(false);
      }
    }
  };
  
  // 이미지 클릭 핸들러
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };
  
  // 자기소개 저장 핸들러
  const handleIntroduceSave = async () => {
    try {
      await socialApi.updateIntroduce(viewedUserId, introduceInput);
      setEditingIntroduce(false);
      refreshProfileData(); // 프로필 데이터 새로고침
      toast.success("자기소개가 업데이트되었습니다.");
    } catch (err) {
      console.error('Introduce update error:', err);
      toast.error('자기소개 업데이트 중 오류 발생');
    }
  };
  
  // 팔로우 토글 핸들러
  const handleFollowToggle = async () => {
    if (!currentUser) return;
    
    try {
      if (isFollowing) {
        await socialApi.unfollowUser(currentUser.userId, viewedUserId);
        toast.success('팔로우가 취소되었습니다.');
      } else {
        await socialApi.followUser(currentUser.userId, viewedUserId);
        toast.success('팔로우 했습니다.');
      }
      // 상태 새로고침
      refreshProfileData();
    } catch (err) {
      console.error('팔로우/언팔로우 중 오류:', err);
      toast.error('팔로우/언팔로우에 실패했습니다.');
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
  
  // 프로필 상세 정보 컴포넌트 (아이콘 추가)
  const ProfileDetailInfo = () => {
    if (!profile) return null;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
        <h3 className="text-lg font-semibold mb-3">상세 정보</h3>
        <div className="space-y-2">
          {profile.location && (
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              <span className="text-gray-800">위치: {profile.location}</span>
            </div>
          )}
          {profile.joinDate && (
            <div className="flex items-center">
              <FaCalendarAlt className="text-blue-500 mr-2" />
              <span className="text-gray-800">가입일: {new Date(profile.joinDate).toLocaleDateString('ko-KR')}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center">
              <FaLink className="text-green-500 mr-2" />
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                웹사이트
              </a>
            </div>
          )}
          {profile.occupation && (
            <div className="flex items-center">
              <FaUser className="text-purple-500 mr-2" />
              <span className="text-gray-800">직업: {profile.occupation}</span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center pt-16">
      <ToastContainer position="bottom-right" />
      <div 
        className="w-full max-w-xl mx-auto h-full overflow-y-auto bg-gray-50 flex-1"
        style={{ 
          height: 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 64px)', 
          padding: '0 1rem'
        }}
        onScroll={handleScroll}
      >
        
        {/* 프로필 영역 */}
        <div className="sticky top-0 bg-gray-50 pt-2 pb-4 z-10">
          <SocialProfile 
            user={profile}
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
          />
          
          {/* 프로필 상세 정보 (아이콘 색상 추가) */}
          <ProfileDetailInfo />
        </div>
        
        {/* 피드 영역 */}
        <div className="mt-4 space-y-6 pb-16">
          {feeds.length === 0 ? (
            <div className="bg-white shadow-lg rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-black mb-2">피드가 없습니다</h3>
              <p className="text-gray-500">아직 게시된 콘텐츠가 없습니다.</p>
            </div>
          ) : (
            <>
              {feeds.map(feed => (
                <SocialFeedItem 
                  key={feed.feedId}
                  feed={feed}
                  currentUser={currentUser}
                  viewedUserId={viewedUserId}
                  userProfileData={profile}
                  onLike={handleLike}
                  onUnlike={handleUnlike}
                  onDelete={handleDelete}
                  onToggleComments={toggleComments}
                  onToggleCaption={toggleCaption}
                  onCommentChange={handleCommentInputChange}
                  onCommentSubmit={handleCommentSubmit}
                  onCommentDelete={handleCommentDelete}
                  onImageClick={handleImageClick}
                />
              ))}
              
              {/* 추가 로딩 표시 */}
              {feedsLoading && page > 1 && (
                <div className="flex justify-center p-4">
                  <FaSpinner className="animate-spin text-2xl text-gray-500" />
                </div>
              )}
              
              {/* 더 이상 피드가 없을 때 표시 */}
              {!hasMore && feeds.length > 0 && (
                <div className="text-center p-4 text-gray-500">
                  더 이상 피드가 없습니다.
                </div>
              )}
            </>
          )}
        </div>
        
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
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </div>
  );
};

export default SocialPage;