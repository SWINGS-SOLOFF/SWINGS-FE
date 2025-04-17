import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { changePassword, fetchUserData } from "../api/userApi";
import { validatePasswordMatch } from "../utils/userUtils";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { removeToken } from "../utils/userUtils";

export default function PasswordChangeForm({ isModal = false, onClose }) {
  const { token } = useAuth();
  const [username, setUsername] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false); // ✅ 모달 상태
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsername = async () => {
      try {
        const user = await fetchUserData();
        setUsername(user.username);
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
        setMessage("로그인이 필요합니다.");
      }
    };
    loadUsername();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const error = validatePasswordMatch(newPassword, confirmPassword);
    if (error) {
      setMessage(error);
      return;
    }

    try {
      await changePassword(username, newPassword);
      setMessage("비밀번호 변경 완료");
      setNewPassword("");
      setConfirmPassword("");

      // ✅ 모달 열기
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setMessage("비밀번호 변경 실패");
    }
  };

  const handleLogout = () => {
    removeToken(); // ✅ 로그아웃 처리
    navigate("/swings"); // ✅ 이동
  };

  if (!username) {
    return (
      <div className="min-h-[150px] flex items-center justify-center text-gray-500 text-sm">
        사용자 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div
      className={`${
        isModal ? "" : "min-h-screen"
      } flex flex-col items-center justify-start px-4`}
    >
      {!isModal && (
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-500 hover:text-black transition-colors z-50"
        >
          <ArrowLeft size={24} />
        </button>
      )}

      <form
        onSubmit={handleSubmit}
        className={`space-y-4 mt-4 w-full ${
          isModal ? "max-w-xs" : "max-w-md"
        } p-2`}
      >
        <h2 className="text-base font-bold text-gray-800 mb-3 text-center">
          비밀번호 변경
        </h2>

        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded text-black text-sm outline-none focus:outline-none"
          required
        />

        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded text-black text-sm outline-none focus:outline-none"
          required
        />

        {message && (
          <p
            className={`text-xs text-center font-bold ${
              message.includes("완료") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className="bg-custom-pink text-white py-2 rounded w-full text-sm font-bold transition"
        >
          비밀번호 변경
        </button>
      </form>

      {/* ✅ 비밀번호 변경 성공 시 표시되는 모달 */}
      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center px-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center space-y-4">
            <Dialog.Title className="text-lg font-bold text-black">
              비밀번호 변경 완료
            </Dialog.Title>
            <p className="text-sm font-bold text-gray-700">
              다시 로그인해주세요.
            </p>
            <button
              onClick={handleLogout}
              className="bg-custom-pink text-white px-4 py-2 rounded-xl font-bold shadow-md hover:brightness-110 transition duration-300"
            >
              확인
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
