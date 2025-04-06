import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./1_user/context/AuthContext.jsx";
import { NotificationProvider } from "./5_notification/context/NotificationContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ 추가

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("✅ 구글 클라이언트 ID:", clientId); // 이 줄 추가!
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
