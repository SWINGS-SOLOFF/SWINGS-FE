import { useState, useEffect } from "react";

export default function ProfileImageUploader({ imageFile, setImageFile }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("이미지 파일만 업로드 가능합니다.");
      setImageFile(null); // 이미지 파일이 유효하지 않으면 상태 초기화
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  return (
    <div className="space-y-2 text-sm">
      <label className="block font-medium text-gray-600">
        프로필 사진 업로드
      </label>

      {previewUrl ? (
        <div className="relative w-32 h-32">
          <img
            src={previewUrl}
            alt="미리보기"
            className="w-32 h-32 object-cover rounded-full border border-gray-300"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 transform translate-x-1/2 -translate-y-1/2"
          >
            삭제
          </button>
        </div>
      ) : (
        <div className="w-32 h-32 border border-dashed border-gray-400 rounded-full flex items-center justify-center text-gray-400">
          미리보기 없음
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-gray-700"
      />
    </div>
  );
}
