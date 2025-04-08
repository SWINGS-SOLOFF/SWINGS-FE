import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleTossPayment, handleKakaoPayment } from "../utils/paymentUtils";

export default function CoinSelectModal({
  isOpen,
  onClose,
  coin,
  userId,
  redirectToCheckout,
}) {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[100]">
      {/* 어두운 배경 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* 중앙 모달 */}
      <div className="fixed inset-0 flex items-center justify-center px-4 z-[101]">
        <Dialog.Panel className="w-full max-w-sm rounded-2xl bg-white shadow-xl px-6 pt-8 pb-6 relative space-y-5">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>

          <Dialog.Title className="text-lg font-bold text-center text-[#2E384D]">
            결제 수단 선택
          </Dialog.Title>

          <p className="text-center text-sm text-gray-600">
            <span className="font-semibold text-[#2E384D]">{coin}</span>
            코인을 어떤 방법으로 결제할까요?
          </p>

          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() =>
                handleTossPayment({
                  coin,
                  navigate,
                  onClose,
                  redirectToCheckout,
                })
              }
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-sm"
            >
              토스페이로 결제
            </button>
            <button
              onClick={() => handleKakaoPayment(onClose)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded-lg shadow-sm"
            >
              카카오페이로 결제
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
