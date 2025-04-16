import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getParticipantsByGroupId } from "../api/matchParticipantApi";
import { getCurrentUser, getMatchGroupById } from "../api/matchGroupApi";
import { Venus, Mars, Crown } from "lucide-react";
import { getProfileImageUrl } from "../../1_user/api/userApi";

export default function MatchGroup() {
    const { matchGroupId } = useParams();
    const [participants, setParticipants] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [group, setGroup] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    const fetchData = async () => {
        try {
            const user = await getCurrentUser();
            const list = await getParticipantsByGroupId(matchGroupId);
            const groupInfo = await getMatchGroupById(matchGroupId);
            setCurrentUser(user);
            setParticipants(list);
            setGroup(groupInfo);

            const isAccepted = list.some(
                (p) =>
                    p.userId === user.userId &&
                    (p.participantStatus === "ACCEPTED" || p.userId === p.hostId)
            );
            setIsAuthorized(isAccepted);
        } catch (error) {
            console.error("데이터 조회 실패:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [matchGroupId]);

    if (!isAuthorized) {
        return (
            <div className="p-10 text-center text-red-500 font-semibold">
                ⚠️ 이 그룹에 입장할 수 있는 권한이 없습니다.
            </div>
        );
    }

    const renderGenderIcon = (gender) => {
        return gender === "MALE" ? (
            <Mars className="w-4 h-4 text-blue-500" />
        ) : (
            <Venus className="w-4 h-4 text-pink-500" />
        );
    };

    const openUserDetail = (participant) => {
        alert(`${participant.name}님의 상세 정보 모달 (추후 구현)`);
    };

    return (
        <div className="relative min-h-[100dvh] flex flex-col bg-[#f9fafb]">
            {/* 토글 버튼 */}
            <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="absolute top-4 right-4 bg-gray-200 text-black text-xs px-3 py-1 rounded-lg shadow-sm hover:bg-gray-200 transition"
            >
                {showSidebar ? "☰" : "☰"}
            </button>

            {/* 참가자 사이드바 */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-white p-4 shadow-md z-40 transition-transform duration-300 ease-in-out
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}>
                <h2 className="text-lg font-bold mb-4 text-center">참가자 목록</h2>
                <ul className="space-y-3 overflow-y-auto h-[90%]">
                    {participants.map((p) => (
                        <li
                            key={p.userId}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-md shadow-sm cursor-pointer"
                            onClick={() => openUserDetail(p)}
                        >
                            <div className="flex items-center gap-3">
                                <img
                                    src={p.userImg ? getProfileImageUrl(p.userImg) : "/default-profile.png"}
                                    alt="유저 이미지"
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                {renderGenderIcon(p.gender)}
                                <span className="text-sm font-medium">{p.username}</span>
                            </div>
                            <div className="text-xs flex gap-1">
                                {p.userId === p.hostId && (
                                    <span className="text-yellow-600 font-medium flex items-center gap-1">
                    <Crown className="w-3 h-3" /> 방장
                  </span>
                                )}
                                {p.userId === currentUser?.userId && (
                                    <span className="text-blue-500 font-medium">나</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 본문: 미리보기 → 그룹 정보 → 채팅 */}
            <div className="flex-1 flex flex-col p-4 gap-4 mt-12">
                {/* 미리보기 대체 콘텐츠 */}
                <div className="w-full h-48 bg-white border rounded-lg shadow-inner flex items-center justify-center text-gray-400 text-sm">
                    그룹 미리보기 콘텐츠 준비 중...
                </div>

                {/* 그룹 정보 (위치 클릭 가능) */}
                <div className="bg-white p-4 rounded-lg shadow-md text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p><strong>⛳ 그룹명:</strong> {group?.groupName}</p>
                    <p><strong>📅 일정:</strong> {group?.schedule}</p>
                    <p><strong>🎯 연령대:</strong> {group?.ageRange}</p>
                    <p><strong>🏌️‍♀️ 스타일:</strong> {group?.playStyle}</p>
                    <p><strong>👫 성비:</strong> 여성 {group?.femaleLimit} / 남성 {group?.maleLimit}</p>
                    <p>
                        <strong>📍 위치:</strong>{" "}
                        <a
                            href={`https://map.kakao.com/link/map/${encodeURIComponent(group?.location)},${group?.latitude},${group?.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline hover:text-blue-800"
                        >
                            {group?.location}
                        </a>
                    </p>
                </div>

                {/* 💬 채팅 공간 */}
                <div className="flex-1 flex flex-col bg-white p-4 rounded-lg shadow-inner">
                    <h2 className="text-lg font-bold mb-2 text-gray-800">💬 게임 대기 채팅</h2>
                    <div className="flex-1 overflow-y-auto p-2 text-sm text-gray-600">
                        <p className="text-center text-gray-400 mt-10">아직 메시지가 없습니다. 첫 메시지를 입력해보세요!</p>
                    </div>
                    <form className="mt-4 flex gap-2">
                        <input
                            type="text"
                            placeholder="메시지를 입력하세요"
                            className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                        >
                            보내기
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}