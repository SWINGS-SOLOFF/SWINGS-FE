import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const LikeButton = ({
                        liked,
                        likeCount,
                        onLike,
                        onUnlike,
                        isLoading = false
                    }) => {
    const handleClick = () => {
        if (isLoading) return;
        liked ? onUnlike() : onLike();
    };

    const heartVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.1 }, // 마우스 올렸을떄, 살짝 커진 효관
        tap: { scale: 0.9 } // 버튼 클릭시 살짝 눌린 효과
    };

    return (
        <div className="flex items-center space-x-3">
            <motion.button
                onClick={handleClick}
                disabled={isLoading}
                variants={heartVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                className={`
                    transition-all duration-200 ease-in-out
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                    p-2 rounded-full group
                    ${liked ? 'bg-red-50 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100'}
                `}
            >
                {liked ? (
                    <FaHeart
                        className="text-red-500 text-2xl
                        group-hover:animate-pulse
                        transition-transform duration-300"
                    />
                ) : (
                    <FaRegHeart
                        className="text-gray-500
                        group-hover:text-red-300
                        text-2xl
                        transition-colors duration-300"
                    />
                )}
            </motion.button>

            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`
                    text-sm font-medium 
                    ${liked ? 'text-red-600' : 'text-gray-600'}
                    transition-colors duration-300
                `}
            >
                {likeCount || 0}
            </motion.span>
        </div>
    );
};

export default LikeButton;