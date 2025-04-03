import React from 'react';
import { FaHeart, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

// 좋아요한 유저 목록 모달 컴포넌트
const LikedUsersModal = ({ users, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
    >
        <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white w-11/12 md:w-96 max-h-[70vh] rounded-2xl shadow-2xl overflow-hidden"
        >
            <div className="bg-black text-white p-4 flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center">
                    <FaHeart className="mr-2 text-gray-300" />
                    좋아요 ({users.length})
                </h3>
                <button
                    onClick={onClose}
                    className="hover:bg-gray-800 p-2 rounded-full transition"
                >
                    <FaTimes className="text-white" />
                </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[50vh]">
                {users.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <FaRegHeart className="mx-auto text-4xl mb-4 text-gray-300" />
                        <p>아직 좋아요를 누른 사용자가 없습니다.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {users.map((user) => (
                            <li
                                key={user.userId}
                                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                                <img
                                    src={user.avatarUrl || '/default-profile.jpg'}
                                    alt="프로필"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{user.username}</p>
                                    <p className="text-xs text-gray-500">{user.description || '골퍼'}</p>
                                </div>
                                <FaHeart className="ml-auto text-gray-500" />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </motion.div>
    </motion.div>
);
export default LikedUsersModal;
