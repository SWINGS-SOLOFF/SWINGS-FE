// src/1_user/pages/TossCheckout.jsx
import { useEffect, useState } from "react";
import { fetchUserData } from "../api/userapi";

export default function TossCheckout() {
  const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
  const [user, setUser] = useState(null);

  // ✅ 유저 정보 가져오기
  useEffect(() => {
    fetchUserData()
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error("유저 정보 가져오기 실패:", err);
      });
  }, []);

  // ✅ Toss SDK 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ✅ 결제 요청
  const handlePayment = () => {
    if (!window.TossPayments || !clientKey || !user) {
      alert("결제 준비가 완료되지 않았습니다.");
      return;
    }

    const tossPayments = window.TossPayments(clientKey);

    tossPayments.requestPayment("카드", {
      amount: 1000,
      orderId: `order-${Date.now()}`,
      orderName: "포인트 1000P 충전",
      successUrl: `${window.location.origin}/swings/mypage/points/success`,
      failUrl: `${window.location.origin}/swings/mypage/points/fail`,
      customerName: user.name || user.username || "홍길동", // ✅ 사용자 정보
    });
  };

  return (
    <div className="p-6 text-center space-y-4">
      <h1 className="text-2xl font-bold">포인트 결제</h1>
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        토스로 1000P 결제
      </button>
    </div>
  );
}
