import { Route, Routes } from "react-router-dom";
import MatchGroupList from "../pages/MatchGroupList.jsx";
import MatchGroupCreate from "../pages/MatchGroupCreate.jsx";
import MatchGroupDetail from "../pages/MatchGroupDetail.jsx";
import MatchGroupMain from "../pages/MatchGroupMain.jsx";
import MatchGroup from "../pages/MatchGroup.jsx";

const MatchGroupRoutes = () => {
    return (
        <Routes>
            <Route index element={<MatchGroupMain />} />
            <Route path="create" element={<MatchGroupCreate />} />
            <Route path=":category" element={<MatchGroupList />} />
            <Route path=":category/:matchGroupId" element={<MatchGroupDetail />} />
            <Route path="waitingroom/:matchGroupId" element={<MatchGroup />} />
        </Routes>
    );
};

export default MatchGroupRoutes;
