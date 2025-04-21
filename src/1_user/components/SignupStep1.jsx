import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  handleUsernameCheckLogic,
  prefillFromOAuthState,
} from "../utils/userUtils";

export default function SignupStep1({ formData, updateData }) {
  const [usernameCheck, setUsernameCheck] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const location = useLocation();

  // 이메일 분할 상태
  const [emailLocal, setEmailLocal] = useState(
    formData.email?.split("@")[0] || ""
  );
  const [emailDomain, setEmailDomain] = useState(
    formData.email?.split("@")[1] || "naver.com"
  );
  const [customDomain, setCustomDomain] = useState("");

  const domainOptions = [
    "naver.com",
    "google.com",
    "daum.net",
    "hanmail.net",
    "기타",
  ];

  // 초기 OAuth 데이터 채워 넣기 (formData.email 등은 사용 X)
  useEffect(() => {
    prefillFromOAuthState(location, formData, updateData);
  }, [location.state, updateData]);

  // 이메일 조합 → formData.email에 저장 (무한루프 방지)
  useEffect(() => {
    const newEmail =
      emailDomain === "기타"
        ? `${emailLocal}@${customDomain}`
        : `${emailLocal}@${emailDomain}`;

    if (formData.email !== newEmail) {
      updateData({ email: newEmail });
    }
  }, [emailLocal, emailDomain, customDomain]);

  const handleUsernameCheck = () => {
    handleUsernameCheckLogic(formData.username, setUsernameCheck);
  };

  const handleUsernameChange = (e) => {
    const inputValue = e.target.value;
    const alphanumericOnly = inputValue.replace(/[^A-Za-z0-9]/g, "");

    if (inputValue.length !== alphanumericOnly.length) {
      setUsernameError("아이디는 영어와 숫자만 사용 가능합니다.");
    } else {
      setUsernameError("");
    }

    updateData({ username: alphanumericOnly });
  };

  const validatePassword = (password) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasLowercase && hasNumber && hasSpecial;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    updateData({ password: value });

    if (!validatePassword(value)) {
      setPasswordError(
        "비밀번호는 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다."
      );
    } else {
      setPasswordError("");
    }

    if (formData.confirmPassword && value !== formData.confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    updateData({ confirmPassword: value });

    if (formData.password !== value) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPasswordError("");
    }
  };

  return (
    <div className="space-y-4 outline-none focus:outline-none">
      {/* 아이디 */}
      <div className="flex gap-2 flex-col">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="아이디"
            className="flex-1 border p-2 rounded text-black outline-none focus:outline-none"
            value={formData.username || ""}
            onChange={handleUsernameChange}
          />
          <button
            className="px-3 py-2 text-sm bg-custom-purple text-white rounded font-bold outline-none focus:outline-none"
            onClick={handleUsernameCheck}
          >
            중복 확인
          </button>
        </div>
        {usernameError && (
          <p className="text-sm text-red-500 ml-1">{usernameError}</p>
        )}
        {usernameCheck && (
          <p className="text-sm text-gray-500 ml-1">{usernameCheck}</p>
        )}
      </div>

      {/* 비밀번호 */}
      <div>
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full border p-2 rounded text-black"
          value={formData.password || ""}
          onChange={handlePasswordChange}
        />
        {passwordError && (
          <p className="text-sm text-red-500 ml-1">{passwordError}</p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <input
          type="password"
          placeholder="비밀번호 확인"
          className="w-full border p-2 rounded text-black"
          value={formData.confirmPassword || ""}
          onChange={handleConfirmPasswordChange}
        />
        {confirmPasswordError && (
          <p className="text-sm text-red-500 ml-1">{confirmPasswordError}</p>
        )}
      </div>

      {/* 이름 */}
      <input
        type="text"
        placeholder="이름"
        className="w-full border p-2 rounded text-black"
        value={formData.name || ""}
        onChange={(e) => updateData({ name: e.target.value })}
      />

      {/* 이메일 */}
      <div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="이메일 아이디"
            className="w-[45%] border p-2 rounded text-black"
            value={emailLocal}
            onChange={(e) => setEmailLocal(e.target.value)}
          />
          <span className="text-gray-600">@</span>
          <select
            value={emailDomain}
            onChange={(e) => setEmailDomain(e.target.value)}
            className="w-[50%] border p-2 rounded text-black"
          >
            {domainOptions.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        {/* 기타 도메인 직접 입력 */}
        {emailDomain === "기타" && (
          <input
            type="text"
            placeholder="도메인 직접 입력 (예: mydomain.com)"
            className="mt-2 w-full border p-2 rounded text-black"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
