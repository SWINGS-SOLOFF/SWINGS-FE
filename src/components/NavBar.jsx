import { Link } from "react-router-dom";
import { useAuth } from "../1_user/context/AuthContext.jsx";

export default function NavBar() {
  const { token, logout } = useAuth(); // ✅ 토큰 및 로그아웃 함수 가져오기

  const handleLogout = () => {
    logout();
    window.location.reload(); // 상태 반영을 위해 새로고침
  };

  return (
    <nav className="w-full bg-gray-800 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-bold">
          SWINGS
        </Link>
        <div className="space-x-4">
          {token ? (
            <>
              <Link to="/" onClick={handleLogout} className="text-red-400">
                LOGOUT
              </Link>
              <Link to="/mypage" className="text-green-400">
                MYPAGE
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">LOGIN</Link>
              <Link
                to="/signup"
                className="bg-pink-500 text-white px-4 py-1 rounded"
              >
                SIGNUP
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
