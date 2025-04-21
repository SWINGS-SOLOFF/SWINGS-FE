// src/1_user/utils/paymentUtils.js
import { useNavigate } from "react-router-dom";

const COIN_UNIT_PRICE = 1000;

export const getAmountFromCoin = (coin) => coin * COIN_UNIT_PRICE;

export const requestTossPayment = ({ clientKey, coin, userId }) => {
  if (!window.TossPayments || !clientKey || !userId) {
    console.log("토스키", clientKey);
    alert("결제 준비가 완료되지 않았습니다.");
    return;
  }

  const tossPayments = window.TossPayments(clientKey);

  tossPayments.requestPayment("카드", {
    amount: getAmountFromCoin(coin),
    orderId: `order-${Date.now()}`,
    orderName: `${coin}하트 충전`,
    successUrl: `${window.location.origin}/swings/mypage/points/success`,
    failUrl: `${window.location.origin}/swings/mypage/points/fail`,
    customerName: String(userId),
  });
  console.log("토스키", clientKey);
};

/**
 * Toss 결제 리디렉션 처리 함수
 * @param {Object} options
 * @param {string} options.coin
 * @param {Function} options.navigate
 * @param {Function} options.onClose
 * @param {boolean} options.redirectToCheckout
 */
export const handleTossPayment = ({
  coin,
  navigate,
  onClose,
  redirectToCheckout,
}) => {
  if (redirectToCheckout) {
    navigate(`/swings/mypage/points/checkout?coin=${coin}`);
  } else {
    // TODO: 직접 결제 방식 추가 예정
  }
  onClose();
};

/**
 * 카카오페이 결제 처리 (예정)
 * @param {Function} onClose
 */
export const handleKakaoPayment = (onClose) => {
  alert("카카오페이 연동 예정입니다.");
  onClose();
};
