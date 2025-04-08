import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  handleUsernameCheckLogic,
  prefillFromOAuthState,
} from "../utils/userUtils";

export default function SignupStep1({ formData, updateData }) {
  const [usernameCheck, setUsernameCheck] = useState("");
  const location = useLocation();

  // ✅ 구글 OAuth로부터 값 채우기
  useEffect(() => {
    prefillFromOAuthState(location, formData, updateData);
  }, [location.state, formData.email, formData.name, updateData]);

  const handleUsernameCheck = () => {
    handleUsernameCheckLogic(formData.username, setUsernameCheck);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="아이디"
          className="flex-1 border p-2 rounded text-black"
          value={formData.username || ""}
          onChange={(e) => updateData({ username: e.target.value })}
        />
        <button
          className="px-3 py-2 text-sm bg-blue-500 text-white rounded"
          onClick={handleUsernameCheck}
        >
          중복 확인
        </button>
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
