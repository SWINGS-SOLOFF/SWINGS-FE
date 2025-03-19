import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserManagementPage from './components/UserManagementPage';
import MatchManagementPage from './components/MatchManagementPage';
import AdminPage from './components/AdminPage';
import FeedPage from './components/FeedPage';
import Navigation from './components/Navigation';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-green-50" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <Navigation />
                <div className="container mx-auto px-4 pb-8">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/user-management" element={<UserManagementPage />} />
                        <Route path="/match-management" element={<MatchManagementPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/feed" element={<FeedPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;