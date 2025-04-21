import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./1_user/context/AuthContext.jsx";
import { NotificationProvider } from "./5_notification/context/NotificationProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { registerFCM } from "./utils/fcmRegister.js";

// ✅ DOMContentLoaded 이후에 클래스 적용
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(display-mode: standalone)").matches) {
    document.body.classList.add("pwa-scroll-hidden");
  }
});

// 구글 로그인
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// 서비스워커 + 토큰 등록
const username = localStorage.getItem("username"); // ✅ 로그인 성공 시 저장된 사용자 이름
if (username) {
  registerFCM(username);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
