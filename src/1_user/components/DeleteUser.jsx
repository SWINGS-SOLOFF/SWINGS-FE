import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUserWithPassword } from "../api/userApi";
import { removeToken } from "../utils/userUtils";

export default function DeleteUser() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await deleteUserWithPassword(password);
      alert("회원 탈퇴가 완료되었습니다.");
      removeToken(); // 세션 스토리지에서 토큰 제거
      navigate("/swings"); // 로그인 또는 홈 화면으로 이동
    } catch (err) {
      alert("비밀번호가 틀렸거나 오류가 발생했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center">비밀번호 확인</h2>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4 text-black"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => navigate("/swings/mypage")}
          >
            취소
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleSubmit}
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
}
