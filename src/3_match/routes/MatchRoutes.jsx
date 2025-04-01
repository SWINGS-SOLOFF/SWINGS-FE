// MatchRoutes.jsx

import React from "react";
import { Route ,Routes} from "react-router-dom";
import SwipePage from "../pages/SwipePage";
import ChatRoomPage from "../pages/ChatRoomPage";

/**
 * MatchRoutes
 * App.jsx의 <Routes> 안에서 사용할 <Route> 요소만 리턴합니다.
 */
const MatchRoutes = () => (
    <Routes>
        <Route path="" element={<SwipePage />} />                // → /swings/match
        <Route path="../chat/:roomId" element={<ChatRoomPage />} /> // → /swings/chat/123
    </Routes>
);


export default MatchRoutes;
