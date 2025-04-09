import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { changePassword, fetchUserData } from "../api/userApi";
import { validatePasswordMatch } from "../utils/userUtils";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import { ArrowLeft } from "lucide-react";

export default function PasswordChangeForm() {
  const { token } = useAuth();
  const [username, setUsername] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ 추가

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
    } catch (err) {
      console.error(err);
      setMessage("❌ 비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        사용자 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-4">
      {/* ✅ 뒤로가기 버튼 */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-500 hover:text-black transition-colors z-50"
      >
        <ArrowLeft size={24} />
      </button>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mt-6 max-w-md w-full p-4"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          비밀번호 변경
        </h2>

        <label className="block">
          새 비밀번호:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded text-black"
            required
          />
        </label>

        <label className="block">
          비밀번호 확인:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded text-black"
            required
          />
        </label>

        {message && (
          <p
            className={`text-sm text-center ${
              message.includes("성공") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
        >
          비밀번호 변경
        </button>
      </form>
    </div>
  );
}
