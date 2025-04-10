import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { changePassword, fetchUserData } from "../api/userApi";
import { validatePasswordMatch } from "../utils/userUtils";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PasswordChangeForm({ isModal = false, onClose }) {
  const { token } = useAuth();
  const [username, setUsername] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
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
      setMessage("✅ 비밀번호가 성공적으로 변경되었습니다.");
      setNewPassword("");
      setConfirmPassword("");

      if (isModal && onClose) onClose(); // ✅ 모달일 경우 자동 닫기
    } catch (err) {
      console.error(err);
      setMessage("❌ 비밀번호 변경 중 오류가 발생했습니다.");
    }
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
          className="w-full border border-gray-300 p-2 rounded text-black text-sm"
          required
        />

        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded text-black text-sm"
          required
        />

        {message && (
          <p
            className={`text-xs text-center ${
              message.includes("성공") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded w-full text-sm hover:bg-blue-700 transition"
        >
          비밀번호 변경
        </button>
      </form>
    </div>
  );
}
