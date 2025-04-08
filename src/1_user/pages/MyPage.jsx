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
  Pencil,
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
        <div className="flex items-center justify-center text-gray-400 h-[calc(100vh-128px)]">
          로딩 중...
        </div>
    );
  }

  return (
      <div className="bg-gradient-to-b from-white to-[#f9f9fb] px-4 py-8 min-h-screen font-sans">
        {/* 🧑‍🎤 프로필 영역 */}
        <div className="flex flex-col items-center text-center mb-8 relative">
          {formData?.userImg ? (
              <img
                  src={getProfileImageUrl(formData.userImg)}
                  alt="프로필"
                  className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
              />
          ) : (
              <UserCircle className="text-gray-300" size={80} />
          )}
          <h2 className="text-2xl font-extrabold text-gray-800 mt-3 tracking-tight">
            @{formData?.username}
          </h2>
        </div>

        {/* ✨ 선으로 구분되는 통계 */}
        <div className="flex justify-around text-center text-sm py-4 border-y border-gray-200 mb-6">
          <div>
            <p className="font-semibold text-gray-900">2</p>
            <p className="text-gray-500">피드</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">0</p>
            <p className="text-gray-500">팔로워</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">0</p>
            <p className="text-gray-500">팔로잉</p>
          </div>
        </div>

        {/* 💰 글래스 스타일 코인 카드 */}
        <div className="backdrop-blur-sm bg-white/80 border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Coins size={18} className="text-yellow-500" />
              <span className="text-sm">보유 코인</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {point.toLocaleString()}P
            </div>
          </div>
          <button
              onClick={() => navigate("/swings/mypage/points")}
              className="mt-3 w-full text-center text-sm text-purple-600 hover:underline"
          >
            코인 내역 보기 →
          </button>
        </div>

        {/* ⚙️ 감성 설정 액션들 */}
        <div className="space-y-3">
          <LineAction
              icon={<Settings size={18} />}
              text="회원정보 수정"
              onClick={() => navigate("/swings/mypage/update")}
          />
          <LineAction
              icon={<ImageIcon size={18} />}
              text="프로필 사진 수정"
              onClick={() => navigate("/swings/mypage/profileImage")}
          />
          <LineAction
              icon={<KeyRound size={18} />}
              text="비밀번호 변경"
              onClick={() => navigate("/swings/mypage/passwordchange")}
          />
          <LineAction
              icon={<Trash2 size={18} />}
              text="회원 탈퇴"
              textColor="text-red-500"
              onClick={() => navigate("/swings/mypage/userdelete")}
          />
        </div>

        {/* 🔻 로그아웃 */}
        <div className="text-center mt-10 text-sm">
          <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 transition"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </div>
  );
}

function LineAction({ icon, text, onClick, textColor = "text-gray-700" }) {
  return (
      <button
          onClick={onClick}
          className={`w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition ${textColor}`}
      >
        <div className="flex items-center gap-3 text-sm font-medium">{icon} {text}</div>
        <span className="text-gray-300">›</span>
      </button>
  );
}
