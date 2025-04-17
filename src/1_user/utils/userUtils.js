// src/1_user/utils/userUtils.js
import { checkUsername } from "../api/userApi";

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

// 비밀번호 유효성 검사 및 일치 검사
export const validatePasswordMatch = (pwd1, pwd2) => {
  if (pwd1 !== pwd2) {
    return "비밀번호가 일치하지 않습니다";
  }

  if (pwd1.length < 3) {
    return "최소 4자 이상이어야 합니다";
  }

  if (!/[a-z]/.test(pwd1)) {
    return "소문자가 최소 1자 이상 포함되어야 합니다";
  }

  if (!/[0-9]/.test(pwd1)) {
    return "숫자가 최소 1자 이상 포함되어야 합니다";
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]~`+=/]/.test(pwd1)) {
    return "특수문자가 최소 1자 이상 포함되어야 합니다";
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

//회원가입 시 받을 formData 구조

export const formDataPerStep = [
  {
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
  },
  { gender: "", birthDate: "", phonenumber: "" },
  { mbti: "", job: "", activityRegion: "" },
  { hobbies: "", religion: "", smoking: "", drinking: "" },
  { golfSkill: "", introduce: "" },
];

//현재 step에서 비어 있는 필드가 있는지 확인

export const hasEmptyFields = (step, formData) => {
  const currentStepFields = Object.keys(formDataPerStep[step]);
  return currentStepFields.some(
    (field) => !formData[field] || formData[field].trim() === ""
  );
};

//아이디 중복 확인
export const handleUsernameCheckLogic = async (username, setMessage) => {
  if (!username) {
    setMessage("아이디를 입력해주세요.");
    return;
  }
  const exists = await checkUsername(username);
  setMessage(
    exists ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다."
  );
};

//Google 로그인 상태로부터 초기값 설정
export const prefillFromOAuthState = (location, formData, updateData) => {
  const state = location.state;
  if (state?.email && !formData.email) {
    updateData({ email: state.email });
  }
  if (state?.name && !formData.name) {
    updateData({ name: state.name });
  }
};

//회원가입 mbti, region 설정정
export const mbtiOptions = [
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
].map((type) => ({ label: type, value: type }));

export const regionOptions = [
  { label: "서울", value: "SEOUL" },
  { label: "부산", value: "BUSAN" },
  { label: "대구", value: "DAEGU" },
  { label: "인천", value: "INCHEON" },
  { label: "광주", value: "GWANGJU" },
  { label: "대전", value: "DAEJEON" },
  { label: "울산", value: "ULSAN" },
  { label: "세종", value: "SEJONG" },
  { label: "경기", value: "GYEONGGI" },
  { label: "강원", value: "GANGWON" },
  { label: "충북", value: "CHUNGBUK" },
  { label: "충남", value: "CHUNGNAM" },
  { label: "전북", value: "JEONBUK" },
  { label: "전남", value: "JEONNAM" },
  { label: "경북", value: "GYEONGBUK" },
  { label: "경남", value: "GYEONGNAM" },
  { label: "제주", value: "JEJU" },
];

//회원가입 디자인인
export const customSelectStyles = {
  container: (base) => ({
    ...base,
    width: "100%",
  }),
  control: (base) => ({
    ...base,
    paddingTop: "2px",
    paddingBottom: "2px",
    paddingLeft: "12px",
    paddingRight: "12px",
    borderColor: "#D1D5DB", // Tailwind border-gray-300
    borderRadius: "0.5rem",
    minHeight: "42px",
    boxShadow: "none",
  }),
  menu: (base) => ({
    ...base,
    maxHeight: "150px",
    overflowY: "auto",
    color: "#000",
    zIndex: 9999,
  }),
};
