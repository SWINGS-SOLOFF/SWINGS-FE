import React from "react";
import { motion } from "framer-motion";
import { getProfileImageUrl } from "../../1_user/api/userApi";
import {
  FaTimes,
  FaUser,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaGolfBall,
  FaBriefcase,
  FaHeart,
  FaSmoking,
  FaWineGlass,
} from "react-icons/fa";

const ProfileDetailModal = ({ user, onClose }) => {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition shadow"
        >
          <FaTimes size={14} />
        </button>

        {/* 프로필 사진 + 이름 */}
        <div className="bg-gradient-to-b from-[#f9fafb] to-white pt-10 pb-6 px-6 text-center">
          <div className="mx-auto w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-white">
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
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {user?.username || user?.name || "닉네임 없음"}
          </h2>
        </div>

        {/* 상세 정보 */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[45vh] text-sm text-gray-800">
          <div className="grid grid-cols-1 gap-3 bg-gray-50 rounded-xl p-4">
            {user?.activityRegion && (
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400" />
                <span className="text-gray-500">지역:</span>
                <span>
                  {regionMap[user.activityRegion] || user.activityRegion}
                </span>
              </div>
            )}
            {user?.birthDate && (
              <div className="flex items-center gap-2">
                <FaBirthdayCake className="text-gray-400" />
                <span className="text-gray-500">출생년도:</span>
                <span>{user.birthDate.slice(0, 4)}년생</span>
              </div>
            )}
            {user?.gender && (
              <div className="flex items-center gap-2">
                <FaVenusMars className="text-gray-400" />
                <span className="text-gray-500">성별:</span>
                <span>{user.gender === "male" ? "남성" : "여성"}</span>
              </div>
            )}
            {user?.mbti && (
              <div className="flex items-center gap-2">
                <FaHeart className="text-gray-400" />
                <span className="text-gray-500">MBTI:</span>
                <span>{user.mbti}</span>
              </div>
            )}
            {user?.golfSkill && (
              <div className="flex items-center gap-2">
                <FaGolfBall className="text-gray-400" />
                <span className="text-gray-500">골프 실력:</span>
                <span>{golfLevelMap[user.golfSkill] || user.golfSkill}</span>
              </div>
            )}
            {user?.job && (
              <div className="flex items-center gap-2">
                <FaBriefcase className="text-gray-400" />
                <span className="text-gray-500">직업:</span>
                <span>{user.job}</span>
              </div>
            )}
            {user?.hobbies && (
              <div className="flex items-center gap-2">
                <FaUser className="text-gray-400" />
                <span className="text-gray-500">취미:</span>
                <span>{user.hobbies}</span>
              </div>
            )}
            {user?.smoking && (
              <div className="flex items-center gap-2">
                <FaSmoking className="text-gray-400" />
                <span className="text-gray-500">흡연:</span>
                <span>{user.smoking === "yes" ? "흡연자" : "비흡연자"}</span>
              </div>
            )}
            {user?.drinking && (
              <div className="flex items-center gap-2">
                <FaWineGlass className="text-gray-400" />
                <span className="text-gray-500">음주:</span>
                <span>
                  {user.drinking === "yes" ? "음주함" : "음주하지 않음"}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileDetailModal;
