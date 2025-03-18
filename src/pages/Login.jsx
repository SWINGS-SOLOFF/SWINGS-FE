import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8090/swings/auth/login",
        { id, password }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/swings/home");
    } catch (err) {
      setError("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">로그인</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="아이디"
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
