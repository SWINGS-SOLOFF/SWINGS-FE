import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getParticipantsByGroupId } from "../api/matchParticipantApi";
import { getCurrentUser } from "../api/matchGroupApi";
import { Venus, Mars, Crown } from "lucide-react";

export default function MatchGroup() {
    const { matchGroupId } = useParams();
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

    const renderGenderIcon = (gender) => {
        return gender === "MALE" ? (
            <Mars className="w-4 h-4 text-blue-500" />
        ) : (
            <Venus className="w-4 h-4 text-pink-500" />
        );
    };

    return (
        <div className="h-[100dvh] flex flex-col md:flex-row bg-[#f9fafb]">
            {/* 👥 참가자 리스트 */}
            <div className="md:w-1/4 w-full border-b md:border-b-0 md:border-r bg-white p-4 shadow-md">
                <h2 className="text-lg font-bold mb-4 text-center md:text-left">🎮 참가자 목록</h2>
                <ul className="space-y-2">
                    {participants.map((p) => (
                        <li
                            key={p.userId}
                            className="bg-gray-50 p-3 rounded-md shadow-sm flex justify-between items-center text-sm"
                        >
                            <div className="flex items-center gap-2">
                                {renderGenderIcon(p.gender)}
                                <span>{p.username}</span>
                            </div>
                            <div className="flex gap-1 text-xs items-center">
                                {p.userId === p.hostId && (
                                    <span className="text-yellow-600 font-medium flex items-center gap-1">
                                        <Crown className="w-3 h-3" />
                                        방장
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

            {/* 💬 채팅 공간 */}
            <div className="flex-1 flex flex-col p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800">💬 게임 대기 채팅</h2>
                <div className="flex-1 bg-white rounded-lg p-4 overflow-y-auto border shadow-inner">
                    <p className="text-center text-sm text-gray-400 mt-10">
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
    );
}