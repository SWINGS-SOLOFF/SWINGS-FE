import { Link } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="App">
      {/* 네비게이션 바 */}
      <nav className="p-4 bg-gray-800 text-white flex space-x-4">
        <Link to="/">홈</Link>
        <Link to="/login">로그인</Link>
        <Link to="/signup" className="bg-blue-500 px-4 py-2 rounded">
          회원가입
        </Link>
      </nav>

      {/* 라우트 설정 */}
      <AppRoutes />
    </div>
  );
}

export default App;
