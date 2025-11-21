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
import { useAuth } from '../contexts/AuthContext';
import { COLORS, OFFICE_LOCATION } from '../constants/config';

export default function CheckOutScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [locationStatus, setLocationStatus] = useState('Initializing...');
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const [officeLocation, setOfficeLocation] = useState(OFFICE_LOCATION);
    const [distance, setDistance] = useState<number | null>(null);
    const [isMocked, setIsMocked] = useState(false);

    useEffect(() => {
        initializeLocation();
    }, []);

    const initializeLocation = async () => {
        try {
            const hasPermission = await requestLocationPermissions();
            if (!hasPermission) {
                Alert.alert('Permission Required', 'Location permission is required.', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
                return;
            }

            const gpsEnabled = await isLocationEnabled();
            if (!gpsEnabled) {
                Alert.alert('GPS Disabled', 'Please enable GPS.', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
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
            setLocationStatus('Location acquired');

            if (location.isMocked) {
                Alert.alert('Mock Location Detected', 'Please disable GPS spoofing.', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            }
        } catch (error: any) {
            Alert.alert('Location Error', error.message || 'Failed to get location.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        }
    };

    const handleCheckOut = async () => {
        if (!currentLocation) {
            Alert.alert('Error', 'Location not available.');
            return;
        }

        if (isMocked) {
            Alert.alert('Error', 'Mock location detected.');
            return;
        }

        setIsLoading(true);
        try {
            await attendanceApi.checkOut({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
            });

            Alert.alert('Success', 'Check-out successful!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Check-out failed.';
            Alert.alert('Check-out Failed', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

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
            <View style={styles.mainCard}>
                <Text style={styles.title}>Check-Out Location</Text>

                <View style={styles.statusBadge}>
                    <View style={[styles.statusDot, styles.dotWarning]} />
                    <Text style={[styles.statusText, styles.textWarning]}>Ready to Check Out</Text>
                </View>

                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Your Location:</Text>
                        <Text style={styles.value}>
                            {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Distance from Office:</Text>
                        <Text style={[styles.value, styles.distanceValue]}>
                            {formatDistance(distance!)}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>GPS Accuracy:</Text>
                        <Text style={styles.value}>±{Math.round(currentLocation.accuracy)}m</Text>
                    </View>
                </View>

                {isMocked && (
                    <View style={styles.warningBox}>
                        <Text style={styles.warningIcon}>⚠️</Text>
                        <Text style={styles.warningText}>Mock location detected!</Text>
                    </View>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.checkOutButton, (isMocked || isLoading) && styles.buttonDisabled]}
                    onPress={handleCheckOut}
                    disabled={isMocked || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            <Text style={styles.buttonIcon}>✓</Text>
                            <Text style={styles.buttonText}>Check Out</Text>
                        </>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()} disabled={isLoading}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
    loadingText: { marginTop: 16, fontSize: 16, color: COLORS.textSecondary },
    mainCard: { flex: 1, backgroundColor: COLORS.surface, margin: 16, borderRadius: 16, padding: 24, elevation: 4 },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 20, textAlign: 'center' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, backgroundColor: COLORS.background, borderRadius: 24, marginBottom: 24 },
    statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
    dotWarning: { backgroundColor: COLORS.warning },
    statusText: { fontSize: 16, fontWeight: '600' },
    textWarning: { color: COLORS.warning },
    infoSection: { backgroundColor: COLORS.background, borderRadius: 12, padding: 16 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    label: { fontSize: 14, color: COLORS.textSecondary, flex: 1 },
    value: { fontSize: 14, fontWeight: '600', color: COLORS.text, flex: 1, textAlign: 'right' },
    distanceValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
    warningBox: { flexDirection: 'row', backgroundColor: '#FFF3CD', padding: 16, borderRadius: 12, marginTop: 16, alignItems: 'center' },
    warningIcon: { fontSize: 24, marginRight: 12 },
    warningText: { flex: 1, color: '#856404', fontSize: 14, fontWeight: '600' },
    buttonContainer: { padding: 20, backgroundColor: COLORS.surface },
    checkOutButton: { backgroundColor: COLORS.error, padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 12, elevation: 3, flexDirection: 'row', justifyContent: 'center' },
    buttonDisabled: { opacity: 0.5 },
    buttonIcon: { color: '#FFFFFF', fontSize: 24, marginRight: 8 },
    buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
    cancelButton: { backgroundColor: COLORS.background, padding: 18, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
    cancelButtonText: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
});
