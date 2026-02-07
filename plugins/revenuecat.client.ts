export default defineNuxtPlugin(async () => {
  // Skip on server-side rendering - this prevents SSR errors
  if (process.server) {
    return {
      provide: {
        purchases: null
      }
    };
  }

  const apiKey = useRuntimeConfig().public.revenueCatApiKey;

  // Skip if no API key configured (web mode)
  if (!apiKey) {
    console.log('RevenueCat API key not configured, skipping initialization');
    return {
      provide: {
        purchases: null
      }
    };
  }

  try {
    // Access RevenueCat through Capacitor's global plugin registry
    const cap = (window as any).Capacitor;
    if (cap?.Plugins?.Purchases) {
      const Purchases = cap.Plugins.Purchases;
      
      // Configure RevenueCat
      await Purchases.configure({
        apiKey,
        appUserID: null,
      });

      console.log('RevenueCat configured successfully');

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
