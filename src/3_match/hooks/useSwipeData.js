import { useEffect, useState } from "react";
import axios from "../../1_user/api/axiosInstance"; // 자동으로 토큰 포함됨
import { fetchUserData } from "../../1_user/api/userApi";

export function useSwipeData() {
    const [currentUser, setCurrentUser] = useState(null);       // 로그인한 사용자 정보
    const [profile, setProfile] = useState(null);               // 추천된 유저 정보
    const [remainingLikes, setRemainingLikes] = useState(3);    // 남은 좋아요 횟수

    //  페이지 첫 진입 시, 사용자 정보 + 추천 유저 + 남은 좋아요 불러오기
    useEffect(() => {
        const load = async () => {
            try {
                const user = await fetchUserData(); // 세션 토큰 기반 사용자 정보 가져오기
                setCurrentUser(user);

                // 사용자 기반으로 추천 유저와 남은 좋아요 횟수 조회
                await fetchRecommendedUser(user.username);
                await fetchRemainingLikes(user.username);
            } catch (err) {
                console.error("❌ 유저 정보 로딩 실패:", err);
            }
        };
        load();
    }, []);

    // 추천 유저 한 명 가져오기
    const fetchRecommendedUser = async (username) => {
        try {
            const res = await axios.get(`/api/users/${username}/recommend`);
            setProfile(res.data || null); // 없으면 null
        } catch (err) {
            console.error("❌ 추천 실패:", err);
            setProfile(null);
        }
    };

    //  남은 무료 좋아요 횟수 가져오기
    const fetchRemainingLikes = async (username) => {
        try {
            const res = await axios.get(`/api/likes/count/${username}`);
            setRemainingLikes(res.data);
        } catch (err) {
            console.error("❌ 좋아요 수 실패:", err);
            setRemainingLikes(0);
        }
    };

    return {
        currentUser,
        profile,
        setProfile,
        remainingLikes,
        setRemainingLikes,
        fetchRecommendedUser,
        fetchRemainingLikes,
    };
}
