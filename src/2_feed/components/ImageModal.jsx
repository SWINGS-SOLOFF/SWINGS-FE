import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ImageModal = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null; // imageUrl이 없으면 모달을 표시하지 않음

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            {/* 모달 외부 클릭 시 닫힘 */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>

            {/* 모달 컨텐츠 */}
            <div
                className="relative max-w-full max-h-full bg-transparent"
                onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
            >
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white text-2xl p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition"
                >
                    <FaTimes />
                </button>

                {/* 이미지 */}
                <img
                    src={imageUrl}
                    alt="확대된 이미지"
                    className="max-w-full max-h-screen object-contain rounded-lg shadow-lg"
                />
            </div>
        </div>
    );
};

export default ImageModal;
