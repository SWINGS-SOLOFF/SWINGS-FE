import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchUserData,
  getPointBalance,
  getProfileImageUrl,
} from "../api/userApi";
import { removeToken } from "../utils/userUtils";
import {
  Coins,
  LogOut,
  Settings,
  KeyRound,
  Trash2,
  UserCircle,
  ImageIcon,
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
      <div className="flex items-center justify-center text-gray-500 h-[calc(100vh-128px)]">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-slate-100 px-4 py-8 min-h-screen">
      <div className="max-w-md mx-auto space-y-8">
        {/* ✅ 프로필 섹션 */}
        <div className="flex flex-col items-center text-center">
          {formData?.userImg ? (
            <img
              src={getProfileImageUrl(formData.userImg)}
              alt="프로필"
              className="w-24 h-24 object-cover rounded-full border border-gray-300 shadow-md"
            />
          ) : (
            <UserCircle className="text-gray-400" size={64} />
          )}
          <h2 className="text-xl font-bold text-gray-800 mt-3">
            안녕하세요, {formData?.username} 님!
          </h2>
          <p className="text-sm text-gray-500">
            계정 설정 및 활동을 관리하세요.
          </p>
        </div>

        {/* ✅ 포인트 */}
        <div className="bg-white rounded-xl shadow-md px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Coins className="text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">보유 코인</p>
              <p className="text-xl font-bold text-green-600">
                {point.toLocaleString()}P
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/swings/mypage/points")}
            className="text-sm text-blue-600 hover:underline"
          >
            내역 보기
          </button>
        </div>

        {/* ✅ 액션 버튼들 */}
        <div className="grid gap-3">
          <ActionCard
            icon={<Settings size={20} />}
            text="회원정보 수정"
            bg="bg-green-100"
            textColor="text-green-700"
            onClick={() => navigate("/swings/mypage/update")}
          />
          <ActionCard
            icon={<ImageIcon size={20} />}
            text="프로필 사진 수정"
            bg="bg-yellow-100"
            textColor="text-yellow-700"
            onClick={() => navigate("/swings/mypage/profileImage")}
          />
          <ActionCard
            icon={<KeyRound size={20} />}
            text="비밀번호 변경"
            bg="bg-blue-100"
            textColor="text-blue-700"
            onClick={() => navigate("/swings/mypage/passwordchange")}
          />
          <ActionCard
            icon={<Trash2 size={20} />}
            text="회원 탈퇴"
            bg="bg-red-100"
            textColor="text-red-700"
            onClick={() => navigate("/swings/mypage/userdelete")}
          />
        </div>

        {/* ✅ 로그아웃 */}
        <div className="text-center pt-2">
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 transition"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, text, bg, textColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl ${bg} ${textColor} font-semibold shadow hover:shadow-md hover:scale-[1.01] transition-all duration-200`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
}
