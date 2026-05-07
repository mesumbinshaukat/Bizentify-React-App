import apiClient from './client';
import { ApiResponse } from '../types';

// Currency interfaces
export interface Currency {
    id: number;
    code: string;
    name: string;
    symbol: string;
    conversion_rate: number;
    is_base: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateCurrencyRequest {
    code: string;
    name: string;
    symbol: string;
    conversion_rate: number;
    is_active: boolean;
}

export interface UpdateCurrencyRequest {
    conversion_rate?: number;
    is_active?: boolean;
}

export const currenciesApi = {
    /**
     * List currencies
     */
    getCurrencies: async (): Promise<ApiResponse<Currency[]>> => {
        const response = await apiClient.get<ApiResponse<Currency[]>>('/currencies');
        return response.data;
    },

    /**
     * Create a new currency (Admin only)
     */
    createCurrency: async (request: CreateCurrencyRequest): Promise<ApiResponse<Currency>> => {
        const response = await apiClient.post<ApiResponse<Currency>>('/currencies', request);
        return response.data;
    },

    /**
     * Update a currency (Admin only)
     */
    updateCurrency: async (id: number, request: UpdateCurrencyRequest): Promise<ApiResponse<Currency>> => {
        const response = await apiClient.put<ApiResponse<Currency>>(`/currencies/${id}`, request);
        return response.data;
    },

    /**
     * Set a currency as base currency (Admin only)
     */
    setBaseCurrency: async (id: number): Promise<ApiResponse<Currency>> => {
        const response = await apiClient.post<ApiResponse<Currency>>(`/currencies/${id}/set-base`);
        return response.data;
    },

    /**
     * Toggle currency active status (Admin only)
     */
    toggleCurrencyActive: async (id: number): Promise<ApiResponse<Currency>> => {
        const response = await apiClient.post<ApiResponse<Currency>>(`/currencies/${id}/toggle-active`);
        return response.data;
    },

    /**
     * Delete a currency (Admin only)
     */
    deleteCurrency: async (id: number): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(`/currencies/${id}`);
        return response.data;
    },
};
