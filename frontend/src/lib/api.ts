import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  withCredentials: true,
});

// Interceptor tự động thêm token từ Clerk
api.interceptors.request.use(
  async (config) => {
    try {
      // Dùng template "my-backend" giống như bạn đang làm ở AdminUsersPage
      const token = await window.Clerk?.session?.getToken({
        template: "my-backend",
      });

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn("Không lấy được token Clerk", err);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
