import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getProfileImageUrl } from "../api/userApi";
import { ArrowLeft } from "lucide-react";

export default function ProfileImageUploader({
  imageFile,
  setImageFile,
  initialImage,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (initialImage) {
      setPreviewUrl(getProfileImageUrl(initialImage));
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile, initialImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("이미지 파일만 업로드 가능합니다.");
      setImageFile(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className=" relative w-full flex flex-col items-center gap-5">
      {/* ✅ 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft size={24} />
      </button>
      <p className="text-sm font-semibold text-gray-700 tracking-wide">
        프로필 사진 업로드
      </p>

      <div className="relative w-36 h-36">
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="미리보기"
              className="w-36 h-36 object-cover rounded-full shadow-lg border-2 border-gray-300 transition-transform duration-300 hover:scale-105"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-white border border-gray-300 hover:bg-red-500 hover:text-white text-gray-500 rounded-full p-1 shadow-sm transition"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="w-36 h-36 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
            미리보기 없음
          </div>
        )}
      </div>

      {/* ✨ 트렌디하고 심플한 버튼 */}
      <label className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm px-6 py-2 rounded-full shadow-md hover:opacity-90 transition">
        이미지 선택
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
