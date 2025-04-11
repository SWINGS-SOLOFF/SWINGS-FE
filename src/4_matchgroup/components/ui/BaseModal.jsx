export default function BaseModal({ title, onClose, children, maxWidth = "max-w-lg" }) {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
            <div className={`relative bg-white rounded-2xl w-full ${maxWidth} mx-auto p-6 shadow-xl`}>

                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl sm:text-2xl"
                >
                    &times;
                </button>

                {/* 제목 */}
                {title && (
                    <h2 className="text-xl font-bold text-center text-gray-900 mb-3 pt-2 sm:pt-4">
                        {title}
                    </h2>
                )}

                {/* 본문 */}
                <div>{children}</div>
            </div>
        </div>
    );
}