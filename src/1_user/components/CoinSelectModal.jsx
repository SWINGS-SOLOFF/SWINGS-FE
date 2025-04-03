import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CoinSelectModal({
  isOpen,
  onClose,
  coin,
  userId,
  redirectToCheckout,
}) {
  const navigate = useNavigate();

  const handleTossPayment = () => {
    if (redirectToCheckout) {
      navigate(`/swings/mypage/points/checkout?coin=${coin}`);
    } else {
      // 직접 결제 처리 (이전 방식)
    }
    onClose();
  };

  const handleKakaoPayment = () => {
    alert("카카오페이 연동 예정입니다.");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-lg bg-white shadow-lg p-6 space-y-4 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            <X />
          </button>
          <Dialog.Title className="text-lg font-bold text-center text-[#2E384D]">
            결제 수단 선택
          </Dialog.Title>
          <p className="text-center text-sm text-gray-600">
            {coin}코인을 어떤 방법으로 결제할까요?
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleTossPayment}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
            >
              토스페이로 결제
            </button>
            <button
              onClick={handleKakaoPayment}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 rounded"
            >
              카카오페이로 결제
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
