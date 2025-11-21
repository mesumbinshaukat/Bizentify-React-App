# Build Artifacts

This directory contains APK build artifacts for the Attendance App.

## Directory Structure

```
builds/
├── production/     # Production builds for end users
├── staging/        # Staging builds for pre-production testing
└── development/    # Development builds for testing
```

## Download and Install

### From EAS Dashboard

1. Go to [EAS Build Dashboard](https://expo.dev/accounts/[your-account]/projects/attendance-app/builds)
2. Find the latest successful build
3. Click the download button to get the APK
4. Transfer the APK to your Android device
5. Enable "Install from Unknown Sources" in your device settings
6. Install the APK

### Direct Installation

If you have the APK file:

1. Transfer the APK to your Android device (via USB, email, or cloud storage)
2. Open the file manager on your device
3. Navigate to the APK file
4. Tap to install
5. Follow the on-screen instructions

## Build Channels

### Production Channel
- **Purpose**: End users
- **Update Frequency**: Stable releases only
- **Testing**: Thoroughly tested on staging first

### Staging Channel
- **Purpose**: Pre-production testing
- **Update Frequency**: Before each production release
- **Testing**: QA and user acceptance testing

### Development Channel
- **Purpose**: Active development and testing
- **Update Frequency**: Frequent updates
- **Testing**: Developer testing

## OTA Updates

Apps installed from these builds will automatically receive Over-The-Air (OTA) updates when:

1. The app is opened or resumed
2. A new update is published to the same channel
3. The update contains JavaScript/React Native code changes

**Note**: Native code changes (like adding new native modules) require a new APK build and installation.

## Version Information

Check the app version:
- Open the app
- Go to Settings or About section
- Version number is displayed

## Troubleshooting

### App Won't Install
- Ensure "Install from Unknown Sources" is enabled
- Check if you have enough storage space
- Try uninstalling the old version first

### Updates Not Received
- Ensure you have an internet connection
- Close and reopen the app
- Check if you're on the correct channel

### App Crashes After Update
- Clear app data and cache
- Reinstall the app
- Report the issue to the development team

## Support

For issues or questions, contact the development team or create an issue in the GitHub repository.
