// src/1_user/pages/TossCheckout.jsx
import { useEffect, useState } from "react";
import { fetchUserData } from "../api/userapi";
import { requestTossPayment } from "../utils/paymentUtils";

export default function TossCheckout() {
  const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
  const [user, setUser] = useState(null);

  const coinOptions = [
    { coin: 5, price: 5000, icon: "🪙" },
    { coin: 10, price: 10000, icon: "💰" },
    { coin: 30, price: 30000, icon: "💵" },
    { coin: 50, price: 50000, icon: "💸" },
    { coin: 100, price: 100000, icon: "🏆" },
    { coin: 300, price: 300000, icon: "👑" }, // 👑 추가!
  ];

  useEffect(() => {
    fetchUserData()
      .then((data) => setUser(data))
      .catch((err) => {
        console.error("유저 정보 가져오기 실패:", err);
      });
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = (coin) => {
    if (!clientKey || !user) {
      alert("결제 준비가 완료되지 않았습니다.");
      return;
    }

    requestTossPayment({
      clientKey,
      coin,
      userId: user.userId,
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-[#2E384D] text-center">
        포인트 충전
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {coinOptions.map(({ coin, price, icon }) => (
          <button
            key={coin}
            onClick={() => handlePayment(coin)}
            className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg hover:border-blue-500 transition-all"
          >
            <div className="text-3xl mb-2">{icon}</div>
            <div className="font-semibold text-base text-black">{coin}코인</div>
            <div className="text-sm text-gray-600">
              {price.toLocaleString()}원
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
