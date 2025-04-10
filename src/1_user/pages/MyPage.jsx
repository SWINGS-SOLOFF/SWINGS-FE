import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchUserData,
  getPointBalance,
  getProfileImageUrl,
  updateUserInfo,
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
  ArrowLeft,
  Pencil,
  X,
} from "lucide-react";
import IntroduceEditor from "../components/IntroduceEditor";
import ProfileImageUploader from "../components/ProfileImageUploader";
import PasswordChangeForm from "../components/PasswordChangeForm";
import { toast } from "react-toastify";

export default function MyPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [point, setPoint] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false); // ✅ 추가

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
    <div className="bg-gradient-to-b from-white to-[#f9f9fb] px-4 py-8 min-h-screen font-sans relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition z-10"
        aria-label="뒤로가기"
      >
        <ArrowLeft size={20} className="text-gray-600" />
      </button>

      {/* 프로필 영역 */}
      <div className="flex flex-col items-center text-center mb-8">
        <div
          className="relative w-24 h-24 cursor-pointer group"
          onClick={() => setShowImageModal(true)}
          title="프로필 이미지 수정"
        >
          {formData?.userImg ? (
            <img
              src={getProfileImageUrl(formData.userImg)}
              alt="프로필"
              className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md group-hover:brightness-95 transition"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 border-4 border-white shadow-md group-hover:brightness-95 transition">
              <UserCircle className="text-gray-300" size={80} />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border shadow group-hover:scale-105 transition">
            <Pencil size={16} className="text-gray-600" />
          </div>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800 mt-3 tracking-tight">
          @{formData?.username}
        </h2>
      </div>

      {/* 자기소개 수정 */}
      {formData && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="text-sm text-gray-500 mb-2">프로필 메시지</div>
          <IntroduceEditor
            initialText={formData.introduce || ""}
            onSave={async (newText) => {
              try {
                await updateUserInfo(formData.userId, newText);
                setFormData({ ...formData, introduce: newText });
                toast.success("자기소개가 저장되었습니다.");
              } catch (err) {
                toast.error("자기소개 저장 실패");
              }
            }}
          />
        </div>
      )}

      {/* 보유 코인 */}
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

      {/* 설정 액션들 */}
      <div className="space-y-3">
        <LineAction
          icon={<Settings size={18} />}
          text="회원정보 수정"
          onClick={() => navigate("/swings/mypage/update")}
        />
        <LineAction
          icon={<KeyRound size={18} />}
          text="비밀번호 변경"
          onClick={() => setShowPasswordModal(true)} // ✅ 모달로 변경
        />
        <LineAction
          icon={<Trash2 size={18} />}
          text="회원 탈퇴"
          textColor="text-red-500"
          onClick={() => navigate("/swings/mypage/userdelete")}
        />
      </div>

      {/* 로그아웃 */}
      <div className="text-center mt-10 text-sm">
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-500 flex items-center justify-center gap-1 transition"
        >
          <LogOut size={16} />
          로그아웃
        </button>
      </div>

      {/* ✅ 이미지 수정 모달 */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <ProfileImageUploader
            imageFile={imageFile}
            setImageFile={setImageFile}
            initialImage={formData?.userImg}
            onClose={() => setShowImageModal(false)}
            onComplete={(filename) =>
              setFormData({ ...formData, userImg: filename })
            }
          />
        </div>
      )}

      {/* ✅ 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            <PasswordChangeForm isModal />
          </div>
        </div>
      )}
    </div>
  );
}

function LineAction({ icon, text, onClick, textColor = "text-gray-700" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition ${textColor}`}
    >
      <div className="flex items-center gap-3 text-sm font-medium">
        {icon} {text}
      </div>
      <span className="text-gray-300">›</span>
    </button>
  );
}
