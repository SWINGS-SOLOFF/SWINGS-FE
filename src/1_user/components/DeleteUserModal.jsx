import { useState } from "react";
import { deleteUserWithPassword } from "../api/userApi";
import { removeToken } from "../utils/userUtils";
import { useNavigate } from "react-router-dom";

export default function DeleteUserModal({ onClose }) {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await deleteUserWithPassword(password);
      alert("회원 탈퇴가 완료되었습니다.");
      removeToken();
      navigate("/swings");
    } catch (err) {
      alert("❌ 비밀번호가 틀렸거나 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">비밀번호 확인</h2>
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black text-sm"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded text-sm"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 bg-black text-white rounded text-sm"
            onClick={handleSubmit}
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
}
