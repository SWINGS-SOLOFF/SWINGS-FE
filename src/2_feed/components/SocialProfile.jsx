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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeImageUrl } from "../utils/imageUtils";
import UserDetailCardModal from "./UserDetailCardModal";
import TruncatedText from "../components/TruncatedText";

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

  const [showUserDetailModal, setShowUserDetailModal] = useState(false);

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 mb-8 transition-all hover:shadow-2xl relative">
          {isCurrentUser && (
            <button
              onClick={onGoToSettings}
              className="absolute top-3 right-4 p-2 rounded-full text-gray-800 transition z-10 border border-transparent hover:border-black"
              title="환경설정"
            >
              <FaCog className="text-xl" />
            </button>
          )}
          <div className="p-6 pt-12">
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col items-center space-y-2 md:w-1/3">
                {/* 프로필 이미지 */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative cursor-pointer"
                  onClick={() => setShowProfileImage(true)}
                >
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                    <img
                      src={user?.userImg || "/default-profile.jpg"}
                      alt="프로필 사진"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>

                {/* 닉네임 */}
                <h1 className="text-xl font-bold text-gray-900">
                  {user?.username || user?.name}
                </h1>

                {/* 상세정보 버튼 */}
                <button
                  onClick={() => setShowUserDetailModal(true)}
                  className="text-sm border border-black text-black px-4 py-1 rounded-full hover:bg-black hover:text-white transition"
                >
                  상세정보
                </button>

                {/* 팔로우 버튼 (비회원일 때만) */}
                {!isCurrentUser && (
                  <button
                    onClick={onFollowToggle}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-colors w-full max-w-[200px] ${
                      isFollowing
                        ? "bg-gray-200 text-black border border-gray-400 hover:bg-gray-300"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {isFollowing ? "팔로잉" : "팔로우"}
                  </button>
                )}
              </div>
              <div className="md:w-2/3 flex flex-col justify-between">
                <div className="bg-gray-50 rounded-2xl p-4 mb-4 transition-all hover:bg-gray-100 relative">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    자기소개
                  </h2>
                  {editing ? (
                    <div className="relative">
                      <textarea
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-gray-500 bg-white text-gray-800"
                        value={userIntroduce}
                        onChange={(e) => onIntroduceChange(e.target.value)}
                        rows={3}
                      />
                      <button
                        onClick={handleEditToggle}
                        className="absolute bottom-3 left-3 bg-white text-gray-600 border border-gray-300 p-2 rounded-full hover:bg-gray-100 shadow-md"
                        title="취소"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleSave}
                        className="absolute bottom-3 right-3 bg-black text-white p-2 rounded-full hover:bg-gray-800 shadow-md"
                        title="저장"
                      >
                        <FaSave />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <p className="text-gray-700 leading-relaxed min-h-[60px]">
                        {userIntroduce || "아직 자기소개가 없습니다."}
                      </p>
                      {isCurrentUser && (
                        <button
                          onClick={handleEditToggle}
                          className="absolute bottom-0 right-0 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-white"
                          title="자기소개 수정"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToPosts}
                    className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100"
                  >
                    <FaPhotoVideo className="text-gray-700 mb-1" />
                    <span className="font-bold text-xl text-gray-800">
                      {userStats?.posts || 0}
                    </span>
                    <p className="text-xs text-gray-500">게시물</p>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onShowFollowers}
                    className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100"
                  >
                    <FaUserFriends className="text-gray-700 mb-1" />
                    <span className="font-bold text-xl text-gray-800">
                      {userStats?.followers || 0}
                    </span>
                    <p className="text-xs text-gray-500">팔로워</p>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onShowFollowing}
                    className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100"
                  >
                    <FaUserPlus className="text-gray-700 mb-1" />
                    <span className="font-bold text-xl text-gray-800">
                      {userStats?.following || 0}
                    </span>
                    <p className="text-xs text-gray-500">팔로잉</p>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={postsRef} className="mt-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-black mb-6 border-b border-gray-200 pb-3 flex items-center">
              <FaPhotoVideo className="mr-2 text-gray-700" /> 피드
            </h2>
            {feeds.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                아직 게시된 콘텐츠가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {feeds.map((feed) => (
                  <div
                    key={feed.feedId}
                    className="aspect-square relative overflow-hidden cursor-pointer group bg-gray-100 rounded-xl border border-gray-200"
                    onClick={() => onFeedClick(feed)}
                  >
                    {feed.imageUrl ? (
                      <>
                        <img
                          src={normalizeImageUrl(feed.imageUrl)}
                          alt="피드"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* 항상 표시되는 좋아요/댓글 카운트 (하단에 배치) */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-700 bg-opacity-50 px-2 py-1 flex items-center justify-between text-white text-xs">
                          <div className="flex items-center">
                            <FaHeart className="mr-1 text-red-500" />
                            <span>{feed.likes || feed.likeCount || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <FaComment className="mr-1" />
                            <span>{feed.commentCount || 0}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full relative flex flex-col justify-between bg-white group-hover:bg-gray-50 transition p-3">
                        <div className="flex-grow overflow-hidden">
                          <TruncatedText
                            text={feed.caption || "내용 없음"}
                            maxLines={5}
                          />
                        </div>
                        {/* 통일된 좋아요/댓글 바 */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-700 bg-opacity-50 px-2 py-1 flex items-center justify-between text-white text-xs">
                          <div className="flex items-center">
                            <FaHeart
                              className={`mr-1 ${
                                feed.isLiked ? "text-red-400" : ""
                              }`}
                            />
                            <span>{feed.likes || feed.likeCount || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <FaComment className="mr-1" />
                            <span>{feed.commentCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* 호버 효과 - 어두운 배경 (이미지가 있을 때만) */}
                    {feed.imageUrl && (
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center">
                            <span className="text-lg mr-1">❤️</span>
                            <span>{feed.likes || feed.likeCount || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-lg mr-1">💬</span>
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
      </div>

      <AnimatePresence>
        {showProfileImage && (
          <ProfileImageModal
            imageUrl={user?.userImg}
            onClose={() => setShowProfileImage(false)}
          />
        )}
        {showUserDetailModal && (
          <UserDetailCardModal
            user={user}
            onClose={() => setShowUserDetailModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SocialProfile;
