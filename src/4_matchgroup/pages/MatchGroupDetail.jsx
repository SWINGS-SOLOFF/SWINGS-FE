import { useEffect, useState } from "react";
import { getMatchGroupById, closeMatchGroup, deleteMatchGroup } from "../api/matchGroupApi.js";
import { getParticipantsByGroupId, joinMatch, leaveMatch, removeParticipant } from "../api/matchParticipantApi.js";
import { useParams, useNavigate } from "react-router-dom";
import {getCurrentUser} from "../../1_user/api/userApi.js";

const MatchGroupDetail = () => {
    const { groupId } = useParams();  // URL에서 groupId 추출
    const navigate = useNavigate();  // 페이지 이동을 위한 navigate 함수
    
    // 상태 변수
    const [group, setGroup] = useState(null);  // 그룹 정보
    const [participants, setParticipants] = useState([]);  // 참가자 목록
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const [currentUser, setCurrentUser] = useState(null);  // 현재 로그인한 유저
    const [isHost, setIsHost] = useState(false);  // 방장 여부


    // 페이지 로딩(초기 데이터 불러오기)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUser();  // 로그인 유저 정보
                setCurrentUser(user);

                const groupData = await getMatchGroupById(groupId);  // 그룹 정보
                const participantData = await getParticipantsByGroupId(groupId);  // 참가자 목록
                setGroup(groupData);
                setParticipants(participantData);
                
                // 방장 여부 판단(그룹을 만든 사람이 방장)
                if (user && groupData.creator === user.username) {
                    setIsHost(true);
                }
            } catch (error) {
                console.error("데이터 불러오기 오류:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [groupId]);


    // 핸들러
    // 1. 참가 신청
    const handleJoin = async () => {
        if (!group || group.currentParticipants >= group.maxParticipants) return;

        try {
            await joinMatch(group.id, currentUser.username);
            alert("참가 신청이 완료되었습니다!");
            window.location.reload();  // 새로고침하여 데이터 갱신
        } catch (error) {
            console.error("참가 신청 실패:", error);
            alert("참가 신청 중 오류가 발생했습니다.");
        }
    };
    
    // 2. 참가 취소
    const handleLeave = async () => {
        try {
            await leaveMatch(group.id, currentUser.username);
            alert("참가를 취소하였습니다.");
            window.location.reload();
        } catch (error) {
            console.error("참가 취소 실패:", error);
            alert("참가 취소 중 오류가 발생했습니다.");
        }
    };

    // 3. 참가자 강퇴 처리(방장만 가능)
    const handleRemoveParticipant = async (participantUsername) => {
        if (!isHost) return alert("방장만 참가자를 강퇴할 수 있습니다.");

        try {
            await removeParticipant(group.id, participantUsername);
            alert(`${participantUsername} 님을 강퇴했습니다.`);
            setParticipants(participants.filter(p => p.username !== participantUsername));
        } catch (error) {
            console.error("강퇴 실패:", error);
            alert("강퇴 중 오류가 발생했습니다.");
        }
    };

    // 4. 모집 종료 처리(방장만 가능)
    const handleCloseGroup = async () => {
        if (!isHost) return alert("방장만 모집을 종료할 수 있습니다.");

        try {
            await closeMatchGroup(group.id);
            alert("모집이 종료되었습니다.");
            window.location.reload();
        } catch (error) {
            console.error("모집 종료 실패:", error);
            alert("모집 종료 중 오류가 발생했습니다.");
        }
    };

    // 5. 그룹 삭제(방장만 가능)
    const handleDeleteGroup = async () => {
        if (!isHost) return alert("방장만 그룹을 삭제할 수 있습니다.");
        if (!window.confirm("정말로 그룹을 삭제하시겠습니까?")) return;

        try {
            await deleteMatchGroup(group.id);
            alert("그룹이 삭제되었습니다.");
            navigate("/matchgroups"); // 그룹 목록 페이지로 이동
        } catch (error) {
            console.error("그룹 삭제 실패:", error);
            alert("그룹 삭제 중 오류가 발생했습니다.");
        }
    };


    // 로딩 or 에러 상태 처리
    if (loading) return <p className="text-center">⏳ 로딩 중...</p>;
    if (!group) return <p className="text-center text-red-500">❌ 그룹 정보를 찾을 수 없습니다.</p>;


    // 랜더링
    const isFull = group.currentParticipants >= group.maxParticipants;
    const isParticipant = participants.some((p) => p.username === currentUser?.username);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">{group.name}</h1>
            <p className="text-gray-600 mb-2">{group.description}</p>
            <p className="text-gray-500">📍 장소: {group.location}</p>
            <p className="text-gray-500">
                ⏰ 일정: {new Date(group.dateTime).toLocaleDateString()} {new Date(group.dateTime).toLocaleTimeString()}
            </p>
            <p className="text-gray-500">👥 모집 현황: {group.currentParticipants}/{group.maxParticipants}명</p>
            <p className="text-sm font-bold text-blue-500">⭐ 방장: {group.creator}</p>

            {!isParticipant ? (
                <button
                    onClick={handleJoin}
                    className={`mt-4 w-full px-4 py-2 text-white rounded-lg shadow-md transition ${
                        isFull ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={isFull}
                >
                    {isFull ? "모집 완료됨" : "참가 신청"}
                </button>
            ) : (
                <button
                    onClick={handleLeave}
                    className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
                >
                    참가 취소
                </button>
            )}

            {isHost && (
                <div className="mt-6 space-y-2">
                    <button
                        onClick={handleCloseGroup}
                        className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
                    >
                        모집 종료
                    </button>
                    <button
                        onClick={handleDeleteGroup}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition"
                    >
                        그룹 삭제
                    </button>
                </div>
            )}

            <div className="mt-6">
                <h2 className="text-lg font-semibold">👥 참가자 목록</h2>
                {participants.length === 0 ? (
                    <p className="text-gray-500">아직 참가자가 없습니다.</p>
                ) : (
                    <ul className="mt-2 space-y-2">
                        {participants.map((participant) => (
                            <li key={participant.username} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                                <span>{participant.username}</span>
                                {isHost && participant.username !== currentUser?.username && (
                                    <button
                                        onClick={() => handleRemoveParticipant(participant.username)}
                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        강퇴
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MatchGroupDetail;
