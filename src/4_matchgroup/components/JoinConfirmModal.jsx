import { UsersIcon, MapPinIcon, CalendarIcon, Venus, Mars } from "lucide-react";
import BaseModal from "./ui/BaseModal";

// JoinConfirmModal 컴포넌트
const JoinConfirmModal = ({ isOpen, group, participants, onClose, onConfirm }) => {
    if (!isOpen || !group) return null;

    // 성별 카운트 계산
    const femaleCount = participants.filter(p => p.gender === "female").length;
    const maleCount = participants.filter(p => p.gender === "male").length;

    return (
        <BaseModal onClose={onClose} title={`${group.groupName}`}>
            {/* 안내 문구 */}
            <p className="mb-3 text-sm text-center text-gray-600">
                이 그룹에 참가하시겠습니까?
            </p>

            {/* 그룹 정보 */}
            <div className="space-y-2 text-sm mb-4 rounded-md bg-gray-50 p-3 border">
                <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-pink-500" />
                    <span className="truncate"><strong>장소:</strong> {group.location}</span>
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

            {/* 성별 모집 현황 */}
            <div className="flex gap-4 justify-center text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                    <Venus className="w-4 h-4 text-pink-500" />
                    <span>여성: {femaleCount}명</span>
                </div>
                <div className="flex items-center gap-1">
                    <Mars className="w-4 h-4 text-blue-500" />
                    <span>남성: {maleCount}명</span>
                </div>
            </div>

            {/* 참가자 목록 */}
            <div className="border-t pt-3 mb-4">
                <h3 className="font-semibold text-sm mb-1 text-gray-800">참가자 목록</h3>
                {participants.length === 0 ? (
                    <p className="text-gray-500 text-sm">아직 참가자가 없습니다.</p>
                ) : (
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                        {participants.map((p) => (
                            <li key={p.userId} className="truncate">{p.username}</li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-2">
                <button
                    onClick={() => {
                        console.log("✅ 참여하기 버튼 클릭됨");
                        onConfirm();
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                    참여하기
                </button>
            </div>
        </BaseModal>
    );
};

export default JoinConfirmModal;