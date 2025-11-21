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
import { attendanceApi } from '../api/attendance';
import { DashboardStats, Attendance } from '../types';
import { COLORS } from '../constants/config';

export default function DashboardScreen() {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const [dashboardResponse, attendanceResponse] = await Promise.all([
                attendanceApi.getDashboard(),
                attendanceApi.getAttendanceList(1, 1),
            ]);

            setStats(dashboardResponse.data);

            // Get today's attendance if exists
            if (attendanceResponse.data.length > 0) {
                const today = new Date().toISOString().split('T')[0];
                const todayRecord = attendanceResponse.data.find(
                    (a) => a.attendance_date === today
                );
                setTodayAttendance(todayRecord || null);
            }
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        loadDashboard();
    };

    const handleCheckIn = () => {
        navigation.navigate('CheckIn' as never);
    };

    const handleCheckOut = () => {
        navigation.navigate('CheckOut' as never);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const canCheckIn = !stats?.attendance.today_checked_in;
    const canCheckOut = stats?.attendance.today_checked_in && !stats?.attendance.today_checked_out;

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
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

            {/* Today's Status Card */}
            <View style={styles.statusCard}>
                <Text style={styles.cardTitle}>Today's Status</Text>
                <View style={styles.statusRow}>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Check-In</Text>
                        <Text style={[styles.statusValue, stats?.attendance.today_checked_in && styles.statusActive]}>
                            {stats?.attendance.today_checked_in ? '✓ Done' : '✗ Pending'}
                        </Text>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Check-Out</Text>
                        <Text style={[styles.statusValue, stats?.attendance.today_checked_out && styles.statusActive]}>
                            {stats?.attendance.today_checked_out ? '✓ Done' : '✗ Pending'}
                        </Text>
                    </View>
                </View>

                {todayAttendance && (
                    <View style={styles.timeInfo}>
                        {todayAttendance.check_in && (
                            <Text style={styles.timeText}>
                                In: {new Date(todayAttendance.check_in).toLocaleTimeString()}
                            </Text>
                        )}
                        {todayAttendance.check_out && (
                            <Text style={styles.timeText}>
                                Out: {new Date(todayAttendance.check_out).toLocaleTimeString()}
                            </Text>
                        )}
                        {todayAttendance.formatted_work_duration && (
                            <Text style={styles.durationText}>
                                Duration: {todayAttendance.formatted_work_duration}
                            </Text>
                        )}
                    </View>
                )}
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.checkInButton, !canCheckIn && styles.buttonDisabled]}
                    onPress={handleCheckIn}
                    disabled={!canCheckIn}
                >
                    <Text style={styles.actionButtonText}>Check In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.checkOutButton, !canCheckOut && styles.buttonDisabled]}
                    onPress={handleCheckOut}
                    disabled={!canCheckOut}
                >
                    <Text style={styles.actionButtonText}>Check Out</Text>
                </TouchableOpacity>
            </View>

            {/* Monthly Stats */}
            <View style={styles.statsCard}>
                <Text style={styles.cardTitle}>This Month</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats?.attendance.monthly_records || 0}</Text>
                        <Text style={styles.statLabel}>Days Present</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats?.invoices.total || 0}</Text>
                        <Text style={styles.statLabel}>Total Invoices</Text>
                    </View>
                </View>
            </View>

            {/* Navigation to History */}
            <TouchableOpacity
                style={styles.historyButton}
                onPress={() => navigation.navigate('History' as never)}
            >
                <Text style={styles.historyButtonText}>View Attendance History</Text>
            </TouchableOpacity>
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
    statusCard: {
        backgroundColor: COLORS.surface,
        margin: 16,
        padding: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 16,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statusItem: {
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    statusValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.error,
    },
    statusActive: {
        color: COLORS.success,
    },
    timeInfo: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    timeText: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 4,
    },
    durationText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        marginTop: 8,
    },
    actionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
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
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    statsCard: {
        backgroundColor: COLORS.surface,
        margin: 16,
        padding: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    historyButton: {
        backgroundColor: COLORS.surface,
        margin: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    historyButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
});
