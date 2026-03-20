<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav v-if="isWeb" />

    <div class="flex flex-col items-center justify-center px-6 py-16 md:py-24">
      <img src="/cvr_logo.png" alt="Check Vehicle Records" class="w-64 mb-8" />

      <!-- Success state -->
      <div v-if="success" class="w-full max-w-sm text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Password Updated</h2>
        <p class="text-gray-600 mb-6">Your password has been successfully changed.</p>
        <PrimaryButton @click="goToLogin" class="w-full">
          GO TO LOGIN
        </PrimaryButton>
      </div>

      <!-- Error: no token / invalid link -->
      <div v-else-if="tokenError" class="w-full max-w-sm text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h2>
        <p class="text-gray-600 mb-6">This password reset link is invalid or has expired. Please request a new one.</p>
        <PrimaryButton @click="$router.push('/forgot-password')" class="w-full">
          REQUEST NEW LINK
        </PrimaryButton>
      </div>

      <!-- Reset form -->
      <div v-else class="w-full max-w-sm">
        <h2 class="text-xl font-bold text-gray-900 text-center mb-2">Set New Password</h2>
        <p class="text-gray-600 text-center mb-8">Enter your new password below.</p>

        <form @submit.prevent="handleReset" class="space-y-4">
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="New password"
              class="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>

          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="Confirm new password"
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <PrimaryButton type="submit" :loading="loading" class="w-full">
            RESET PASSWORD
          </PrimaryButton>
        </form>

        <div v-if="error" class="mt-4 text-red-600 text-sm text-center">
          {{ error }}
        </div>
      </div>
    </div>

    <WebFooter v-if="isWeb" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const supabase = useSupabaseClient();
const { updatePassword } = useAuth();

const isWeb = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref(false);
const tokenError = ref(false);

onMounted(async () => {
  isWeb.value = !(window as any).Capacitor?.isNativePlatform?.();

  // Supabase sends the user to this page with hash fragments containing access_token
  // The Supabase client auto-detects the hash and sets the session
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get('access_token');
  const type = hashParams.get('type');

  if (type === 'recovery' && accessToken) {
    // Supabase JS client should pick up the token automatically from the URL hash
    // Verify the session was established
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      tokenError.value = true;
    }
  } else {
    // Also check if we already have a session (Supabase may have auto-parsed it)
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      tokenError.value = true;
    }
  }
});

const handleReset = async () => {
  error.value = '';

  if (!newPassword.value || newPassword.value.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  loading.value = true;

  const result = await updatePassword(newPassword.value);
  loading.value = false;

  if (result.success) {
    success.value = true;
  } else {
    error.value = result.error || 'Failed to update password. The link may have expired.';
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>
