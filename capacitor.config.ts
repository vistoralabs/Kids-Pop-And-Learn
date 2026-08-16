import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kidspopandlearn.app",
  appName: "Kids Pop & Learn",
  webDir: "www",
  android: {
    // Keep the game fully offline inside the app.
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
