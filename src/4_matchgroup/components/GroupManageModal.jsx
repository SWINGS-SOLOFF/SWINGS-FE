import { useEffect, useState } from "react";
import BaseModal from "./ui/BaseModal";
import { getParticipantsByGroupId } from "../api/matchParticipantApi";
import useMatchGroupActions from "../hooks/useMatchGroupActions";
import { getCurrentUser } from "../api/matchGroupApi";
import PendingUserList from "./participant/PendingUserList.jsx";
import AcceptedUserList from "./participant/AcceptedUserList.jsx";

export default function GroupManageModal({ matchGroupId, onClose }) {
    const [participants, setParticipants] = useState([]);
    const [pending, setPending] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const {
        handleApprove,
        handleReject,
        handleRemoveParticipant,
    } = useMatchGroupActions(null, currentUser, fetchParticipants, participants, setParticipants);

    async function fetchParticipants() {
        try {
            const user = await getCurrentUser();
            setCurrentUser(user);
            const data = await getParticipantsByGroupId(matchGroupId);
            setParticipants(data.filter((p) => p.participantStatus === "ACCEPTED"));
            setPending(data.filter((p) => p.participantStatus === "PENDING"));
        } catch (err) {
            console.error("참가자 조회 실패:", err);
        }
    }

    useEffect(() => {
        fetchParticipants();
    }, [matchGroupId]);

    return (
        <BaseModal title="👑 참가자 관리" onClose={onClose} maxWidth="max-w-2xl">

            {/* 대기자 목록 */}
            <section className="mb-6">
                <h3 className="text-base font-semibold mb-3 text-gray-800">⏳ 대기 중인 참가자</h3>
                <PendingUserList
                    pending={pending}
                    onApprove={(p) => handleApprove(matchGroupId, p.matchParticipantId, currentUser.userId)}
                    onReject={(p) => handleReject(matchGroupId, p.matchParticipantId, currentUser.userId)}
                />
            </section>

            {/* 참가자 목록 */}
            <section>
                <h3 className="text-base font-semibold mb-3 text-gray-800">✅ 참가자 목록</h3>
                <AcceptedUserList
                    participants={participants}
                    currentUserId={currentUser?.userId}
                    onRemove={(p) => handleRemoveParticipant(matchGroupId, p.userId, currentUser.userId)}
                />
            </section>

            {/* 닫기 버튼 */}
            <div className="mt-8 text-center">
                <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition"
                >
                    닫기
                </button>
            </div>
        </BaseModal>

    );
}
