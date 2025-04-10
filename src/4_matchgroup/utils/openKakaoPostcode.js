import {loadKakaoMapScript} from "./loadKakaoMapScript.js";

export const openKakaoPostcode = async (onComplete) => {
    await loadKakaoMapScript();

    if (!window.daum || !window.daum.Postcode) {
        alert("카카오 주소 검색 스크립트가 아직 로드되지 않았습니다.");
        return;
    }

    new window.daum.Postcode({ oncomplete: onComplete }).open();
};