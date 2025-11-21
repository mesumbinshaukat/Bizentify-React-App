# Deployment Guide

This guide explains how to build, deploy, and manage updates for the Attendance App.

## Prerequisites

1. **EAS CLI**: Install globally
   ```bash
   npm install -g eas-cli
   ```

2. **Expo Account**: Create an account at [expo.dev](https://expo.dev)

3. **EAS Login**: Authenticate
   ```bash
   eas login
   ```

4. **GitHub Secrets**: Add `EXPO_TOKEN` to your repository secrets
   - Generate token: `eas whoami` then go to expo.dev → Account Settings → Access Tokens
   - Add to GitHub: Repository Settings → Secrets and variables → Actions → New repository secret

## Build Types

### 1. Production Build (APK)

**When to use**: Stable releases for end users

```bash
npm run build:production
# or
eas build --profile production --platform android
```

**What happens**:
- Builds production APK
- Auto-increments version code
- Publishes to production update channel
- APK available on EAS dashboard

### 2. Preview/Staging Build

**When to use**: Pre-production testing

```bash
npm run build:preview
# or
eas build --profile preview --platform android
```

### 3. Development Build

**When to use**: Active development with dev tools

```bash
eas build --profile development --platform android
```

## OTA Updates

OTA (Over-The-Air) updates allow you to push JavaScript/React Native changes without requiring users to download a new APK.

### Update Channels

- **production**: End users
- **staging**: Pre-production testing
- **development**: Active development

### Publishing Updates

#### Production Update
```bash
npm run update:prod "Your update message"
# or
eas update --branch production --message "Your update message"
```

#### Staging Update
```bash
npm run update:staging "Your update message"
# or
eas update --branch staging --message "Your update message"
```

#### Development Update
```bash
npm run update:dev "Your update message"
# or
eas update --branch development --message "Your update message"
```

### What Can Be Updated via OTA?

✅ **Can update**:
- JavaScript code changes
- React Native components
- Styling changes
- Business logic
- API endpoints
- Assets (images, fonts)

❌ **Cannot update** (requires new APK):
- Native module additions
- Native code changes
- Permissions changes
- App configuration changes (some)

## Version Management

### Bump Version

Use the version bump scripts:

```bash
# Patch version (1.0.0 → 1.0.1)
npm run version:patch

# Minor version (1.0.0 → 1.1.0)
npm run version:minor

# Major version (1.0.0 → 2.0.0)
npm run version:major
```

This updates:
- `app.json` → `expo.version`
- `app.json` → `expo.android.versionCode`
- `package.json` → `version`

After bumping, commit and push:
```bash
git add .
git commit -m "chore: bump version to X.X.X"
git push
```

## CI/CD Workflows

### Automatic Builds (GitHub Actions)

#### Production Build Workflow
**Trigger**: Push to `main` branch

**Actions**:
1. Builds production APK
2. Publishes OTA update to production channel
3. Comments on commit with build status

#### OTA Update Workflow
**Trigger**: Push to `development` or `staging` branches

**Actions**:
1. Publishes OTA update to respective channel
2. Comments on commit with update status

### Manual Workflow Dispatch

You can manually trigger workflows from GitHub Actions tab:
1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"
4. Fill in parameters
5. Run

## Deployment Workflow

### For New Features

1. **Develop on feature branch**
   ```bash
   git checkout -b feature/your-feature
   # Make changes
   git commit -m "feat: your feature"
   ```

2. **Merge to development**
   ```bash
   git checkout development
   git merge feature/your-feature
   git push
   ```
   → Triggers OTA update to development channel

3. **Test on development builds**
   - Install development APK on test devices
   - Verify updates are received
   - Test functionality

4. **Merge to staging**
   ```bash
   git checkout staging
   git merge development
   git push
   ```
   → Triggers OTA update to staging channel

5. **QA Testing**
   - Install staging APK
   - Perform thorough testing
   - Get approval

6. **Bump version** (if needed)
   ```bash
   npm run version:patch
   git add .
   git commit -m "chore: bump version to X.X.X"
   ```

7. **Merge to main**
   ```bash
   git checkout main
   git merge staging
   git push
   ```
   → Triggers production build and OTA update

8. **Download APK**
   - Go to [EAS Dashboard](https://expo.dev)
   - Download production APK
   - Distribute to users

## Rollback Procedure

If an update causes issues:

### Rollback OTA Update

```bash
# Republish previous working version
eas update --branch production --message "Rollback to previous version"
```

### Rollback to Previous APK

1. Find previous working build on EAS dashboard
2. Download that APK
3. Distribute to affected users
4. Publish OTA update with fix

## Monitoring

### Check Update Status

```bash
# View recent updates
eas update:list --branch production

# View specific update
eas update:view [update-id]
```

### Build Status

```bash
# List recent builds
eas build:list --platform android

# View specific build
eas build:view [build-id]
```

## Best Practices

1. **Always test on development first**
2. **Use staging for QA**
3. **Bump versions for significant changes**
4. **Write clear update messages**
5. **Test OTA updates before production**
6. **Keep builds directory organized**
7. **Document breaking changes**
8. **Monitor update adoption rates**

## Troubleshooting

### Build Fails

- Check EAS dashboard for error logs
- Verify all dependencies are installed
- Check expo/eas versions compatibility
- Review recent code changes

### Updates Not Received

- Verify update was published successfully
- Check app is on correct channel
- Ensure app is connected to internet
- Try force-closing and reopening app

### Version Conflicts

- Ensure version numbers are incremented
- Check versionCode is unique
- Verify no duplicate versions on Play Store

## Play Store Submission (Future)

When ready to submit to Play Store:

1. **Build AAB** (Android App Bundle)
   ```bash
   eas build --profile production --platform android
   ```
   (Configure eas.json to use AAB instead of APK)

2. **Prepare Store Listing**
   - Screenshots
   - Description
   - Privacy policy
   - App icon

3. **Submit for Review**
   - Upload AAB to Play Console
   - Fill in all required information
   - Submit for review

4. **After Approval**
   - OTA updates still work
   - Major updates require new AAB submission
   - Monitor crash reports and reviews

## Support

For questions or issues:
- Check [Expo Documentation](https://docs.expo.dev)
- Review [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- Contact development team
