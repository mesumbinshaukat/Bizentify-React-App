import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CheckInScreen from '../screens/CheckInScreen';
import CheckOutScreen from '../screens/CheckOutScreen';
import AttendanceHistoryScreen from '../screens/AttendanceHistoryScreen';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../constants/config';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {!isAuthenticated ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                </Stack.Navigator>
            ) : (
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: { backgroundColor: COLORS.primary },
                        headerTintColor: '#FFFFFF',
                        headerTitleStyle: { fontWeight: '600' },
                    }}
                >
                    <Stack.Screen
                        name="Dashboard"
                        component={DashboardScreen}
                        options={{ title: 'Attendance' }}
                    />
                    <Stack.Screen
                        name="CheckIn"
                        component={CheckInScreen}
                        options={{ title: 'Check In' }}
                    />
                    <Stack.Screen
                        name="CheckOut"
                        component={CheckOutScreen}
                        options={{ title: 'Check Out' }}
                    />
                    <Stack.Screen
                        name="History"
                        component={AttendanceHistoryScreen}
                        options={{ title: 'Attendance History' }}
                    />
                </Stack.Navigator>
            )}
        </NavigationContainer>
    );
}
