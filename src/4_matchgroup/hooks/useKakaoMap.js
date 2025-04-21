import { useEffect } from "react";
import { openKakaoPostcode } from "../utils/openKakaoPostcode.js";
import { loadKakaoMapScript } from "../utils/loadKakaoMapScript.js";

export function useKakaoMap(groupData, setGroupData) {
    // 주소 검색 시 호출
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

    // 지도 로딩
    useEffect(() => {
        if (!groupData.location) return;

        const loadMap = async () => {
            try {
                await loadKakaoMapScript();
                const { kakao } = window;
                if (!kakao || !kakao.maps) return;

                const mapContainer = document.getElementById("map");

                if (!mapContainer) {
                    console.warn("🛑 지도 DOM이 존재하지 않아 kakao map 생성을 생략합니다.");
                    return;
                }

                const geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch(groupData.location, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

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
                console.error("지도 로드 실패:", e);
            }
        };

        // 💡 약간의 지연을 주어 DOM이 렌더된 이후 실행
        setTimeout(loadMap, 100);
    }, [groupData.location]);

    return { handleAddressSearch };
}