import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaUserFriends, FaImages } from "react-icons/fa";

const messages = [
  {
    key: "love",
    text: "운명의 짝 찾는 중",
    icon: <FaHeart className="text-pink-400 w-10 h-10" />,
  },
  {
    key: "mate",
    text: "골프 메이트 찾는 중",
    icon: <FaUserFriends className="text-green-400 w-10 h-10" />,
  },
  {
    key: "feed",
    text: "피드 불러오는 중",
    icon: <FaImages className="text-blue-400 w-10 h-10" />,
  },
];

export default function LoginLoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1200); // 약간 여유 있게
    return () => clearInterval(interval);
  }, []);

  const current = messages[index];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-200 via-white to-blue-100 z-50 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className="w-14 h-14 flex items-center justify-center"
          >
            {current.icon}
          </motion.div>

          <p className="text-gray-700 font-extrabold text-2xl tracking-tight">
            {current.text}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
