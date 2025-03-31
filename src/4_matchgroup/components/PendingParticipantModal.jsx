import Button from "../components/ui/Button";
import Modal from "./ui/Modal.jsx";

const PendingParticipantModal = ({ isOpen, onClose, pendingParticipants, onApprove, onReject }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="대기자 목록">
            {pendingParticipants.length === 0 ? (
                <p className="text-sm text-gray-500">현재 대기자가 없습니다.</p>
            ) : (
                <ul className="space-y-3 mt-2">
                    {pendingParticipants.map((participant) => (
                        <li
                            key={participant.username}
                            className="flex justify-between items-center bg-yellow-50 p-2 rounded border border-yellow-200"
                        >
                            <span className="font-medium text-gray-700">{participant.username}</span>
                            <div className="space-x-2">
                                <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() => onApprove(participant.username)}
                                >
                                    승인
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => onReject(participant.username)}
                                >
                                    거절
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Modal>
    );
};

export default PendingParticipantModal;
