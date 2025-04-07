export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <div className="mt-4 text-gray-600 text-sm">{children}</div>
                <button
                    onClick={onClose}
                    className="mt-6 px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-100 transition"
                >
                    확인
                </button>
            </div>
        </div>
    );
}
