import BaseModal from "./ui/BaseModal";
import { useNavigate } from "react-router-dom";
import PendingUserList from "./PendingUserList.jsx";

const PendingParticipantModal = ({
                                     isOpen,
                                     onClose,
                                     pendingParticipants,
                                     onApprove,
                                     onReject,
                                 }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    // 상세 보기 클릭 시 사용자 프로필 페이지로 이동
    const handleViewUser = (userId) => {
        navigate(`/user/${userId}`);
    };

    return (
        <BaseModal onClose={onClose} title="⏳ 대기 중인 참가자">
            <PendingUserList
                pending={pendingParticipants}
                onApprove={(p) => onApprove(p.user.username)}
                onReject={(p) => onReject(p.user.username)}
                showDetail={false}
            />
        </BaseModal>
    );
};

export default PendingParticipantModal;
