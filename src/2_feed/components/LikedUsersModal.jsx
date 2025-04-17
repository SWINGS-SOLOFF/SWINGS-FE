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
    <div className="liked-users-modal fixed inset-0 bg-transparent z-[9999] flex items-center justify-center p-4">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        className="bg-white rounded-3xl shadow-xl max-w-sm w-full max-h-[75vh] overflow-hidden border-2 border-pink-200"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-pink-100">
          <h2 className="text-lg font-bold flex items-center text-pink-600">
            <FaHeart className="text-pink-500 mr-2" />
            좋아요
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-pink-600 p-1 rounded-full hover:bg-pink-50 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* 유저 목록 */}
        <div className="overflow-y-auto max-h-[calc(75vh-70px)] py-2 px-3 custom-scrollbar">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center mb-3">
                <FaHeart className="text-pink-400 text-xl" />
              </div>
              <p className="text-pink-600 font-medium">
                아직 좋아요를 누른 사용자가 없습니다
              </p>
              <p className="text-pink-300 text-sm mt-1">
                게시물에 첫 좋아요를 기다리고 있어요
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-1">
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
                    className="hover:bg-pink-50 transition rounded-xl cursor-pointer group"
                  >
                    <div className="flex items-center p-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-100 to-pink-200 flex items-center justify-center mr-3 overflow-hidden border-2 border-white shadow-sm group-hover:border-pink-300 transition-all">
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
                          <FaUser className="text-pink-300" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-medium text-gray-800 text-sm truncate">
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
