import React, { useState } from "react";

function ConfirmModal({
                          message,
                          onConfirm,
                          onCancel,
                          cancelLabel = "취소",
                          confirmLabel = "확인"

                      }) {
    const [submitting, setSubmitting] = useState(false); // 중복 클릭 방지용 상태

    const handleConfirm = async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            await onConfirm(); // 외부 confirm 실행
        } catch (e) {
            console.error("❌ ConfirmModal 에러", e);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white p-6 rounded-xl shadow-md max-w-sm text-center">
                <p className="text-gray-800 text-base mb-5 whitespace-pre-line">
                    {message}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        disabled={submitting}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={submitting}
                        className={`px-4 py-2 rounded-full font-semibold ${
                            submitting ? "bg-custom-pink cursor-not-allowed" : "bg-custom-pink"
                        } text-white`}
                    >
                        {confirmLabel}
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
