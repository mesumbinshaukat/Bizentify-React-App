import apiClient from './client';
import { ApiResponse } from '../types';

// Bonus interfaces
export interface Bonus {
    id: number;
    employee_id: number;
    employee_name?: string;
    currency_id: number;
    currency_code?: string;
    currency_symbol?: string;
    amount: number;
    description: string;
    date: string;
    release_type: 'with_salary' | 'separate';
    created_at: string;
    updated_at: string;
}

export interface CreateBonusRequest {
    employee_id: number;
    currency_id: number;
    amount: number;
    description: string;
    date: string;
    release_type: 'with_salary' | 'separate';
}

export interface UpdateBonusRequest {
    amount?: number;
    description?: string;
    date?: string;
    release_type?: 'with_salary' | 'separate';
}

export const bonusesApi = {
    /**
     * List bonuses (Admin only)
     */
    getBonuses: async (params?: {
        employee_id?: number;
        month?: number;
        year?: number;
    }): Promise<ApiResponse<Bonus[]>> => {
        const response = await apiClient.get<ApiResponse<Bonus[]>>('/bonuses', { params });
        return response.data;
    },

    /**
     * Get a specific bonus by ID
     */
    getBonus: async (id: number): Promise<ApiResponse<Bonus>> => {
        const response = await apiClient.get<ApiResponse<Bonus>>(`/bonuses/${id}`);
        return response.data;
    },

    /**
     * Create a new bonus (Admin only)
     */
    createBonus: async (request: CreateBonusRequest): Promise<ApiResponse<Bonus>> => {
        const response = await apiClient.post<ApiResponse<Bonus>>('/bonuses', request);
        return response.data;
    },

    /**
     * Update a bonus (Admin only)
     */
    updateBonus: async (id: number, request: UpdateBonusRequest): Promise<ApiResponse<Bonus>> => {
        const response = await apiClient.put<ApiResponse<Bonus>>(`/bonuses/${id}`, request);
        return response.data;
    },

    /**
     * Delete a bonus (Admin only)
     */
    deleteBonus: async (id: number): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(`/bonuses/${id}`);
        return response.data;
    },
};
