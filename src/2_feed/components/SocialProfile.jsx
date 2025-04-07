import React, { useState, useRef } from "react";
import {
  FaTimes,
  FaUserFriends,
  FaUserPlus,
  FaPhotoVideo,
  FaEdit,
  FaSave,
  FaCog,
  FaHeart,
  FaComment,
  FaMapMarkerAlt,
  FaGolfBall,
  FaBriefcase,
  FaMale,
  FaFemale,
  FaSmokingBan,
  FaWineGlass,
} from "react-icons/fa";
import { RiMentalHealthFill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeImageUrl } from "../utils/imageUtils";
import TruncatedText from "./TruncatedText";

const ProfileImageModal = ({ imageUrl, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
      className="relative max-w-3xl max-h-[80vh] w-full p-2"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition z-10"
      >
        <FaTimes />
      </button>
      <img
        src={imageUrl || "/default-profile.jpg"}
        alt="프로필 사진"
        className="w-full h-full object-contain rounded-lg"
      />
    </motion.div>
  </motion.div>
);

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
                    src={
                      user.avatarUrl || user.userImg || "/default-profile.jpg"
                    }
                    alt="프로필"
                    className="w-10 h-10 rounded-full object-cover border-2 border-black"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {user.username || user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.description || "골퍼"}
                    </p>
                  </div>
                  <button className="ml-auto px-3 py-1 text-sm bg-black text-white rounded-full hover:bg-gray-800 transition">
                    {title === "팔로워" ? "팔로우" : "언팔로우"}
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

const UserDetailProfile = ({
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
  onShowFollowing,
  onGoToSettings,
  feeds = [],
  onFeedClick = () => {},
}) => {
  const [editing, setEditing] = useState(false);
  const [showProfileImage, setShowProfileImage] = useState(false);
  const postsRef = useRef(null);

  const handleEditToggle = () => {
    setEditing(!editing);
    onEditingToggle?.();
  };

  const handleSave = () => {
    setEditing(false);
    onIntroduceSave?.();
  };

  const scrollToPosts = () => {
    postsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 지역 및 골프 레벨 한글 매핑
  const 지역맵 = {
    SEOUL: "서울",
    BUSAN: "부산",
    DAEGU: "대구",
    INCHEON: "인천",
    GWANGJU: "광주",
    DAEJEON: "대전",
    ULSAN: "울산",
    SEJONG: "세종",
    GYEONGGI: "경기",
    GANGWON: "강원",
    CHUNGBUK: "충북",
    CHUNGNAM: "충남",
    JEONBUK: "전북",
    JEONNAM: "전남",
    GYEONGBUK: "경북",
    GYEONGNAM: "경남",
    JEJU: "제주",
  };

  const 골프맵 = {
    beginner: "초보자",
    intermediate: "중급자",
    advanced: "고급자",
  };

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white shadow-md">
        {/* 모바일 스타일 헤더 (인스타그램 스타일) */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">
              {user?.username || user?.name}
            </h1>
            {isCurrentUser ? (
              <button
                onClick={onGoToSettings}
                className="p-2 text-gray-800"
                title="환경설정"
              >
                <FaCog className="text-xl" />
              </button>
            ) : null}
          </div>
        </div>

        {/* 프로필 섹션 - 인스타그램 스타일 */}
        <div className="p-4">
          <div className="flex mb-4">
            {/* 왼쪽 프로필 이미지 */}
            <div className="mr-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer"
                onClick={() => setShowProfileImage(true)}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shadow-md">
                  <img
                    src={user?.userImg || "/default-profile.jpg"}
                    alt="프로필 사진"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>

            {/* 오른쪽 통계 */}
            <div className="flex-1 flex items-center">
              <div className="grid grid-cols-3 w-full text-center">
                <div className="flex flex-col">
                  <span className="font-bold">{userStats?.posts || 0}</span>
                  <span className="text-xs text-gray-500">게시물</span>
                </div>
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={onShowFollowers}
                >
                  <span className="font-bold">{userStats?.followers || 0}</span>
                  <span className="text-xs text-gray-500">팔로워</span>
                </div>
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={onShowFollowing}
                >
                  <span className="font-bold">{userStats?.following || 0}</span>
                  <span className="text-xs text-gray-500">팔로잉</span>
                </div>
              </div>
            </div>
          </div>

          {/* 자기소개 */}
          <div className="mb-4">
            <h2 className="font-bold text-sm mb-1">자기소개</h2>
            {editing ? (
              <div className="relative">
                <textarea
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-gray-500 bg-white text-gray-800 text-sm"
                  value={userIntroduce}
                  onChange={(e) => onIntroduceChange(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={handleEditToggle}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-black text-white px-3 py-1 rounded-full text-sm"
                  >
                    저장
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {userIntroduce || "아직 자기소개가 없습니다."}
                </p>
                {isCurrentUser && (
                  <button
                    onClick={handleEditToggle}
                    className="absolute top-0 right-0 text-gray-400 hover:text-gray-700 p-2"
                    title="자기소개 수정"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 팔로우/메시지 버튼 */}
          <div className="flex space-x-2 mb-4">
            {isCurrentUser ? (
              <button
                className="w-full py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-medium"
                onClick={onGoToSettings}
              >
                프로필 편집
              </button>
            ) : (
              <>
                <button
                  className={`flex-1 py-1 rounded-md text-sm font-medium ${
                    isFollowing
                      ? "bg-gray-100 text-gray-800"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={onFollowToggle}
                >
                  {isFollowing ? "팔로잉" : "팔로우"}
                </button>
                <button className="flex-1 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-medium">
                  메시지
                </button>
              </>
            )}
          </div>

          {/* 프로필 상세 정보 - 간략하게 표시 */}
          <div className="grid grid-cols-2 gap-2 mb-4 border-t border-gray-100 pt-2">
            {user?.activityRegion && (
              <div className="flex items-center text-sm py-1">
                <FaMapMarkerAlt className="text-gray-500 mr-2" />
                <span>
                  {지역맵[user.activityRegion] || user.activityRegion}
                </span>
              </div>
            )}
            {user?.gender && (
              <div className="flex items-center text-sm py-1">
                {user.gender === "male" ? (
                  <FaMale className="text-blue-500 mr-2" />
                ) : (
                  <FaFemale className="text-pink-500 mr-2" />
                )}
                <span>{user.gender === "male" ? "남성" : "여성"}</span>
              </div>
            )}
            {user?.job && (
              <div className="flex items-center text-sm py-1">
                <FaBriefcase className="text-gray-500 mr-2" />
                <span>{user.job}</span>
              </div>
            )}
            {user?.golfSkill && (
              <div className="flex items-center text-sm py-1">
                <FaGolfBall className="text-green-500 mr-2" />
                <span>{골프맵[user.golfSkill] || user.golfSkill}</span>
              </div>
            )}
            {user?.mbti && (
              <div className="flex items-center text-sm py-1">
                <RiMentalHealthFill className="text-purple-500 mr-2" />
                <span>{user.mbti}</span>
              </div>
            )}
            {(user?.smoking || user?.drinking) && (
              <div className="flex items-center text-sm py-1">
                {user.smoking === "yes" ? (
                  <span className="mr-2">🚬</span>
                ) : (
                  <FaSmokingBan className="text-red-500 mr-2" />
                )}
                {user.drinking === "yes" ? (
                  <FaWineGlass className="text-red-500 ml-2 mr-1" />
                ) : (
                  <span className="ml-2">🚫🍷</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 탭 내비게이션 (게시물, 저장됨 등) */}
        <div className="border-t border-gray-200">
          <div className="flex">
            <button className="flex-1 text-center py-2 border-b-2 border-black">
              <FaPhotoVideo className="inline-block mr-1" />
              <span className="text-xs">게시물</span>
            </button>
            <button className="flex-1 text-center py-2 text-gray-500">
              <span className="text-xs">저장됨</span>
            </button>
          </div>
        </div>

        {/* 피드 그리드 */}
        <div ref={postsRef}>
          {feeds.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              아직 게시된 콘텐츠가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {feeds.map((feed) => (
                <div
                  key={feed.feedId}
                  className="aspect-square relative overflow-hidden cursor-pointer group"
                  onClick={() => onFeedClick(feed)}
                >
                  {feed.imageUrl ? (
                    <>
                      <img
                        src={normalizeImageUrl(feed.imageUrl)}
                        alt="피드"
                        className="w-full h-full object-cover"
                      />
                      {/* 호버 효과 - 어두운 배경과 좋아요/댓글 수 */}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 flex items-center justify-center transition-opacity">
                        <div className="text-white flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center">
                            <FaHeart className="mr-1" />
                            <span>{feed.likes || feed.likeCount || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <FaComment className="mr-1" />
                            <span>{feed.commentCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100 p-2">
                      <TruncatedText
                        text={feed.caption || "내용 없음"}
                        maxLines={3}
                        className="text-xs text-center"
                      />
                      <div className="mt-2 flex items-center space-x-3 text-xs">
                        <div className="flex items-center">
                          <FaHeart className="mr-1 text-red-500" />
                          <span>{feed.likes || feed.likeCount || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <FaComment className="mr-1" />
                          <span>{feed.commentCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showProfileImage && (
          <ProfileImageModal
            imageUrl={user?.userImg}
            onClose={() => setShowProfileImage(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SocialProfile;
