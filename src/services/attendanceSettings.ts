import apiClient from '../api/client';
import { AttendanceSettings } from '../types/attendance';
import { ApiResponse } from '../types';

// Cache for attendance settings to avoid repeated API calls
let settingsCache: AttendanceSettings | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get attendance settings including IP whitelist and location guard enforcement status
 * Results are cached for 5 minutes to reduce API calls
 */
export const getAttendanceSettings = async (): Promise<AttendanceSettings> => {
    try {
        // Check if cache is valid
        if (settingsCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
            return settingsCache;
        }

        const response = await apiClient.get<ApiResponse<AttendanceSettings>>('/settings/attendance');

        if (response.data.success && response.data.data) {
            settingsCache = response.data.data;
            cacheTimestamp = Date.now();
            return settingsCache;
        }

        throw new Error(response.data.message || 'Failed to fetch attendance settings');
    } catch (error: any) {
        console.error('Error fetching attendance settings:', error);
        throw error;
    }
};

/**
 * Clear the settings cache (useful when settings might have changed)
 */
export const clearSettingsCache = () => {
    settingsCache = null;
    cacheTimestamp = null;
};

/**
 * Check if location is required for attendance based on settings
 */
export const isLocationRequired = (settings: AttendanceSettings): boolean => {
    // If location guard is not enforced globally, location is not required
    if (!settings.location_guard.enforce_office_location) {
        return false;
    }

    // If employee-specific settings exist, check those
    if (settings.employee) {
        return settings.employee.geolocation_required;
    }

    // Default to not required if no employee settings
    return false;
};

/**
 * Get user-friendly message about location requirements
 */
export const getLocationRequirementMessage = (settings: AttendanceSettings): string => {
    if (!settings.location_guard.enforce_office_location) {
        return 'Location is not required for attendance';
    }

    if (settings.employee) {
        switch (settings.employee.geolocation_mode) {
            case 'disabled':
                return 'Location is not required for your attendance';
            case 'required':
                return 'You must be within office radius to check in/out';
            case 'required_with_whitelist':
                return settings.employee.has_ip_whitelist
                    ? 'Location required unless connected from whitelisted IP'
                    : 'You must be within office radius to check in/out';
            default:
                return 'Location requirements not configured';
        }
    }

    return 'Location requirements not configured';
};
