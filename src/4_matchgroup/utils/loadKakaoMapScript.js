export const loadKakaoMapScript = () => {
    if (window.kakao && window.kakao.maps) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const kakaoKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
        console.log("카카오 키 확인:", kakaoKey);

        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;

        script.onload = () => {
            window.kakao.maps.load(resolve);
        };

        script.onerror = (e) => {
            console.error("카카오 스크립트 로드 실패:", e);
            reject(e);
        };

        document.head.appendChild(script);

        console.log("🧾 최종 요청 주소:", script.src);

    });


};