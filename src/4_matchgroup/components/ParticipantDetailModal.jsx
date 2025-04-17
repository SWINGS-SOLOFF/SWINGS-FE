import BaseModal from "./ui/BaseModal.jsx";
import { getProfileImageUrl } from "../../1_user/api/userApi";

const ParticipantDetailModal = ({ isOpen, onClose, participant }) => {
    if (!isOpen || !participant) return null;

    const imageUrl = participant.userImg
        ? getProfileImageUrl(participant.userImg)
        : "/default-profile.png";

    return (
        <BaseModal onClose={onClose} title={`👤 ${participant.name} 님의 프로필`}>
            <div className="flex flex-col items-center gap-4 text-sm text-gray-800">
                <img
                    src={imageUrl}
                    alt="프로필 이미지"
                    className="w-24 h-24 rounded-full object-cover border"
                />

                <div className="space-y-1 text-center">
                    <p className="text-lg font-bold">{participant.name} ({participant.username})</p>
                    <p>{participant.age}세 · {participant.gender?.toLowerCase() === "male" ? "남성" : "여성"}</p>
                    <p>{participant.mbti} · {participant.job}</p>
                    <p>📍 {participant.region}</p>
                </div>

                {participant.introduce && (
                    <div className="w-full mt-4 text-sm text-gray-700 bg-gray-50 p-4 rounded shadow-inner">
                        <h4 className="font-semibold mb-2">자기소개</h4>
                        <p className="whitespace-pre-line">{participant.introduce}</p>
                    </div>
                )}
            </div>

            <div className="mt-6 text-center">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    닫기
                </button>
            </div>
        </BaseModal>
    );
};

export default ParticipantDetailModal;