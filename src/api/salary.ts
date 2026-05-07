import apiClient from './client';
import { ApiResponse } from '../types';

// Salary Release interfaces
export interface SalaryRelease {
    id: number;
    employee_id: number;
    employee_name?: string;
    currency_id: number;
    currency_code?: string;
    currency_symbol?: string;
    month: number;
    year: number;
    basic_salary: number;
    bonus: number;
    commission: number;
    deductions: number;
    net_salary: number;
    release_date: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateSalaryReleaseRequest {
    employee_id: number;
    currency_id: number;
    month: number;
    year: number;
    basic_salary: number;
    bonus: number;
    commission: number;
    deductions: number;
    net_salary: number;
    release_date: string;
    notes?: string;
}

export interface UpdateSalaryReleaseRequest {
    basic_salary?: number;
    bonus?: number;
    commission?: number;
    deductions?: number;
    net_salary?: number;
    release_date?: string;
    notes?: string;
}

export interface SalaryReleasePreviewRequest {
    employee_id: number;
    month: number;
    year: number;
}

export interface SalaryReleasePreview {
    employee: {
        id: number;
        name: string;
        salary: number;
        commission_rate: number;
    };
    attendance_summary: {
        total_days: number;
        present_days: number;
        absent_days: number;
        late_days: number;
    };
    calculated_values: {
        basic_salary: number;
        commission: number;
        deductions: number;
        net_salary: number;
    };
}

export const salaryApi = {
    /**
     * List salary releases (Admin only)
     */
    getSalaryReleases: async (params?: {
        employee_id?: number;
        month?: number;
        year?: number;
    }): Promise<ApiResponse<SalaryRelease[]>> => {
        const response = await apiClient.get<ApiResponse<SalaryRelease[]>>('/salary-releases', { params });
        return response.data;
    },

    /**
     * Get a specific salary release by ID
     */
    getSalaryRelease: async (id: number): Promise<ApiResponse<SalaryRelease>> => {
        const response = await apiClient.get<ApiResponse<SalaryRelease>>(`/salary-releases/${id}`);
        return response.data;
    },

    /**
     * Create a new salary release (Admin only)
     */
    createSalaryRelease: async (request: CreateSalaryReleaseRequest): Promise<ApiResponse<SalaryRelease>> => {
        const response = await apiClient.post<ApiResponse<SalaryRelease>>('/salary-releases', request);
        return response.data;
    },

    /**
     * Update a salary release (Admin only)
     */
    updateSalaryRelease: async (id: number, request: UpdateSalaryReleaseRequest): Promise<ApiResponse<SalaryRelease>> => {
        const response = await apiClient.put<ApiResponse<SalaryRelease>>(`/salary-releases/${id}`, request);
        return response.data;
    },

    /**
     * Delete a salary release (Admin only)
     */
    deleteSalaryRelease: async (id: number): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(`/salary-releases/${id}`);
        return response.data;
    },

    /**
     * Preview salary calculation before creating release (Admin only)
     */
    previewSalaryRelease: async (request: SalaryReleasePreviewRequest): Promise<ApiResponse<SalaryReleasePreview>> => {
        const response = await apiClient.post<ApiResponse<SalaryReleasePreview>>('/salary-releases/preview', request);
        return response.data;
    },

    /**
     * Download salary release PDF (Admin only)
     */
    downloadSalaryReleasePdf: async (id: number): Promise<Blob> => {
        const response = await apiClient.get(`/salary-releases/${id}/pdf`, {
            responseType: 'blob',
        });
        return response.data;
    },
};
