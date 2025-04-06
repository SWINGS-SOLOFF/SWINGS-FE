import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileImageUploader from "../components/ProfileImageUploader";
import { updateProfileImage } from "../api/userApi";

export default function ProfileImage() {
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!imageFile) {
      alert("이미지를 선택해주세요.");
      return;
    }

    setLoading(true); // 로딩 시작

    try {
      await updateProfileImage(imageFile); // 실제 업로드
      alert("프로필 사진이 업로드되었습니다.");
      navigate("/swings/mypage");
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">프로필 사진 수정</h2>
      <ProfileImageUploader imageFile={imageFile} setImageFile={setImageFile} />
      <button
        onClick={handleSubmit}
        disabled={loading} // 로딩 중 버튼 비활성화
        className={`mt-6 px-6 py-2 ${
          loading ? "bg-gray-400" : "bg-purple-600"
        } text-white font-semibold rounded hover:bg-purple-700`}
      >
        {loading ? "업로드 중..." : "저장하기"}
      </button>
    </div>
  );
}
