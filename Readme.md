# Attendance App - React Native

A professional attendance tracking mobile application built with React Native and Expo.

## Features

✅ **Employee Authentication** - Secure JWT-based login
✅ **GPS-Based Attendance** - High-accuracy location tracking
✅ **Map Visualization** - See office location and radius on map
✅ **Mock Location Detection** - Prevent GPS spoofing
✅ **Check-In/Check-Out** - Mark attendance with location validation
✅ **Attendance History** - View past attendance records
✅ **Dashboard** - Today's status and monthly statistics
✅ **Offline Support** - Graceful handling of network issues

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo account (for building APK)
- Android Studio (for testing on emulator) OR Physical Android device

## Installation

1. Navigate to the project directory:
```bash
cd attendance-app
```

2. Install dependencies (already done):
```bash
npm install
```

3. **IMPORTANT**: Update the office location coordinates in `src/constants/config.ts`:
```typescript
export const OFFICE_LOCATION = {
  latitude: YOUR_OFFICE_LATITUDE,  // Replace with actual coordinates
  longitude: YOUR_OFFICE_LONGITUDE,
  radius: 100, // meters
};
```

4. **IMPORTANT**: Add Google Maps API key in `app.json`:
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
    }
  }
}
```

## Running the App

### Development Mode

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

### Testing on Physical Device

1. Install Expo Go app from Play Store
2. Scan the QR code shown in terminal
3. App will load on your device

## Building APK

### Method 1: Using EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure the project:
```bash
eas build:configure
```

4. Build APK:
```bash
eas build --platform android --profile preview
```

5. Download the APK from the provided link

### Method 2: Local Build

```bash
# Build locally (requires Android SDK)
npx expo run:android --variant release
```

## Configuration

### API Endpoint

The app connects to: `https://bizentify.envisionxperts.com/api/v1`

To change this, update `src/constants/config.ts`:
```typescript
export const API_BASE_URL = 'https://your-domain.com/api/v1';
```

### GPS Settings

Adjust GPS accuracy and timing in `src/constants/config.ts`:
```typescript
export const GPS_CONFIG = {
  accuracy: 'high',
  timeInterval: 5000, // 5 seconds
  distanceInterval: 10, // 10 meters
  timeout: 15000, // 15 seconds
};
```

## Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # Reusable components
├── constants/        # Configuration and constants
├── contexts/         # React contexts (Auth)
├── navigation/       # Navigation setup
├── screens/          # App screens
├── types/            # TypeScript types
└── utils/            # Utility functions
```

## Key Features Explained

### Enhanced GPS Tracking

- **High Accuracy Mode**: Uses `Accuracy.Highest` for precise location
- **Averaging**: Takes multiple readings and averages them
- **Mock Detection**: Detects and prevents GPS spoofing
- **Permission Handling**: Requests foreground and background permissions
- **Error Handling**: Comprehensive error messages for GPS issues

### Security

- **JWT Authentication**: Secure token-based auth
- **Secure Storage**: Tokens stored in Expo SecureStore
- **HTTPS Only**: All API calls over HTTPS
- **Mock Location Detection**: Prevents fake GPS

### User Experience

- **Map Visualization**: See your location relative to office
- **Real-time Distance**: Shows distance from office
- **Visual Feedback**: Color-coded status indicators
- **Pull-to-Refresh**: Refresh data with swipe gesture
- **Loading States**: Clear loading indicators

## Troubleshooting

### Location Permission Issues

If location permission is denied:
1. Go to device Settings
2. Apps → Attendance App → Permissions
3. Enable Location permission

### GPS Not Working

1. Ensure GPS is enabled on device
2. Go to an open area for better signal
3. Restart the app

### Mock Location Detected

1. Disable any GPS spoofing apps
2. Go to Developer Options
3. Disable "Mock location app"

### Build Errors

If build fails:
```bash
# Clear cache
npm start -- --clear

# Reinstall dependencies
rm -rf node_modules
npm install
```

## API Endpoints Used

- `POST /auth/employee/login` - Employee login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout
- `GET /attendance` - Get attendance list
- `POST /attendance/check-in` - Check in
- `POST /attendance/check-out` - Check out
- `GET /dashboard` - Get dashboard stats

## Environment

- React Native with Expo SDK
- TypeScript for type safety
- React Navigation for routing
- Axios for API calls
- React Query for data fetching
- Expo Location for GPS
- React Native Maps for map display

## Support

For issues or questions, contact the development team.

## License

Proprietary - Envision Xperts
