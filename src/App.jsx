import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupPage from './pages/matchgroup/GroupPage.jsx';
import MatchPage from './pages/match/MatchPage.jsx';
import MatchDetailPage from './pages/match/MatchDetailPage.jsx';
import FeedPage from './pages/feed/FeedPage.jsx';
import LoginPage from './pages/user/LoginPage.jsx';
import ProfilePage from './pages/user/ProfilePage.jsx';
import RegisterPage from './pages/user/RegisterPage.jsx';
import Navigation from './components/Navigation';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-green-50">
                <Navigation />
                <div className="container mx-auto px-4 pb-8">
                    <Routes>
                        {/* 기존 HomePage는 없으므로, LoginPage를 홈으로 설정 */}
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/user-management" element={<GroupPage />} />
                        <Route path="/match-management" element={<MatchPage />} />
                        <Route path="/match-detail" element={<MatchDetailPage />} />
                        <Route path="/swings/feed" element={<FeedPage />} />
                        <Route path="/swings/social" element={<FeedPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
