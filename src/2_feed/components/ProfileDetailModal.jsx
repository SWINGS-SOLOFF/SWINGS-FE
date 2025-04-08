import React from "react";
import { motion } from "framer-motion";
import { getProfileImageUrl } from "../../1_user/api/userApi";
import { FaTimes } from "react-icons/fa";

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
        <div className="bg-gray-100 pt-8 pb-8 px-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg">
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
          </div>
        </div>

        {/* 이름 */}
        <div className="pb-4 px-6 mt-4 text-center">
          <h2 className="text-xl font-bold text-black">
            @{user?.username || user?.name || "닉네임 없음"}
          </h2>
        </div>

        {/* 프로필 정보 */}
        <div className="px-6 pb-6 overflow-y-auto max-h-[40vh] space-y-2 text-sm text-black bg-gray-50 rounded-lg p-4 mx-4 text-left">
          {user?.activityRegion && (
            <div>
              지역: {regionMap[user.activityRegion] || user.activityRegion}
            </div>
          )}
          {user?.birthDate && (
            <div>나이: {`${user.birthDate.slice(0, 4)}년생`}</div>
          )}
          {user?.gender && (
            <div>성별: {user.gender === "male" ? "남성" : "여성"}</div>
          )}
          {user?.golfSkill && (
            <div>
              골프 실력: {golfLevelMap[user.golfSkill] || user.golfSkill}
            </div>
          )}
          {user?.mbti && <div>MBTI: {user.mbti}</div>}
          {user?.job && <div>직업: {user.job}</div>}
          {user?.hobbies && <div>취미: {user.hobbies}</div>}
          {user?.smoking && (
            <div>{user.smoking === "yes" ? "흡연자" : "비흡연자"}</div>
          )}
          {user?.drinking && (
            <div>{user.drinking === "yes" ? "음주함" : "음주하지 않음"}</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileDetailModal;
