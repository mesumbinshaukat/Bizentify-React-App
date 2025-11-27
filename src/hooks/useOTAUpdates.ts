import { useState, useEffect } from 'react';
import * as Updates from 'expo-updates';

export interface OTAUpdateState {
    updateAvailable: boolean;
    isChecking: boolean;
    isDownloading: boolean;
    downloadProgress: number;
    error: string | null;
    checkForUpdates: () => Promise<void>;
    downloadAndReload: () => Promise<void>;
}

/**
 * Custom hook for managing OTA updates
 * Checks for updates on mount and provides methods to download and install
 */
export const useOTAUpdates = (): OTAUpdateState => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const checkForUpdates = async () => {
        // Only check for updates in production builds
        if (__DEV__) {
            console.log('Skipping update check in development mode');
            return;
        }

        try {
            setIsChecking(true);
            setError(null);

            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
                console.log('Update available!');
                setUpdateAvailable(true);
            } else {
                console.log('No updates available');
                setUpdateAvailable(false);
            }
        } catch (err: any) {
            console.error('Error checking for updates:', err);
            setError(err.message || 'Failed to check for updates');
        } finally {
            setIsChecking(false);
        }
    };

    const downloadAndReload = async () => {
        if (__DEV__) {
            console.log('Cannot download updates in development mode');
            return;
        }

        try {
            setIsDownloading(true);
            setError(null);
            setDownloadProgress(0);

            // Fetch the update
            const result = await Updates.fetchUpdateAsync();

            if (result.isNew) {
                console.log('Update downloaded successfully, reloading...');
                setDownloadProgress(100);

                // Wait a moment to show 100% progress
                await new Promise(resolve => setTimeout(resolve, 500));

                // Reload the app with the new update
                await Updates.reloadAsync();
            } else {
                console.log('No new update to download');
                setUpdateAvailable(false);
            }
        } catch (err: any) {
            console.error('Error downloading update:', err);
            setError(err.message || 'Failed to download update');
        } finally {
            setIsDownloading(false);
        }
    };

    // Check for updates on mount
    useEffect(() => {
        checkForUpdates();
    }, []);

    // Listen for update events
    useEffect(() => {
        if (__DEV__) return;

        const subscription = Updates.addListener((event) => {
            if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
                console.log('Update event: Update available');
                setUpdateAvailable(true);
            } else if (event.type === Updates.UpdateEventType.NO_UPDATE_AVAILABLE) {
                console.log('Update event: No update available');
                setUpdateAvailable(false);
            } else if (event.type === Updates.UpdateEventType.ERROR) {
                console.error('Update event: Error', event.message);
                setError(event.message || 'Update error');
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return {
        updateAvailable,
        isChecking,
        isDownloading,
        downloadProgress,
        error,
        checkForUpdates,
        downloadAndReload,
    };
};
