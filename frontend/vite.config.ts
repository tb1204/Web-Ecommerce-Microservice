import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: "0.0.0.0",
    // port: 5173,
    strictPort: true,
    // host: true, // bind tất cả interface (optional nhưng tốt cho ngrok)
    allowedHosts: [".ngrok-free.dev", ".ngrok.io", ".ngrok.app"],
  },
});
