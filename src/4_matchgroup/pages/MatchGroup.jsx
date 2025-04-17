import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    CalendarIcon,
    MapPinIcon,
    UsersIcon,
    Venus,
    Mars,
    Crown,
    LogOut,
    FlagIcon,
    TargetIcon,
    Sparkles,
} from "lucide-react";
import { getAcceptedParticipants } from "../api/matchParticipantApi";
import { getCurrentUser, getMatchGroupById } from "../api/matchGroupApi";
import { getProfileImageUrl } from "../../1_user/api/userApi";
import ParticipantDetailModal from "../components/ParticipantDetailModal";

export default function MatchGroup() {
    const { matchGroupId } = useParams();
    const [participants, setParticipants] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [group, setGroup] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

    const fetchData = async () => {
        try {
            const user = await getCurrentUser();
            const accepted = await getAcceptedParticipants(matchGroupId);
            const groupInfo = await getMatchGroupById(matchGroupId);

            setCurrentUser(user);
            setParticipants(accepted);
            setGroup(groupInfo);

            const isAccepted = accepted.some((p) => p.userId === user.userId) ||
                user.userId === groupInfo.hostId;

            setIsAuthorized(isAccepted);
        } catch (error) {
            console.error("데이터 조회 실패:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [matchGroupId]);

    const renderGenderIcon = (gender) =>
        gender?.toLowerCase() === "male" ? (
            <Mars className="w-4 h-4 text-blue-500" />
        ) : (
            <Venus className="w-4 h-4 text-pink-500" />
        );

    const openUserDetail = (participant) => {
        setSelectedParticipant(participant);
        setShowDetailModal(true);
    };

    const handleLeaveGroup = async () => {
        try {
            setShowLeaveConfirm(false);
            window.location.href = "/swings/matchgroup";
        } catch (error) {
            console.error("그룹 나가기 실패:", error);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="p-10 text-center text-red-500 font-semibold">
                ⚠️ 이 그룹에 입장할 수 있는 권한이 없습니다.
            </div>
        );
    }

    return (
        <div className="relative min-h-[100dvh] flex flex-col bg-[#f9fafb]">
            {/* 사이드바 toggle 버튼 */}
            <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="absolute top-4 right-4 bg-gray-200 text-black text-xs px-3 py-1 rounded-lg shadow-sm hover:bg-gray-300 transition"
            >
                ☰
            </button>

            {/* 참가자 사이드바 */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white p-4 shadow-md z-40 transition-transform duration-300 ease-in-out
                ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
            >
                <h2 className="text-lg font-bold mb-4 text-center">참가자 목록</h2>
                <ul className="space-y-3 overflow-y-auto max-h-[calc(100vh-120px)] pb-24">
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
                                {p.userId === group?.hostId && (
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

                {/* 나가기 버튼 */}
                <div className="mt-6 pt-4 border-t">
                    <button
                        onClick={() => setShowLeaveConfirm(true)}
                        className="w-full text-sm text-red-500 border border-red-300 px-4 py-2 rounded hover:bg-red-50 flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        그룹 나가기
                    </button>
                </div>
            </div>

            {/* 본문 영역 */}
            <div className="flex-1 flex flex-col p-4 gap-4 mt-12">
                <div className="w-full h-48 bg-white border rounded-lg shadow-inner flex items-center justify-center text-gray-400 text-sm">
                    그룹 미리보기 콘텐츠 준비 중...
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md text-sm grid grid-cols-1 md:grid-cols-2 gap-2 relative">
                    <p className="flex items-center gap-2">
                        <FlagIcon className="w-4 h-4 text-green-600" />
                        <span>{group?.groupName}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-orange-500" />
                        <span>{group?.schedule}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <TargetIcon className="w-4 h-4 text-gray-600" />
                        <span>{group?.ageRange}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span>{group?.playStyle}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4 text-purple-600" />
                        <span>
                            여성 {group?.femaleLimit} / 남성 {group?.maleLimit}
                        </span>
                    </p>
                    <p className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-pink-500" />
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

                {/* 채팅창 */}
                <div className="flex-1 flex flex-col bg-white p-4 rounded-lg shadow-inner">
                    <h2 className="text-lg font-bold mb-2 text-gray-800">💬 게임 대기 채팅</h2>
                    <div className="flex-1 overflow-y-auto p-2 text-sm text-gray-600">
                        <p className="text-center text-gray-400 mt-10">
                            아직 메시지가 없습니다. 첫 메시지를 입력해보세요!
                        </p>
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

            {/* 상세 모달 */}
            {showDetailModal && (
                <ParticipantDetailModal
                    isOpen={showDetailModal}
                    participant={selectedParticipant}
                    onClose={() => setShowDetailModal(false)}
                />
            )}

            {/* 나가기 확인 모달 */}
            {showLeaveConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
                        <h3 className="text-lg font-semibold mb-4">
                            정말 이 그룹을 나가시겠어요?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleLeaveGroup}
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 text-sm"
                            >
                                나가기
                            </button>
                            <button
                                onClick={() => setShowLeaveConfirm(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}