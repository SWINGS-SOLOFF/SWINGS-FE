import { useEffect } from "react";
import {openKakaoPostcode} from "../utils/openKakaoPostcode.js";
import {loadKakaoMapScript} from "../utils/loadKakaoMapScript.js";

export function useKakaoMap(groupData, setGroupData) {
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

    return { handleAddressSearch };
}