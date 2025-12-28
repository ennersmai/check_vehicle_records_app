<template>
  <div class="min-h-screen bg-white">
    <div class="px-10 py-4">
      <button @click="$router.push('/login')" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="flex flex-col items-center justify-center px-10 mt-12">
      <img src="/cvr_logo.png" alt="Check Vehicle Records" class="w-64 mb-12" />
      
      <div class="mb-8">
        <svg 
          class="w-20 h-20 mx-auto text-gray-700"
          :class="{ 'animate-bounce': isAnimating }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        Please check your email
      </h2>

      <p class="text-center text-gray-600 mb-8 max-w-sm">
        We've sent a verification link to your registered email address. Follow the instructions to activate your account.
      </p>

      <PrimaryButton @click="$router.push('/login')" class="w-full max-w-sm">
        LOGIN
      </PrimaryButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const isAnimating = ref(true);

onMounted(() => {
  setInterval(() => {
    isAnimating.value = !isAnimating.value;
  }, 1000);
});
</script>
