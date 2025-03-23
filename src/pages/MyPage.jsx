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
    console.log("handleChange 실행됨", e.target.name, e.target.value);
  };

  // // ✅ 이미지 업로드 핸들러 (Base64 변환)
  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setFormData({ ...formData, userImg: reader.result });
  //   };
  //   if (file) {
  //     reader.readAsDataURL(file);
  //   }
  // };

  // ✅ 회원 정보 수정 API 호출 (PATCH /{username})
  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("username:", userData.username);

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
                전화번호:
                <input
                  type="text"
                  name="phonenumber"
                  value={formData.phonenumber || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </label>

              <label className="block">
                성별:
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </label>

              <label className="block">
                직업:
                <input
                  type="text"
                  name="job"
                  value={formData.job || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </label>

              <label className="block">
                골프 실력:
                <select
                  name="golfSkill"
                  value={formData.golfSkill || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="beginner">초급</option>
                  <option value="intermediate">중급</option>
                  <option value="advanced">고급</option>
                </select>
              </label>

              <label className="block">
                MBTI:
                <input
                  type="text"
                  name="mbti"
                  value={formData.mbti || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </label>

              <label className="block">
                취미:
                <input
                  type="text"
                  name="hobbies"
                  value={formData.hobbies || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </label>

              <label className="block">
                종교:
                <select
                  name="religion"
                  value={formData.religion || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="none">무교</option>
                  <option value="christian">기독교</option>
                  <option value="catholic">천주교</option>
                  <option value="buddhist">불교</option>
                  <option value="etc">기타</option>
                </select>
              </label>

              <label className="block">
                흡연 여부:
                <select
                  name="smoking"
                  value={formData.smoking || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="yes">흡연함</option>
                  <option value="no">흡연하지 않음</option>
                </select>
              </label>

              <label className="block">
                음주 여부:
                <select
                  name="drinking"
                  value={formData.drinking || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="yes">음주함</option>
                  <option value="no">음주하지 않음</option>
                </select>
              </label>

              <label className="block">
                자기소개:
                <textarea
                  name="introduce"
                  value={formData.introduce || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </label>

              {/* <label className="block">
                프로필 이미지 업로드:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              {formData.userImg && (
                <div className="mt-2">
                  <img
                    src={formData.userImg}
                    alt="프로필 이미지"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )} */}

              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded w-full"
              >
                수정 완료
              </button>
            </form>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-green-500 text-white p-2 rounded w-full"
            >
              회원정보 수정
            </button>
          )}
        </div>
      ) : (
        <p>사용자 정보를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}
