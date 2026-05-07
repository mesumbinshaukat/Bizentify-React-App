import apiClient from './client';
import { ApiResponse } from '../types';

// Client interfaces
export interface Client {
    id: number;
    name: string;
    email: string;
    primary_contact: string;
    website?: string;
    profile_photo_url?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateClientRequest {
    name: string;
    email: string;
    primary_contact: string;
    website?: string;
    picture?: File;
}

export interface UpdateClientRequest {
    name?: string;
    email?: string;
    primary_contact?: string;
    website?: string;
    picture?: File;
}

export const clientsApi = {
    /**
     * List clients
     */
    getClients: async (params?: {
        search?: string;
    }): Promise<ApiResponse<Client[]>> => {
        const response = await apiClient.get<ApiResponse<Client[]>>('/clients', { params });
        return response.data;
    },

    /**
     * Get a specific client by ID
     */
    getClient: async (id: number): Promise<ApiResponse<Client>> => {
        const response = await apiClient.get<ApiResponse<Client>>(`/clients/${id}`);
        return response.data;
    },

    /**
     * Create a new client
     */
    createClient: async (request: CreateClientRequest): Promise<ApiResponse<Client>> => {
        const formData = new FormData();
        formData.append('name', request.name);
        formData.append('email', request.email);
        formData.append('primary_contact', request.primary_contact);
        if (request.website) {
            formData.append('website', request.website);
        }
        if (request.picture) {
            formData.append('picture', request.picture);
        }

        const response = await apiClient.post<ApiResponse<Client>>('/clients', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Update a client
     */
    updateClient: async (id: number, request: UpdateClientRequest): Promise<ApiResponse<Client>> => {
        const formData = new FormData();
        if (request.name) formData.append('name', request.name);
        if (request.email) formData.append('email', request.email);
        if (request.primary_contact) formData.append('primary_contact', request.primary_contact);
        if (request.website) formData.append('website', request.website);
        if (request.picture) formData.append('picture', request.picture);

        const response = await apiClient.put<ApiResponse<Client>>(`/clients/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Delete a client
     */
    deleteClient: async (id: number): Promise<ApiResponse<null>> => {
        const response = await apiClient.delete<ApiResponse<null>>(`/clients/${id}`);
        return response.data;
    },
};
