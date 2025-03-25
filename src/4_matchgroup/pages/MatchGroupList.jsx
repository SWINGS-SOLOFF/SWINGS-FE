import { useEffect, useState } from "react";
import { getAllMatchGroups } from "../api/matchGroupApi.js";
import { useNavigate } from "react-router-dom";

const MatchGroupList = () => {
    const [groups, setGroups] = useState([]);  // 그룹 목록 저장
    const navigate = useNavigate();  // 페이지 이동을 위한 navigate 함수

    
    // 그룹 목록 가져오기
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await getAllMatchGroups();
                setGroups(data);  // 가져온 데이터로 상태 업데이트
            } catch (error) {
                console.error("그룹 목록을 불러오는 중 오류 발생:", error);
            }
        };
        fetchGroups();  // 컴포넌트 마운트 시 데이터 요청
    }, []);

    // 그룹 목록을 화면에 표시하는 함수
    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* 제목과 그룹 생성 버튼 영역 */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">매칭 그룹 목록</h1>
                <button
                    onClick={() => navigate("/matchgroup/create")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition disabled:bg-gray-400"
                >
                    그룹 만들기
                </button>
            </div>

            {/* 그룹이 없을 경우 메시지 표시 */}
            {groups.length === 0 ? (
                <p className="text-gray-500">현재 모집 중인 그룹이 없습니다.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                   {/* 그룹 리스트 랜더링 */}
                    {groups.map((group) => {
                        const isFull = group.currentParticipants >= group.maxParticipants;  // 모집 완료 여부 확인
                        return (
                            <div
                                key={group.id}
                                className={`p-4 bg-white shadow-lg rounded-lg cursor-pointer transition ${
                                    isFull ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-100"
                                }`}
                                onClick={() => !isFull && navigate(`/matchgroup/${group.id}`)}
                            >

                                {/* 그룹 정보 */}
                                <h3 className="text-lg font-bold">{group.name}</h3>
                                <p className="text-gray-600">{group.description}</p>
                                <p className="text-sm text-gray-500">📍 장소: {group.location}</p>
                                <p className="text-sm text-gray-500">
                                    ⏰ 일정: {new Date(group.dateTime).toLocaleDateString()} {new Date(group.dateTime).toLocaleTimeString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    👥 모집 현황: {group.currentParticipants}/{group.maxParticipants}명
                                </p>
                                <p
                                    className={`text-sm font-bold ${
                                        isFull ? "text-red-500" : "text-green-500"
                                    }`}
                                >
                                    {isFull ? "모집 완료" : "모집 중"}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MatchGroupList;
