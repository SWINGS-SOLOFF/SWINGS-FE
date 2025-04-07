import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileImageUploader from "../components/ProfileImageUploader";
import { updateProfileImage, fetchUserData } from "../api/userApi";

export default function ProfileImage() {
  const [imageFile, setImageFile] = useState(null);
  const [initialImage, setInitialImage] = useState(null); // 기존 프로필 이미지 파일명
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ 마운트 시 기존 프로필 이미지 불러오기
  useEffect(() => {
    const loadUserImage = async () => {
      try {
        const user = await fetchUserData();
        setInitialImage(user.userImg); // 기존 이미지 파일명
      } catch (err) {
        console.error("프로필 이미지 불러오기 실패:", err);
      }
    };
    loadUserImage();
  }, []);

  const handleSubmit = async () => {
    if (!imageFile) {
      alert("이미지를 선택해주세요.");
      return;
    }

    setLoading(true);

    try {
      await updateProfileImage(imageFile);
      alert("프로필 사진이 업로드되었습니다.");
      navigate("/swings/mypage");
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">프로필 사진 수정</h2>

      <ProfileImageUploader
        imageFile={imageFile}
        setImageFile={setImageFile}
        initialImage={initialImage} // ✅ 기존 이미지 넘겨줌
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-6 px-6 py-2 rounded-full text-sm font-medium text-white shadow-md transition 
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
    }
  `}
      >
        {loading ? "업로드 중..." : "저장하기"}
      </button>
    </div>
  );
}
