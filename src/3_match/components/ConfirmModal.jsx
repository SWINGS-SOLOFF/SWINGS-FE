import React from "react";

function ConfirmModal({ message, onConfirm, onCancel, confirmLabel = "확인", cancelLabel = "취소" }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white p-6 rounded-xl shadow-md max-w-sm text-center">
                <p className="text-gray-800 text-base mb-5 whitespace-pre-line">{message}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onConfirm}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-semibold"
                    >
                        {confirmLabel}
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-full"
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
