export default defineNuxtPlugin(async () => {
  if (process.server) {
    return { provide: { purchases: null } };
  }

  const config = useRuntimeConfig().public;

  try {
    const cap = (window as any).Capacitor;
    if (!cap?.Plugins?.Purchases) {
      return { provide: { purchases: null } };
    }

    const Purchases = cap.Plugins.Purchases;
    const platform = cap.getPlatform?.() || 'web';

    if (platform !== 'ios' && platform !== 'android') {
      return { provide: { purchases: null } };
    }

    const apiKey = platform === 'ios'
      ? config.revenueCatAppleApiKey
      : config.revenueCatGoogleApiKey;

    if (!apiKey) {
      console.warn(`[CVR] RevenueCat: No API key for platform "${platform}"`);
      return { provide: { purchases: null } };
    }

    try {
      await Purchases.setLogLevel({ level: 'DEBUG' });
    } catch (e) {
      try { await Purchases.setDebugLogsEnabled({ enabled: true }); } catch (_) {}
    }

    await Purchases.configure({
      apiKey,
      appUserID: null,
    });

    console.log(`[CVR] RevenueCat configured for ${platform} with ${(apiKey as string).substring(0, 4)}... key`);

    return { provide: { purchases: Purchases } };
  } catch (error) {
    console.error('[CVR] RevenueCat initialization error:', error);
    return { provide: { purchases: null } };
  }
});
