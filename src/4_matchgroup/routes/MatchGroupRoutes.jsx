import {Route, Routes} from "react-router-dom";

const MatchGroupRoutes = () => {
    return(
        <Router>
            <Routes>
                <Route path="/matchgroup" element={<MatchGroupPage />}/>
                <Route path="/matchgroup/:id" element={<MatchGroupDetailPage />} />
            </Routes>
        </Router>
    );
};

export default MatchGroupRoutes;