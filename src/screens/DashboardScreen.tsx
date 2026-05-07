import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useAttendanceStatus } from '../hooks/useAttendanceStatus';
import { useOTAUpdates } from '../hooks/useOTAUpdates';
import { PendingCheckoutAlert } from '../components/PendingCheckoutAlert';
import { UpdateNotification } from '../components/UpdateNotification';
import { AttendanceStatusCard } from '../components/AttendanceStatusCard';
import { COLORS } from '../constants/config';
import { attendanceApi } from '../api';
import { DashboardStats } from '../types';

export default function DashboardScreen() {
    const navigation = useNavigation();
    const { user, logout } = useAuth();

    // Real-time attendance status with 30s polling
    const { status, isLoading, error, refetch, lastFetch } = useAttendanceStatus();

    // Dashboard statistics
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);

    // OTA update detection
    const {
        updateAvailable,
        isDownloading,
        downloadProgress,
        downloadAndReload
    } = useOTAUpdates();

    const handleCheckIn = () => {
        navigation.navigate('CheckIn' as never);
    };

    const handleCheckOut = () => {
        navigation.navigate('CheckOut' as never);
    };

    const handleRequestFix = () => {
        if (status?.pending_attendance) {
            navigation.navigate('FixRequest' as never, {
                attendanceId: status.pending_attendance.id,
                attendanceDate: status.pending_attendance.date,
                checkInTime: status.pending_attendance.check_in,
            });
        }
    };

    const handleViewHistory = () => {
        navigation.navigate('History' as never);
    };

    // Load dashboard statistics
    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            setIsLoadingStats(true);
            const response = await attendanceApi.getDashboard();
            if (response.success && response.data) {
                setDashboardStats(response.data);
            }
        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    // Refetch status when returning from check-in/check-out screens
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refetch();
            loadDashboardStats();
        });

        return unsubscribe;
    }, [navigation, refetch]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading attendance status...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={false} onRefresh={refetch} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.userName}>{user?.name}</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* OTA Update Notification */}
            {updateAvailable && (
                <UpdateNotification
                    isDownloading={isDownloading}
                    downloadProgress={downloadProgress}
                    onUpdate={downloadAndReload}
                />
            )}

            {/* Pending Checkout Alert */}
            {status?.has_pending_checkout && status.pending_attendance && (
                <PendingCheckoutAlert
                    attendance={status.pending_attendance}
                    onRequestFix={handleRequestFix}
                />
            )}

            {/* Today's Attendance Status Card */}
            {status && (
                <AttendanceStatusCard status={status} />
            )}

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        styles.checkInButton,
                        !status?.can_check_in && styles.buttonDisabled,
                    ]}
                    onPress={handleCheckIn}
                    disabled={!status?.can_check_in}
                >
                    <Text style={styles.actionIcon}>📍</Text>
                    <Text style={styles.actionButtonText}>Check In</Text>
                    {!status?.can_check_in && status?.checked_in_today && (
                        <Text style={styles.actionHint}>Already checked in</Text>
                    )}
                    {!status?.can_check_in && status?.has_pending_checkout && (
                        <Text style={styles.actionHint}>Resolve pending checkout</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        styles.checkOutButton,
                        !status?.can_check_out && styles.buttonDisabled,
                    ]}
                    onPress={handleCheckOut}
                    disabled={!status?.can_check_out}
                >
                    <Text style={styles.actionIcon}>🏁</Text>
                    <Text style={styles.actionButtonText}>Check Out</Text>
                    {!status?.can_check_out && !status?.checked_in_today && (
                        <Text style={styles.actionHint}>Check in first</Text>
                    )}
                    {!status?.can_check_out && status?.checked_out_today && (
                        <Text style={styles.actionHint}>Already checked out</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Navigation to History */}
            <TouchableOpacity style={styles.historyButton} onPress={handleViewHistory}>
                <Text style={styles.historyIcon}>📅</Text>
                <Text style={styles.historyButtonText}>View Attendance History</Text>
            </TouchableOpacity>

            {/* Dashboard Statistics */}
            {dashboardStats && (
                <View style={styles.statsContainer}>
                    <Text style={styles.statsTitle}>Overview</Text>
                    
                    {/* Attendance Stats */}
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Monthly Attendance</Text>
                        <Text style={styles.statValue}>{dashboardStats.attendance.monthly_records} days</Text>
                    </View>

                    {/* Invoice Stats */}
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Total Invoices</Text>
                        <Text style={styles.statValue}>{dashboardStats.invoices.total}</Text>
                    </View>

                    {dashboardStats.invoices.pending_approval > 0 && (
                        <View style={[styles.statCard, styles.statCardWarning]}>
                            <Text style={styles.statLabel}>Pending Approval</Text>
                            <Text style={styles.statValue}>{dashboardStats.invoices.pending_approval}</Text>
                        </View>
                    )}
                </View>
            )}

            {/* Last Updated Info */}
            {lastFetch && (
                <View style={styles.lastUpdateContainer}>
                    <Text style={styles.lastUpdateText}>
                        Last updated: {lastFetch.toLocaleTimeString()}
                    </Text>
                    <Text style={styles.lastUpdateSubtext}>
                        Auto-refreshes every 30 seconds
                    </Text>
                </View>
            )}
        </ScrollView>
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
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: 24,
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.error,
        textAlign: 'center',
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.surface,
    },
    greeting: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    logoutButton: {
        padding: 8,
    },
    logoutText: {
        color: COLORS.error,
        fontSize: 14,
        fontWeight: '600',
    },
    actionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginTop: 8,
    },
    actionButton: {
        flex: 1,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        minHeight: 120,
        justifyContent: 'center',
    },
    checkInButton: {
        backgroundColor: COLORS.success,
    },
    checkOutButton: {
        backgroundColor: COLORS.error,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    actionIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    actionHint: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 11,
        marginTop: 4,
        textAlign: 'center',
    },
    historyButton: {
        backgroundColor: COLORS.surface,
        margin: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    historyIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    historyButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    lastUpdateContainer: {
        alignItems: 'center',
        paddingVertical: 16,
        paddingBottom: 24,
    },
    lastUpdateText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    lastUpdateSubtext: {
        fontSize: 11,
        color: COLORS.textSecondary,
        marginTop: 2,
        fontStyle: 'italic',
    },
    statsContainer: {
        margin: 16,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    statCard: {
        backgroundColor: COLORS.background,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statCardWarning: {
        backgroundColor: '#FFF3E0',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.warning,
    },
    statLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
});
