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

    <div class="px-10 mt-8">
      <h1 class="text-3xl font-bold text-primary mb-2">Settings</h1>
      <p class="text-gray-600 mb-8">Manage your personal details<br />and account information</p>

      <form @submit.prevent="handleSave" class="space-y-6">
        <!-- Personal Details -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Personal details</h3>
          <div class="grid grid-cols-2 gap-3">
            <input
              v-model="form.firstName"
              type="text"
              placeholder="John"
              class="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
            <input
              v-model="form.lastName"
              type="text"
              placeholder="Doe"
              class="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        <!-- Address -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Adress</h3>
          <div class="space-y-3">
            <input
              v-model="form.addressLine1"
              type="text"
              placeholder="Adress Line 1"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
            <input
              v-model="form.addressLine2"
              type="text"
              placeholder="Adress Line 2"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
            <input
              v-model="form.postcode"
              type="text"
              placeholder="Postcode"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        <!-- Account -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Account</h3>
          <div class="space-y-3">
            <input
              v-model="form.username"
              type="text"
              placeholder="Username"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
            <input
              v-model="form.email"
              type="email"
              placeholder="Email"
              class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
            />
            <button 
              type="button"
              @click="showChangePassword = true"
              class="text-sm text-gray-700 underline"
            >
              Change password
            </button>
          </div>
        </div>

        <PrimaryButton type="submit" :loading="saving" class="w-full">
          SAVE CHANGES
        </PrimaryButton>

        <div v-if="successMessage" class="text-green-600 text-sm text-center">
          {{ successMessage }}
        </div>
        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>
      </form>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const { user } = useAuth();

const form = ref({
  firstName: '',
  lastName: '',
  addressLine1: '',
  addressLine2: '',
  postcode: '',
  username: '',
  email: user.value?.email || ''
});

const saving = ref(false);
const successMessage = ref('');
const error = ref('');
const showChangePassword = ref(false);

const handleSave = async () => {
  saving.value = true;
  successMessage.value = '';
  error.value = '';

  try {
    // Save to Supabase profiles table
    const supabase = useSupabaseClient();
    const { user } = useAuth();
    
    if (user.value) {
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.value.id,
          notifications_enabled: notificationsEnabled.value,
          email_updates: emailUpdates.value,
          dark_mode: darkMode.value,
          updated_at: new Date().toISOString()
        });
      
      if (updateError) throw updateError;
    }
    
    successMessage.value = 'Changes saved successfully';
  } catch (err) {
    error.value = 'Failed to save changes';
  } finally {
    saving.value = false;
  }
};
</script>
