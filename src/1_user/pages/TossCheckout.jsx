// src/1_user/pages/TossCheckout.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchUserData } from "../api/userApi";
import { requestTossPayment } from "../utils/paymentUtils";

export default function TossCheckout() {
  const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
  const [user, setUser] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [searchParams] = useSearchParams();
  const selectedCoin = parseInt(searchParams.get("coin"), 10);

  // ✅ Toss SDK 로드 확인
  useEffect(() => {
    console.log("🔄 Toss SDK 로딩 시작");
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1";
    script.async = true;
    script.onload = () => {
      console.log("✅ Toss SDK 로딩 완료");
      setSdkLoaded(true);
    };
    script.onerror = () => console.error("❌ Toss SDK 로딩 실패");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ✅ 유저 정보 가져오기
  useEffect(() => {
    fetchUserData()
      .then((data) => {
        console.log("✅ 유저 정보:", data);
        setUser(data);
      })
      .catch((err) => {
        console.error("❌ 유저 정보 가져오기 실패:", err);
      });
  }, []);

  // ✅ 모든 조건이 충족되었을 때 결제 요청
  useEffect(() => {
    console.log("🧪 결제 조건 확인", {
      sdkLoaded,
      user,
      selectedCoin,
    });

    if (sdkLoaded && user && selectedCoin) {
      console.log("🚀 결제 요청 시작");
      
      requestTossPayment({
        clientKey,
        coin: selectedCoin,
        userId: user.userId,
      });
    }
  }, [sdkLoaded, user, selectedCoin]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl font-semibold text-[#2E384D]">
        결제 페이지로 이동 중입니다...
      </h1>
      <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요.</p>
    </div>
  );
}
