// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("로그인 시도:", formData);
    alert("로그인 기능은 아직 구현되지 않았습니다.");
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">로그인</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          아이디:
          <input
            type="text"
            className="w-full border p-2 rounded"
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
            className="w-full border p-2 rounded"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </label>

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
