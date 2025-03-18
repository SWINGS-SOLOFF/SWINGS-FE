import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  const isAuthenticated = localStorage.getItem("token"); // 로그인 여부 확인

  return (
    <Routes>
      <Route path="/swings/home" element={<Home />} />
      <Route
        path="/swings/login"
        element={isAuthenticated ? <Navigate to="/swings/home" /> : <Login />}
      />
      <Route
        path="/swings/auth/login"
        element={<Navigate to="/swings/home" />}
      />
    </Routes>
  );
}

export default App;
