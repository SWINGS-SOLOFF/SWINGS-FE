import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createMatchGroup } from "../api/matchGroupApi.js";

const MatchGroupCreate = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [groupData, setGroupData] = useState({
        groupName: "",
        description: "",
        maxParticipants: 10,
        currentParticipants: 1,
        ageRange: "20-40",
        genderRatio: "1:1",
        location: "",
        schedule: "",
        playStyle: "casual",
        recruitmentDeadline: "",
        skillLevel: "상관없음",
        status: "모집중",
        matchType: "screen",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGroupData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!groupData.groupName.trim()) {
            setError("방 이름을 입력하세요.");
            return;
        }
        if (!groupData.description.trim()) {
            setError("방 설명을 입력하세요.");
            return;
        }
        if (!groupData.schedule) {
            setError("경기 일정을 입력하세요.");
            return;
        }

        try {
            setLoading(true);
            await createMatchGroup({ ...groupData });
            alert("그룹이 생성되었습니다!");
            navigate("/swings/matchgroup");
        } catch (error) {
            console.error("그룹 생성 실패:", error);
            setError("그룹 생성 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white px-4">
            <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">그룹 생성</h2>
                {error && <p className="text-red-500 mb-4 text-center text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4 text-gray-800">
                    <input
                        type="text"
                        name="groupName"
                        placeholder="그룹명"
                        value={groupData.groupName}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                    />
                    <textarea
                        name="description"
                        placeholder="설명"
                        value={groupData.description}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="골프장 장소"
                        value={groupData.location}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                    />
                    <input
                        type="datetime-local"
                        name="schedule"
                        value={groupData.schedule}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                    />
                    <input
                        type="number"
                        name="maxParticipants"
                        placeholder="최대 인원"
                        value={groupData.maxParticipants}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                    />
                    <input
                        type="number"
                        name="currentParticipants"
                        placeholder="현재 참가자 수"
                        value={groupData.currentParticipants}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                    />
                    <input
                        type="text"
                        name="genderRatio"
                        placeholder="남녀 성비 (예: 1:1, 2:1)"
                        value={groupData.genderRatio}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                    />
                    <input
                        type="text"
                        name="ageRange"
                        placeholder="연령대 (예: 20-30)"
                        value={groupData.ageRange}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                    />
                    <select
                        name="playStyle"
                        value={groupData.playStyle}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                    >
                        <option value="casual">캐주얼</option>
                        <option value="competitive">경쟁적</option>
                    </select>
                    <select
                        name="skillLevel"
                        value={groupData.skillLevel}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                    >
                        <option value="초급">초급</option>
                        <option value="중급">중급</option>
                        <option value="고급">고급</option>
                        <option value="상관없음">상관없음</option>
                    </select>
                    <select
                        name="matchType"
                        value={groupData.matchType}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                    >
                        <option value="screen">스크린</option>
                        <option value="field">필드</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition"
                    >
                        {loading ? "생성 중..." : "그룹 생성"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MatchGroupCreate;
