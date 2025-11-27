import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/config';

interface PendingCheckoutAlertProps {
    attendance: {
        id: number;
        date: string;
        check_in: string;
    };
    onRequestFix: () => void;
}

export const PendingCheckoutAlert: React.FC<PendingCheckoutAlertProps> = ({
    attendance,
    onRequestFix,
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
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
                <Text style={styles.icon}>⚠️</Text>
                <Text style={styles.title}>Pending Checkout</Text>
            </View>

            <Text style={styles.message}>
                You have an unclosed attendance from {formatDate(attendance.date)}.
            </Text>

            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Check-in:</Text>
                    <Text style={styles.detailValue}>{formatTime(attendance.check_in)}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={styles.detailValue}>Not checked out</Text>
                </View>
            </View>

            <Text style={styles.instruction}>
                Please request a fix to resolve this before checking in for today.
            </Text>

            <TouchableOpacity style={styles.button} onPress={onRequestFix}>
                <Text style={styles.buttonText}>Request Fix</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF3CD',
        borderLeftWidth: 4,
        borderLeftColor: '#FFC107',
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        fontSize: 24,
        marginRight: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#856404',
    },
    message: {
        fontSize: 14,
        color: '#856404',
        marginBottom: 12,
        lineHeight: 20,
    },
    detailsContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    detailLabel: {
        fontSize: 13,
        color: '#856404',
        fontWeight: '600',
    },
    detailValue: {
        fontSize: 13,
        color: '#856404',
    },
    instruction: {
        fontSize: 13,
        color: '#856404',
        marginBottom: 12,
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#FFC107',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    buttonText: {
        color: '#856404',
        fontSize: 15,
        fontWeight: '600',
    },
});
