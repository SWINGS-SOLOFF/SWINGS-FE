import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMatchGroup } from "../api/matchGroupApi";
import { useKakaoMap } from "../hooks/useKakaoMap";
import ParticipantCounters from "../components/ParticipantCounter.jsx";

const MatchGroupCreate = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [groupData, setGroupData] = useState({
        groupName: "",
        description: "",
        maxParticipants: 4,
        currentParticipants: 1,
        ageRange: "20대",
        femaleLimit: 2,
        maleLimit: 2,
        location: "",
        latitude: null,
        longitude: null,
        schedule: "",
        playStyle: "casual",
        recruitmentDeadline: "",
        skillLevel: "초급",
        status: "모집중",
        matchType: "screen",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGroupData((prev) => ({ ...prev, [name]: value }));
    };

    const updateFemale = (val) => {
        if (val + groupData.maleLimit <= groupData.maxParticipants) {
            setGroupData((prev) => ({ ...prev, femaleLimit: val }));
        }
    };

    const updateMale = (val) => {
        if (val + groupData.femaleLimit <= groupData.maxParticipants) {
            setGroupData((prev) => ({ ...prev, maleLimit: val }));
        }
    };

    const { handleAddressSearch } = useKakaoMap(groupData, setGroupData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const totalGender = groupData.femaleLimit + groupData.maleLimit;

        if (totalGender !== groupData.maxParticipants) {
            return setError("남녀 인원이 최대 인원과 일치해야 합니다.");
        }

        if (!groupData.groupName.trim()) return setError("방 제목을 입력하세요.");
        if (!groupData.description.trim()) return setError("방 설명을 입력하세요.");
        if (!groupData.schedule) return setError("일정을 선택하세요.");
        if (!groupData.latitude || !groupData.longitude) return setError("주소 검색을 완료해주세요.");

        try {
            setLoading(true);
            await createMatchGroup(groupData);
            alert("그룹 생성 완료!");
            navigate("/swings/matchgroup");
        } catch (error) {
            console.error("그룹 생성 실패:", error);
            setError("그룹 생성 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen px-4 py-8">
            <div className="bg-white max-w-xl mx-auto rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-bold text-center text-black-700">그룹 만들기</h2>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="groupName"
                        placeholder="방 제목"
                        value={groupData.groupName}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-xl bg-gray-50"
                    />
                    <textarea
                        name="description"
                        placeholder="방 설명"
                        value={groupData.description}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-xl bg-gray-50"
                    />
                    <input
                        name="schedule"
                        type="datetime-local"
                        value={groupData.schedule}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-xl bg-gray-50"
                    />

                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="location"
                            value={groupData.location}
                            placeholder="골프장 주소"
                            readOnly
                            className="w-full p-2 border rounded-xl bg-gray-50"
                        />
                        <button
                            type="button"
                            onClick={handleAddressSearch}
                            className="w-full bg-custom-pink text-white font-bold py-2 px-4 rounded-xl hover:bg-pink-400 transition"
                        >
                            주소 검색
                        </button>
                    </div>

                    {groupData.location && (
                        <div>
                            <p className="text-sm text-gray-600 mb-1">지도 미리보기</p>
                            <div id="map" className="w-full h-56 border rounded-xl" />
                        </div>
                    )}

                    <ParticipantCounters
                        max={groupData.maxParticipants}
                        female={groupData.femaleLimit}
                        male={groupData.maleLimit}
                        onMaxChange={(val) => setGroupData((prev) => ({ ...prev, maxParticipants: val }))}
                        onFemaleChange={updateFemale}
                        onMaleChange={updateMale}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 mb-1">연령대</label>
                            <select name="ageRange" value={groupData.ageRange} onChange={handleChange} className="p-2 border rounded-md">
                                <option value="20대">20대</option>
                                <option value="30대">30대</option>
                                <option value="40대">40대</option>
                                <option value="상관없음">상관없음</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 mb-1">플레이 스타일</label>
                            <select name="playStyle" value={groupData.playStyle} onChange={handleChange} className="p-2 border rounded-md">
                                <option value="casual">캐주얼</option>
                                <option value="competitive">경쟁적</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 mb-1">실력</label>
                            <select name="skillLevel" value={groupData.skillLevel} onChange={handleChange} className="p-2 border rounded-md">
                                <option value="초급">초급</option>
                                <option value="중급">중급</option>
                                <option value="고급">고급</option>
                                <option value="상관없음">상관없음</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-600 mb-1">매칭 종류</label>
                            <select name="matchType" value={groupData.matchType} onChange={handleChange} className="p-2 border rounded-md">
                                <option value="screen">스크린</option>
                                <option value="field">필드</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-custom-pink text-white font-bold py-3 px-4 rounded-xl hover:bg-pink-400 transition"
                    >
                        {loading ? "생성 중..." : "그룹 만들기"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MatchGroupCreate;