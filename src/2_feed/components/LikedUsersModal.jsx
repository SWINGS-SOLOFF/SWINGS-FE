import React from 'react';
import { FaHeart, FaTimes, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LikedUsersModal = ({ users, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
            >
                {/* 헤더 */}
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <h2 className="text-xl font-bold flex items-center">
                        <FaHeart className="text-red-500 mr-2" />
                        좋아요 ({users.length})
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* 유저 목록 */}
                <div className="overflow-y-auto max-h-[calc(80vh-70px)] p-2">
                    {users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <FaHeart className="text-gray-300 text-5xl mb-4" />
                            <p className="text-gray-500 font-medium">
                                아직 좋아요를 누른 사용자가 없습니다.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <li key={user.userId} className="py-3 hover:bg-gray-50 transition rounded-lg">
                                    <div className="flex items-center p-2">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                            {user.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    alt={user.username}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <FaUser className="text-gray-700" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {user.username}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {user.description || '골퍼'}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default LikedUsersModal;