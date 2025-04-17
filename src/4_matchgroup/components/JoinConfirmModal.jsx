import { useState } from "react";
import { UsersIcon, MapPinIcon, CalendarIcon, Venus, Mars } from "lucide-react";
import BaseModal from "./ui/BaseModal";
import { canUserJoinGroup } from "../api/matchParticipantApi";

const JoinConfirmModal = ({ isOpen, group, participants, onClose, onConfirm }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen || !group) return null;

    // 성별 카운트
    const femaleCount = participants.filter(p => p.gender === "FEMALE").length;
    const maleCount = participants.filter(p => p.gender === "MALE").length;

    const handleConfirm = async () => {
        setLoading(true);

        try {
            const canJoin = await canUserJoinGroup(group.matchGroupId, group.currentUserId); // ✅ 백엔드 조건 검사

            if (!canJoin) {
                alert("참가할 수 없는 그룹입니다. (모집 종료, 성비 제한 또는 정원 초과)");
                setLoading(false);
                return;
            }

            await onConfirm(); // 실제 참가 처리 (부모에서 정의됨)
        } catch (error) {
            console.error("참가 요청 중 오류:", error);
            alert("참가 신청 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

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

            {/* 성별 현황 */}
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

            {/* 버튼 영역 */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-2">
                <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
                >
                    {loading ? "신청 중..." : "참여하기"}
                </button>
                <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded-lg text-sm hover:bg-gray-400"
                >
                    취소
                </button>
            </div>
        </BaseModal>
    );
};

export default JoinConfirmModal;