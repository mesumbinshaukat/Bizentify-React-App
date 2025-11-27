import apiClient from './client';
import { ApiResponse } from '../types';
import { OfficeScheduleResponse } from '../types/attendance';

export const officeScheduleApi = {
    /**
     * Get office schedule
     * Admin users get their own schedule, employees get their admin's schedule
     */
    getOfficeSchedule: async (): Promise<ApiResponse<OfficeScheduleResponse>> => {
        const response = await apiClient.get<ApiResponse<OfficeScheduleResponse>>('/office-schedule');
        return response.data;
    },

    /**
     * Update office schedule (Admin only)
     */
    updateOfficeSchedule: async (schedule: {
        start_time: string;
        end_time: string;
        working_days: string[];
        timezone?: string;
    }): Promise<ApiResponse<OfficeScheduleResponse>> => {
        const response = await apiClient.put<ApiResponse<OfficeScheduleResponse>>('/office-schedule', schedule);
        return response.data;
    },
};
