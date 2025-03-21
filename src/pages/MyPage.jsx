import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function MyPage() {
  const { token } = useAuth(); // ✅ 토큰 가져오기
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // ✅ 마이페이지 정보 가져오기 (GET /me)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8090/swings/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("사용자 정보를 불러올 수 없습니다.");
        }

        const data = await response.json();
        setUserData(data);
        setFormData(data); // 수정 폼 데이터 초기화
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUserData();
  }, [token]);

  // ✅ 입력 값 변경 핸들러
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ 이미지 업로드 핸들러 (Base64 변환)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, userImg: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // ✅ 회원 정보 수정 API 호출 (PATCH /{username})
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8090/swings/users/${userData.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("회원 정보 수정 실패");
      }

      alert("회원 정보가 성공적으로 수정되었습니다!");
      setUserData(formData); // 변경된 데이터 UI 반영
      setEditMode(false); // 수정 모드 해제
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
      setError(error.message);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-center">마이페이지</h2>

      {userData ? (
        <div className="space-y-4">
          {editMode ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <label className="block">
                이름:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </label>

              <label className="block">
                성별:
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </label>

              <label className="block">
                직업:
                <input
                  type="text"
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </label>

              <label className="block">
                골프 실력:
                <input
                  type="text"
                  name="golfSkill"
                  value={formData.golfSkill}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </label>

              <label className="block">
                MBTI:
                <input
                  type="text"
                  name="mbti"
                  value={formData.mbti}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </label>

              <label className="block">
                취미:
                <input
                  type="text"
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </label>

              <label className="block">
                자기소개:
                <textarea
                  name="introduce"
                  value={formData.introduce}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </label>

              {/* 프로필 이미지 업로드 */}
              <label className="block">
                프로필 이미지:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              {/* 프로필 이미지 미리보기 */}
              {formData.userImg && (
                <div className="mt-2">
                  <img
                    src={formData.userImg}
                    alt="프로필 이미지"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              )}

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                수정 완료
              </button>
            </form>
          ) : (
            <>
              <p>
                <strong>이름:</strong> {userData.name}
              </p>
              <p>
                <strong>성별:</strong> {userData.gender}
              </p>
              <p>
                <strong>직업:</strong> {userData.job}
              </p>
              <p>
                <strong>골프 실력:</strong> {userData.golfSkill}
              </p>
              <p>
                <strong>MBTI:</strong> {userData.mbti}
              </p>
              <p>
                <strong>취미:</strong> {userData.hobbies}
              </p>
              <p>
                <strong>자기소개:</strong> {userData.introduce}
              </p>

              {/* 프로필 이미지 표시 */}
              {userData.userImg && (
                <div className="mt-2">
                  <img
                    src={userData.userImg}
                    alt="프로필 이미지"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              )}

              <button
                onClick={() => setEditMode(true)}
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
              >
                회원정보 수정
              </button>
            </>
          )}
        </div>
      ) : (
        <p>사용자 정보를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}
