import { motion } from "framer-motion";
import SakuraFall from "./SakuraFall";

export default function SplashScreen({ onFinish }) {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 1.5 }}
      onAnimationComplete={onFinish}
    >
      {/* 🌸 벚꽃 애니메이션 */}
      <SakuraFall />

      {/* 🎨 배경 + 로고 텍스트 */}
      <div className="min-h-screen bg-gradient-to-br from-pink-200 via-white to-blue-100 flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-2 -mt-12">
          <motion.h1
            className="text-6xl font-extrabold text-gray-800 drop-shadow-lg tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            SWINGS
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 font-medium tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            나랑 골프 치러 갈래?
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
