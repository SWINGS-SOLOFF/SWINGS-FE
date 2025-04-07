import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./1_user/context/AuthContext.jsx";
import {NotificationProvider} from "./5_notification/context/NotificationProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
          <NotificationProvider>
              <App />
          </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
