import React from "react";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const LikeButton = ({
  liked,
  likeCount,
  onLike,
  onUnlike,
  isLoading = false,
  showCount = true,
}) => {
  const handleClick = () => {
    if (isLoading) return;
    liked ? onUnlike() : onLike();
  };

  const heartVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.15 },
    tap: { scale: 0.9 },
  };

  return (
    <div className="flex items-center space-x-2">
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        variants={heartVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className={`
          transition-all duration-200 ease-in-out
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
          p-1 rounded-full group
          ${
            liked
              ? "bg-red-50 hover:bg-red-100"
              : "bg-gray-50 hover:bg-gray-100"
          }
        `}
      >
        <motion.div
          animate={{ scale: liked ? 1.2 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          {liked ? (
            <FaHeart className="text-red-500 text-base" />
          ) : (
            <FaRegHeart className="text-gray-500 text-base" />
          )}
        </motion.div>
      </motion.button>

      {showCount && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`text-sm font-medium ${
            liked ? "text-red-600" : "text-gray-600"
          } transition-colors duration-300`}
        >
          {likeCount || 0}
        </motion.span>
      )}
    </div>
  );
};

export default LikeButton;
