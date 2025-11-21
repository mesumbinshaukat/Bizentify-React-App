# Quick Setup Guide

## Immediate Next Steps

### 1. Install Dependencies (Already Done ✅)
```bash
npm install
```

### 2. Setup GitHub Secret for CI/CD

**Required for automated builds and updates**

1. **Generate Expo Token**:
   ```bash
   eas whoami
   ```
   Then visit: https://expo.dev/accounts/[your-account]/settings/access-tokens
   Click "Create Token" → Copy the token

2. **Add to GitHub**:
   - Go to: https://github.com/[your-username]/[repo-name]/settings/secrets/actions
   - Click "New repository secret"
   - Name: `EXPO_TOKEN`
   - Value: [paste your token]
   - Click "Add secret"

### 3. Create Git Branches

```bash
# Create development branch
git checkout -b development
git push -u origin development

# Create staging branch  
git checkout -b staging
git push -u origin staging

# Return to main
git checkout main
```

### 4. Test the App

#### Test Password Toggle (Can test now)
1. Run: `npm start`
2. Open on device/emulator
3. Go to login screen
4. Enter password and click eye icon
5. Verify password visibility toggles

#### Test Location Fix (Requires physical device)
1. Build APK: `eas build --profile preview --platform android`
2. Install on Android device
3. Grant location permissions
4. Navigate to Check-In screen
5. Verify location is acquired without error

#### Test OTA Updates (After setting up GitHub secret)
1. Make a small code change (e.g., change text)
2. Commit and push to development branch
3. GitHub Actions will publish OTA update
4. Open app → should receive update

## Usage

### Building APKs

```bash
# Preview/Testing build
npm run build:preview

# Production build
npm run build:production
```

### Publishing OTA Updates

```bash
# Development channel
npm run update:dev "Your update message"

# Staging channel
npm run update:staging "Your update message"

# Production channel
npm run update:prod "Your update message"
```

### Version Management

```bash
# Patch version (1.0.0 → 1.0.1)
npm run version:patch

# Minor version (1.0.0 → 1.1.0)
npm run version:minor

# Major version (1.0.0 → 2.0.0)
npm run version:major
```

## What's Automated

When you push code:

- **Push to `main`** → Builds production APK + publishes OTA update
- **Push to `staging`** → Publishes OTA update to staging channel
- **Push to `development`** → Publishes OTA update to development channel

## Key Files

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[builds/README.md](./builds/README.md)** - APK installation guide
- **[walkthrough.md](./.gemini/antigravity/brain/*/walkthrough.md)** - Implementation details

## Support

For detailed information, see [DEPLOYMENT.md](./DEPLOYMENT.md)
