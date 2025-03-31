import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../api/userapi";
import { removeToken } from "../utils/userUtils";
import { MessageCircle, LogOut } from "lucide-react";

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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h2 className="text-2xl font-bold text-[#2E384D]">마이페이지</h2>
        <p className="text-gray-500 text-sm">
          계정 관련 기능을 이용할 수 있어요.
        </p>

        <button
          onClick={() => navigate("/swings/mypage/update")}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
        >
          회원정보 수정
        </button>

        <button
          onClick={() => navigate("/swings/mypage/passwordchange")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
        >
          비밀번호 변경
        </button>

        <button
          onClick={() => navigate("/swings/mypage/userdelete")}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg"
        >
          회원 탈퇴
        </button>

        <div className="border-t border-gray-200 my-4" />

        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-red-500 flex items-center gap-1"
        >
          <LogOut size={16} />
          로그아웃
        </button>
      </div>
    </div>
  );
}
