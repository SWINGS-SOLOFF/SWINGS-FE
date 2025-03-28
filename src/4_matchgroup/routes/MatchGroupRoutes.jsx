import {Route, Routes} from "react-router-dom";
import MatchGroupList from "../pages/MatchGroupList.jsx";
import MatchGroupCreate from "../pages/MatchGroupCreate.jsx";
import MatchGroupDetail from "../pages/MatchGroupDetail.jsx";
import MatchGroupMain from "../pages/MatchGroupMain.jsx";


const MatchGroupRoutes = () => {
    return(
            <Routes>
                <Route index element={<MatchGroupMain />} />
                <Route path="/:category" element={<MatchGroupList />}/>
                <Route path="create" element={<MatchGroupCreate />}/>
                <Route path="/:category/:groupId" element={<MatchGroupDetail />} />
            </Routes>
    );
};

export default MatchGroupRoutes;