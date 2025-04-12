// SignupStep1.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  handleUsernameCheckLogic,
  prefillFromOAuthState,
} from "../utils/userUtils";

export default function SignupStep1({ formData, updateData }) {
  const [usernameCheck, setUsernameCheck] = useState("");
  // ✨ 아이디 입력 에러메시지 관리
  const [usernameError, setUsernameError] = useState("");
  const location = useLocation();

  // ✅ 구글 OAuth로부터 값 채우기
  useEffect(() => {
    prefillFromOAuthState(location, formData, updateData);
  }, [location.state, formData.email, formData.name, updateData]);

  const handleUsernameCheck = () => {
    handleUsernameCheckLogic(formData.username, setUsernameCheck);
  };

  // ✨ 아이디 입력 처리
  const handleUsernameChange = (e) => {
    const inputValue = e.target.value;
    // 영어/숫자만 남기고 나머지는 제거
    const alphanumericOnly = inputValue.replace(/[^A-Za-z0-9]/g, "");

    if (inputValue.length !== alphanumericOnly.length) {
      // 제거된 문자가 있다면 곧바로 에러 메시지 표시
      setUsernameError("아이디는 영어와 숫자만 사용 가능합니다.");
    } else {
      setUsernameError("");
    }

    updateData({ username: alphanumericOnly });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-col">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="아이디"
            className="flex-1 border p-2 rounded text-black"
            value={formData.username || ""}
            onChange={handleUsernameChange}
          />
          <button
            className="px-3 py-2 text-sm bg-blue-500 text-white rounded"
            onClick={handleUsernameCheck}
          >
            중복 확인
          </button>
        </div>
        {/* ✨ usernameError가 존재하면 빨간 텍스트로 표시 */}
        {usernameError && (
          <p className="text-sm text-red-500 ml-1">{usernameError}</p>
        )}
      </div>

      {usernameCheck && (
        <p className="text-sm text-gray-500 ml-1">{usernameCheck}</p>
      )}

      <input
        type="password"
        placeholder="비밀번호"
        className="w-full border p-2 rounded text-black"
        value={formData.password || ""}
        onChange={(e) => updateData({ password: e.target.value })}
      />
      <input
        type="password"
        placeholder="비밀번호 확인"
        className="w-full border p-2 rounded text-black"
        value={formData.confirmPassword || ""}
        onChange={(e) => updateData({ confirmPassword: e.target.value })}
      />
      <input
        type="text"
        placeholder="이름"
        className="w-full border p-2 rounded text-black"
        value={formData.name || ""}
        onChange={(e) => updateData({ name: e.target.value })}
      />
      <input
        type="email"
        placeholder="이메일"
        className="w-full border p-2 rounded text-black"
        value={formData.email || ""}
        onChange={(e) => updateData({ email: e.target.value })}
      />
    </div>
  );
}
