import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ AuthContext 가져오기

export default function NavBar() {
  const { token, logout } = useAuth(); // ✅ 토큰 및 로그아웃 함수 가져오기

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-center items-center space-x-4 w-full">
      <Link to="/">SWINGS</Link>
      {token ? (
        <button
          onClick={() => {
            logout();
            window.location.reload(); // ✅ 로그아웃 후 새로고침하여 UI 반영
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          LOGOUT
        </button>
      ) : (
        <Link to="/login">LOGIN</Link>
      )}
      <Link to="/signup" className="bg-pink-500 text-white px-4 py-2 rounded">
        SIGNUP
      </Link>
    </nav>
  );
}
