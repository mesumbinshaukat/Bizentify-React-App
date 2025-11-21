import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Use SecureStore for mobile, AsyncStorage for web
const isWeb = Platform.OS === 'web';

export const saveToken = async (token: string): Promise<void> => {
    try {
        if (isWeb) {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } else {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        }
    } catch (error) {
        console.error('Error saving token:', error);
        throw error;
    }
};

export const getToken = async (): Promise<string | null> => {
    try {
        if (isWeb) {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } else {
            return await SecureStore.getItemAsync(TOKEN_KEY);
        }
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const removeToken = async (): Promise<void> => {
    try {
        if (isWeb) {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

export const saveUser = async (user: any): Promise<void> => {
    try {
        const userData = JSON.stringify(user);
        if (isWeb) {
            await AsyncStorage.setItem(USER_KEY, userData);
        } else {
            await SecureStore.setItemAsync(USER_KEY, userData);
        }
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
};

export const getUser = async (): Promise<any | null> => {
    try {
        let userData: string | null;
        if (isWeb) {
            userData = await AsyncStorage.getItem(USER_KEY);
        } else {
            userData = await SecureStore.getItemAsync(USER_KEY);
        }
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

export const removeUser = async (): Promise<void> => {
    try {
        if (isWeb) {
            await AsyncStorage.removeItem(USER_KEY);
        } else {
            await SecureStore.deleteItemAsync(USER_KEY);
        }
    } catch (error) {
        console.error('Error removing user:', error);
    }
};

export const clearAll = async (): Promise<void> => {
    await removeToken();
    await removeUser();
};
