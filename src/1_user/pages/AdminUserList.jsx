import { useState, useEffect } from "react";
import { fetchAllUsers } from "../api/userApi";
import UserDetailModal from "../components/UserDetailModal";

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await fetchAllUsers();
    setUsers(data);
  };

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="p-8 bg-white min-h-screen">
          <br/>
          <br/>
      <h1 className="text-2xl font-bold mb-4 text-gray-800">전체 유저 목록</h1>

      <input
        className="p-2 border rounded mb-4 w-full max-w-md text-black"
        placeholder="아이디 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100 text-black">
            <th className="p-2 border">아이디</th>
            <th className="p-2 border">이름</th>
            <th className="p-2 border">역할</th>
            <th className="p-2 border">관리</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user) => (
            <tr key={user.username}>
              <td className="p-2 border text-black">{user.username}</td>
              <td className="p-2 border text-black">{user.name}</td>
              <td className="p-2 border text-black">{user.role}</td>
              <td className="p-2 border text-black">
                <button
                  onClick={() => setSelectedUser(user.username)}
                  className="text-blue-500 hover:underline"
                >
                  상세보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <UserDetailModal
          username={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdated={() => {
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
