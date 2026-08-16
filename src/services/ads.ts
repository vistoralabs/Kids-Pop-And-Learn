/**
 * Ad abstraction.
 *
 * The web build never shows ads. When this app is wrapped for Android
 * (Capacitor + the AdMob plugin) replace `webAdService` with a native
 * implementation — no game code needs to change.
 *
 * Child-safety rules baked in here:
 *  - ads are only ever *considered* between sessions, never during a round
 *  - children are never asked or encouraged to tap an ad
 *  - rewarded ads are parent-gated only
 *  - only Google TEST ids live in the codebase
 */

export const AD_TEST_IDS = {
  // Official Google test ids — safe for development, never production revenue.
  banner: "ca-app-pub-3940256099942544/6300978111",
  interstitial: "ca-app-pub-3940256099942544/1033173712",
  rewarded: "ca-app-pub-3940256099942544/5224354917",
} as const;

export interface AdService {
  readonly enabled: boolean;
  isPremium(): boolean;
  /** Between-session interstitial. Returns false when nothing was shown. */
  showInterstitial(reason: "session-end"): Promise<boolean>;
  /** Parent-gated only. */
  showRewarded(): Promise<boolean>;
}

export const webAdService: AdService = {
  enabled: false,
  isPremium() {
    return false;
  },
  async showInterstitial() {
    return false;
  },
  async showRewarded() {
    return false;
  },
};

export const ads: AdService = webAdService;
