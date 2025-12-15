import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

// Create Instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g., http://localhost:5000/api/v1
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // IMPORTANT: Allows sending cookies (refreshToken) with requests
});

// Request Interceptor (Attach Access Token)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Handle 401 & Silent Refresh)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried to prevent infinite loops

      try {
        // 1. Call Refresh Token Endpoint (Cookie is sent automatically due to withCredentials: true)
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true } // Must be explicit here too
        );

        // 2. Update Store with new Access Token
        useAuthStore.getState().login({
          user: useAuthStore.getState().user!, // Keep existing user data
          accessToken: data.data.accessToken,
        });

        // 3. Update the header for the original request and retry it
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails (token expired completely), force logout
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
