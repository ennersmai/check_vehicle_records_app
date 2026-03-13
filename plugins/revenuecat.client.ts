import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig().public;

  const platform = Capacitor.getPlatform();

  // Only initialise on native platforms
  if (platform !== 'ios' && platform !== 'android') {
    return { provide: { purchases: null } };
  }

  try {
    const apiKey = platform === 'ios'
      ? config.revenueCatAppleApiKey
      : config.revenueCatGoogleApiKey;

    if (!apiKey) {
      console.warn(`[CVR] RevenueCat: No API key for platform "${platform}"`);
      return { provide: { purchases: null } };
    }

    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });

    await Purchases.configure({
      apiKey,
      appUserID: null,
    });

    console.log(`[CVR] RevenueCat configured for ${platform} with ${(apiKey as string).substring(0, 4)}... key`);

    return {
      provide: {
        purchases: Purchases
      }
    };
  } catch (error) {
    console.error('[CVR] RevenueCat initialization error:', error);
    return { provide: { purchases: null } };
  }
});
