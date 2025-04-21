import { useEffect } from "react";
import { loadKakaoMapScript } from "../utils/loadKakaoMapScript";

const regionCoordinates = {
    서울: { lat: 37.57, lng: 126.98 },
    부산: { lat: 35.18, lng: 129.07 },
    대구: { lat: 35.87, lng: 128.60 },
    인천: { lat: 37.46, lng: 126.70 },
    광주: { lat: 35.15, lng: 126.85 },
    대전: { lat: 36.35, lng: 127.38 },
    울산: { lat: 35.54, lng: 129.31 },
    세종: { lat: 36.48, lng: 127.28 },
    경기: { lat: 37.20, lng: 127.01 },
    강원: { lat: 37.82, lng: 128.15 },
    충북: { lat: 36.63, lng: 127.49 },
    충남: { lat: 36.30, lng: 126.80 },
    전북: { lat: 35.72, lng: 127.15 },
    전남: { lat: 34.81, lng: 126.46 },
    경북: { lat: 36.49, lng: 128.88 },
    경남: { lat: 35.32, lng: 128.21 },
    제주: { lat: 33.50, lng: 126.53 },
};

const MapRegionModal = ({ isOpen, onClose, groups, setRegion }) => {
    useEffect(() => {
        if (!isOpen) return;

        loadKakaoMapScript().then(() => {
            setTimeout(() => {
                const container = document.getElementById("map-region-container");
                if (!container) return;

                const map = new window.kakao.maps.Map(container, {
                    center: new window.kakao.maps.LatLng(36.5, 127.5),
                    level: 13,
                });

                const countByRegion = {};
                groups.forEach((g) => {
                    const region = g.location?.split(" ")[0];
                    const isOpen = !g.closed && g.participants.length < g.maxParticipants;
                    if (!region || !isOpen) return;
                    countByRegion[region] = (countByRegion[region] || 0) + 1;
                });

                Object.entries(regionCoordinates).forEach(([region, coord]) => {
                    const count = countByRegion[region] || 0;
                    const level = count >= 5 ? "highlight-heavy" : count > 0 ? "highlight" : "dimmed";
                    const content = `
                        <div class='custom-overlay ${level}'>
                            ${region}<br/><strong>${count}</strong>
                        </div>
                    `;
                    const overlay = new window.kakao.maps.CustomOverlay({
                        map,
                        position: new window.kakao.maps.LatLng(coord.lat, coord.lng),
                        content,
                        yAnchor: 0.5,
                    });

                    window.kakao.maps.event.addListener(overlay, "click", () => {
                        setRegion(region);
                        onClose();
                    });
                });

                window.kakao.maps.event.trigger(map, "resize");
            }, 0);
        });
    }, [isOpen, groups, setRegion, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl w-full max-w-3xl p-4 relative">
                <h2 className="text-lg font-bold mb-2">지역별 그룹 현황</h2>
                <div id="map-region-container" className="w-full h-[500px] rounded-lg border" />
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-black text-sm"
                >
                    ✕
                </button>
            </div>

            <style>{`
                .custom-overlay {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    font-size: 10px;
                    font-weight: 600;
                    text-align: center;
                    cursor: pointer;
                    white-space: nowrap;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
                    transition: all 0.3s;
                    opacity: 0.85;
                }
                .highlight {
                    background: #fbb6ce;
                    color: white;
                    animation: pulse 1.5s infinite;
                }
                .highlight-heavy {
                    background: #FF7E9D;
                    color: white;
                    transform: scale(1.1);
                    opacity: 0.95;
                }
                .dimmed {
                    background: #f1f5f9;
                    color: #cbd5e1;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default MapRegionModal;