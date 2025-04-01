// src/1_user/pages/AuthScreen.jsx
import { useNavigate } from "react-router-dom";

export default function AuthScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-12">
      <div className="text-4xl font-bold text-blue-800">SWINGS</div>
      <div className="flex space-x-6">
        <button
          onClick={() => navigate("/login")}
          className="w-36 h-16 bg-green-600 text-white rounded-xl text-xl shadow hover:bg-green-700"
        >
          로그인
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="w-36 h-16 bg-gray-300 text-black rounded-xl text-xl shadow hover:bg-gray-400"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
