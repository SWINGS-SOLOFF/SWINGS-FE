import { useEffect, useState } from "react";
import {
  getUserByUsername,
  updateUserRole,
  deleteUserByAdmin,
} from "../api/userApi";

export default function UserDetailModal({ username, onClose, onUpdated }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserByUsername(username);
        setUser(data);
        setRole(data.role);
      } catch (error) {
        console.error("유저 정보를 불러오는 데 실패했습니다.", error);
      }
    })();
  }, [username]);

  if (!user) return null;

  const handleRoleUpdate = async () => {
    try {
      await updateUserRole(username, role);
      alert("✅ 역할이 성공적으로 변경되었습니다.");
      onUpdated();
    } catch (error) {
      alert("❌ 역할 변경 중 오류 발생");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말 이 유저를 탈퇴시키겠습니까?")) {
      try {
        await deleteUserByAdmin(username);
        alert("✅ 유저가 탈퇴 처리되었습니다.");
        onUpdated();
      } catch (error) {
        alert("❌ 유저 탈퇴 중 오류 발생");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">유저 상세정보</h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>아이디:</strong> {user.username}
          </p>
          <p>
            <strong>이름:</strong> {user.name}
          </p>
          <p>
            <strong>성별:</strong> {user.gender}
          </p>
          <p>
            <strong>직업:</strong> {user.job}
          </p>
          <p>
            <strong>골프 스킬:</strong> {user.golfSkill}
          </p>
          <p>
            <strong>역할:</strong> {user.role}
          </p>
        </div>

        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            역할 변경
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded w-full text-black"
          >
            <option value="player">player</option>
            <option value="admin">admin</option>
          </select>
          <button
            onClick={handleRoleUpdate}
            className="mt-2 px-4 py-1 bg-green-500 text-white rounded"
          >
            역할 변경
          </button>
        </div>

        <hr className="my-6" />

        <button
          onClick={handleDelete}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          강제 탈퇴
        </button>
      </div>
    </div>
  );
}
