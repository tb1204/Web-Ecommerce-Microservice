// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: "0.0.0.0", // QUAN TRỌNG
    // port: 5173,
    strictPort: true,
    // host: true, // bind tất cả interface (optional nhưng tốt cho ngrok)
    allowedHosts: [
      ".ngrok-free.dev", // ← wildcard: cho phép mọi *.ngrok-free.dev (random subdomain)
      ".ngrok.io", // nếu ngrok dùng base khác
      ".ngrok.app", // thêm nếu cần
    ],
  },
});
