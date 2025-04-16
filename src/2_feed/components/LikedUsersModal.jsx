import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaHeart, FaTimes, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { normalizeImageUrl } from "../utils/imageUtils";

const LikedUsersModal = ({ users, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const handleUserClick = (userId) => {
    onClose();
    navigate(`/swings/profile/${userId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    console.log("✅ 좋아요 유저 목록 users:", users);
  }, [users]);

  const modalContent = (
    <div className="liked-users-modal fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center text-gray-800 dark:text-white">
            <FaHeart className="text-pink-500 mr-3" />
            좋아요
            <span className="ml-2 text-sm bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
              {users.length}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* 유저 목록 */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] py-3 px-4 custom-scrollbar">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-gray-700 flex items-center justify-center mb-4">
                <FaHeart className="text-pink-300 text-2xl" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                아직 좋아요를 누른 사용자가 없습니다
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                게시물에 첫 좋아요를 기다리고 있어요
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-2">
              {users.map((user) => {
                console.log("🧪 유저 이미지 확인:", {
                  userId: user.userId,
                  username: user.username,
                  avatarUrl: user.avatarUrl,
                  userProfilePic: user.userProfilePic,
                });

                return (
                  <li
                    key={user.userId}
                    onClick={() => handleUserClick(user.userId)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition rounded-xl cursor-pointer group"
                  >
                    <div className="flex items-center p-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-pink-100 dark:from-blue-900 dark:to-pink-900 flex items-center justify-center mr-3 overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm group-hover:border-pink-200 dark:group-hover:border-pink-800 transition-all">
                        {user.avatarUrl ||
                        user.userProfilePic ||
                        user.userImg ? (
                          <img
                            src={normalizeImageUrl(
                              user.avatarUrl ||
                                user.userProfilePic ||
                                user.userImg
                            )}
                            alt={user.username}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/default-profile.jpg";
                            }}
                          />
                        ) : (
                          <FaUser className="text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-medium text-gray-800 dark:text-white text-sm truncate">
                          {user.username}
                        </h3>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
  return createPortal(modalContent, document.body);
};

export default LikedUsersModal;
