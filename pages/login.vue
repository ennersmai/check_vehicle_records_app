<template>
  <div class="min-h-screen bg-white flex flex-col px-10">
    <div class="pt-8 pb-4">
      <button @click="handleBack" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center">
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
          inputmode="email"
          autocomplete="email"
          autocapitalize="none"
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
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          enterkeyhint="go"
          placeholder="Password"
          class="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          @keydown.enter.prevent="($event.target as HTMLInputElement).blur(); handleLogin()"
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
  </div>
</template>

<script setup lang="ts">
const { signIn } = useAuth();
const router = useRouter();
const route = useRoute();

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const handleBack = () => {
  router.push('/home');
};

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  const result = await signIn(username.value, password.value);
  
  loading.value = false;

  if (result.success) {
    const redirect = route.query.redirect as string;
    router.push(redirect || '/home');
  } else {
    error.value = result.error || 'Login failed';
  }
};
</script>
