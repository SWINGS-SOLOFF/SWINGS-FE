// src/1_user/pages/TossSuccess.jsx

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { fetchUserData } from "../api/userApi";

export default function TossSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("결제 확인 중...");
  const [userId, setUserId] = useState(null);

  //  유저 정보 먼저 가져오기
  useEffect(() => {
    fetchUserData()
      .then((data) => {
        setUserId(data.userId); // userId 저장
      })
      .catch((err) => {
        console.error("유저 정보 가져오기 실패:", err);
        setMessage("유저 정보를 불러올 수 없습니다.");
      });
  }, []);

  //[콘솔]userId 가져오는지 확인
  console.log("userId:", userId);

  //  userId가 준비되면 결제 확인 요청
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
          createdAt: new Date().toISOString(), // ISO 8601 형식으로 보냄
        });

        //[콘솔] 백엔드로 정보 전송 성공
        console.log("✅ 백엔드 확인 완료:", response.data);
        setMessage("포인트 충전이 완료되었습니다!");

        setTimeout(() => {
          navigate("/swings/points");
        }, 1000);
      } catch (err) {
        //[콘솔] 백엔드로 정보 전송 실패
        console.error("❌ 결제 확인 실패:", err.response?.data || err.message);
        setMessage("결제 확인에 실패했습니다.");
      }
    };

    confirmPayment();
  }, [userId]);

  return (
    <div className="p-8 text-center">
      <br />
      <h1 className="text-xl font-bold text-green-600">🎉 결제 성공</h1>
      <p className="mt-4">{message}</p>
    </div>
  );
}
