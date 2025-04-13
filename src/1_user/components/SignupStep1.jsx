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

  useEffect(() => {
    prefillFromOAuthState(location, formData, updateData);
  }, [location.state, formData.email, formData.name, updateData]);

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

    // 비밀번호 확인값과 일치하는지도 체크
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
        {usernameError && (
          <p className="text-sm text-red-500 ml-1">{usernameError}</p>
        )}
      </div>

      {usernameCheck && (
        <p className="text-sm text-gray-500 ml-1">{usernameCheck}</p>
      )}

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
