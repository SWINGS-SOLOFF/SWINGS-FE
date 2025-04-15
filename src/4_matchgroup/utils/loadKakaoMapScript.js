export const loadKakaoMapScript = () => {
    const kakaoKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
    console.log("🔑 카카오 키 확인:", kakaoKey);

    // 이미 로드된 경우 즉시 resolve
    if (window.kakao && window.kakao.maps) {
        console.log("✅ kakao.maps 이미 로드됨");
        return Promise.resolve();
    }

    // 중복 스크립트 방지
    const existingScript = document.querySelector("script[src*='dapi.kakao.com']");
    if (existingScript) {
        console.warn("⚠️ 카카오 스크립트가 이미 존재함");
        return new Promise((resolve) => {
            if (window.kakao && window.kakao.maps) {
                resolve();
            } else {
                window.kakao.maps.load(resolve); // 안전 로딩
            }
        });
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => {
            console.log("✅ 스크립트 로드 완료, kakao.maps.load 호출");
            window.kakao.maps.load(resolve);
        };
        script.onerror = (e) => {
            console.error("❌ 카카오 스크립트 로드 실패:", e);
            reject(e);
        };
        document.head.appendChild(script);

        console.log("🧾 삽입된 카카오맵 SDK 주소:", script.src);
    });
};