/**
 * AdMob Manager Service
 *
 * Manages ad lifecycle for interstitial and rewarded ads using
 * @capacitor-community/admob plugin on Android, with silent
 * no-op fallback for web/browser preview.
 *
 * Usage:
 *   import { adManager } from '../services/adManager';
 *   await adManager.initialize();
 *   await adManager.showInterstitial();
 *   const rewarded = await adManager.showRewarded();
 */

import { AD_CONFIG } from "../config/ads";

/* ------------------------------------------------------------------ */
/* Type declarations for the AdMob Capacitor plugin                    */
/* We declare them inline to avoid hard npm dependency in web builds   */
/* ------------------------------------------------------------------ */

interface AdMobPlugin {
  initialize(opts: { testingDevices?: string[]; initializeForTesting?: boolean }): Promise<void>;
  prepareInterstitial(opts: { adId: string; isTesting?: boolean }): Promise<void>;
  showInterstitial(): Promise<void>;
  prepareRewardVideoAd(opts: { adId: string; isTesting?: boolean }): Promise<void>;
  showRewardVideoAd(): Promise<{ type: string; amount: number }>;
  addListener(event: string, cb: (info: unknown) => void): Promise<{ remove: () => void }>;
}

/* ------------------------------------------------------------------ */
/* Platform detection                                                  */
/* ------------------------------------------------------------------ */

function isNativePlatform(): boolean {
  try {
    // Capacitor sets window.Capacitor on native platforms
    return !!(window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } })
      .Capacitor?.isNativePlatform?.();
  } catch {
    return false;
  }
}

async function getAdMobPlugin(): Promise<AdMobPlugin | null> {
  if (!isNativePlatform()) return null;
  try {
    const mod = await import("@capacitor-community/admob");
    return (mod as unknown as { AdMob: AdMobPlugin }).AdMob;
  } catch {
    console.warn("[AdManager] @capacitor-community/admob not available");
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Ad Manager                                                          */
/* ------------------------------------------------------------------ */

class AdManager {
  private initialized = false;
  private admob: AdMobPlugin | null = null;
  private interstitialReady = false;
  private rewardedReady = false;

  /** Call once at app startup */
  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.admob = await getAdMobPlugin();
    if (!this.admob) {
      console.info("[AdManager] Running in web mode — ads disabled");
      this.initialized = true;
      return;
    }
    try {
      await this.admob.initialize({
        initializeForTesting: true,
        testingDevices: [],
      });
      this.initialized = true;
      console.info("[AdManager] AdMob initialized");
      // Pre-load first ads
      this.prepareInterstitial();
      this.prepareRewarded();
    } catch (err) {
      console.error("[AdManager] Init failed:", err);
      this.initialized = true;
    }
  }

  /** Pre-load an interstitial ad */
  async prepareInterstitial(): Promise<void> {
    if (!this.admob) return;
    try {
      await this.admob.prepareInterstitial({
        adId: AD_CONFIG.INTERSTITIAL_ID,
        isTesting: true,
      });
      this.interstitialReady = true;
    } catch (err) {
      console.warn("[AdManager] Failed to prepare interstitial:", err);
      this.interstitialReady = false;
    }
  }

  /**
   * Show an interstitial ad (between levels).
   * Returns true if the ad was shown, false otherwise.
   */
  async showInterstitial(): Promise<boolean> {
    if (!this.admob || !this.interstitialReady) return false;
    try {
      await this.admob.showInterstitial();
      this.interstitialReady = false;
      // Pre-load the next one
      this.prepareInterstitial();
      return true;
    } catch (err) {
      console.warn("[AdManager] Interstitial show failed:", err);
      this.interstitialReady = false;
      this.prepareInterstitial();
      return false;
    }
  }

  /** Pre-load a rewarded ad */
  async prepareRewarded(): Promise<void> {
    if (!this.admob) return;
    try {
      await this.admob.prepareRewardVideoAd({
        adId: AD_CONFIG.REWARDED_ID,
        isTesting: true,
      });
      this.rewardedReady = true;
    } catch (err) {
      console.warn("[AdManager] Failed to prepare rewarded:", err);
      this.rewardedReady = false;
    }
  }

  /**
   * Show a rewarded ad (for hints).
   * Returns true if user completed the ad, false if skipped/failed.
   */
  async showRewarded(): Promise<boolean> {
    if (!this.admob || !this.rewardedReady) return false;
    try {
      await this.admob.showRewardVideoAd();
      this.rewardedReady = false;
      // Pre-load the next one
      this.prepareRewarded();
      return true;
    } catch (err) {
      console.warn("[AdManager] Rewarded show failed:", err);
      this.rewardedReady = false;
      this.prepareRewarded();
      return false;
    }
  }

  /** Whether ads are available on this platform */
  get enabled(): boolean {
    return this.admob !== null;
  }
}

export const adManager = new AdManager();
