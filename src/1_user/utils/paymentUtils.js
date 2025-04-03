// src/1_user/utils/paymentUtils.js

const COIN_UNIT_PRICE = 1000;

export const getAmountFromCoin = (coin) => coin * COIN_UNIT_PRICE;

export const requestTossPayment = ({ clientKey, coin, userId }) => {
  if (!window.TossPayments || !clientKey || !userId) {
    alert("결제 준비가 완료되지 않았습니다.");
    return;
  }

  const tossPayments = window.TossPayments(clientKey);

  tossPayments.requestPayment("카드", {
    amount: getAmountFromCoin(coin),
    orderId: `order-${Date.now()}`,
    orderName: `포인트 ${coin}코인 충전`,
    successUrl: `${window.location.origin}/swings/mypage/points/success`,
    failUrl: `${window.location.origin}/swings/mypage/points/fail`,
    customerName: String(userId),
  });
};
