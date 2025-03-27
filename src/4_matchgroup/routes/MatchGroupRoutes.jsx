import {Route, Routes} from "react-router-dom";
import MatchGroupList from "../pages/MatchGroupList.jsx";
import CreateMatchGroup from "../pages/CreateMatchGroup.jsx";
import MatchGroupDetail from "../pages/MatchGroupDetail.jsx";


const MatchGroupRoutes = () => {
    return(
            <Routes>
                <Route path="/" element={<MatchGroupList />}/>
                <Route path="/create" element={<CreateMatchGroup />}/>
                <Route path="/:groupId" element={<MatchGroupDetail />} />
            </Routes>
    );
};

export default MatchGroupRoutes;