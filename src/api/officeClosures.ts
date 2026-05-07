import apiClient from './client';
import { ApiResponse } from '../types';

// Office Closure interfaces
export interface OfficeClosure {
    id: number;
    start_date: string;
    end_date: string;
    reason: string;
    is_single_day: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateOfficeClosureRequest {
    start_date: string;
    end_date?: string;
    reason?: string;
}

export const officeClosuresApi = {
    /**
     * List office closures
     */
    getOfficeClosures: async (params?: {
        active_only?: boolean;
        date_from?: string;
        date_to?: string;
        page?: number;
        per_page?: number;
    }): Promise<ApiResponse<OfficeClosure[]>> => {
        const response = await apiClient.get<ApiResponse<OfficeClosure[]>>('/office-closures', { params });
        return response.data;
    },

    /**
     * Get a specific office closure by ID
     */
    getOfficeClosure: async (id: number): Promise<ApiResponse<OfficeClosure>> => {
        const response = await apiClient.get<ApiResponse<OfficeClosure>>(`/office-closures/${id}`);
        return response.data;
    },

    /**
     * Create a new office closure (Admin only)
     */
    createOfficeClosure: async (request: CreateOfficeClosureRequest): Promise<ApiResponse<OfficeClosure>> => {
        const response = await apiClient.post<ApiResponse<OfficeClosure>>('/office-closures', request);
        return response.data;
    },

    /**
     * Delete an office closure (Admin only)
     */
    deleteOfficeClosure: async (id: number): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(`/office-closures/${id}`);
        return response.data;
    },
};
