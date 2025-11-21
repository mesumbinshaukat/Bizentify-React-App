import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { attendanceApi } from '../api/attendance';
import { Attendance } from '../types';
import { COLORS } from '../constants/config';

export default function AttendanceHistoryScreen() {
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadAttendances();
    }, []);

    const loadAttendances = async () => {
        try {
            const response = await attendanceApi.getAttendanceList(page, 20);
            setAttendances(response.data);
        } catch (error) {
            console.error('Failed to load attendances:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setPage(1);
        loadAttendances();
    };

    const renderItem = ({ item }: { item: Attendance }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.date}>{new Date(item.attendance_date).toLocaleDateString()}</Text>
                <View style={[styles.badge, item.has_checked_out ? styles.badgeComplete : styles.badgePending]}>
                    <Text style={styles.badgeText}>{item.has_checked_out ? 'Complete' : 'Pending'}</Text>
                </View>
            </View>
            <View style={styles.cardBody}>
                <View style={styles.timeRow}>
                    <Text style={styles.label}>Check-In:</Text>
                    <Text style={styles.value}>
                        {item.check_in ? new Date(item.check_in).toLocaleTimeString() : '-'}
                    </Text>
                </View>
                <View style={styles.timeRow}>
                    <Text style={styles.label}>Check-Out:</Text>
                    <Text style={styles.value}>
                        {item.check_out ? new Date(item.check_out).toLocaleTimeString() : '-'}
                    </Text>
                </View>
                {item.formatted_work_duration && (
                    <View style={styles.timeRow}>
                        <Text style={styles.label}>Duration:</Text>
                        <Text style={[styles.value, styles.duration]}>{item.formatted_work_duration}</Text>
                    </View>
                )}
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={attendances}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No attendance records found</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 16 },
    card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    date: { fontSize: 16, fontWeight: '600', color: COLORS.text },
    badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
    badgeComplete: { backgroundColor: COLORS.success },
    badgePending: { backgroundColor: COLORS.warning },
    badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
    cardBody: {},
    timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    label: { fontSize: 14, color: COLORS.textSecondary },
    value: { fontSize: 14, fontWeight: '500', color: COLORS.text },
    duration: { color: COLORS.primary, fontWeight: '600' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
    emptyText: { fontSize: 16, color: COLORS.textSecondary },
});
