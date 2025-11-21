const fs = require('fs');
const path = require('path');

// Get version bump type from command line argument
const bumpType = process.argv[2] || 'patch'; // patch, minor, or major

// Read app.json
const appJsonPath = path.join(__dirname, '..', 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Parse current version
const currentVersion = appJson.expo.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Calculate new version
let newVersion;
switch (bumpType) {
    case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
    case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
    case 'patch':
    default:
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
}

// Update version in app.json
appJson.expo.version = newVersion;
appJson.expo.android.versionCode = appJson.expo.android.versionCode + 1;

// Update version in package.json
packageJson.version = newVersion;

// Write updated files
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`✅ Version bumped from ${currentVersion} to ${newVersion}`);
console.log(`📱 Android versionCode: ${appJson.expo.android.versionCode}`);
console.log(`\nUpdated files:`);
console.log(`  - app.json`);
console.log(`  - package.json`);
console.log(`\nNext steps:`);
console.log(`  1. Review the changes`);
console.log(`  2. Commit: git add . && git commit -m "chore: bump version to ${newVersion}"`);
console.log(`  3. Push: git push`);
