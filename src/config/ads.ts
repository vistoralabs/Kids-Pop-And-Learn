/**
 * Centralized Ad Unit IDs configuration.
 *
 * All ad IDs live here and ONLY here.
 * Replace test IDs with live IDs before publishing to Play Store.
 *
 * Current: Google AdMob TEST IDs (safe for development, no revenue).
 */

export const AD_CONFIG = {
  /** Google AdMob Application ID — goes into AndroidManifest.xml */
  APP_ID: "ca-app-pub-3940256099942544~3347511713",

  /** Banner ad unit (not currently used, reserved for future) */
  BANNER_ID: "ca-app-pub-3940256099942544/6300978111",

  /** Interstitial ad unit — shown between levels */
  INTERSTITIAL_ID: "ca-app-pub-3940256099942544/1033173712",

  /** Rewarded ad unit — shown for hints */
  REWARDED_ID: "ca-app-pub-3940256099942544/5224354917",
} as const;
