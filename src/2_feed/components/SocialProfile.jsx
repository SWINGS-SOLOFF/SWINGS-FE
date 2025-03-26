// src/components/SocialProfile.js
import React from 'react';
import { FaMapMarkerAlt, FaTrophy, FaGolfBall, FaEdit } from 'react-icons/fa';

const SocialProfile = ({ user, userStats, userIntroduce, editing, onEditToggle, onIntroduceChange, onIntroduceSave }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 h-32 relative">
                <div className="absolute -bottom-16 left-8">
                    <img
                        src={user.profilePic}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                    />
                </div>
            </div>
            {/* Profile Content */}
            <div className="pt-20 pb-6 px-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    {/* User Info */}
                    <div className="mb-6 md:mb-0">
                        <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
                        <div className="flex items-center mt-1 text-gray-600">
                            <FaMapMarkerAlt className="mr-1" />
                            <p>{user.location}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-green-50 p-3 rounded-lg">
                                <div className="flex items-center text-gray-700 mb-1">
                                    <FaTrophy className="mr-2 text-yellow-500" />
                                    <span className="font-medium">베스트 스코어</span>
                                </div>
                                <p className="text-gray-800 pl-6 font-semibold">{user.bestScore}</p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <div className="flex items-center text-gray-700 mb-1">
                                    <FaGolfBall className="mr-2 text-green-600" />
                                    <span className="font-medium">핸디캡</span>
                                </div>
                                <p className="text-gray-800 pl-6 font-semibold">{user.handicap}</p>
                            </div>
                        </div>
                    </div>
                    {/* User Stats */}
                    <div className="flex space-x-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-800">{userStats.posts}</p>
                            <p className="text-gray-600">게시물</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-800">{userStats.followers}</p>
                            <p className="text-gray-600">팔로워</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-800">{userStats.following}</p>
                            <p className="text-gray-600">팔로잉</p>
                        </div>
                    </div>
                </div>
                {/* Introduce Section */}
                <div className="mt-8 border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-700">소개</h3>
                        {!editing ? (
                            <button
                                className="text-green-600 hover:text-green-800 flex items-center"
                                onClick={onEditToggle}
                            >
                                <FaEdit className="mr-1" /> 수정
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button className="text-gray-500 hover:text-gray-700" onClick={onEditToggle}>
                                    취소
                                </button>
                                <button className="text-green-600 hover:text-green-800" onClick={onIntroduceSave}>
                                    저장
                                </button>
                            </div>
                        )}
                    </div>
                    {!editing ? (
                        <p className="text-gray-700 leading-relaxed">
                            {userIntroduce || "자기소개가 없습니다. '수정' 버튼을 클릭하여 자기소개를 추가해보세요."}
                        </p>
                    ) : (
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                            value={userIntroduce}
                            onChange={onIntroduceChange}
                            placeholder="자기소개를 입력하세요"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SocialProfile;
