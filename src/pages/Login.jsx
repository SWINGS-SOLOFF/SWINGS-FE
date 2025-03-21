import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ AuthContext 가져오기

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ login 함수 가져오기

  /** 🔹 로그인 요청 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:8090/swings/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "로그인 실패. 다시 시도해주세요.");
      }
      if (!data.accessToken) {
        throw new Error("토큰을 받지 못했습니다.");
      }

      // ✅ JWT 토큰 저장 및 로그인 상태 변경
      login(data.accessToken);
      localStorage.setItem("token", data.accessToken); // ✅ 수정된 부분

      alert("로그인 성공!");
      navigate("/");
      window.location.reload(); // ✅ UI 반영을 위해 새로고침
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
