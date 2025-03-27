import { Link, useNavigate } from "react-router-dom"; // ✅ useNavigate 추가
import { useAuth } from "../1_user/context/AuthContext.jsx";

export default function NavBar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate(); // ✅ navigate 정의

  const handleLogout = () => {
    logout();
    navigate("/swings"); // ✅ 로그아웃 후 /swings로 이동
  };

  return (
    <nav className="w-full bg-gray-800 text-white px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/swings/home" className="text-lg font-bold">
          SWINGS
        </Link>
        <div className="space-x-4">
          {token ? (
            <>
              <button onClick={handleLogout} className="text-red-400">
                LOGOUT
              </button>
              <Link to="/swings/mypage" className="text-green-400">
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
