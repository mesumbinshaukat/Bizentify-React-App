import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/config';

interface AttendanceStatusCardProps {
    status: {
        checked_in_today: boolean;
        checked_out_today: boolean;
        today_attendance?: {
            check_in: string;
            check_out?: string;
            work_duration?: string;
        };
    };
}

export const AttendanceStatusCard: React.FC<AttendanceStatusCardProps> = ({ status }) => {
    const [workDuration, setWorkDuration] = useState<string>('');

    useEffect(() => {
        if (status.checked_in_today && !status.checked_out_today && status.today_attendance) {
            // Calculate live work duration
            const updateDuration = () => {
                const checkInTime = new Date(status.today_attendance!.check_in);
                const now = new Date();
                const diff = now.getTime() - checkInTime.getTime();

                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                setWorkDuration(`${hours}h ${minutes}m`);
            };

            updateDuration();
            const interval = setInterval(updateDuration, 60000); // Update every minute

            return () => clearInterval(interval);
        }
    }, [status]);

    const getStatusText = () => {
        if (status.checked_in_today && !status.checked_out_today) {
            return 'Checked In';
        } else if (status.checked_out_today) {
            return 'Checked Out';
        } else {
            return 'Not Checked In';
        }
    };

    const getStatusColor = () => {
        if (status.checked_in_today && !status.checked_out_today) {
            return COLORS.success;
        } else if (status.checked_out_today) {
            return COLORS.textSecondary;
        } else {
            return COLORS.error;
        }
    };

    const formatTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Today's Attendance</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                    <Text style={styles.statusText}>{getStatusText()}</Text>
                </View>
            </View>

            {status.today_attendance && (
                <View style={styles.details}>
                    {status.today_attendance.check_in && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Check-in:</Text>
                            <Text style={styles.detailValue}>{formatTime(status.today_attendance.check_in)}</Text>
                        </View>
                    )}

                    {status.today_attendance.check_out && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Check-out:</Text>
                            <Text style={styles.detailValue}>{formatTime(status.today_attendance.check_out)}</Text>
                        </View>
                    )}

                    {status.checked_in_today && !status.checked_out_today && workDuration && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Duration:</Text>
                            <Text style={[styles.detailValue, styles.durationValue]}>{workDuration}</Text>
                        </View>
                    )}

                    {status.today_attendance.work_duration && status.checked_out_today && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Total Duration:</Text>
                            <Text style={styles.detailValue}>{status.today_attendance.work_duration}</Text>
                        </View>
                    )}
                </View>
            )}

            {!status.today_attendance && (
                <Text style={styles.noDataText}>No attendance record for today</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    details: {
        backgroundColor: COLORS.background,
        borderRadius: 8,
        padding: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    durationValue: {
        color: COLORS.success,
    },
    noDataText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
