import apiClient from './client';
import { ApiResponse } from '../types';
import { FixRequest, CreateFixRequestRequest, ProcessFixRequestRequest } from '../types/attendance';

export const fixRequestsApi = {
    /**
     * Get list of fix requests for the authenticated employee
     */
    getFixRequests: async (status?: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<FixRequest[]>> => {
        const params = status ? { status } : {};
        const response = await apiClient.get<ApiResponse<FixRequest[]>>('/fix-requests', { params });
        return response.data;
    },

    /**
     * Create a new fix request for an attendance record
     */
    createFixRequest: async (request: CreateFixRequestRequest): Promise<ApiResponse<FixRequest>> => {
        const response = await apiClient.post<ApiResponse<FixRequest>>('/fix-requests', request);
        return response.data;
    },

    /**
     * Get a specific fix request by ID
     */
    getFixRequest: async (id: number): Promise<ApiResponse<FixRequest>> => {
        const response = await apiClient.get<ApiResponse<FixRequest>>(`/fix-requests/${id}`);
        return response.data;
    },

    /**
     * Process a fix request (Admin only)
     */
    processFixRequest: async (id: number, request: ProcessFixRequestRequest): Promise<ApiResponse<FixRequest>> => {
        const response = await apiClient.post<ApiResponse<FixRequest>>(`/fix-requests/${id}/process`, request);
        return response.data;
    },
};
