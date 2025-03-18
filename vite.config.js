import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 항상 5173번 포트 사용
    strictPort: true, // 사용 중이면 실행 실패 (다른 포트로 변경 안 함)
  },
});
