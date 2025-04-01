// src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from "./components/Navigation";
import FeedPage from './2_feed/pages/FeedPage';
import SocialPage from './2_feed/pages/SocialPage';
// 필요한 다른 페이지들 임포트

const AppRoutes = () => {
    return (
        <Router>
            <div className="min-h-screen bg-green-50">
                {/* 네비게이션 컴포넌트 (필요하면 주석 해제) */}
                 <Navigation />
                <div className="container mx-auto px-4 pb-8">
                    <Routes>
                        <Route path="/feed" element={<FeedPage />} />
                        <Route path="/swings/feed" element={<FeedPage />} />
                        <Route path="/swings/social" element={<SocialPage />} />
                        <Route path="/profile/:userId" element={<SocialPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default AppRoutes;
