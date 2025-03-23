import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import MyPageForm from "../components/MyPageForm";

export default function MyPage() {
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // 변경된 필드만 추출하는 함수
  const getUpdatedFields = () => {
    const updated = {};
    for (const key in formData) {
      if (formData[key] !== userData[key]) {
        updated[key] = formData[key];
      }
    }
    return updated;
  };

  // 사용자 정보 불러오기
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
        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUserData();
  }, [token]);

  // 입력 변경 핸들러
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 회원 정보 업데이트
  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedFields = getUpdatedFields();

    if (Object.keys(updatedFields).length === 0) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8090/swings/users/${userData.username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );

      if (!response.ok) {
        throw new Error("회원 정보 수정 실패");
      }

      alert("회원 정보가 성공적으로 수정되었습니다!");
      setUserData({ ...userData, ...updatedFields });
      setEditMode(false);
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
            <MyPageForm
              formData={formData}
              handleChange={handleChange}
              handleUpdate={handleUpdate}
            />
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
