export const API_BASE_URL = 'https://bizentify.envisionxperts.com/api/v1';

export const OFFICE_LOCATION = {
  latitude: 0, // Will be fetched from user's admin settings
  longitude: 0,
  radius: 100, // meters - Will be fetched from user's admin settings
};

export const GPS_CONFIG = {
  accuracy: 'high' as const,
  timeInterval: 5000, // 5 seconds
  distanceInterval: 10, // 10 meters
  timeout: 15000, // 15 seconds
};

export const APP_CONFIG = {
  tokenRefreshThreshold: 300, // 5 minutes before expiry
  maxRetries: 3,
  retryDelay: 1000,
};

export const COLORS = {
  primary: '#2196F3',
  secondary: '#03DAC6',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
};
