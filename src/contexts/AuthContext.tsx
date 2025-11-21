import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authApi } from '../api/auth';
import { User, LoginRequest } from '../types';
import { saveToken, saveUser, getToken, getUser, clearAll } from '../utils/storage';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await getToken();
            if (token) {
                const savedUser = await getUser();
                if (savedUser) {
                    setUser(savedUser);
                } else {
                    // Fetch user from API
                    const response = await authApi.getMe();
                    setUser(response.data);
                    await saveUser(response.data);
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            await clearAll();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginRequest) => {
        try {
            const response = await authApi.login(credentials);
            await saveToken(response.data.token);
            await saveUser(response.data.user);
            setUser(response.data.user);
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout API failed:', error);
        } finally {
            await clearAll();
            setUser(null);
        }
    };

    const refreshUser = async () => {
        try {
            const response = await authApi.getMe();
            setUser(response.data);
            await saveUser(response.data);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
