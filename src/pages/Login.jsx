import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  /** 🔹 로그인 요청 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // 기존 에러 초기화

    try {
      const response = await fetch("http://localhost:8090/swings/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "로그인 실패. 다시 시도해주세요.");
      }

      // 서버에서 JWT 토큰 응답 받았다고 가정하고 로컬 스토리지에 저장
      localStorage.setItem("token", data.token);

      alert("로그인 성공!");
      navigate("/"); // 홈으로 이동
    } catch (error) {
      console.error("로그인 실패:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">로그인</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          아이디:
          <input
            type="text"
            placeholder="아이디를 입력하세요"
            className="w-full border p-2 rounded text-black"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </label>

        <label className="block">
          비밀번호:
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            className="w-full border p-2 rounded text-black"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </label>

        {/* 로그인 실패 메시지 */}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
