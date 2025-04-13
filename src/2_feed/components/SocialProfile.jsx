import React, { useState, useRef } from "react";
import { getProfileImageUrl } from "../../1_user/api/userApi";
import {
  FaPhotoVideo,
  FaHeart,
  FaComment,
  FaMapMarkerAlt,
  FaGolfBall,
  FaBirthdayCake,
  FaSearch,
} from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

import { RiMentalHealthFill } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeImageUrl } from "../utils/imageUtils";
import TruncatedText from "./TruncatedText";
import { toast } from "react-toastify";
import socialApi from "../api/socialApi";

import ProfileDetailModal from "./ProfileDetailModal";
import ImageModal from "./ImageModal"; // ✅ 이미지 확대 보기
import IntroduceEditor from "../../1_user/components/IntroduceEditor.jsx";

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
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false); // ✅ 이미지 모달 상태
  const postsRef = useRef(null);

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
    beginner: "골린이",
    intermediate: "중급자",
    advanced: "고급자",
  };

  return (
    <div className="relative max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex mb-6">
          <div className="mr-6 flex flex-col items-center">
            {/* ✅ 프로필 이미지 클릭 시 확대 모달 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative cursor-pointer"
              onClick={() => setShowImageModal(true)}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shadow-lg">
                <img
                  src={
                    user?.userImg
                      ? getProfileImageUrl(user.userImg)
                      : "/default-profile.jpg"
                  }
                  alt="프로필 사진"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <span className="mt-2 text-sm font-bold text-black">
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

        {/* ✅ 자기소개 */}
        <div className="mb-4 text-center px-4">
          <p className="text-sm text-black whitespace-pre-wrap break-words">
            {userIntroduce || "아직 자기소개가 없습니다."}
          </p>
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

      {/* ✅ 지역 / MBTI / 골프 / 출생연도 + 오른쪽 끝 상세보기 버튼 */}
      <div className="flex justify-between items-center px-4 mb-4 border-t border-gray-100 pt-2">
        {/* ⬅️ 왼쪽 태그들 */}
        <div className="flex flex-wrap gap-2 flex-1">
          {user?.activityRegion && (
            <div className="bg-gray-100 rounded-full px-3 py-1 text-xs flex items-center">
              <span className="text-black">
                #{regionMap[user.activityRegion] || user.activityRegion}
              </span>
            </div>
          )}
          {user?.birthDate && (
            <div className="bg-gray-100 rounded-full px-3 py-1 text-xs flex items-center">
              <span className="text-black mr-2">
                #{`${user.birthDate.slice(2, 4)}년생`}
              </span>
            </div>
          )}
          {user?.mbti && (
            <div className="bg-gray-100 rounded-full px-3 py-1 text-xs flex items-center">
              #<span className="text-black">{user.mbti}</span>
            </div>
          )}
          {user?.golfSkill && (
            <div className="bg-gray-100 rounded-full px-3 py-1 text-xs flex items-center">
              <span className="text-black">
                #{golfLevelMap[user.golfSkill] || user.golfSkill}
              </span>
            </div>
          )}
        </div>

        {/* ➡️ 오른쪽 상세보기 버튼 */}
        <button
          onClick={() => setShowProfileDetail(true)}
          className="text-gray-500 hover:text-blue-600"
          title="상세보기"
        >
          <HiOutlineDotsHorizontal size={18} />
        </button>
      </div>

      <hr />
      <br />

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

      {/* ✅ 이미지 크게 보기 */}
      {showImageModal && (
        <ImageModal
          imageUrl={getProfileImageUrl(user.userImg)}
          onClose={() => setShowImageModal(false)}
        />
      )}

      {/* ✅ 프로필 상세 모달 */}
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
