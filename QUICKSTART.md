# Quick Start Guide - Attendance App

## For Testing the App

### Step 1: Update Configuration

1. Open `src/constants/config.ts`
2. Update office coordinates:
```typescript
export const OFFICE_LOCATION = {
  latitude: 0,  // Your office latitude
  longitude: 0, // Your office longitude
  radius: 100,  // Radius in meters
};
```

### Step 2: Add Google Maps API Key (Optional)

**Note:** GPS location tracking works WITHOUT this key. The key is only needed for map visualization.

If you want to see the map:
1. Get a Google Maps API key from: https://console.cloud.google.com/
2. Open `app.json`
3. Add your key in the `googleMaps.apiKey` field

**Without the key:** Location tracking, check-in/check-out all work perfectly. You just won't see the visual map.

### Step 3: Test on Device

**Option A: Using Expo Go (Fastest)**
```bash
npm start
```
- Install "Expo Go" app from Play Store
- Scan QR code from terminal
- App will load instantly

**Option B: Build APK**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo (create free account if needed)
eas login

# Build APK
eas build --platform android --profile preview
```
- Wait for build to complete (~10-15 minutes)
- Download APK from provided link
- Install on Android device

### Step 4: Login

Use employee credentials from your system:
- Email: employee@example.com
- Password: your_password

### Step 5: Test Attendance

1. **Check In**:
   - Tap "Check In" button
   - Allow location permissions
   - Wait for GPS to acquire location
   - You'll see a map with office location
   - If within radius, tap "Check In"

2. **Check Out**:
   - Tap "Check Out" button
   - Location will be acquired
   - Tap "Check Out" to complete

3. **View History**:
   - Tap "View Attendance History"
   - See all past records

## Important Notes

⚠️ **Office Location**: Must be set correctly in config.ts
⚠️ **Google Maps Key**: Required for map display
⚠️ **GPS**: Must be enabled on device
⚠️ **Internet**: Required for API calls
⚠️ **Mock Location**: Disable GPS spoofing apps

## Common Issues

**"Location permission denied"**
- Go to Settings → Apps → Attendance App → Permissions
- Enable Location

**"GPS disabled"**
- Enable GPS in device settings

**"Out of range"**
- Move closer to office location
- Check if office coordinates are correct

**"Mock location detected"**
- Disable developer options
- Disable GPS spoofing apps

## Build Commands Reference

```bash
# Development
npm start              # Start Expo dev server
npm run android        # Run on Android emulator
npm run ios            # Run on iOS simulator (Mac only)

# Building
eas build --platform android --profile preview   # Build APK
eas build --platform android --profile production # Build for Play Store

# Utilities
npm run lint           # Check code quality
npm run type-check     # Check TypeScript types
```

## Next Steps

After testing:
1. Customize colors in `src/constants/config.ts`
2. Add company logo to `assets/` folder
3. Update app name in `app.json`
4. Build production APK for distribution

## Support

Need help? Check:
- README.md for detailed documentation
- Expo docs: https://docs.expo.dev/
- React Native docs: https://reactnative.dev/
