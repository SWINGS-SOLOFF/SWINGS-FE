import { Link } from "react-router-dom";
import { useAuth } from "../1_user/context/AuthContext.jsx";

export default function NavBar() {
  const { token, logout } = useAuth(); // ✅ 토큰 및 로그아웃 함수 가져오기

  const handleLogout = () => {
    logout();
    window.location.reload(); // 상태 반영을 위해 새로고침
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-center items-center space-x-4 w-full">
      <Link to="/">SWINGS</Link>
      {token ? (
        <>
          <Link to="/" onClick={handleLogout} className="text-red-500">
            LOGOUT
          </Link>
          <Link to="/mypage" className="text-green-500">
            MYPAGE
          </Link>
        </>
      ) : (
        <>
          <Link to="/login">LOGIN</Link>
          <Link
            to="/signup"
            className="bg-pink-500 text-white px-4 py-2 rounded"
          >
            SIGNUP
          </Link>
        </>
      )}
    </nav>
  );
}
