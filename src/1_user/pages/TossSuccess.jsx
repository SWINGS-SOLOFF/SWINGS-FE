// src/1_user/pages/TossSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

export default function TossSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("결제 확인 중...");

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      try {
        const response = await axios.post("/api/payments/confirm", {
          paymentKey,
          orderId,
          amount: parseInt(amount),
        });

        console.log("백엔드 확인 완료:", response.data);
        setMessage("포인트 충전이 완료되었습니다!");

        // ✅ 포인트 페이지로 이동하거나 다시 로드
        setTimeout(() => {
          navigate("/swings/mypage/points");
        }, 1000);
      } catch (err) {
        console.error("결제 확인 실패:", err);
        setMessage("결제 확인에 실패했습니다.");
      }
    };

    confirmPayment();
  }, []);

  return (
    <div className="p-8 text-center">
      <br />
      <h1 className="text-xl font-bold text-green-600">🎉 결제 성공</h1>
      <p className="mt-4">{message}</p>
    </div>
  );
}
