import { App } from "@capacitor/app";

type BackHandler = () => boolean | void;

let currentHandler: BackHandler | null = null;
let initialized = false;

/**
 * Register a priority back button handler (e.g. for gameplay exit confirmation).
 * Return `true` or handle the action to consume the event.
 */
export function registerBackHandler(handler: BackHandler): () => void {
  currentHandler = handler;
  return () => {
    if (currentHandler === handler) {
      currentHandler = null;
    }
  };
}

/**
 * Initialize Capacitor native Android back button and web popstate listeners.
 */
export function initBackButton(onDefaultBack: () => void) {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  try {
    App.addListener("backButton", () => {
      if (currentHandler) {
        const handled = currentHandler();
        if (handled !== false) return;
      }
      onDefaultBack();
    });
  } catch {
    /* Not in native Capacitor environment */
  }

  // Web popstate fallback
  window.addEventListener("popstate", () => {
    if (currentHandler) {
      currentHandler();
    }
  });
}
