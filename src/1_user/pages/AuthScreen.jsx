// src/1_user/pages/AuthScreen.jsx
import { useState } from "react";
import Login from "./Login"; // 기존 로그인 컴포넌트
import AnimatedSignupForm from "../components/AnimatedSignupForm";
import { signupUser } from "../api/userApi";

export default function AuthScreen() {
  const [mode, setMode] = useState(null); // 'login' | 'signup' | null

  const handleSignup = async (formData) => {
    await signupUser(formData);
  };

  if (mode === "login") return <Login />;
  if (mode === "signup") return <AnimatedSignupForm submitForm={handleSignup} />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-12">
      <div className="text-4xl font-bold text-blue-800">SWINGS</div>
      <div className="flex space-x-6">
        <button
          onClick={() => setMode("login")}
          className="w-36 h-16 bg-green-600 text-white rounded-xl text-xl shadow hover:bg-green-700"
        >
          로그인
        </button>
        <button
          onClick={() => setMode("signup")}
          className="w-36 h-16 bg-gray-300 text-black rounded-xl text-xl shadow hover:bg-gray-400"
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
