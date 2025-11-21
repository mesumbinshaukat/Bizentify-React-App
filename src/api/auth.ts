import apiClient from './client';
import { LoginRequest, LoginResponse, ApiResponse, User } from '../types';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/employee/login', credentials);
        return response.data;
    },

    logout: async (): Promise<ApiResponse<null>> => {
        const response = await apiClient.post<ApiResponse<null>>('/auth/logout');
        return response.data;
    },

    getMe: async (): Promise<ApiResponse<User>> => {
        const response = await apiClient.get<ApiResponse<User>>('/auth/me');
        return response.data;
    },

    refreshToken: async (): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/refresh');
        return response.data;
    },
};
