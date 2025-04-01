import { checkUsername } from "../api/userApi";
import { useState } from "react";

export default function SignupStep1({ formData, updateData }) {
  const [usernameCheck, setUsernameCheck] = useState("");

  const handleUsernameCheck = async () => {
    if (!formData.username) {
      setUsernameCheck("아이디를 입력해주세요.");
      return;
    }
    const exists = await checkUsername(formData.username);
    setUsernameCheck(
      exists ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다."
    );
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
        className="w-full border p-2 rounded
        text-black"
        value={formData.email || ""}
        onChange={(e) => updateData({ email: e.target.value })}
      />
    </div>
  );
}
