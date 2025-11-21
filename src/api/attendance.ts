import apiClient from './client';
import { ApiResponse, Attendance, AttendanceListResponse, CheckInRequest, DashboardStats } from '../types';

export const attendanceApi = {
    getAttendanceList: async (page: number = 1, perPage: number = 15): Promise<AttendanceListResponse> => {
        const response = await apiClient.get<AttendanceListResponse>('/attendance', {
            params: { page, per_page: perPage },
        });
        return response.data;
    },

    checkIn: async (location: CheckInRequest): Promise<ApiResponse<Attendance>> => {
        const response = await apiClient.post<ApiResponse<Attendance>>('/attendance/check-in', location);
        return response.data;
    },

    checkOut: async (location: CheckInRequest): Promise<ApiResponse<Attendance>> => {
        const response = await apiClient.post<ApiResponse<Attendance>>('/attendance/check-out', location);
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
};
