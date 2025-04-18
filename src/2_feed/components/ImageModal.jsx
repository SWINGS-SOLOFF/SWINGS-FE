import React from "react";
import { FaTimes } from "react-icons/fa";
import { normalizeImageUrl } from "../utils/imageUtils";

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl || typeof imageUrl !== "string") return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {" "}
      <div className="absolute inset-0" onClick={onClose}></div>
      <div
        className="relative max-w-full max-h-full bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-2xl p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition"
        >
          <FaTimes />
        </button>
        <img
          src={imageUrl}
          alt="확대된 이미지"
          className="max-w-full max-h-screen object-contain rounded-lg shadow-lg"
          onError={(e) => {
            console.error("이미지 로드 실패:", imageUrl);
            e.target.src = "/placeholder-image.jpg";
          }}
        />
      </div>
    </div>
  );
};

export default ImageModal;
