import { useState } from "react";
import ParticipantDetailModal from "./ParticipantDetailModal.jsx";
import { getProfileImageUrl } from "../../1_user/api/userApi"; // ✅ 이미지 경로 유틸 import

const AcceptedUserList = ({ participants, currentUserId, onRemove }) => {
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    if (!participants.length) {
        return <p className="text-sm text-gray-500">참가자가 없습니다.</p>;
    }

    return (
        <>
            <ul className="space-y-3">
                {participants.map((p) => (
                    <li
                        key={p.matchParticipantId}
                        className="flex flex-row justify-between items-center flex-wrap gap-3 bg-gray-50 p-3 rounded-lg border"
                    >
                        {/* 유저 정보 (클릭 시 상세 보기) */}
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => setSelectedParticipant(p)}
                        >
                            <img
                                src={p.userImg ? getProfileImageUrl(p.userImg) : "/default-profile.png"}
                                alt="프로필"
                                className="w-10 h-10 rounded-full object-cover border"
                            />
                            <span className="text-sm text-blue-600 hover:underline font-medium">
                                {p.username ?? `ID: ${p.userId}`}
                            </span>
                            {p.userId === currentUserId && (
                                <span className="ml-2 inline-block bg-yellow-400 text-white text-xs px-2 py-0.5 rounded-full">
                                    방장
                                </span>
                            )}
                        </div>

                        {/* 강퇴 버튼 */}
                        {p.userId !== currentUserId && (
                            <button
                                onClick={() => onRemove(p)}
                                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                            >
                                강퇴
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {/* 상세보기 모달 */}
            <ParticipantDetailModal
                isOpen={!!selectedParticipant}
                onClose={() => setSelectedParticipant(null)}
                participant={selectedParticipant}
            />
        </>
    );
};

export default AcceptedUserList;