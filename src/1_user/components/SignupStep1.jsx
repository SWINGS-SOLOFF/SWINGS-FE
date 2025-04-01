import { useState } from "react";
import { checkUsername } from "../api/userApi";

export default function SignupStep1({ formData, updateData }) {
  const [usernameMsg, setUsernameMsg] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 아이디 중복 확인
  const handleUsernameCheck = async () => {
    if (!formData.username) {
      setUsernameMsg("아이디를 입력해주세요.");
      return;
    }

    try {
      const exists = await checkUsername(formData.username);
      if (exists) {
        setUsernameMsg("이미 존재하는 아이디입니다.");
      } else {
        setUsernameMsg("사용 가능한 아이디입니다.");
      }
    } catch (err) {
      setUsernameMsg("아이디 확인 중 오류 발생");
    }
  };

  const passwordMatch =
    formData.password && passwordConfirm
      ? formData.password === passwordConfirm
      : true;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-600 mb-1">아이디</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.username || ""}
            onChange={(e) => {
              updateData({ username: e.target.value });
              setUsernameMsg("");
            }}
            className="flex-1 border rounded p-2 text-black"
          />
          <button
            type="button"
            onClick={handleUsernameCheck}
            className="px-3 py-2 text-sm  bg bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            중복확인
          </button>
        </div>
        {usernameMsg && (
          <p
            className={`text-sm mt-1 ${
              usernameMsg.includes("가능") ? "text-green-500" : "text-red-500"
            }`}
          >
            {usernameMsg}
          </p>
        )}
      </div>

      <div>
        <label className="block text-gray-600 mb-1">비밀번호</label>
        <input
          type="password"
          value={formData.password || ""}
          onChange={(e) => updateData({ password: e.target.value })}
          className="w-full border rounded p-2 text-black"
        />
      </div>

      <div>
        <label className="block text-gray-600 mb-1">비밀번호 확인</label>
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className="w-full border rounded p-2 text-black"
        />
        {formData.password && passwordConfirm && !passwordMatch && (
          <p className="text-sm text-red-500 mt-1">
            비밀번호가 일치하지 않습니다.
          </p>
        )}
      </div>

      <div>
        <label className="block text-gray-600 mb-1">이름</label>
        <input
          type="text"
          value={formData.name || ""}
          onChange={(e) => updateData({ name: e.target.value })}
          className="w-full border rounded p-2 text-black"
        />
      </div>

      <div>
        <label className="block text-gray-600 mb-1">전화번호</label>
        <input
          type="tel"
          value={formData.phonenumber || ""}
          onChange={(e) => updateData({ phonenumber: e.target.value })}
          className="w-full border rounded p-2 text-black"
        />
      </div>
    </div>
  );
}
