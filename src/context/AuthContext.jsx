import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);

  // 로그인 함수 (토큰 저장)
  const login = (newToken) => {
    setToken(newToken);
    sessionStorage.setItem("token", newToken);
  };

  // 로그아웃 함수 (토큰 삭제)
  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 훅 제공
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
