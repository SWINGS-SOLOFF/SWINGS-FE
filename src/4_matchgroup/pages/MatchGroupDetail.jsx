import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import { getParticipantsByGroupId, joinMatch } from "../api/matchParticipantApi";
import { getMatchGroupById } from "../api/matchGroupApi";

const MatchGroupDetail = () => {
    const {groupId} = useParams();
    const [group, setGroup] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [username, setUsername] = useState("");  // 참가할 사용자 이름

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const data = await getMatchGroupById(groupId);
                setGroup(data);

                // 참가자 목록 불러오기
                const participantsData = await getParticipantsByGroupId(groupId);
                setParticipants(participantsData);
            } catch (error) {
                console.error("그룹 상세 정보를 불러오는 중 오류 발생:", error);
            }
        };
        fetchGroupDetails();
    },[groupId]);

    const handleJoin = async () => {
        if (!username) {
            alert("이름을 입력해주세요!")
            return;
        }

        try {
            await joinMatch(groupId, username);
            alert("참가 신청 완료!");

            // 참가자 목록 다시 불러오기
            const updatedParticipants = await getParticipantsByGroupId(groupId);
            setParticipants(updatedParticipants);
        } catch (error) {
            console.error("참가 신청 중 오류 발생:", error);
            alert("참가 신청 실패!");
        }
    };

    if (!group) return <p className="text-center">로딩 중...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
            <p className="text-gray-600">{group.description}</p>
            <p className="text-sm text-gray-500">📍 장소: {group.location}</p>
            <p className="text-sm text-gray-500">⏰ 일정: {new Date(group.dateTime).toLocaleString()}</p>
            <p className="text-sm text-gray-500">👥 모집 현황: {participants.length}/{group.maxParticipants}명</p>

            {/* 참가 신청 폼 */}
            {participants.length < group.maxParticipants ? (
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="이름 입력"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 border rounded w-full"
                    />
                    <button
                        onClick={handleJoin}
                        className="mt-2 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        참가 신청
                    </button>
                </div>
            ) : (
                <p className="text-red-500 font-bold mt-4">모집이 마감되었습니다.</p>
            )}

            {/* 참가자 목록 */}
            <h3 className="text-xl font-bold mt-6">참가자 목록</h3>
            <ul className="mt-2 space-y-2">
                {participants.map((participant) => (
                    <li key={participant.id} className="p-2 border rounded">
                        {participant.username}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MatchGroupDetail;


