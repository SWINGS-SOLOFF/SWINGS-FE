// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserManagementPage from './components/UserManagementPage';
import MatchManagementPage from './components/MatchManagementPage';
import AdminPage from './components/AdminPage';

function App() {
    return (
        <Router>
            <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/user-management" element={<UserManagementPage />} />
                    <Route path="/match-management" element={<MatchManagementPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
