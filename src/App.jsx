import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MatchGroupRoutes from "./4_matchgroup/routes/MatchGroupRoutes.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<MatchGroupRoutes />} />
            </Routes>
        </Router>
    );
}

export default App;
