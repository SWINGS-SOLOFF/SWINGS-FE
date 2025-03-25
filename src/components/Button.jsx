import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MatchGroupList from "../4_matchgroup/pages/MatchGroupList.jsx";
import CreateMatchGroup from "../4_matchgroup/pages/CreateMatchGroup.jsx";
import MatchGroupDetail from "../4_matchgroup/pages/MatchGroupDetail.jsx";
import LoginPage from "../1_user/pages/LoginPage.jsx";

const UserRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/matchgroup" element={<MatchGroupList />} />
                <Route path="/matchgroup/create" element={<CreateMatchGroup />} />
                <Route path="/matchgroup/:id" element={<MatchGroupDetail />} />
            </Routes>
        </Router>
    );
};

export default UserRoutes;
