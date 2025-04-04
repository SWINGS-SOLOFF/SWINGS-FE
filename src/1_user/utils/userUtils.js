// src/1_user/utils/userUtils.js

export function saveToken(token) {
  sessionStorage.setItem("token", token);
}

export function getToken() {
  return sessionStorage.getItem("token");
}

export function removeToken() {
  sessionStorage.removeItem("token");
}

// 이미지 base64 변환
export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// 객체 필드 비교
export const getUpdatedFields = (original, edited) => {
  const updated = {};
  for (const key in edited) {
    if (edited[key] !== original[key]) {
      updated[key] = edited[key];
    }
  }
  return updated;
};

// 비밀번호 일치 검사
export const validatePasswordMatch = (pwd1, pwd2) => {
  if (pwd1 !== pwd2) {
    return "비밀번호가 일치하지 않습니다.";
  }
  if (pwd1.length < 4) {
    return "비밀번호는 최소 4자 이상이어야 합니다.";
  }
  return null;
};

//날짜 형식
export function formatKoreanDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}년${month}월${day}일${hours}시${minutes}분`;
}
