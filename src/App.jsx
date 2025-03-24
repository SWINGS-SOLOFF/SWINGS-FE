import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import MatchGroupList from "./4_matchgroup/pages/MatchGroupList";
import CreateMatchGroup from "./4_matchgroup/pages/CreateMatchGroup";
import MatchGroupDetail from "./4_matchgroup/pages/MatchGroupDetail";

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-green-50">
                <Navigation />
                <main className="container mx-auto px-4 pb-8">
                    <Routes>
                        <Route path="/" element={<MatchGroupList />} />
                        <Route path="/matchgroup" element={<MatchGroupList />} />
                        <Route path="/matchgroup/create" element={<CreateMatchGroup />} />
                        <Route path="/matchgroup/:groupId" element={<MatchGroupDetail />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
