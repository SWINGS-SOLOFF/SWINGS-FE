import { UsersIcon, MapPinIcon, CalendarIcon } from "lucide-react";

const JoinConfirmModal = ({ isOpen, group, participants, onClose, onConfirm }) => {
    if (!isOpen || !group) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{group.groupName} 참가 신청</h2>
                <p className="mb-4 text-gray-600">정말로 이 그룹에 참가하시겠습니까?</p>

                {/* 그룹 정보 */}
                <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-pink-500" />
                        <span><strong>장소:</strong> {group.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-orange-500" />
                        <span><strong>일정:</strong> {new Date(group.schedule).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-purple-500" />
                        <span><strong>인원:</strong> {participants.length}/{group.maxParticipants}</span>
                    </div>
                </div>

                {/* 참가자 목록 */}
                <div className="border-t pt-2 mb-4">
                    <h3 className="font-semibold mb-1">참가자 목록</h3>
                    {participants.length === 0 ? (
                        <p className="text-gray-500 text-sm">현재 참가자가 없습니다.</p>
                    ) : (
                        <ul className="list-disc pl-5 text-sm text-gray-700">
                            {participants.map((p) => (
                                <li key={p.userId}>{p.username}</li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 버튼 */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        닫기
                    </button>
                    <button
                        onClick={() => {
                            console.log("✅ 참여하기 버튼 클릭됨");
                            onConfirm(); // ✅ 이름 일치
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        참여하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinConfirmModal;
