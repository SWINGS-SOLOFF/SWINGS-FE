import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../api/userApi";
import { removeToken } from "../utils/userUtils"; // ✅ 로그아웃 유틸 불러오기

export default function MyPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // ✅ 로그아웃 처리 함수
  const handleLogout = () => {
    removeToken();
    navigate("/swings");
  };

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
      <button
        onClick={() => navigate("/swings/mypage/update")}
        className="w-full max-w-xs bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
      >
        회원정보 수정
      </button>

      <button
        onClick={() => navigate("/swings/mypage/passwordchange")}
        className="w-full max-w-xs bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
      >
        비밀번호 변경
      </button>

      <button
        onClick={() => navigate("/swings/mypage/userdelete")}
        className="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
      >
        회원 탈퇴
      </button>

      {/* ✅ 로그아웃 버튼 */}
      <button
        onClick={handleLogout}
        className="w-full max-w-xs bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg mt-6"
      >
        로그아웃
      </button>
    </div>
  );
}
