import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaHandshake, FaSignInAlt, FaStream } from 'react-icons/fa';

const Navigation = () => {
    const location = useLocation();

    // Navigation items with their paths, icons, and labels
    const navItems = [
        { path: '/', icon: <FaHome />, label: '홈' },
        { path: '/user-management', icon: <FaUsers />, label: '모임 관리' },
        { path: '/match-management', icon: <FaHandshake />, label: '매칭 관리' },
        { path: '/swings/feed', icon: <FaStream />, label: '피드' },
        { path: '/swings/social', icon: <FaUsers />, label: '소셜' },
        { path: '/admin', icon: <FaSignInAlt />, label: '회원' },

    ];

    return (
        <nav className="bg-green-800 text-white py-4 mb-6 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="text-2xl font-bold">골프 매칭</div>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <div className="hidden md:flex space-x-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-1 hover:text-green-200 transition ${
                                    location.pathname === item.path ? 'text-green-300 font-bold' : ''
                                }`}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile navigation */}
                    <div className="md:hidden flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-xl ${
                                    location.pathname === item.path ? 'text-green-300' : ''
                                }`}
                                title={item.label}
                            >
                                {item.icon}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;