import {Route, Routes} from "react-router-dom";
import MatchGroupList from "../pages/MatchGroupList.jsx";
import CreateMatchGroup from "../pages/CreateMatchGroup.jsx";
import MatchGroupDetail from "../pages/MatchGroupDetail.jsx";


const MatchGroupRoutes = () => {
    return(
            <Routes>
                <Route path="/matchgroup" element={<MatchGroupList />}/>
                <Route path="/matchgroup/create" element={<CreateMatchGroup />}/>
                <Route path="/matchgroup/:groupId" element={<MatchGroupDetail />} />
            </Routes>
    );
};

export default MatchGroupRoutes;