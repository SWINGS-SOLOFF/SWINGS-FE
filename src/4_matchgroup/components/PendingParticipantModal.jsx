import React from "react";

const PendingParticipantModal = ({
                                     isOpen,
                                     onClose,
                                     pendingParticipants,
                                     onApprove,
                                     onReject,
                                 }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">⏳ 대기 중인 참가자</h2>

                {pendingParticipants.length === 0 ? (
                    <p className="text-gray-500 text-center">대기 중인 참가자가 없습니다.</p>
                ) : (
                    <ul className="space-y-3">
                        {pendingParticipants.map((p) => (
                            <li
                                key={p.user.username}
                                className="flex justify-between items-center border-b pb-2"
                            >
                                <span className="font-medium">{p.user.username}</span>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => onApprove(p.user.username)}
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        승인
                                    </button>
                                    <button
                                        onClick={() => onReject(p.user.username)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        거절
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-6 text-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingParticipantModal;
