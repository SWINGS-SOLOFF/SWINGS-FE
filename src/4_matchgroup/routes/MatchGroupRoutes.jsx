import {Route, Routes} from "react-router-dom";
import MatchGroupList from "../pages/MatchGroupList.jsx";
import CreateMatchGroup from "../pages/CreateMatchGroup.jsx";
import MatchGroupDetail from "../pages/MatchGroupDetail.jsx";


const MatchGroupRoutes = () => {
    return(
            <Routes>
                <Route path="/swings/matchgroup" element={<MatchGroupList />}/>
                <Route path="/swings/matchgroup/create" element={<CreateMatchGroup />}/>
                <Route path="/swings/matchgroup/:groupId" element={<MatchGroupDetail />} />
            </Routes>
    );
};

export default MatchGroupRoutes;