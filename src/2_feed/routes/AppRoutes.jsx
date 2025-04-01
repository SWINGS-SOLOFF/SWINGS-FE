import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from "./components/Navigation";
import FeedPage from './2_feed/pages/FeedPage';
import SocialPage from './2_feed/pages/SocialPage';

const AppRoutes = () => {
    return (
        <Router>
            <div className="min-h-screen bg-green-50">
                <Navigation />
                <div className="container mx-auto px-4 pb-8">
                    <Routes>
                        <Route path="/" element={<FeedPage />} />
                        <Route path="/feed" element={<FeedPage />} />
                        <Route path="/social" element={<SocialPage />} />
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