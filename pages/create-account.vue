<template>
  <div class="min-h-screen bg-white pb-20">
    <div class="px-10 py-4">
      <button @click="$router.back()" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="flex flex-col items-center px-10 mt-8">
      <img src="/cvr_logo.png" alt="Check Vehicle Records" class="w-64 mb-6" />
      
      <p class="text-center text-gray-600 mb-8">
        Create your account to access vehicle details
      </p>

      <form @submit.prevent="handleSignup" class="w-full max-w-sm space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-900 mb-1">First name</label>
          <input
            v-model="form.firstName"
            type="text"
            placeholder="John"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 mb-1">Surname</label>
          <input
            v-model="form.surname"
            type="text"
            placeholder="Doe"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 mb-1">Address</label>
          <input
            v-model="form.addressLine1"
            type="text"
            placeholder="Address Line 1"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary mb-2"
          />
          <input
            v-model="form.addressLine2"
            type="text"
            placeholder="Address Line 2"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary mb-2"
          />
          <input
            v-model="form.postcode"
            type="text"
            placeholder="Postcode"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 mb-1">Username</label>
          <input
            v-model="form.username"
            type="text"
            placeholder="Username"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@example.com"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-900 mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••"
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>

        <PrimaryButton type="submit" :loading="loading" class="w-full mt-6">
          CREATE ACCOUNT
        </PrimaryButton>

        <div class="text-center pt-2">
          <span class="text-sm text-gray-600">Already have an account? </span>
          <NuxtLink to="/login" class="text-sm text-primary font-medium hover:underline">
            Log in
          </NuxtLink>
        </div>
      </form>

      <div v-if="error" class="mt-4 text-red-600 text-sm text-center">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signUp } = useAuth();
const router = useRouter();

const form = ref({
  firstName: '',
  surname: '',
  addressLine1: '',
  addressLine2: '',
  postcode: '',
  username: '',
  email: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

const handleSignup = async () => {
  error.value = '';
  loading.value = true;

  const fullName = `${form.value.firstName} ${form.value.surname}`;
  const result = await signUp(form.value.email, form.value.password, fullName);
  
  loading.value = false;

  if (result.success) {
    router.push('/verify-email');
  } else {
    error.value = result.error || 'Signup failed';
  }
};
</script>
