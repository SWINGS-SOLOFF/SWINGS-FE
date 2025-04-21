import ConfirmModal from "./ConfirmModal";

export default function SwipeModals({
                                        showConfirmModal,
                                        setShowConfirmModal,
                                        showChargeModal,
                                        setShowChargeModal,
                                        showSuperChatModal,
                                        setShowSuperChatModal,
                                        sendLikeRequest,
                                        confirmSuperChat,
                                        navigate,
                                    }) {
    return (
        <>
            {showConfirmModal && (
                <ConfirmModal
                    message={`무료 좋아요를 모두 사용했어요.\n1하트를 사용하시겠어요?`}
                    confirmLabel="보내기"
                    cancelLabel="아니요"
                    onConfirm={() => {
                        setShowConfirmModal(false);
                        sendLikeRequest(true);
                    }}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}

            {showSuperChatModal && (
                <ConfirmModal
                    message={`슈퍼챗은 3하트를 사용합니다.\n사용하시겠어요?`}
                    confirmLabel="사용하기"
                    cancelLabel="돌아가기"
                    onConfirm={confirmSuperChat}
                    onCancel={() => setShowSuperChatModal(false)}
                />
            )}

            {showChargeModal && (
                <ConfirmModal
                    message={`하트가 부족합니다.\n충전하러 가시겠어요?`}
                    confirmLabel="충전하러 가기"
                    cancelLabel="돌아가기"
                    onConfirm={() => {
                        setShowChargeModal(false);
                        navigate("/swings/points");
                    }}
                    onCancel={() => setShowChargeModal(false)}
                />
            )}
        </>
    );
}