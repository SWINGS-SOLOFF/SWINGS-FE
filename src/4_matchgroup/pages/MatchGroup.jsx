import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ✅ 추가
import { getParticipantsByGroupId } from "../api/matchParticipantApi";
import { getCurrentUser } from "../api/matchGroupApi";

export default function MatchGroup() {
    const { matchGroupId } = useParams(); // ✅ 핵심!
    const [participants, setParticipants] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const fetchParticipants = async () => {
        try {
            const user = await getCurrentUser();
            setCurrentUser(user);
            const list = await getParticipantsByGroupId(matchGroupId);
            setParticipants(list);

            const isAccepted = list.some(
                (p) =>
                    p.userId === user.userId &&
                    (p.participantStatus === "ACCEPTED" || p.userId === p.hostId)
            );
            setIsAuthorized(isAccepted);
        } catch (error) {
            console.error("참가자 조회 실패:", error);
        }
    };

    useEffect(() => {
        fetchParticipants();
    }, [matchGroupId]);

    if (!isAuthorized) {
        return (
            <div className="p-10 text-center text-red-500 font-semibold">
                ⚠️ 이 그룹에 입장할 수 있는 권한이 없습니다.
            </div>
        );
    }

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row">
            {/* 참가자 목록 */}
            <div className="md:w-1/4 w-full border-b md:border-b-0 md:border-r bg-gray-100 p-4 overflow-y-auto">
                <h2 className="text-lg font-bold mb-4 text-center md:text-left">👥 참가자</h2>
                <ul className="space-y-2">
                    {participants.map((p) => (
                        <li
                            key={p.userId}
                            className="bg-white p-3 rounded shadow text-sm flex justify-between items-center"
                        >
                            <span>{p.username || `사용자 ${p.userId}`}</span>
                            <div className="flex gap-1 text-xs">
                                {p.userId === currentUser?.userId && (
                                    <span className="text-blue-500 font-medium">나</span>
                                )}
                                {p.userId === p.hostId && (
                                    <span className="text-yellow-600 font-medium">방장</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 채팅 영역 */}
            <div className="flex-1 flex flex-col p-4">
                <h2 className="text-lg font-bold mb-4 text-center md:text-left">💬 게임 대기 채팅</h2>
                <div className="flex-1 bg-white rounded-lg p-4 overflow-y-auto border shadow-inner">
                    <p className="text-center text-sm text-gray-400 mt-10">메시지를 입력해보세요.</p>
                </div>
                <form className="mt-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="메시지를 입력하세요"
                        className="flex-1 border rounded-lg px-4 py-2 text-sm"
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
    );
}