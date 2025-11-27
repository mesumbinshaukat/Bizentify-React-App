import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { attendanceApi } from '../api/attendance';
import { AttendanceStatus } from '../types/attendance';

const POLL_INTERVAL = 30000; // 30 seconds

/**
 * Custom hook for managing attendance status with automatic polling
 * Polls every 30 seconds when app is active, pauses when in background
 */
export const useAttendanceStatus = () => {
    const [status, setStatus] = useState<AttendanceStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastFetch, setLastFetch] = useState<Date | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const appState = useRef(AppState.currentState);

    const fetchStatus = async () => {
        try {
            setError(null);
            const response = await attendanceApi.getAttendanceStatus();

            if (response.success && response.data) {
                setStatus(response.data);
                setLastFetch(new Date());
            } else {
                throw new Error(response.message || 'Failed to fetch attendance status');
            }
        } catch (err: any) {
            console.error('Error fetching attendance status:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch attendance status';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const startPolling = () => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Fetch immediately
        fetchStatus();

        // Then poll every 30 seconds
        intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL);
    };

    const stopPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Handle app state changes (pause polling when in background)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // App has come to foreground, resume polling
                console.log('App came to foreground, resuming polling');
                startPolling();
            } else if (nextAppState.match(/inactive|background/)) {
                // App has gone to background, pause polling
                console.log('App went to background, pausing polling');
                stopPolling();
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Start polling on mount
    useEffect(() => {
        startPolling();

        return () => {
            stopPolling();
        };
    }, []);

    return {
        status,
        isLoading,
        error,
        lastFetch,
        refetch: fetchStatus,
    };
};
