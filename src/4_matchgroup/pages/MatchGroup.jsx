import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import {
    CalendarIcon, MapPinIcon, UsersIcon, Venus, Mars, Crown, TargetIcon, Sparkles, Menu
} from "lucide-react";
import { getProfileImageUrl } from "../../1_user/api/userApi";
import ParticipantDetailModal from "../components/ParticipantDetailModal";
import { useMatchGroupData } from "../hooks/useMatchGroupData";
import { useMatchGroupChat } from "../hooks/useMatchGroupChat";

export default function MatchGroup() {
    const { matchGroupId } = useParams();
    const navigate = useNavigate();

    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

    const {
        participants, currentUser, group, isAuthorized, fetchData
    } = useMatchGroupData(matchGroupId);

    const {
        messages, setMessages, chatInput, setChatInput, sendMessage
    } = useMatchGroupChat(matchGroupId, isAuthorized, currentUser);

    useEffect(() => {
        fetchData().then((initialMessages) => setMessages(initialMessages));
    }, [matchGroupId]);

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

    return (
        <div className="relative min-h-[100dvh] flex flex-col bg-[#f9fafb]">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b bg-white z-50">
                <button onClick={() => navigate("/swings/matchgroup")}>
                    <IoIosArrowBack size={24} />
                </button>
                <h1 className="text-lg font-bold truncate">{group.groupName}</h1>
                <button onClick={() => setShowSidebar(!showSidebar)}>
                    <Menu size={24} />
                </button>
            </div>

            {/* 참가자 목록 사이드바 */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-white p-4 shadow-md z-40 transition-transform ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}>
                <h2 className="text-lg font-bold mb-4 text-center">참가자 목록</h2>
                <ul className="space-y-3 overflow-y-auto max-h-[calc(100vh-120px)] pb-24">
                    {participants.map((p) => (
                        <li key={p.userId} onClick={() => { setSelectedParticipant(p); setShowDetailModal(true); }}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-md shadow-sm cursor-pointer">
                            <div className="flex items-center gap-3">
                                <img src={p.userImg ? getProfileImageUrl(p.userImg) : "/default-profile.png"} className="w-8 h-8 rounded-full" />
                                {renderGenderIcon(p.gender)}
                                <span>{p.username}</span>
                            </div>
                            <div className="text-xs flex gap-1">
                                {/* ✅ hostId 비교를 문자열로 명확하게 */}
                                {String(p.userId) === String(group?.hostId) && (
                                    <span className="text-yellow-600 flex items-center gap-1">
                                        <Crown className="w-3 h-3" /> 방장
                                    </span>
                                )}
                                {String(p.userId) === String(currentUser?.userId) && (
                                    <span className="text-blue-500">나</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="mt-6 pt-4 border-t">
                    <button onClick={() => setShowLeaveConfirm(true)} className="w-full text-sm text-red-500 border px-4 py-2 rounded">그룹 나가기</button>
                </div>
            </div>

            {/* 그룹 정보 + 채팅 */}
            <div className="flex-1 flex flex-col p-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-2">
                    <InfoItem icon={<CalendarIcon />} text={group?.schedule} />
                    <InfoItem icon={<TargetIcon />} text={group?.ageRange} />
                    <InfoItem icon={<Sparkles />} text={group?.playStyle} />
                    <InfoItem icon={<UsersIcon />} text={`여성 ${group?.femaleLimit} / 남성 ${group?.maleLimit}`} />
                    <InfoItem icon={<MapPinIcon />} text={
                        <a href={`https://map.kakao.com/link/map/${encodeURIComponent(group?.location)},${group?.latitude},${group?.longitude}`} target="_blank" className="underline">
                            {group?.location}
                        </a>
                    } />
                </div>

                {/* 채팅 */}
                <div className="flex-1 flex flex-col bg-white p-4 rounded-lg shadow-inner">
                    <h2 className="text-lg font-bold mb-2">💬 게임 대기 채팅</h2>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-60">
                        {messages.length === 0 ? (
                            <p className="text-center text-gray-400 mt-10">아직 메시지가 없습니다.</p>
                        ) : (
                            messages.map((msg, idx) => (
                                <div key={idx} className={`p-2 rounded-md w-fit ${msg.sender === currentUser?.username ? "bg-pink-100 self-end" : "bg-purple-100"}`}>
                                    <span className="block font-semibold text-sm">{msg.sender}</span>
                                    <span className="block text-sm">{msg.content}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="mt-4 flex gap-2">
                        <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 border rounded-lg px-4 py-2" />
                        <button type="submit" className="bg-custom-pink text-white px-4 py-2 rounded-lg">보내기</button>
                    </form>
                </div>
            </div>

            {/* 참가자 상세 모달 */}
            {showDetailModal && <ParticipantDetailModal isOpen={showDetailModal} participant={selectedParticipant} onClose={() => setShowDetailModal(false)} />}

            {/* 나가기 모달 */}
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
        </div>
    );
}

function InfoItem({ icon, text }) {
    return <p className="flex items-center gap-2 text-sm">{icon}<span>{text}</span></p>;
}