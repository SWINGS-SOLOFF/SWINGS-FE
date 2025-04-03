import {useEffect} from "react";

export default function NotificationToast({ message, onClose }) {
    useEffect(() => {
        const  timer = setTimeout(() => {
            onClose();
        }, 3000);  // 3초 후 자동 사라짐

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-fadeIn">
            <p className="text-sm">{message}</p>
        </div>
    )
}