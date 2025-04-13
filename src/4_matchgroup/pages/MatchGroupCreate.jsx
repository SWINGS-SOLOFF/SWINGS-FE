import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMatchGroup } from "../api/matchGroupApi";
import { openKakaoPostcode } from "../utils/openKakaoPostcode";
import { loadKakaoMapScript } from "../utils/loadKakaoMapScript";

const MatchGroupCreate = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [groupData, setGroupData] = useState({
        groupName: "",
        description: "",
        maxParticipants: 4,
        currentParticipants: 1,
        ageRange: "20-30",
        genderRatio: "1:1",
        location: "",
        latitude: null,
        longitude: null,
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

    const handleAddressSearch = async () => {
        try {
            await loadKakaoMapScript();
            openKakaoPostcode((data) => {
                setGroupData((prev) => ({
                    ...prev,
                    location: data.roadAddress || data.address,
                }));
            });
        } catch (e) {
            alert("카카오 스크립트 로드 실패");
            console.error(e);
        }
    };

    useEffect(() => {
        if (!groupData.location) return;

        const loadMap = async () => {
            try {
                await loadKakaoMapScript();
                const { kakao } = window;
                if (!kakao || !kakao.maps) return;

                const geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch(groupData.location, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        const map = new kakao.maps.Map(document.getElementById("map"), {
                            center: coords,
                            level: 3,
                        });

                        new kakao.maps.Marker({ map, position: coords });

                        setGroupData((prev) => ({
                            ...prev,
                            latitude: parseFloat(result[0].y),
                            longitude: parseFloat(result[0].x),
                        }));
                    }
                });
            } catch (e) {
                console.error("지도 로드 실패:", e);
            }
        };

        loadMap();
    }, [groupData.location]);

    return (
        <div className="min-h-screen px-4 py-6 bg-white">
            <div className="max-w-md mx-auto">
                <h2 className="text-xl font-bold text-center mb-4">⛳ 그룹 만들기</h2>
                {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 텍스트 입력 */}
                    <input name="groupName" placeholder="방 제목" value={groupData.groupName} onChange={handleChange}
                           className="w-full p-3 border rounded-xl bg-gray-50" />
                    <textarea name="description" placeholder="방 설명" value={groupData.description} onChange={handleChange}
                              className="w-full p-3 border rounded-xl bg-gray-50" />
                    <input name="schedule" type="datetime-local" value={groupData.schedule} onChange={handleChange}
                           className="w-full p-3 border rounded-xl bg-gray-50" />

                    {/* 주소 검색 */}
                    <div className="flex gap-2">
                        <input type="text" name="location" value={groupData.location} placeholder="골프장 주소" readOnly
                               className="w-full p-3 border rounded-xl bg-gray-50" />
                        <button type="button" onClick={handleAddressSearch}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm">주소 검색</button>
                    </div>

                    {/* 지도 미리보기 */}
                    {groupData.location && (
                        <div className="mt-4">
                            <h3 className="text-sm mb-2 text-gray-700">📍 지도 미리보기</h3>
                            <div id="map" className="w-full h-60 rounded-xl border" />
                        </div>
                    )}

                    {/* 선택 필드 */}
                    <div className="grid grid-cols-2 gap-3">
                        <select name="genderRatio" value={groupData.genderRatio} onChange={handleChange}
                                className="p-3 border rounded-xl bg-white">
                            <option value="1:1">성비 1:1</option>
                            <option value="2:1">남초 (2:1)</option>
                            <option value="1:2">여초 (1:2)</option>
                            <option value="상관없음">상관없음</option>
                        </select>

                        <select name="ageRange" value={groupData.ageRange} onChange={handleChange}
                                className="p-3 border rounded-xl bg-white">
                            <option value="10-20">10~20</option>
                            <option value="20-30">20~30</option>
                            <option value="30-40">30~40</option>
                            <option value="상관없음">상관없음</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <select name="maxParticipants" value={groupData.maxParticipants} onChange={handleChange}
                                className="p-3 border rounded-xl bg-white">
                            {[...Array(9)].map((_, i) => (
                                <option key={i + 2} value={i + 2}>{i + 2}명</option>
                            ))}
                        </select>

                        <input type="number" name="currentParticipants" value={groupData.currentParticipants} readOnly
                               className="p-3 border rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <select name="playStyle" value={groupData.playStyle} onChange={handleChange}
                                className="p-3 border rounded-xl bg-white">
                            <option value="casual">캐주얼</option>
                            <option value="competitive">경쟁적</option>
                        </select>

                        <select name="skillLevel" value={groupData.skillLevel} onChange={handleChange}
                                className="p-3 border rounded-xl bg-white">
                            <option value="초급">초급</option>
                            <option value="중급">중급</option>
                            <option value="고급">고급</option>
                            <option value="상관없음">상관없음</option>
                        </select>
                    </div>

                    <select name="matchType" value={groupData.matchType} onChange={handleChange}
                            className="w-full p-3 border rounded-xl bg-white">
                        <option value="screen">스크린</option>
                        <option value="field">필드</option>
                    </select>

                    <button type="submit" disabled={loading}
                            className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800">
                        {loading ? "생성 중..." : "그룹 만들기"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MatchGroupCreate;