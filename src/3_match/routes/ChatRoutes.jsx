// ChatRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ChatListPage from "../pages/ChatListPage";
import ChatRoomPage from "../pages/ChatRoomPage";
import LikeListPage from "../pages/LikeListPage";

/**
 * ChatRoutes
 * App.jsx의 <Route path="/swings/chat/*" /> 아래에 들어가는 내부 라우트 정의
 */
const ChatRoutes = () => {
    return (
        <Routes>
            <Route path="" element={<ChatListPage />} /> {/* /swings/chat */}
            <Route path=":roomId" element={<ChatRoomPage />} /> {/* /swings/chat/:roomId */}
            <Route path="likes/:userId" element={<LikeListPage />} />

        </Routes>
    );
};

export default ChatRoutes;
