// src/components/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export default function NavBar() {
  const navigate = useNavigate();

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
                MYPAGE
              </Link>
            </>
          ) : (
            <>
              <Link to="/swings/login">LOGIN</Link>
              <Link
                to="/swings/signup"
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
