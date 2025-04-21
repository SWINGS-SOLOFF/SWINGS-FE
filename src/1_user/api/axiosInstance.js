import axios from "axios";
import { getToken } from "../utils/userUtils"; // 세션에서 토큰 가져오기

const instance = axios.create({
  baseURL: "http://localhost:8090/swings",
  timeout: 5000, // 요청 타임아웃 설정
});

// ✅ 요청 인터셉터 – 요청 전에 토큰 자동 삽입
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터 – 에러 공통 처리
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("🔥 API ERROR:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;
