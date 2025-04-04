import React, { useState, useRef } from 'react';
import {
    FaMapMarkerAlt,
    FaMale,
    FaFemale,
    FaBriefcase,
    FaGolfBall,
    FaSmokingBan,
    FaWineGlass,
    FaHeart,
    FaTimes,
    FaUserFriends,
    FaUserPlus,
    FaPhotoVideo,
    FaEdit,
    FaSave
} from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { motion } from 'framer-motion';

// 팔로워/팔로잉 목록 모달 컴포넌트
export const FollowListModal = ({ users, onClose, title }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white w-96 max-h-[500px] rounded-xl shadow-2xl overflow-hidden"
            >
                <div className="bg-black text-white p-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center">
                        <FaUserFriends className="mr-2" />
                        {title} ({users.length})
                    </h3>
                    <button
                        onClick={onClose}
                        className="hover:bg-gray-800 p-2 rounded-full transition"
                    >
                        <FaTimes className="text-white" />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[400px]">
                    {users.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <FaUserFriends className="mx-auto text-4xl mb-4 text-gray-300" />
                            <p>아직 {title}이 없습니다.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {users.map((user) => (
                                <li
                                    key={user.userId || user.id}
                                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <img
                                        src={user.avatarUrl || user.userImg || '/default-profile.jpg'}
                                        alt="프로필"
                                        className="w-10 h-10 rounded-full object-cover border-2 border-black"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">{user.username || user.name}</p>
                                        <p className="text-xs text-gray-500">{user.description || '골퍼'}</p>
                                    </div>
                                    <button className="ml-auto px-3 py-1 text-sm bg-black text-white rounded-full hover:bg-gray-800 transition">
                                        {title === '팔로워' ? '팔로우' : '언팔로우'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// 사용자 상세 정보 카드 컴포넌트
const UserDetailCard = ({ user }) => {
    const 지역맵 = {
      SEOUL: '서울', BUSAN: '부산', DAEGU: '대구', INCHEON: '인천', GWANGJU: '광주',
      DAEJEON: '대전', ULSAN: '울산', SEJONG: '세종', GYEONGGI: '경기', GANGWON: '강원',
      CHUNGBUK: '충북', CHUNGNAM: '충남', JEONBUK: '전북', JEONNAM: '전남',
      GYEONGBUK: '경북', GYEONGNAM: '경남', JEJU: '제주',
    };
  
    const 골프맵 = {
      beginner: '초보자',
      intermediate: '중급자',
      advanced: '고급자',
    };
  
    const userDetails = [
      {
        icon: <FaMapMarkerAlt className="text-red-500" />,
        label: '활동 지역',
        value: 지역맵[user?.activityRegion] || '정보 없음',
      },
      {
        icon: user?.gender === 'male'
          ? <FaMale className="text-blue-500" />
          : <FaFemale className="text-pink-500" />,
        label: '성별',
        value: user?.gender === 'male' ? '남성' : '여성',
      },
      {
        icon: <FaBriefcase className="text-gray-800" />,
        label: '직업',
        value: user?.job || '정보 없음',
      },
      {
        icon: <FaGolfBall className="text-green-500" />,
        label: '골프 실력',
        value: 골프맵[user?.golfSkill] || '정보 없음',
      },
      {
        icon: <MdFavorite className="text-purple-500" />,
        label: 'MBTI',
        value: user?.mbti || '정보 없음',
      },
      {
        icon: <FaHeart className="text-pink-500" />,
        label: '취미',
        value: user?.hobbies || '정보 없음',
      },
      {
        icon: <FaSmokingBan className="text-red-400" />,
        label: '흡연 여부',
        value: user?.smoking === 'yes' ? '흡연' : '비흡연',
      },
      {
        icon: <FaWineGlass className="text-yellow-500" />,
        label: '음주 여부',
        value: user?.drinking === 'yes' ? '음주' : '비음주',
      },
    ];
  
    return (
      <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 transition-all hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-black mb-6 border-b border-gray-200 pb-3">
          프로필 상세 정보
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {userDetails.map((detail, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="text-2xl">{detail.icon}</div>
              <div>
                <p className="text-sm text-gray-600">{detail.label}</p>
                <p className="font-semibold text-gray-800">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

// 메인 SocialProfile 컴포넌트
const SocialProfile = ({ 
    user, 
    userStats, 
    userIntroduce, 
    onIntroduceChange, 
    onEditingToggle,
    onIntroduceSave, 
    isCurrentUser = false,
    isFollowing = false,
    onFollowToggle,
    onShowFollowers,
    onShowFollowing
}) => {
    const [editing, setEditing] = useState(false);
    const postsRef = useRef(null);

    // 편집 모드 토글
    const handleEditToggle = () => {
        setEditing(!editing);
        if (onEditingToggle) {
            onEditingToggle();
        }
    };

    // 저장 처리
    const handleSave = () => {
        setEditing(false);
        if (onIntroduceSave) {
            onIntroduceSave();
        }
    };

    const scrollToPosts = () => {
        if (postsRef.current) {
            postsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center">
                    <div className="relative mb-6">
                        <img
                            src={user?.userImg || '/default-profile.jpg'}
                            alt="프로필 사진"
                            className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-black mt-2">{user?.name}</h1>
                    <p className="text-gray-600 mb-6">@{user?.username}</p>
                    
                    {/* 팔로우 버튼 */}
                    {!isCurrentUser && (
                        <button
                            onClick={onFollowToggle}
                            className={`mb-6 px-6 py-2 rounded-full text-sm font-bold transition-colors ${
                                isFollowing 
                                    ? 'bg-gray-200 text-black border border-gray-400 hover:bg-gray-300' 
                                    : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        >
                            {isFollowing ? '팔로잉' : '팔로우'}
                        </button>
                    )}
                    
                    {/* 통계 정보 */}
                    <div className="w-full flex justify-center mb-6">
                        <div className="grid grid-cols-3 gap-1 bg-white rounded-xl shadow-lg p-1 w-full max-w-xs border border-gray-200">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={scrollToPosts}
                                className="text-center py-3 px-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                            >
                                <div className="flex flex-col items-center">
                                    <FaPhotoVideo className="text-gray-700 mb-1" />
                                    <p className="text-xl font-bold text-gray-800">{userStats?.posts || 0}</p>
                                    <p className="text-xs text-gray-500">게시물</p>
                                </div>
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={onShowFollowers}
                                className="text-center py-3 px-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                            >
                                <div className="flex flex-col items-center">
                                    <FaUserFriends className="text-gray-700 mb-1" />
                                    <p className="text-xl font-bold text-gray-800">{userStats?.followers || 0}</p>
                                    <p className="text-xs text-gray-500">팔로워</p>
                                </div>
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={onShowFollowing}
                                className="text-center py-3 px-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                            >
                                <div className="flex flex-col items-center">
                                    <FaUserPlus className="text-gray-700 mb-1" />
                                    <p className="text-xl font-bold text-gray-800">{userStats?.following || 0}</p>
                                    <p className="text-xs text-gray-500">팔로잉</p>
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-black">자기소개</h2>
                            {isCurrentUser && (
                                !editing ? (
                                    <button
                                        onClick={handleEditToggle}
                                        className="text-black hover:text-gray-700 transition px-3 py-1 rounded-full hover:bg-gray-100 flex items-center"
                                    >
                                        <FaEdit className="mr-1" /> 수정
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSave}
                                        className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition shadow-md flex items-center"
                                    >
                                        <FaSave className="mr-1" /> 저장
                                    </button>
                                )
                            )}
                        </div>
                        {editing ? (
                            <textarea
                                className="w-full h-32 p-3 border-2 border-gray-200 rounded-lg focus:border-gray-500 focus:outline-none transition"
                                value={userIntroduce}
                                onChange={(e) => onIntroduceChange(e.target.value)}
                                placeholder="당신에 대해 알려주세요..."
                            />
                        ) : (
                            <p className="text-gray-700 leading-relaxed">
                                {userIntroduce || '아직 자기소개가 없습니다.'}
                            </p>
                        )}
                    </div>
                    <UserDetailCard user={user || {}} />
                </div>
            </div>
            <div ref={postsRef} className="mt-12">
                <h2 className="text-2xl font-bold text-black mb-6 border-b border-gray-200 pb-3">
                    피드
                </h2>
            </div>
        </div>
    );
};

export default SocialProfile;