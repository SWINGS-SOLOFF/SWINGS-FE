// src/1_user/pages/TossFail.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function TossFail() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/swings/shop");
    }, 3000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-center px-6">
      <XCircle className="text-red-500 w-20 h-20 mb-4 animate-pulse" />
      <h1 className="text-3xl font-bold text-red-600 mb-2">결제 실패 😢</h1>
      <p className="text-lg text-gray-700">
        문제가 발생했습니다. 다시 시도해 주세요.
      </p>
      <p className="mt-2 text-sm text-gray-400">
        3초 후 상점으로 이동합니다...
      </p>
    </div>
  );
}
