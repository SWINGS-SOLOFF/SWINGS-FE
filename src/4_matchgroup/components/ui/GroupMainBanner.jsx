import { useEffect, useState } from "react";
import banner1 from "../../../assets/golf-banner-1.png";
import banner2 from "../../../assets/golf-banner-2.png";

const banners = [banner1, banner2];

export default function GroupMainBanner() {
    const [currentBanner, setCurrentBanner] = useState(0);

    const handleDotClick = (idx) => setCurrentBanner(idx);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner((prev) => (prev + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-12 px-4 pt-[32px]">
            <div className="relative w-full overflow-hidden rounded-xl shadow-sm h-[250px]">
                {/* 배너 이미지 */}
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentBanner * 100}%)` }}
                >
                    {banners.map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`배너 ${idx + 1}`}
                            className="w-full flex-shrink-0 object-cover h-[250px]"
                        />
                    ))}
                </div>

                {/* 하단 도트 네비게이션 */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleDotClick(idx)}
                            className={`w-2 h-2 rounded-full transition ${
                                idx === currentBanner ? "bg-white" : "bg-gray-400"
                            }`}
                        ></button>
                    ))}
                </div>
            </div>
        </div>
    );
}
