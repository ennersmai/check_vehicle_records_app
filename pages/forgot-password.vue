<template>
  <div class="min-h-screen bg-white">
    <div class="px-10 py-4">
      <button @click="$router.back()" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="flex flex-col items-center justify-center px-10 mt-12">
      <img src="/cvr_logo.png" alt="Check Vehicle Records" class="w-64 mb-8" />
      
      <p class="text-center text-gray-600 mb-8 max-w-sm">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form @submit.prevent="handleReset" class="w-full max-w-sm space-y-6">
        <div class="relative">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            v-model="email"
            type="email"
            placeholder="Email address"
            class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <PrimaryButton type="submit" :loading="loading" class="w-full">
          RETRIEVE LOGIN DETAILS
        </PrimaryButton>
      </form>

      <div v-if="success" class="mt-4 text-green-600 text-sm text-center">
        Password reset link sent! Check your email.
      </div>
      <div v-if="error" class="mt-4 text-red-600 text-sm text-center">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { resetPassword } = useAuth();

const email = ref('');
const loading = ref(false);
const success = ref(false);
const error = ref('');

const handleReset = async () => {
  error.value = '';
  success.value = false;
  loading.value = true;

  const result = await resetPassword(email.value);
  
  loading.value = false;

  if (result.success) {
    success.value = true;
  } else {
    error.value = result.error || 'Failed to send reset link';
  }
};
</script>
