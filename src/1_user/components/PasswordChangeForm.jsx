import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function PasswordChangeForm({ username }) {
  const { token } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8090/swings/users/${username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (!response.ok) {
        throw new Error("비밀번호 변경 실패");
      }

      setMessage("비밀번호가 성공적으로 변경되었습니다.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setMessage("오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <label className="block">
        새 비밀번호:
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block">
        비밀번호 확인:
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      {message && <p className="text-sm text-red-500">{message}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded w-full"
      >
        비밀번호 변경
      </button>
    </form>
  );
}
