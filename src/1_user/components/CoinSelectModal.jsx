import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleTossPayment } from "../utils/paymentUtils";

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

          <p className="text-center text-sm text-gray-600">
            <span className="font-bold text-[#2E384D]">{coin}하트</span>을
            결제하시겠습니까?
          </p>

          {/* ✅ 결제 버튼 하나만 */}
          <div className="mt-6">
            <button
              onClick={() =>
                handleTossPayment({
                  coin,
                  navigate,
                  onClose,
                  redirectToCheckout,
                })
              }
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow transition"
            >
              결제 요청
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
