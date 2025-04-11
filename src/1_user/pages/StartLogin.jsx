// src/1_user/pages/StartLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest, googleLoginRequest } from "../api/userApi";
import { saveToken } from "../utils/userUtils";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

export default function StartLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: localStorage.getItem("savedUsername") || "",
    password: "",
  });

  const [saveId, setSaveId] = useState(!!localStorage.getItem("savedUsername"));
  const [errorMessage, setErrorMessage] = useState("");

  // 🔑 일반 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const accessToken = await loginRequest(formData);
      login(accessToken);
      saveToken(accessToken);

      const decoded = jwtDecode(accessToken);
      const role = decoded.role;

      if (saveId) localStorage.setItem("savedUsername", formData.username);
      else localStorage.removeItem("savedUsername");

      alert("로그인 성공!");
      navigate(role === "admin" ? "/swings/admin" : "/swings/feed");
    } catch (error) {
      setErrorMessage(error.message || "로그인 중 오류 발생");
    }
  };

  // 🔑 Google 로그인 처리
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const result = await googleLoginRequest(idToken);

      if (result.accessToken) {
        login(result.accessToken);
        saveToken(result.accessToken);
        const decoded = jwtDecode(result.accessToken);
        navigate(decoded.role === "admin" ? "/swings/admin" : "/swings/feed");
      } else if (result.isNew) {
        navigate("/swings/signup", {
          state: { email: result.email, name: result.name },
        });
      }
    } catch (err) {
      console.error("Google 로그인 실패", err);
      setErrorMessage("Google 로그인 실패");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm space-y-6 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800">SWINGS</h1>
        <p className="text-gray-500 animate-bounce">나랑 골프치러 갈래?</p>

        {/* 🔑 일반 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="text"
            placeholder="아이디"
            className="w-full border p-2 rounded text-black"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full border p-2 rounded text-black"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={saveId}
                onChange={(e) => setSaveId(e.target.checked)}
                className="mr-2"
              />
              아이디 저장
            </label>
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => navigate("/swings/find-password")}
            >
              비밀번호 찾기
            </button>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg"
          >
            로그인
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-gray-400 text-sm">또는</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        {/* 구글 로그인 버튼 - 다른 버튼들과 사이즈 통일 */}
        <div className="w-full">
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrorMessage("Google 로그인 실패")}
              size="large"
              width="100%" // 혹시나 지원되는 경우
            />
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <button
          onClick={() => navigate("/swings/signup")}
          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg"
        >
          회원가입
        </button>
      </motion.div>
    </div>
  );
}
