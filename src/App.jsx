// src/App.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";   // 혹은 NavBar.jsx
import FooterBar from "./1_user/components/FooterBar"; // 경로는 상황에 맞게 조정

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단 공통 네비게이션 */}
      <NavBar />

      {/* 라우터가 렌더링할 각 페이지 */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 하단 공통 푸터 */}
      <FooterBar />
    </div>
  );
}
