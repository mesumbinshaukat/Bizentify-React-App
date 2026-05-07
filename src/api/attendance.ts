import apiClient from './client';
import { ApiResponse, Attendance, AttendanceListResponse, DashboardStats } from '../types';
import { AttendanceStatus, CheckInRequest, CheckOutRequest } from '../types/attendance';

export const attendanceApi = {
    getAttendanceList: async (page: number = 1, perPage: number = 15): Promise<AttendanceListResponse> => {
        const response = await apiClient.get<AttendanceListResponse>('/attendance', {
            params: { page, per_page: perPage },
        });
        return response.data;
    },

    /**
     * Get current attendance status for the authenticated employee
     * Includes today's attendance, check-in/check-out status, and pending checkouts
     */
    getAttendanceStatus: async (): Promise<ApiResponse<AttendanceStatus>> => {
        const response = await apiClient.get<ApiResponse<AttendanceStatus>>('/attendance/status');
        return response.data;
    },

    /**
     * Check in for attendance
     * Location is optional - backend will determine if it's required based on settings
     */
    checkIn: async (request: CheckInRequest = {}): Promise<ApiResponse<Attendance>> => {
        const response = await apiClient.post<ApiResponse<Attendance>>('/attendance/check-in', request);
        return response.data;
    },

    /**
     * Check out from attendance
     * Location is optional - backend will determine if it's required based on settings
     */
    checkOut: async (request: CheckOutRequest = {}): Promise<ApiResponse<Attendance>> => {
        const response = await apiClient.post<ApiResponse<Attendance>>('/attendance/check-out', request);
        return response.data;
    },

    getAttendanceById: async (id: number): Promise<ApiResponse<Attendance>> => {
        const response = await apiClient.get<ApiResponse<Attendance>>(`/attendance/${id}`);
        return response.data;
    },

    getDashboard: async (): Promise<ApiResponse<DashboardStats>> => {
        const response = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard');
        return response.data;
    },

    /**
     * Get attendance statistics (Admin only)
     */
    getAttendanceStatistics: async (params?: {
        date_from?: string;
        date_to?: string;
    }): Promise<ApiResponse<any>> => {
        const response = await apiClient.get<ApiResponse<any>>('/attendance/statistics', { params });
        return response.data;
    },
};
