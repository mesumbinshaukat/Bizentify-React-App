import * as Location from 'expo-location';
import { LocationCoords } from '../types';
import { GPS_CONFIG } from '../constants/config';

export interface LocationResult {
    coords: LocationCoords;
    isMocked: boolean;
    accuracy: number;
}

/**
 * Check current location permission status
 */
export const getLocationPermissionStatus = async (): Promise<{
    foreground: boolean;
    background: boolean;
}> => {
    try {
        const foregroundPermission = await Location.getForegroundPermissionsAsync();
        const backgroundPermission = await Location.getBackgroundPermissionsAsync();

        return {
            foreground: foregroundPermission.status === 'granted',
            background: backgroundPermission.status === 'granted',
        };
    } catch (error) {
        console.error('Error checking location permissions:', error);
        return { foreground: false, background: false };
    }
};

/**
 * Request location permissions
 */
export const requestLocationPermissions = async (): Promise<boolean> => {
    try {
        // First check if we already have permissions
        const currentStatus = await getLocationPermissionStatus();

        if (currentStatus.foreground) {
            console.log('Location permissions already granted');
            return true;
        }

        // Request foreground permission
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();

        if (foregroundStatus !== 'granted') {
            console.log('Foreground location permission denied');
            return false;
        }

        // Request background permission for better tracking (optional)
        try {
            await Location.requestBackgroundPermissionsAsync();
        } catch (error) {
            console.log('Background permission request failed, but foreground is granted');
        }

        return foregroundStatus === 'granted';
    } catch (error) {
        console.error('Error requesting location permissions:', error);
        return false;
    }
};

/**
 * Check if location services are enabled
 */
export const isLocationEnabled = async (): Promise<boolean> => {
    try {
        return await Location.hasServicesEnabledAsync();
    } catch (error) {
        console.error('Error checking location services:', error);
        return false;
    }
};

/**
 * Get current location with high accuracy
 */
export const getCurrentLocation = async (): Promise<LocationResult> => {
    try {
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
            timeInterval: GPS_CONFIG.timeInterval,
        });

        // Check if location is mocked
        const isMocked = location.mocked || false;

        return {
            coords: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy || 0,
                altitude: location.coords.altitude,
                altitudeAccuracy: location.coords.altitudeAccuracy,
                heading: location.coords.heading,
                speed: location.coords.speed,
            },
            isMocked,
            accuracy: location.coords.accuracy || 0,
        };
    } catch (error) {
        console.error('Error getting current location:', error);
        throw new Error('Failed to get current location. Please ensure GPS is enabled and try again.');
    }
};

/**
 * Get multiple location readings and average them for better accuracy
 */
export const getAverageLocation = async (samples: number = 3): Promise<LocationResult> => {
    const locations: LocationResult[] = [];

    for (let i = 0; i < samples; i++) {
        const location = await getCurrentLocation();
        locations.push(location);

        // Wait a bit between samples
        if (i < samples - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    // Calculate average
    const avgLat = locations.reduce((sum, loc) => sum + loc.coords.latitude, 0) / samples;
    const avgLng = locations.reduce((sum, loc) => sum + loc.coords.longitude, 0) / samples;
    const avgAccuracy = locations.reduce((sum, loc) => sum + loc.accuracy, 0) / samples;
    const anyMocked = locations.some(loc => loc.isMocked);

    return {
        coords: {
            latitude: avgLat,
            longitude: avgLng,
            accuracy: avgAccuracy,
            altitude: locations[0].coords.altitude,
            altitudeAccuracy: locations[0].coords.altitudeAccuracy,
            heading: locations[0].coords.heading,
            speed: locations[0].coords.speed,
        },
        isMocked: anyMocked,
        accuracy: avgAccuracy,
    };
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

/**
 * Check if user is within office radius
 */
export const isWithinOfficeRadius = (
    userLat: number,
    userLon: number,
    officeLat: number,
    officeLon: number,
    radiusMeters: number
): boolean => {
    const distance = calculateDistance(userLat, userLon, officeLat, officeLon);
    return distance <= radiusMeters;
};

/**
 * Format distance for display
 */
export const formatDistance = (meters: number): string => {
    if (meters < 1000) {
        return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(2)}km`;
};

/**
 * Watch location changes
 */
export const watchLocation = async (
    callback: (location: LocationResult) => void
): Promise<Location.LocationSubscription> => {
    return await Location.watchPositionAsync(
        {
            accuracy: Location.Accuracy.Highest,
            timeInterval: GPS_CONFIG.timeInterval,
            distanceInterval: GPS_CONFIG.distanceInterval,
        },
        (location) => {
            callback({
                coords: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    accuracy: location.coords.accuracy || 0,
                    altitude: location.coords.altitude,
                    altitudeAccuracy: location.coords.altitudeAccuracy,
                    heading: location.coords.heading,
                    speed: location.coords.speed,
                },
                isMocked: location.mocked || false,
                accuracy: location.coords.accuracy || 0,
            });
        }
    );
};
