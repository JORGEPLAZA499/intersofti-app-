import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.intersofti.esim",
  appName: "eSIM",
  webDir: "dist",
  plugins: {
    SafeArea: {
      // Detect viewport-fit=cover and inject --safe-area-inset-bottom etc.
      detectViewportFitCoverChanges: true,
      initialViewportFitCover: true,
      // Dark icons on light background for the Android nav bar.
      navigationBarStyle: "LIGHT",
    },
  },
};

export default config;