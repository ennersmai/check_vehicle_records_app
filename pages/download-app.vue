<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <!-- Download App Section -->
    <section class="py-16 md:py-24 bg-gray-50 min-h-[70vh] flex items-center">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Get <span class="text-primary">Check Vehicle Records</span> App
        </h1>
        <p class="text-gray-500 mb-10">
          We will send you a link, open it on your phone to<br class="hidden sm:block" />
          download the app.
        </p>

        <!-- Platform Selector -->
        <div class="flex justify-center gap-8 mb-8">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              v-model="platform"
              value="android"
              class="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
            />
            <span class="text-gray-700 font-medium group-hover:text-primary transition">Android</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              v-model="platform"
              value="ios"
              class="w-5 h-5 text-primary border-gray-300 focus:ring-primary"
            />
            <span class="text-gray-700 font-medium group-hover:text-primary transition">iOS</span>
          </label>
        </div>

        <!-- Email Input + Send Button -->
        <div class="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-4">
          <input
            v-model="email"
            type="email"
            placeholder="Your Email Address"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            @keydown.enter.prevent="shareAppLink"
          />
          <button
            @click="shareAppLink"
            :disabled="sending"
            class="bg-primary hover:bg-primary-link text-white font-bold text-sm tracking-wider px-8 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {{ sending ? 'SENDING...' : 'SHARE APP LINK' }}
          </button>
        </div>

        <!-- Status Messages -->
        <p v-if="successMessage" class="text-green-600 text-sm mb-6">{{ successMessage }}</p>
        <p v-if="errorMessage" class="text-red-600 text-sm mb-6">{{ errorMessage }}</p>

        <!-- Divider -->
        <p class="text-gray-400 text-sm mb-8 mt-8">Download App From</p>

        <!-- Store Badges -->
        <AppStoreBadges />
      </div>
    </section>

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
});

const platform = ref<'android' | 'ios'>('android');
const email = ref('');
const sending = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.cvr.app';
const APP_STORE_URL = 'https://apps.apple.com/app/check-vehicle-records/id6758524961';

const shareAppLink = async () => {
  successMessage.value = '';
  errorMessage.value = '';

  if (!email.value || !email.value.includes('@')) {
    errorMessage.value = 'Please enter a valid email address.';
    return;
  }

  sending.value = true;

  try {
    const supabase = useSupabaseClient();
    const appLink = platform.value === 'android' ? GOOGLE_PLAY_URL : APP_STORE_URL;
    const storeName = platform.value === 'android' ? 'Google Play' : 'App Store';

    const { error } = await (supabase as any).functions.invoke('send-app-link', {
      body: {
        email: email.value,
        platform: platform.value,
        appLink,
        storeName,
      }
    });

    if (error) throw error;

    successMessage.value = `App link sent to ${email.value}! Check your inbox.`;
    email.value = '';
  } catch (err: any) {
    console.error('Failed to send app link:', err);
    errorMessage.value = err.message || 'Failed to send email. Please try again.';
  } finally {
    sending.value = false;
  }
};
</script>
