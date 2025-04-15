import { useEffect, useState } from "react";
import { getAllMatchGroups } from "../api/matchGroupApi.js";
import { useParams } from "react-router-dom";
import MatchGroupCard from "../components/MatchGroupCard.jsx";

const MatchGroupList = () => {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);

    const { category } = useParams();

    // 필터 상태
    const [region, setRegion] = useState("전체");
    const [genderRatio, setGenderRatio] = useState("전체");
    const [selectedDate, setSelectedDate] = useState("");

    const regionOptions = ["전체", "서울", "경기", "부산", "대구", "대전", "광주"];
    const genderOptions = ["전체", "1:1", "2:1", "3:1"];

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data = await getAllMatchGroups(category);
                if (!Array.isArray(data)) {
                    console.error("응답이 배열 형식이 아닙니다:", data);
                    setGroups([]);
                    return;
                }

                const filteredByCategory = category
                    ? data.filter((g) => g.matchType === category)
                    : data;

                setGroups(filteredByCategory);
            } catch (error) {
                console.error("그룹 목록 불러오기 오류:", error);
                setGroups([]);
            }
        };

        fetchGroups();
    }, [category]);

    // 필터 적용
    useEffect(() => {
        let filtered = [...groups];

        if (region !== "전체") {
            filtered = filtered.filter((g) => g.location?.includes(region));
        }

        if (genderRatio !== "전체") {
            filtered = filtered.filter((g) => g.genderRatio === genderRatio);
        }

        if (selectedDate) {
            filtered = filtered.filter((g) =>
                g.schedule?.startsWith(selectedDate)
            );
        }

        setFilteredGroups(filtered);
    }, [groups, region, genderRatio, selectedDate]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
                {category === "screen" ? "스크린 골프 매칭" : "필드 골프 매칭"}
            </h1>

            {/* 필터 UI */}
            <div className="flex flex-wrap gap-4 mb-6 justify-center items-center">
                <select
                    className="p-2 border rounded"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                >
                    {regionOptions.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>

                <select
                    className="p-2 border rounded"
                    value={genderRatio}
                    onChange={(e) => setGenderRatio(e.target.value)}
                >
                    {genderOptions.map((g) => (
                        <option key={g} value={g}>
                            성비: {g}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    className="p-2 border rounded"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            {/* 그룹 목록 */}
            {filteredGroups.length === 0 ? (
                <p className="text-gray-500 text-center">조건에 맞는 그룹이 없습니다.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredGroups.map((group, index) => (
                        <MatchGroupCard key={group.matchGroupId || index} group={group} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchGroupList;