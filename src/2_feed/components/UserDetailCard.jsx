import React from "react";
import {
  FaMapMarkerAlt,
  FaMale,
  FaFemale,
  FaBriefcase,
  FaGolfBall,
  FaSmokingBan,
  FaWineGlass,
  FaHeart,
  FaUser,
  FaCalendarAlt,
  FaLink,
} from "react-icons/fa";
import { RiMentalHealthFill } from "react-icons/ri";
import { motion } from "framer-motion";

const UserDetailCard = ({ user }) => {
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

  const userDetails = [
    {
      icon: <FaMapMarkerAlt className="text-red-500" />,
      label: "활동 지역",
      value: 지역맵[user?.activityRegion] || "정보 없음",
      color: "bg-red-50",
    },
    {
      icon:
        user?.gender === "male" ? (
          <FaMale className="text-blue-500" />
        ) : (
          <FaFemale className="text-pink-500" />
        ),
      label: "성별",
      value: user?.gender === "male" ? "남성" : "여성",
      color: user?.gender === "male" ? "bg-blue-50" : "bg-pink-50",
    },
    {
      icon: <FaBriefcase className="text-purple-600" />,
      label: "직업",
      value: user?.job || "정보 없음",
      color: "bg-purple-50",
    },
    {
      icon: <FaGolfBall className="text-green-600" />,
      label: "골프 실력",
      value: 골프맵[user?.golfSkill] || "정보 없음",
      color: "bg-green-50",
    },
    {
      icon: <RiMentalHealthFill className="text-indigo-500" />,
      label: "MBTI",
      value: user?.mbti || "정보 없음",
      color: "bg-indigo-50",
    },
    {
      icon: <FaHeart className="text-rose-500" />,
      label: "취미",
      value: user?.hobbies || "정보 없음",
      color: "bg-rose-50",
    },
    {
      icon: <FaSmokingBan className="text-red-600" />,
      label: "흡연 여부",
      value: user?.smoking === "yes" ? "흡연" : "비흡연",
      color: "bg-red-50",
    },
    {
      icon: <FaWineGlass className="text-amber-600" />,
      label: "음주 여부",
      value: user?.drinking === "yes" ? "음주" : "비음주",
      color: "bg-amber-50",
    },
  ];

  // 추가 상세 정보 (SocialPage의 ProfileDetailInfo에서 가져온 정보)
  if (user?.location) {
    userDetails.push({
      icon: <FaMapMarkerAlt className="text-orange-500" />,
      label: "위치",
      value: user.location,
      color: "bg-orange-50",
    });
  }

  if (user?.joinDate) {
    userDetails.push({
      icon: <FaCalendarAlt className="text-blue-500" />,
      label: "가입일",
      value: new Date(user.joinDate).toLocaleDateString("ko-KR"),
      color: "bg-blue-50",
    });
  }

  if (user?.website) {
    userDetails.push({
      icon: <FaLink className="text-teal-500" />,
      label: "웹사이트",
      value: user.website,
      color: "bg-teal-50",
      isLink: true,
    });
  }

  if (user?.occupation) {
    userDetails.push({
      icon: <FaUser className="text-violet-500" />,
      label: "직업 상세",
      value: user.occupation,
      color: "bg-violet-50",
    });
  }

  return (
    <div className="bg-white shadow-xl rounded-3xl p-6 border border-gray-200 transition-all hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-black mb-6 border-b border-gray-200 pb-3">
        프로필 상세 정보
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userDetails.map((detail, index) => (
          <motion.div
            key={index}
            className={`flex items-center space-x-3 p-4 ${detail.color} rounded-2xl hover:shadow-md transition-all cursor-default`}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <div className="text-3xl bg-white p-3 rounded-xl shadow-sm">
              {detail.icon}
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
              {detail.isLink ? (
                <a
                  href={detail.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-gray-800 underline hover:text-blue-600"
                >
                  링크
                </a>
              ) : (
                <p className="font-semibold text-gray-800">{detail.value}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserDetailCard;
