import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MatchRoutes from "./3_match/routes/MatchRoutes";
// import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      {/* <Navigation /> */}
      <Routes>
        <Route path="/*" element={<MatchRoutes />} /> {/* ✅ 정석 사용법 */}
      </Routes>
    </Router>
  );
}

export default App;
