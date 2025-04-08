import React, { useState, useRef } from "react";
import {
  FaTimes,
  FaPhotoVideo,
  FaEdit,
  FaHeart,
  FaComment,
  FaMapMarkerAlt,
  FaGolfBall,
  FaSmokingBan,
  FaWineGlass,
  FaBirthdayCake,
  FaRegEnvelope,
  FaPhone,
} from "react-icons/fa";
import { RiMentalHealthFill } from "react-icons/ri";
import { FiUser, FiSettings } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeImageUrl } from "../utils/imageUtils";
import TruncatedText from "./TruncatedText";
import { toast } from "react-toastify";
import socialApi from "../api/socialApi";
import ProfileDetailModal from "./ProfileDetailModal";

const SocialProfile = ({
  user,
  userStats,
  userIntroduce,
  setIntroduce,
  isCurrentUser = false,
  isFollowing = false,
  onFollowToggle,
  onShowFollowers,
  onShowFollowing,
  onGoToSettings,
  feeds = [],
  onFeedClick = () => {},
  refreshProfileData,
}) => {
  const [editing, setEditing] = useState(false);
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const postsRef = useRef(null);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSaveIntroduce = async () => {
    try {
      await socialApi.updateIntroduce(user.userId, userIntroduce);
      toast.success("자기소개가 저장되었습니다.");
      refreshProfileData();
    } catch {
      toast.error("자기소개 저장 실패");
    }
    setEditing(false);
  };

  const regionMap = {
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

  const golfLevelMap = {
    beginner: "초보자",
    intermediate: "중급자",
    advanced: "고급자",
  };

  return (
    <div className="relative max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
      {/* 환경설정 버튼 (우상단) */}
      {isCurrentUser && (
        <button
          onClick={onGoToSettings}
          className="absolute top-4 right-4 bg-black text-white text-sm px-3 py-1 rounded-full flex items-center gap-1 hover:bg-gray-900 z-10"
        >
          <FiSettings size={14} />
        </button>
      )}

      <div className="p-4">
        <div className="flex mb-6">
          <div className="mr-6 flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative cursor-pointer"
              onClick={() => setShowProfileDetail(true)}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shadow-lg">
                <img
                  src={user?.userImg || "/default-profile.jpg"}
                  alt="프로필 사진"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <span className="mt-2 text-sm font-medium text-black">
              {user?.username || user?.name}
            </span>
          </div>

          <div className="flex-1 flex items-center">
            <div className="grid grid-cols-3 w-full text-center">
              <div className="flex flex-col">
                <span className="font-bold text-black">
                  {userStats?.posts || 0}
                </span>
                <span className="text-xs text-black">피드</span>
              </div>
              <div
                className="flex flex-col cursor-pointer"
                onClick={onShowFollowers}
              >
                <span className="font-bold text-black">
                  {userStats?.followers || 0}
                </span>
                <span className="text-xs text-black">팔로워</span>
              </div>
              <div
                className="flex flex-col cursor-pointer"
                onClick={onShowFollowing}
              >
                <span className="font-bold text-black">
                  {userStats?.following || 0}
                </span>
                <span className="text-xs text-black">팔로잉</span>
              </div>
            </div>
          </div>
        </div>

        {/* 자기소개 */}
        <div className="mb-4">
          {editing ? (
            <div className="relative">
              <textarea
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-gray-500 bg-white text-black text-sm"
                value={userIntroduce}
                onChange={(e) => setIntroduce(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={handleEditToggle}
                  className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveIntroduce}
                  className="bg-black text-white px-3 py-1 rounded-full text-sm"
                >
                  저장
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <p className="text-sm text-black leading-relaxed">
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
      </div>

      {!isCurrentUser && (
        <div className="flex space-x-2 mb-4 px-4">
          <button
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition ${
              isFollowing
                ? "bg-gray-100 text-black"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={onFollowToggle}
          >
            {isFollowing ? "팔로잉" : "팔로우"}
          </button>
          <button className="flex-1 py-1.5 rounded-md bg-gray-100 text-black text-sm font-medium hover:bg-gray-200 transition">
            메시지
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4 border-t border-gray-100 pt-2 px-4">
        {user?.activityRegion && (
          <div className="bg-gray-100 rounded-full px-3 py-1 text-xs flex items-center">
            <FaMapMarkerAlt className="text-gray-500 mr-1" size={12} />
            <span className="text-black">
              {regionMap[user.activityRegion] || user.activityRegion}
            </span>
          </div>
        )}
        {user?.golfSkill && (
          <div className="bg-gray-100 rounded-full px-3 py-1 text-xs flex items-center">
            <FaGolfBall className="text-green-500 mr-1" size={12} />
            <span className="text-black">
              {golfLevelMap[user.golfSkill] || user.golfSkill}
            </span>
          </div>
        )}
        {user?.mbti && (
          <div className="bg-gray-100 rounded-full px-3 py-1 text-xs flex items-center">
            <RiMentalHealthFill className="text-purple-500 mr-1" size={12} />
            <span className="text-black">{user.mbti}</span>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200">
        <div className="flex">
          <button className="flex-1 text-center py-2 border-b-2 border-black text-black font-medium">
            <FaPhotoVideo className="inline-block mr-1" />
            <span>피드</span>
          </button>
        </div>
      </div>

      <div ref={postsRef} className="px-4 pb-6">
        {feeds.length === 0 ? (
          <div className="text-center text-black py-12">
            <FaPhotoVideo className="text-gray-300 text-4xl mx-auto mb-3" />
            <p className="text-gray-500">아직 게시된 콘텐츠가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {feeds.map((feed) => (
              <div
                key={feed.feedId}
                className="aspect-square relative overflow-hidden cursor-pointer group bg-white border border-gray-100"
                onClick={() => onFeedClick(feed)}
              >
                {feed.imageUrl ? (
                  <img
                    src={normalizeImageUrl(feed.imageUrl)}
                    alt="피드 이미지"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center px-2 bg-white">
                    <p className="text-black text-xs text-center line-clamp-3 whitespace-pre-wrap">
                      {feed.caption || "내용 없음"}
                    </p>
                  </div>
                )}

                {/* 하단 오버레이 (좋아요/댓글 수) */}
                <div className="absolute bottom-0 w-full bg-black bg-opacity-40 text-white text-[11px] px-2 py-1 flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <FaHeart className="text-red-400" />
                    {feed.likes ?? feed.likeCount ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaComment />
                    {feed.comments?.length ?? feed.commentCount ?? 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showProfileDetail && (
          <ProfileDetailModal
            user={user}
            onClose={() => setShowProfileDetail(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialProfile;
