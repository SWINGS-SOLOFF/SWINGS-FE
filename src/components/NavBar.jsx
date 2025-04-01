import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token")); // 로컬 스토리지에서 토큰 가져오기
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/swings/login"); // 로그아웃 후 로그인 페이지로 이동
  };

  return (
      <nav className="w-full bg-gray-800 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/swings" className="text-lg font-bold">
            SWINGS
          </Link>
          <div className="space-x-4">
            {token ? (
                <>
                  <Link to="/swings" onClick={handleLogout} className="text-red-400">
                    LOGOUT
                  </Link>
                  <Link to="/swings/mypage" className="text-green-400">
                    My Page
                  </Link>
                  <Link to="/swings/matchgroup" className="bg-pink-500 text-white px-4 py-1 rounded">
                    matchgroup
                  </Link>
                </>
            ) : (
                <>
                  <Link to="/swings/login">LOGIN</Link>
                  <Link to="/swings/signup" className="bg-pink-500 text-white px-4 py-1 rounded">
                    SIGNUP
                  </Link>
                </>
            )}
          </div>
        </div>
      </nav>
  );
}
