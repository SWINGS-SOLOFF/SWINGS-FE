import React from "react";
import TinderCard from "react-tinder-card";
import defaultImg1 from "../../assets/default-profile.png";
import defaultImg2 from "../../assets/default-profile2.png";
import defaultImg3 from "../../assets/default-profile3.png";
import { FaMars, FaVenus } from "react-icons/fa";

const SwipeCard = ({ profile, onSwipe }) => {
    if (!profile) return null;

    // 기본 프로필 이미지 1장만 사용 (차후 DB 이미지 연결 시 profile.imgs[0] 형태로 확장 가능)
    const image = defaultImg1;

    const handleSwipe = (direction) => {
        onSwipe(direction, profile); // ✅ profile도 같이 넘김
    };

    return (
        <TinderCard
            key={profile.username}
            onSwipe={handleSwipe}
            preventSwipe={["up", "down"]}
        >
            <div className="w-[320px] h-[460px] bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-4 mx-auto flex flex-col relative overflow-hidden">

                {/* 성별 아이콘 */}
                <div className="absolute top-4 right-4 transform rotate-45 z-10">
                    {profile.gender === "male" ? (
                        <FaMars className="text-blue-500 text-3xl" />
                    ) : (
                        <FaVenus className="text-pink-500 text-3xl" />
                    )}
                </div>

                {/* 이미지 1장만 표시 */}
                <div className="w-full h-[65%] mb-4 overflow-hidden rounded-xl relative">
                    <img
                        src={image}
                        alt="profile"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* 프로필 정보 */}
                <div className="flex flex-col items-center px-2 flex-grow justify-center">
                    <h2 className="text-xl font-semibold mb-1 text-black">
                        {profile.name || "이름없음"}
                    </h2>
                    <p className="text-sm text-gray-500 mb-1">
                        @{profile.username || "유저명없음"}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                       활동 지역 : {profile.activityRegion || "지역없음"}
                    </p>
                    <p className="mt-3 text-base text-gray-800 bg-pink-100 px-4 py-2 rounded-xl text-center shadow-inner">
                        {profile.introduce || "소개글없음"}
                    </p>
                </div>
            </div>
        </TinderCard>
    );
};

export default SwipeCard;
