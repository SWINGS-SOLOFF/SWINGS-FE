import { useState } from "react";
import { resetPassword } from "../api/userApi";
import { X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FindPasswordModal({ onClose }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await resetPassword({ username, email });
      setMessage("✅ " + res.data);
      setShowResultModal(true);
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "에러가 발생했습니다."));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setShowResultModal(false);
    onClose();
    navigate("/swings");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            비밀번호 찾기
          </h2>
          <p className="text-gray-500 text-sm mb-4 leading-tight">
            아이디와 이메일을 입력하면
            <br />
            임시 비밀번호가 이메일로 전송됩니다.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="아이디 입력"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded text-black"
            />

            <input
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded text-black"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                username && email
                  ? "bg-custom-purple hover:bg-pink-400"
                  : "bg-custom-purple-empty"
              } text-white py-2 rounded font-semibold transition`}
            >
              {loading ? "전송 중..." : "임시 비밀번호 보내기"}
            </button>
          </form>

          {message && !showResultModal && (
            <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
              {message}
            </div>
          )}
        </div>
      </div>

      {showResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-sm animate-fadeIn">
            <CheckCircle className="mx-auto text-green-500 w-12 h-12 mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              임시 비밀번호 전송 완료
            </h3>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              입력하신 이메일로
              <br />
              임시 비밀번호가 전송되었습니다.
            </p>
            <button
              onClick={handleConfirm}
              className="w-full bg-custom-purple hover:bg-pink-400 text-white py-2 rounded-lg font-semibold transition"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
