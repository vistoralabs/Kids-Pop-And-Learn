# Kids Pop & Learn — Android build

## Files delivered

- `KidsPopAndLearn-v1.0-release.apk` — signed release APK (install directly on any Android phone)
- `KidsPopAndLearn-v1.0-debug.apk` — debug APK (for testing / logcat)
- `KidsPopAndLearn-v1.0-release.aab` — signed App Bundle for Google Play upload
- `kids-pop-learn-keystore.jks` — signing key (alias `kidspoplearn`, store & key password `kidspop123`)

**Keep the keystore safe.** Every future Play Store update must be signed with this same
file, otherwise Google will reject it. Change the password before real publishing.

## App details

- Package / applicationId: `com.kidspopandlearn.app`
- versionCode 1, versionName 1.0
- minSdk 24, target/compile SDK 36 (Play Store compliant)
- Portrait locked, fully offline (all 10 categories × 10 levels bundled inside the app)
- No internet permission needed for gameplay, no accounts, no analytics, no data collection
- Ads: only the AdMob abstraction with Google TEST ids is present. Nothing is shown until a
  native AdMob plugin plus real ids are added (see `src/services/ads.ts`).

## Rebuild locally

```bash
bun install
bun run build:mobile     # builds the offline bundle into www/
bunx cap sync android
cd android && ./gradlew assembleRelease bundleRelease
```

To sign, create `android/keystore.properties`:

```
storeFile=/absolute/path/to/kids-pop-learn-keystore.jks
storePassword=kidspop123
keyAlias=kidspoplearn
keyPassword=kidspop123
```

Outputs:
- `android/app/build/outputs/apk/release/app-release.apk`
- `android/app/build/outputs/bundle/release/app-release.aab`

CI is also set up: `.github/workflows/android.yml` builds both artifacts on demand.

## Play Store checklist

1. Create the app in Play Console → upload the `.aab`.
2. Fill the **Families / Designed for Families** declaration (no data collection, ads: none/child-safe).
3. Data safety form: "No data collected, no data shared".
4. Content rating questionnaire → Everyone.
5. Bump `versionCode` in `android/app/build.gradle` for each new upload.
