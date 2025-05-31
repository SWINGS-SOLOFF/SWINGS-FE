import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getProfileImageUrl, updateProfileImage } from "../api/userApi";
import { toast } from "react-toastify";

export default function ProfileImageUploaderStart({
  imageFile,
  setImageFile,
  initialImage,
  onClose,
  onComplete,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // 이미지 미리보기 URL 관리
  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  useEffect(() => {
    if (!imageFile && initialImage) {
      setPreviewUrl(getProfileImageUrl(initialImage));
    }
  }, [initialImage, imageFile]);

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

  const handleSave = async () => {
    if (!imageFile) {
      toast.error("이미지를 선택해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateProfileImage(imageFile);
      toast.success("프로필 이미지가 저장되었습니다.");
      onComplete?.(res.filename);
      onClose();
      window.location.reload(); //  새로고침
    } catch (err) {
      console.error("업로드 실패:", err);
      toast.error("업로드에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm relative shadow-lg">
      {/* ✅ 알림 메시지 */}
      <div className="text-center mb-4 text-sm text-gray-600">
        <p className="text-xl font-semibold text-black">프로필 이미지</p>
        <p className="mt-1">
          아직 프로필 사진이 없어요.
          <br />
          즐거운 SWINGS를 위해{" "}
          <span className="font-medium">지금 등록해보세요!</span>
        </p>
      </div>

      {/* 프로필 이미지 미리보기 */}
      <div className="relative w-36 h-36 mx-auto">
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="프로필 이미지 미리보기"
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

      {/* 이미지 선택 버튼 */}
      <label className="cursor-pointer mt-4 mx-auto block font-bold bg-custom-purple text-white text-sm px-6 py-2 rounded-full shadow-md hover:opacity-90 transition text-center">
        이미지 선택
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="mt-6 w-full font-bold bg-custom-pink text-white text-sm py-2 rounded-full transition disabled:opacity-50"
      >
        {isSaving ? "저장 중..." : "저장하기"}
      </button>
    </div>
  );
}
