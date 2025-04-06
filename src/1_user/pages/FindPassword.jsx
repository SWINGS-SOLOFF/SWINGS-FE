import { useState } from "react";
import { resetPassword } from "../api/userapi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function FindPassword() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await resetPassword(username);
      setMessage("✅ " + res.data);
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "에러가 발생했습니다."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">비밀번호 찾기</h2>
        <p className="text-gray-500 text-sm mb-6">
          아이디를 입력하면
          <br />
          이메일로 임시 비밀번호가 전송됩니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="아이디 입력"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 text-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded font-semibold"
          >
            {loading ? "전송 중..." : "임시 비밀번호 보내기"}
          </button>
        </form>

        {message && (
          <div className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">
            {message}
          </div>
        )}

        <button
          onClick={() => navigate("/swings")}
          className="mt-6 text-sm text-blue-500 hover:underline"
        >
          로그인 화면으로 돌아가기
        </button>
      </motion.div>
    </div>
  );
}
