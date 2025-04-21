import { useState } from "react";
import ParticipantDetailModal from "./ParticipantDetailModal.jsx";

const PendingUserList = ({
                             pending,
                             onApprove,
                             onReject,
                             showDetail = true,
                         }) => {
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    if (!pending.length) {
        return <p className="text-sm text-gray-500">대기자가 없습니다.</p>;
    }

    return (
        <>
            <ul className="space-y-3">
                {pending.map((p) => (
                    <li
                        key={p.matchParticipantId}
                        className="flex flex-row justify-between items-center flex-wrap gap-3 bg-white shadow-sm p-3 rounded-lg border"
                    >
                        {/* 유저 정보 */}
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => showDetail && setSelectedParticipant(p)}
                        >
                            <img
                                src={p.userImg || "/default-profile.png"}
                                alt="프로필"
                                className="w-10 h-10 rounded-full object-cover border"
                            />
                            <span className="text-sm text-blue-600 hover:underline font-medium">
                               {p.username ?? `ID: ${p.userId}`}
                            </span>
                        </div>

                        {/* 버튼 */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => onApprove(p)}
                                className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition"
                            >
                                승인
                            </button>
                            <button
                                onClick={() => onReject(p)}
                                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                            >
                                거절
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <ParticipantDetailModal
                isOpen={!!selectedParticipant}
                onClose={() => setSelectedParticipant(null)}
                participant={selectedParticipant}
            />
        </>
    );
};

export default PendingUserList;
