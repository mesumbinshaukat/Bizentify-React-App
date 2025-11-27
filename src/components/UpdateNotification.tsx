import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/config';

interface UpdateNotificationProps {
    isDownloading: boolean;
    downloadProgress: number;
    onUpdate: () => void;
    onDismiss?: () => void;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({
    isDownloading,
    downloadProgress,
    onUpdate,
    onDismiss,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.icon}>🔄</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>
                        {isDownloading ? 'Downloading Update...' : 'Update Available'}
                    </Text>
                    <Text style={styles.message}>
                        {isDownloading
                            ? `${downloadProgress}% complete`
                            : 'A new version of the app is ready to install'}
                    </Text>
                </View>
            </View>

            {isDownloading ? (
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${downloadProgress}%` }]} />
                    </View>
                </View>
            ) : (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.updateButton} onPress={onUpdate}>
                        <Text style={styles.updateButtonText}>Update Now</Text>
                    </TouchableOpacity>
                    {onDismiss && (
                        <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
                            <Text style={styles.dismissButtonText}>Later</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E3F2FD',
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 12,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        fontSize: 28,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0D47A1',
        marginBottom: 4,
    },
    message: {
        fontSize: 13,
        color: '#1565C0',
    },
    progressContainer: {
        marginTop: 8,
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(13, 71, 161, 0.2)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 3,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    updateButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    updateButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    dismissButton: {
        flex: 1,
        backgroundColor: 'rgba(13, 71, 161, 0.1)',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    dismissButtonText: {
        color: '#0D47A1',
        fontSize: 14,
        fontWeight: '600',
    },
});
