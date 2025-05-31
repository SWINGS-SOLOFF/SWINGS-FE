import axios from "axios";
import { getToken } from "../utils/userUtils"; // 세션에서 토큰 가져오기

const instance = axios.create({
  baseURL: "http://localhost:8090/swings",
  timeout: 5000, // 요청 타임아웃 설정
});

// 요청 인터셉터 – 요청 전에 토큰 자동 삽입
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

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      console.warn("인증 실패. 메인 페이지로 이동합니다.");
      window.location.href = "/swings";
    }

    console.error("API ERROR:", response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;
