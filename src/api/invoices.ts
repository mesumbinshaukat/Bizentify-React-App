import apiClient from './client';
import { ApiResponse } from '../types';

// Invoice interfaces
export interface Invoice {
    id: number;
    client_id: number;
    client_name?: string;
    employee_id: number;
    employee_name?: string;
    currency_id: number;
    currency_code?: string;
    currency_symbol?: string;
    due_date: string;
    amount: number;
    tax: number;
    total_amount: number;
    special_note?: string;
    status: 'pending' | 'paid' | 'overdue';
    approval_status: 'pending' | 'approved' | 'rejected';
    milestones?: InvoiceMilestone[];
    created_at: string;
    updated_at: string;
}

export interface InvoiceMilestone {
    id: number;
    title: string;
    amount: number;
    due_date: string;
    completed: boolean;
}

export interface CreateInvoiceRequest {
    client_id: number;
    employee_id: number;
    currency_id: number;
    due_date: string;
    amount: number;
    tax: number;
    special_note?: string;
    milestones?: {
        title: string;
        amount: number;
        due_date: string;
    }[];
}

export interface UpdateInvoiceRequest {
    client_id?: number;
    currency_id?: number;
    due_date?: string;
    amount?: number;
    tax?: number;
    special_note?: string;
    milestones?: {
        title: string;
        amount: number;
        due_date: string;
    }[];
}

export const invoicesApi = {
    /**
     * List invoices
     */
    getInvoices: async (params?: {
        filter_status?: 'pending' | 'paid' | 'overdue';
        filter_approval_status?: 'pending' | 'approved' | 'rejected';
        filter_client_id?: number;
        filter_employee_id?: number;
        due_date_from?: string;
        due_date_to?: string;
    }): Promise<ApiResponse<Invoice[]>> => {
        const response = await apiClient.get<ApiResponse<Invoice[]>>('/invoices', { params });
        return response.data;
    },

    /**
     * Get a specific invoice by ID
     */
    getInvoice: async (id: number): Promise<ApiResponse<Invoice>> => {
        const response = await apiClient.get<ApiResponse<Invoice>>(`/invoices/${id}`);
        return response.data;
    },

    /**
     * Create a new invoice
     */
    createInvoice: async (request: CreateInvoiceRequest): Promise<ApiResponse<Invoice>> => {
        const response = await apiClient.post<ApiResponse<Invoice>>('/invoices', request);
        return response.data;
    },

    /**
     * Update an invoice
     */
    updateInvoice: async (id: number, request: UpdateInvoiceRequest): Promise<ApiResponse<Invoice>> => {
        const response = await apiClient.put<ApiResponse<Invoice>>(`/invoices/${id}`, request);
        return response.data;
    },

    /**
     * Delete an invoice (Admin only)
     */
    deleteInvoice: async (id: number): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(`/invoices/${id}`);
        return response.data;
    },

    /**
     * Approve an invoice (Admin only)
     */
    approveInvoice: async (id: number): Promise<ApiResponse<Invoice>> => {
        const response = await apiClient.post<ApiResponse<Invoice>>(`/invoices/${id}/approve`);
        return response.data;
    },

    /**
     * Reject an invoice (Admin only)
     */
    rejectInvoice: async (id: number): Promise<ApiResponse<Invoice>> => {
        const response = await apiClient.post<ApiResponse<Invoice>>(`/invoices/${id}/reject`);
        return response.data;
    },

    /**
     * Download invoice PDF
     */
    downloadInvoicePdf: async (id: number): Promise<Blob> => {
        const response = await apiClient.get(`/invoices/${id}/pdf`, {
            responseType: 'blob',
        });
        return response.data;
    },
};
