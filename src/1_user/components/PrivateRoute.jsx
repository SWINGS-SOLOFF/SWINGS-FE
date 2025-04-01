// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/userUtils";

export default function PrivateRoute({ children }) {
  const token = getToken();

  if (!token) {
    // 토큰이 없으면 로그인 페이지로 강제 이동
    return <Navigate to="/swings" replace />;
  }

  // 토큰이 있으면 해당 컴포넌트 렌더링
  return children;
}
