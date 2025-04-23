import {useEffect, useRef, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import {
    CalendarIcon, MapPinIcon, UsersIcon, Venus, Mars, Crown, TargetIcon, Sparkles, Menu
} from "lucide-react";
import { getProfileImageUrl } from "../../1_user/api/userApi";
import ParticipantDetailModal from "../components/ParticipantDetailModal";
import PendingUserList from "../components/PendingUserList";
import AcceptedUserList from "../components/AcceptedUserList";
import {
    approveParticipant,
    rejectParticipant,
    removeParticipant,
    getPendingParticipants,
    getAcceptedParticipants
} from "../api/matchParticipantApi";
import { useMatchGroupData } from "../hooks/useMatchGroupData";
import { useMatchGroupChat } from "../hooks/useMatchGroupChat";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function MatchGroup() {
    const { matchGroupId } = useParams();
    const navigate = useNavigate();
    const bottomRef = useRef(null);

    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [showAcceptedModal, setShowAcceptedModal] = useState(false);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [acceptedUsers, setAcceptedUsers] = useState([]);

    const {
        participants, currentUser, group, isAuthorized, fetchData
    } = useMatchGroupData(matchGroupId);

    const {
        messages, setMessages, chatInput, setChatInput, sendMessage
    } = useMatchGroupChat(matchGroupId, isAuthorized, currentUser);

    useEffect(() => {
        fetchData().then((initialMessages) => setMessages(initialMessages));
    }, [matchGroupId]);

    useEffect(() => {
        if (showPendingModal) getPendingParticipants(matchGroupId).then(setPendingUsers);
    }, [showPendingModal]);

    useEffect(() => {
        if (showAcceptedModal) getAcceptedParticipants(matchGroupId).then(setAcceptedUsers);
    }, [showAcceptedModal]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!isAuthorized) {
        return (
            <div className="p-10 text-center text-red-500 font-semibold">
                ⚠️ 이 그룹에 입장할 수 있는 권한이 없습니다.
            </div>
        );
    }

    const renderGenderIcon = (gender) =>
        gender?.toLowerCase() === "male" ? (
            <Mars className="w-4 h-4 text-blue-500" />
        ) : (
            <Venus className="w-4 h-4 text-pink-500" />
        );

    const handleApprove = async (p) => {
        await approveParticipant(group.matchGroupId, p.matchParticipantId, currentUser.userId);
        setPendingUsers(await getPendingParticipants(group.matchGroupId));
        await fetchData();
    };

    const handleReject = async (p) => {
        await rejectParticipant(group.matchGroupId, p.matchParticipantId, currentUser.userId);
        setPendingUsers(await getPendingParticipants(group.matchGroupId));
        await fetchData();
    };

    const handleKick = async (p) => {
        if (!window.confirm(`${p.username}님을 강퇴하시겠습니까?`)) return;
        await removeParticipant(group.matchGroupId, p.userId, currentUser.userId);
        setAcceptedUsers(await getAcceptedParticipants(group.matchGroupId));
        await fetchData();
    };

    const isHost = String(currentUser?.userId) === String(group?.hostId);

    const formatKoreanDate = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return format(date, "yyyy년 M월 d일 a h:mm", { locale: ko });
    };

    return (
        <div className=" min-h-screen bg-[#f9fafb] overflow-hidden">
            {/* 상단 헤더 */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-white z-40">
                <button onClick={() => navigate("/swings/matchgroup")}> <IoIosArrowBack size={24} /> </button>
                <h1 className="text-lg font-bold truncate z-0 flex items-center gap-2">
                    {group.groupName}
                </h1>
                <button onClick={() => setShowSidebar(!showSidebar)}> <Menu size={24} /> </button>
            </div>

            {/* 사이드바 */}
            {showSidebar && (
                <div className="fixed top-0 left-0 h-full w-64 bg-white p-4 shadow-md z-50">
                    <h2 className="text-lg font-bold mb-4 text-center">참가자 목록</h2>
                    <ul className="space-y-3 overflow-y-auto max-h-[calc(100vh-120px)] pb-24">
                        {participants.map((p) => (
                            <li key={p.userId} onClick={() => { setSelectedParticipant(p); setShowDetailModal(true); }}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-md shadow-sm cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <img src={p.userImg ? getProfileImageUrl(p.userImg) : "/default-profile.png"} className="w-8 h-8 rounded-full" alt="" />
                                    {renderGenderIcon(p.gender)}
                                    <span>{p.username}</span>
                                </div>
                                <div className="text-xs flex gap-1">
                                    {String(p.userId) === String(group?.hostId) && <span className="text-yellow-600 flex items-center gap-1"><Crown className="w-3 h-3" /> 방장</span>}
                                    {String(p.userId) === String(currentUser?.userId) && <span className="text-blue-500">나</span>}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-2 mt-6">
                        {isHost && (
                            <>
                                <button onClick={() => setShowPendingModal(true)} className="bg-custom-pink text-white px-3 py-2 rounded-lg">참가 신청 관리</button>
                                <button onClick={() => setShowAcceptedModal(true)} className="bg-custom-purple text-white px-3 py-2 rounded-lg">참가 인원 관리</button>
                            </>
                        )}
                        <button onClick={() => setShowLeaveConfirm(true)} className="w-full px-3 py-2 rounded-lg border border-red-300 text-red-500 font-semibold hover:bg-red-50">그룹 나가기</button>
                    </div>
                </div>
            )}

            {/* 그룹 정보 */}
            <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <p className="text-lg text-gray-600 mb-2">{group.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">{group.playStyle}</span>
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">{group.ageRange}</span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">{group.matchType}</span>
                    </div>
                    <div className="grid gap-2 text-sm text-gray-700">
                        <p className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-500" />
                            {formatKoreanDate(group.schedule)}
                        </p>
                        <p className="flex items-center gap-2">
                            <MapPinIcon className="w-4 h-4 text-gray-500" />
                            <a href={`https://map.kakao.com/link/map/${encodeURIComponent(group?.location)},${group?.latitude},${group?.longitude}`} target="_blank" rel="noopener noreferrer" className="underline">
                                {group.location}
                            </a>
                        </p>
                    </div>
                </div>

                {/* 채팅 */}
                <div className="flex-1 flex flex-col bg-white p-2 rounded-lg shadow-inner">
                    <h2 className="text-lg font-bold mb-2">💬 그룹 채팅</h2>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-80">
                        {messages.length === 0 ? (
                            <p className="text-center text-gray-400 mt-10">아직 메시지가 없습니다.</p>
                        ) : (
                            messages.map((msg, idx) => {
                                const isMine = msg.sender === currentUser?.username;

                                return (
                                    <div key={idx} className={`w-full flex ${isMine ? "justify-end" : "justify-start"}`}>
                                        <div className={`p-2 rounded-md w-fit max-w-[70%] ${isMine ? "bg-pink-100 text-right" : "bg-purple-100 text-left"}`}>
                                            <span className="block font-semibold text-sm">{msg.sender}</span>
                                            <span className="block text-sm whitespace-pre-wrap break-words">{msg.content}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={bottomRef} />
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="mt-4 flex gap-2">
                        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 border rounded-lg px-4 py-2" />
                        <button type="submit" className="bg-custom-pink text-white px-4 py-2 rounded-lg">보내기</button>
                    </form>
                </div>
            </div>

            {/* 모달들 */}
            {showDetailModal && <ParticipantDetailModal isOpen={showDetailModal} participant={selectedParticipant} onClose={() => setShowDetailModal(false)} />}

            {showLeaveConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
                        <h3 className="text-lg font-semibold mb-4">정말 이 그룹을 나가시겠어요?</h3>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => (window.location.href = "/swings/matchgroup")} className="px-4 py-2 rounded bg-red-500 text-white">나가기</button>
                            <button onClick={() => setShowLeaveConfirm(false)} className="px-4 py-2 rounded bg-gray-200">취소</button>
                        </div>
                    </div>
                </div>
            )}

            {showPendingModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4 text-center">신청자 관리</h3>
                        <PendingUserList pending={pendingUsers} onApprove={handleApprove} onReject={handleReject} />
                        <div className="mt-6 text-center">
                            <button onClick={() => setShowPendingModal(false)} className="px-4 py-2 rounded bg-gray-200">닫기</button>
                        </div>
                    </div>
                </div>
            )}

            {showAcceptedModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4 text-center">참가자 관리</h3>
                        <AcceptedUserList participants={acceptedUsers} currentUserId={currentUser?.userId} onRemove={handleKick} />
                        <div className="mt-6 text-center">
                            <button onClick={() => setShowAcceptedModal(false)} className="px-4 py-2 rounded bg-gray-200">닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoItem({ icon, text }) {
    return <p className="flex items-center gap-2 text-sm">{icon}<span>{text}</span></p>;
}