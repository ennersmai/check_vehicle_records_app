<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center px-10">
    <img src="/cvr_logo.png" alt="Check Vehicle Records" class="w-64 mb-12" />
    
    <form @submit.prevent="handleLogin" class="w-full max-w-sm space-y-4">
      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <input
          v-model="username"
          type="email"
          placeholder="Email"
          class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>

      <div class="relative">
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>

      <div class="text-left">
        <NuxtLink to="/forgot-password" class="text-sm text-gray-600 hover:text-gray-900">
          Forgot password?
        </NuxtLink>
      </div>

      <PrimaryButton type="submit" :loading="loading" class="w-full">
        LOGIN
      </PrimaryButton>

      <div class="text-center pt-4">
        <NuxtLink to="/create-account" class="text-primary-link font-medium">
          Create account
        </NuxtLink>
      </div>
    </form>

    <div v-if="error" class="mt-4 text-red-600 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { signIn } = useAuth();
const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  const result = await signIn(username.value, password.value);
  
  loading.value = false;

  if (result.success) {
    router.push('/home');
  } else {
    error.value = result.error || 'Login failed';
  }
};
</script>
