// src/1_user/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../api/userApi.js";
import { saveToken } from "../utils/userUtils.js";
import { motion } from "framer-motion";

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
      navigate("/home");
      window.location.reload();
    } catch (error) {
      console.error("로그인 실패:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-opacity-90 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative"
      >
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-gray-500 hover:text-black"
        >
          ← 뒤로가기
        </button>
        <h2 className="text-xl font-bold text-center mb-4">로그인</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            아이디:
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              className="w-full border p-2 rounded text-black"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </label>

          <label className="block">
            비밀번호:
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full border p-2 rounded text-black"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </label>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            로그인
          </button>
        </form>
      </motion.div>
    </div>
  );
}
