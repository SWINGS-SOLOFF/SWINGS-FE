import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../api/userApi";
import { saveToken } from "../utils/userUtils";
import { motion } from "framer-motion";
import { LinkIcon } from "@heroicons/react/24/outline";

export default function Login() {
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
      navigate("/swings/home");
    } catch (error) {
      setErrorMessage(error.message);
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
        <p className="text-gray-500">골프 동반자를 찾아보세요</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm mb-1 text-gray-700">아이디</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
              placeholder="your_id"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-700">비밀번호</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <div className="text-right text-sm mt-1">
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={() => alert("비밀번호 찾기 기능은 준비 중입니다.")}
              >
                비밀번호 찾기
              </button>
            </div>
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

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-3 text-gray-400 text-sm">또는</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <button
          onClick={() => alert("구글 로그인은 준비 중입니다.")}
          className="w-full flex justify-center items-center gap-2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100"
        >
          <LinkIcon className="w-5 h-5 text-gray-500" />
          <span>Google로 로그인</span>
        </button>

        <button
          onClick={() => navigate("/swings/signup")}
          className="w-full flex justify-center items-center bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg"
        >
          회원가입
        </button>
      </motion.div>
    </div>
  );
}
