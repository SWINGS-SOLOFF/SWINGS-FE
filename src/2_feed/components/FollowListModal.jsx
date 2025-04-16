import React from "react";
import { motion } from "framer-motion";
import { FaUserFriends, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { normalizeImageUrl } from "../utils/imageUtils";

const FollowListModal = ({ users, onClose, title }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white w-96 max-h-[500px] rounded-xl shadow-2xl overflow-hidden text-black"
      >
        <div className="bg-black text-white p-4 flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <FaUserFriends className="mr-2" />
            {title} ({users.length})
          </h3>
          <button
            onClick={onClose}
            className="hover:bg-gray-800 p-2 rounded-full transition"
          >
            <FaTimes className="text-white" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[400px]">
          {users.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              아직 {title}이 없습니다.
            </div>
          ) : (
            <ul className="space-y-3">
              {users.map((user) => (
                <li
                  key={user.userId || user.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                  onClick={() => {
                    onClose();
                    navigate(`/swings/profile/${user.userId || user.id}`);
                  }}
                >
                  <img
                    src={normalizeImageUrl(user.userImg)}
                    alt="프로필"
                    className="w-10 h-10 rounded-full object-cover border-2 border-black"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {user.username || user.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FollowListModal;
