// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  typescript: {
    typeCheck: false,
    strict: false,
    tsConfig: {
      compilerOptions: {
        strict: false,
        skipLibCheck: true
      }
    }
  },

  vite: {
    logLevel: 'error',
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      }
    },
    build: {
      rollupOptions: {
        external: [
          '@capacitor/core',
          '@capacitor/camera',
          '@capacitor-mlkit/text-recognition'
        ]
      }
    },
    optimizeDeps: {
      exclude: [
        '@capacitor/core',
        '@capacitor/camera',
        '@capacitor-mlkit/text-recognition'
      ]
    }
  },

  nitro: {
    preset: 'vercel'
  },

  css: ['~/assets/css/main.css'],

  experimental: {
    scanPageMeta: false
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      revenueCatGoogleApiKey: process.env.NUXT_PUBLIC_REVENUECAT_GOOGLE_API_KEY || '',
      revenueCatAppleApiKey: process.env.NUXT_PUBLIC_REVENUECAT_APPLE_API_KEY || '',
    }
  },

  app: {
    head: {
      title: 'CVR - Check Vehicle Records UK | Free Car History Check',
      htmlAttrs: {
        lang: 'en-GB'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'description', content: 'Check Vehicle Records UK - Get comprehensive vehicle history checks including MOT history, mileage verification, finance outstanding, stolen records & more. Free basic check, instant results.' },
        { name: 'keywords', content: 'vehicle check, car history check, UK vehicle check, MOT history, mileage check, finance check, stolen vehicle check, VRM lookup, number plate check, car check UK' },
        { name: 'author', content: 'Check Vehicle Records UK' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1' },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://checkvehiclerecords.co.uk/' },
        { property: 'og:title', content: 'CVR - Check Vehicle Records UK | Free Car History Check' },
        { property: 'og:description', content: 'Get comprehensive vehicle history checks including MOT history, mileage verification, finance outstanding, stolen records & more. Free basic check, instant results.' },
        { property: 'og:image', content: 'https://checkvehiclerecords.co.uk/cvr_logo.png' },
        { property: 'og:site_name', content: 'Check Vehicle Records UK' },
        { property: 'og:locale', content: 'en_GB' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://checkvehiclerecords.co.uk/' },
        { name: 'twitter:title', content: 'CVR - Check Vehicle Records UK | Free Car History Check' },
        { name: 'twitter:description', content: 'Get comprehensive vehicle history checks including MOT history, mileage verification, finance outstanding, stolen records & more.' },
        { name: 'twitter:image', content: 'https://checkvehiclerecords.co.uk/cvr_logo.png' },
        { name: 'twitter:site', content: '@checkvehiclerecordsuk' },
        // Theme color
        { name: 'theme-color', content: '#2563eb' },
        { name: 'msapplication-TileColor', content: '#2563eb' },
        // Canonical
        { name: 'canonical', content: 'https://checkvehiclerecords.co.uk/' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/main_icon.ico' },
        { rel: 'shortcut icon', href: '/main_icon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/cvr_logo512_mobile.png' },
        { rel: 'apple-touch-icon', sizes: '512x512', href: '/cvr_logo512_mobile.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: 'https://checkvehiclerecords.co.uk/' }
      ]
    }
  },

  compatibilityDate: '2025-12-27'
})