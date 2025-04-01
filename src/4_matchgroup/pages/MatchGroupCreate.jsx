import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {createMatchGroup} from "../api/matchGroupApi.js";

const MatchGroupCreate = () => {
    const navigate = useNavigate();  // 페이지 이동을 위한 navigate 함수
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [groupData, setGroupData] = useState({
        groupName: "",  // 그룹명
        description: "",  // 그룹 설명
        maxParticipants: 10,  // 최대 참가자 수
        currentParticipants: 1, // 현재 참가자 수
        ageRange: "20-40",  // 연령대
        genderRatio: "1:1",  // 성별 비
        location: "",  // 골프장 위치
        schedule: "",  // 경기 일정
        playStyle: "casual",  // 플레이 스타일(캐쥬얼 | 경쟁적)
        recruitmentDeadline: "",  // 모집 마감 일정
        skillLevel: "상관없음", // 실력 (초급 | 중급 | 고급 | 상관없음)
        status: "모집중",  // 모집 상태
        matchType: "screen", // 추가된 필드 (스크린 / 필드 선택)
    });


    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;

        setGroupData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 필수값 검사
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
            await createMatchGroup({
                ...groupData,
            });
            alert("그룹이 생성되었습니다!");
            navigate("/matchgroup");
        } catch (error) {
            console.error("그룹 생성 실패:", error);
            setError("그룹 생성 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100">
            <div className="w-full max-w-lg p-6 bg-white shadow-2xl rounded-2xl border border-pink-300">
                <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">💕 그룹 생성 💕</h2>
                {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="groupName"
                        placeholder="그룹명"
                        value={groupData.groupName}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <textarea
                        name="description"
                        placeholder="설명"
                        value={groupData.description}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="골프장 장소"
                        value={groupData.location}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="datetime-local"
                        name="schedule"
                        value={groupData.schedule}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="number"
                        name="maxParticipants"
                        placeholder="최대 인원"
                        value={groupData.maxParticipants}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="number"
                        name="currentParticipants"
                        placeholder="현재 참가자 수"
                        value={groupData.currentParticipants}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="text"
                        name="genderRatio"
                        placeholder="남녀 성비 (예: 1:1, 2:1)"
                        value={groupData.genderRatio}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="text"
                        name="ageRange"
                        placeholder="연령대 (예: 20-30)"
                        value={groupData.ageRange}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <select
                        name="playStyle"
                        value={groupData.playStyle}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    >
                        <option value="casual">캐주얼</option>
                        <option value="competitive">경쟁적</option>
                    </select>
                    <select
                        name="skillLevel"
                        value={groupData.skillLevel}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
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
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    >
                        <option value="screen">스크린</option>
                        <option value="field">필드</option>
                    </select>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition"
                    >
                        {loading ? "생성 중..." : "그룹 생성"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MatchGroupCreate;