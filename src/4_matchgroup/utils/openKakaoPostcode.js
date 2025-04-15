import { loadKakaoMapScript } from "./loadKakaoMapScript.js";

// 주소 검색 스크립트 로드 함수 추가
const loadPostcodeScript = () => {
    return new Promise((resolve, reject) => {
        if (window.daum && window.daum.Postcode) {
            resolve(); // 이미 로드됨
            return;
        }

        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.onload = () => {
            console.log("📦 daum.Postcode 스크립트 로드 완료");
            resolve();
        };
        script.onerror = (e) => {
            console.error("❌ 주소 검색 스크립트 로드 실패:", e);
            reject(e);
        };
        document.head.appendChild(script);
    });
};

export const openKakaoPostcode = async (onComplete) => {
    await loadKakaoMapScript();       // 지도 SDK 로딩
    await loadPostcodeScript();       // 주소 검색용 스크립트 로딩

    if (!window.daum || !window.daum.Postcode) {
        alert("카카오 주소 검색 스크립트가 아직 로드되지 않았습니다.");
        return;
    }

    new window.daum.Postcode({ oncomplete: onComplete }).open();
};