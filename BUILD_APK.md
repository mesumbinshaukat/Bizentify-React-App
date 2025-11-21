# Building APK - Step by Step Guide

## Prerequisites
✅ EAS CLI is already installed
✅ Project is configured for APK build

## Steps to Build APK

### Step 1: Login to Expo

Open a **NEW terminal/PowerShell** in the project folder and run:

```bash
cd e:\Projects\Envision-Reporting\attendance-app
npx eas-cli login
```

**Options:**
- **If you have an Expo account**: Enter your email and password
- **If you don't have an account**: 
  1. Go to https://expo.dev/signup
  2. Create a free account
  3. Then login with those credentials

### Step 2: Configure the Project

After logging in, run:

```bash
npx eas-cli build:configure
```

This will:
- Link your project to your Expo account
- Create necessary configuration
- Ask a few questions - just press Enter to accept defaults

### Step 3: Build the APK

Run this command:

```bash
npx eas-cli build --platform android --profile preview
```

**What happens:**
1. Your code will be uploaded to Expo's servers
2. Expo will build a native Android APK
3. Build takes ~10-15 minutes
4. You'll get a download link when done

**During the build, you'll see:**
- Upload progress
- Build queue status
- Build logs
- Download link when complete

### Step 4: Download and Install

1. **Download the APK** from the link provided
2. **Transfer to your phone** (via USB, email, or direct download)
3. **Install the APK**:
   - Enable "Install from Unknown Sources" in Android settings
   - Tap the APK file to install
   - Grant permissions when asked

### Step 5: Test the App

1. Open the installed app
2. Login with your credentials
3. Test check-in/check-out with GPS
4. Verify all features work

---

## Important Notes

### Before Building:

1. **Set Office Location** in `src/constants/config.ts`:
```typescript
export const OFFICE_LOCATION = {
  latitude: YOUR_OFFICE_LATITUDE,  // Replace with actual
  longitude: YOUR_OFFICE_LONGITUDE,
  radius: 100,
};
```

2. **Optional - Add Google Maps API Key** in `app.json` (for map visualization):
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_API_KEY_HERE"
    }
  }
}
```

### Troubleshooting

**If build fails:**
- Check your internet connection
- Ensure you're logged in: `npx eas-cli whoami`
- Try again: `npx eas-cli build --platform android --profile preview`

**If login fails:**
- Make sure you created an account at https://expo.dev/signup
- Use the exact email/password from your account
- Try: `npx eas-cli logout` then `npx eas-cli login` again

**Build taking too long:**
- Normal build time: 10-15 minutes
- Check build status: https://expo.dev/accounts/[your-username]/projects/attendance-app/builds

---

## Quick Commands Reference

```bash
# Check if logged in
npx eas-cli whoami

# Logout
npx eas-cli logout

# Login
npx eas-cli login

# Build APK
npx eas-cli build --platform android --profile preview

# Check build status
npx eas-cli build:list

# View build details
npx eas-cli build:view [BUILD_ID]
```

---

## Alternative: Local Build (Advanced)

If you want to build locally without Expo servers:

```bash
# Install Android Studio and SDK first
# Then run:
npx expo run:android --variant release
```

This requires:
- Android Studio installed
- Android SDK configured
- More complex setup

**Recommended:** Use EAS Build (cloud) for simplicity!

---

## After APK is Built

You'll receive:
- ✅ Download link (valid for 30 days)
- ✅ Build ID for reference
- ✅ Build logs for debugging

**Save the download link** - you can share it with others to test!

---

## Next Steps After Testing

1. **Test thoroughly** on your device
2. **Fix any bugs** if found
3. **Rebuild** with fixes: `npx eas-cli build --platform android --profile preview`
4. **Production build** when ready: `npx eas-cli build --platform android --profile production`

---

## Need Help?

If you encounter any errors:
1. Copy the error message
2. Check build logs on Expo dashboard
3. Common issues are usually permissions or configuration

**Ready to build?** Just run the commands in order! 🚀
