// MatchRoutes.jsx

import React from "react";
import { Route ,Routes} from "react-router-dom";
import SwipePage from "../pages/SwipePage";
/**
 * MatchRoutes
 * App.jsx의 <Routes> 안에서 사용할 <Route> 요소만 리턴합니다.
 */
const MatchRoutes = () => (
    <Routes>
        <Route path="" element={<SwipePage />} />                // → /swings/match

    </Routes>
);


export default MatchRoutes;
