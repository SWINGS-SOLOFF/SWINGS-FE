import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./1_user/context/AuthContext.jsx";
import { NotificationProvider } from "./5_notification/context/NotificationProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ 구글 로그인용

// ✅ DOMContentLoaded 이후에 클래스 적용
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(display-mode: standalone)").matches) {
    document.body.classList.add("pwa-scroll-hidden");
  }
});

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("✅ 구글 클라이언트 ID:", clientId); // 디버깅용

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
