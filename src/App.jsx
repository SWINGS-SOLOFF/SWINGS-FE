import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Homepage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import MatchManagementPage from './pages/MatchManagementPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import FeedPage from './pages/FeedPage.jsx';
import Navigation from './components/Navigation';
import SocialPage from './pages/SocialPage.jsx';


function App() {
    return (
        <Router>
            <div className="min-h-screen bg-green-50" >
                <Navigation />
                <div className="container mx-auto px-4 pb-8">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/user-management" element={<UserManagementPage />} />
                        <Route path="/match-management" element={<MatchManagementPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/swings/feed" element={<FeedPage />} />
                        <Route path="/swings/social" element={<SocialPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;