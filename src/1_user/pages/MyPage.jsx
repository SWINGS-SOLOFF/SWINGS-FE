import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../api/userApi";
import UpdateForm from "../components/UpdateForm";

export default function MyPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserData();
        setFormData(data);
      } catch (err) {
        console.error("유저 정보 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        로딩 중...
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 pt-8 space-y-6">
      {!showUpdateForm ? (
        <>
          <button
            onClick={() => navigate("/swings/update")}
            className="w-full max-w-xs bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
          >
            회원정보 수정
          </button>
          <button
            onClick={() => navigate("/swings/passwordchange")}
            className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
          >
            비밀번호 변경
          </button>
        </>
      ) : (
        <UpdateForm formData={formData} setFormData={setFormData} />
      )}
    </div>
  );
}
