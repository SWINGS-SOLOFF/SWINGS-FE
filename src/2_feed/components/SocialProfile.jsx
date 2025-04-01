import {
    FaMapMarkerAlt,
    FaTransgender,
    FaBriefcase,
    FaGolfBall,
    FaSmokingBan,
    FaWineGlass,
    FaHeart,
    FaTimes,
    FaUserFriends,
    FaUserPlus,
    FaPhotoVideo
} from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 팔로워/팔로잉 목록 모달 컴포넌트 (애니메이션 추가)
const FollowListModal = ({ users, onClose, title }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white w-96 max-h-[500px] rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center">
                        <FaUserFriends className="mr-2" />
                        {title} ({users.length})
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
                                        className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">{user.username || user.name}</p>
                                        <p className="text-xs text-gray-500">{user.description || '골퍼'}</p>
                                    </div>
                                    <button className="ml-auto px-3 py-1 text-sm bg-green-600 text-white rounded-full hover:bg-green-700 transition">
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

const UserDetailCard = ({ user }) => {
    const userDetails = [
        {
            icon: <FaMapMarkerAlt className="text-green-600" />,
            label: '활동 지역',
            value: {
                'SEOUL': '서울',
                'BUSAN': '부산',
                'DAEGU': '대구',
                'INCHEON': '인천',
                'GWANGJU': '광주',
                'DAEJEON': '대전',
                'ULSAN': '울산',
                'SEJONG': '세종',
                'GYEONGGI': '경기',
                'GANGWON': '강원',
                'CHUNGBUK': '충북',
                'CHUNGNAM': '충남',
                'JEONBUK': '전북',
                'JEONNAM': '전남',
                'GYEONGBUK': '경북',
                'GYEONGNAM': '경남',
                'JEJU': '제주'
            }[user.activityRegion]
        },
        {
            icon: <FaTransgender className="text-blue-500" />,
            label: '성별',
            value: user.gender === 'male' ? '남성' : '여성'
        },
        {
            icon: <FaBriefcase className="text-gray-700" />,
            label: '직업',
            value: user.job
        },
        {
            icon: <FaGolfBall className="text-green-700" />,
            label: '골프 실력',
            value: {
                'beginner': '초보자',
                'intermediate': '중급자',
                'advanced': '고급자'
            }[user.golfSkill]
        },
        {
            icon: <MdFavorite className="text-purple-600" />,
            label: 'MBTI',
            value: user.mbti
        },
        {
            icon: <FaHeart className="text-red-500" />,
            label: '취미',
            value: user.hobbies
        },
        {
            icon: <FaSmokingBan className="text-gray-500" />,
            label: '흡연 여부',
            value: user.smoking === 'yes' ? '흡연' : '비흡연'
        },
        {
            icon: <FaWineGlass className="text-pink-600" />,
            label: '음주 여부',
            value: user.drinking === 'yes' ? '음주' : '비음주'
        }
    ];

    return (
        <div className="bg-white shadow-2xl rounded-2xl p-6 border-2 border-green-50 transform transition-all hover:shadow-3xl">
            <h2 className="text-2xl font-bold text-green-800 mb-6 border-b-2 border-green-100 pb-3">
                프로필 상세 정보
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {userDetails.map((detail, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
                    >
                        <div className="text-2xl">{detail.icon}</div>
                        <div>
                            <p className="text-sm text-gray-600">{detail.label}</p>
                            <p className="font-semibold text-gray-800">{detail.value || '정보 없음'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SocialProfile = ({
                           user,
                           userStats,
                           userIntroduce,
                           editing,
                           onEditToggle,
                           onIntroduceChange,
                           onIntroduceSave,
                           followers = [],
                           following = [],
                           onFetchFollowers,
                           onFetchFollowing
                       }) => {
    // 팔로워/팔로잉 모달 상태 관리
    const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
    const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
    const [followersData, setFollowersData] = useState([]);
    const [followingData, setFollowingData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const postsRef = useRef(null);

    // 팔로워 목록 가져오기
    const handleShowFollowers = async () => {
        setIsLoading(true);
        try {
            // onFetchFollowers 함수가 전달되면 호출, 없으면 defaultProps가 실행됨
            const data = await onFetchFollowers(user.userId || user.id);
            setFollowersData(data || followers);
            setIsFollowersModalOpen(true);
        } catch (error) {
            console.error("팔로워 목록 로딩 오류:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 팔로잉 목록 가져오기
    const handleShowFollowing = async () => {
        setIsLoading(true);
        try {
            const data = await onFetchFollowing(user.userId || user.id);
            setFollowingData(data || following);
            setIsFollowingModalOpen(true);
        } catch (error) {
            console.error("팔로잉 목록 로딩 오류:", error);
        } finally {
            setIsLoading(false);
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
                    <div className="relative mb-8">
                        <img
                            src={user.userImg || '/swings/images/default-profile.jpg'}
                            alt="프로필 사진"
                            className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl"
                        />
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                            프로
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-green-800 mt-2">{user.name}</h1>
                    <p className="text-gray-600 mb-6">@{user.username}</p>
                    <div className="w-full flex justify-center mb-6">
                        <div className="grid grid-cols-3 gap-1 bg-white rounded-xl shadow-lg p-1 w-full max-w-xs border border-green-100">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={scrollToPosts}
                                className="text-center py-3 px-2 rounded-lg hover:bg-green-50 transition-all cursor-pointer focus:outline-none"
                            >
                                <div className="flex flex-col items-center">
                                    <FaPhotoVideo className="text-green-600 mb-1" />
                                    <p className="text-xl font-bold text-gray-800">{userStats.posts}</p>
                                    <p className="text-xs text-gray-500">게시물</p>
                                </div>
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleShowFollowers}
                                disabled={isLoading}
                                className="text-center py-3 px-2 rounded-lg hover:bg-green-50 transition-all cursor-pointer focus:outline-none"
                            >
                                <div className="flex flex-col items-center">
                                    <FaUserFriends className="text-green-600 mb-1" />
                                    <p className="text-xl font-bold text-gray-800">{userStats.followers}</p>
                                    <p className="text-xs text-gray-500">팔로워</p>
                                </div>
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleShowFollowing}
                                disabled={isLoading}
                                className="text-center py-3 px-2 rounded-lg hover:bg-green-50 transition-all cursor-pointer focus:outline-none"
                            >
                                <div className="flex flex-col items-center">
                                    <FaUserPlus className="text-green-600 mb-1" />
                                    <p className="text-xl font-bold text-gray-800">{userStats.following}</p>
                                    <p className="text-xs text-gray-500">팔로잉</p>
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white shadow-2xl rounded-2xl p-6 border-2 border-green-50">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-green-800">자기소개</h2>
                            {!editing ? (
                                <button
                                    onClick={onEditToggle}
                                    className="text-green-600 hover:text-green-800 transition px-3 py-1 rounded-full hover:bg-green-50"
                                >
                                    수정
                                </button>
                            ) : (
                                <button
                                    onClick={onIntroduceSave}
                                    className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition shadow-md"
                                >
                                    저장
                                </button>
                            )}
                        </div>
                        {editing ? (
                            <textarea
                                className="w-full h-32 p-3 border-2 border-green-200 rounded-lg focus:border-green-500 transition"
                                value={userIntroduce}
                                onChange={onIntroduceChange}
                                placeholder="당신에 대해 알려주세요..."
                            />
                        ) : (
                            <p className="text-gray-700 leading-relaxed">
                                {userIntroduce || '아직 자기소개가 없습니다.'}
                            </p>
                        )}
                    </div>
                    <UserDetailCard user={user} />
                </div>
            </div>
            <div ref={postsRef} className="mt-12">
                <h2 className="text-2xl font-bold text-green-800 mb-6 border-b-2 border-green-100 pb-3">
                    피드
                </h2>
            </div>
            <AnimatePresence>
                {isFollowersModalOpen && (
                    <FollowListModal
                        users={followersData}
                        onClose={() => setIsFollowersModalOpen(false)}
                        title="팔로워"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isFollowingModalOpen && (
                    <FollowListModal
                        users={followingData}
                        onClose={() => setIsFollowingModalOpen(false)}
                        title="팔로잉"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

SocialProfile.defaultProps = {
    onFetchFollowers: () => Promise.resolve([]),
    onFetchFollowing: () => Promise.resolve([]),
};

export default SocialProfile;
