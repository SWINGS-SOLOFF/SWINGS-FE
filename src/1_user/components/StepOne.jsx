import { useState } from "react";
import { checkUsername } from "../api/userApi";

const StepOne = ({ formData, setFormData, nextStep }) => {
  const [usernameError, setUsernameError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleUsernameCheck = async () => {
    if (!formData.username) {
      setUsernameError("아이디를 입력하세요.");
      return;
    }

    setChecking(true);
    try {
      const exists = await checkUsername(formData.username);
      setUsernameError(
        exists ? "이미 존재하는 아이디입니다." : "사용 가능한 아이디입니다."
      );
    } catch {
      setUsernameError("서버 오류 발생");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">회원가입 - Step 1</h2>

      <label className="block">
        아이디:
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="아이디"
            className="w-full border p-2 rounded text-black"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <button
            onClick={handleUsernameCheck}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={checking}
          >
            {checking ? "확인 중..." : "중복 확인"}
          </button>
        </div>
        {usernameError && (
          <p
            className={`text-sm ${
              usernameError.includes("가능") ? "text-green-500" : "text-red-500"
            }`}
          >
            {usernameError}
          </p>
        )}
      </label>

      <label className="block">
        비밀번호:
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full border p-2 rounded text-black"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </label>

      <label className="block">
        비밀번호 확인:
        <input
          type="password"
          placeholder="비밀번호 확인"
          className="w-full border p-2 rounded text-black"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
        />
        {formData.password !== formData.confirmPassword && (
          <p className="text-red-500 text-sm">비밀번호가 일치하지 않습니다.</p>
        )}
      </label>

      <label className="block">
        이름:
        <input
          type="text"
          placeholder="이름"
          className="w-full border p-2 rounded text-black"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </label>

      <label className="block">
        전화번호:
        <input
          type="text"
          placeholder="전화번호"
          className="w-full border p-2 rounded text-black"
          value={formData.phonenumber}
          onChange={(e) =>
            setFormData({ ...formData, phonenumber: e.target.value })
          }
        />
      </label>

      <label className="block">
        성별:
        <select
          className="w-full border p-2 rounded text-black"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        >
          <option value="">성별 선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
      </label>

      <button
        onClick={nextStep}
        className="w-full bg-blue-500 text-white p-2 rounded mt-4"
        disabled={checking}
      >
        다음 단계
      </button>
    </div>
  );
};

export default StepOne;
