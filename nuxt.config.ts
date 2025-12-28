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
    strict: false
  },

  vite: {
    logLevel: 'error'
  },

  css: ['~/assets/css/main.css'],

  experimental: {
    scanPageMeta: false
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    }
  },

  app: {
    head: {
      title: 'CVR - Vehicle Check',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'Check Vehicle Records - UK Vehicle History Checks' }
      ]
    }
  },

  compatibilityDate: '2025-12-27'
})