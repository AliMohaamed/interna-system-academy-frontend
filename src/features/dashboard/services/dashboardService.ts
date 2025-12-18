import apiClient from "@/lib/axios";
import type { ApiResponse } from "@/features/auth/types";
import type { DashboardData } from "../types";

export const dashboardService = {
  /**
   * Fetch aggregated dashboard summary
   * Endpoint: GET /dashboard/summary
   */
  getSummary: async (): Promise<DashboardData> => {
    // نحدد نوع الـ Response المتوقع لضمان Type Safety
    const response = await apiClient.get<ApiResponse<DashboardData>>("/dashboard/summary");
    
    return response.data.data;
  },
};