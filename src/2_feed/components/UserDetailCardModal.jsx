import React from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import UserDetailCard from "./UserDetailCard";

const UserDetailCardModal = ({ user, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-3xl p-6 max-w-4xl w-full mx-4 shadow-2xl relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-80 p-2 rounded-full transition"
        >
          <FaTimes />
        </button>
        <UserDetailCard user={user} />
      </motion.div>
    </motion.div>
  );
};

export default UserDetailCardModal;
