# CI/CD Setup Notes

## Current Configuration

The CI/CD pipeline is configured for **OTA (Over-The-Air) updates only** via GitHub Actions. This is the recommended approach because:

1. **OTA updates are faster** - No need to wait for APK builds
2. **Users get updates instantly** - Just open the app
3. **APK builds can be done manually** when needed

## How It Works

### Automatic OTA Updates

When you push to any branch:
- **main** → Publishes to `production` channel
- **staging** → Publishes to `staging` channel  
- **development** → Publishes to `development` channel

Users with the app installed will automatically receive updates when they open the app.

### Manual APK Builds

When you need a new APK (for new installs or native changes):

```bash
# Build production APK
eas build --profile production --platform android

# Build preview/staging APK
eas build --profile preview --platform android

# Build development APK
eas build --profile development --platform android
```

The build will run on EAS servers and you can download the APK from:
https://expo.dev

## Why This Approach?

GitHub Actions has limitations for building native apps:
- Limited build time
- Complex native dependencies
- Better to use EAS Build servers (optimized for React Native)

**Best Practice:**
- Use GitHub Actions for OTA updates (fast, automated)
- Use EAS Build directly for APK builds (reliable, optimized)

## Workflow

1. **Develop features** → Push to development branch → OTA update
2. **Test on staging** → Push to staging branch → OTA update
3. **Release to production** → Push to main branch → OTA update
4. **Need new APK?** → Run `eas build` manually

## Benefits

✅ Fast deployments (OTA updates in seconds)
✅ No GitHub Actions build failures
✅ Reliable APK builds via EAS
✅ Users always on latest version
✅ Easy rollback (just publish previous version)

## First Time Setup

Since this is your first deployment:

1. **Build the initial APK manually:**
   ```bash
   eas build --profile production --platform android
   ```

2. **Download and distribute** the APK to users

3. **From then on**, just push code changes and users get OTA updates automatically!

## When to Build New APK

You only need a new APK when:
- Adding new native modules
- Changing native permissions
- Updating native dependencies
- First time installation
- Major version releases

For everything else (JavaScript/React Native changes), OTA updates work perfectly!
