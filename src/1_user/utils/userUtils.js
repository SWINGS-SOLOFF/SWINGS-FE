// src/1_user/utils/token.js

export function saveToken(token) {
  sessionStorage.setItem("token", token);
}

export function getToken() {
  return sessionStorage.getItem("token");
}

export function removeToken() {
  sessionStorage.removeItem("token");
}

//회원가입 이미지 변환환
export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

//마이페이지 정보 수정
export const getUpdatedFields = (original, edited) => {
  const updated = {};
  for (const key in edited) {
    if (edited[key] !== original[key]) {
      updated[key] = edited[key];
    }
  }
  return updated;
};

//마이페이지 비밀번호 수정 
/**
 * 두 비밀번호가 같은지 검사
 * @param {string} pwd1
 * @param {string} pwd2
 * @returns {string|null} 오류 메시지 or null
 */
export const validatePasswordMatch = (pwd1, pwd2) => {
  if (pwd1 !== pwd2) {
    return "비밀번호가 일치하지 않습니다.";
  }
  if (pwd1.length < 6) {
    return "비밀번호는 최소 6자 이상이어야 합니다.";
  }
  return null;
};

//지역
export const regionMap = {
  "서울특별시": "SEOUL",
  "부산광역시": "BUSAN",
  "대구광역시": "DAEGU",
  "인천광역시": "INCHEON",
  "광주광역시": "GWANGJU",
  "대전광역시": "DAEJEON",
  "울산광역시": "ULSAN",
  "세종특별자치시": "SEJONG",
  "경기도": "GYEONGGI",
  "강원특별자치도": "GANGWON",
  "충청북도": "CHUNGBUK",
  "충청남도": "CHUNGNAM",
  "전라북도": "JEONBUK",
  "전라남도": "JEONNAM",
  "경상북도": "GYEONGBUK",
  "경상남도": "GYEONGNAM",
  "제주특별자치도": "JEJU",
};

export const getEnumRegion = (korName) => regionMap[korName];
export const getAllRegionNames = () => Object.keys(regionMap);

