import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { fixRequestsApi } from '../api/fixRequests';
import { FixRequest } from '../types/attendance';
import { COLORS } from '../constants/config';

type FixRequestScreenRouteProp = RouteProp<{
    FixRequest: {
        attendanceId: number;
        attendanceDate: string;
        checkInTime: string;
    };
}, 'FixRequest'>;

export default function FixRequestScreen() {
    const navigation = useNavigation();
    const route = useRoute<FixRequestScreenRouteProp>();
    const { attendanceId, attendanceDate, checkInTime } = route.params;

    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fixRequests, setFixRequests] = useState<FixRequest[]>([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(true);

    useEffect(() => {
        loadFixRequests();
    }, []);

    const loadFixRequests = async () => {
        try {
            setIsLoadingRequests(true);
            const response = await fixRequestsApi.getFixRequests();
            if (response.success && response.data) {
                setFixRequests(response.data);
            }
        } catch (error: any) {
            console.error('Error loading fix requests:', error);
        } finally {
            setIsLoadingRequests(false);
        }
    };

    const handleSubmit = async () => {
        if (!reason.trim()) {
            Alert.alert('Error', 'Please enter a reason for the fix request');
            return;
        }

        if (reason.length > 1000) {
            Alert.alert('Error', 'Reason must be less than 1000 characters');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fixRequestsApi.createFixRequest({
                attendance_id: attendanceId,
                reason: reason.trim(),
            });

            if (response.success) {
                Alert.alert(
                    'Success',
                    'Fix request submitted successfully. An admin will review it soon.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to submit fix request';
            Alert.alert('Error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (dateTimeString: string) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return '#FFC107';
            case 'approved':
                return COLORS.success;
            case 'rejected':
                return COLORS.error;
            default:
                return COLORS.textSecondary;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return '⏳';
            case 'approved':
                return '✅';
            case 'rejected':
                return '❌';
            default:
                return '📝';
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Pending Attendance Details */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pending Attendance</Text>
                <View style={styles.card}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date:</Text>
                        <Text style={styles.detailValue}>{formatDate(attendanceDate)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Check-in Time:</Text>
                        <Text style={styles.detailValue}>{formatTime(checkInTime)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <Text style={[styles.detailValue, { color: COLORS.error }]}>
                            Not Checked Out
                        </Text>
                    </View>
                </View>
            </View>

            {/* Fix Request Form */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Request Fix</Text>
                <View style={styles.card}>
                    <Text style={styles.label}>
                        Reason <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Explain why you couldn't check out (e.g., emergency, forgot, system issue)"
                        value={reason}
                        onChangeText={setReason}
                        multiline
                        numberOfLines={4}
                        maxLength={1000}
                        editable={!isSubmitting}
                    />
                    <Text style={styles.charCount}>{reason.length}/1000</Text>

                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Fix Request</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Previous Fix Requests */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Fix Requests</Text>
                {isLoadingRequests ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : fixRequests.length > 0 ? (
                    fixRequests.map((request) => (
                        <View key={request.id} style={styles.requestCard}>
                            <View style={styles.requestHeader}>
                                <Text style={styles.requestIcon}>{getStatusIcon(request.status)}</Text>
                                <View style={styles.requestHeaderText}>
                                    <Text style={styles.requestDate}>
                                        {formatDate(request.created_at)}
                                    </Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: getStatusColor(request.status) },
                                        ]}
                                    >
                                        <Text style={styles.statusText}>
                                            {request.status.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <Text style={styles.requestReason} numberOfLines={2}>
                                {request.reason}
                            </Text>

                            {request.admin_notes && (
                                <View style={styles.adminNotesContainer}>
                                    <Text style={styles.adminNotesLabel}>Admin Response:</Text>
                                    <Text style={styles.adminNotes}>{request.admin_notes}</Text>
                                </View>
                            )}

                            {request.processed_at && (
                                <Text style={styles.processedDate}>
                                    Processed: {formatDate(request.processed_at)}
                                </Text>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No fix requests yet</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    card: {
        backgroundColor: COLORS.surface,
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
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
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 8,
    },
    required: {
        color: COLORS.error,
    },
    textArea: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: COLORS.text,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: 'right',
        marginTop: 4,
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    requestCard: {
        backgroundColor: COLORS.surface,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    requestHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    requestIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    requestHeaderText: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    requestDate: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },
    requestReason: {
        fontSize: 14,
        color: COLORS.text,
        marginBottom: 12,
        lineHeight: 20,
    },
    adminNotesContainer: {
        backgroundColor: COLORS.background,
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    adminNotesLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    adminNotes: {
        fontSize: 13,
        color: COLORS.text,
        lineHeight: 18,
    },
    processedDate: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
});
