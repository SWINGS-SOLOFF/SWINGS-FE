import React from "react";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaGolfBall,
  FaSmokingBan,
  FaWineGlass,
  FaBirthdayCake,
  FaRegEnvelope,
  FaPhone,
} from "react-icons/fa";
import { RiMentalHealthFill } from "react-icons/ri";
import { FiUser } from "react-icons/fi";

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
    beginner: "초보자",
    intermediate: "중급자",
    advanced: "고급자",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative bg-white w-full max-w-sm rounded-xl shadow-xl overflow-hidden max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white bg-opacity-80 text-black p-1.5 rounded-full hover:bg-opacity-100 transition z-10 shadow-sm"
        >
          <FaTimes size={16} />
        </button>

        {/* 프로필 사진 */}
        <div className="bg-gray-100 pt-8 pb-8 px-6 relative">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img
                src={user?.userImg || "/default-profile.jpg"}
                alt="프로필 사진"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 이름 */}
        <div className="pb-4 px-6 text-center mt-4">
          <h2 className="text-xl font-bold text-black mb-2">
            {user?.username || user?.name || "닉네임 없음"}
          </h2>
        </div>

        {/* 프로필 정보 */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[40vh] space-y-4 text-sm text-black">
          {/* 기본 정보 */}
          {(user?.activityRegion ||
            user?.gender ||
            user?.golfSkill ||
            user?.mbti) && (
            <div>
              <h3 className="font-semibold mb-2">기본 정보</h3>
              <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-3">
                {user?.activityRegion && (
                  <div className="flex items-center">
                    <FaMapMarkerAlt size={14} className="text-blue-500 mr-2" />
                    {regionMap[user.activityRegion] || user.activityRegion}
                  </div>
                )}
                {user?.gender && (
                  <div className="flex items-center">
                    <FiUser size={14} className="text-purple-500 mr-2" />
                    {user.gender === "male" ? "남성" : "여성"}
                  </div>
                )}
                {user?.golfSkill && (
                  <div className="flex items-center">
                    <FaGolfBall size={14} className="text-green-500 mr-2" />
                    {golfLevelMap[user.golfSkill] || user.golfSkill}
                  </div>
                )}
                {user?.mbti && (
                  <div className="flex items-center">
                    <RiMentalHealthFill
                      size={14}
                      className="text-indigo-500 mr-2"
                    />
                    {user.mbti}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 라이프스타일 */}
          {(user?.smoking || user?.drinking) && (
            <div>
              <h3 className="font-semibold mb-2">라이프스타일</h3>
              <div className="flex space-x-4 bg-gray-50 rounded-lg p-3">
                {user?.smoking && (
                  <div className="flex items-center">
                    {user.smoking === "yes" ? (
                      "🚬"
                    ) : (
                      <FaSmokingBan className="text-red-500 mr-1" />
                    )}
                    {user.smoking === "yes" ? "흡연" : "비흡연"}
                  </div>
                )}
                {user?.drinking && (
                  <div className="flex items-center">
                    <FaWineGlass className="text-purple-500 mr-2" />
                    {user.drinking === "yes" ? "음주" : "비음주"}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 연락처 */}
          {(user?.email || user?.phone || user?.birthday) && (
            <div>
              <h3 className="font-semibold mb-2">연락처</h3>
              <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                {user?.email && (
                  <div className="flex items-center">
                    <FaRegEnvelope className="text-yellow-500 mr-2" />
                    {user.email}
                  </div>
                )}
                {user?.phone && (
                  <div className="flex items-center">
                    <FaPhone className="text-teal-500 mr-2" />
                    {user.phone}
                  </div>
                )}
                {user?.birthday && (
                  <div className="flex items-center">
                    <FaBirthdayCake className="text-pink-500 mr-2" />
                    {user.birthday}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileDetailModal;
