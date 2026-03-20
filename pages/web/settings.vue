<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <section class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 class="text-3xl font-bold text-primary mb-2">Settings</h1>
      <p class="text-gray-500 mb-10">Manage your personal details and account information.</p>

      <!-- Not Logged In -->
      <div v-if="!user" class="text-center py-20">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <p class="text-gray-500 mb-4">Log in to manage your settings</p>
        <NuxtLink to="/login?redirect=/web/settings" class="text-primary font-medium hover:underline">Log In</NuxtLink>
      </div>

      <div v-else>
        <form @submit.prevent="handleSave" class="space-y-8">
          <!-- Personal Details -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Personal details</h3>
            <div class="grid grid-cols-2 gap-4">
              <input
                v-model="form.firstName"
                type="text"
                placeholder="First Name"
                class="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
              <input
                v-model="form.lastName"
                type="text"
                placeholder="Last Name"
                class="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
            </div>
          </div>

          <!-- Address -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Address</h3>
            <div class="space-y-3">
              <input
                v-model="form.addressLine1"
                type="text"
                placeholder="Address Line 1"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
              <input
                v-model="form.addressLine2"
                type="text"
                placeholder="Address Line 2"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
              <input
                v-model="form.postcode"
                type="text"
                placeholder="Postcode"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
            </div>
          </div>

          <!-- Account -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Account</h3>
            <div class="space-y-3">
              <input
                v-model="form.username"
                type="text"
                placeholder="Username"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
              <input
                v-model="form.email"
                type="email"
                placeholder="Email"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-gray-50"
                disabled
              />
            </div>
          </div>

          <!-- Change Password -->
          <div>
            <button
              type="button"
              @click="showChangePassword = !showChangePassword"
              class="text-sm text-primary hover:underline font-medium"
            >
              Change password
            </button>
            <div v-if="showChangePassword" class="mt-3 space-y-3">
              <input
                v-model="newPassword"
                type="password"
                placeholder="New password"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
              />
              <button
                type="button"
                @click="handleChangePassword"
                :disabled="changingPassword"
                class="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-link transition disabled:opacity-50"
              >
                {{ changingPassword ? 'Updating...' : 'Update Password' }}
              </button>
            </div>
          </div>

          <!-- Save Button -->
          <button
            type="submit"
            :disabled="saving"
            class="w-full bg-primary text-white py-3.5 rounded-lg font-bold text-sm tracking-wider hover:bg-primary-link transition disabled:opacity-50"
          >
            {{ saving ? 'SAVING...' : 'SAVE CHANGES' }}
          </button>

          <p v-if="successMessage" class="text-green-600 text-sm text-center">{{ successMessage }}</p>
          <p v-if="errorMessage" class="text-red-600 text-sm text-center">{{ errorMessage }}</p>
        </form>

        <!-- Danger Zone -->
        <div class="mt-16 pt-8 border-t border-gray-200">
          <h3 class="text-sm font-semibold text-red-600 mb-4 uppercase tracking-wider">Danger Zone</h3>
          <div class="bg-red-50 border border-red-200 rounded-xl p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-semibold text-gray-900 text-sm">Delete Account</p>
                <p class="text-xs text-gray-500 mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
              </div>
              <button
                @click="showDeleteModal = true"
                class="flex-shrink-0 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Delete Account Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6" @click.self="showDeleteModal = false">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div class="text-center mb-4">
          <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Delete Account</h3>
          <p class="text-sm text-gray-500 mt-2">This will permanently delete your account and all associated data. This action cannot be undone.</p>
        </div>
        <div v-if="deleteError" class="text-red-600 text-sm mb-4 text-center">{{ deleteError }}</div>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false" class="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium">Cancel</button>
          <button @click="handleDeleteAccount" :disabled="deletingAccount" class="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {{ deletingAccount ? 'Deleting...' : 'Delete Forever' }}
          </button>
        </div>
      </div>
    </div>

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const supabase = useSupabaseClient();
const { user, signOut, updatePassword, deleteAccount } = useAuth();

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
const errorMessage = ref('');
const showChangePassword = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const changingPassword = ref(false);
const showDeleteModal = ref(false);
const deletingAccount = ref(false);
const deleteError = ref('');

const handleSave = async () => {
  saving.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    if (user.value) {
      const { error: updateError } = await (supabase as any)
        .from('profiles')
        .upsert({
          id: user.value.id,
          first_name: form.value.firstName,
          last_name: form.value.lastName,
          address_line1: form.value.addressLine1,
          address_line2: form.value.addressLine2,
          postcode: form.value.postcode,
          username: form.value.username,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;
    }

    successMessage.value = 'Changes saved successfully';
    setTimeout(() => { successMessage.value = ''; }, 3000);
  } catch (err) {
    errorMessage.value = 'Failed to save changes';
  } finally {
    saving.value = false;
  }
};

const handleChangePassword = async () => {
  if (!newPassword.value || newPassword.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters';
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  changingPassword.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  const result = await updatePassword(newPassword.value);
  changingPassword.value = false;

  if (result.success) {
    successMessage.value = 'Password updated successfully';
    newPassword.value = '';
    confirmPassword.value = '';
    showChangePassword.value = false;
    setTimeout(() => { successMessage.value = ''; }, 3000);
  } else {
    errorMessage.value = result.error || 'Failed to update password';
  }
};

const handleDeleteAccount = async () => {
  deletingAccount.value = true;
  deleteError.value = '';

  const result = await deleteAccount();
  deletingAccount.value = false;

  if (result.success) {
    showDeleteModal.value = false;
    router.push('/landing');
  } else {
    deleteError.value = result.error || 'Failed to delete account. Please contact support.';
  }
};
</script>
