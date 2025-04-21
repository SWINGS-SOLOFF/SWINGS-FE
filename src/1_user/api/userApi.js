// src/1_user/api/auth.js
import axios from "./axiosInstance";

/**
 * 로그인 API 요청 함수
 * @param {{ username: string, password: string }} formData
 * @returns {Promise<string>} accessToken
 */
export async function loginRequest(formData) {
  try {
    const response = await axios.post("/auth/login", formData);
    const data = response.data;

    if (!data.accessToken) {
      throw new Error("토큰을 받지 못했습니다.");
    }

    return data.accessToken;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "로그인 실패";
    throw new Error(message);
  }
}

// 아이디 중복 확인
export const checkUsername = async (username) => {
  const response = await axios.get(
    `/users/check-username?username=${username}`
  );
  return response.data.exists;
};

// 회원가입 요청
export const signupUser = async (formData) => {
  const response = await axios.post("/users/signup", {
    ...formData,
    role: formData.role || "player",
  });
  return response.data;
};

//마이페이지 정보 불러오기
export const fetchUserData = async () => {
  const response = await axios.get("/users/me");
  return response.data;
};

//마이페이지 정보 수정하기
export const updateUserInfo = async (username, updatedFields) => {
  const response = await axios.patch(`/users/${username}`, updatedFields);
  return response.data;
};

// 프로필 이미지 가져오기
export const getProfileImageUrl = (filename) => {
  if (!filename) return null;
  const baseUrl =
    import.meta.env.VITE_API_BASE || "http://localhost:8090/swings";
  return `${baseUrl}/users/me/profile-image/${filename}`;
};

// 프로필 이미지 수정
export const updateProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.patch("/users/me/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.status !== 200) {
    throw new Error("이미지 업로드 실패");
  }

  return response.data;
};

/**
 * 비밀번호 변경 요청
 * @param {string} username
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const changePassword = async (username, newPassword) => {
  await axios.patch(`/users/${username}`, { password: newPassword });
};

//회원탈퇴 + 비번 확인 요청
export const deleteUserWithPassword = async (password) => {
  const response = await axios.post("/users/delete/me", {
    password,
  });
  return response.data;
};

//  내 포인트 잔액 조회
export const getPointBalance = async () => {
  const response = await axios.get("/users/me/point");
  return response.data;
};

//  내 포인트 사용 내역 조회
export const getPointHistory = async () => {
  const response = await axios.get("/users/me/pointslog");
  return response.data;
};

//  포인트 충전
export const chargePoint = async (amount, description = "하트 충전") => {
  const response = await axios.post("/users/me/points/charge", null, {
    params: { amount, description },
  });
  return response.data;
};

//  포인트 사용
export const usePoint = async (amount, description = "하트 사용") => {
  const response = await axios.post("/users/me/points/use", null, {
    params: { amount, description },
  });
  return response.data;
};

//비밀번호 재설정 요청
export const resetPassword = (data) => {
  return axios.post("/users/reset-password", data); // username + email 포함된 객체
};

//구글 로그인
export const googleLoginRequest = async (accessToken) => {
  const response = await axios.post("/auth/oauth/google", {
    accessToken, // ✅ key 이름 수정
  });
  return response.data;
};

//-관리자 페이지-
// 전체 유저 목록 조회
export const fetchAllUsers = async () => {
  const response = await axios.get("/admin/users");
  return response.data;
};

// 특정 유저 정보 조회 (관리자 또는 본인용)
export const getUserByUsername = async (username) => {
  const response = await axios.get(`/admin/users/${username}`);
  return response.data;
};

// 유저 삭제
export const deleteUserByAdmin = async (username) => {
  const response = await axios.delete(`/admin/users/${username}/delete`);
  return response.data;
};

// 역할 변경
export const updateUserRole = async (username, newRole) => {
  const response = await axios.patch(`/admin/users/${username}/role`, {
    role: newRole,
  });
  return response.data;
};
