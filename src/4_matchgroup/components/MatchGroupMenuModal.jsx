import BaseModal from "./ui/BaseModal.jsx";

export default function MatchGroupMenuModal({ onClose, onSelectTab }) {
    return (
        <BaseModal onClose={onClose} title="메뉴">
            <ul className="divide-y">
                <li>
                    <button
                        onClick={() => {
                            onSelectTab("HOSTED");
                            onClose();
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100"
                    >
                        🛠 내가 만든 그룹
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => {
                            onSelectTab("APPLIED");
                            onClose();
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100"
                    >
                        📋 신청한 그룹
                    </button>
                </li>
            </ul>
        </BaseModal>
    );
}