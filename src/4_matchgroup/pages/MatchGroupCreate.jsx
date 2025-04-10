import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMatchGroup } from "../api/matchGroupApi";
import { openKakaoPostcode } from "../utils/openKakaoPostcode";
import {loadKakaoMapScript} from "../utils/loadKakaoMapScript.js";

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
        if (!groupData.groupName.trim()) return setError("방 이름을 입력하세요.");
        if (!groupData.description.trim()) return setError("방 설명을 입력하세요.");
        if (!groupData.schedule) return setError("경기 일정을 입력하세요.");
        if (!groupData.latitude || !groupData.longitude) return setError("골프장 좌표가 없습니다.");

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

    console.log("✅ 카카오 키 확인:", import.meta.env.VITE_KAKAO_MAP_API_KEY);

    const handleAddressSearch = async () => {
        try {
            await loadKakaoMapScript();
            openKakaoPostcode((data) => {
                setGroupData((prev) => ({
                    ...prev,
                    location: data.roadAddress || data.address,
                }));
            });
        } catch (error) {
            alert("카카오 스크립트 로드 실패");
            console.error(error);
        }
    };

    useEffect(() => {
        if (!groupData.location) return;

        const loadAndRenderMap = async () => {
            try {
                await loadKakaoMapScript();

                const { kakao } = window;
                if (!kakao || !kakao.maps) return;

                const geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch(groupData.location, function (result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        const mapContainer = document.getElementById("map");

                        const map = new kakao.maps.Map(mapContainer, {
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
                console.error("지도 렌더링 실패:", e);
            }
        };

        loadAndRenderMap();
    }, [groupData.location]);

    return (
        <div className="min-h-screen bg-white px-4 py-6">
            <div className="max-w-md mx-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">그룹 만들기</h2>
                {error && <p className="text-red-500 mb-4 text-center text-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { name: "groupName", placeholder: "방 제목", type: "text" },
                        { name: "description", placeholder: "방 설명", type: "textarea" },
                        { name: "schedule", placeholder: "일정", type: "datetime-local" },
                        { name: "maxParticipants", placeholder: "최대 인원", type: "number" },
                        { name: "currentParticipants", placeholder: "현재 인원", type: "number" },
                        { name: "genderRatio", placeholder: "성비 (예: 1:1)", type: "text" },
                        { name: "ageRange", placeholder: "연령대 (예: 20-40)", type: "text" },
                    ].map((field) =>
                        field.type === "textarea" ? (
                            <textarea
                                key={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={groupData[field.name]}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-gray-400 outline-none"
                            />
                        ) : (
                            <input
                                key={field.name}
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={groupData[field.name]}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-gray-400 outline-none"
                            />
                        )
                    )}

                    {/* 주소 검색 */}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="location"
                            placeholder="골프장 장소"
                            value={groupData.location}
                            readOnly
                            className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-gray-400 outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleAddressSearch}
                            className="whitespace-nowrap px-3 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 text-sm"
                        >
                            주소 검색
                        </button>
                    </div>

                    {/* 지도 */}
                    {groupData.location && (
                        <div className="mt-4">
                            <h3 className="text-sm text-gray-700 mb-2">선택한 골프장 위치</h3>
                            <div id="map" className="w-full h-60 rounded-xl border" />
                        </div>
                    )}

                    {/* 선택 필드 */}
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            name="playStyle"
                            value={groupData.playStyle}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-xl bg-white"
                        >
                            <option value="casual">캐주얼</option>
                            <option value="competitive">경쟁적</option>
                        </select>
                        <select
                            name="skillLevel"
                            value={groupData.skillLevel}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-xl bg-white"
                        >
                            <option value="초급">초급</option>
                            <option value="중급">중급</option>
                            <option value="고급">고급</option>
                            <option value="상관없음">상관없음</option>
                        </select>
                    </div>

                    <select
                        name="matchType"
                        value={groupData.matchType}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-xl bg-white"
                    >
                        <option value="screen">스크린</option>
                        <option value="field">필드</option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition"
                    >
                        {loading ? "생성 중..." : "방 만들기"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MatchGroupCreate;