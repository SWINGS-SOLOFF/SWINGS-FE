import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const StartPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        로그인 또는 회원가입
      </h1>

      {/* 로그인/회원가입 전환 버튼 */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setShowLogin(true)}
          className={`px-4 py-2 rounded-lg font-medium ${
            showLogin ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          로그인
        </button>
        <button
          onClick={() => setShowLogin(false)}
          className={`px-4 py-2 rounded-lg font-medium ${
            !showLogin ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          회원가입
        </button>
      </div>

      {/* 로그인 또는 회원가입 폼 렌더링 */}
      {showLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
};

export default StartPage;
