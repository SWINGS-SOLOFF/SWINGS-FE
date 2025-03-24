import {useEffect, useState} from "react";
import {getAllMatchGroups} from "../api/matchGroupApi.js";
import {useNavigate} from "react-router-dom";

const MatchGroupList = () => {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await getAllMatchGroups();
                setGroups(data);
            } catch (error) {
                console.error("그룹 목록을 불러오는 중 오류 발생:", error);
            }
        };
        fetchGroups();
    }, []);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">매칭 그룹 목록</h1>
            {groups.length === 0 ? (
                <p className="text-gray-500">현재 모집 중인 그룹이 없습니다.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            className="p-4 bg-white shadow-lg rounded-lg cursor-pointer hover:bg-gray-100 transition"
                            onClick={() => navigate(`/matchgroup/${group.id}`)}
                        >
                            <h3 className="text-lg font-bold">{group.name}</h3>
                            <p className="text-gray-600">{group.description}</p>
                            <p className="text-sm text-gray-500">📍 장소: {group.location}</p>
                            <p className="text-sm text-gray-500">
                                ⏰ 일정: {new Date(group.dateTime).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                                👥 모집 현황: {group.currentParticipants}/{group.maxParticipants}명
                            </p>
                            <p
                                className={`text-sm font-bold ${
                                    group.status === "모집 완료" ? "text-red-500" : "text-green-500"
                                }`}
                            >
                                {group.status}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchGroupList;