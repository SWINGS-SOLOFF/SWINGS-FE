// src/1_user/pages/LoginCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../api/userApi";
import { saveToken } from "../utils/userUtils";
import AnimatedSignupForm from "../components/AnimatedSignupForm";
import { signupUser } from "../api/userApi";

export default function LoginCard() {
  const [tab, setTab] = useState("login");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const accessToken = await loginRequest(formData);
      login(accessToken);
      saveToken(accessToken);
      alert("로그인 성공!");
      navigate("/home");
    } catch (error) {
      console.error("로그인 실패:", error);
      setErrorMessage(error.message);
    }
  };

  const handleSubmitSignup = async (formData) => {
    await signupUser(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow p-6 w-80 border border-green-300">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setTab("login")}
            className={`w-1/2 py-2 rounded-t-lg font-bold ${
              tab === "login"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-black"
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`w-1/2 py-2 rounded-t-lg font-bold ${
              tab === "signup"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-black"
            }`}
          >
            회원가입
          </button>
        </div>

        {tab === "login" ? (
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <div className="text-center text-lg font-bold text-gray-700">
              로그인
            </div>
            <div>
              <label className="block mb-1">아이디</label>
              <input
                className="w-full border rounded p-2  text-black"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="아이디를 입력하세요"
              />
            </div>
            <div>
              <label className="block mb-1">비밀번호</label>
              <input
                className="w-full border rounded p-2  text-black"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <label>
                <input type="checkbox" className="mr-1" /> 로그인 상태 유지
              </label>
              <a href="#" className="text-green-500 hover:underline">
                비밀번호 찾기
              </a>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              로그인
            </button>
          </form>
        ) : (
          <AnimatedSignupForm submitForm={handleSubmitSignup} />
        )}
      </div>
    </div>
  );
}
