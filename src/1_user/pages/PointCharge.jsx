import { useState, useEffect } from "react";
import { fetchUserData } from "../api/userapi";

const coinOptions = [
  { amount: 5, price: 5000 },
  { amount: 10, price: 10000 },
  { amount: 30, price: 30000 },
  { amount: 50, price: 50000 },
  { amount: 100, price: 100000 },
];

export default function PointCharge() {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData()
      .then(setUser)
      .catch((err) => {
        console.error("유저 정보 가져오기 실패:", err);
      });
  }, []);

  const handlePayment = (method) => {
    if (!selectedCoin || !user) {
      alert("결제 금액과 유저 정보가 필요합니다.");
      return;
    }

    const tossPayments = window.TossPayments(
      import.meta.env.VITE_TOSS_CLIENT_KEY
    );
    tossPayments.requestPayment(method, {
      amount: selectedCoin.price,
      orderId: `order-${Date.now()}`,
      orderName: `${selectedCoin.amount}코인 충전`,
      successUrl: `${window.location.origin}/swings/mypage/points/success`,
      failUrl: `${window.location.origin}/swings/mypage/points/fail`,
      customerName: user.userId.toString(), // 💡 userId만 넘겨도 됨
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">포인트 충전하기</h1>

      {/* 코인 선택 */}
      <div className="grid grid-cols-2 gap-4">
        {coinOptions.map((option) => (
          <button
            key={option.amount}
            onClick={() => setSelectedCoin(option)}
            className={`p-4 rounded-lg border-2 ${
              selectedCoin?.amount === option.amount
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <p className="text-lg font-bold">{option.amount}코인</p>
            <p>{option.price.toLocaleString()}원</p>
          </button>
        ))}
      </div>

      {/* 결제수단 선택 */}
      {selectedCoin && (
        <div className="space-y-2 text-center">
          <p className="text-lg font-medium">
            선택한 금액:{" "}
            <span className="text-blue-600">
              {selectedCoin.price.toLocaleString()}원
            </span>
          </p>
          <p className="text-sm text-gray-500">결제 수단을 선택해주세요</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => handlePayment("카드")}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              토스페이
            </button>
            <button
              onClick={() => handlePayment("카카오페이")}
              className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-500"
            >
              카카오페이
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
