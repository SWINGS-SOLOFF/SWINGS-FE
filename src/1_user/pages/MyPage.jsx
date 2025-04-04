// src/1_user/pages/MyPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserData, getPointBalance } from "../api/userapi";
import { removeToken } from "../utils/userUtils";
import {
  Coins,
  LogOut,
  Settings,
  KeyRound,
  Trash2,
  UserCircle,
} from "lucide-react";

export default function MyPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [point, setPoint] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserData();
        setFormData(data);
        const balance = await getPointBalance();
        setPoint(balance);
      } catch (err) {
        console.error("유저 정보 또는 포인트 불러오기 실패:", err);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 px-6 py-10">
      <div className="max-w-md mx-auto space-y-6">
        {/* ✅ 사용자 아바타와 인삿말 */}
        <div className="flex flex-col items-center text-center">
          <UserCircle className="text-gray-400" size={60} />
          <h2 className="text-xl font-bold text-[#2E384D] mt-2">
            안녕하세요, {formData?.username} 님!
          </h2>
          <p className="text-gray-500 text-sm">
            계정 설정 및 활동을 관리하세요.
          </p>
        </div>

        {/* ✅ 포인트 카드 */}
        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Coins className="text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">보유 코인</p>
              <p className="text-lg font-semibold text-green-600">
                {point.toLocaleString()}P
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/swings/mypage/points")}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            내역 보기
          </button>
        </div>

        {/* ✅ 설정 액션 버튼들 */}
        <div className="space-y-3">
          <ActionButton
            icon={<Settings size={18} />}
            text="회원정보 수정"
            color="indigo"
            onClick={() => navigate("/swings/mypage/update")}
          />
          <ActionButton
            icon={<KeyRound size={18} />}
            text="비밀번호 변경"
            color="blue"
            onClick={() => navigate("/swings/mypage/passwordchange")}
          />
          <ActionButton
            icon={<Trash2 size={18} />}
            text="회원 탈퇴"
            color="red"
            onClick={() => navigate("/swings/mypage/userdelete")}
          />
        </div>

        {/* ✅ 로그아웃 */}
        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 flex items-center justify-center gap-1"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, text, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 bg-${color}-500 hover:bg-${color}-600 text-white font-semibold py-2 px-4 rounded-lg shadow`}
    >
      {icon}
      {text}
    </button>
  );
}
