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
