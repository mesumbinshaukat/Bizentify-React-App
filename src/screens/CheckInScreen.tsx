import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { attendanceApi } from '../api/attendance';
import {
    requestLocationPermissions,
    isLocationEnabled,
    getAverageLocation,
    calculateDistance,
    formatDistance,
} from '../utils/location';
import { getAttendanceSettings, isLocationRequired } from '../services/attendanceSettings';
import { AttendanceSettings } from '../types/attendance';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, OFFICE_LOCATION } from '../constants/config';

export default function CheckInScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [locationStatus, setLocationStatus] = useState('Checking settings...');
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const [officeLocation, setOfficeLocation] = useState(OFFICE_LOCATION);
    const [distance, setDistance] = useState<number | null>(null);
    const [isWithinRadius, setIsWithinRadius] = useState(false);
    const [isMocked, setIsMocked] = useState(false);
    const [attendanceSettings, setAttendanceSettings] = useState<AttendanceSettings | null>(null);
    const [locationIsRequired, setLocationIsRequired] = useState(true);

    useEffect(() => {
        initialize();
    }, []);

    const initialize = async () => {
        try {
            setIsInitializing(true);
            setLocationStatus('Checking attendance settings...');

            // Fetch attendance settings first
            const settings = await getAttendanceSettings();
            setAttendanceSettings(settings);

            const needsLocation = isLocationRequired(settings);
            setLocationIsRequired(needsLocation);

            // Update office location from settings if available
            if (settings.location_guard.office_configured) {
                setOfficeLocation({
                    latitude: settings.location_guard.office_latitude!,
                    longitude: settings.location_guard.office_longitude!,
                    radius: settings.location_guard.office_radius_meters!,
                });
            }

            if (!needsLocation) {
                // Location not required, ready to check in
                setLocationStatus('Location not required');
                setIsInitializing(false);
                return;
            }

            // Location is required, proceed with location initialization
            await initializeLocation();
        } catch (error: any) {
            console.error('Initialization error:', error);
            Alert.alert(
                'Initialization Error',
                error.message || 'Failed to initialize. Please try again.',
                [
                    { text: 'Cancel', onPress: () => navigation.goBack() },
                    { text: 'Retry', onPress: () => initialize() }
                ]
            );
        } finally {
            setIsInitializing(false);
        }
    };

    const initializeLocation = async () => {
        try {
            // Check if GPS is enabled first
            const gpsEnabled = await isLocationEnabled();
            if (!gpsEnabled) {
                Alert.alert(
                    'GPS Disabled',
                    'Please enable location services in your device settings to mark attendance.',
                    [
                        { text: 'Cancel', onPress: () => navigation.goBack() },
                        { text: 'Retry', onPress: () => initializeLocation() }
                    ]
                );
                return;
            }

            // Check and request permissions
            const hasPermission = await requestLocationPermissions();
            if (!hasPermission) {
                Alert.alert(
                    'Permission Required',
                    'Location permission is required for attendance tracking. Please grant location permission in your device settings.',
                    [
                        { text: 'Cancel', onPress: () => navigation.goBack() },
                        { text: 'Retry', onPress: () => initializeLocation() }
                    ]
                );
                return;
            }

            setLocationStatus('Getting your location...');
            const location = await getAverageLocation(2);

            setCurrentLocation(location.coords);
            setIsMocked(location.isMocked);

            const dist = calculateDistance(
                location.coords.latitude,
                location.coords.longitude,
                officeLocation.latitude,
                officeLocation.longitude
            );

            setDistance(dist);
            setIsWithinRadius(dist <= officeLocation.radius);
            setLocationStatus('Location acquired');

            if (location.isMocked) {
                Alert.alert(
                    'Mock Location Detected',
                    'Please disable mock location/GPS spoofing apps and try again.',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            }
        } catch (error: any) {
            console.error('Location error:', error);
            Alert.alert(
                'Location Error',
                error.message || 'Failed to get your location. Please try again.',
                [
                    { text: 'Cancel', onPress: () => navigation.goBack() },
                    { text: 'Retry', onPress: () => initializeLocation() }
                ]
            );
        }
    };

    const handleCheckIn = async () => {
        // Validate location if required
        if (locationIsRequired) {
            if (!currentLocation) {
                Alert.alert('Error', 'Location not available. Please wait...');
                return;
            }

            if (isMocked) {
                Alert.alert('Error', 'Mock location detected. Please disable GPS spoofing.');
                return;
            }

            if (!isWithinRadius) {
                Alert.alert(
                    'Out of Range',
                    `You are ${formatDistance(distance!)} away from the office. You must be within ${officeLocation.radius}m to check in.`
                );
                return;
            }
        }

        setIsLoading(true);
        try {
            // Prepare request with optional location
            const request = locationIsRequired && currentLocation
                ? {
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                }
                : {};

            await attendanceApi.checkIn(request);

            Alert.alert('Success', 'Check-in successful!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            // Parse backend error messages
            const errorData = error.response?.data;
            let errorMessage = 'Check-in failed. Please try again.';

            if (errorData) {
                if (errorData.message) {
                    errorMessage = errorData.message;
                }

                // Handle specific error cases
                if (errorData.distance && errorData.required_distance) {
                    errorMessage = `You are ${errorData.distance.toFixed(2)}m away from the office. You must be within ${errorData.required_distance}m to check in.`;
                }
            }

            Alert.alert('Check-in Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while initializing
    if (isInitializing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>{locationStatus}</Text>
            </View>
        );
    }

    // If location not required, show simplified UI
    if (!locationIsRequired) {
        return (
            <View style={styles.container}>
                <View style={styles.mainCard}>
                    <Text style={styles.title}>Check-In</Text>

                    <View style={styles.statusBadge}>
                        <View style={[styles.statusDot, styles.dotSuccess]} />
                        <Text style={[styles.statusText, styles.textSuccess]}>
                            Ready to Check In
                        </Text>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoIcon}>ℹ️</Text>
                        <Text style={styles.infoText}>
                            Location verification is not required for your attendance.
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.checkInButton, isLoading && styles.buttonDisabled]}
                        onPress={handleCheckIn}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Text style={styles.buttonIcon}>✓</Text>
                                <Text style={styles.buttonText}>Check In</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                        disabled={isLoading}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Location required - show full location UI
    if (!currentLocation) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>{locationStatus}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Location Info Card */}
            <View style={styles.mainCard}>
                <Text style={styles.title}>Check-In Location</Text>

                <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, isWithinRadius ? styles.dotSuccess : styles.dotError]} />
                    <Text style={[styles.statusText, isWithinRadius ? styles.textSuccess : styles.textError]}>
                        {isWithinRadius ? 'Within Office Range' : 'Out of Range'}
                    </Text>
                </View>

                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Your Location:</Text>
                        <Text style={styles.value}>
                            {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Office Location:</Text>
                        <Text style={styles.value}>
                            {officeLocation.latitude.toFixed(6)}, {officeLocation.longitude.toFixed(6)}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Distance from Office:</Text>
                        <Text style={[styles.value, styles.distanceValue, isWithinRadius ? styles.textSuccess : styles.textError]}>
                            {formatDistance(distance!)}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Allowed Radius:</Text>
                        <Text style={styles.value}>{officeLocation.radius}m</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>GPS Accuracy:</Text>
                        <Text style={styles.value}>±{Math.round(currentLocation.accuracy)}m</Text>
                    </View>
                </View>

                {isMocked && (
                    <View style={styles.warningBox}>
                        <Text style={styles.warningIcon}>⚠️</Text>
                        <Text style={styles.warningText}>Mock location detected! Please disable GPS spoofing.</Text>
                    </View>
                )}

                {!isWithinRadius && !isMocked && (
                    <View style={styles.infoBox}>
                        <Text style={styles.infoIcon}>ℹ️</Text>
                        <Text style={styles.infoText}>
                            You need to be within {officeLocation.radius}m of the office to check in.
                            Current distance: {formatDistance(distance!)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.checkInButton,
                        (!isWithinRadius || isMocked || isLoading) && styles.buttonDisabled,
                    ]}
                    onPress={handleCheckIn}
                    disabled={!isWithinRadius || isMocked || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Text style={styles.buttonIcon}>✓</Text>
                            <Text style={styles.buttonText}>Check In</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                    disabled={isLoading}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    mainCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        margin: 16,
        borderRadius: 16,
        padding: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 20,
        textAlign: 'center',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: COLORS.background,
        borderRadius: 24,
        marginBottom: 24,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    dotSuccess: {
        backgroundColor: COLORS.success,
    },
    dotError: {
        backgroundColor: COLORS.error,
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
    },
    textSuccess: {
        color: COLORS.success,
    },
    textError: {
        color: COLORS.error,
    },
    infoSection: {
        backgroundColor: COLORS.background,
        borderRadius: 12,
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        flex: 1,
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
        textAlign: 'right',
    },
    distanceValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#FFF3CD',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        alignItems: 'center',
    },
    warningIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    warningText: {
        flex: 1,
        color: '#856404',
        fontSize: 14,
        fontWeight: '600',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#D1ECF1',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        alignItems: 'center',
    },
    infoIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    infoText: {
        flex: 1,
        color: '#0C5460',
        fontSize: 14,
    },
    buttonContainer: {
        padding: 20,
        backgroundColor: COLORS.surface,
    },
    checkInButton: {
        backgroundColor: COLORS.success,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonIcon: {
        color: '#FFFFFF',
        fontSize: 24,
        marginRight: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: COLORS.background,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cancelButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '600',
    },
});
