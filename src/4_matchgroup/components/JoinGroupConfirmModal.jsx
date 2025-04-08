import React from "react";

const JoinGroupConfirmModal = ({ isOpen, onClose, group, participants, onConfirm }) => {
    if (!isOpen || !group) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center text-golf-green-600">
                    ⛳ 참가 신청 확인
                </h2>

                <div className="text-left space-y-2">
                    <p><strong>📍 장소:</strong> {group.location}</p>
                    <p><strong>⏰ 일정:</strong> {new Date(group.schedule).toLocaleString()}</p>
                    <p><strong>👥 현재 참가자:</strong> {participants.length}명 / {group.maxParticipants}명</p>
                    <p><strong>📝 설명:</strong> {group.description || "없음"}</p>
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold mb-2 text-gray-700">현재 참가자 목록</h3>
                    <ul className="text-sm space-y-1">
                        {participants.map((p) => (
                            <li key={p.user.username} className="text-gray-600">- {p.user.username}</li>
                        ))}
                        {participants.length === 0 && <li className="text-gray-400">아직 참가자가 없습니다.</li>}
                    </ul>
                </div>

                <div className="flex justify-end mt-6 gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        취소
                    </button>
                    <button
                        onClick={async () => {
                            await onConfirm();   // ✅ 여기 반드시 await 붙이기
                            onClose();
                        }}
                    >
                        ✅ 참여 신청
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinGroupConfirmModal;
