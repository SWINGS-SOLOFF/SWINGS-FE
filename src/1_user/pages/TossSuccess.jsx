// src/1_user/pages/TossSuccess.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { fetchUserData } from "../api/userApi";
import { CheckCircle } from "lucide-react";

export default function TossSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("결제 확인 중...");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserData()
      .then((data) => {
        setUserId(data.userId);
      })
      .catch((err) => {
        console.error("유저 정보 가져오기 실패:", err);
        setMessage("유저 정보를 불러올 수 없습니다.");
      });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const confirmPayment = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      try {
        const response = await axios.post("/api/payments/confirm", {
          paymentKey,
          orderId,
          amount: parseInt(amount),
          customerId: userId,
          createdAt: new Date().toISOString(),
        });

        console.log("백엔드 확인 완료:", response.data);
        setMessage("포인트 충전이 완료되었습니다!");
      } catch (err) {
        console.error("결제 확인 실패:", err.response?.data || err.message);
        setMessage("결제 확인에 실패했습니다.");
      }

      setTimeout(() => {
        navigate("/swings/shop");
      }, 3000);
    };

    confirmPayment();
  }, [userId]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-center px-6">
      <CheckCircle className="text-green-500 w-20 h-20 mb-4 animate-bounce" />
      <h1 className="text-3xl font-bold text-green-600 mb-2">결제 성공</h1>
      <p className="text-lg text-gray-700">{message}</p>
      <p className="mt-2 text-sm text-gray-400">
        3초 후 상점으로 이동합니다...
      </p>
    </div>
  );
}
