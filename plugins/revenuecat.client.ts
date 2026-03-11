export default defineNuxtPlugin(async () => {
  // Skip on server-side rendering - this prevents SSR errors
  if (process.server) {
    return {
      provide: {
        purchases: null
      }
    };
  }

  const config = useRuntimeConfig().public;

  try {
    // Access RevenueCat through Capacitor's global plugin registry
    const cap = (window as any).Capacitor;
    if (cap?.Plugins?.Purchases) {
      const Purchases = cap.Plugins.Purchases;
      
      // Use the correct API key based on platform
      const platform = cap.getPlatform?.() || 'web';
      const apiKey = platform === 'ios'
        ? config.revenueCatAppleApiKey
        : config.revenueCatGoogleApiKey;

      if (!apiKey) {
        console.warn(`RevenueCat: No API key for platform "${platform}"`);
        return { provide: { purchases: null } };
      }

      // Configure RevenueCat with platform-specific key
      await Purchases.configure({
        apiKey,
        appUserID: null,
      });

      console.log(`RevenueCat configured for ${platform} with ${(apiKey as string).substring(0, 4)}... key`);

      return {
        provide: {
          purchases: Purchases
        }
      };
    }

    return {
      provide: {
        purchases: null
      }
    };
  } catch (error) {
    console.error('RevenueCat initialization error:', error);
    return {
      provide: {
        purchases: null
      }
    };
  }
});
