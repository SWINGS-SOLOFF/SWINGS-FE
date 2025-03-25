import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MatchGroupList from "./4_matchgroup/pages/MatchGroupList.jsx";
import MatchGroupDetail from "./4_matchgroup/pages/MatchGroupDetail.jsx";
import CreateMatchGroup from "./4_matchgroup/pages/CreateMatchGroup.jsx";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/create" element={<CreateMatchGroup />} />
                <Route path="/matchgroups" element={<MatchGroupList />} />
                <Route path="/matchgroups/:groupId" element={<MatchGroupDetail />} />
            </Routes>
        </Router>
    );
}

export default App;
