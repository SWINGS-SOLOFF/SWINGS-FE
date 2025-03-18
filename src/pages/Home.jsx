import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogin = () => {
    navigate("/swings/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/swings/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">홈 화면</h1>
      {token ? (
        <>
          <p className="text-gray-600">로그인 성공! 여기는 홈 화면입니다.</p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            로그아웃
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          로그인
        </button>
      )}
    </div>
  );
}
