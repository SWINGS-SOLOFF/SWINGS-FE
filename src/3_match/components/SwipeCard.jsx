import React from "react";
import TinderCard from "react-tinder-card";
import defaultImg1 from "../../assets/default-profile.png";
import { FaMars, FaVenus } from "react-icons/fa";
import { getProfileImageUrl } from "../../1_user/api/userApi";

const SwipeCard = ({ profile, onSwipe }) => {
    if (!profile) return null;

    const handleSwipe = (direction) => {
        onSwipe(direction, profile);
    };

    // 🔠 활동 지역 영어 → 한글 매핑
    const regionToKorean = {
        SEOUL: "서울",
        BUSAN: "부산",
        DAEGU: "대구",
        INCHEON: "인천",
        GWANGJU: "광주",
        DAEJEON: "대전",
        ULSAN: "울산",
        JEJU: "제주",
        ETC: "기타",
    };

    // ✅ 이미지가 있으면 경로 생성, 없으면 디폴트 이미지
    const image = profile.userImg
        ? getProfileImageUrl(profile.userImg)
        : defaultImg1;

    // ✅ 활동지역 한글 변환
    const activityRegion = regionToKorean[profile.activityRegion] || "지역없음";

    return (
        <div className="flex justify-center w-full">
            <TinderCard
                key={profile.username}
                onSwipe={handleSwipe}
                preventSwipe={["up", "down"]}
            >
                <div className="w-full max-w-[360px] sm:max-w-[400px] bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg p-4 mx-auto flex flex-col relative overflow-hidden">
                    {/* 성별 아이콘 */}
                    <div className="absolute top-4 right-4 rotate-45 z-10">
                        {profile.gender === "male" ? (
                            <FaMars className="text-blue-500 text-3xl" />
                        ) : (
                            <FaVenus className="text-pink-500 text-3xl" />
                        )}
                    </div>

                    {/* 프로필 이미지 */}
                    <div className="w-full max-h-[400px] mb-4 overflow-hidden rounded-xl">
                        <img
                            src={image}
                            alt="프로필"
                            className="w-full h-auto object-cover rounded-xl"
                        />
                    </div>


                    {/* 유저 정보 */}
                    <div className="flex flex-col items-center px-2 text-center">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-1 text-black">
                            {profile.name || "이름없음"}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-500 mb-1">
                            @{profile.username || "유저명없음"}
                        </p>
                        <p className="text-sm sm:text-base text-gray-500 mb-1">
                            활동 지역 : {activityRegion}
                        </p>
                        <p className="mt-3 text-sm sm:text-base text-gray-800 bg-pink-100 px-4 py-2 rounded-xl shadow-inner leading-relaxed">
                            {profile.introduce || "소개글없음"}
                        </p>
                    </div>
                </div>
            </TinderCard>
        </div>
    );
};

export default SwipeCard;
