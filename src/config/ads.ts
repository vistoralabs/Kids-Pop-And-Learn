/**
 * Centralized Ad Unit IDs configuration.
 * All ad IDs live here and ONLY here.
 * Replace test IDs with live IDs before publishing to Play Store.
 */
export const ADS = {
  banner: "ca-app-pub-3940256099942544/6300978111",
  interstitial: "ca-app-pub-3940256099942544/1033173712",
  rewarded: "ca-app-pub-3940256099942544/5224354917",
};

// Keep AD_CONFIG as compatibility wrapper
export const AD_CONFIG = {
  APP_ID: "ca-app-pub-3940256099942544~3347511713",
  BANNER_ID: ADS.banner,
  INTERSTITIAL_ID: ADS.interstitial,
  REWARDED_ID: ADS.rewarded,
} as const;
