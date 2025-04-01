import { useEffect, useState } from "react";
import { getAllMatchGroups } from "../api/matchGroupApi.js";
import { useParams } from "react-router-dom";
import MatchGroupCard from "../components/MatchGroupCard.jsx";

const MatchGroupList = () => {
    const [groups, setGroups] = useState([]); // 그룹 목록 상태
    const { category } = useParams(); // URL 파라미터에서 카테고리(screen | field) 가져옴

    // 그룹 목록 불러오기
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await getAllMatchGroups(category);
                console.log("그룹 목록 응답:", data);

                // 응답이 배열이 아닐 경우 예외 처리
                if (!Array.isArray(data)) {
                    console.error("⚠️ 응답 형식이 배열이 아닙니다:", data);
                    setGroups([]);
                    return;
                }

                // 카테고리 필터링 (screen | field)
                const filtered = category
                    ? data.filter((group) => group.matchType === category)
                    : data;

                setGroups(filtered);
            } catch (error) {
                console.error("❌ 그룹 목록 불러오기 오류:", error);
                setGroups([]);
            }
        };

        fetchGroups();
    }, [category]);

    return (
        <div className="max-w-5xl mx-auto p-8 text-center">
            <h1 className="text-3xl font-bold text-green-700 mb-4">
                {category === "screen" ? "스크린 골프 매칭" : "필드 골프 매칭"}
            </h1>

            {groups.length === 0 ? (
                <p className="text-gray-500 text-center">현재 모집 중인 그룹이 없습니다.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groups.map((group, index) => (
                        <MatchGroupCard
                            key={group.matchGroupId || `group-${index}`}
                            group={group}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchGroupList;
